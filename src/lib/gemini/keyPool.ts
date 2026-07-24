import { GoogleGenAI } from "@google/genai";

/**
 * Gemini API key pool.
 *
 * `GEMINI_API_KEYS` env var holds MULTIPLE keys (comma OR newline separated).
 * Each request picks a RANDOM key; on a rate-limit / quota / transient error the
 * request fails over to another (untried) key. Keys never leave the server and
 * are never logged in full.
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

let cachedKeys: string[] | null = null;
const clientCache = new Map<string, GoogleGenAI>();

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
    client = new GoogleGenAI({ apiKey: key });
    clientCache.set(key, client);
  }
  return client;
}

function maskKey(key: string): string {
  return key.length <= 6 ? "***" : `${key.slice(0, 4)}…${key.slice(-2)}`;
}

/** Pick a random key that is not in `exclude`. */
function pickKey(keys: string[], exclude: Set<string>): string | null {
  const available = keys.filter((k) => !exclude.has(k));
  if (available.length === 0) return null;
  // index derived without Date.now/Math.random restrictions in scripts — here in
  // a Node runtime Math.random is available and fine.
  const idx = Math.floor(Math.random() * available.length);
  return available[idx];
}

export function isRetriableKeyError(err: unknown): boolean {
  const anyErr = err as { status?: number; code?: number; message?: string };
  const status = anyErr?.status ?? anyErr?.code;
  if (status === 429 || status === 503 || status === 500) return true;
  const msg = (anyErr?.message ?? String(err)).toUpperCase();
  return (
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("QUOTA") ||
    msg.includes("RATE") ||
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("OVERLOADED") ||
    msg.includes("INTERNAL")
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FailoverOptions {
  maxRetries?: number;
}

/**
 * Execute `fn` with a randomly-picked Gemini client. On a retriable error rotate
 * to another untried key. `fn` MUST establish the work (including pulling the
 * first stream chunk) so a 429 surfaces here and can be retried before any bytes
 * reach the client.
 */
export async function withKeyFailover<T>(
  fn: (ai: GoogleGenAI, key: string) => Promise<T>,
  opts: FailoverOptions = {}
): Promise<T> {
  const keys = loadKeys();
  if (keys.length === 0) throw new NoKeysConfiguredError();

  const maxRetries = Math.min(opts.maxRetries ?? keys.length, keys.length);
  const tried = new Set<string>();
  let lastErr: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const key = pickKey(keys, tried);
    if (!key) break;
    tried.add(key);
    try {
      return await fn(clientFor(key), key);
    } catch (err) {
      lastErr = err;
      if (!isRetriableKeyError(err)) throw err;
      const anyErr = err as { status?: number; message?: string };
      const status = anyErr?.status;
      // Log without exposing the key value.
      console.warn(
        `[gemini] key ${maskKey(key)} failed (${
          status ?? "?"
        }); rotating. attempt ${attempt + 1}/${maxRetries}`
      );
      // brief backoff for server-side overload (503/500), immediate for 429
      if (status === 503 || status === 500) {
        await delay(150 * Math.pow(2, attempt));
      }
    }
  }

  throw new AllKeysExhaustedError(
    lastErr instanceof Error ? lastErr.message : undefined
  );
}
