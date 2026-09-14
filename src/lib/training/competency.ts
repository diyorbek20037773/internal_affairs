import {
  COMPETENCIES,
  clampScore,
  emptyScores,
  type Competency,
  type CompetencyScores,
} from "@/data/scenarios/competencies";
import type { DecisionScenario, DialogScenario, DocumentGrade, MahallaGrade } from "@/data/scenarios/types";
import type { TirPayload } from "@/lib/storage/trainingSchema";
import type {
  DecisionPayload,
  DialogPayload,
  HimoyaId,
  TrainingSession,
} from "@/lib/storage/trainingSchema";

/* ------------------------------------------------------------------------ */
/* Deterministic per-kind scoring                                            */
/* ------------------------------------------------------------------------ */

const POSITIVE_FLAGS = new Set(["faol_tinglash", "empatiya", "savol_ochiq", "huquqiy_tushuntirish"]);
const NEGATIVE_FLAGS = new Set(["haqorat", "tahdid", "qonun_buzilishi"]);

export function dialogDeterministic(
  payload: DialogPayload,
  scenario: DialogScenario
): Partial<CompetencyScores> {
  const officerTurns = payload.transcript.filter((t) => t.role === "officer" && t.assessment);
  const n = officerTurns.length;
  const finalTension = payload.state.tension;

  // De-escalation: where tension ended, plus credit for a downward trajectory.
  const drops = officerTurns.filter((t) => (t.assessment?.delta.tension ?? 0) < 0).length;
  const trajectoryBonus = n > 0 ? (drops / n) * 20 : 0;
  const deeskalatsiya = clampScore(100 - finalTension * 0.8 + trajectoryBonus - 10);

  // Communication: share of constructive turns minus penalties.
  let pos = 0;
  let neg = 0;
  for (const t of officerTurns) {
    const flags = t.assessment?.flags ?? [];
    if (flags.some((f) => POSITIVE_FLAGS.has(f))) pos++;
    if (flags.some((f) => NEGATIVE_FLAGS.has(f))) neg++;
  }
  const muloqot = n > 0 ? clampScore((pos / n) * 100 - neg * 20) : 0;

  // Profiling: hidden facts surfaced.
  const total = scenario.persona.secretFacts.length;
  const profiling = total > 0 ? clampScore((payload.state.revealed.length / total) * 100) : 50;

  // Outcome.
  const natijadorlik =
    payload.endReason === "kelishuv" ? 100 : payload.endReason === "limit" ? 50 : 0;

  return { deeskalatsiya, muloqot, profiling, natijadorlik };
}

export function decisionDeterministic(
  payload: DecisionPayload,
  scenario: DecisionScenario
): Partial<CompetencyScores> {
  const legal: number[] = [];
  const prop: number[] = [];
  for (const step of payload.path) {
    const node = scenario.nodes[step.nodeId];
    if (!node) continue;
    if (step.timedOut || !step.optionId) {
      // Speed is never graded; a timeout only says the situation was not assessed.
      prop.push(0);
      continue;
    }
    const opt = node.options.find((o) => o.id === step.optionId);
    if (!opt) continue;
    legal.push(opt.legality);
    prop.push(opt.proportionality);
  }
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const huquqiy_qaror = clampScore((mean(legal) / 3) * 100);
  const vaziyat_tahlili = clampScore((mean(prop) / 3) * 100);
  const natijadorlik =
    payload.outcome === "success" ? 100 : payload.outcome === "partial" ? 55 : 10;
  // De-escalation credit: never chose an option with proportionality 0.
  const deeskalatsiya = clampScore(100 - prop.filter((p) => p === 0).length * 35);
  return { huquqiy_qaror, vaziyat_tahlili, natijadorlik, deeskalatsiya };
}

/** 3 pts exact position, 1 pt present in top-3 but wrong slot; max 9. */
export function prioritizationScore(picked: string[], answer: string[]): number {
  let pts = 0;
  answer.forEach((id, i) => {
    if (picked[i] === id) pts += 3;
    else if (picked.includes(id)) pts += 1;
  });
  return clampScore((pts / 9) * 100);
}

export function mahallaDeterministic(grade: MahallaGrade): Partial<CompetencyScores> {
  const planMean = (() => {
    const vals = Object.values(grade.planScores).map((p) => p.score);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  })();
  return {
    vaziyat_tahlili: clampScore(grade.prioritizationScore * 0.7 + planMean * 0.3),
    raqamli: clampScore(grade.prioritizationScore),
    hujjatlashtirish: clampScore(planMean),
    natijadorlik: clampScore((grade.prioritizationScore + planMean) / 2),
  };
}

export function documentDeterministic(grade: DocumentGrade): Partial<CompetencyScores> {
  const total = Object.keys(grade.elements).length || 1;
  const present = Object.values(grade.elements).filter((e) => e.present).length;
  const coverage = (present / total) * 100;
  return {
    hujjatlashtirish: clampScore(grade.score),
    huquqiy_qaror: clampScore(100 - grade.legalErrors.length * 25),
    vaziyat_tahlili: clampScore(coverage - grade.factErrors.length * 15),
  };
}

