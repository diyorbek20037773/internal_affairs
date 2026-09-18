import { errorDetail } from "@/lib/training/apiErrors";
import { NextRequest } from "next/server";
import { aiGuard } from "@/lib/aiGuard";
import { z } from "zod";
import { withKeyFailover } from "@/lib/gemini/keyPool";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
const VOICE = process.env.GEMINI_TTS_VOICE || "Kore";

// The Gemini TTS model auto-detects the text language; passing `languageCode`
// made ru/en requests fail (INVALID_ARGUMENT) while uz — sent without it —
// worked. So we never send it and steer pronunciation via a short prefix.
const LANG_HINT: Record<string, string> = {
  ru: "Прочитай по-русски: ",
  en: "Read in English: ",
  uz: "O'zbek tilida o'qi: ",
};

const BodySchema = z.object({
  text: z.string().min(1).max(1200),
  locale: z.string().default("uz"),
});

function pcmToWav(pcm: Buffer, sampleRate: number): Buffer {
  const channels = 1;
  const bits = 16;
  const blockAlign = (channels * bits) / 8;
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bits, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function rateFromMime(mime: string | undefined): number {
  const m = mime?.match(/rate=(\d+)/);
  return m ? parseInt(m[1], 10) : 24000;
}

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 1 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const speechConfig: Record<string, unknown> = {
    voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
  };
  const text = (LANG_HINT[body.locale] ?? "") + body.text;

  try {
    const { data, mime } = await withKeyFailover(async (ai) => {
      const res = await ai.models.generateContent({
        model: TTS_MODEL,
        contents: [{ role: "user", parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig,
        } as unknown as never,
      });
      const part = res.candidates?.[0]?.content?.parts?.[0];
      const inline = part?.inlineData;
      if (!inline?.data) throw new Error("no_audio");
      return { data: inline.data, mime: inline.mimeType };
    }, { model: TTS_MODEL, fallbackModel: null });

    const pcm = Buffer.from(data, "base64");
    const wav = pcmToWav(pcm, rateFromMime(mime));

    return new Response(new Uint8Array(wav), {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/tts] error", err);
    return Response.json({ error: "tts_failed", ...errorDetail(err) }, { status: 502 });
  }
}
