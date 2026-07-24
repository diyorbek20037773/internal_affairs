import { z } from "zod";
import { INCIDENT_TYPES } from "@/types/incident";

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.string(),
});

export const WorkflowStateSchema = z.object({
  sopType: z.enum(INCIDENT_TYPES),
  sopVersion: z.string(),
  currentStepId: z.string(),
  completedStepIds: z.array(z.string()),
  checkedItemIds: z.array(z.string()),
  progressPct: z.number(),
});

export const CaseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  incidentType: z.enum(INCIDENT_TYPES),
  title: z.string(),
  workflow: WorkflowStateSchema,
  messages: z.array(ChatMessageSchema),
});

export const CasesFileSchema = z.object({
  version: z.literal(1),
  cases: z.array(CaseSchema),
});

export type WorkflowState = z.infer<typeof WorkflowStateSchema>;
export type Case = z.infer<typeof CaseSchema>;
