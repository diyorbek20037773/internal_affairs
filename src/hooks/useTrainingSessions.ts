"use client";

import { useCallback, useEffect, useState } from "react";
import { localTrainingRepo, TRAINING_KEYS } from "@/lib/storage/training";
import type { TrainingSession } from "@/lib/storage/trainingSchema";

export function useTrainingSessions(traineeId?: string) {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setSessions(await localTrainingRepo.listSessions(traineeId));
    setLoaded(true);
  }, [traineeId]);

  useEffect(() => {
    void refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === TRAINING_KEYS.sessions) void refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const saveSession = useCallback(
    async (s: TrainingSession) => {
      await localTrainingRepo.saveSession(s);
      await refresh();
    },
    [refresh]
  );

  const removeSession = useCallback(
    async (id: string) => {
      await localTrainingRepo.removeSession(id);
      await refresh();
    },
    [refresh]
  );

  return { sessions, loaded, saveSession, removeSession, refresh };
}

export function useTrainingSession(id: string | undefined) {
  const [item, setItem] = useState<TrainingSession | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (id) setItem(await localTrainingRepo.getSession(id));
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { item, loaded, refresh };
}
