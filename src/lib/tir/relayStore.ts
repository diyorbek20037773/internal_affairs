import { dbEnabled, query } from "@/lib/db/pg";

/**
 * Server-side relay between a running TIR range and an instructor station on
 * another device. Two backends behind one async API:
 *  - Postgres (`DATABASE_URL` set) — rooms/items in `h360_tir_rooms` /
 *    `h360_tir_relay`, so several Railway instances (or a restart mid-session)
 *    share the same relay;
 *  - in-memory ring — single instance / no DB, and the fallback when a DB
 *    call fails (the relay degrades to "this instance only", never to "down").
 * Messages are ephemeral: a station that connects late asks for the latest
 * state. Sessions idle for RELAY_TTL_MS are dropped.
 */

export type RelayFrom = "range" | "station";
export type RelayItem = { seq: number; from: RelayFrom; msg: unknown; at: number };
export type RelayRead = { items: RelayItem[]; seq: number; alive: boolean };
export type LiveRange = { sessionId: string; scenarioId: string | null; traineeId: string | null; lastSeen: number; stationSeen: number };

type PublishMeta = { scenarioId?: string; traineeId?: string };

const RELAY_TTL_MS = 10 * 60_000;
const RING = 200;
const ALIVE_MS = 15_000; // range reported state this recently → station shows "live"
const LIST_MS = 30_000; // ranges shown in the picker
const SWEEP_EVERY_MS = 30_000;

function isState(msg: unknown): boolean {
  return Boolean(msg) && (msg as { type?: string }).type === "state";
}

/* ---------------- in-memory backend ---------------- */

type Room = {
  seq: number;
  items: RelayItem[];
  scenarioId: string | null;
  traineeId: string | null;
  lastState: unknown;
  lastRangeAt: number;
  lastStationAt: number;
  createdAt: number;
};

const rooms = new Map<string, Room>();

function room(id: string): Room {
  let r = rooms.get(id);
  if (!r) {
    r = { seq: 0, items: [], scenarioId: null, traineeId: null, lastState: null, lastRangeAt: 0, lastStationAt: 0, createdAt: Date.now() };
    rooms.set(id, r);
  }
  return r;
}

function memSweep(now = Date.now()) {
  for (const [id, r] of rooms) {
    if (now - Math.max(r.lastRangeAt, r.lastStationAt, r.createdAt) > RELAY_TTL_MS) rooms.delete(id);
  }
}

function memPublish(sessionId: string, from: RelayFrom, msg: unknown, meta?: PublishMeta): number {
  memSweep();
  const r = room(sessionId);
  const now = Date.now();
  r.seq += 1;
  r.items.push({ seq: r.seq, from, msg, at: now });
  if (r.items.length > RING) r.items.splice(0, r.items.length - RING);
  if (from === "range") {
    r.lastRangeAt = now;
    if (meta?.scenarioId) r.scenarioId = meta.scenarioId;
    if (meta?.traineeId) r.traineeId = meta.traineeId;
    if (isState(msg)) r.lastState = msg;
  } else {
    r.lastStationAt = now;
  }
  return r.seq;
}

function memRead(sessionId: string, forRole: RelayFrom, after: number): RelayRead {
  memSweep();
  const r = rooms.get(sessionId);
  if (!r) return { items: [], seq: 0, alive: false };
  const other: RelayFrom = forRole === "range" ? "station" : "range";
  let items = r.items.filter((i) => i.from === other && i.seq > after);
  if (after < 0 && forRole === "station" && r.lastState) {
    // late joiner: newest state is enough, skip the backlog
    items = [{ seq: r.seq, from: "range", msg: r.lastState, at: r.lastRangeAt }];
  }
  if (forRole === "station") r.lastStationAt = Date.now(); // a polling station counts as attached
  return { items, seq: r.seq, alive: Date.now() - r.lastRangeAt < ALIVE_MS };
}

