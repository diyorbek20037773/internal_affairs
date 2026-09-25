"use client";

import {
  ExamSignoffSchema,
  HimoyaIdSchema,
  ProfileFileSchema,
  TrainingSessionSchema,
  type ExamSignoff,
  type HimoyaId,
  type TraineeProfile,
  type TrainingSession,
} from "./trainingSchema";
import { remoteStore, storeMode } from "./trainingRemote";
import { embedPost } from "@/lib/embed/bridge";

/**
 * Huquqni muhofaza qilish ta'lim klasteri training persistence. Mirrors `CasesRepo` but async so a server
 * (Postgres) adapter can replace `localTrainingRepo` without touching callers.
 */

export const TRAINING_KEYS = {
  profile: "h360:profile:v1",
  sessions: "h360:sessions:v1",
  himoyaId: "h360:himoyaId:v1",
  signoffs: "h360:signoffs:v1",
} as const;

/** Keep localStorage well under the 5 MB budget. */
const MAX_SESSIONS = 200;

export interface TrainingRepo {
  getProfile(): Promise<TraineeProfile | null>;
  saveProfile(p: TraineeProfile): Promise<void>;
  /** Forget the device profile (logout). Sessions/Klaster-ID stay for later sync. */
  clearProfile(): Promise<void>;

  listSessions(traineeId?: string): Promise<TrainingSession[]>;
  getSession(id: string): Promise<TrainingSession | undefined>;
  saveSession(s: TrainingSession): Promise<void>;
  removeSession(id: string): Promise<void>;

  getHimoyaId(traineeId: string): Promise<HimoyaId | undefined>;
  saveHimoyaId(h: HimoyaId): Promise<void>;
  listHimoyaIds(): Promise<HimoyaId[]>;

  /** Instructor sign-off of an exam attempt (examId). */
  listSignoffs(traineeId?: string): Promise<ExamSignoff[]>;
  saveSignoff(x: ExamSignoff): Promise<void>;

  /** All known profiles (instructor cabinet names); only this device when local-only. */
  listProfiles(): Promise<TraineeProfile[]>;
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

/**
 * Rows that fail today's schema (written by an older build, or hand-edited)
 * are kept aside and written back untouched, so a schema change can never
 * wipe a tablet's history. They are simply invisible until a migration or a
 * newer build understands them.
 */
type Quarantined = { key: string; rows: unknown[] };
const quarantine = new Map<string, unknown[]>();

function readItems<T>(key: string, parseItem: (raw: unknown) => T | undefined): T[] {
  const raw = readJson<unknown>(key, (r) => r);
  const items = raw && typeof raw === "object" && Array.isArray((raw as { items?: unknown }).items) ? ((raw as { items: unknown[] }).items) : [];
  const ok: T[] = [];
  const bad: unknown[] = [];
  for (const it of items) {
    const v = parseItem(it);
    if (v === undefined) bad.push(it);
    else ok.push(v);
  }
  quarantine.set(key, bad);
  if (bad.length && typeof console !== "undefined") console.warn(`[h360] ${key}: ${bad.length} row(s) kept aside (schema mismatch)`);
  return ok;
}

function writeItems(key: string, items: unknown[]): void {
  const kept = quarantine.get(key) ?? [];
  try {
    writeJson(key, { version: 1, items: [...items, ...kept] });
  } catch (e) {
    // Quota: drop the oldest completed/abandoned sessions and retry once.
    const isQuota = e instanceof DOMException && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED");
    if (!isQuota || key !== TRAINING_KEYS.sessions) throw e;
    const list = (items as TrainingSession[]).slice().sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    const trimmed = list.filter((s, i) => !(i < Math.ceil(list.length / 4) && s.status !== "in_progress"));
    writeJson(key, { version: 1, items: [...trimmed.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), ...kept] });
  }
}
void (0 as unknown as Quarantined);

function readSessions(): TrainingSession[] {
  return readItems<TrainingSession>(TRAINING_KEYS.sessions, (raw) => {
    const r = TrainingSessionSchema.safeParse(raw);
    return r.success ? r.data : undefined;
  });
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
  writeItems(TRAINING_KEYS.sessions, list);
}

function readSignoffs(): ExamSignoff[] {
  return readItems<ExamSignoff>(TRAINING_KEYS.signoffs, (raw) => {
    const r = ExamSignoffSchema.safeParse(raw);
    return r.success ? r.data : undefined;
  });
}

