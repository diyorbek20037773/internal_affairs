"use client";

import { useCallback, useRef, useState } from "react";
import type {
  DialogEndReason,
  DialogHiddenState,
  DialogScenario,
  DialogTurn,
  DialogTurnAssessment,
} from "@/data/scenarios/types";
import type { DialogPayload, TrainingSession } from "@/lib/storage/trainingSchema";
import { trainingRepo } from "@/lib/storage/training";
import { touch } from "@/lib/training/sessionFactory";

interface DialogApiResponse {
  /** What the model heard (voice turns) or the typed text. */
  heard?: string;
  reply: string;
  assessment: DialogTurnAssessment;
  state: DialogHiddenState;
  ended: null | { reason: Exclude<DialogEndReason, "abandoned"> };
}

export type DialogSimError =
  | "ai_unavailable"
  | "no_keys_configured"
  | "bad_ai_output"
  | "too_long"
  | "rate_limited"
  | "no_speech"
  | "generic";

/** A voice turn: the officer's recorded clip, sent straight to the dialog model. */
export interface VoiceInput {
  audio: string; // base64 WAV
  mimeType: string;
}

/** Placeholder shown in the officer bubble until the model reports what it heard. */
export const HEARING_PLACEHOLDER = "🎤 …";

type StreamOutcome = { ok: true; data: DialogApiResponse } | { ok: false; error: string };

/**
 * Consume the SSE turn stream: `delta` frames carry the citizen's reply as it
 * is generated (shown live), `final` carries the authoritative turn result.
 */
async function readTurnStream(
  res: Response,
  onDelta: (text: string) => void,
  onHeard: (text: string) => void
): Promise<StreamOutcome> {
  const reader = res.body?.getReader();
  if (!reader) return { ok: false, error: "bad_ai_output" };
  const decoder = new TextDecoder();
  let buffer = "";
  let shown = "";
  let final: DialogApiResponse | null = null;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let cut: number;
    while ((cut = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);
      const event = /^event: (.+)$/m.exec(frame)?.[1];
      const data = frame
        .split("\n")
        .filter((l) => l.startsWith("data: "))
        .map((l) => l.slice(6))
        .join("");
      if (!event || !data) continue;
      const payload = JSON.parse(data);
      if (event === "heard") {
        onHeard(payload.text as string);
      } else if (event === "delta") {
        shown += payload.text as string;
        onDelta(shown);
      } else if (event === "final") {
        final = payload as DialogApiResponse;
      } else if (event === "error") {
        return { ok: false, error: (payload.error as string) || "bad_ai_output" };
      }
    }
  }
  return final ? { ok: true, data: final } : { ok: false, error: "bad_ai_output" };
}

/**
 * Drives one AI-Muloqot session: sends officer utterances to /api/sim/dialog,
 * persists after every turn (4G-drop safe), exposes live state + end reason.
 */
export function useDialogSim(scenario: DialogScenario, initial: TrainingSession, locale: string) {
  const [session, setSession] = useState<TrainingSession>(initial);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState<DialogSimError | null>(null);
  /** Citizen reply as it streams in; cleared once the turn is persisted. */
  const [streamingReply, setStreamingReply] = useState("");
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const payload = session.payload as DialogPayload;

  const persist = useCallback(async (s: TrainingSession) => {
    setSession(s);
    await trainingRepo.saveSession(s);
  }, []);

  const send = useCallback(
    async (input: string | VoiceInput, hooks?: { onDelta?: (text: string) => void }) => {
      const cur = sessionRef.current;
      const p = cur.payload as DialogPayload;
      if (busy || busyRef.current || cur.status !== "in_progress") return;
      const voice = typeof input === "string" ? null : input;
      const trimmed = voice ? HEARING_PLACEHOLDER : (input as string).trim();
      if (!trimmed) return;

      busyRef.current = true;
      setBusy(true);
      setError(null);

      const officerTurnsBefore = p.transcript.filter((t) => t.role === "officer").length;
      const officerTurn: DialogTurn = {
        i: p.transcript.length,
        role: "officer",
        text: trimmed,
        at: new Date().toISOString(),
      };

      // Optimistically show the officer line; roll back on failure.
      const optimistic = touch(cur, {
        payload: { ...p, transcript: [...p.transcript, officerTurn] },
      });
      setSession(optimistic);

      try {
        const res = await fetch("/api/sim/dialog", {
          method: "POST",
          signal: AbortSignal.timeout(60000),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: scenario.id,
            locale,
            state: p.state,
            history: p.transcript.slice(1).map((t) => ({ role: t.role, text: t.text })),
            ...(voice ? { audio: { data: voice.audio, mimeType: voice.mimeType } } : { officerText: trimmed }),
            officerTurns: officerTurnsBefore + 1,
            stream: true,
          }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
          const code = j.error;
          setError(
            code === "ai_unavailable" || code === "no_keys_configured" || code === "bad_ai_output"
              ? code
              : code === "invalid_request"
                ? "too_long"
                : code === "rate_limited"
                  ? "rate_limited"
                  : code === "no_speech"
                    ? "no_speech"
                    : "generic"
          );
          if (code === "invalid_request") console.warn("[dialog] invalid_request:", j.detail);
          setSession(cur);
          return;
        }
        let heardText = trimmed;
        const outcome = await readTurnStream(
          res,
          (t) => {
            setStreamingReply(t);
            hooks?.onDelta?.(t);
          },
          (h) => {
            heardText = h;
            setSession(
              touch(cur, {
                payload: { ...p, transcript: [...p.transcript, { ...officerTurn, text: h }] },
              })
            );
          }
        );
        if (!outcome.ok) {
          setError(outcome.error === "no_speech" ? "no_speech" : "bad_ai_output");
          setSession(cur);
          return;
        }
        const data = outcome.data;

        const officerWithAssessment: DialogTurn = {
          ...officerTurn,
          text: (data.heard || heardText).trim() || heardText,
          assessment: data.assessment,
          stateAfter: data.state,
        };
        const citizenTurn: DialogTurn = {
          i: officerTurn.i + 1,
          role: "citizen",
          text: data.reply,
          at: new Date().toISOString(),
        };

        const nextPayload: DialogPayload = {
          kind: "dialog",
          transcript: [...p.transcript, officerWithAssessment, citizenTurn],
          state: data.state,
          endReason: data.ended?.reason,
        };
        const next = touch(cur, {
          payload: nextPayload,
          status: data.ended ? "completed" : "in_progress",
          endedAt: data.ended ? new Date().toISOString() : undefined,
        });
        await persist(next);
      } catch {
        setError("generic");
        setSession(cur);
      } finally {
        setStreamingReply("");
        busyRef.current = false;
        setBusy(false);
      }
    },
    [busy, locale, persist, scenario.id]
  );

  const abandon = useCallback(async () => {
    const cur = sessionRef.current;
    if (cur.status !== "in_progress") return;
    const p = cur.payload as DialogPayload;
    await persist(
      touch(cur, {
        status: "abandoned",
        endedAt: new Date().toISOString(),
        payload: { ...p, endReason: "abandoned" },
      })
    );
  }, [persist]);

  const officerTurns = payload.transcript.filter((t) => t.role === "officer").length;
  const lastAssessment = [...payload.transcript].reverse().find((t) => t.assessment)?.assessment;

  return {
    session,
    payload,
    state: payload.state,
    transcript: payload.transcript,
    officerTurns,
    lastAssessment,
    busy,
    streamingReply,
    error,
    clearError: () => setError(null),
    send,
    abandon,
    ended: session.status !== "in_progress" ? payload.endReason ?? "abandoned" : null,
  };
}
