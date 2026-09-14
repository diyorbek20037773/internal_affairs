import type {
  DecisionScenario,
  DialogScenario,
  DocumentScenario,
  MahallaScenario,
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

export function touch<T extends TrainingSession>(s: T, patch: Partial<T> = {}): T {
  return { ...s, ...patch, updatedAt: new Date().toISOString() };
}
