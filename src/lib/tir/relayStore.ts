/**
 * Server-side relay between a running TIR range and an instructor station on
 * another device. In-memory ring per session (one Railway instance; messages
 * are ephemeral by nature — a station that connects late asks for the latest
 * state). Sessions idle for RELAY_TTL_MS are dropped.
 */

export type RelayFrom = "range" | "station";
export type RelayItem = { seq: number; from: RelayFrom; msg: unknown; at: number };

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

const RELAY_TTL_MS = 10 * 60_000;
const RING = 200;

const rooms = new Map<string, Room>();

function room(id: string): Room {
  let r = rooms.get(id);
  if (!r) {
    r = { seq: 0, items: [], scenarioId: null, traineeId: null, lastState: null, lastRangeAt: 0, lastStationAt: 0, createdAt: Date.now() };
    rooms.set(id, r);
  }
  return r;
}

function sweep(now = Date.now()) {
  for (const [id, r] of rooms) {
    if (now - Math.max(r.lastRangeAt, r.lastStationAt, r.createdAt) > RELAY_TTL_MS) rooms.delete(id);
  }
}

export function publish(sessionId: string, from: RelayFrom, msg: unknown, meta?: { scenarioId?: string; traineeId?: string }): number {
  sweep();
  const r = room(sessionId);
  const now = Date.now();
  r.seq += 1;
  r.items.push({ seq: r.seq, from, msg, at: now });
  if (r.items.length > RING) r.items.splice(0, r.items.length - RING);
  if (from === "range") {
    r.lastRangeAt = now;
    if (meta?.scenarioId) r.scenarioId = meta.scenarioId;
    if (meta?.traineeId) r.traineeId = meta.traineeId;
    const m = msg as { type?: string };
    if (m && m.type === "state") r.lastState = msg;
  } else {
    r.lastStationAt = now;
  }
  return r.seq;
}

/** Messages after `after`, from the other side only. `after = -1` → also the latest range state first. */
export function read(sessionId: string, forRole: RelayFrom, after: number): { items: RelayItem[]; seq: number; alive: boolean } {
  sweep();
  const r = rooms.get(sessionId);
  if (!r) return { items: [], seq: 0, alive: false };
  const other: RelayFrom = forRole === "range" ? "station" : "range";
  let items = r.items.filter((i) => i.from === other && i.seq > after);
  if (after < 0 && forRole === "station" && r.lastState) {
    // late joiner: newest state is enough, skip the backlog
    items = [{ seq: r.seq, from: "range", msg: r.lastState, at: r.lastRangeAt }];
  }
  if (forRole === "range") r.lastStationAt = Math.max(r.lastStationAt, Date.now() - 1); // a range polling keeps nothing alive by itself
  return { items, seq: r.seq, alive: Date.now() - r.lastRangeAt < 15_000 };
}

export type LiveRange = { sessionId: string; scenarioId: string | null; traineeId: string | null; lastSeen: number; stationSeen: number };

/** Ranges that reported state within the last 30 s (for the station picker). */
export function listLive(): LiveRange[] {
  sweep();
  const now = Date.now();
  const out: LiveRange[] = [];
  for (const [sessionId, r] of rooms) {
    if (now - r.lastRangeAt > 30_000) continue;
    out.push({ sessionId, scenarioId: r.scenarioId, traineeId: r.traineeId, lastSeen: now - r.lastRangeAt, stationSeen: r.lastStationAt ? now - r.lastStationAt : -1 });
  }
  return out.sort((a, b) => a.lastSeen - b.lastSeen);
}

/** Test/ops helper. */
export function _resetRelay(): void {
  rooms.clear();
}
