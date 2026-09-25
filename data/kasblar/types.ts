import type { LocalizedText } from "@/data/sops/types";
import type { LAWS } from "@/data/sops/laws";

export type { LocalizedText };

/**
 * Huquqni muhofaza qilish ta'lim klasteri — shared data model.
 *
 * Chain: kasb standarti → kompetensiyalar → o'quv klasteri → fanlar →
 * amaliyot → simulyator → baholash → kompetensiya pasporti → karyera.
 *
 * Everything here is authored TS data (never LLM-generated at runtime).
 * Legal references: only by `lawKey` into `data/sops/laws.ts`, or by the NAME
 * of a law/code without article numbers (`title` only). Never invent articles.
 */

/** Law-enforcement bodies the platform serves. */
export type AgencyId = "iiv" | "gvardiya" | "bojxona" | "prokuratura" | "fvv";

export const AGENCY_IDS: AgencyId[] = ["iiv", "gvardiya", "bojxona", "prokuratura", "fvv"];

export interface Agency {
  id: AgencyId;
  title: LocalizedText;
  short: LocalizedText; // "IIV", "Milliy gvardiya", …
  description: LocalizedText;
  icon: string; // lucide icon name (must be registered in src/components/icon.tsx)
}

export type ProfessionId =
  | "profilaktika"
  | "tergovchi"
  | "surishtiruvchi"
  | "ekspert"
  | "kiber"
  | "bojxona"
  | "tahlilchi"
  | "prokuror"
  | "psixolog"
  | "gvardiyachi"
  | "qutqaruvchi";

export const PROFESSION_IDS: ProfessionId[] = [
  "profilaktika",
  "tergovchi",
  "surishtiruvchi",
  "ekspert",
  "kiber",
  "bojxona",
  "tahlilchi",
  "prokuror",
  "psixolog",
  "gvardiyachi",
  "qutqaruvchi",
];

/** The 7 learning clusters (o'quv klasterlari). */
export type ClusterId =
  | "huquqiy"
  | "maxsus"
  | "kriminalistika"
  | "kiber"
  | "analitika"
  | "bojxona"
  | "protsessual";

export const CLUSTER_IDS: ClusterId[] = [
  "huquqiy",
  "maxsus",
  "kriminalistika",
  "kiber",
  "analitika",
  "bojxona",
  "protsessual",
];

export interface Subject {
  id: string;
  title: LocalizedText;
  hours?: number;
  kind: "nazariy" | "amaliy" | "simulyatsion";
}

export interface LearningCluster {
  id: ClusterId;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  subjects: Subject[];
  practice: LocalizedText[];
}

/** One legal basis line. Either a verified `lawKey` or a law NAME only. */
export interface LegalBasis {
  lawKey?: keyof typeof LAWS;
  /** Name of the act without article numbers, e.g. "Bojxona kodeksi". */
  title?: LocalizedText;
}

export interface ProfCompetency {
  /** Globally unique: `${professionId}.${slug}` e.g. "tergovchi.dalil". */
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  /** Where the gap is closed — drives passport recommendations. */
  clusters: ClusterId[];
  /** Subject ids (from clusters) that train this competency. */
  subjects: string[];
}

export interface LaborFunction {
  id: string;
  title: LocalizedText;
  tasks: LocalizedText[];
}

export interface CompetencyLevel {
  level: 1 | 2 | 3 | 4;
  title: LocalizedText; // Boshlang'ich / Asosiy / Ilg'or / Ekspert
  description: LocalizedText;
}

export interface CareerStep {
  title: LocalizedText;
  requirement: LocalizedText;
}

export interface ProfessionStandard {
  id: ProfessionId;
  agencies: AgencyId[];
  title: LocalizedText;
  short: LocalizedText; // one-line purpose
  icon: string;
  functions: LaborFunction[];
  knowledge: LocalizedText[];
  skills: LocalizedText[];
  competencies: ProfCompetency[]; // 4–6 per profession
  levels: CompetencyLevel[]; // exactly 4
  education: LocalizedText[];
  practice: { title: LocalizedText; description: LocalizedText }[];
  legalBasis: LegalBasis[];
  assessment: LocalizedText[];
  career: CareerStep[];
  clusters: ClusterId[];
  /** Existing platform trainers relevant to this profession (hrefs like "/simulyator/muloqot"). */
  trainers: string[];
}

/* ------------------------------------------------------------------ */
/* Profession simulators (har bir kasb uchun alohida muhit)             */
/* ------------------------------------------------------------------ */

/** Which environment UI renders the materials. */
export type EnvKind =
  | "case_file" // tergovchi — jinoyat ishi materiallari
  | "duty_desk" // surishtiruvchi — navbatchilik stoli, arizalar
  | "crime_scene" // ekspert-kriminalist — voqea joyi
  | "cyber_sandbox" // kiber — messenjer, fishing, tranzaksiyalar
  | "customs_post" // bojxona — nazorat posti, deklaratsiya
  | "analytics_map" // tahlilchi — statistika, heatmap
  | "prosecutor_review" // prokuror yordamchisi — ish materiallarini tekshirish
  | "counseling" // psixolog — suhbat, holat kartasi
  | "guard_post" // gvardiya — qo'riqlash posti / ommaviy tadbir
  | "emergency"; // FVV — favqulodda vaziyat

