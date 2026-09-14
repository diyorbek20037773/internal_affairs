import type { DecisionNode, DecisionOption, DecisionScenario } from "@/data/scenarios/types";
import type { DecisionPayload } from "@/lib/storage/trainingSchema";

/** Pure state transitions for the branching decision graph. */

export function currentNode(scenario: DecisionScenario, p: DecisionPayload): DecisionNode | null {
  return p.currentNodeId ? scenario.nodes[p.currentNodeId] ?? null : null;
}

export function choose(
  scenario: DecisionScenario,
  p: DecisionPayload,
  optionId: string,
  elapsedMs: number
): { payload: DecisionPayload; option: DecisionOption; finished: boolean } {
  const node = currentNode(scenario, p);
  if (!node) throw new Error("no current node");
  const option = node.options.find((o) => o.id === optionId);
  if (!option) throw new Error("unknown option");

  const path = [...p.path, { nodeId: node.id, optionId, elapsedMs, timedOut: false }];
  const finished = option.next === null;
  return {
    payload: {
      kind: "decision",
      path,
      currentNodeId: option.next,
      outcome: finished ? option.outcome ?? "partial" : p.outcome,
    },
    option,
    finished,
  };
}

export function timeout(
  scenario: DecisionScenario,
  p: DecisionPayload,
  elapsedMs: number
): { payload: DecisionPayload; finished: boolean } {
  const node = currentNode(scenario, p);
  if (!node) throw new Error("no current node");
  const path = [...p.path, { nodeId: node.id, optionId: null, elapsedMs, timedOut: true }];
  const next = node.onTimeout === undefined ? node.id : node.onTimeout;
  const finished = next === null;
  return {
    payload: {
      kind: "decision",
      path,
      currentNodeId: next,
      outcome: finished ? "fail" : p.outcome,
    },
    finished,
  };
}
