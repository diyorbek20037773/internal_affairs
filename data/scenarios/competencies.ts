import type { LocalizedText } from "@/data/sops/types";

/** Klaster-ID — 8 continuously-assessed competency axes (pptx slide 10). */
export const COMPETENCIES = [
  "huquqiy_qaror",
  "vaziyat_tahlili",
  "muloqot",
  "deeskalatsiya",
  "profiling",
  "raqamli",
  "hujjatlashtirish",
  "natijadorlik",
] as const;

export type Competency = (typeof COMPETENCIES)[number];
export type CompetencyScores = Record<Competency, number>; // 0-100

export const COMPETENCY_LABELS: Record<Competency, LocalizedText> = {
  huquqiy_qaror: { uz: "Huquqiy qaror", ru: "Правовое решение", en: "Legal decision" },
  vaziyat_tahlili: { uz: "Vaziyat tahlili", ru: "Анализ ситуации", en: "Situation analysis" },
  muloqot: { uz: "Muloqot", ru: "Коммуникация", en: "Communication" },
  deeskalatsiya: { uz: "Deeskalatsiya", ru: "Деэскалация", en: "De-escalation" },
  profiling: { uz: "Profayling", ru: "Профайлинг", en: "Profiling" },
  raqamli: { uz: "Raqamli ko'nikma", ru: "Цифровые навыки", en: "Digital skills" },
  hujjatlashtirish: { uz: "Hujjatlashtirish", ru: "Документирование", en: "Documentation" },
  natijadorlik: { uz: "Natijadorlik (KPI)", ru: "Результативность (KPI)", en: "Effectiveness (KPI)" },
};

/** One-line definitions fed to the debrief grader prompt. */
export const COMPETENCY_DEFINITIONS_UZ: Record<Competency, string> = {
  huquqiy_qaror:
    "Qaror amaldagi qonunga mos, vakolat doirasida, huquqiy asos to'g'ri ko'rsatilgan.",
  vaziyat_tahlili:
    "Xavf, ishtirokchilar, kontekst tez va to'g'ri baholangan; mutanosib chora tanlangan.",
  muloqot:
    "Aniq, hurmatli, tushunarli gapirish; o'zini tanishtirish; ochiq savollar; ohang nazorati.",
  deeskalatsiya:
    "Taranglikni pasaytirish: faol tinglash, empatiya, vaqt/masofa berish, kuch ishlatmaslik.",
  profiling:
    "Fuqaroning holati, motivi, yashirin faktlarini savollar orqali ochish; xavf belgilarini payqash.",
  raqamli:
    "Tizim ma'lumotlaridan (murojaat, hisob, xarita) foydalanish; ma'lumotga asoslangan qaror.",
  hujjatlashtirish:
    "Fakt, vaqt, shaxs, huquqiy asos to'liq va aniq qayd etilgan; hujjat tartibi to'g'ri.",
  natijadorlik:
    "Vaziyat qonuniy va xavfsiz yakunlangan: kelishuv, xavf bartaraf, keyingi chora belgilangan.",
};

export function emptyScores(fill = 0): CompetencyScores {
  return Object.fromEntries(COMPETENCIES.map((c) => [c, fill])) as CompetencyScores;
}

export function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}
