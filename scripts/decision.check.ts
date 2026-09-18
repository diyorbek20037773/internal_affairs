import { DECISION_SCENARIOS } from "@/data/scenarios/decision";
import { validateScenarioGraph } from "@/data/scenarios";
import { LAWS } from "@/data/sops/laws";
import type { DecisionTask } from "@/data/scenarios/types";
import {
  choose,
  resolveBranch,
  resolveTaps,
  scoreOrder,
  scoreRubric,
  scoreScan,
  submitTask,
  timeout,
} from "@/lib/training/decisionEngine";
import { decisionDeterministic } from "@/lib/training/competency";
import { decisionEvidence } from "@/prompts/debrief.uz";
import type { DecisionPayload } from "@/lib/storage/trainingSchema";

let pass = 0, fail = 0;
const check = (name: string, ok: boolean, note = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${note ? " — " + note : ""}`); };

const sc = DECISION_SCENARIOS[0];
const start = (): DecisionPayload => ({ kind: "decision", path: [], currentNodeId: sc.startNodeId });
const node = (id: string) => sc.nodes[id];
type Scan = Extract<DecisionTask, { kind: "scan" }>;
type Order = Extract<DecisionTask, { kind: "order" }>;

// 1) Content integrity.
{
  const problems = validateScenarioGraph();
  check("scenario graph valid", problems.length === 0, problems.join("; "));
  check("exactly one decision scenario", DECISION_SCENARIOS.length === 1);
  const kinds = new Set(Object.values(sc.nodes).map((n) => n.task.kind));
  check("all five task kinds present", ["choice", "scan", "order", "voice", "text"].every((k) => kinds.has(k as never)), [...kinds].join(","));
  const lawKeys: string[] = [...sc.laws];
  for (const n of Object.values(sc.nodes))
    if (n.task.kind === "choice") for (const o of n.task.options) lawKeys.push(...(o.laws ?? []));
  check("every law key exists in laws.ts", lawKeys.every((k) => k in LAWS), lawKeys.filter((k) => !(k in LAWS)).join(","));
  const langs = Object.values(sc.nodes).every((n) => n.situation.ru && n.situation.en);
  check("situations trilingual", langs);
}

// 2) Scan scoring: all hazards → 3, nothing near hazards → 0, false alarms cost.
{
  const task = node("n1").task as Scan;
  const hazards = task.hotspots.filter((h) => h.hazard);
  const all = resolveTaps(task, hazards.map((h) => ({ x: h.x, y: h.y })));
  check("tapping every hazard hits every hazard", all.picks.length === hazards.length && all.misses === 0, JSON.stringify(all));
  check("all hazards → 3", scoreScan(task, all.picks, all.misses) === 3);
  const off = resolveTaps(task, [{ x: 30, y: 95 }, { x: 5, y: 95 }]);
  check("empty-floor taps are misses", off.picks.length === 0 && off.misses === 2, JSON.stringify(off));
  check("no hazards → 0", scoreScan(task, [], 2) === 0);
  const half = hazards.slice(0, 4).map((h) => h.id);
  const withNoise = scoreScan(task, half, 3);
  check("false alarms lower the score", withNoise < scoreScan(task, half, 0), `${withNoise} vs ${scoreScan(task, half, 0)}`);
}

// 3) Order scoring.
{
  const task = node("n4").task as Order;
  check("exact order → 3", scoreOrder(task, task.answer) === 3);
  check("reversed order → ≤1", scoreOrder(task, [...task.answer].reverse()) <= 1, String(scoreOrder(task, [...task.answer].reverse())));
  const swapped = [task.answer[1], task.answer[0], ...task.answer.slice(2)];
  check("one adjacent swap → 2", scoreOrder(task, swapped) === 2, String(scoreOrder(task, swapped)));
}

// 4) Rubric scoring caps.
{
  const full = { a: true, b: true, c: true, d: true, e: true };
  check("full rubric → 3", scoreRubric(full, 5, { violation: false, tooShort: false }) === 3);
  check("violation caps at 1", scoreRubric(full, 5, { violation: true, tooShort: false }) === 1);
  check("too short caps at 1", scoreRubric(full, 5, { violation: false, tooShort: true }) === 1);
  check("2 of 5 → 1", scoreRubric({ a: true, b: true, c: false, d: false, e: false }, 5, { violation: false, tooShort: false }) === 1);
}

// 5) Branching: a weak voice answer escalates, a good one does not.
{
  const task = node("n3").task;
  if (task.kind !== "voice") throw new Error("n3 must be voice");
  check("voice 3 → n4", resolveBranch(task.branches, 3).next === "n4");
  check("voice 1 → escalation n3x", resolveBranch(task.branches, 1).next === "n3x");
}

// 6) Full optimal walk → success, competencies filled from every task kind.
{
  let p = start();
  const scanTask = node("n1").task as Scan;
  const hz = scanTask.hotspots.filter((h) => h.hazard).map((h) => h.id);
  p = submitTask(sc, p, { score: 3, picks: hz }, 20000).payload;
  p = choose(sc, p, "n2-o2", 4000).payload;
  p = submitTask(sc, p, { score: 3, response: "…", rubric: {} }, 30000).payload;
  check("good voice skips the escalation node", p.currentNodeId === "n4", String(p.currentNodeId));
  p = submitTask(sc, p, { score: 3, picks: (node("n4").task as Order).answer }, 15000).payload;
  p = submitTask(sc, p, { score: 3, response: "…", rubric: {} }, 30000).payload;
  p = choose(sc, p, "n6-o1", 3000).payload;
  p = submitTask(sc, p, { score: 2, response: "…", rubric: {} }, 90000).payload;
  const end = choose(sc, p, "n8-o2", 5000);
  check("optimal walk finishes with success", end.finished && end.payload.outcome === "success", JSON.stringify(end.payload.outcome));
  const scores = decisionDeterministic(end.payload, sc);
  check("muloqot scored from voice tasks", (scores.muloqot ?? 0) >= 90, JSON.stringify(scores));
  check("hujjatlashtirish scored from the report", (scores.hujjatlashtirish ?? 0) > 50, String(scores.hujjatlashtirish));
  check("huquqiy_qaror blends choice + text", (scores.huquqiy_qaror ?? 0) >= 80, String(scores.huquqiy_qaror));
  check("natijadorlik = 100 on success", scores.natijadorlik === 100);
  const ev = decisionEvidence(sc, end.payload);
  check("debrief evidence lists every task kind", ["vazifa=scan", "vazifa=voice", "vazifa=order", "vazifa=text", "vazifa=choice"].every((k) => ev.includes(k)));
}

// 7) Timeout on a timed choice records a step and moves on.
{
  let p = start();
  p = submitTask(sc, p, { score: 0, picks: [] }, 5000).payload;
  const r = timeout(sc, p, 15000);
  check("timeout on n2 → n3", r.payload.currentNodeId === "n3" && r.payload.path.at(-1)?.timedOut === true);
  check("timeout step lowers analysis", (decisionDeterministic(r.payload, sc).vaziyat_tahlili ?? 100) < 50);
}

// 8) Ungraded (AI down): benefit-of-the-doubt branch, no competency effect.
{
  let p = start();
  p = submitTask(sc, p, { score: 3, picks: [] }, 1000).payload;
  p = choose(sc, p, "n2-o2", 1000).payload;
  const r = submitTask(sc, p, { score: 2, response: "…", ungraded: true }, 1000);
  check("ungraded voice does not escalate", r.payload.currentNodeId === "n4", String(r.payload.currentNodeId));
  check("ungraded step left out of muloqot", decisionDeterministic(r.payload, sc).muloqot === undefined);
}

console.log(`\n${pass}/${pass + fail} decision checks passed`);
process.exit(fail ? 1 : 0);
