"use client";

import {
  HimoyaIdFileSchema,
  ProfileFileSchema,
  SessionsFileSchema,
  type HimoyaId,
  type TraineeProfile,
  type TrainingSession,
} from "./trainingSchema";

/**
 * HIMOYA-360 training persistence. Mirrors `CasesRepo` but async so a server
 * (Postgres) adapter can replace `localTrainingRepo` without touching callers.
 */

export const TRAINING_KEYS = {
  profile: "h360:profile:v1",
  sessions: "h360:sessions:v1",
  himoyaId: "h360:himoyaId:v1",
} as const;

/** Keep localStorage well under the 5 MB budget. */
const MAX_SESSIONS = 200;

export interface TrainingRepo {
  getProfile(): Promise<TraineeProfile | null>;
  saveProfile(p: TraineeProfile): Promise<void>;

  listSessions(traineeId?: string): Promise<TrainingSession[]>;
  getSession(id: string): Promise<TrainingSession | undefined>;
  saveSession(s: TrainingSession): Promise<void>;
  removeSession(id: string): Promise<void>;

  getHimoyaId(traineeId: string): Promise<HimoyaId | undefined>;
  saveHimoyaId(h: HimoyaId): Promise<void>;
  listHimoyaIds(): Promise<HimoyaId[]>;
}

function readJson<T>(key: string, parse: (raw: unknown) => T | undefined): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    return parse(JSON.parse(raw));
  } catch {
    return undefined;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readSessions(): TrainingSession[] {
  return (
    readJson(TRAINING_KEYS.sessions, (raw) => {
      const r = SessionsFileSchema.safeParse(raw);
      return r.success ? r.data.items : undefined;
    }) ?? []
  );
}

function writeSessions(items: TrainingSession[]): void {
  let list = items;
  if (list.length > MAX_SESSIONS) {
    // evict oldest abandoned first, then oldest overall
    const byAge = [...list].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    const abandoned = byAge.filter((s) => s.status === "abandoned");
    const toDrop = new Set<string>();
    for (const s of abandoned) {
      if (list.length - toDrop.size <= MAX_SESSIONS) break;
      toDrop.add(s.id);
    }
    for (const s of byAge) {
      if (list.length - toDrop.size <= MAX_SESSIONS) break;
      toDrop.add(s.id);
    }
    list = list.filter((s) => !toDrop.has(s.id));
  }
  writeJson(TRAINING_KEYS.sessions, { version: 1, items: list });
}

function readHimoyaIds(): HimoyaId[] {
  return (
    readJson(TRAINING_KEYS.himoyaId, (raw) => {
      const r = HimoyaIdFileSchema.safeParse(raw);
      return r.success ? r.data.items : undefined;
    }) ?? []
  );
}

export const localTrainingRepo: TrainingRepo = {
  async getProfile() {
    return (
      readJson(TRAINING_KEYS.profile, (raw) => {
        const r = ProfileFileSchema.safeParse(raw);
        return r.success ? r.data.profile : undefined;
      }) ?? null
    );
  },
  async saveProfile(p) {
    writeJson(TRAINING_KEYS.profile, { version: 1, profile: p });
  },

  async listSessions(traineeId) {
    const all = readSessions().filter((s) => !traineeId || s.traineeId === traineeId);
    return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async getSession(id) {
    return readSessions().find((s) => s.id === id);
  },
  async saveSession(s) {
    const items = readSessions();
    const idx = items.findIndex((x) => x.id === s.id);
    if (idx === -1) items.push(s);
    else items[idx] = s;
    writeSessions(items);
  },
  async removeSession(id) {
    writeSessions(readSessions().filter((s) => s.id !== id));
  },

  async getHimoyaId(traineeId) {
    return readHimoyaIds().find((h) => h.traineeId === traineeId);
  },
  async saveHimoyaId(h) {
    const items = readHimoyaIds();
    const idx = items.findIndex((x) => x.traineeId === h.traineeId);
    if (idx === -1) items.push(h);
    else items[idx] = h;
    writeJson(TRAINING_KEYS.himoyaId, { version: 1, items });
  },
  async listHimoyaIds() {
    return readHimoyaIds();
  },
};
