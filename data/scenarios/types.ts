import type { LocalizedText } from "@/data/sops/types";
import type { LawKey } from "@/data/sops/laws";
import type { Competency, CompetencyScores } from "./competencies";

export type { LocalizedText };

/* ------------------------------------------------------------------------ */
/* Common                                                                   */
/* ------------------------------------------------------------------------ */

export type ScenarioKind = "dialog" | "decision" | "mahalla" | "document" | "tir" | "exam";
export type Difficulty = 1 | 2 | 3;

export interface ScenarioBase {
  id: string; // "dialog-case04-agressiv"
  kind: ScenarioKind;
  code: string; // "Case 04"
  title: LocalizedText;
  brief: LocalizedText;
  difficulty: Difficulty;
  /** Competencies this scenario trains — AI-Mentor uses these. */
  tags: Competency[];
  estimatedMinutes: number;
  /** Keys into `LAWS` (data/sops/laws.ts) — the ONLY legal refs a debrief may cite. */
  laws: LawKey[];
  version: string;
}

/* ------------------------------------------------------------------------ */
/* 1. AI-Muloqot — virtual citizen                                          */
/* ------------------------------------------------------------------------ */

export const PERSONA_TYPES = [
  "jahldor",
  "qorqqan",
  "nizoli",
  "jabrlanuvchi",
  "norozi",
] as const;
export type PersonaType = (typeof PERSONA_TYPES)[number];

export const DIALOG_PHASES = [
  "tinglash",
  "savol",
  "profiling",
  "deeskalatsiya",
  "tushuntirish",
  "kelishuv",
] as const;
export type DialogPhase = (typeof DIALOG_PHASES)[number];

export const TONES = [
  "xotirjam",
  "rasmiy",
  "qattiq",
  "bepisand",
  "tahdidli",
  "hamdard",
] as const;
export type Tone = (typeof TONES)[number];

export const TREND_LABELS = ["yumshayapti", "keskinlashyapti", "ozgarishsiz"] as const;
export type TrendLabel = (typeof TREND_LABELS)[number];

export const TURN_FLAGS = [
  "haqorat",
  "tahdid",
  "qonun_buzilishi",
  "faol_tinglash",
  "empatiya",
  "huquqiy_tushuntirish",
  "savol_ochiq",
  "savol_yopiq",
] as const;
export type TurnFlag = (typeof TURN_FLAGS)[number];

export interface DialogPersona {
  type: PersonaType;
  name: string;
  age: number;
  gender: "erkak" | "ayol";
  /** Hidden from trainee, given to the LLM. Uzbek. */
  background: string;
  /** What the citizen actually wants. */
  grievance: string;
  /** Officer behaviours that raise tension. */
  triggers: string[];
  /** What lowers tension. */
  soothers: string[];
  /** Revealed one-by-one only once trust >= revealTrust. */
  secretFacts: string[];
}

export interface DialogHiddenState {
  tension: number; // 0-100
  trust: number; // 0-100
  cooperation: number; // 0-100
  phase: DialogPhase;
  revealed: string[];
}

export interface DialogScenario extends ScenarioBase {
  kind: "dialog";
  persona: DialogPersona;
  /** Where the officer meets the citizen — shown to trainee. */
  setting: LocalizedText;
  initialState: DialogHiddenState;
  /** Citizen's first line. */
  opening: string;
  maxTurns: number;
  revealTrust: number;
  successCondition: { minTrust: number; maxTension: number };
  failCondition: { tension: number };
  rubricHints: Partial<Record<Competency, string>>;
}

/** LLM output per officer turn — assessment of the OFFICER's utterance. */
export interface DialogTurnAssessment {
  tone: Tone;
  phaseDetected: DialogPhase;
  delta: { tension: number; trust: number; cooperation: number }; // -25..+25
  trendLabel: TrendLabel;
  flags: TurnFlag[];
  coachNote?: string;
}

