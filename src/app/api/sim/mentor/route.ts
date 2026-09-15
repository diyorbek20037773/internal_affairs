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
 * AI-Mentor (pptx slide 8): "OLDIN zaif tomonni aniqlaydi • DAVOMIDA kuzatadi
 * • KEYIN individual tavsiya beradi". The rule engine picks the scenario;
 * Gemini writes the personal coaching note from the HIMOYA-ID profile and the
 * last sessions. The instructor still confirms every score — this only advises.
 */
const BodySchema = z.object({
  locale: z.string().default("uz"),
  scores: z.record(z.string(), z.number()),
  samples: z.record(z.string(), z.number()),
  recommendedScenarioId: z.string(),
  targetCompetency: z.string(),
  recent: z
    .array(z.object({ scenarioId: z.string(), kind: z.string(), outcome: z.string().optional(), avg: z.number().optional(), at: z.string() }))
    .max(8),
});

const OutSchema = z.object({
  text: z.string(),
  focus: z.array(z.string()).max(3),
  drill: z.string(),
});

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    text: { type: "STRING" },
    focus: { type: "ARRAY", items: { type: "STRING" } },
    drill: { type: "STRING" },
  },
  required: ["text", "focus", "drill"],
} as const;

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 2 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const scenario = getScenario(body.recommendedScenarioId);
  const lang = body.locale === "ru" ? "rus" : body.locale === "en" ? "ingliz" : "o'zbek";
  const profile = COMPETENCIES.map((c) => `- ${c}: ${body.scores[c] ?? 0}% (${body.samples[c] ?? 0} mashg'ulot) — ${COMPETENCY_DEFINITIONS_UZ[c]}`).join("\n");
  const recent = body.recent.map((r) => `- ${r.at.slice(0, 10)} ${r.kind} ${r.scenarioId} → ${r.outcome ?? "-"}${r.avg != null ? ` (${r.avg}%)` : ""}`).join("\n") || "- (yo'q)";

  const systemInstruction = `Sen HIMOYA-360 platformasining AI-Mentorisan — ichki ishlar organi xodimining shaxsiy raqamli treneri. Instruktor emassan, qaror chiqarmaysan: FAQAT tavsiya berasan ("AI qaror bermaydi — instruktor tasdiqlaydi").
Ohang: hurmatli, qisqa, aniq, motivatsion; "siz" bilan. ${lang} tilida yoz. Ballarni takrorlama — xulosa chiqar.
CHIQISH — faqat JSON: {"text": 2–3 gap shaxsiy tavsiya (nega aynan shu ssenariy, qaysi ko'nikma), "focus": 2–3 ta aniq e'tibor nuqtasi (har biri ≤ 8 so'z), "drill": bitta mikro-mashq (bitta gap, mashg'ulotdan oldin 2 daqiqada bajariladigan)}`;
  const user = `# HIMOYA-ID profili
${profile}

# Oxirgi mashg'ulotlar
${recent}

# Tizim tavsiyasi
Eng zaif yo'nalish: ${body.targetCompetency}. Keyingi ssenariy: ${scenario ? `${scenario.code} — ${scenario.title.uz} (${scenario.kind}; rivojlantiradi: ${scenario.tags.join(", ")})` : body.recommendedScenarioId}.`;

  try {
    const out = await generateJson({
      contents: [{ role: "user", parts: [{ text: user }] }],
      systemInstruction,
      responseSchema: RESPONSE_SCHEMA as unknown as Schema,
      parse: (raw) => OutSchema.parse(raw),
      profile: "grader",
    });
    return Response.json(out);
  } catch (err) {
    return simErrorResponse("/api/sim/mentor", err);
  }
}