export type MaterialKind =
  | "document"
  | "evidence"
  | "message"
  | "email"
  | "transaction"
  | "photo"
  | "table"
  | "note"
  | "application"
  | "declaration";

export interface SimMaterial {
  id: string;
  kind: MaterialKind;
  title: LocalizedText;
  body: LocalizedText;
  /** Small key/value facts shown as a table (sender, time, amount, HS code…). */
  meta?: { label: LocalizedText; value: string }[];
  /** For `table` materials / analytics grids: rows of cells. */
  table?: { head: string[]; rows: (string | number)[][] };
  /** Visual accent: "warn" marks something suspicious ONLY if the env wants a hint. */
  tone?: "neutral" | "warn";
}

export interface ChoiceOption {
  id: string;
  text: LocalizedText;
  /** 0 = wrong/unlawful, 1 = weak, 2 = acceptable, 3 = best. */
  score: 0 | 1 | 2 | 3;
  feedback: LocalizedText;
}

export type SimTask =
  | { kind: "choice"; prompt: LocalizedText; options: ChoiceOption[] }
  | {
      kind: "multi";
      prompt: LocalizedText;
      options: { id: string; text: LocalizedText; correct: boolean; feedback?: LocalizedText }[];
    }
  | {
      kind: "order";
      prompt: LocalizedText;
      items: { id: string; text: LocalizedText }[];
      /** Correct sequence of item ids. */
      correct: string[];
    }
  | {
      kind: "numeric";
      prompt: LocalizedText;
      unit: string;
      answer: number;
      /** Absolute tolerance. */
      tolerance: number;
      solution: LocalizedText;
    }
  | {
      kind: "match";
      prompt: LocalizedText;
      left: { id: string; text: LocalizedText }[];
      right: { id: string; text: LocalizedText }[];
      /** [leftId, rightId] */
      pairs: [string, string][];
    }
  | {
      kind: "grid";
      prompt: LocalizedText;
      rowLabels: string[];
      colLabels: string[];
      values: number[][];
      /** "r-c" cell keys that are the correct hotspots. */
      correct: string[];
      /** How many cells the trainee must pick. */
      picks: number;
    }
  | {
      kind: "text";
      prompt: LocalizedText;
      /** Rubric criteria read server-side by the AI grader. */
      rubric: LocalizedText[];
      minWords: number;
      /** Model answer shown after grading. */
      model: LocalizedText;
    };

export type SimTaskKind = SimTask["kind"];

export interface SimStage {
  id: string;
  title: LocalizedText;
  brief: LocalizedText;
  /** Materials available at this stage (earlier stages' materials stay visible). */
  materials: SimMaterial[];
  task: SimTask;
  /** ProfCompetency ids trained by this stage. */
  competencies: string[];
  /** Shown when stage score < 50: what this mistake causes in real service. */
  consequence: LocalizedText;
}

export interface ProfessionSim {
  id: string; // e.g. "sim-tergovchi-01"
  professionId: ProfessionId;
  code: string; // "T-01"
  title: LocalizedText;
  setting: LocalizedText;
  env: EnvKind;
  intro: LocalizedText;
  /** Estimated minutes. */
  minutes: number;
  stages: SimStage[];
}

/* ------------------------------------------------------------------ */
/* Stored results (via KasbRepo, src/lib/storage/kasb.ts)               */
/* ------------------------------------------------------------------ */

export interface StageResult {
  stageId: string;
  /** 0–100. */
  score: number;
  answer: unknown;
  feedback?: string;
  /** AI grading failed and the trainee continued — excluded from competency math. */
  ungraded?: boolean;
}

export interface KasbSimResult {
  id: string;
  simId: string;
  professionId: ProfessionId;
  traineeId: string;
  startedAt: string;
  finishedAt?: string;
  stages: StageResult[];
  /** ProfCompetency id → 0–100, filled when finished. */
  competencyScores: Record<string, number>;
  /** 0–100 overall. */
  total?: number;
}

/* ------------------------------------------------------------------ */
/* Tutor (har bir organ uchun o'qituvchi-suhbatdosh)                    */
/* ------------------------------------------------------------------ */

export interface TutorQuizItem {
  id: string;
  question: LocalizedText;
  options: { id: string; text: LocalizedText; correct: boolean }[];
  explanation: LocalizedText;
}

export interface TutorTopic {
  id: string; // "iiv-ariza-qabul"
  agency: AgencyId;
  professions: ProfessionId[];
  title: LocalizedText;
  summary: LocalizedText;
  /** Authored knowledge the AI tutor must stay within (the "lesson card"). */
  keyPoints: LocalizedText[];
  /** The work process, step by step. */
  steps: LocalizedText[];
  /** Typical mistakes the tutor probes for. */
  pitfalls: LocalizedText[];
  legalBasis: LegalBasis[];
  /** Open questions the tutor asks (Q&A is the main mode). */
  questions: LocalizedText[];
  /** Deliberately few: 2–3 per topic. */
  quiz: TutorQuizItem[];
}
