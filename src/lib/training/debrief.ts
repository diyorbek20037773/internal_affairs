import { getScenario } from "@/data/scenarios";
import type { CompetencyScores } from "@/data/scenarios/competencies";
import type { DebriefResult, TrainingSession } from "@/lib/storage/trainingSchema";
import {
  blendScores,
  decisionDeterministic,
  dialogDeterministic,
  mahallaDeterministic,
} from "./competency";

/** Deterministic component for a finished session (no LLM). */
export function computeDeterministic(session: TrainingSession): Partial<CompetencyScores> | undefined {
  const scenario = getScenario(session.scenarioId);
  if (!scenario) return undefined;
  const p = session.payload;
  if (p.kind === "dialog" && scenario.kind === "dialog") return dialogDeterministic(p, scenario);
  if (p.kind === "decision" && scenario.kind === "decision") return decisionDeterministic(p, scenario);
  if (p.kind === "mahalla" && p.grade) return mahallaDeterministic(p.grade);
  return undefined;
}

/** Attach an LLM debrief (status pending) and compute final blended scores. */
export function attachDebrief(
  session: TrainingSession,
  llm: Omit<DebriefResult, "status">
): TrainingSession {
  const deterministicScores = computeDeterministic(session);
  const debrief: DebriefResult = { ...llm, status: "pending" };
  return {
    ...session,
    updatedAt: new Date().toISOString(),
    deterministicScores,
    debrief,
    finalScores: blendScores(deterministicScores, llm.scores),
  };
}

export function confirmDebrief(
  session: TrainingSession,
  instructor: { id: string; note?: string }
): TrainingSession {
  if (!session.debrief) return session;
  return {
    ...session,
    updatedAt: new Date().toISOString(),
    debrief: {
      ...session.debrief,
      status: "confirmed",
      confirmedBy: instructor.id,
      confirmedAt: new Date().toISOString(),
      instructorNote: instructor.note?.trim() || undefined,
    },
  };
}
