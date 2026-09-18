import { NextRequest } from "next/server";
import { aiGuard } from "@/lib/aiGuard";
import { z } from "zod";
import type { Content, Schema } from "@google/genai";
import { generateJson, streamJsonRaw, stripFences } from "@/lib/gemini/client";
import { partialString } from "@/lib/gemini/partialJson";
import { getDialogScenario } from "@/data/scenarios";
import { buildCitizenSystemInstruction, CITIZEN_RESPONSE_SCHEMA } from "@/prompts/virtual-citizen.uz";
import { DialogHiddenStateSchema, DialogTurnAssessmentSchema } from "@/lib/storage/trainingSchema";
import { applyDelta, checkEnd, detectReveals } from "@/lib/training/dialogState";
import { replyBudget } from "@/lib/training/replyBudget";
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
  /** Opt in to the SSE response (reply streams token by token). */
  stream: z.boolean().default(false),
});

const EnvelopeSchema = z.object({
  reply: z.string().min(1),
  assessment: DialogTurnAssessmentSchema,
});

const HISTORY_WINDOW = 12;

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 1 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    const detail = e instanceof z.ZodError ? e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") : String(e);
    return Response.json({ error: "invalid_request", detail }, { status: 400 });
  }

  const scenario = getDialogScenario(body.scenarioId);
  if (!scenario) return Response.json({ error: "scenario_not_found" }, { status: 404 });

  const budget = replyBudget({
    officerText: body.officerText,
    state: body.state,
    scenario,
    turnIndex: body.officerTurns,
  });
  const systemInstruction = buildCitizenSystemInstruction({
    scenario,
    state: body.state,
    locale: body.locale,
    budget,
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

  /** Envelope → the turn result the client persists. */
  const settle = (envelope: z.infer<typeof EnvelopeSchema>) => {
    let state = applyDelta(body.state, envelope.assessment, scenario);
    state = { ...state, revealed: detectReveals(envelope.reply, state, scenario) };
    const endReason = checkEnd(state, body.officerTurns, scenario);
    return {
      reply: envelope.reply,
      assessment: envelope.assessment,
      state,
      ended: endReason ? { reason: endReason } : null,
    };
  };

  if (!body.stream) {
    try {
      const envelope = await generateJson({
        contents,
        systemInstruction,
        responseSchema: CITIZEN_RESPONSE_SCHEMA as unknown as Schema,
        parse: (raw) => EnvelopeSchema.parse(raw),
        profile: "citizen",
      });
      return Response.json(settle(envelope));
    } catch (err) {
      return simErrorResponse("/api/sim/dialog", err);
    }
  }

  const generator = streamJsonRaw({
    contents,
    systemInstruction,
    responseSchema: CITIZEN_RESPONSE_SCHEMA as unknown as Schema,
    profile: "citizen",
  });

  // Pull the first chunk before committing to a 200 stream, so key-pool
  // failover / exhaustion still answers with the documented status codes.
  let firstChunk: IteratorResult<string>;
  try {
    firstChunk = await generator.next();
  } catch (err) {
    return simErrorResponse("/api/sim/dialog", err);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

      let raw = "";
      let shown = "";
      const pump = (chunk: string) => {
        raw += chunk;
        const reply = partialString(raw, "reply");
        if (reply.length > shown.length) {
          send("delta", { text: reply.slice(shown.length) });
          shown = reply;
        }
      };

      try {
        if (!firstChunk.done && firstChunk.value) pump(firstChunk.value);
        for await (const chunk of generator) pump(chunk);

        let envelope: z.infer<typeof EnvelopeSchema> | null = null;
        try {
          envelope = EnvelopeSchema.parse(JSON.parse(stripFences(raw)));
        } catch {
          // Malformed stream → one non-streaming repair attempt.
          console.warn("[/api/sim/dialog] stream JSON malformed, retrying non-streamed:", raw.slice(0, 300));
          envelope = await generateJson({
            contents,
            systemInstruction,
            responseSchema: CITIZEN_RESPONSE_SCHEMA as unknown as Schema,
            parse: (v) => EnvelopeSchema.parse(v),
            profile: "citizen",
            retries: 0,
          });
        }
        send("final", settle(envelope));
      } catch (err) {
        console.error("[/api/sim/dialog] stream error", err);
        send("error", { error: "bad_ai_output" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
