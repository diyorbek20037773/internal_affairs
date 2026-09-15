"use client";

import { useEffect, useRef, useState } from "react";
import { trainingRepo } from "@/lib/storage/training";
import type { TraineeProfile, TrainingSession } from "@/lib/storage/trainingSchema";
import { useTraineeProfile } from "./useTraineeProfile";

/**
 * Resolve the session a trainer page should run: resume `?session=` when it
 * exists and belongs to this scenario, otherwise create a fresh one. Requires
 * a local profile (returns `needsProfile` until one exists).
 */
/** Keep the session id in the address bar so a refresh resumes instead of forking. */
function rememberInUrl(id: string) {
  if (typeof window === "undefined") return;
  const u = new URL(window.location.href);
  if (u.searchParams.get("session") === id) return;
  u.searchParams.set("session", id);
  window.history.replaceState(window.history.state, "", u.toString());
}

export function useSessionBootstrap({
  scenarioId,
  sessionId,
  create,
  exam,
}: {
  scenarioId: string;
  sessionId?: string;
  create: (traineeId: string, exam?: { examId: string; examStageIndex: number }) => TrainingSession;
  exam?: { examId: string; examStageIndex: number };
}) {
  const { profile, loaded: profileLoaded } = useTraineeProfile();
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [ready, setReady] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!profileLoaded || !profile || started.current) return;
    started.current = true;
    (async () => {
      if (sessionId) {
        const existing = await trainingRepo.getSession(sessionId);
        if (existing && existing.scenarioId === scenarioId) {
          setSession(existing);
          setReady(true);
          return;
        }
      }
      // Reload / PWA relaunch: resume the newest unfinished session of this scenario (exam stages keep their own).
      if (!exam) {
        const mine = await trainingRepo.listSessions(profile.id);
        const open = mine.find((s) => s.scenarioId === scenarioId && s.status === "in_progress" && !s.examId);
        if (open) {
          rememberInUrl(open.id);
          setSession(open);
          setReady(true);
          return;
        }
      }
      const fresh = create(profile.id, exam);
      await trainingRepo.saveSession(fresh);
      rememberInUrl(fresh.id);
      setSession(fresh);
      setReady(true);
    })();
  }, [profileLoaded, profile, sessionId, scenarioId, create, exam]);

  return {
    profile: profile as TraineeProfile | null,
    session,
    ready,
    needsProfile: profileLoaded && !profile,
  };
}
