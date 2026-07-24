import type { IncidentType } from "./incident";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

/** The 6 fixed sections the AI answer is parsed into. */
export interface ParsedResponse {
  situation?: string; // 1. Vaziyat
  firstAction?: string; // 2. Birinchi harakat
  checklist: string[]; // 3. Checklist
  documents: string[]; // 4. Kerakli hujjatlar
  legalBasis?: string; // 5. Huquqiy asos
  nextStep?: string; // 6. Keyingi qadam
  raw: string;
}

export interface WorkflowContext {
  incidentType?: IncidentType;
  sopId?: string;
  currentStepTitle?: string;
  remainingChecklist?: string[];
}

/** Wire format for POST /api/chat */
export interface ChatRequestBody {
  messages: { role: ChatRole; content: string }[];
  locale: string;
  context?: WorkflowContext;
}
