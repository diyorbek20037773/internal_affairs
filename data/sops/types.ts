import type { IncidentType } from "@/types/incident";

export type LocalizedText = { uz: string; ru?: string; en?: string };

export interface LawRef {
  code: string; // e.g. "Jinoyat kodeksi"
  article?: string; // e.g. "169-modda" — omit if uncertain
  title?: string; // short title of the article/law
  note?: string;
  url?: string; // lex.uz source
  verified: boolean; // false => UI shows "tasdiqlanishi kerak"
}

export interface ChecklistItem {
  id: string;
  label: LocalizedText;
  required: boolean;
}

export type DocumentKind =
  | "bayonnoma"
  | "ariza"
  | "dalil"
  | "foto"
  | "video"
  | "other";

export interface DocumentRef {
  id: string;
  name: LocalizedText;
  kind: DocumentKind;
}

export interface SopStep {
  id: string;
  order: number;
  title: LocalizedText;
  instruction: LocalizedText;
  checklist: ChecklistItem[];
  documents: DocumentRef[];
  laws: LawRef[];
  notifyAgencies?: string[];
}

export interface Sop {
  type: IncidentType;
  title: LocalizedText;
  version: string;
  steps: SopStep[];
}

export function localized(t: LocalizedText, locale: string): string {
  if (locale === "ru" && t.ru) return t.ru;
  if (locale === "en" && t.en) return t.en;
  return t.uz;
}
