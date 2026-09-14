import { AllKeysExhaustedError, NoKeysConfiguredError } from "@/lib/gemini/keyPool";
import { JsonOutputError } from "@/lib/gemini/client";

/** Map Gemini-layer errors to the HTTP contract shared by all /api/sim routes. */
export function simErrorResponse(tag: string, err: unknown): Response {
  if (err instanceof NoKeysConfiguredError) {
    return Response.json({ error: "no_keys_configured" }, { status: 500 });
  }
  if (err instanceof AllKeysExhaustedError) {
    return Response.json({ error: "ai_unavailable" }, { status: 503 });
  }
  if (err instanceof JsonOutputError) {
    console.error(`[${tag}] bad AI output`, err.raw);
    return Response.json({ error: "bad_ai_output" }, { status: 502 });
  }
  console.error(`[${tag}] error`, err);
  const detail = err instanceof Error ? err.message.slice(0, 300) : String(err).slice(0, 300);
  return Response.json({ error: "internal_error", detail }, { status: 500 });
}
