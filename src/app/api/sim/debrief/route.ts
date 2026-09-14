import { NextRequest } from "next/server";
import { z } from "zod";
import type { Schema } from "@google/genai";
import { generateJson } from "@/lib/gemini/client";
import { GEMINI_MODEL } from "@/lib/gemini/config";
import { getScenario } from "@/data/scenarios";
import {
  DebriefLlmSchema,
  SessionPayloadSchema,
  type DebriefResult,
} from "@/lib/storage/trainingSchema";
import {
  buildDebriefSystemInstruction,
  DEBRIEF_RESPONSE_SCHEMA,
  decisionEvidence,
  dialogEvidence,
  documentEvidence,
  lawsFor,
  mahallaEvidence,
} from "@/prompts/debrief.uz";
import { simErrorResponse } from "@/lib/training/apiErrors";
import { clampScore, COMPETENCIES } from "@/data/scenarios/competencies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  scenarioId: z.string(),
  locale: z.string().default("uz"),
  payload: SessionPayloadSchema,
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const scenario = getScenario(body.scenarioId);
  if (!scenario || scenario.kind === "exam" || scenario.kind !== body.payload.kind) {
    return Response.json({ error: "scenario_not_found" }, { status: 404 });
  }

  let evidence: string;
  if (scenario.kind === "dialog" && body.payload.kind === "dialog") {
    evidence = dialogEvidence(scenario, body.payload);
  } else if (scenario.kind === "decision" && body.payload.kind === "decision") {
    evidence = decisionEvidence(scenario, body.payload);
  } else if (scenario.kind === "mahalla" && body.payload.kind === "mahalla") {
    evidence = mahallaEvidence(scenario, body.payload);
  } else if (scenario.kind === "document" && body.payload.kind === "document") {
    evidence = documentEvidence(scenario, body.payload);
  } else {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const langNote =
    body.locale === "ru"
      ? "\n\nJavob matnlarini RUS tilida yoz."
      : body.locale === "en"
        ? "\n\nJavob matnlarini INGLIZ tilida yoz."
        : "";

  try {
    const llm = await generateJson({
      contents: [{ role: "user", parts: [{ text: evidence + langNote }] }],
      systemInstruction: buildDebriefSystemInstruction(lawsFor(scenario.laws)),
      responseSchema: DEBRIEF_RESPONSE_SCHEMA as unknown as Schema,
      parse: (raw) => {
        // Clamp scores before strict validation so an off-by-one doesn't fail the turn.
        const r = raw as { scores?: Record<string, number> };
        if (r?.scores) for (const c of COMPETENCIES) r.scores[c] = clampScore(r.scores[c] ?? 50);
        return DebriefLlmSchema.parse(raw);
      },
      profile: "grader",
    });

    const result: Omit<DebriefResult, "status"> = {
      ...llm,
      model: GEMINI_MODEL,
      createdAt: new Date().toISOString(),
    };
    return Response.json(result);
  } catch (err) {
    return simErrorResponse("/api/sim/debrief", err);
  }
}
