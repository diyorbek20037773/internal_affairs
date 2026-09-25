import { NextRequest } from "next/server";
import { z } from "zod";
import type { Schema } from "@google/genai";
import { aiGuard } from "@/lib/aiGuard";
import { generateJson } from "@/lib/gemini/client";
import { simErrorResponse } from "@/lib/training/apiErrors";
import { getSim } from "@/data/kasblar/sims";
import { TEXT_SCORE, wordCount, type Score03 } from "@/lib/kasb/simEngine";
import { buildKasbGraderInstruction, KASB_GRADE_SCHEMA, kasbGraderUserTurn } from "@/prompts/kasb-grader.uz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  simId: z.string().min(1).max(100),
  stageId: z.string().min(1).max(100),
  answer: z.string().max(6000),
  locale: z.string().max(5).default("uz"),
});

const LlmSchema = z.object({
  score: z.number().int().min(0).max(3),
  feedback: z.string(),
  missing: z.array(z.string()),
});

export interface KasbGrade {
  /** Grader's 0–3. */
  score03: Score03;
  /** 0–100 (0/33/67/100). */
  score: number;
  feedback: string;
  missing: string[];
  tooShort: boolean;
}

/**
 * Grades one free-text task of a profession simulator. The rubric and model
 * answer are read server-side from the authored sims — the client only sends ids.
 */
export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 2 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const sim = getSim(body.simId);
  const stage = sim?.stages.find((s) => s.id === body.stageId);
  if (!sim || !stage) return Response.json({ error: "sim_not_found" }, { status: 404 });
  const task = stage.task;
  if (task.kind !== "text") return Response.json({ error: "not_free_response" }, { status: 400 });

  try {
    const llm = await generateJson({
      contents: [{ role: "user", parts: [{ text: kasbGraderUserTurn(sim, stage, task, body.answer, body.locale) }] }],
      systemInstruction: buildKasbGraderInstruction(),
      responseSchema: KASB_GRADE_SCHEMA as unknown as Schema,
      parse: (raw) => LlmSchema.parse(raw),
      profile: "grader",
    });
    const tooShort = wordCount(body.answer) < task.minWords;
    // A too-short answer cannot earn the top band, whatever the model says.
    const score03 = (tooShort ? Math.min(llm.score, 1) : llm.score) as Score03;
    const grade: KasbGrade = {
      score03,
      score: TEXT_SCORE[score03],
      feedback: llm.feedback.slice(0, 700),
      missing: llm.missing.slice(0, 8).map((m) => m.slice(0, 160)),
      tooShort,
    };
    return Response.json(grade);
  } catch (err) {
    return simErrorResponse("/api/sim/kasb-grade", err);
  }
}
