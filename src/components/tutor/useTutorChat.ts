"use client";

import { useCallback, useRef, useState } from "react";
import { uid } from "@/lib/utils";

export interface TutorMsg {
  id: string;
  role: "learner" | "tutor";
  text: string;
}

const START = "__start__";
const MAX_HISTORY = 60;

interface Options {
  topicId: string;
  locale: string;
  /** Growing streamed reply text (for sentence-by-sentence TTS). */
  onDelta?: (partial: string) => void;
  /** Final reply text. */
  onDone?: (full: string) => void;
  /** A tutor reply to a learner message completed (one Q&A turn). */
  onTurn?: () => void;
}

/** Parse one SSE block ("event: x\ndata: {...}"). */
function parseBlock(block: string): { event: string; data: unknown } | null {
  let event = "message";
  const data: string[] = [];
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data.push(line.slice(5).trim());
  }
  if (!data.length) return null;
  try {
    return { event, data: JSON.parse(data.join("\n")) };
  } catch {
    return null;
  }
}

/** Streaming Q&A with /api/tutor. */
export function useTutorChat({ topicId, locale, onDelta, onDone, onTurn }: Options) {
  const [messages, setMessages] = useState<TutorMsg[]>([]);
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const msgsRef = useRef<TutorMsg[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  const cbRef = useRef({ onDelta, onDone, onTurn });
  cbRef.current = { onDelta, onDone, onTurn };

  const commit = useCallback((next: TutorMsg[]) => {
    msgsRef.current = next;
    setMessages(next);
  }, []);

  const run = useCallback(
    async (message: string) => {
      if (busyRef.current) return;
      const isStart = message === START;
      const history = msgsRef.current.slice(-MAX_HISTORY).map(({ role, text }) => ({ role, text }));
      if (!isStart) commit([...msgsRef.current, { id: uid(), role: "learner", text: message }]);

      busyRef.current = true;
      setBusy(true);
      setStreaming("");
      setError(null);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      let acc = "";
      let failed: string | null = null;

      try {
        const res = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId, locale, history: isStart ? [] : history, message }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          failed = j.error ?? (res.status === 429 ? "rate_limited" : "error");
        } else {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buf = "";
          let finished = false;
          while (!finished) {
            const { value, done } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            let idx: number;
            while ((idx = buf.indexOf("\n\n")) >= 0) {
              const block = buf.slice(0, idx);
              buf = buf.slice(idx + 2);
              const ev = parseBlock(block);
              if (!ev) continue;
              if (ev.event === "delta") {
                const t = (ev.data as { text?: string }).text ?? "";
                if (t) {
                  acc += t;
                  setStreaming(acc);
                  cbRef.current.onDelta?.(acc);
                }
              } else if (ev.event === "error") {
                failed = (ev.data as { error?: string }).error ?? "error";
                finished = true;
              } else if (ev.event === "done") {
                finished = true;
              }
            }
          }
        }
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) failed = "network";
      } finally {
        abortRef.current = null;
      }

      const text = acc.trim();
      if (text) {
        commit([...msgsRef.current, { id: uid(), role: "tutor", text }]);
        if (!failed) {
          cbRef.current.onDone?.(text);
          if (!isStart) cbRef.current.onTurn?.();
        }
      }
      setStreaming("");
      busyRef.current = false;
      setBusy(false);
      if (failed) setError(failed);
    },
    [commit, locale, topicId]
  );

  const start = useCallback(() => run(START), [run]);
  const send = useCallback((text: string) => {
    const t = text.trim();
    if (t) void run(t.slice(0, 4000));
  }, [run]);
  const stop = useCallback(() => abortRef.current?.abort(), []);
  const clearError = useCallback(() => setError(null), []);

  return { messages, streaming, busy, error, start, send, stop, clearError, started: messages.length > 0 };
}
