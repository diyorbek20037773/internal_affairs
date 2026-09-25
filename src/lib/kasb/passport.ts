import type { CareerStep, ClusterId, KasbSimResult, ProfessionId, ProfessionStandard } from "@/data/kasblar/types";

/**
 * Kompetensiya pasporti — pure functions, no storage.
 *
 * Evidence: the LATEST finished result per simulator for the profession
 * (other professions ignored), averaged per competency id. For profilaktika
 * the existing Klaster-ID (8 axes) is blended in as one more evidence source.
 */

export const STRENGTH_THRESHOLD = 80;
export const GAP_THRESHOLD = 60;

/** Overall % → level. 1 <50, 2 50–69, 3 70–84, 4 ≥85. */
export const LEVEL_THRESHOLDS = [50, 70, 85] as const;

export function levelFor(score: number): 1 | 2 | 3 | 4 {
  if (score >= LEVEL_THRESHOLDS[2]) return 4;
  if (score >= LEVEL_THRESHOLDS[1]) return 3;
  if (score >= LEVEL_THRESHOLDS[0]) return 2;
  return 1;
}

/** Minimal simulator shape — avoids depending on the sims registry. */
export interface PassportSim {
  id: string;
  professionId: string;
  stages: { competencies: string[] }[];
}

/** Klaster-ID scores (0–100) keyed by the 8 axes; samples optional. */
export interface KlasterIdInput {
  scores: Partial<Record<string, number>>;
  samples?: Partial<Record<string, number>>;
}

/** profilaktika competency slug → Klaster-ID axes averaged into it. */
export const KLASTER_ID_MAP: Record<string, string[]> = {
  huquqiy: ["huquqiy_qaror"],
  muloqot: ["muloqot", "deeskalatsiya"],
  profilaktik_ish: ["profiling", "natijadorlik"],
  hujjat: ["hujjatlashtirish"],
  tahlil: ["vaziyat_tahlili", "raqamli"],
};

export interface PassportCompetency {
  id: string;
  score: number | null;
  /** Number of evidence sources (sim results + Klaster-ID when blended). */
  evidenceCount: number;
  fromKlasterId: boolean;
}

export interface CompetencyPassport {
  professionId: ProfessionId;
  competencies: PassportCompetency[];
  /** Mean of assessed competencies, null when nothing is assessed. */
  overall: number | null;
  level: 1 | 2 | 3 | 4 | null;
  /** Competency ids with score ≥ 80. */
  strengths: string[];
  /** Competency ids with score < 60. */
  gaps: string[];
  /** Competency ids with no evidence yet. */
  unassessed: string[];
  /** Subject ids to (re)study, from gap competencies, most-needed first. */
  recommendedSubjects: string[];
  recommendedClusters: ClusterId[];
  /** Sim ids training gap competencies first, then unassessed ones. */
  recommendedSims: string[];
  /** Finished sim results used as evidence (latest per sim). */
  resultsUsed: number;
  currentCareerStep: CareerStep | null;
  nextCareerStep: CareerStep | null;
}

const avg = (xs: number[]): number | null => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const round = (x: number | null): number | null => (x === null ? null : Math.round(x));

/** Latest finished result per simulator for one profession. */
export function latestPerSim(results: KasbSimResult[], professionId: ProfessionId): KasbSimResult[] {
  const bySim = new Map<string, KasbSimResult>();
  for (const r of results) {
    if (r.professionId !== professionId || !r.finishedAt) continue;
    const prev = bySim.get(r.simId);
    if (!prev || (prev.finishedAt ?? "") < r.finishedAt) bySim.set(r.simId, r);
  }
  return [...bySim.values()];
}

function klasterScoreFor(slug: string, k: KlasterIdInput | null | undefined): number | null {
  if (!k) return null;
  const axes = KLASTER_ID_MAP[slug];
  if (!axes) return null;
  const vals: number[] = [];
  for (const a of axes) {
    const v = k.scores[a];
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    if (k.samples && !(k.samples[a] && (k.samples[a] ?? 0) > 0)) continue; // never measured
    vals.push(v);
  }
  return avg(vals);
}

export function buildPassport(args: {
  profession: ProfessionStandard;
  results: KasbSimResult[];
  klasterId?: KlasterIdInput | null;
  sims?: PassportSim[];
}): CompetencyPassport {
  const { profession, results, klasterId, sims = [] } = args;
  const used = latestPerSim(results, profession.id);

  const competencies: PassportCompetency[] = profession.competencies.map((c) => {
    const vals: number[] = [];
    for (const r of used) {
      const v = r.competencyScores?.[c.id];
      if (typeof v === "number" && Number.isFinite(v)) vals.push(Math.max(0, Math.min(100, v)));
    }
    let score = avg(vals);
    let evidenceCount = vals.length;
    let fromKlasterId = false;
    if (profession.id === "profilaktika") {
      const slug = c.id.slice(c.id.indexOf(".") + 1);
      const k = klasterScoreFor(slug, klasterId);
      if (k !== null) {
        score = score === null ? k : (score + k) / 2;
        evidenceCount += 1;
        fromKlasterId = true;
      }
    }
    return { id: c.id, score: round(score), evidenceCount, fromKlasterId };
  });

  const assessed = competencies.filter((c) => c.score !== null);
  const overall = round(avg(assessed.map((c) => c.score as number)));
  const level = overall === null ? null : levelFor(overall);

  const strengths = assessed.filter((c) => (c.score as number) >= STRENGTH_THRESHOLD).map((c) => c.id);
  const gapRows = assessed
    .filter((c) => (c.score as number) < GAP_THRESHOLD)
    .sort((a, b) => (a.score as number) - (b.score as number));
  const gaps = gapRows.map((c) => c.id);
  const unassessed = competencies.filter((c) => c.score === null).map((c) => c.id);

  const compById = new Map(profession.competencies.map((c) => [c.id, c]));
  const recommendedSubjects: string[] = [];
  const recommendedClusters: ClusterId[] = [];
  for (const id of gaps) {
    const c = compById.get(id);
    if (!c) continue;
    for (const s of c.subjects) if (!recommendedSubjects.includes(s)) recommendedSubjects.push(s);
    for (const cl of c.clusters) if (!recommendedClusters.includes(cl)) recommendedClusters.push(cl);
  }

  const rank = (targets: string[]) =>
    sims
      .filter((s) => s.professionId === profession.id)
      .map((s) => ({
        id: s.id,
        hits: s.stages.reduce((n, st) => n + st.competencies.filter((c) => targets.includes(c)).length, 0),
      }))
      .filter((x) => x.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .map((x) => x.id);
  const recommendedSims: string[] = [];
  for (const id of [...rank(gaps), ...rank(unassessed)]) if (!recommendedSims.includes(id)) recommendedSims.push(id);

  const career = profession.career;
  const idx = level === null ? -1 : Math.min(level - 1, career.length - 1);
  const currentCareerStep = idx >= 0 ? career[idx] : null;
  const nextCareerStep = career.length ? career[Math.min(idx + 1, career.length - 1)] : null;

  return {
    professionId: profession.id,
    competencies,
    overall,
    level,
    strengths,
    gaps,
    unassessed,
    recommendedSubjects,
    recommendedClusters,
    recommendedSims,
    resultsUsed: used.length,
    currentCareerStep,
    nextCareerStep: idx >= career.length - 1 && idx >= 0 ? null : nextCareerStep,
  };
}
