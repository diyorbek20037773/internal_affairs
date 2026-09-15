import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { dbEnabled, query } from "@/lib/db/pg";
import type { TraineeProfile } from "@/lib/storage/trainingSchema";

/**
 * Badge ID + PIN auth (MVP). Active only together with the Postgres store:
 * without DATABASE_URL the app keeps the local device profile and no route
 * asks for a login. Sessions are stateless HMAC tokens in an httpOnly cookie;
 * the role always comes from `h360_auth`, never from the client.
 */

export const COOKIE = "h360_sid";
const TOKEN_TTL_S = 30 * 24 * 3600;
const MAX_FAILED = 5;
const LOCK_MS = 60_000;

export type AuthUser = { id: string; badgeId: string; role: "trainee" | "instructor" };

let warned = false;
/**
 * Auth needs the DB and, in production, an explicit AUTH_SECRET: a secret
 * derived from DATABASE_URL is acceptable for local development only. Without
 * it the store stays local-only rather than issuing weakly-signed cookies.
 */
export function authEnabled(): boolean {
  if (!dbEnabled()) return false;
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
    if (!warned) {
      warned = true;
      console.error("[auth] AUTH_SECRET is not set — login disabled, store stays local-only. Set AUTH_SECRET on the server.");
    }
    return false;
  }
  return true;
}

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (s) return s;
  if (!warned) {
    warned = true;
    console.warn("[auth] AUTH_SECRET not set — deriving from DATABASE_URL (development only).");
  }
  return createHmac("sha256", "h360-auth").update(process.env.DATABASE_URL ?? "").digest("hex");
}

const AUTH_SQL = `
CREATE TABLE IF NOT EXISTS h360_auth (
  badge_id     text PRIMARY KEY,
  profile_id   text NOT NULL UNIQUE,
  pin_hash     text NOT NULL,
  role         text NOT NULL,
  failed       int  NOT NULL DEFAULT 0,
  locked_until timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);`;
let authSchema: Promise<void> | null = null;
function ensureAuthSchema(): Promise<void> {
  if (!authSchema) authSchema = query(AUTH_SQL).then(() => undefined).catch((e) => { authSchema = null; throw e; });
  return authSchema;
}

/* ---------- PIN hashing ---------- */

export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = scryptSync(pin, salt, 32);
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ---------- tokens ---------- */

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export function issueToken(profileId: string): string {
  const body = b64(JSON.stringify({ id: profileId, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_S }));
  return `${body}.${sign(body)}`;
}

function readToken(token: string | undefined): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expect = sign(body);
  if (expect.length !== sig.length || !timingSafeEqual(Buffer.from(expect), Buffer.from(sig))) return null;
  try {
    const { id, exp } = JSON.parse(Buffer.from(body, "base64url").toString()) as { id: string; exp: number };
    return exp > Date.now() / 1000 ? id : null;
  } catch {
    return null;
  }
}

export function cookieHeader(token: string | null, req: NextRequest): string {
  const secure = req.headers.get("x-forwarded-proto") === "https" || req.nextUrl.protocol === "https:";
  const base = `${COOKIE}=${token ?? ""}; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;
  return token ? `${base}; Max-Age=${TOKEN_TTL_S}` : `${base}; Max-Age=0`;
}

/* ---------- lookups ---------- */

type AuthRow = { badge_id: string; profile_id: string; pin_hash: string; role: AuthUser["role"]; failed: number; locked_until: Date | null };

export async function getSessionUser(req: NextRequest): Promise<AuthUser | null> {
  if (!authEnabled()) return null;
  const id = readToken(req.cookies.get(COOKIE)?.value);
  if (!id) return null;
  await ensureAuthSchema();
  const rows = await query<AuthRow>("SELECT badge_id, profile_id, role FROM h360_auth WHERE profile_id = $1", [id]);
  const r = rows[0];
  return r ? { id: r.profile_id, badgeId: r.badge_id, role: r.role } : null;
}

export function instructorBadges(): Set<string> {
  return new Set((process.env.INSTRUCTOR_BADGES ?? "").split(/[,\s]+/).map((s) => s.trim().toUpperCase()).filter(Boolean));
}

export async function register(badgeId: string, pin: string, profile: TraineeProfile): Promise<AuthUser | "exists"> {
  await ensureAuthSchema();
  const role: AuthUser["role"] = instructorBadges().has(badgeId) ? "instructor" : "trainee";
  const p: TraineeProfile = { ...profile, badgeId, role };
  const rows = await query<{ badge_id: string }>(
    `INSERT INTO h360_auth (badge_id, profile_id, pin_hash, role) VALUES ($1, $2, $3, $4)
     ON CONFLICT (badge_id) DO NOTHING RETURNING badge_id`,
    [badgeId, p.id, hashPin(pin), role]
  );
  if (!rows.length) return "exists";
  await query(
    `INSERT INTO h360_profiles (id, badge_id, role, data) VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET badge_id = EXCLUDED.badge_id, role = EXCLUDED.role, data = EXCLUDED.data, updated_at = now()`,
    [p.id, badgeId, role, JSON.stringify(p)]
  );
  return { id: p.id, badgeId, role };
}

export async function login(badgeId: string, pin: string): Promise<AuthUser | "invalid" | "locked"> {
  await ensureAuthSchema();
  const rows = await query<AuthRow>("SELECT * FROM h360_auth WHERE badge_id = $1", [badgeId]);
  const r = rows[0];
  if (!r) {
    verifyPin(pin, hashPin("0000")); // constant-time-ish: same work for unknown badges
    return "invalid";
  }
  if (r.locked_until && new Date(r.locked_until).getTime() > Date.now()) return "locked";
  if (!verifyPin(pin, r.pin_hash)) {
    const failed = r.failed + 1;
    await query(
      `UPDATE h360_auth SET
         failed = CASE WHEN $2::int >= $3::int THEN 0 ELSE $2::int END,
         locked_until = CASE WHEN $2::int >= $3::int THEN now() + ($4::int * interval '1 millisecond') ELSE NULL END
       WHERE badge_id = $1`,
      [badgeId, failed, MAX_FAILED, LOCK_MS]
    );
    return failed >= MAX_FAILED ? "locked" : "invalid";
  }
  if (r.failed || r.locked_until) await query("UPDATE h360_auth SET failed = 0, locked_until = NULL WHERE badge_id = $1", [badgeId]);
  return { id: r.profile_id, badgeId: r.badge_id, role: r.role };
}

/** Role of record for a profile id (used to stop clients from self-promoting). */
export async function roleOf(profileId: string): Promise<AuthUser["role"] | null> {
  await ensureAuthSchema();
  const rows = await query<{ role: AuthUser["role"] }>("SELECT role FROM h360_auth WHERE profile_id = $1", [profileId]);
  return rows[0]?.role ?? null;
}
