/**
 * Server-side transcript hygiene shared by /api/stt and the one-call voice
 * turns (/api/tutor). Gemini sometimes "transcribes" its own instruction when
 * a clip is silent or noisy — that text must never reach the chat.
 */

/** Marker the model answers when it hears no speech. */
export const NO_SPEECH = "[NUTQ_YOQ]";

const words = (t: string) =>
  t
    .toLowerCase()
    .replace(/[‘’ʻʼ`]/g, "'")
    .split(/[^\p{L}\p{N}']+/u)
    .filter((w) => w.length > 2);

/** "" for the no-speech marker or output that mostly repeats `instruction`. */
export function cleanTranscript(raw: string, instruction: string): string {
  const text = raw.replace(/^["«']|["»']$/g, "").trim();
  if (!text || text.includes(NO_SPEECH) || /NUTQ_YO/i.test(text)) return "";
  const out = words(text);
  if (out.length >= 5) {
    const ref = new Set(words(instruction));
    const hit = out.filter((w) => ref.has(w)).length;
    if (hit / out.length > 0.6) return "";
  }
  if (/transkripsiya|speech-to-text|matnga o'giruvchi|HEARD:/i.test(text)) return "";
  return text;
}