export type DialogEndReason = "kelishuv" | "eskalatsiya" | "limit" | "abandoned";

export interface DialogTurn {
  i: number;
  role: "officer" | "citizen";
  text: string;
  at: string;
  assessment?: DialogTurnAssessment;
  stateAfter?: DialogHiddenState;
}

/* ------------------------------------------------------------------------ */
/* 2. Qaror simulyatori — branching decision graph                          */
/* ------------------------------------------------------------------------ */

export type Score03 = 0 | 1 | 2 | 3;
export type DecisionOutcome = "success" | "partial" | "fail";

export const CHAIN_PROMPTS = ["xavf", "muloqot", "kutish", "yordam", "chora"] as const;
export type ChainPrompt = (typeof CHAIN_PROMPTS)[number];

export interface DecisionOption {
  id: string;
  text: LocalizedText;
  legality: Score03; // 0 unlawful … 3 fully lawful
  proportionality: Score03; // 0 grossly disproportionate … 3 proportionate
  laws?: LawKey[];
  consequence: LocalizedText;
  /** Next node id; null = terminal. */
  next: string | null;
  /** Only meaningful on terminal edges. */
  outcome?: DecisionOutcome;
}

export interface DecisionNode {
  id: string;
  situation: LocalizedText;
  image?: string;
  timerSec?: number;
  /** Node to jump to when timer expires; null = treat as terminal fail. */
  onTimeout?: string | null;
  chainPrompt?: ChainPrompt;
  options: DecisionOption[];
}

export interface DecisionScenario extends ScenarioBase {
  kind: "decision";
  startNodeId: string;
  nodes: Record<string, DecisionNode>;
  /** Option ids along the ideal path — used in debrief. */
  optimalPath?: string[];
}

export interface DecisionStep {
  nodeId: string;
  optionId: string | null;
  elapsedMs: number;
  timedOut: boolean;
}

/* ------------------------------------------------------------------------ */
/* 3. Smart Mahalla                                                          */
/* ------------------------------------------------------------------------ */

export type RiskLevel = "green" | "yellow" | "red";

export interface MahallaPoint {
  id: string;
  x: number;
  y: number;
  kind: "uy" | "maktab" | "dokon" | "park" | "bekat" | "masjid" | "punkt";
  label: LocalizedText;
  risk: RiskLevel;
}

export interface FeedItem {
  id: string;
  at: string; // "08:40"
  type: "murojaat" | "takroriy_hodisa" | "xavf_indikatori" | "hisob";
  pointId?: string;
  text: LocalizedText;
  /** Hidden from trainee; drives the answer key. */
  severityHidden: 1 | 2 | 3 | 4 | 5;
  problemId: string;
}

export interface MahallaProblem {
  id: string;
  title: LocalizedText;
  competencies: Competency[];
}

export interface MahallaScenario extends ScenarioBase {
  kind: "mahalla";
  district: {
    code: string; // "SH-12"
    name: LocalizedText;
    grid: { cols: number; rows: number };
    points: MahallaPoint[];
  };
  feed: FeedItem[];
  problems: MahallaProblem[];
  answerKey: {
    /** Ordered problem ids. */
    top3: string[];
    rationale: LocalizedText;
    /** Must-mention actions per problem (uz). */
    planRubric: Record<string, string[]>;
  };
}

export interface MahallaGrade {
  prioritizationScore: number; // 0-100
  planScores: Record<string, { score: number; missing: string[]; feedback: string }>;
  scores: Partial<CompetencyScores>;
}

/* ------------------------------------------------------------------------ */
/* 4. Hujjatlashtirish — AI hujjat tekshiruvi (qonun va fakt)                */
/* ------------------------------------------------------------------------ */

export type DocumentKindH360 = "bayonnoma" | "malumotnoma" | "tushuntirish" | "hisobot";

