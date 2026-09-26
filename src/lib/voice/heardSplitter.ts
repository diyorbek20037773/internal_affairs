import { cleanTranscript } from "./transcript";

/** First line of a one-call voice answer: `HEARD: <learner's words>`. */
export const HEARD_PREFIX = "HEARD:";

export interface HeardSink {
  heard: (text: string) => void;
  noSpeech: () => void;
  delta: (text: string) => void;
}

/**
 * Splits a streamed voice-turn answer into the HEARD line and the reply.
 * Text is held back only until the first line is complete; the reply then
 * streams straight through. Tolerates a bolded label and a model that skips
 * the line entirely (reply streams, words unknown → heard "").
 */
export function createHeardSplitter(sink: HeardSink, instruction: string) {
  let head: string | null = "";
  let stopped = false;

  const flush = (final: boolean) => {
    if (head === null) return;
    const trimmed = head.trimStart().replace(/^[*_`]+/, "");
    const hasPrefix = trimmed.toUpperCase().startsWith(HEARD_PREFIX);
    if (!hasPrefix && (trimmed.length >= HEARD_PREFIX.length || final)) {
      head = null;
      if (!trimmed.trim()) {
        stopped = true;
        sink.noSpeech();
        return;
      }
      sink.heard("");
      sink.delta(trimmed);
      return;
    }
    const nl = trimmed.indexOf("\n");
    if (nl < 0 && !final && trimmed.length < 1200) return;
    const line = nl < 0 ? trimmed : trimmed.slice(0, nl);
    const rest = nl < 0 ? "" : trimmed.slice(nl + 1).replace(/^\s+/, "");
    head = null;
    const heard = cleanTranscript(line.slice(HEARD_PREFIX.length).replace(/^[*_`\s]+/, "").trim(), instruction);
    if (!heard && (/NUTQ_YO/i.test(line) || !rest.trim())) {
      stopped = true;
      sink.noSpeech();
      return;
    }
    sink.heard(heard);
    if (rest) sink.delta(rest);
  };

  return {
    push(chunk: string) {
      if (stopped) return;
      if (head === null) {
        if (chunk) sink.delta(chunk);
        return;
      }
      head += chunk;
      flush(false);
    },
    end() {
      if (!stopped) flush(true);
    },
    /** True once the clip was judged to hold no speech — stop reading the model. */
    get stopped() {
      return stopped;
    },
  };
}
