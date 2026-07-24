import type { IncidentType } from "@/types/incident";
import { getSop } from "@/data/sops";
import type { Sop, SopStep } from "@/data/sops/types";
import type { WorkflowState } from "@/lib/storage/schema";

export function loadSop(type: IncidentType): Sop {
  return getSop(type);
}

export function initWorkflow(type: IncidentType): WorkflowState {
  const sop = getSop(type);
  return {
    sopType: type,
    sopVersion: sop.version,
    currentStepId: sop.steps[0]?.id ?? "",
    completedStepIds: [],
    checkedItemIds: [],
    progressPct: 0,
  };
}

export function getStep(sop: Sop, stepId: string): SopStep | undefined {
  return sop.steps.find((s) => s.id === stepId);
}

export function getCurrentStep(state: WorkflowState): SopStep | undefined {
  const sop = getSop(state.sopType);
  return getStep(sop, state.currentStepId);
}

export function computeProgress(state: WorkflowState): number {
  const sop = getSop(state.sopType);
  if (sop.steps.length === 0) return 0;
  return Math.round((state.completedStepIds.length / sop.steps.length) * 100);
}

/** Mark the current step complete and advance to the next. */
export function completeStep(state: WorkflowState): WorkflowState {
  const sop = getSop(state.sopType);
  const idx = sop.steps.findIndex((s) => s.id === state.currentStepId);
  if (idx === -1) return state;

  const completed = state.completedStepIds.includes(state.currentStepId)
    ? state.completedStepIds
    : [...state.completedStepIds, state.currentStepId];

  const next = sop.steps[idx + 1];
  const newState: WorkflowState = {
    ...state,
    completedStepIds: completed,
    currentStepId: next ? next.id : state.currentStepId,
  };
  newState.progressPct = computeProgress(newState);
  return newState;
}

export function goToStep(state: WorkflowState, stepId: string): WorkflowState {
  const sop = getSop(state.sopType);
  if (!getStep(sop, stepId)) return state;
  return { ...state, currentStepId: stepId };
}