export interface DocumentScenario extends ScenarioBase {
  kind: "document";
  documentKind: DocumentKindH360;
  /** Case facts the trainee must document — shown to trainee. */
  facts: LocalizedText[];
  /** Deliberate traps: facts that must NOT appear (assumptions, guilt, invented articles). */
  forbidden: string[];
  /** Must-have elements (uz) — the AI checks each. */
  rubric: { id: string; label: LocalizedText; hint?: string }[];
  minWords: number;
}

export interface DocumentGrade {
  score: number; // 0-100
  elements: Record<string, { present: boolean; note: string }>;
  factErrors: string[]; // wrong / invented facts
  legalErrors: string[]; // wrong articles, conclusions beyond authority
  strengths: string[];
  feedback: string;
  scores: Partial<CompetencyScores>;
}

/* ------------------------------------------------------------------------ */
/* 5. Exam — "Bir kunlik xizmat"                                            */
/* ------------------------------------------------------------------------ */

export interface ExamStage {
  time: string; // "09:00"
  kind: Exclude<ScenarioKind, "exam">;
  scenarioId: string;
  title: LocalizedText;
}

export interface ExamScenario extends ScenarioBase {
  kind: "exam";
  stages: ExamStage[];
}

export type Scenario = DialogScenario | DecisionScenario | MahallaScenario | DocumentScenario | TirScenario | ExamScenario;

/* ------------------------------------------------------------------------ */
/* 6. TIR — immersive 3D use-of-force / decision range (VirTra-style)         */
/* ------------------------------------------------------------------------ */

export const TIR_ACTIONS = [
  "talk_calm",
  "talk_command",
  "talk_threat",
  "draw",
  "holster",
  "taser",
  "shoot",
  "backup",
  "retreat",
  "cover",
] as const;
export type TirAction = (typeof TIR_ACTIONS)[number];

export const TIR_ACTOR_STATES = [
  "shouting",
  "approaching",
  "knife_raised",
  "lunging",
  "dropping",
  "kneeling",
  "fleeing",
  "down",
  "calm",
] as const;
export type TirActorState = (typeof TIR_ACTOR_STATES)[number];

export type TirWeapon = "knife" | "bottle" | "bat" | "none";
export type TirEnvironment = "yard" | "street" | "hallway";
export type TirHitZone = "torso" | "limb" | "head" | "miss";

export interface TirScenario extends ScenarioBase {
  kind: "tir";
  environment: TirEnvironment;
  actor: {
    name: string;
    age: number;
    weapon: TirWeapon;
    /** Subtitles / TTS lines per state (uz). */
    lines: Partial<Record<TirActorState, string[]>>;
    /** What the actor wants — for the debrief grader. */
    motive: string;
  };
  partner: boolean;
  initial: { distance: number; agitation: number; compliance: number };
  rules: {
    durationSec: number;
    approachSpeed: number; // m/s while approaching
    minDistance: number; // stops approaching here (unless lunging)
    /** Seconds without any officer talk before weapon is raised. */
    raiseWeaponAfterSec: number;
    lungeAgitation: number;
    lungeDistance: number;
    complyCompliance: number;
    backupEtaSec: number;
    /** Agitation drift per second while shouting and unaddressed. */
    silenceDrift: number;
  };
  briefing: LocalizedText; // dispatcher text shown before start
  rubricHints: Partial<Record<Competency, string>>;
}

export interface TirEvent {
  t: number; // seconds since start
  kind: "action" | "actor" | "system";
  action?: TirAction;
  actorState?: TirActorState;
  text: string; // uz description / subtitle
  legality?: Score03;
  proportionality?: Score03;
  distance: number;
  agitation: number;
  compliance: number;
  hit?: TirHitZone;
}

export type TirOutcome =
  | "resolved_verbal" // suspect complied without force
  | "resolved_less_lethal" // taser, lawful
  | "resolved_lethal_lawful" // shot as last resort
  | "unlawful_force"
  | "officer_injured"
  | "timeout";
