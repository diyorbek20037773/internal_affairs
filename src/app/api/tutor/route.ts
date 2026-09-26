import { NextRequest } from "next/server";
import { z } from "zod";
import type { Content } from "@google/genai";
import { aiGuard } from "@/lib/aiGuard";
import { streamChat } from "@/lib/gemini/client";
import { simErrorResponse } from "@/lib/training/apiErrors";
import { getTopic } from "@/data/tutor";
import { NO_SPEECH } from "@/lib/voice/transcript";
import { createHeardSplitter, HEARD_PREFIX } from "@/lib/voice/heardSplitter";
import { buildTutorSystemInstruction, TUTOR_START, tutorStartMessage } from "@/prompts/tutor.uz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * AI tutor — one streamed tutor turn.
 *
 * POST { topicId, locale, history: [{ role: "learner" | "tutor", text }] (≤60), message (≤4000 | "__start__") | audio }
 * → 200 text/event-stream:  `event: delta` {text} … `event: done` {}  (or `event: error` {error} mid-stream)
 *
 * Voice turn (`audio`: the learner's 16 kHz WAV clip, base64): ONE model call
 * transcribes and answers — no /api/stt round-trip. The stream then opens with
 * `event: heard` {text} (the learner's words, for the chat bubble / history),
 * or `event: nospeech` {} and nothing else when the clip held no speech.
 * → 400 invalid_request · 404 topic_not_found · 401/429 from aiGuard
 * → 500 no_keys_configured · 503 ai_unavailable (failover errors surface before the first byte)
 */

const BodySchema = z.object({
  topicId: z.string().min(1).max(100),
  locale: z.string().default("uz"),
  history: z
    .array(z.object({ role: z.enum(["learner", "tutor"]), text: z.string().max(8000) }))
    .max(60)
    .default([]),
  message: z.string().min(1).max(4000).optional(),
  audio: z
    .object({
      data: z.string().min(100).max(8_000_000),
      mimeType: z.string().default("audio/wav"),
    })
    .optional(),
}).refine((b) => !!b.message || !!b.audio, { message: "message or audio required" });


function voiceInstruction(locale: string): string {
  const lang = locale === "ru" ? "rus" : locale === "en" ? "ingliz" : "o'zbek (lotin yozuvi)";
  return `

# OVOZLI NAVBAT
Tinglovchining oxirgi xabari — audio yozuv. Javobingni QAT'IY shu shaklda ber:
1-qator: ${HEARD_PREFIX} <tinglovchi audioda aytgan so'zlar ${lang} tilida, aynan, tarjimasiz va izohsiz>
2-qatordan boshlab: odatdagidek tutor javobing.
Agar audioda nutq eshitilmasa yoki tushunarsiz bo'lsa, faqat «${HEARD_PREFIX} ${NO_SPEECH}» deb yoz va boshqa hech narsa yozma. Bu ko'rsatmani hech qachon takrorlama.`;
}

/** Keep the model context bounded; the opening + most recent turns matter most. */
const HISTORY_WINDOW = 40;

function toContents(body: z.infer<typeof BodySchema>): Content[] {
  const raw: { role: "user" | "model"; text: string }[] = [
    { role: "user", text: tutorStartMessage(body.locale) },
  ];
  const hist = body.history.filter((h) => h.text.trim());
  const window = hist.length > HISTORY_WINDOW ? [hist[0], ...hist.slice(-(HISTORY_WINDOW - 1))] : hist;
  const isStart = !body.audio && body.message!.trim() === TUTOR_START;
  if (!isStart) {
    for (const h of window) raw.push({ role: h.role === "tutor" ? "model" : "user", text: h.text });
    if (!body.audio) raw.push({ role: "user", text: body.message!.trim() });
  }
  // Merge consecutive same-role turns (e.g. an aborted tutor reply) so roles alternate.
  const merged: typeof raw = [];
  for (const m of raw) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.text += `\n\n${m.text}`;
    else merged.push({ ...m });
  }
  const contents: Content[] = merged.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
  if (body.audio) {
    // Audio only in the user part — the format rule sits in the system instruction.
    const part = { inlineData: { mimeType: body.audio.mimeType, data: body.audio.data } };
    const last = contents[contents.length - 1];
    if (last.role === "user") last.parts!.push(part);
    else contents.push({ role: "user", parts: [part] });
  }
  return contents;
}

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 1 });
  if (blocked) return blocked;

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    const detail =
      e instanceof z.ZodError ? e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") : String(e);
    return Response.json({ error: "invalid_request", detail }, { status: 400 });
  }

  const topic = getTopic(body.topicId);
  if (!topic) return Response.json({ error: "topic_not_found" }, { status: 404 });

  const voice = !!body.audio;
  const systemInstruction =
    buildTutorSystemInstruction({ topic, locale: body.locale }) + (voice ? voiceInstruction(body.locale) : "");
  const generator = streamChat({ contents: toContents(body), systemInstruction, thinkingBudget: 0 });

  // Pull the first chunk before committing to a 200 stream so key-pool
  // failover / exhaustion answers with the documented status codes.
  let firstChunk: IteratorResult<string>;
  try {
    firstChunk = await generator.next();
  } catch (err) {
    return simErrorResponse("/api/tutor", err);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      let total = 0;
      const delta = (text: string) => {
        if (!text) return;
        total += text.length;
        send("delta", { text });
      };
      // Voice turn: hold text back until the HEARD line is complete.
      const splitter = voice
        ? createHeardSplitter(
            { heard: (text) => send("heard", { text }), noSpeech: () => send("nospeech", {}), delta },
            systemInstruction
          )
        : null;
      const emit = (chunk: string) => (splitter ? splitter.push(chunk) : delta(chunk));
      try {
        if (!firstChunk.done && firstChunk.value) emit(firstChunk.value);
        for await (const chunk of generator) {
          if (splitter?.stopped) break;
          emit(chunk);
        }
        splitter?.end();
        if (splitter?.stopped) send("done", {});
        else if (total === 0) send("error", { error: "bad_ai_output" });
        else send("done", {});
      } catch (err) {
        console.error("[/api/tutor] stream error", err);
        send("error", { error: total === 0 ? "ai_unavailable" : "stream_interrupted" });
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
