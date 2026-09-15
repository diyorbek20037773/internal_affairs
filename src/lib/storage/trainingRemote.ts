"use client";

import type { HimoyaId, TraineeProfile, TrainingSession } from "./trainingSchema";

/**
 * Thin fetch client for /api/store/*. Throws on any non-2xx so the hybrid repo
 * can fall back to localStorage. `storeMode()` is cached; a failure re-probes
 * after RECHECK_MS so a tablet that regains 4G picks the server up again.
 */

export type StoreMode = "postgres" | "local";

const RECHECK_MS = 60_000;
let modeCache: { mode: StoreMode; at: number } | null = null;
let probe: Promise<StoreMode> | null = null;
const listeners = new Set<(m: StoreMode) => void>();

export function onStoreMode(cb: (m: StoreMode) => void): () => void {
  listeners.add(cb);
  if (modeCache) cb(modeCache.mode);
  return () => {
    listeners.delete(cb);
  };
}

export function cachedStoreMode(): StoreMode | null {
  return modeCache?.mode ?? null;
}

export function storeMode(force = false): Promise<StoreMode> {
  if (typeof window === "undefined") return Promise.resolve("local");
  const fresh = modeCache && (modeCache.mode === "postgres" || Date.now() - modeCache.at < RECHECK_MS);
  if (fresh && !force) return Promise.resolve(modeCache!.mode);
  if (!probe) {
    probe = fetch("/api/store", { cache: "no-store" })
      .then(async (r) => (((await r.json()) as { mode?: StoreMode }).mode === "postgres" ? "postgres" : "local"))
      .catch((): StoreMode => "local")
      .then((mode) => {
        modeCache = { mode, at: Date.now() };
        probe = null;
        listeners.forEach((l) => l(mode));
        return mode;
      });
  }
  return probe;
}

/** Mark the server unreachable (a request failed) so reads stop waiting on it. */
function degrade(): void {
  modeCache = { mode: "local", at: Date.now() };
  listeners.forEach((l) => l("local"));
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { cache: "no-store", ...init });
  } catch (e) {
    degrade();
    throw e;
  }
  if (!res.ok) {
    if (res.status === 501 || res.status === 503) degrade();
    throw new Error(`store ${path} → ${res.status}`);
  }
  return (await res.json()) as T;
}

const json = (body: unknown): RequestInit => ({
  method: "PUT",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

const q = (v: string) => encodeURIComponent(v);

export const remoteStore = {
  getProfile: (id: string) =>
    call<{ profile: TraineeProfile | null }>(`/api/store/profile?id=${q(id)}`).then((r) => r.profile),
  listProfiles: () => call<{ items: TraineeProfile[] }>("/api/store/profile").then((r) => r.items),
  saveProfile: (p: TraineeProfile) => call<{ ok: true }>("/api/store/profile", json(p)).then(() => undefined),

  listSessions: (traineeId?: string) =>
    call<{ items: TrainingSession[] }>(`/api/store/sessions${traineeId ? `?traineeId=${q(traineeId)}` : ""}`).then(
      (r) => r.items
    ),
  getSession: (id: string) =>
    call<{ session: TrainingSession | null }>(`/api/store/sessions?id=${q(id)}`).then((r) => r.session ?? undefined),
  saveSession: (s: TrainingSession) => call<{ ok: true }>("/api/store/sessions", json(s)).then(() => undefined),
  saveSessions: (items: TrainingSession[]) =>
    call<{ ok: true }>("/api/store/sessions", json({ items })).then(() => undefined),
  removeSession: (id: string) =>
    call<{ ok: true }>(`/api/store/sessions?id=${q(id)}`, { method: "DELETE" }).then(() => undefined),

  getHimoyaId: (traineeId: string) =>
    call<{ himoyaId: HimoyaId | null }>(`/api/store/himoya-id?traineeId=${q(traineeId)}`).then(
      (r) => r.himoyaId ?? undefined
    ),
  listHimoyaIds: () => call<{ items: HimoyaId[] }>("/api/store/himoya-id").then((r) => r.items),
  saveHimoyaId: (h: HimoyaId) => call<{ ok: true }>("/api/store/himoya-id", json(h)).then(() => undefined),
};
