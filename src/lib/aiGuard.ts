import type { NextRequest } from "next/server";
import { authEnabled, getSessionUser } from "@/lib/auth/server";

/**
 * Guard for every route that spends Gemini quota (/api/sim/*, /api/chat,
 * /api/legal, /api/stt, /api/tts):
 *  - per-IP token bucket so a public URL cannot drain the key pool
 *    (in-memory — one Railway instance; `AI_RATE_PER_MIN` overrides);
 *  - when the server store / auth is on, an AI call needs a signed-in session.
 * Returns a Response to send, or null to continue.
 */

type Bucket = { tokens: number; at: number };
const buckets = new Map<string, Bucket>();
const PER_MIN = Math.max(5, Number(process.env.AI_RATE_PER_MIN) || 40);
const BURST = PER_MIN;
let sweep = 0;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : req.headers.get("x-real-ip")) || "local";
}

function take(key: string, cost: number): boolean {
  const now = Date.now();
  if (now - sweep > 60_000) {
    sweep = now;
    for (const [k, b] of buckets) if (now - b.at > 120_000) buckets.delete(k);
  }
  const b = buckets.get(key) ?? { tokens: BURST, at: now };
  b.tokens = Math.min(BURST, b.tokens + ((now - b.at) / 60_000) * PER_MIN);
  b.at = now;
  if (b.tokens < cost) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= cost;
  buckets.set(key, b);
  return true;
}

export async function aiGuard(req: NextRequest, opts: { cost?: number } = {}): Promise<Response | null> {
  if (authEnabled()) {
    const user = await getSessionUser(req).catch(() => null);
    if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!take(clientIp(req), opts.cost ?? 1)) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: { "retry-after": "30" } });
  }
  return null;
}
