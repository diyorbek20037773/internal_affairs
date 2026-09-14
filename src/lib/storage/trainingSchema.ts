import { z } from "zod";
import {
  COMPETENCIES,
  type CompetencyScores,
} from "@/data/scenarios/competencies";
import {
  DIALOG_PHASES,
  TONES,
  TREND_LABELS,
  TURN_FLAGS,
  TIR_ACTIONS,
  TIR_ACTOR_STATES,
} from "@/data/scenarios/types";

/* ---------- competency ---------- */

export const CompetencyEnum = z.enum(COMPETENCIES);
export const CompetencyScoresSchema = z.object(
  Object.fromEntries(COMPETENCIES.map((c) => [c, z.number().min(0).max(100)]))
) as unknown as z.ZodType<CompetencyScores>;
export const PartialScoresSchema = z.record(CompetencyEnum, z.number().min(0).max(100));

/* ---------- dialog ---------- */

export const DialogHiddenStateSchema = z.object({
  tension: z.number().min(0).max(100),
  trust: z.number().min(0).max(100),
  cooperation: z.number().min(0).max(100),
  phase: z.enum(DIALOG_PHASES),
  revealed: z.array(z.string()),
});

export const DialogTurnAssessmentSchema = z.object({
  tone: z.enum(TONES),
  phaseDetected: z.enum(DIALOG_PHASES),
  delta: z.object({
    tension: z.number(),
    trust: z.number(),
    cooperation: z.number(),
  }),
  trendLabel: z.enum(TREND_LABELS),
  flags: z.array(z.enum(TURN_FLAGS)),
  coachNote: z.string().optional(),
});

export const DialogTurnSchema = z.object({
  i: z.number(),
  role: z.enum(["officer", "citizen"]),
  text: z.string(),
  at: z.string(),
  assessment: DialogTurnAssessmentSchema.optional(),
  stateAfter: DialogHiddenStateSchema.optional(),
});

export const DialogEndReasonSchema = z.enum([
  "kelishuv",
  "eskalatsiya",
  "limit",
  "abandoned",
]);

/* ---------- decision ---------- */

export const DecisionStepSchema = z.object({
  nodeId: z.string(),
  optionId: z.string().nullable(),
  elapsedMs: z.number(),
  timedOut: z.boolean(),
});

/* ---------- mahalla ---------- */

export const MahallaGradeSchema = z.object({
  prioritizationScore: z.number().min(0).max(100),
  planScores: z.record(
    z.string(),
    z.object({
      score: z.number().min(0).max(100),
      missing: z.array(z.string()),
      feedback: z.string(),
    })
  ),
  scores: PartialScoresSchema,
});

/* ---------- document ---------- */

export const DocumentGradeSchema = z.object({
  score: z.number().min(0).max(100),
  elements: z.record(z.string(), z.object({ present: z.boolean(), note: z.string() })),
  factErrors: z.array(z.string()),
  legalErrors: z.array(z.string()),
  strengths: z.array(z.string()),
  feedback: z.string(),
  scores: PartialScoresSchema,
});

/* ---------- tir ---------- */

export const TirEventSchema = z.object({
  t: z.number(),
  kind: z.enum(["action", "actor", "system"]),
  action: z.enum(TIR_ACTIONS).optional(),
  actorState: z.enum(TIR_ACTOR_STATES).optional(),
  text: z.string(),
  legality: z.number().min(0).max(3).optional(),
  proportionality: z.number().min(0).max(3).optional(),
  distance: z.number(),
  agitation: z.number(),
  compliance: z.number(),
  hit: z.enum(["torso", "limb", "head", "miss"]).optional(),
});
export const TirOutcomeSchema = z.enum([
  "resolved_verbal",
  "resolved_less_lethal",
  "resolved_lethal_lawful",
  "unlawful_force",
  "officer_injured",
  "timeout",
]);

/* ---------- debrief ---------- */

export const DebriefStatusSchema = z.enum(["pending", "confirmed"]);

export const DebriefResultSchema = z.object({
  whatWentRight: z.array(z.string()),
  mistakes: z.array(z.object({ ref: z.string(), text: z.string() })),
  doDifferently: z.array(z.string()),
  scores: CompetencyScoresSchema,
  summary: z.string(),
  model: z.string().optional(),
  createdAt: z.string(),
  status: DebriefStatusSchema,
  confirmedBy: z.string().optional(),
  confirmedAt: z.string().optional(),
  instructorNote: z.string().optional(),
});

