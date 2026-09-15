import { NextRequest } from "next/server";
import { aiGuard } from "@/lib/aiGuard";
import { z } from "zod";
import type { Schema } from "@google/genai";
import { generateJson } from "@/lib/gemini/client";
import { getMahallaScenario } from "@/data/scenarios";
import { clampScore } from "@/data/scenarios/competencies";
import type { MahallaGrade } from "@/data/scenarios/types";
import { mahallaDeterministic, prioritizationScore } from "@/lib/training/competency";
import { simErrorResponse } from "@/lib/training/apiErrors";
import {
  buildMahallaGraderInstruction,
  MAHALLA_GRADE_SCHEMA,
  mahallaGraderUserTurn,
} from "@/prompts/mahalla-grader.uz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  scenarioId: z.string(),
  locale: z.string().default("uz"),
  picked: z.array(z.string()).min(1).max(3),
  plans: z.record(z.string(), z.string().max(4000)),
});

const LlmSchema = z.object({
  planScores: z.array(
    z.object({
      problemId: z.string(),
      score: z.number(),
      missing: z.array(z.string()),
      feedback: z.string(),
    })
  ),
});

export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 3 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const scenario = getMahallaScenario(body.scenarioId);
  if (!scenario) return Response.json({ error: "scenario_not_found" }, { status: 404 });

  const validIds = new Set(scenario.problems.map((p) => p.id));
  const picked = body.picked.filter((id) => validIds.has(id));
  if (picked.length === 0) return Response.json({ error: "invalid_request" }, { status: 400 });

  // Deterministic part never depends on the model.
  const prio = prioritizationScore(picked, scenario.answerKey.top3);

  try {
    const llm = await generateJson({
      contents: [{ role: "user", parts: [{ text: mahallaGraderUserTurn(scenario, picked, body.plans, body.locale) }] }],
      systemInstruction: buildMahallaGraderInstruction(),
      responseSchema: MAHALLA_GRADE_SCHEMA as unknown as Schema,
      parse: (raw) => LlmSchema.parse(raw),
      profile: "grader",
    });

    const planScores: MahallaGrade["planScores"] = {};
    for (const id of picked) {
      const g = llm.planScores.find((x) => x.problemId === id);
      planScores[id] = g
        ? { score: clampScore(g.score), missing: g.missing.slice(0, 8), feedback: g.feedback }
        : { score: 0, missing: scenario.answerKey.planRubric[id] ?? [], feedback: "" };
    }

    const partial: MahallaGrade = { prioritizationScore: prio, planScores, scores: {} };
    const grade: MahallaGrade = { ...partial, scores: mahallaDeterministic(partial) };
    return Response.json(grade);
  } catch (err) {
    return simErrorResponse("/api/sim/mahalla-grade", err);
  }
}
