import type { AgencyId, ClusterId, LearningCluster, ProfCompetency, ProfessionId, ProfessionStandard } from "./types";
import { CLUSTERS } from "./clusters";
import { PROFESSIONS } from "./professions";

export * from "./types";
export { AGENCIES, AGENCY_MAP, getAgency } from "./agencies";
export { CLUSTERS, CLUSTER_MAP, SUBJECT_MAP, getCluster, getSubject } from "./clusters";
export { PROFESSIONS, getProfession, isProfessionId } from "./professions";

/** Professions serving an agency (psixolog appears under every agency). */
export function professionsByAgency(agency?: AgencyId | null): ProfessionStandard[] {
  return agency ? PROFESSIONS.filter((p) => p.agencies.includes(agency)) : PROFESSIONS;
}

/** The learning clusters a profession draws on, in the profession's order. */
export function clustersOf(profession: ProfessionId | ProfessionStandard): LearningCluster[] {
  const p = typeof profession === "string" ? PROFESSIONS.find((x) => x.id === profession) : profession;
  if (!p) return [];
  return p.clusters.map((id) => CLUSTERS.find((c) => c.id === id)).filter((c): c is LearningCluster => !!c);
}

/** Reverse map: which professions draw on a cluster. */
export function professionsOfCluster(cluster: ClusterId): ProfessionStandard[] {
  return PROFESSIONS.filter((p) => p.clusters.includes(cluster));
}

/** Competencies (with their profession) that are trained by a subject. */
export function competenciesOfSubject(subjectId: string): { profession: ProfessionStandard; competency: ProfCompetency }[] {
  return PROFESSIONS.flatMap((p) =>
    p.competencies.filter((c) => c.subjects.includes(subjectId)).map((c) => ({ profession: p, competency: c }))
  );
}

/** Every ProfCompetency keyed by its global id (e.g. "tergovchi.dalil"). */
export const allCompetencies: Record<string, ProfCompetency & { professionId: ProfessionId }> = Object.fromEntries(
  PROFESSIONS.flatMap((p) => p.competencies.map((c) => [c.id, { ...c, professionId: p.id }]))
);
