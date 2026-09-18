import { GoogleGenAI } from "@google/genai";

/**
 * Gemini API key pool.
 *
 * `GEMINI_API_KEYS` env var holds MULTIPLE keys (comma OR newline separated).
 * Requests walk the pool round-robin (each one starts at the key after the
 * previous request's), skipping cooling keys; on a rate-limit / quota / transient
 * error the request fails over to another key. Failures are remembered per key
 * (cool-down) so the next request skips them, backoff is capped, and the whole
 * failover has a hard deadline — a Gemini "overloaded" wave must answer with a
 * fast 503 to the client, never a ten-minute spinner. Keys never leave the
 * server and are never logged in full.
 */

export class AllKeysExhaustedError extends Error {
  constructor(message = "All Gemini API keys are exhausted or unavailable") {
    super(message);
    this.name = "AllKeysExhaustedError";
  }
}

export class NoKeysConfiguredError extends Error {
  constructor(message = "GEMINI_API_KEYS is not configured") {
    super(message);
    this.name = "NoKeysConfiguredError";
  }
}

/** Tunables (env overrides for the range PC / Railway). */
const num = (v: string | undefined, d: number) => (Number(v) > 0 ? Number(v) : d);
/** Per-attempt HTTP timeout. */
export const ATTEMPT_TIMEOUT_MS = num(process.env.GEMINI_ATTEMPT_TIMEOUT_MS, 25_000);
/** Whole failover budget (all keys, all backoffs). Must stay under the client's fetch timeout. */
export const TOTAL_DEADLINE_MS = num(process.env.GEMINI_DEADLINE_MS, 45_000);
/**
 * Max keys tried per request. Gemini's free-tier quota is per MINUTE and a
 * 429 comes back in ~150 ms, so with a large pool it is worth walking further
 * before giving up: at 6 attempts a 35-key pool answered 503 while two dozen
 * keys were still usable. The total deadline still bounds the wait.
 */
const MAX_ATTEMPTS = Math.floor(num(process.env.GEMINI_MAX_ATTEMPTS, 12));
const BACKOFF_CAP_MS = 2_000;
/**
 * Cool-downs after a failure, by kind. Only `quota` and `invalid` are the KEY's
 * fault; a 503/504 from Gemini says nothing about the key, so parking it for
 * half a minute used to collapse the whole pool under load (a burst of 12
 * parallel turns left 30 of 35 keys cooling on server-side timeouts alone).
 */
const COOLDOWN_MS = {
  quota: 60_000,
  /** Daily (RPD) quota — the key is done until Google's reset, not in a minute. */
  quota_day: 3 * 60 * 60_000,
  overloaded: 8_000,
  invalid: 30 * 60_000,
  timeout: 5_000,
} as const;
/** Never park more than this share of the pool — the rest stay available. */
const MAX_COOLING_SHARE = 0.5;

let cachedKeys: string[] | null = null;
const clientCache = new Map<string, GoogleGenAI>();
/** key → epoch ms until which the key is skipped. */
const coolingUntil = new Map<string, number>();
/** key → why it is cooling. Only "soft" reasons (the server's fault) may be released early. */
const coolingKind = new Map<string, CoolKind>();
const stats = { requests: 0, failovers: 0, exhausted: 0, lastError: "" };

