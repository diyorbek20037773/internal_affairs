"use client";

import type { AgencyId, KasbSimResult, ProfessionId } from "@/data/kasblar/types";

/**
 * Ta'lim klasteri persistence: profession-simulator results, the trainee's
 * chosen track (agency + profession) and tutor progress. Local-first like
 * `TrainingRepo`; components never touch localStorage directly.
 */

export const KASB_KEYS = {
  results: "h360:kasb:results:v1",
  track: "h360:kasb:track:v1",
  tutor: "h360:tutor:progress:v1",
} as const;

const MAX_RESULTS = 300;
const CHANGE_EVENT = "h360:kasb-changed";

export interface KasbTrack {
  agency: AgencyId;
  profession: ProfessionId;
}

export interface TutorProgress {
  topicId: string;
  traineeId: string;
  /** Tutor turns completed. */
  turns: number;
  /** Quiz answers: quiz item id → chosen option id. */
  quiz: Record<string, string>;
  quizScore?: number; // 0–100
  updatedAt: string;
  completed?: boolean;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw) as T;
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // quota / private mode — the run still works in memory
  }
}

const isResult = (r: unknown): r is KasbSimResult =>
  !!r && typeof r === "object" && typeof (r as KasbSimResult).id === "string" && Array.isArray((r as KasbSimResult).stages);

export const kasbRepo = {
  CHANGE_EVENT,

  async listResults(traineeId?: string): Promise<KasbSimResult[]> {
    const all = read<unknown[]>(KASB_KEYS.results, []);
    const rows = Array.isArray(all) ? all.filter(isResult) : [];
    return traineeId ? rows.filter((r) => r.traineeId === traineeId) : rows;
  },

  async getResult(id: string): Promise<KasbSimResult | undefined> {
    return (await this.listResults()).find((r) => r.id === id);
  },

  async saveResult(r: KasbSimResult): Promise<void> {
    const raw = read<unknown[]>(KASB_KEYS.results, []);
    const rows = Array.isArray(raw) ? raw : [];
    const idx = rows.findIndex((x) => isResult(x) && x.id === r.id);
    if (idx >= 0) rows[idx] = r;
    else rows.unshift(r);
    write(KASB_KEYS.results, rows.slice(0, MAX_RESULTS));
  },

  async getTrack(): Promise<KasbTrack | null> {
    const t = read<KasbTrack | null>(KASB_KEYS.track, null);
    return t && typeof t.profession === "string" && typeof t.agency === "string" ? t : null;
  },

  async saveTrack(t: KasbTrack): Promise<void> {
    write(KASB_KEYS.track, t);
  },

  async listTutor(traineeId?: string): Promise<TutorProgress[]> {
    const all = read<unknown[]>(KASB_KEYS.tutor, []);
    const rows = (Array.isArray(all) ? all : []).filter(
      (r): r is TutorProgress => !!r && typeof (r as TutorProgress).topicId === "string"
    );
    return traineeId ? rows.filter((r) => r.traineeId === traineeId) : rows;
  },

  async saveTutor(p: TutorProgress): Promise<void> {
    const rows = await this.listTutor();
    const idx = rows.findIndex((x) => x.topicId === p.topicId && x.traineeId === p.traineeId);
    if (idx >= 0) rows[idx] = p;
    else rows.unshift(p);
    write(KASB_KEYS.tutor, rows.slice(0, MAX_RESULTS));
  },
};
