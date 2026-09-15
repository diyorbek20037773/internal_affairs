import type { ExamSignoff, TraineeProfile, TrainingSession } from "@/lib/storage/trainingSchema";
import { COMPETENCIES } from "@/data/scenarios/competencies";

/** Pure helpers for the instructor cabinet (filters, grouping, exam attempts). */

export type Period = "7" | "30" | "all";
export type KindFilter = "all" | TrainingSession["kind"];

export type CabinetFilter = {
  q: string;
  group: string; // district, "" = all
  kind: KindFilter;
  period: Period;
};

export const DEFAULT_FILTER: CabinetFilter = { q: "", group: "", kind: "all", period: "all" };

export function periodStart(p: Period, now = Date.now()): string | null {
  if (p === "all") return null;
  return new Date(now - Number(p) * 86400_000).toISOString();
}

export function matchesTrainee(p: TraineeProfile | undefined, f: CabinetFilter, fallbackId: string): boolean {
  if (f.group && (p?.district ?? "") !== f.group) return false;
  const q = f.q.trim().toLowerCase();
  if (!q) return true;
  const hay = p ? `${p.name} ${p.badgeId} ${p.rank} ${p.district}` : fallbackId;
  return hay.toLowerCase().includes(q);
}

export function filterSessions(sessions: TrainingSession[], profiles: Map<string, TraineeProfile>, f: CabinetFilter): TrainingSession[] {
  const since = periodStart(f.period);
  return sessions.filter((s) => {
    if (f.kind !== "all" && s.kind !== f.kind) return false;
    if (since && (s.endedAt ?? s.updatedAt) < since) return false;
    return matchesTrainee(profiles.get(s.traineeId), f, s.traineeId);
  });
}

/** Distinct districts across profiles, sorted, empty removed. */
export function groupsOf(profiles: Iterable<TraineeProfile>): string[] {
  return Array.from(new Set(Array.from(profiles).map((p) => p.district.trim()).filter(Boolean))).sort();
}

export function avgScore(s: TrainingSession): number | null {
  if (!s.finalScores) return null;
  return Math.round(COMPETENCIES.reduce((a, c) => a + s.finalScores![c], 0) / COMPETENCIES.length);
}

export type ExamAttempt = {
  examId: string;
  baseExamId: string;
  traineeId: string;
  sessions: TrainingSession[];
  stagesDone: number;
  avg: number | null;
  updatedAt: string;
  signoff?: ExamSignoff;
};

/** Group exam-tagged sessions into attempts (`exam.id` or `exam.id~<ts>`). */
export function examAttempts(sessions: TrainingSession[], signoffs: ExamSignoff[]): ExamAttempt[] {
  const byId = new Map<string, TrainingSession[]>();
  for (const s of sessions) {
    if (!s.examId) continue;
    const list = byId.get(s.examId) ?? [];
    list.push(s);
    byId.set(s.examId, list);
  }
  const so = new Map(signoffs.map((x) => [x.examId, x]));
  const out: ExamAttempt[] = [];
  for (const [examId, list] of byId) {
    const done = list.filter((s) => s.status === "completed");
    const scored = done.filter((s) => s.finalScores);
    const avg = scored.length ? Math.round(scored.reduce((a, s) => a + (avgScore(s) ?? 0), 0) / scored.length) : null;
    out.push({
      examId,
      baseExamId: examId.split("~")[0],
      traineeId: list[0].traineeId,
      sessions: list,
      stagesDone: new Set(done.map((s) => s.examStageIndex)).size,
      avg,
      updatedAt: list.map((s) => s.updatedAt).sort().at(-1) ?? "",
      signoff: so.get(examId),
    });
  }
  return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