export function loadKeys(): string[] {
  if (cachedKeys) return cachedKeys;
  const raw = process.env.GEMINI_API_KEYS ?? "";
  const keys = Array.from(
    new Set(
      raw
        .split(/[\s,]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
    )
  );
  cachedKeys = keys;
  return keys;
}

function clientFor(key: string): GoogleGenAI {
  let client = clientCache.get(key);
  if (!client) {
    client = new GoogleGenAI({ apiKey: key, httpOptions: { timeout: ATTEMPT_TIMEOUT_MS } });
    clientCache.set(key, client);
  }
  return client;
}

function maskKey(key: string): string {
  return key.length <= 6 ? "***" : `${key.slice(0, 4)}…${key.slice(-2)}`;
}

/** Round-robin cursor: the next request starts at the key after the last one used. */
let cursor = 0;

/**
 * Pick the next healthy key not in `exclude`, walking the pool in order from
 * the cursor — every request goes to a different key, so a free-tier per-key
 * rate limit is spread across the whole pool instead of being hit twice in a
 * row by chance (which is what random picking did). If every key is cooling,
 * fall back to the one that recovers soonest.
 */
export function pickKey(keys: string[], exclude: Set<string>): string | null {
  const now = Date.now();
  if (keys.length === 0) return null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[(cursor + i) % keys.length];
    if (exclude.has(key)) continue;
    if ((coolingUntil.get(key) ?? 0) > now) continue;
    cursor = (cursor + i + 1) % keys.length;
    return key;
  }

  const candidates = keys.filter((k) => !exclude.has(k));
  if (candidates.length === 0) return null;
  return candidates.slice().sort((a, b) => (coolingUntil.get(a) ?? 0) - (coolingUntil.get(b) ?? 0))[0];
}

/**
 * Park a key after a failure, keeping at least half the pool selectable: when
 * the cap is reached the keys that recover soonest are released early, so a
 * wave of server-side errors can never take the whole pool out of service.
 */
export function coolKey(key: string, kind: CoolKind, keys = loadKeys()): void {
  const now = Date.now();
  coolingUntil.set(key, now + COOLDOWN_MS[kind]);
  coolingKind.set(key, kind);

  // Only keys parked for a server-side hiccup may be released early: a key that
  // really is out of quota would just answer 429 again and waste an attempt.
  const maxCooling = Math.max(1, Math.floor(keys.length * MAX_COOLING_SHARE));
  const cooling = keys.filter((k) => (coolingUntil.get(k) ?? 0) > now);
  const releasable = cooling
    .filter((k) => coolingKind.get(k) === "overloaded" || coolingKind.get(k) === "timeout")
    .sort((a, b) => (coolingUntil.get(a) ?? 0) - (coolingUntil.get(b) ?? 0));
  for (let i = 0; i < Math.min(releasable.length, cooling.length - maxCooling); i++) {
    coolingUntil.delete(releasable[i]);
    coolingKind.delete(releasable[i]);
  }
}

/** Test seam: reset the pool's in-memory state. */
export function __resetPool() {
  cursor = 0;
  coolingUntil.clear();
  coolingKind.clear();
  cachedKeys = null;
}

type FailKind = "quota" | "overloaded" | "invalid" | "timeout" | "fatal";
/** What a key is parked for. `quota_day` is a daily limit, not a per-minute one. */
export type CoolKind = Exclude<FailKind, "fatal"> | "quota_day";

/**
 * A 429 can mean "too many requests this minute" or "this key is done for the
 * day" — Google says which in the quota metric / retry delay. Parking a daily
 * exhaustion for 60 s makes every later request waste attempts on a dead key.
 */
export function quotaScope(err: unknown): "minute" | "day" {
  const msg = (err as { message?: string })?.message ?? String(err);
  return /per\s*day|perday|daily limit|requests per day|PerDayPer/i.test(msg) ? "day" : "minute";
}

/** Classify an error: what it means for THIS key and whether another key may succeed. */
export function classifyKeyError(err: unknown): FailKind {
  const anyErr = err as { status?: number; code?: number; message?: string; name?: string };
  const status = anyErr?.status ?? anyErr?.code;
  const msg = (anyErr?.message ?? String(err)).toUpperCase();
  if (anyErr?.name === "AbortError" || msg.includes("TIMEOUT") || msg.includes("TIMED OUT") || msg.includes("ETIMEDOUT") || msg.includes("ECONNRESET") || msg.includes("FETCH FAILED")) return "timeout";
  if (status === 429 || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("QUOTA") || /\bRATE[ _-]?LIMIT/.test(msg) || msg.includes(" 429")) return "quota";
  if (status === 503 || status === 500 || status === 502 || status === 504 || msg.includes("UNAVAILABLE") || msg.includes("OVERLOADED") || msg.includes("INTERNAL") || msg.includes(" 503") || msg.includes(" 500")) return "overloaded";
  if (msg.includes("API_KEY_INVALID") || msg.includes("API KEY NOT VALID") || msg.includes("PERMISSION_DENIED") || msg.includes("API KEY EXPIRED") || msg.includes("CONSUMER_SUSPENDED") || status === 401 || status === 403) return "invalid";
  return "fatal";
}

