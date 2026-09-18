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
/** Max keys tried per request. */
const MAX_ATTEMPTS = Math.floor(num(process.env.GEMINI_MAX_ATTEMPTS, 6));
const BACKOFF_CAP_MS = 2_000;
/** Cool-downs after a failure, by kind. */
const COOLDOWN_MS = { quota: 60_000, overloaded: 15_000, invalid: 30 * 60_000, timeout: 30_000 } as const;

let cachedKeys: string[] | null = null;
const clientCache = new Map<string, GoogleGenAI>();
/** key → epoch ms until which the key is skipped. */
const coolingUntil = new Map<string, number>();
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

/** Test seam: reset the pool's in-memory state. */
export function __resetPool() {
  cursor = 0;
  coolingUntil.clear();
  cachedKeys = null;
}

type FailKind = "quota" | "overloaded" | "invalid" | "timeout" | "fatal";

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
      stats.lastError = `${kind}: ${(err as Error)?.message?.slice(0, 120) ?? String(err)}`;
      coolingUntil.set(key, Date.now() + COOLDOWN_MS[kind]);
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
  return {
    keys: keys.length,
    healthy: keys.length - cooling,
    cooling,
    attemptTimeoutMs: ATTEMPT_TIMEOUT_MS,
    deadlineMs: TOTAL_DEADLINE_MS,
    ...stats,
  };
}
