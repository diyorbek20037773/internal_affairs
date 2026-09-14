import { COMPETENCIES, type Competency } from "@/data/scenarios/competencies";
import { listScenarios } from "@/data/scenarios";
import type { Scenario } from "@/data/scenarios/types";
import type { HimoyaId, TrainingSession } from "@/lib/storage/trainingSchema";

export interface MentorRecommendation {
  scenario: Scenario;
  competency: Competency;
  score?: number; // undefined => never assessed
}

/**
 * Rule-based AI-Mentor (pptx slide 8): pick the weakest assessed competency
 * (or an untrained one), then a scenario tagged with it that was not run in
 * the last 3 sessions, preferring the lowest difficulty not yet mastered.
 * Instructor confirms — this never writes anything.
 */
export function recommendNext(
  himoyaId: HimoyaId | undefined,
  sessions: TrainingSession[]
): MentorRecommendation | null {
  const candidates = listScenarios().filter((s) => s.kind !== "exam");
  if (candidates.length === 0) return null;

  const recent = new Set(
    [...sessions]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 3)
      .map((s) => s.scenarioId)
  );

  let target: Competency | undefined;
  let score: number | undefined;

  if (himoyaId) {
    const rated = COMPETENCIES.filter((c) => (himoyaId.samples[c] ?? 0) > 0);
    const unrated = COMPETENCIES.filter((c) => (himoyaId.samples[c] ?? 0) === 0);
    if (rated.length > 0) {
      target = rated.reduce((w, c) => (himoyaId.scores[c] < himoyaId.scores[w] ? c : w), rated[0]);
      score = himoyaId.scores[target];
      // A never-trained axis beats a weak-but-trained one only if the weak one is above 70.
      if (score >= 70 && unrated.length > 0) {
        target = unrated[0];
        score = undefined;
      }
    } else if (unrated.length > 0) {
      target = unrated[0];
    }
  }
  if (!target) target = "muloqot";

  const avg =
    himoyaId && Object.values(himoyaId.samples).some((n) => n > 0)
      ? COMPETENCIES.reduce((a, c) => a + himoyaId.scores[c], 0) / COMPETENCIES.length
      : 0;
  const maxDifficulty = avg >= 75 ? 3 : avg >= 50 ? 2 : 1;

  const tagged = candidates.filter((s) => s.tags.includes(target!));
  const pool = (tagged.length ? tagged : candidates).filter((s) => !recent.has(s.id));
  const finalPool = pool.length ? pool : tagged.length ? tagged : candidates;

  const kindRank = { dialog: 0, decision: 1, mahalla: 2, document: 3, exam: 4 } as const;
  const pick = [...finalPool].sort((a, b) => {
    const da = a.difficulty <= maxDifficulty ? 0 : 1;
    const db = b.difficulty <= maxDifficulty ? 0 : 1;
    if (da !== db) return da - db;
    if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
    return kindRank[a.kind] - kindRank[b.kind];
  })[0];

  return pick ? { scenario: pick, competency: target, score } : null;
}

export function scenarioHref(s: Scenario): string {
  switch (s.kind) {
    case "dialog":
      return `/simulyator/muloqot/${s.id}`;
    case "decision":
      return `/simulyator/qaror/${s.id}`;
    case "mahalla":
      return `/simulyator/mahalla/${s.id}`;
    case "document":
      return `/simulyator/hujjat/${s.id}`;
    case "exam":
      return `/simulyator/imtihon`;
  }
}