/** Kept for callers that only need a boolean. */
export function isRetriableKeyError(err: unknown): boolean {
  return classifyKeyError(err) !== "fatal";
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FailoverOptions {
  maxRetries?: number;
  /** Override the total budget (ms). */
  deadlineMs?: number;
}

/**
 * Execute `fn` with the next healthy Gemini client in round-robin order. On a retriable
 * error rotate to another key (cooling the failed one). `fn` MUST establish the
 * work (including pulling the first stream chunk) so a 429 surfaces here.
 * `fn` receives `overloaded = true` once a 503 wave has been seen, so callers
 * can switch to a lighter fallback model for the remaining attempts.
 */
export async function withKeyFailover<T>(
  fn: (ai: GoogleGenAI, key: string, ctx: { attempt: number; overloaded: boolean }) => Promise<T>,
  opts: FailoverOptions = {}
): Promise<T> {
  const keys = loadKeys();
  if (keys.length === 0) throw new NoKeysConfiguredError();

  const maxRetries = Math.max(1, Math.min(opts.maxRetries ?? MAX_ATTEMPTS, keys.length));
  const deadline = Date.now() + (opts.deadlineMs ?? TOTAL_DEADLINE_MS);
  const tried = new Set<string>();
  let lastErr: unknown;
  let overloaded = false;
  stats.requests++;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const key = pickKey(keys, tried);
    if (!key) break;
    tried.add(key);
    try {
      return await fn(clientFor(key), key, { attempt, overloaded });
    } catch (err) {
      lastErr = err;
      const kind = classifyKeyError(err);
      if (kind === "fatal") throw err;
      stats.failovers++;
      stats.lastError = `${kind}: ${(err as Error)?.message?.slice(0, 300) ?? String(err)}`;
      coolKey(key, kind === "quota" && quotaScope(err) === "day" ? "quota_day" : kind, keys);
      if (kind === "overloaded") overloaded = true;
      console.warn(`[gemini] key ${maskKey(key)} ${kind}; rotating. attempt ${attempt + 1}/${maxRetries}`);
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      // Capped, jittered backoff for server-side overload; immediate rotation otherwise.
      if (kind === "overloaded") {
        const wait = Math.min(BACKOFF_CAP_MS, 150 * Math.pow(2, attempt)) * (0.7 + Math.random() * 0.6);
        if (wait >= remaining) break;
        await delay(wait);
      }
    }
  }

  stats.exhausted++;
  throw new AllKeysExhaustedError(lastErr instanceof Error ? lastErr.message : undefined);
}

/** Masked pool health for /api/health (no key material). */
export function poolHealth() {
  const now = Date.now();
  const keys = loadKeys();
  const cooling = keys.filter((k) => (coolingUntil.get(k) ?? 0) > now).length;
  const coolingByKind = { quota: 0, quota_day: 0, overloaded: 0, invalid: 0, timeout: 0 };
  for (const k of keys) {
    if ((coolingUntil.get(k) ?? 0) <= now) continue;
    const kind = coolingKind.get(k);
    if (kind) coolingByKind[kind]++;
  }
  return {
    keys: keys.length,
    healthy: keys.length - cooling,
    cooling,
    coolingByKind,
    attemptTimeoutMs: ATTEMPT_TIMEOUT_MS,
    deadlineMs: TOTAL_DEADLINE_MS,
    ...stats,
  };
}