function readHimoyaIds(): HimoyaId[] {
  return readItems<HimoyaId>(TRAINING_KEYS.himoyaId, (raw) => {
    const r = HimoyaIdSchema.safeParse(raw);
    return r.success ? r.data : undefined;
  });
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
  async clearProfile() {
    if (typeof window !== "undefined") window.localStorage.removeItem(TRAINING_KEYS.profile);
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
    // E-O'quv host gets every completed session (debrief/instructor updates re-send it; dedupe by id+updatedAt).
    if (s.status === "completed") embedPost({ type: "h360:session", session: s });
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
    writeItems(TRAINING_KEYS.himoyaId, items);
    embedPost({ type: "h360:himoya-id", himoyaId: h });
  },
  async listHimoyaIds() {
    return readHimoyaIds();
  },
  async listSignoffs(traineeId) {
    return readSignoffs().filter((x) => !traineeId || x.traineeId === traineeId);
  },
  async saveSignoff(x) {
    const items = readSignoffs();
    const idx = items.findIndex((y) => y.examId === x.examId);
    if (idx === -1) items.push(x);
    else items[idx] = x;
    writeItems(TRAINING_KEYS.signoffs, items);
  },
  async listProfiles() {
    const p = await localTrainingRepo.getProfile();
    return p ? [p] : [];
  },
};

/* ---------- hybrid: local write-through + Postgres when reachable ---------- */

function newest<T extends { updatedAt: string }>(a: T | undefined, b: T | undefined): T | undefined {
  if (!a) return b;
  if (!b) return a;
  return b.updatedAt > a.updatedAt ? b : a;
}

function mergeById<T extends { updatedAt: string }>(local: T[], remote: T[], key: (t: T) => string): T[] {
  const m = new Map<string, T>();
  for (const x of local) m.set(key(x), x);
  for (const x of remote) m.set(key(x), newest(m.get(key(x)), x)!);
  return Array.from(m.values());
}

async function online(): Promise<boolean> {
  return (await storeMode()) === "postgres";
}

/** Fire-and-forget server write; the local copy is already saved so a failure only delays sync. */
function push(op: () => Promise<void>): void {
  void online().then((ok) => (ok ? op().catch(() => undefined) : undefined));
}

/**
 * Default repo. Reads merge server + device copies (newest `updatedAt` wins),
 * every write lands in localStorage first (offline tablets) and is mirrored
 * to Postgres. Local-only sessions found during a list are uploaded, so a
 * tablet that trained offline syncs the next time it is online.
 */
export const hybridTrainingRepo: TrainingRepo = {
  async getProfile() {
    return localTrainingRepo.getProfile();
  },
  async saveProfile(p) {
    await localTrainingRepo.saveProfile(p);
    push(() => remoteStore.saveProfile(p));
  },
  async clearProfile() {
    await localTrainingRepo.clearProfile();
  },

  async listSessions(traineeId) {
    const local = await localTrainingRepo.listSessions(traineeId);
    if (!(await online())) return local;
    try {
      const remote = await remoteStore.listSessions(traineeId);
      const remoteAt = new Map(remote.map((s) => [s.id, s.updatedAt]));
      const toUpload = local.filter((s) => (remoteAt.get(s.id) ?? "") < s.updatedAt);
      if (toUpload.length) push(() => remoteStore.saveSessions(toUpload));
      return mergeById(local, remote, (s) => s.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } catch {
      return local;
    }
  },
  async getSession(id) {
    const local = await localTrainingRepo.getSession(id);
    if (!(await online())) return local;
    try {
      return newest(local, await remoteStore.getSession(id));
    } catch {
      return local;
    }
  },
  async saveSession(s) {
    await localTrainingRepo.saveSession(s);
    push(() => remoteStore.saveSession(s));
  },
  async removeSession(id) {
    await localTrainingRepo.removeSession(id);
    push(() => remoteStore.removeSession(id));
  },

  async getHimoyaId(traineeId) {
    const local = await localTrainingRepo.getHimoyaId(traineeId);
    if (!(await online())) return local;
    try {
      const remote = await remoteStore.getHimoyaId(traineeId);
      const best = newest(local, remote);
      if (best && best !== remote) push(() => remoteStore.saveHimoyaId(best));
      if (best && best !== local) await localTrainingRepo.saveHimoyaId(best);
      return best;
    } catch {
      return local;
    }
  },
  async saveHimoyaId(h) {
    await localTrainingRepo.saveHimoyaId(h);
    push(() => remoteStore.saveHimoyaId(h));
  },
  async listSignoffs(traineeId) {
    const local = await localTrainingRepo.listSignoffs(traineeId);
    if (!(await online())) return local;
    try {
      return mergeById(local, await remoteStore.listSignoffs(traineeId), (x) => x.examId);
    } catch {
      return local;
    }
  },
  async saveSignoff(x) {
    await localTrainingRepo.saveSignoff(x);
    push(() => remoteStore.saveSignoff(x));
  },
  async listHimoyaIds() {
    const local = await localTrainingRepo.listHimoyaIds();
    if (!(await online())) return local;
    try {
      return mergeById(local, await remoteStore.listHimoyaIds(), (h) => h.traineeId);
    } catch {
      return local;
    }
  },
  async listProfiles() {
    const local = await localTrainingRepo.listProfiles();
    if (!(await online())) return local;
    try {
      const m = new Map((await remoteStore.listProfiles()).map((p) => [p.id, p]));
      for (const p of local) m.set(p.id, p);
      return Array.from(m.values());
    } catch {
      return local;
    }
  },
};

/** What every hook/component should use. */
export const trainingRepo: TrainingRepo = hybridTrainingRepo;
