import type {
  DecisionScenario,
  DialogScenario,
  DocumentScenario,
  MahallaScenario,
  TirScenario,
} from "@/data/scenarios/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { uid } from "@/lib/utils";

interface Base {
  traineeId: string;
  examId?: string;
  examStageIndex?: number;
}

function base(kind: TrainingSession["kind"], scenarioId: string, version: string, b: Base) {
  const now = new Date().toISOString();
  return {
    id: uid(),
    traineeId: b.traineeId,
    kind,
    scenarioId,
    scenarioVersion: version,
    startedAt: now,
    updatedAt: now,
    status: "in_progress" as const,
    examId: b.examId,
    examStageIndex: b.examStageIndex,
  };
}

/** A session the trainee opened but never acted in (no turn, choice, shot, plan or text). */
export function isEmptySession(s: TrainingSession): boolean {
  if (s.status !== "in_progress") return false;
  const p = s.payload;
  switch (p.kind) {
    case "dialog": return p.transcript.length <= 1;
    case "decision": return p.path.length === 0;
    case "mahalla": return p.picked.length === 0 && Object.values(p.plans).every((v) => !v?.trim());
    case "document": return !p.text.trim();
    case "tir": return p.events.length <= 1 && p.shotsFired === 0 && p.elapsedSec < 5;
    default: return false;
  }
}

export function newDialogSession(s: DialogScenario, b: Base): TrainingSession {
  return {
    ...base("dialog", s.id, s.version, b),
    payload: {
      kind: "dialog",
      transcript: [{ i: 0, role: "citizen", text: s.opening, at: new Date().toISOString() }],
      state: s.initialState,
    },
  };
}

export function newDecisionSession(s: DecisionScenario, b: Base): TrainingSession {
  return {
    ...base("decision", s.id, s.version, b),
    payload: { kind: "decision", path: [], currentNodeId: s.startNodeId },
  };
}

export function newMahallaSession(s: MahallaScenario, b: Base): TrainingSession {
  return {
    ...base("mahalla", s.id, s.version, b),
    payload: { kind: "mahalla", picked: [], plans: {} },
  };
}

export function newDocumentSession(s: DocumentScenario, b: Base): TrainingSession {
  return {
    ...base("document", s.id, s.version, b),
    payload: { kind: "document", text: "" },
  };
}

export function newTirSession(s: TirScenario, b: Base): TrainingSession {
  return {
    ...base("tir", s.id, s.version, b),
    payload: { kind: "tir", events: [], elapsedSec: 0, shotsFired: 0, hits: 0 },
  };
}

export function touch<T extends TrainingSession>(s: T, patch: Partial<T> = {}): T {
  return { ...s, ...patch, updatedAt: new Date().toISOString() };
}
