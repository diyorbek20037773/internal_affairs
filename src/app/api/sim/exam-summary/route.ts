import { NextRequest } from "next/server";
import { aiGuard } from "@/lib/aiGuard";
import { z } from "zod";
import type { Schema } from "@google/genai";
import { generateJson } from "@/lib/gemini/client";
import { COMPETENCIES, COMPETENCY_DEFINITIONS_UZ } from "@/data/scenarios/competencies";
import { getScenario } from "@/data/scenarios";
import { simErrorResponse } from "@/lib/training/apiErrors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * "Bir kunlik xizmat" 16:30 — the final debrief of the whole simulated day
 * (pptx slide 9): one verdict across all stages, "O'TDI" = ran a real day
 * independently, not "finished a course".
 */
const BodySchema = z.object({
  locale: z.string().default("uz"),
  examId: z.string(),
  stages: z
    .array(
      z.object({
        time: z.string(),
        scenarioId: z.string(),
        outcome: z.string().optional(),
        scores: z.record(z.string(), z.number()).optional(),
        summary: z.string().optional(),
        mistakes: z.array(z.string()).optional(),
      })
    )
    .min(1)
    .max(8),
});

const OutSchema = z.object({
  verdict: z.enum(["passed", "conditional", "failed"]),
  headline: z.string(),
  narrative: z.string(),
  strengths: z.array(z.string()).max(4),
  risks: z.array(z.string()).max(4),
  nextWeek: z.array(z.string()).max(4),
  independentSituations: z.array(z.string()).max(4),
  supervisedSituations: z.array(z.string()).max(4),
});

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    verdict: { type: "STRING", enum: ["passed", "conditional", "failed"] },
    headline: { type: "STRING" },
    narrative: { type: "STRING" },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    risks: { type: "ARRAY", items: { type: "STRING" } },
    nextWeek: { type: "ARRAY", items: { type: "STRING" } },
    independentSituations: { type: "ARRAY", items: { type: "STRING" } },
    supervisedSituations: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["verdict", "headline", "narrative", "strengths", "risks", "nextWeek", "independentSituations", "supervisedSituations"],
} as const;

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 3 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const lang = body.locale === "ru" ? "rus" : body.locale === "en" ? "ingliz" : "o'zbek";
  const defs = COMPETENCIES.map((c) => `- ${c}: ${COMPETENCY_DEFINITIONS_UZ[c]}`).join("\n");
  const stages = body.stages
    .map((st) => {
      const sc = getScenario(st.scenarioId);
      const scores = st.scores ? COMPETENCIES.map((c) => `${c}=${st.scores?.[c] ?? "-"}`).join(", ") : "-";
      return `## ${st.time} — ${sc ? `${sc.code} ${sc.title.uz} (${sc.kind})` : st.scenarioId}
Yakun: ${st.outcome ?? "-"}
Ballar: ${scores}
Debrif xulosasi: ${st.summary ?? "-"}
Xatolar: ${st.mistakes?.join(" | ") || "-"}`;
    })
    .join("\n\n");

  const systemInstruction = `Sen O'quv klasteri yakuniy imtihon komissiyasining AI-yordamchisisan. Xodim "Bir kunlik xizmat" imtihonida to'liq ish kunini (hudud → nizoli fuqaro → xavfli vaziyat → hujjatlashtirish) mustaqil boshqardi. Butun kun bo'yicha BITTA xulosa ber.
Tamoyillar: baho — qonuniylik, mutanosiblik, muloqot, natija; tezlik emas. Xato jazolanmaydi, tajribaga aylantiriladi. "O'TDI" degani — "kursni tugatdi" emas, "REAL KUNNI MUSTAQIL BOSHQARDI" degani.
verdict: passed — barcha bosqichlarda qonuniy va xavfsiz yakun, o'rtacha ≥ 65; conditional — bitta jiddiy kamchilik yoki 50–65; failed — qonunsiz kuch / fuqaro jarohati / < 50.
${lang} tilida, aniq, hurmatli. Yakuniy qaror instruktorniki.
# 8 KOMPETENSIYA
${defs}
CHIQISH — faqat JSON (sxema bo'yicha).`;

  try {
    const out = await generateJson({
      contents: [{ role: "user", parts: [{ text: `# IMTIHON ${body.examId}\n\n${stages}` }] }],
      systemInstruction,
      responseSchema: RESPONSE_SCHEMA as unknown as Schema,
      parse: (raw) => OutSchema.parse(raw),
      profile: "grader",
    });
    return Response.json({ ...out, createdAt: new Date().toISOString() });
  } catch (err) {
    return simErrorResponse("/api/sim/exam-summary", err);
  }
}
