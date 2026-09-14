import type {
  DecisionScenario,
  DialogScenario,
  ExamScenario,
  MahallaScenario,
  Scenario,
  ScenarioKind,
} from "./types";
import { DIALOG_SCENARIOS } from "./dialog";
import { DECISION_SCENARIOS } from "./decision";
import { MAHALLA_SCENARIOS } from "./mahalla";
import { birKunlikXizmat } from "./exam/bir-kunlik-xizmat";

export * from "./types";
export * from "./competencies";

export const EXAM_SCENARIOS: ExamScenario[] = [birKunlikXizmat];

export const ALL_SCENARIOS: Scenario[] = [
  ...DIALOG_SCENARIOS,
  ...DECISION_SCENARIOS,
  ...MAHALLA_SCENARIOS,
  ...EXAM_SCENARIOS,
];

const BY_ID = new Map<string, Scenario>(ALL_SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: string): Scenario | undefined {
  return BY_ID.get(id);
}

export function getDialogScenario(id: string): DialogScenario | undefined {
  const s = BY_ID.get(id);
  return s?.kind === "dialog" ? s : undefined;
}

export function getDecisionScenario(id: string): DecisionScenario | undefined {
  const s = BY_ID.get(id);
  return s?.kind === "decision" ? s : undefined;
}

export function getMahallaScenario(id: string): MahallaScenario | undefined {
  const s = BY_ID.get(id);
  return s?.kind === "mahalla" ? s : undefined;
}

export function getExamScenario(id: string): ExamScenario | undefined {
  const s = BY_ID.get(id);
  return s?.kind === "exam" ? s : undefined;
}

export function listScenarios(kind?: ScenarioKind): Scenario[] {
  return kind ? ALL_SCENARIOS.filter((s) => s.kind === kind) : ALL_SCENARIOS;
}

/**
 * Dev-time integrity check: every `next` / `onTimeout` id in a decision graph
 * must exist, every exam stage must point at a real scenario. Returns a list
 * of problems (empty = OK). Called from the Simulyator hub in development.
 */
export function validateScenarioGraph(): string[] {
  const problems: string[] = [];
  for (const s of DECISION_SCENARIOS) {
    if (!s.nodes[s.startNodeId]) problems.push(`${s.id}: startNodeId ${s.startNodeId} missing`);
    for (const node of Object.values(s.nodes)) {
      if (node.onTimeout && !s.nodes[node.onTimeout])
        problems.push(`${s.id}/${node.id}: onTimeout → ${node.onTimeout} missing`);
      if (node.options.length === 0) problems.push(`${s.id}/${node.id}: no options`);
      for (const o of node.options) {
        if (o.next && !s.nodes[o.next])
          problems.push(`${s.id}/${node.id}/${o.id}: next → ${o.next} missing`);
        if (o.next === null && !o.outcome)
          problems.push(`${s.id}/${node.id}/${o.id}: terminal without outcome`);
      }
    }
  }
  for (const e of EXAM_SCENARIOS) {
    for (const st of e.stages) {
      const target = BY_ID.get(st.scenarioId);
      if (!target) problems.push(`${e.id}: stage ${st.time} → ${st.scenarioId} missing`);
      else if (target.kind !== st.kind)
        problems.push(`${e.id}: stage ${st.time} kind mismatch (${target.kind} ≠ ${st.kind})`);
    }
  }
  for (const m of MAHALLA_SCENARIOS) {
    const pids = new Set(m.problems.map((p) => p.id));
    for (const f of m.feed)
      if (!pids.has(f.problemId)) problems.push(`${m.id}: feed ${f.id} → problem ${f.problemId} missing`);
    for (const id of m.answerKey.top3)
      if (!pids.has(id)) problems.push(`${m.id}: answerKey.top3 ${id} missing`);
  }
  return problems;
}
