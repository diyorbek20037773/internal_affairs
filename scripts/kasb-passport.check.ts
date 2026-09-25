import { AGENCIES, CLUSTERS, PROFESSIONS, SUBJECT_MAP, PROFESSION_IDS, allCompetencies, professionsByAgency } from "@/data/kasblar";
import type { KasbSimResult } from "@/data/kasblar/types";
import { LAWS } from "@/data/sops/laws";
import { buildPassport, latestPerSim, levelFor } from "@/lib/kasb/passport";

let pass = 0, fail = 0;
const check = (name: string, ok: boolean, note = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${note ? " — " + note : ""}`); };

// 1) Content integrity.
const SLUGS: Record<string, string[]> = {
  profilaktika: ["huquqiy", "muloqot", "profilaktik_ish", "hujjat", "tahlil"],
  tergovchi: ["protsessual", "dalil", "taktika", "tahlil", "hujjat"],
  surishtiruvchi: ["qabul", "malaka", "protsessual", "muddat", "hujjat"],
  ekspert: ["aniqlash", "qadoqlash", "tahlil", "xulosa", "zanjir"],
  kiber: ["osint", "raqamli_iz", "fishing", "moliyaviy", "hujjat"],
  bojxona: ["hujjat_nazorat", "tasnif", "tolov", "xavf", "qaror"],
  tahlilchi: ["malumot", "statistika", "geo", "prognoz", "xulosa"],
  prokuror: ["nazorat", "protsessual", "huquq_himoya", "xulosa", "hujjat"],
  psixolog: ["baholash", "suhbat", "inqiroz", "profilaktika", "xulosa"],
  gvardiyachi: ["qoriqlash", "tartib", "kuch", "muloqot", "hamkorlik"],
  qutqaruvchi: ["xavf_baholash", "evakuatsiya", "birinchi_yordam", "boshqaruv", "hujjat"],
};
check("5 agencies", AGENCIES.length === 5);
check("7 clusters", CLUSTERS.length === 7);
check("clusters have 5–8 subjects", CLUSTERS.every((c) => c.subjects.length >= 5 && c.subjects.length <= 8));
check("subject ids unique", Object.keys(SUBJECT_MAP).length === CLUSTERS.reduce((n, c) => n + c.subjects.length, 0));
check("11 professions in id order", PROFESSIONS.map((p) => p.id).join() === PROFESSION_IDS.join());
for (const p of PROFESSIONS) {
  const ids = p.competencies.map((c) => c.id);
  const want = SLUGS[p.id].map((s) => `${p.id}.${s}`);
  const probs: string[] = [];
  if (ids.join() !== want.join()) probs.push(`competency ids ${ids.join()}`);
  if (p.functions.length < 3 || p.functions.length > 5) probs.push("functions");
  if (p.functions.some((f) => f.tasks.length < 3 || f.tasks.length > 5)) probs.push("tasks");
  if (p.knowledge.length < 6 || p.skills.length < 6) probs.push("knowledge/skills");
  if (p.levels.length !== 4) probs.push("levels");
  if (p.career.length < 4 || p.career.length > 5) probs.push("career");
  const badSubj = p.competencies.flatMap((c) => c.subjects).filter((s) => !SUBJECT_MAP[s]);
  if (badSubj.length) probs.push(`unknown subjects ${badSubj.join()}`);
  const badLaw = p.legalBasis.filter((l) => (l.lawKey ? !(l.lawKey in LAWS) : !l.title));
  if (badLaw.length) probs.push("legal basis");
  if (p.legalBasis.some((l) => l.title && /\d+\s*-?\s*modda/i.test(l.title.uz))) probs.push("article number in title");
  const compClustersOutside = p.competencies.flatMap((c) => c.clusters).filter((c) => !p.clusters.includes(c));
  if (compClustersOutside.length) probs.push(`competency clusters not in profession: ${compClustersOutside.join()}`);
  const subjOutside = p.competencies.flatMap((c) => c.subjects).filter((s) => SUBJECT_MAP[s] && !p.clusters.includes(SUBJECT_MAP[s].cluster));
  if (subjOutside.length) probs.push(`subjects outside profession clusters: ${subjOutside.join()}`);
  if (!p.title.ru || !p.title.en || !p.short.ru || !p.short.en) probs.push("title/short not trilingual");
  check(`profession ${p.id} well-formed`, probs.length === 0, probs.join("; "));
}
check("allCompetencies has 55 ids", Object.keys(allCompetencies).length === 55);
check("psixolog under every agency", AGENCIES.every((a) => professionsByAgency(a.id).some((p) => p.id === "psixolog")));

// 2) Passport math.
const prof = PROFESSIONS.find((p) => p.id === "tergovchi")!;
const mk = (id: string, simId: string, at: string, scores: Record<string, number>, professionId = "tergovchi"): KasbSimResult => ({
  id, simId, professionId: professionId as KasbSimResult["professionId"], traineeId: "t1",
  startedAt: at, finishedAt: at, stages: [], competencyScores: scores,
});
const results = [
  mk("a", "sim-t-01", "2026-01-01", { "tergovchi.dalil": 20, "tergovchi.protsessual": 90 }),
  mk("b", "sim-t-01", "2026-02-01", { "tergovchi.dalil": 40, "tergovchi.protsessual": 90 }), // latest for sim-t-01
  mk("c", "sim-t-02", "2026-01-15", { "tergovchi.dalil": 60, "tergovchi.taktika": 85 }),
  mk("d", "sim-x", "2026-03-01", { "tergovchi.dalil": 0 }, "ekspert"), // other profession — ignored
  { ...mk("e", "sim-t-03", "2026-03-01", { "tergovchi.hujjat": 10 }), finishedAt: undefined }, // unfinished — ignored
];
check("latestPerSim keeps 2", latestPerSim(results, "tergovchi").length === 2);
const sims = [
  { id: "sim-t-01", professionId: "tergovchi", stages: [{ competencies: ["tergovchi.protsessual"] }] },
  { id: "sim-t-02", professionId: "tergovchi", stages: [{ competencies: ["tergovchi.dalil"] }, { competencies: ["tergovchi.dalil"] }] },
  { id: "sim-t-03", professionId: "tergovchi", stages: [{ competencies: ["tergovchi.hujjat"] }] },
  { id: "sim-e-01", professionId: "ekspert", stages: [{ competencies: ["tergovchi.dalil"] }] },
];
const pp = buildPassport({ profession: prof, results, sims });
const sc = (id: string) => pp.competencies.find((c) => c.id === id)!;
check("dalil = avg(40,60) = 50", sc("tergovchi.dalil").score === 50 && sc("tergovchi.dalil").evidenceCount === 2);
check("protsessual = 90", sc("tergovchi.protsessual").score === 90);
check("hujjat unassessed", sc("tergovchi.hujjat").score === null);
check("overall = round(mean(90,50,85)) = 75", pp.overall === 75, String(pp.overall));
check("level 3 at 75", pp.level === 3);
check("strengths", pp.strengths.join() === "tergovchi.protsessual,tergovchi.taktika", pp.strengths.join());
check("gaps", pp.gaps.join() === "tergovchi.dalil");
check("recommended subjects from dalil", pp.recommendedSubjects.join() === "krim-04,krim-06,krim-05", pp.recommendedSubjects.join());
check("recommended sims: gap first, other profession excluded", pp.recommendedSims[0] === "sim-t-02" && !pp.recommendedSims.includes("sim-e-01"), pp.recommendedSims.join());
check("next career step after level 3", pp.nextCareerStep?.title.uz === prof.career[3].title.uz);
const empty = buildPassport({ profession: prof, results: [], sims });
check("empty passport: no overall/level", empty.overall === null && empty.level === null && empty.gaps.length === 0);
check("empty passport: all sims recommended as unassessed", empty.recommendedSims.length === 3);
check("empty passport: next step = first career step", empty.nextCareerStep?.title.uz === prof.career[0].title.uz);
check("levelFor thresholds", levelFor(49) === 1 && levelFor(50) === 2 && levelFor(70) === 3 && levelFor(85) === 4);

// 3) Klaster-ID blend (profilaktika only).
const pf = PROFESSIONS.find((p) => p.id === "profilaktika")!;
const klaster = {
  scores: { huquqiy_qaror: 80, muloqot: 60, deeskalatsiya: 80, profiling: 50, natijadorlik: 70, hujjatlashtirish: 40, vaziyat_tahlili: 90, raqamli: 70 },
  samples: { huquqiy_qaror: 2, muloqot: 2, deeskalatsiya: 2, profiling: 2, natijadorlik: 2, hujjatlashtirish: 2, vaziyat_tahlili: 2, raqamli: 0 },
};
const pk = buildPassport({
  profession: pf,
  results: [mk("p1", "sim-p-01", "2026-01-01", { "profilaktika.huquqiy": 60 }, "profilaktika")],
  klasterId: klaster,
});
const pks = (id: string) => pk.competencies.find((c) => c.id === `profilaktika.${id}`)!;
check("huquqiy blend (60+80)/2 = 70", pks("huquqiy").score === 70 && pks("huquqiy").evidenceCount === 2);
check("muloqot ← avg(muloqot,deeskalatsiya) = 70", pks("muloqot").score === 70 && pks("muloqot").fromKlasterId);
check("profilaktik_ish ← 60", pks("profilaktik_ish").score === 60);
check("hujjat ← 40 (gap)", pks("hujjat").score === 40 && pk.gaps.includes("profilaktika.hujjat"));
check("tahlil skips unsampled raqamli → 90", pks("tahlil").score === 90);
const tk = buildPassport({ profession: prof, results: [], klasterId: klaster });
check("Klaster-ID ignored for other professions", tk.overall === null);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
