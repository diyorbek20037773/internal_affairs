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
import { localTrainingRepo } from "@/lib/storage/training";
import { touch } from "@/lib/training/sessionFactory";

interface DialogApiResponse {
  reply: string;
  assessment: DialogTurnAssessment;
  state: DialogHiddenState;
  ended: null | { reason: Exclude<DialogEndReason, "abandoned"> };
}

export type DialogSimError = "ai_unavailable" | "no_keys_configured" | "bad_ai_output" | "generic";

/**
 * Drives one AI-Muloqot session: sends officer utterances to /api/sim/dialog,
 * persists after every turn (4G-drop safe), exposes live state + end reason.
 */
export function useDialogSim(scenario: DialogScenario, initial: TrainingSession, locale: string) {
  const [session, setSession] = useState<TrainingSession>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<DialogSimError | null>(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const payload = session.payload as DialogPayload;

  const persist = useCallback(async (s: TrainingSession) => {
    setSession(s);
    await localTrainingRepo.saveSession(s);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const cur = sessionRef.current;
      const p = cur.payload as DialogPayload;
      if (busy || cur.status !== "in_progress") return;
      const trimmed = text.trim();
      if (!trimmed) return;

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: scenario.id,
            locale,
            state: p.state,
            history: p.transcript.slice(1).map((t) => ({ role: t.role, text: t.text })),
            officerText: trimmed,
            officerTurns: officerTurnsBefore + 1,
          }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          const code = j.error;
          setError(
            code === "ai_unavailable" || code === "no_keys_configured" || code === "bad_ai_output"
              ? code
              : "generic"
          );
          setSession(cur);
          return;
        }
        const data = (await res.json()) as DialogApiResponse;

        const officerWithAssessment: DialogTurn = {
          ...officerTurn,
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
    error,
    clearError: () => setError(null),
    send,
    abandon,
    ended: session.status !== "in_progress" ? payload.endReason ?? "abandoned" : null,
  };
}
