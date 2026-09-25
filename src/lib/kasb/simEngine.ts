import type { KasbSimResult, ProfessionSim, SimTask, StageResult } from "@/data/kasblar/types";

/**
 * Kasb simulyatorlari — pure, deterministic scoring. Every task kind maps to
 * 0–100. Only `text` depends on an external (AI) grade, which is passed in;
 * without it the stage is "ungraded" and excluded from competency math.
 */

export type Score03 = 0 | 1 | 2 | 3;

export type SimAnswer =
  | { kind: "choice"; optionId: string }
  | { kind: "multi"; optionIds: string[] }
  | { kind: "order"; sequence: string[] }
  | { kind: "numeric"; value: number }
  /** leftId → rightId */
  | { kind: "match"; pairs: Record<string, string> }
  /** "r-c" keys */
  | { kind: "grid"; cells: string[] }
  /** aiScore is the grader's 0–3; null/undefined = not graded. */
  | { kind: "text"; text: string; aiScore?: Score03 | null };

export interface TaskScore {
  score: number;
  ungraded?: boolean;
}

const clamp100 = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export const TEXT_SCORE: Record<Score03, number> = { 0: 0, 1: 33, 2: 67, 3: 100 };

export function scoreChoice(task: Extract<SimTask, { kind: "choice" }>, optionId: string): number {
  const o = task.options.find((x) => x.id === optionId);
  return o ? clamp100((o.score / 3) * 100) : 0;
}

/** Correct picks minus wrong picks, over the number of correct options; floor 0. */
export function scoreMulti(task: Extract<SimTask, { kind: "multi" }>, picked: string[]): number {
  const set = new Set(picked);
  const correct = task.options.filter((o) => o.correct);
  if (correct.length === 0) return 0;
  let hits = 0;
  let wrong = 0;
  for (const o of task.options) {
    if (!set.has(o.id)) continue;
    if (o.correct) hits++;
    else wrong++;
  }
  return clamp100((Math.max(0, hits - wrong) / correct.length) * 100);
}

/**
 * Kendall-like partial credit: the share of item pairs whose relative order
 * matches the correct sequence. Items missing from the answer count as
 * discordant for every pair they're in.
 */
export function scoreOrder(correct: string[], sequence: string[]): number {
  const n = correct.length;
  if (n < 2) return sequence[0] === correct[0] ? 100 : 0;
  const pos = new Map<string, number>();
  sequence.forEach((id, i) => {
    if (!pos.has(id)) pos.set(id, i);
  });
  let concordant = 0;
  const total = (n * (n - 1)) / 2;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = pos.get(correct[i]);
      const b = pos.get(correct[j]);
      if (a !== undefined && b !== undefined && a < b) concordant++;
    }
  }
  return clamp100((concordant / total) * 100);
}

/** Full within tolerance, half within 3× tolerance. */
export function scoreNumeric(task: Extract<SimTask, { kind: "numeric" }>, value: number): number {
  if (!Number.isFinite(value)) return 0;
  const d = Math.abs(value - task.answer);
  const tol = Math.max(0, task.tolerance);
  if (d <= tol + 1e-9) return 100;
  if (d <= 3 * tol + 1e-9) return 50;
  return 0;
}

export function scoreMatch(task: Extract<SimTask, { kind: "match" }>, pairs: Record<string, string>): number {
  if (task.pairs.length === 0) return 0;
  const ok = task.pairs.filter(([l, r]) => pairs[l] === r).length;
  return clamp100((ok / task.pairs.length) * 100);
}

/** (hits − false picks) / required picks; floor 0. */
export function scoreGrid(task: Extract<SimTask, { kind: "grid" }>, cells: string[]): number {
  const correct = new Set(task.correct);
  const uniq = [...new Set(cells)];
  let hits = 0;
  let wrong = 0;
  for (const c of uniq) {
    if (correct.has(c)) hits++;
    else wrong++;
  }
  const denom = Math.max(1, Math.min(task.picks, task.correct.length));
  return clamp100((Math.max(0, hits - wrong) / denom) * 100);
}

export function scoreText(aiScore: Score03 | null | undefined): TaskScore {
  if (aiScore === null || aiScore === undefined) return { score: 0, ungraded: true };
  return { score: TEXT_SCORE[aiScore] };
}

