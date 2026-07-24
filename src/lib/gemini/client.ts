import type { Content } from "@google/genai";
import { withKeyFailover } from "./keyPool";
import { GEMINI_MODEL, GENERATION_CONFIG, SAFETY_SETTINGS } from "./config";

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
  const { first, iterator } = await withKeyFailover(async (ai) => {
    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
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
  return withKeyFailover(async (ai) => {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
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
