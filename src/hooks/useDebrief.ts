"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { localTrainingRepo } from "@/lib/storage/training";
import type { DebriefResult, TrainingSession } from "@/lib/storage/trainingSchema";
import { attachDebrief, confirmDebrief } from "@/lib/training/debrief";
import { getScenario } from "@/data/scenarios";
import { applySessionToHimoyaId, assessedCompetencies, newHimoyaId } from "@/lib/training/competency";

export type DebriefError = "ai_unavailable" | "no_keys_configured" | "bad_ai_output" | "generic";

/**
 * Loads a session, generates the AI debrief once (if missing) and applies a
 * PROVISIONAL HIMOYA-ID update; the instructor's confirmation finalises it.
 */
export function useDebrief(sessionId: string, locale: string) {
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<DebriefError | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    void (async () => {
      const s = await localTrainingRepo.getSession(sessionId);
      setSession(s ?? null);
      setLoaded(true);
    })();
  }, [sessionId]);

  const generate = useCallback(
    async (force = false) => {
      const cur = session;
      if (!cur || generating) return;
      if (cur.debrief && !force) return;
      if (cur.status === "in_progress") return;
      setGenerating(true);
      setError(null);
      try {
        const res = await fetch("/api/sim/debrief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId: cur.scenarioId, locale, payload: cur.payload }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          const code = j.error;
          setError(
            code === "ai_unavailable" || code === "no_keys_configured" || code === "bad_ai_output"
              ? code
              : "generic"
          );
          return;
        }
        const llm = (await res.json()) as Omit<DebriefResult, "status">;
        const next = attachDebrief(cur, llm);
        await localTrainingRepo.saveSession(next);
        // Provisional HIMOYA-ID update — instructor confirmation finalises it.
        const scenario = getScenario(next.scenarioId);
        const current = (await localTrainingRepo.getHimoyaId(next.traineeId)) ?? newHimoyaId(next.traineeId);
        await localTrainingRepo.saveHimoyaId(applySessionToHimoyaId(current, next, assessedCompetencies(next, scenario?.tags ?? []), true));
        setSession(next);
      } catch {
        setError("generic");
      } finally {
        setGenerating(false);
      }
    },
    [session, generating, locale]
  );

  // Auto-generate once when a finished session has no debrief yet.
  useEffect(() => {
    if (!loaded || !session || requested.current) return;
    if (session.status !== "in_progress" && !session.debrief) {
      requested.current = true;
      void generate();
    }
  }, [loaded, session, generate]);

  const confirm = useCallback(
    async (instructorId: string, note?: string) => {
      if (!session?.debrief || session.debrief.status === "confirmed") return;
      const confirmed = confirmDebrief(session, { id: instructorId, note });
      await localTrainingRepo.saveSession(confirmed);

      const scenario = getScenario(confirmed.scenarioId);
      const current =
        (await localTrainingRepo.getHimoyaId(confirmed.traineeId)) ?? newHimoyaId(confirmed.traineeId);
      const updated = applySessionToHimoyaId(
        current,
        confirmed,
        assessedCompetencies(confirmed, scenario?.tags ?? [])
      );
      await localTrainingRepo.saveHimoyaId(updated);
      setSession(confirmed);
    },
    [session]
  );

  return { session, loaded, generating, error, clearError: () => setError(null), generate, confirm };
}