export function scoreTask(task: SimTask, answer: SimAnswer): TaskScore {
  if (task.kind !== answer.kind) return { score: 0 };
  switch (task.kind) {
    case "choice":
      return { score: scoreChoice(task, (answer as Extract<SimAnswer, { kind: "choice" }>).optionId) };
    case "multi":
      return { score: scoreMulti(task, (answer as Extract<SimAnswer, { kind: "multi" }>).optionIds) };
    case "order":
      return { score: scoreOrder(task.correct, (answer as Extract<SimAnswer, { kind: "order" }>).sequence) };
    case "numeric":
      return { score: scoreNumeric(task, (answer as Extract<SimAnswer, { kind: "numeric" }>).value) };
    case "match":
      return { score: scoreMatch(task, (answer as Extract<SimAnswer, { kind: "match" }>).pairs) };
    case "grid":
      return { score: scoreGrid(task, (answer as Extract<SimAnswer, { kind: "grid" }>).cells) };
    case "text":
      return scoreText((answer as Extract<SimAnswer, { kind: "text" }>).aiScore);
  }
}

/** The answer that should earn 100 on a stage (used by the check script and the review UI). */
export function optimalAnswer(task: SimTask): SimAnswer {
  switch (task.kind) {
    case "choice": {
      const best = [...task.options].sort((a, b) => b.score - a.score)[0];
      return { kind: "choice", optionId: best?.id ?? "" };
    }
    case "multi":
      return { kind: "multi", optionIds: task.options.filter((o) => o.correct).map((o) => o.id) };
    case "order":
      return { kind: "order", sequence: [...task.correct] };
    case "numeric":
      return { kind: "numeric", value: task.answer };
    case "match":
      return { kind: "match", pairs: Object.fromEntries(task.pairs) };
    case "grid":
      return { kind: "grid", cells: [...task.correct] };
    case "text":
      return { kind: "text", text: "", aiScore: 3 };
  }
}

export function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/* ------------------------------------------------------------------ */
/* Result aggregation                                                   */
/* ------------------------------------------------------------------ */

const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);

/** Upsert one stage result (keeps sim stage order). */
export function withStage(sim: ProfessionSim, result: KasbSimResult, stage: StageResult): KasbSimResult {
  const rest = result.stages.filter((s) => s.stageId !== stage.stageId);
  const order = new Map(sim.stages.map((s, i) => [s.id, i]));
  const stages = [...rest, stage].sort((a, b) => (order.get(a.stageId) ?? 0) - (order.get(b.stageId) ?? 0));
  return { ...result, stages };
}

/** Per-competency averages of graded stage scores + overall total. */
export function computeScores(sim: ProfessionSim, stages: StageResult[]): { competencyScores: Record<string, number>; total: number } {
  const byStage = new Map(stages.map((s) => [s.stageId, s]));
  const buckets: Record<string, number[]> = {};
  const graded: number[] = [];
  for (const st of sim.stages) {
    const r = byStage.get(st.id);
    if (!r || r.ungraded) continue;
    graded.push(r.score);
    for (const c of st.competencies) (buckets[c] ??= []).push(r.score);
  }
  const competencyScores: Record<string, number> = {};
  for (const [c, xs] of Object.entries(buckets)) competencyScores[c] = avg(xs);
  return { competencyScores, total: avg(graded) };
}

export function finishResult(sim: ProfessionSim, result: KasbSimResult): KasbSimResult {
  const { competencyScores, total } = computeScores(sim, result.stages);
  return { ...result, competencyScores, total, finishedAt: result.finishedAt ?? new Date().toISOString() };
}

export type SimOutcome = "success" | "partial" | "fail";

export function outcome(total: number): SimOutcome {
  if (total >= 75) return "success";
  if (total >= 50) return "partial";
  return "fail";
}

/* ------------------------------------------------------------------ */
/* Content validation                                                   */
/* ------------------------------------------------------------------ */

export interface ValidateOptions {
  /** Known ProfCompetency ids (from the profession standards). When given, every stage competency must be in it. */
  competencyIds?: Set<string>;
}

const hasUz = (t: { uz?: string } | undefined) => !!t && typeof t.uz === "string" && t.uz.trim().length > 0;

