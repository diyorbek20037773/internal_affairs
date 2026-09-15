import { NextRequest } from "next/server";
import { aiGuard } from "@/lib/aiGuard";
import { z } from "zod";
import type { Schema } from "@google/genai";
import { generateJson } from "@/lib/gemini/client";
import { getDocumentScenario } from "@/data/scenarios";
import { clampScore } from "@/data/scenarios/competencies";
import type { DocumentGrade } from "@/data/scenarios/types";
import { documentDeterministic } from "@/lib/training/competency";
import { simErrorResponse } from "@/lib/training/apiErrors";
import { lawsFor } from "@/prompts/debrief.uz";
import {
  buildDocumentCheckerInstruction,
  DOCUMENT_CHECK_SCHEMA,
  documentCheckerUserTurn,
} from "@/prompts/document-checker.uz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  scenarioId: z.string(),
  locale: z.string().default("uz"),
  text: z.string().max(8000),
});

const LlmSchema = z.object({
  score: z.number(),
  elements: z.array(z.object({ id: z.string(), present: z.boolean(), note: z.string() })),
  factErrors: z.array(z.string()),
  legalErrors: z.array(z.string()),
  strengths: z.array(z.string()),
  feedback: z.string(),
});

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 3 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const scenario = getDocumentScenario(body.scenarioId);
  if (!scenario) return Response.json({ error: "scenario_not_found" }, { status: 404 });

  try {
    const llm = await generateJson({
      contents: [{ role: "user", parts: [{ text: documentCheckerUserTurn(scenario, body.text, body.locale) }] }],
      systemInstruction: buildDocumentCheckerInstruction(lawsFor(scenario.laws)),
      responseSchema: DOCUMENT_CHECK_SCHEMA as unknown as Schema,
      parse: (raw) => LlmSchema.parse(raw),
      profile: "grader",
    });

    const elements: DocumentGrade["elements"] = {};
    for (const r of scenario.rubric) {
      const e = llm.elements.find((x) => x.id === r.id);
      elements[r.id] = e ? { present: e.present, note: e.note } : { present: false, note: "" };
    }
    const words = body.text.trim().split(/\s+/).filter(Boolean).length;
    let score = clampScore(llm.score);
    if (words < scenario.minWords) score = Math.min(score, 40);

    const partial: DocumentGrade = {
      score,
      elements,
      factErrors: llm.factErrors.slice(0, 8),
      legalErrors: llm.legalErrors.slice(0, 8),
      strengths: llm.strengths.slice(0, 4),
      feedback: llm.feedback,
      scores: {},
    };
    const grade: DocumentGrade = { ...partial, scores: documentDeterministic(partial) };
    return Response.json(grade);
  } catch (err) {
    return simErrorResponse("/api/sim/document-check", err);
  }
}