export function tirDeterministic(p: TirPayload): Partial<CompetencyScores> {
  const acts = p.events.filter((e) => e.kind === "action" && e.legality != null);
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const legal = acts.map((e) => e.legality ?? 3);
  const prop = acts.map((e) => e.proportionality ?? 3);
  // An unlawful shot dominates the legal score.
  const unlawfulShot = acts.some((e) => e.action === "shoot" && (e.legality ?? 3) === 0);
  const huquqiy_qaror = clampScore(unlawfulShot ? Math.min(20, (mean(legal) / 3) * 100) : (mean(legal) / 3) * 100);
  const vaziyat_tahlili = clampScore((mean(prop) / 3) * 100);
  const talks = acts.filter((e) => e.action?.startsWith("talk_")).length;
  const threats = acts.filter((e) => e.action === "talk_threat").length;
  const firstTalk = acts.find((e) => e.action?.startsWith("talk_"))?.t;
  const earlyTalkBonus = firstTalk != null && firstTalk <= 10 ? 15 : 0;
  const deeskalatsiya = clampScore(40 + Math.min(talks, 5) * 8 - threats * 12 + earlyTalkBonus - (unlawfulShot ? 40 : 0));
  const civilianHit = p.outcome === "civilian_hit";
  const natijadorlik =
    p.outcome === "resolved_verbal" ? 100
    : p.outcome === "vehicle_stopped" ? 90
    : p.outcome === "resolved_less_lethal" ? 85
    : p.outcome === "range_complete" ? clampScore(50 + (p.hitFactor ?? 0) * 25)
    : p.outcome === "resolved_lethal_lawful" ? 60
    : p.outcome === "timeout" ? 40
    : 5;
  const officerHitsPenalty = (p.officerHits ?? 0) * 15;
  return {
    huquqiy_qaror: clampScore(civilianHit ? Math.min(10, huquqiy_qaror) : huquqiy_qaror),
    vaziyat_tahlili: clampScore(vaziyat_tahlili - officerHitsPenalty - (civilianHit ? 40 : 0)),
    deeskalatsiya,
    natijadorlik,
  };
}

/* ------------------------------------------------------------------------ */
/* Blend + HIMOYA-ID update                                                  */
/* ------------------------------------------------------------------------ */

/** final = 0.6·deterministic + 0.4·llm where deterministic exists, else llm. */
export function blendScores(
  det: Partial<CompetencyScores> | undefined,
  llm: CompetencyScores
): CompetencyScores {
  const out = emptyScores();
  for (const c of COMPETENCIES) {
    const d = det?.[c];
    out[c] = d == null ? clampScore(llm[c]) : clampScore(0.6 * d + 0.4 * llm[c]);
  }
  return out;
}

/** Competencies this session is allowed to move on the HIMOYA-ID. */
export function assessedCompetencies(
  session: TrainingSession,
  scenarioTags: Competency[]
): Competency[] {
  const set = new Set<Competency>(scenarioTags);
  for (const k of Object.keys(session.deterministicScores ?? {})) set.add(k as Competency);
  return Array.from(set);
}

export function newHimoyaId(traineeId: string): HimoyaId {
  return {
    traineeId,
    scores: emptyScores(),
    samples: Object.fromEntries(COMPETENCIES.map((c) => [c, 0])) as Record<Competency, number>,
    updatedAt: new Date().toISOString(),
    history: [],
  };
}

/** Rolling mean per assessed competency. Untouched competencies keep their value. */
export function applySessionToHimoyaId(
  current: HimoyaId,
  session: TrainingSession,
  assessed: Competency[]
): HimoyaId {
  if (!session.finalScores) return current;
  if (current.history.some((h) => h.sessionId === session.id)) return current;
  const scores = { ...current.scores };
  const samples = { ...current.samples };
  for (const c of assessed) {
    const n = samples[c] ?? 0;
    const s = session.finalScores[c];
    scores[c] = clampScore((scores[c] * n + s) / (n + 1));
    samples[c] = n + 1;
  }
  return {
    ...current,
    scores,
    samples,
    updatedAt: new Date().toISOString(),
    history: [
      ...current.history,
      { sessionId: session.id, at: new Date().toISOString(), scores: session.finalScores },
    ],
  };
}

export function strengthsAndGaps(h: HimoyaId, k = 3) {
  const rated = COMPETENCIES.filter((c) => (h.samples[c] ?? 0) > 0);
  const sorted = [...rated].sort((a, b) => h.scores[b] - h.scores[a]);
  const strengths = sorted.slice(0, k);
  // Gaps never overlap strengths; with few rated axes show only what is left.
  const gaps = sorted.filter((c) => !strengths.includes(c)).slice(-k).reverse();
  return { strengths, gaps };
}

/**
 * "Amaliy xizmat" (pptx slide 2/10): a 30–90 day service KPI entered by the
 * instructor feeds the natijadorlik axis so training ↔ service stay linked.
 */
export function applyKpiToHimoyaId(current: HimoyaId, kpi: number, at = new Date().toISOString()): HimoyaId {
  const c: Competency = "natijadorlik";
  const n = current.samples[c] ?? 0;
  const score = clampScore((current.scores[c] * n + clampScore(kpi)) / (n + 1));
  const scores = { ...current.scores, [c]: score };
  return {
    ...current,
    scores,
    samples: { ...current.samples, [c]: n + 1 },
    updatedAt: at,
    history: [...current.history, { sessionId: `kpi:${at}`, at, scores }],
  };
}