export function validateSims(sims: ProfessionSim[], opts: ValidateOptions = {}): string[] {
  const errors: string[] = [];
  const simIds = new Set<string>();
  const codes = new Set<string>();
  for (const sim of sims) {
    const at = sim.id;
    if (simIds.has(sim.id)) errors.push(`${at}: duplicate sim id`);
    simIds.add(sim.id);
    if (codes.has(sim.code)) errors.push(`${at}: duplicate code ${sim.code}`);
    codes.add(sim.code);
    if (!hasUz(sim.title) || !hasUz(sim.intro) || !hasUz(sim.setting)) errors.push(`${at}: missing title/intro/setting`);
    if (!(sim.minutes > 0)) errors.push(`${at}: minutes must be > 0`);
    if (sim.stages.length < 3) errors.push(`${at}: fewer than 3 stages`);

    const stageIds = new Set<string>();
    const materialIds = new Set<string>();
    for (const st of sim.stages) {
      const sa = `${at}/${st.id}`;
      if (stageIds.has(st.id)) errors.push(`${sa}: duplicate stage id`);
      stageIds.add(st.id);
      if (!hasUz(st.title) || !hasUz(st.brief)) errors.push(`${sa}: missing title/brief`);
      if (!hasUz(st.consequence)) errors.push(`${sa}: missing consequence`);
      if (st.competencies.length === 0) errors.push(`${sa}: no competencies`);
      for (const c of st.competencies) {
        if (!c.startsWith(`${sim.professionId}.`)) errors.push(`${sa}: competency ${c} not of profession ${sim.professionId}`);
        if (opts.competencyIds && !opts.competencyIds.has(c)) errors.push(`${sa}: unknown competency ${c}`);
      }
      for (const m of st.materials) {
        if (materialIds.has(m.id)) errors.push(`${sa}: duplicate material id ${m.id}`);
        materialIds.add(m.id);
        if (!hasUz(m.title)) errors.push(`${sa}: material ${m.id} missing title`);
        if (m.table) {
          const w = m.table.head.length;
          if (m.table.rows.some((r) => r.length !== w)) errors.push(`${sa}: material ${m.id} table row width != head`);
        }
      }
      errors.push(...validateTask(st.task).map((e) => `${sa}: ${e}`));
    }
  }
  return errors;
}

function dupIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const d: string[] = [];
  for (const id of ids) {
    if (seen.has(id)) d.push(id);
    seen.add(id);
  }
  return d;
}

export function validateTask(task: SimTask): string[] {
  const e: string[] = [];
  if (!hasUz(task.prompt)) e.push("task prompt missing");
  switch (task.kind) {
    case "choice": {
      if (task.options.length < 2) e.push("choice needs ≥2 options");
      if (!task.options.some((o) => o.score === 3)) e.push("choice has no option with score 3");
      if (dupIds(task.options.map((o) => o.id)).length) e.push("choice duplicate option ids");
      if (task.options.some((o) => !hasUz(o.feedback))) e.push("choice option without feedback");
      break;
    }
    case "multi": {
      if (!task.options.some((o) => o.correct)) e.push("multi has no correct option");
      if (!task.options.some((o) => !o.correct)) e.push("multi has no distractor");
      if (dupIds(task.options.map((o) => o.id)).length) e.push("multi duplicate option ids");
      break;
    }
    case "order": {
      const ids = new Set(task.items.map((i) => i.id));
      if (dupIds(task.items.map((i) => i.id)).length) e.push("order duplicate item ids");
      if (task.correct.length !== task.items.length) e.push("order correct length != items");
      for (const c of task.correct) if (!ids.has(c)) e.push(`order correct id ${c} not in items`);
      if (dupIds(task.correct).length) e.push("order correct has duplicates");
      break;
    }
    case "numeric": {
      if (!Number.isFinite(task.answer)) e.push("numeric answer not finite");
      if (!(task.tolerance >= 0)) e.push("numeric tolerance < 0");
      if (!hasUz(task.solution)) e.push("numeric solution missing");
      break;
    }
    case "match": {
      const l = new Set(task.left.map((x) => x.id));
      const r = new Set(task.right.map((x) => x.id));
      if (dupIds(task.left.map((x) => x.id)).length || dupIds(task.right.map((x) => x.id)).length) e.push("match duplicate ids");
      for (const [a, b] of task.pairs) {
        if (!l.has(a)) e.push(`match pair left ${a} unknown`);
        if (!r.has(b)) e.push(`match pair right ${b} unknown`);
      }
      if (dupIds(task.pairs.map((p) => p[0])).length) e.push("match left used twice in pairs");
      if (task.pairs.length !== task.left.length) e.push("match: every left item needs exactly one pair");
      break;
    }
    case "grid": {
      const rows = task.rowLabels.length;
      const cols = task.colLabels.length;
      if (task.values.length !== rows) e.push("grid values rows != rowLabels");
      if (task.values.some((r) => r.length !== cols)) e.push("grid values cols != colLabels");
      for (const k of task.correct) {
        const m = /^(\d+)-(\d+)$/.exec(k);
        if (!m || Number(m[1]) >= rows || Number(m[2]) >= cols) e.push(`grid correct key ${k} out of range`);
      }
      if (task.picks !== task.correct.length) e.push("grid picks != correct.length");
      if (dupIds(task.correct).length) e.push("grid correct duplicates");
      break;
    }
    case "text": {
      if (task.rubric.length === 0) e.push("text rubric empty");
      if (!(task.minWords > 0)) e.push("text minWords must be > 0");
      if (!hasUz(task.model)) e.push("text model answer missing");
      break;
    }
  }
  return e;
}
