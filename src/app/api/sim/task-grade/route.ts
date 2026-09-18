import { NextRequest } from "next/server";
import { aiGuard } from "@/lib/aiGuard";
import { z } from "zod";
import type { Schema } from "@google/genai";
import { generateJson } from "@/lib/gemini/client";
import { getDecisionScenario } from "@/data/scenarios";
import { scoreRubric, wordCount } from "@/lib/training/decisionEngine";
import { simErrorResponse } from "@/lib/training/apiErrors";
import { lawsFor } from "@/prompts/debrief.uz";
import { buildTaskGraderInstruction, TASK_GRADE_SCHEMA, taskGraderUserTurn } from "@/prompts/task-grader.uz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  scenarioId: z.string(),
  nodeId: z.string(),
  locale: z.string().default("uz"),
  response: z.string().max(6000),
});

const LlmSchema = z.object({
  rubric: z.array(z.object({ id: z.string(), met: z.boolean() })),
  violation: z.boolean(),
  feedback: z.string(),
  strength: z.string(),
});

export interface TaskGrade {
  score: 0 | 1 | 2 | 3;
  rubric: Record<string, boolean>;
  violation: boolean;
  tooShort: boolean;
  feedback: string;
  strength: string;
}

/** Grades one voice/text task of the decision simulator against its authored rubric. */
export async function POST(req: NextRequest) {
  const blocked = await aiGuard(req, { cost: 2 });
  if (blocked) return blocked;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const scenario = getDecisionScenario(body.scenarioId);
  const node = scenario?.nodes[body.nodeId];
  if (!scenario || !node) return Response.json({ error: "scenario_not_found" }, { status: 404 });
  const task = node.task;
  if (task.kind !== "voice" && task.kind !== "text") return Response.json({ error: "not_free_response" }, { status: 400 });

  try {
    const llm = await generateJson({
      contents: [{ role: "user", parts: [{ text: taskGraderUserTurn(scenario, node, task, body.response, body.locale) }] }],
      systemInstruction: buildTaskGraderInstruction(lawsFor(scenario.laws)),
      responseSchema: TASK_GRADE_SCHEMA as unknown as Schema,
      parse: (raw) => LlmSchema.parse(raw),
      profile: "grader",
    });
    const rubric: Record<string, boolean> = {};
    for (const r of task.rubric) rubric[r.id] = llm.rubric.find((x) => x.id === r.id)?.met ?? false;
    const tooShort = wordCount(body.response) < task.minWords;
    const grade: TaskGrade = {
      score: scoreRubric(rubric, task.rubric.length, { violation: llm.violation, tooShort }),
      rubric,
      violation: llm.violation,
      tooShort,
      feedback: llm.feedback.slice(0, 600),
      strength: llm.strength.slice(0, 300),
    };
    return Response.json(grade);
  } catch (err) {
    return simErrorResponse("/api/sim/task-grade", err);
  }
}
