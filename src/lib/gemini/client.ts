import type { Content, Schema } from "@google/genai";
import { withKeyFailover } from "./keyPool";
import {
  GENERATION_CONFIG,
  modelFor,
  JSON_GENERATION_CONFIG,
  SAFETY_SETTINGS,
  type JsonProfile,
} from "./config";

export interface StreamChatArgs {
  contents: Content[];
  systemInstruction: string;
}

/**
 * Stream a chat completion from Gemini as text chunks. Key selection + failover
 * happen while establishing the stream and pulling the FIRST chunk, so a 429
 * rotates keys before any bytes are yielded to the caller.
 */
export async function* streamChat({
  contents,
  systemInstruction,
}: StreamChatArgs): AsyncGenerator<string> {
  const { first, iterator } = await withKeyFailover(async (ai, _key, ctx) => {
    const response = await ai.models.generateContentStream({
      model: modelFor(ctx.overloaded),
      contents,
      config: {
        systemInstruction,
        temperature: GENERATION_CONFIG.temperature,
        topP: GENERATION_CONFIG.topP,
        maxOutputTokens: GENERATION_CONFIG.maxOutputTokens,
        safetySettings: SAFETY_SETTINGS as unknown as never,
      },
    });
    const it = response[Symbol.asyncIterator]();
    const firstChunk = await it.next(); // 429/quota surfaces here → failover
    return { first: firstChunk, iterator: it };
  });

  if (!first.done && first.value?.text) {
    yield first.value.text;
  }
  while (true) {
    const next = await iterator.next();
    if (next.done) break;
    const text = next.value?.text;
    if (text) yield text;
  }
}

/** Non-streaming helper (used where streaming isn't needed). */
export async function generateText({
  contents,
  systemInstruction,
}: StreamChatArgs): Promise<string> {
  return withKeyFailover(async (ai, _key, ctx) => {
    const response = await ai.models.generateContent({
      model: modelFor(ctx.overloaded),
      contents,
      config: {
        systemInstruction,
        temperature: GENERATION_CONFIG.temperature,
        topP: GENERATION_CONFIG.topP,
        maxOutputTokens: GENERATION_CONFIG.maxOutputTokens,
        safetySettings: SAFETY_SETTINGS as unknown as never,
      },
    });
    return response.text ?? "";
  });
}

/* ------------------------------------------------------------------------ */
/* Structured JSON generation (HIMOYA-360 trainers)                          */
/* ------------------------------------------------------------------------ */

export class JsonOutputError extends Error {
  constructor(message = "Gemini returned malformed JSON", public raw?: string) {
    super(message);
    this.name = "JsonOutputError";
  }
}

export interface GenerateJsonArgs<T> {
  contents: Content[];
  systemInstruction: string;
  /** Gemini response schema (`Type.OBJECT` …) — enforces shape + enums. */
  responseSchema: Schema;
  /** Strict parser (zod safeParse wrapper). MUST throw on invalid input. */
  parse: (raw: unknown) => T;
  profile?: JsonProfile;
  /** Repair retries after the first malformed answer. Default 1. */
  retries?: number;
}

function stripFences(text: string): string {
  const trimmed = text.trim();
  const m = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return m ? m[1] : trimmed;
}

/**
 * Generate a JSON document that satisfies `responseSchema` and `parse`.
 * Key failover happens inside each attempt; a malformed answer triggers one
 * repair attempt with an explicit "JSON only" reminder appended to the turn.
 */
export async function generateJson<T>({
  contents,
  systemInstruction,
  responseSchema,
  parse,
  profile = "grader",
  retries = 1,
}: GenerateJsonArgs<T>): Promise<T> {
  const gen = JSON_GENERATION_CONFIG[profile];
  let lastRaw = "";
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const turn: Content[] =
      attempt === 0
        ? contents
        : [
            ...contents,
            {
              role: "user",
              parts: [
                {
                  text:
                    "Oldingi javob sxemaga mos kelmadi. FAQAT to'g'ri JSON qaytar, izohsiz, kod bloksiz.",
                },
              ],
            },
          ];

    const raw = await withKeyFailover(async (ai, _key, ctx) => {
      const response = await ai.models.generateContent({
        model: modelFor(ctx.overloaded),
        contents: turn,
        config: {
          systemInstruction,
          temperature: gen.temperature,
          topP: gen.topP,
          maxOutputTokens: gen.maxOutputTokens,
          thinkingConfig: { thinkingBudget: gen.thinkingBudget },
          responseMimeType: "application/json",
          responseSchema,
          safetySettings: SAFETY_SETTINGS as unknown as never,
        },
      });
      return response.text ?? "";
    });

    lastRaw = raw;
    try {
      const json = JSON.parse(stripFences(raw));
      return parse(json);
    } catch (err) {
      lastErr = err;
      console.warn(
        `[gemini] JSON parse failed (attempt ${attempt + 1}/${retries + 1})`,
        err instanceof Error ? err.message : err,
        "raw:",
        raw.slice(0, 400)
      );
    }
  }

  throw new JsonOutputError(
    lastErr instanceof Error ? lastErr.message : undefined,
    lastRaw.slice(0, 500)
  );
}
