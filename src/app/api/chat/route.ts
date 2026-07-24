import { NextRequest } from "next/server";
import { z } from "zod";
import type { Content } from "@google/genai";
import { streamChat } from "@/lib/gemini/client";
import { buildSystemInstruction } from "@/prompts/system-prompt.uz";
import {
  AllKeysExhaustedError,
  NoKeysConfiguredError,
} from "@/lib/gemini/keyPool";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .min(1),
  locale: z.string().default("uz"),
  context: z
    .object({
      incidentType: z.string().optional(),
      incidentLabel: z.string().optional(),
      sopId: z.string().optional(),
      currentStepTitle: z.string().optional(),
      remainingChecklist: z.array(z.string()).optional(),
    })
    .optional(),
});

function toContents(
  messages: { role: "user" | "assistant"; content: string }[]
): Content[] {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const systemInstruction = buildSystemInstruction({
    locale: body.locale,
    incidentLabel: body.context?.incidentLabel,
    currentStepTitle: body.context?.currentStepTitle,
    remainingChecklist: body.context?.remainingChecklist,
  });

  const contents = toContents(body.messages);

  const generator = streamChat({ contents, systemInstruction });

  // Pull the first chunk here so key-pool failover / exhaustion surfaces as a
  // proper HTTP status before we commit to a streaming response.
  let firstChunk: IteratorResult<string>;
  try {
    firstChunk = await generator.next();
  } catch (err) {
    if (err instanceof NoKeysConfiguredError) {
      return Response.json({ error: "no_keys_configured" }, { status: 500 });
    }
    if (err instanceof AllKeysExhaustedError) {
      return Response.json({ error: "ai_unavailable" }, { status: 503 });
    }
    console.error("[/api/chat] error", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!firstChunk.done && firstChunk.value) {
          controller.enqueue(encoder.encode(firstChunk.value));
        }
        for await (const chunk of generator) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        console.error("[/api/chat] stream error", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
