import { errorDetail } from "@/lib/training/apiErrors";
import { NextRequest } from "next/server";
import { aiGuard } from "@/lib/aiGuard";
import { z } from "zod";
import type { Content } from "@google/genai";
import { streamChat } from "@/lib/gemini/client";
import { buildLegalSystemInstruction } from "@/prompts/system-prompt.uz";
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
});

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 2 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const systemInstruction = buildLegalSystemInstruction(body.locale);

  // RAG hook: in a future phase, retrieve legal document chunks for the last
  // user query and prepend them to `contents` here (Qdrant / pgvector).
  //   const context = await retrieveLegalContext(lastUserMessage);
  //   contents.unshift({ role: "user", parts: [{ text: context }] });

  const contents: Content[] = body.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const generator = streamChat({ contents, systemInstruction });

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
    console.error("[/api/legal] error", err);
    return Response.json({ error: "internal_error", ...errorDetail(err) }, { status: 500 });
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
        console.error("[/api/legal] stream error", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
