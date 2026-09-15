/**
 * Range ⇄ instructor-station link. Two transports run side by side:
 *  - BroadcastChannel — second window/tab in the same browser profile, instant;
 *  - server relay (`/api/tir/station`) — another tablet/PC; 1 s long-ish polls.
 * Messages are deduplicated by `mid` so a station that sees both paths acts once.
 */

export type StationMsg =
  | { type: "hello" }
  | { type: "state"; state: unknown; scenarioId: string; started: boolean }
  | { type: "cmd"; cmd: unknown };

type Role = "range" | "station";

export type StationLink = {
  send: (msg: StationMsg) => void;
  close: () => void;
  /** true once the other side has been heard over the server relay */
  remoteAlive: () => boolean;
};

export const tirChannelName = (sessionId: string) => `h360-tir-${sessionId}`;

const POLL_MS = 1000;
const STATE_MIN_INTERVAL_MS = 900; // range → server: at most ~1 state/s (commands are sent immediately)

export function openStationLink(opts: {
  sessionId: string;
  role: Role;
  scenarioId?: string;
  traineeId?: string;
  onMessage: (msg: StationMsg, via: "local" | "server") => void;
}): StationLink {
  const { sessionId, role, onMessage } = opts;
  const seen = new Set<string>();
  const noteSeen = (mid: string) => {
    if (seen.has(mid)) return false;
    seen.add(mid);
    if (seen.size > 500) seen.delete(seen.values().next().value as string);
    return true;
  };
  const deliver = (raw: unknown, via: "local" | "server") => {
    const m = raw as StationMsg & { mid?: string };
    if (!m || typeof m.type !== "string") return;
    if (m.mid && !noteSeen(m.mid)) return;
    onMessage(m, via);
  };

  // --- local ---
  let ch: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== "undefined") {
    ch = new BroadcastChannel(tirChannelName(sessionId));
    ch.onmessage = (ev) => deliver(ev.data, "local");
  }

  // --- server ---
  let closed = false;
  let after = -1;
  let alive = false;
  let lastStateAt = 0;
  let pendingState: (StationMsg & { mid: string }) | null = null;
  let stateTimer: number | null = null;

  const post = (msg: StationMsg & { mid: string }) => {
    void fetch("/api/tir/station", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ session: sessionId, from: role, msg, scenarioId: opts.scenarioId, traineeId: opts.traineeId }),
      keepalive: true,
    }).catch(() => undefined);
  };

  const flushState = () => {
    stateTimer = null;
    if (!pendingState || closed) return;
    lastStateAt = Date.now();
    post(pendingState);
    pendingState = null;
  };

  const poll = async () => {
    if (closed) return;
    try {
      const r = await fetch(`/api/tir/station?session=${encodeURIComponent(sessionId)}&role=${role}&after=${after}`, { cache: "no-store" });
      if (r.ok) {
        const data = (await r.json()) as { items: { seq: number; msg: unknown }[]; seq: number; alive: boolean };
        for (const it of data.items) { after = Math.max(after, it.seq); deliver(it.msg, "server"); }
        if (after < 0) after = data.seq; // first poll on an empty room
        alive = role === "station" ? data.alive : data.items.length > 0 || alive;
      } else if (r.status === 401 || r.status === 403) {
        closed = true; // no rights for the relay: stay on BroadcastChannel only
        return;
      }
    } catch {
      /* offline: BroadcastChannel keeps working */
    }
    if (!closed) window.setTimeout(() => void poll(), POLL_MS);
  };
  void poll();

  return {
    send(msg) {
      const withId = { ...msg, mid: `${role}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}` };
      ch?.postMessage(withId);
      if (closed) return;
      if (msg.type === "state") {
        pendingState = withId;
        const wait = STATE_MIN_INTERVAL_MS - (Date.now() - lastStateAt);
        if (wait <= 0) flushState();
        else if (stateTimer == null) stateTimer = window.setTimeout(flushState, wait);
      } else {
        post(withId);
      }
    },
    close() {
      closed = true;
      if (stateTimer != null) window.clearTimeout(stateTimer);
      ch?.close();
    },
    remoteAlive: () => alive,
  };
}