function memListLive(): LiveRange[] {
  memSweep();
  const now = Date.now();
  const out: LiveRange[] = [];
  for (const [sessionId, r] of rooms) {
    if (now - r.lastRangeAt > LIST_MS) continue;
    out.push({ sessionId, scenarioId: r.scenarioId, traineeId: r.traineeId, lastSeen: now - r.lastRangeAt, stationSeen: r.lastStationAt ? now - r.lastStationAt : -1 });
  }
  return out.sort((a, b) => a.lastSeen - b.lastSeen);
}

/* ---------------- Postgres backend ---------------- */

const RELAY_SQL = `
CREATE TABLE IF NOT EXISTS h360_tir_rooms (
  session_id      text PRIMARY KEY,
  seq             int    NOT NULL DEFAULT 0,
  scenario_id     text,
  trainee_id      text,
  last_state      jsonb,
  last_range_at   bigint NOT NULL DEFAULT 0,
  last_station_at bigint NOT NULL DEFAULT 0,
  created_at      bigint NOT NULL
);
CREATE TABLE IF NOT EXISTS h360_tir_relay (
  session_id text NOT NULL,
  seq        int  NOT NULL,
  from_role  text NOT NULL,
  msg        jsonb NOT NULL,
  at         bigint NOT NULL,
  PRIMARY KEY (session_id, seq)
);`;
let relaySchema: Promise<void> | null = null;
function ensureRelaySchema(): Promise<void> {
  if (!relaySchema) relaySchema = query(RELAY_SQL).then(() => undefined).catch((e) => { relaySchema = null; throw e; });
  return relaySchema;
}

let lastPgSweep = 0;
async function pgSweep(now = Date.now()): Promise<void> {
  if (now - lastPgSweep < SWEEP_EVERY_MS) return;
  lastPgSweep = now;
  const cutoff = now - RELAY_TTL_MS;
  await query(
    "DELETE FROM h360_tir_relay WHERE session_id IN (SELECT session_id FROM h360_tir_rooms WHERE GREATEST(last_range_at, last_station_at, created_at) < $1)",
    [cutoff]
  );
  await query("DELETE FROM h360_tir_rooms WHERE GREATEST(last_range_at, last_station_at, created_at) < $1", [cutoff]);
}

type RoomRow = { seq: number; scenario_id: string | null; trainee_id: string | null; last_state: unknown; last_range_at: string; last_station_at: string };
type ItemRow = { seq: number; from_role: RelayFrom; msg: unknown; at: string };

async function pgPublish(sessionId: string, from: RelayFrom, msg: unknown, meta?: PublishMeta): Promise<number> {
  await ensureRelaySchema();
  await pgSweep();
  const now = Date.now();
  const isRange = from === "range";
  const state = isRange && isState(msg) ? JSON.stringify(msg) : null;
  const rows = await query<{ seq: number }>(
    `INSERT INTO h360_tir_rooms (session_id, seq, scenario_id, trainee_id, last_state, last_range_at, last_station_at, created_at)
     VALUES ($1, 1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (session_id) DO UPDATE SET
       seq = h360_tir_rooms.seq + 1,
       scenario_id = COALESCE(EXCLUDED.scenario_id, h360_tir_rooms.scenario_id),
       trainee_id = COALESCE(EXCLUDED.trainee_id, h360_tir_rooms.trainee_id),
       last_state = COALESCE(EXCLUDED.last_state, h360_tir_rooms.last_state),
       last_range_at = GREATEST(EXCLUDED.last_range_at, h360_tir_rooms.last_range_at),
       last_station_at = GREATEST(EXCLUDED.last_station_at, h360_tir_rooms.last_station_at)
     RETURNING seq`,
    [sessionId, isRange ? meta?.scenarioId ?? null : null, isRange ? meta?.traineeId ?? null : null, state, isRange ? now : 0, isRange ? 0 : now, now]
  );
  const seq = Number(rows[0]?.seq ?? 0);
  await query(
    "INSERT INTO h360_tir_relay (session_id, seq, from_role, msg, at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING",
    [sessionId, seq, from, JSON.stringify(msg), now]
  );
  if (seq % 50 === 0) await query("DELETE FROM h360_tir_relay WHERE session_id = $1 AND seq <= $2", [sessionId, seq - RING]);
  return seq;
}

