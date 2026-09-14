import { NextRequest } from "next/server";
import { z } from "zod";
import { withKeyFailover } from "@/lib/gemini/keyPool";
import { GEMINI_MODEL } from "@/lib/gemini/config";
import { simErrorResponse } from "@/lib/training/apiErrors";

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
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const lang = LANG[body.locale] ?? LANG.uz;
  const prompt = `Bu audio — ichki ishlar xodimining o'quv mashg'ulotidagi nutqi (${lang} tilida). Faqat aytilgan so'zlarni ${lang} tilida aniq transkripsiya qil. Izoh, tarjima, qo'shimcha matn yozma. Agar nutq eshitilmasa yoki tushunarsiz bo'lsa, bo'sh qator qaytar.`;

  try {
    const text = await withKeyFailover(async (ai) => {
      const res = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [{ inlineData: { mimeType: body.mimeType, data: body.audio } }, { text: prompt }],
          },
        ],
        config: { temperature: 0.1, maxOutputTokens: 400, thinkingConfig: { thinkingBudget: 0 } },
      });
      return (res.text ?? "").trim();
    });
    return Response.json({ text });
  } catch (err) {
    return simErrorResponse("/api/stt", err);
  }
}
