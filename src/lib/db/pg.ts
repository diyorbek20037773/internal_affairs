import { Pool } from "pg";

/**
 * Postgres connection for the server-side training store. Enabled only when
 * `DATABASE_URL` is set (Railway Postgres plugin). Without it every /api/store
 * route answers `{ mode: "local" }` and the client keeps using localStorage.
 */

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function dbEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function wantsSsl(url: string): boolean {
  if (process.env.DATABASE_SSL === "0") return false;
  if (process.env.DATABASE_SSL === "1") return true;
  try {
    const host = new URL(url).hostname;
    // Railway private network + local dev talk plain TCP; public proxies need TLS.
    return !(host.endsWith(".railway.internal") || host === "localhost" || host === "127.0.0.1");
  } catch {
    return false;
  }
}

export function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    pool = new Pool({
      connectionString: url,
      max: 5,
      ssl: wantsSsl(url) ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS h360_profiles (
  id          text PRIMARY KEY,
  badge_id    text NOT NULL,
  role        text NOT NULL,
  data        jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS h360_profiles_badge_idx ON h360_profiles (badge_id);

CREATE TABLE IF NOT EXISTS h360_sessions (
  id          text PRIMARY KEY,
  trainee_id  text NOT NULL,
  status      text NOT NULL,
  updated_at  text NOT NULL,
  data        jsonb NOT NULL
);
CREATE INDEX IF NOT EXISTS h360_sessions_trainee_idx ON h360_sessions (trainee_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS h360_himoya_ids (
  trainee_id  text PRIMARY KEY,
  updated_at  text NOT NULL,
  data        jsonb NOT NULL
);
`;

/** Idempotent auto-migration; runs once per process. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(SCHEMA_SQL)
      .then(() => undefined)
      .catch((e) => {
        schemaReady = null;
        throw e;
      });
  }
  return schemaReady;
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  await ensureSchema();
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
