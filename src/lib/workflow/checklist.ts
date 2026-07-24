import { getSop } from "@/data/sops";
import type { ChecklistItem } from "@/data/sops/types";
import type { WorkflowState } from "@/lib/storage/schema";

export function toggleChecklistItem(
  state: WorkflowState,
  itemId: string
): WorkflowState {
  const checked = state.checkedItemIds.includes(itemId)
    ? state.checkedItemIds.filter((id) => id !== itemId)
    : [...state.checkedItemIds, itemId];
  return { ...state, checkedItemIds: checked };
}

export function currentChecklist(state: WorkflowState): ChecklistItem[] {
  const sop = getSop(state.sopType);
  const step = sop.steps.find((s) => s.id === state.currentStepId);
  return step?.checklist ?? [];
}

export function remainingChecklistLabels(
  state: WorkflowState,
  locale: string
): string[] {
  return currentChecklist(state)
    .filter((item) => !state.checkedItemIds.includes(item.id))
    .map((item) =>
      locale === "ru" && item.label.ru
        ? item.label.ru
        : locale === "en" && item.label.en
        ? item.label.en
        : item.label.uz
    );
}

export function isStepChecklistComplete(state: WorkflowState): boolean {
  const required = currentChecklist(state).filter((i) => i.required);
  return required.every((i) => state.checkedItemIds.includes(i.id));
}
