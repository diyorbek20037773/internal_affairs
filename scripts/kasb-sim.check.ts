import { ALL_SIMS } from "@/data/kasblar/sims";
import type { KasbSimResult, SimTask } from "@/data/kasblar/types";
import {
  computeScores,
  finishResult,
  optimalAnswer,
  outcome,
  scoreGrid,
  scoreMatch,
  scoreMulti,
  scoreNumeric,
  scoreOrder,
  scoreTask,
  validateSims,
  withStage,
} from "@/lib/kasb/simEngine";

let pass = 0,
  fail = 0;
const check = (name: string, ok: boolean, note = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${note ? " — " + note : ""}`);
};

async function main() {
  // Competency ids from the profession standards, when that module exists.
  let competencyIds: Set<string> | undefined;
  try {
    const modPath = "@/data/kasblar";
    const mod = (await import(modPath)) as { getProfession?: (id: string) => { competencies: { id: string }[] } | undefined };
    if (typeof mod.getProfession === "function") {
      competencyIds = new Set<string>();
      for (const s of ALL_SIMS) for (const c of mod.getProfession(s.professionId)?.competencies ?? []) competencyIds.add(c.id);
    }
  } catch {
    console.log("NOTE  @/data/kasblar not available — competency ids checked by prefix only");
  }

  console.log(competencyIds ? `NOTE  checking against ${competencyIds.size} competency ids from @/data/kasblar` : "NOTE  competency ids checked by prefix only");

  // 1) Content integrity.
  const problems = validateSims(ALL_SIMS, { competencyIds });
  check(`validateSims over ${ALL_SIMS.length} sims`, problems.length === 0, problems.slice(0, 20).join("; "));
  console.log(`      sims: ${ALL_SIMS.map((s) => `${s.code}(${s.professionId}, ${s.env}, ${s.stages.length} st)`).join(", ")}`);

  // 2) Optimal answers → 100 on every stage; full run → total 100, every competency 100.
  for (const sim of ALL_SIMS) {
    let result: KasbSimResult = {
      id: "t",
      simId: sim.id,
      professionId: sim.professionId,
      traineeId: "x",
      startedAt: new Date().toISOString(),
      stages: [],
      competencyScores: {},
    };
    const bad: string[] = [];
    for (const st of sim.stages) {
      const s = scoreTask(st.task, optimalAnswer(st.task));
      if (s.score !== 100 || s.ungraded) bad.push(`${st.id}=${s.score}`);
      result = withStage(sim, result, { stageId: st.id, score: s.score, answer: null });
    }
    check(`${sim.code}: optimal answers score 100 per stage`, bad.length === 0, bad.join(","));
    const done = finishResult(sim, result);
    const comps = Object.values(done.competencyScores);
    check(`${sim.code}: total 100 & competencies 100`, done.total === 100 && comps.length > 0 && comps.every((c) => c === 100), JSON.stringify(done.competencyScores));
    // Worst-case choice/multi answers are below 50 (consequence would show).
    const lows = sim.stages.filter((st) => st.task.kind === "choice").map((st) => scoreTask(st.task, { kind: "choice", optionId: (st.task as Extract<SimTask, { kind: "choice" }>).options.find((o) => o.score === 0)?.id ?? "" }).score);
    check(`${sim.code}: a score-0 option yields < 50`, lows.every((x) => x < 50));
  }

  // 3) Unit checks of partial credit.
  const multi: Extract<SimTask, { kind: "multi" }> = {
    kind: "multi",
    prompt: { uz: "p" },
    options: [
      { id: "a", text: { uz: "a" }, correct: true },
      { id: "b", text: { uz: "b" }, correct: true },
      { id: "c", text: { uz: "c" }, correct: false },
    ],
  };
  check("multi: one of two correct → 50", scoreMulti(multi, ["a"]) === 50);
  check("multi: correct+wrong cancels", scoreMulti(multi, ["a", "c"]) === 0);
  check("multi: all → floor 0", scoreMulti(multi, ["c"]) === 0);

  check("order: exact → 100", scoreOrder(["a", "b", "c", "d"], ["a", "b", "c", "d"]) === 100);
  check("order: reversed → 0", scoreOrder(["a", "b", "c", "d"], ["d", "c", "b", "a"]) === 0);
  check("order: one adjacent swap → 83", scoreOrder(["a", "b", "c", "d"], ["b", "a", "c", "d"]) === 83);
  check("order: missing item penalised", scoreOrder(["a", "b", "c"], ["a", "b"]) === 33);

  const num: Extract<SimTask, { kind: "numeric" }> = { kind: "numeric", prompt: { uz: "p" }, unit: "", answer: 100, tolerance: 5, solution: { uz: "s" } };
  check("numeric: within tol → 100", scoreNumeric(num, 104) === 100);
  check("numeric: within 3× → 50", scoreNumeric(num, 112) === 50);
  check("numeric: beyond → 0", scoreNumeric(num, 120) === 0);
  check("numeric: NaN → 0", scoreNumeric(num, NaN) === 0);

  const match: Extract<SimTask, { kind: "match" }> = {
    kind: "match",
    prompt: { uz: "p" },
    left: [{ id: "1", text: { uz: "1" } }, { id: "2", text: { uz: "2" } }],
    right: [{ id: "x", text: { uz: "x" } }, { id: "y", text: { uz: "y" } }],
    pairs: [["1", "x"], ["2", "y"]],
  };
  check("match: half → 50", scoreMatch(match, { "1": "x", "2": "x" }) === 50);

  const grid: Extract<SimTask, { kind: "grid" }> = {
    kind: "grid",
    prompt: { uz: "p" },
    rowLabels: ["r0", "r1"],
    colLabels: ["c0", "c1"],
    values: [[1, 9], [8, 2]],
    correct: ["0-1", "1-0"],
    picks: 2,
  };
  check("grid: one hit one miss → 0", scoreGrid(grid, ["0-1", "0-0"]) === 0);
  check("grid: one hit → 50", scoreGrid(grid, ["0-1"]) === 50);

  check("text: ungraded flagged", scoreTask({ kind: "text", prompt: { uz: "p" }, rubric: [{ uz: "r" }], minWords: 1, model: { uz: "m" } }, { kind: "text", text: "x" }).ungraded === true);
  check("text: 2 → 67", scoreTask({ kind: "text", prompt: { uz: "p" }, rubric: [{ uz: "r" }], minWords: 1, model: { uz: "m" } }, { kind: "text", text: "x", aiScore: 2 }).score === 67);

  // Ungraded stages are excluded from competency math.
  {
    const sim = ALL_SIMS[0];
    const [s1, s2] = sim.stages;
    const { competencyScores, total } = computeScores(sim, [
      { stageId: s1.id, score: 80, answer: null },
      { stageId: s2.id, score: 0, answer: null, ungraded: true },
    ]);
    check("ungraded excluded from total", total === 80);
    check("ungraded excluded from competencies", s2.competencies.every((c) => s1.competencies.includes(c) ? competencyScores[c] === 80 : competencyScores[c] === undefined));
  }

  check("outcome bands", outcome(80) === "success" && outcome(60) === "partial" && outcome(20) === "fail");

  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail) process.exit(1);
}

void main();
