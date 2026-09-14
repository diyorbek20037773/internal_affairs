export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const GENERATION_CONFIG = {
  temperature: 0.4,
  topP: 0.95,
  maxOutputTokens: 2048,
};

/**
 * Structured (JSON-mode) generation profiles used by the HIMOYA-360 trainers.
 * `citizen` — virtual citizen role-play: warmer, more varied.
 * `grader`  — debrief / rubric grading: cold and deterministic.
 */
export const JSON_GENERATION_CONFIG = {
  citizen: { temperature: 0.7, topP: 0.95, maxOutputTokens: 1024 },
  grader: { temperature: 0.2, topP: 0.9, maxOutputTokens: 4096 },
} as const;

export type JsonProfile = keyof typeof JSON_GENERATION_CONFIG;

/**
 * Safety settings — relaxed for a law-enforcement professional tool that must
 * discuss crimes/incidents factually. We still rely on the system prompt guards.
 */
export const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
] as const;
