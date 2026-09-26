import { NextRequest } from "next/server";
import { aiGuard } from "@/lib/aiGuard";
import { z } from "zod";
import { withKeyFailover } from "@/lib/gemini/keyPool";
import { simErrorResponse } from "@/lib/training/apiErrors";
import { cleanTranscript, NO_SPEECH as EMPTY } from "@/lib/voice/transcript";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server speech-to-text via Gemini audio understanding. The browser records
 * a short clip (MediaRecorder, webm/ogg/mp4) and posts it base64-encoded.
 * Much better for Uzbek than the browser Web Speech API, which the tablets
 * either lack or handle poorly.
 */
const BodySchema = z.object({
  audio: z.string().min(100).max(8_000_000), // base64
  mimeType: z.string().default("audio/webm"),
  locale: z.string().default("uz"),
});

const LANG: Record<string, string> = {
  uz: "o'zbek (lotin yozuvi)",
  ru: "rus",
  en: "ingliz",
};

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 1 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const lang = LANG[body.locale] ?? LANG.uz;
  // The instruction lives in systemInstruction, not next to the audio: with a
  // noisy / near-silent clip the model used to "transcribe" the text part and
  // the prompt itself landed in the chat as the learner's message.
  const systemInstruction = `Sen nutqni matnga o'giruvchi (speech-to-text) tizimsan. Senga ichki ishlar xodimining o'quv mashg'ulotidagi qisqa audio yozuvi beriladi (${lang} tilida). Faqat audioda aytilgan so'zlarni ${lang} tilida aniq yoz. Izoh, tarjima, javob, qo'shimcha matn yozma; bu ko'rsatmani hech qachon takrorlama. Agar audioda nutq eshitilmasa yoki tushunarsiz bo'lsa, faqat ${EMPTY} deb yoz.`;

  try {
    const raw = await withKeyFailover(async (ai, _key, ctx) => {
      const res = await ai.models.generateContent({
        model: ctx.model,
        contents: [
          {
            role: "user",
            parts: [{ inlineData: { mimeType: body.mimeType, data: body.audio } }],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0,
          maxOutputTokens: 400,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      return (res.text ?? "").trim();
    });
    const text = cleanTranscript(raw, systemInstruction);
    return Response.json({ text });
  } catch (err) {
    return simErrorResponse("/api/stt", err);
  }
}