async function pgRead(sessionId: string, forRole: RelayFrom, after: number): Promise<RelayRead> {
  await ensureRelaySchema();
  const now = Date.now();
  const cols = "seq, scenario_id, trainee_id, last_state, last_range_at, last_station_at";
  const rows =
    forRole === "station"
      ? await query<RoomRow>(`UPDATE h360_tir_rooms SET last_station_at = $2 WHERE session_id = $1 RETURNING ${cols}`, [sessionId, now])
      : await query<RoomRow>(`SELECT ${cols} FROM h360_tir_rooms WHERE session_id = $1`, [sessionId]);
  const r = rows[0];
  if (!r) return { items: [], seq: 0, alive: false };
  const lastRangeAt = Number(r.last_range_at);
  const seq = Number(r.seq);
  let items: RelayItem[];
  if (after < 0 && forRole === "station" && r.last_state) {
    items = [{ seq, from: "range", msg: r.last_state, at: lastRangeAt }];
  } else {
    const other: RelayFrom = forRole === "range" ? "station" : "range";
    const its = await query<ItemRow>(
      "SELECT seq, from_role, msg, at FROM h360_tir_relay WHERE session_id = $1 AND from_role = $2 AND seq > $3 ORDER BY seq ASC LIMIT $4",
      [sessionId, other, after, RING]
    );
    items = its.map((i) => ({ seq: Number(i.seq), from: i.from_role, msg: i.msg, at: Number(i.at) }));
  }
  return { items, seq, alive: now - lastRangeAt < ALIVE_MS };
}

async function pgListLive(): Promise<LiveRange[]> {
  await ensureRelaySchema();
  await pgSweep();
  const now = Date.now();
  const rows = await query<{ session_id: string; scenario_id: string | null; trainee_id: string | null; last_range_at: string; last_station_at: string }>(
    "SELECT session_id, scenario_id, trainee_id, last_range_at, last_station_at FROM h360_tir_rooms WHERE last_range_at > $1 ORDER BY last_range_at DESC LIMIT 200",
    [now - LIST_MS]
  );
  return rows.map((r) => {
    const st = Number(r.last_station_at);
    return { sessionId: r.session_id, scenarioId: r.scenario_id, traineeId: r.trainee_id, lastSeen: now - Number(r.last_range_at), stationSeen: st ? now - st : -1 };
  });
}

/* ---------------- public API ---------------- */

let pgWarned = false;
function pgFailed(e: unknown): void {
  if (pgWarned) return;
  pgWarned = true;
  console.warn("[tir-relay] Postgres unavailable, using the in-memory relay:", e instanceof Error ? e.message : e);
}

/** Which backend the relay is configured for (health / tests). */
export function relayMode(): "postgres" | "memory" {
  return dbEnabled() ? "postgres" : "memory";
}

export async function publish(sessionId: string, from: RelayFrom, msg: unknown, meta?: PublishMeta): Promise<number> {
  if (dbEnabled()) {
    try {
      return await pgPublish(sessionId, from, msg, meta);
    } catch (e) {
      pgFailed(e);
    }
  }
  return memPublish(sessionId, from, msg, meta);
}

/** Messages after `after`, from the other side only. `after = -1` → also the latest range state first. */
export async function read(sessionId: string, forRole: RelayFrom, after: number): Promise<RelayRead> {
  if (dbEnabled()) {
    try {
      return await pgRead(sessionId, forRole, after);
    } catch (e) {
      pgFailed(e);
    }
  }
  return memRead(sessionId, forRole, after);
}

/** Ranges that reported state within the last 30 s (for the station picker). */
export async function listLive(): Promise<LiveRange[]> {
  if (dbEnabled()) {
    try {
      return await pgListLive();
    } catch (e) {
      pgFailed(e);
    }
  }
  return memListLive();
}

/** Test/ops helper (memory backend only). */
export function _resetRelay(): void {
  rooms.clear();
}