/** What the LLM returns (no status/timestamps). */
export const DebriefLlmSchema = DebriefResultSchema.pick({
  whatWentRight: true,
  mistakes: true,
  doDifferently: true,
  scores: true,
  summary: true,
});

/* ---------- session ---------- */

export const SessionStatusSchema = z.enum(["in_progress", "completed", "abandoned"]);

export const SessionPayloadSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("dialog"),
    transcript: z.array(DialogTurnSchema),
    state: DialogHiddenStateSchema,
    endReason: DialogEndReasonSchema.optional(),
  }),
  z.object({
    kind: z.literal("decision"),
    path: z.array(DecisionStepSchema),
    currentNodeId: z.string().nullable(),
    outcome: z.enum(["success", "partial", "fail"]).optional(),
  }),
  z.object({
    kind: z.literal("mahalla"),
    picked: z.array(z.string()),
    plans: z.record(z.string(), z.string()),
    grade: MahallaGradeSchema.optional(),
  }),
  z.object({
    kind: z.literal("document"),
    text: z.string(),
    grade: DocumentGradeSchema.optional(),
  }),
  z.object({
    kind: z.literal("tir"),
    events: z.array(TirEventSchema),
    outcome: TirOutcomeSchema.optional(),
    elapsedSec: z.number(),
    shotsFired: z.number(),
    hits: z.number(),
  }),
]);

export const TrainingSessionSchema = z.object({
  id: z.string(),
  traineeId: z.string(),
  kind: z.enum(["dialog", "decision", "mahalla", "document", "tir"]),
  scenarioId: z.string(),
  scenarioVersion: z.string(),
  startedAt: z.string(),
  updatedAt: z.string(),
  endedAt: z.string().optional(),
  status: SessionStatusSchema,
  examId: z.string().optional(),
  examStageIndex: z.number().optional(),
  payload: SessionPayloadSchema,
  deterministicScores: PartialScoresSchema.optional(),
  debrief: DebriefResultSchema.optional(),
  finalScores: CompetencyScoresSchema.optional(),
});

/* ---------- profile / HIMOYA-ID ---------- */

export const TraineeProfileSchema = z.object({
  id: z.string(),
  badgeId: z.string(), // SH-0473
  name: z.string(),
  rank: z.string(),
  district: z.string(),
  role: z.enum(["trainee", "instructor"]),
  createdAt: z.string(),
});

export const HimoyaIdSchema = z.object({
  traineeId: z.string(),
  scores: CompetencyScoresSchema,
  samples: z.record(CompetencyEnum, z.number()),
  updatedAt: z.string(),
  history: z.array(
    z.object({
      sessionId: z.string(),
      at: z.string(),
      scores: CompetencyScoresSchema,
    })
  ),
});

/* ---------- files ---------- */

export const ProfileFileSchema = z.object({
  version: z.literal(1),
  profile: TraineeProfileSchema.nullable(),
});
export const SessionsFileSchema = z.object({
  version: z.literal(1),
  items: z.array(TrainingSessionSchema),
});
export const HimoyaIdFileSchema = z.object({
  version: z.literal(1),
  items: z.array(HimoyaIdSchema),
});

export type TrainingSession = z.infer<typeof TrainingSessionSchema>;
export type SessionPayload = z.infer<typeof SessionPayloadSchema>;
export type DialogPayload = Extract<SessionPayload, { kind: "dialog" }>;
export type DecisionPayload = Extract<SessionPayload, { kind: "decision" }>;
export type MahallaPayload = Extract<SessionPayload, { kind: "mahalla" }>;
export type DocumentPayload = Extract<SessionPayload, { kind: "document" }>;
export type TirPayload = Extract<SessionPayload, { kind: "tir" }>;
export type DebriefResult = z.infer<typeof DebriefResultSchema>;
export type DebriefLlm = z.infer<typeof DebriefLlmSchema>;
export type TraineeProfile = z.infer<typeof TraineeProfileSchema>;
export type HimoyaId = z.infer<typeof HimoyaIdSchema>;
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
