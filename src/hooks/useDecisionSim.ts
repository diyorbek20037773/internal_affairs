"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DecisionOption, DecisionScenario } from "@/data/scenarios/types";
import type { DecisionPayload, TrainingSession } from "@/lib/storage/trainingSchema";
import { trainingRepo } from "@/lib/storage/training";
import { touch } from "@/lib/training/sessionFactory";
import { choose, currentNode, timeout } from "@/lib/training/decisionEngine";

const TICK_MS = 250;

/**
 * Runs a branching decision scenario with a per-node timer that pauses while
 * the tab is hidden (tablet fairness). After a choice the consequence is shown
 * and the trainee explicitly continues to the next node.
 */
export function useDecisionSim(scenario: DecisionScenario, initial: TrainingSession) {
  const [session, setSession] = useState<TrainingSession>(initial);
  const [pending, setPending] = useState<{ option?: DecisionOption; timedOut: boolean; next: DecisionPayload; finished: boolean } | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const elapsedRef = useRef(0);
  const hiddenRef = useRef(false);

  const payload = session.payload as DecisionPayload;
  const node = currentNode(scenario, payload);
  const timerSec = node?.timerSec;

  // Reset timer whenever the node changes.
  useEffect(() => {
    elapsedRef.current = 0;
    setElapsedMs(0);
  }, [node?.id]);

  // Visibility pause.
  useEffect(() => {
    const onVis = () => {
      hiddenRef.current = document.visibilityState === "hidden";
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const persist = useCallback(async (s: TrainingSession) => {
    setSession(s);
    await trainingRepo.saveSession(s);
  }, []);

  const applyTimeout = useCallback(() => {
    const cur = sessionRef.current;
    const p = cur.payload as DecisionPayload;
    if (cur.status !== "in_progress" || !currentNode(scenario, p)) return;
    const { payload: next, finished } = timeout(scenario, p, elapsedRef.current);
    setPending({ timedOut: true, next, finished });
  }, [scenario]);

  // Tick.
  useEffect(() => {
    if (!node || !timerSec || pending || session.status !== "in_progress") return;
    const id = window.setInterval(() => {
      if (hiddenRef.current) return;
      elapsedRef.current += TICK_MS;
      setElapsedMs(elapsedRef.current);
      if (elapsedRef.current >= timerSec * 1000) {
        window.clearInterval(id);
        applyTimeout();
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [node, timerSec, pending, session.status, applyTimeout]);

  const pick = useCallback(
    (optionId: string) => {
      const cur = sessionRef.current;
      const p = cur.payload as DecisionPayload;
      if (pending || cur.status !== "in_progress") return;
      const { payload: next, option, finished } = choose(scenario, p, optionId, elapsedRef.current);
      setPending({ option, timedOut: false, next, finished });
    },
    [pending, scenario]
  );

  const proceed = useCallback(async () => {
    if (!pending) return;
    const cur = sessionRef.current;
    const s = touch(cur, {
      payload: pending.next,
      status: pending.finished ? "completed" : "in_progress",
      endedAt: pending.finished ? new Date().toISOString() : undefined,
    });
    setPending(null);
    await persist(s);
  }, [pending, persist]);

  const abandon = useCallback(async () => {
    const cur = sessionRef.current;
    if (cur.status !== "in_progress") return;
    await persist(touch(cur, { status: "abandoned", endedAt: new Date().toISOString() }));
  }, [persist]);

  return {
    session,
    payload,
    node,
    timerSec,
    elapsedMs,
    remainingSec: timerSec ? Math.max(0, Math.ceil((timerSec * 1000 - elapsedMs) / 1000)) : null,
    pending,
    pick,
    proceed,
    abandon,
    finished: session.status !== "in_progress",
  };
}
