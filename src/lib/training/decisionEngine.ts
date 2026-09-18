import type {
  DecisionNode,
  DecisionOption,
  DecisionScenario,
  DecisionStep,
  DecisionTask,
  Score03,
  TaskBranch,
} from "@/data/scenarios/types";
import type { DecisionPayload } from "@/lib/storage/trainingSchema";

/** Pure state transitions for the branching decision graph. */

export function currentNode(scenario: DecisionScenario, p: DecisionPayload): DecisionNode | null {
  return p.currentNodeId ? scenario.nodes[p.currentNodeId] ?? null : null;
}

type ScoredTask = Exclude<DecisionTask, { kind: "choice" }>;

function advance(p: DecisionPayload, step: DecisionStep, next: string | null, outcome?: DecisionPayload["outcome"]) {
  const finished = next === null;
  return {
    payload: {
      kind: "decision" as const,
      path: [...p.path, step],
      currentNodeId: next,
      outcome: finished ? outcome ?? "partial" : p.outcome,
    },
    finished,
  };
}

export function choose(
  scenario: DecisionScenario,
  p: DecisionPayload,
  optionId: string,
  elapsedMs: number
): { payload: DecisionPayload; option: DecisionOption; finished: boolean } {
  const node = currentNode(scenario, p);
  if (!node) throw new Error("no current node");
  if (node.task.kind !== "choice") throw new Error("not a choice node");
  const option = node.task.options.find((o) => o.id === optionId);
  if (!option) throw new Error("unknown option");
  const step: DecisionStep = { nodeId: node.id, optionId, elapsedMs, timedOut: false, task: "choice" };
  return { ...advance(p, step, option.next, option.outcome), option };
}

/** Highest branch the score reaches; branches are authored best-first but we don't rely on it. */
export function resolveBranch(branches: TaskBranch[], score: number): TaskBranch {
  const sorted = [...branches].sort((a, b) => b.minScore - a.minScore);
  return sorted.find((b) => score >= b.minScore) ?? sorted[sorted.length - 1];
}

export interface TaskResult {
  score: Score03;
  response?: string;
  picks?: string[];
  misses?: number;
  rubric?: Record<string, boolean>;
  feedback?: string;
  ungraded?: boolean;
}

export function submitTask(
  scenario: DecisionScenario,
  p: DecisionPayload,
  result: TaskResult,
  elapsedMs: number
): { payload: DecisionPayload; branch: TaskBranch; finished: boolean } {
  const node = currentNode(scenario, p);
  if (!node) throw new Error("no current node");
  if (node.task.kind === "choice") throw new Error("choice node needs choose()");
  const task = node.task as ScoredTask;
  const branch = resolveBranch(task.branches, result.score);
  const step: DecisionStep = {
    nodeId: node.id,
    optionId: null,
    elapsedMs,
    timedOut: false,
    task: task.kind,
    ...result,
  };
  return { ...advance(p, step, branch.next, branch.outcome), branch };
}

export function timeout(
  scenario: DecisionScenario,
  p: DecisionPayload,
  elapsedMs: number
): { payload: DecisionPayload; finished: boolean } {
  const node = currentNode(scenario, p);
  if (!node) throw new Error("no current node");
  const next = node.onTimeout === undefined ? node.id : node.onTimeout;
  const step: DecisionStep = { nodeId: node.id, optionId: null, elapsedMs, timedOut: true, task: node.task.kind };
  const r = advance(p, step, next, "fail");
  return r;
}

/* ------------------------------------------------------------------------ */
/* Deterministic grading for scan / order                                    */
/* ------------------------------------------------------------------------ */

function to03(ratio: number): Score03 {
  const r = Math.max(0, Math.min(1, ratio));
  return (r >= 0.85 ? 3 : r >= 0.6 ? 2 : r >= 0.3 ? 1 : 0) as Score03;
}

/** Share of hazards found; each false alarm (distractor or empty spot) costs half a hazard. */
export function scoreScan(task: Extract<DecisionTask, { kind: "scan" }>, picks: string[], misses = 0): Score03 {
  const hazards = task.hotspots.filter((h) => h.hazard);
  if (!hazards.length) return 3;
  const set = new Set(picks);
  const found = hazards.filter((h) => set.has(h.id)).length;
  const falses = task.hotspots.filter((h) => !h.hazard && set.has(h.id)).length + misses;
  return to03((found - falses * 0.5) / hazards.length);
}

/** Each item scores 1 at its exact slot, 0.5 one slot off. */
export function scoreOrder(task: Extract<DecisionTask, { kind: "order" }>, picks: string[]): Score03 {
  const n = task.answer.length;
  if (!n) return 3;
  let pts = 0;
  task.answer.forEach((id, i) => {
    const at = picks.indexOf(id);
    if (at === i) pts += 1;
    else if (at >= 0 && Math.abs(at - i) === 1) pts += 0.5;
  });
  return to03(pts / n);
}

/** Free-response score from rubric coverage; a violation or a too-short answer caps at 1. */
export function scoreRubric(met: Record<string, boolean>, total: number, opts: { violation: boolean; tooShort: boolean }): Score03 {
  const hits = Object.values(met).filter(Boolean).length;
  const s = total ? Math.round((hits / total) * 3) : 0;
  return Math.min(s, opts.violation || opts.tooShort ? 1 : 3) as Score03;
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Hotspot hit radius in % of the scene width. */
export const SCAN_HIT_RADIUS = 7;

/** Map free taps on the scene to hotspot ids; taps near nothing are misses. */
export function resolveTaps(
  task: Extract<DecisionTask, { kind: "scan" }>,
  taps: { x: number; y: number }[],
  aspect = 1.6
): { picks: string[]; misses: number } {
  const picks = new Set<string>();
  let misses = 0;
  for (const t of taps) {
    let best: { id: string; d: number } | null = null;
    for (const h of task.hotspots) {
      // y is in % of height; scale it to width units so the radius is round on screen.
      const d = Math.hypot(t.x - h.x, (t.y - h.y) / aspect);
      if (d <= SCAN_HIT_RADIUS && (!best || d < best.d)) best = { id: h.id, d };
    }
    if (best) picks.add(best.id);
    else misses++;
  }
  return { picks: [...picks], misses };
}
