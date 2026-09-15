import { NextRequest } from "next/server";
import { z } from "zod";
import type { Content, Schema } from "@google/genai";
import { generateJson } from "@/lib/gemini/client";
import { getDialogScenario } from "@/data/scenarios";
import { buildCitizenSystemInstruction, CITIZEN_RESPONSE_SCHEMA } from "@/prompts/virtual-citizen.uz";
import { DialogHiddenStateSchema, DialogTurnAssessmentSchema } from "@/lib/storage/trainingSchema";
import { applyDelta, checkEnd, detectReveals } from "@/lib/training/dialogState";
import { simErrorResponse } from "@/lib/training/apiErrors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  scenarioId: z.string(),
  locale: z.string().default("uz"),
  state: DialogHiddenStateSchema,
  history: z
    .array(z.object({ role: z.enum(["officer", "citizen"]), text: z.string() }))
    .max(80)
    .default([]),
  officerText: z.string().min(1).max(6000),
  /** Officer turns so far INCLUDING this one. */
  officerTurns: z.number().int().min(1),
});

const EnvelopeSchema = z.object({
  reply: z.string().min(1),
  assessment: DialogTurnAssessmentSchema,
});

const HISTORY_WINDOW = 12;

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    const detail = e instanceof z.ZodError ? e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") : String(e);
    return Response.json({ error: "invalid_request", detail }, { status: 400 });
  }

  const scenario = getDialogScenario(body.scenarioId);
  if (!scenario) return Response.json({ error: "scenario_not_found" }, { status: 404 });

  const systemInstruction = buildCitizenSystemInstruction({
    scenario,
    state: body.state,
    locale: body.locale,
  });

  // Citizen opening line seeds the model side; officer=user, citizen=model.
  const window = body.history.slice(-HISTORY_WINDOW);
  const contents: Content[] = [
    { role: "model", parts: [{ text: scenario.opening }] },
    ...window.map((h) => ({
      role: h.role === "officer" ? ("user" as const) : ("model" as const),
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: body.officerText }] },
  ];

  try {
    const envelope = await generateJson({
      contents,
      systemInstruction,
      responseSchema: CITIZEN_RESPONSE_SCHEMA as unknown as Schema,
      parse: (raw) => EnvelopeSchema.parse(raw),
      profile: "citizen",
    });

    let state = applyDelta(body.state, envelope.assessment, scenario);
    state = { ...state, revealed: detectReveals(envelope.reply, state, scenario) };
    const endReason = checkEnd(state, body.officerTurns, scenario);

    return Response.json({
      reply: envelope.reply,
      assessment: envelope.assessment,
      state,
      ended: endReason ? { reason: endReason } : null,
    });
  } catch (err) {
    return simErrorResponse("/api/sim/dialog", err);
  }
}
