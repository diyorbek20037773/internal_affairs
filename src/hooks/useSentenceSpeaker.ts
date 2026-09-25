"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SpeechApi } from "./useSpeech";

/**
 * Speaks a reply WHILE it is still streaming. The first complete sentence is
 * sent to TTS the moment it exists; the rest goes out in larger chunks (fewer
 * TTS calls → kinder to the quota) and plays gap-free from the prefetch queue.
 */
const FIRST_MIN = 18;
const NEXT_MIN = 200;

/** Index just past the last sentence end that is outside "( … )" remarks. */
function lastSentenceEnd(text: string, from: number): number {
  let depth = 0;
  let end = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (i >= from && depth === 0 && (ch === "." || ch === "!" || ch === "?" || ch === "…")) {
      const next = text[i + 1];
      if (next === undefined || next === " " || next === "\n" || next === '"' || next === "»") end = i + 1;
    }
  }
  return end;
}

export function useSentenceSpeaker(speech: SpeechApi, enabled: boolean) {
  const sentRef = useRef(0);
  const chunksRef = useRef(0);
  const [pending, setPending] = useState(false);
  const { enqueueSpeech, stopSpeaking } = speech;

  const reset = useCallback(() => {
    sentRef.current = 0;
    chunksRef.current = 0;
    setPending(false);
    stopSpeaking();
  }, [stopSpeaking]);

  const feed = useCallback(
    (text: string) => {
      if (!enabled) return;
      if (text.length < sentRef.current) sentRef.current = 0; // a new reply
      const end = lastSentenceEnd(text, sentRef.current);
      if (end <= sentRef.current) return;
      const chunk = text.slice(sentRef.current, end).trim();
      const min = chunksRef.current === 0 ? FIRST_MIN : NEXT_MIN;
      if (chunk.length < min) return;
      sentRef.current = end;
      chunksRef.current++;
      setPending(true);
      enqueueSpeech(chunk);
    },
    [enabled, enqueueSpeech]
  );

  const end = useCallback(
    (text: string) => {
      if (enabled) {
        const rest = text.slice(sentRef.current).trim();
        if (rest) enqueueSpeech(rest);
      }
      sentRef.current = 0;
      chunksRef.current = 0;
      setPending(false);
    },
    [enabled, enqueueSpeech]
  );

  useEffect(() => {
    if (!enabled) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const idle = !speech.speaking && !pending;
  return useMemo(() => ({ feed, end, reset, idle }), [feed, end, reset, idle]);
}
