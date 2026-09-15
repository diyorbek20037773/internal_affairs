"use client";

import { useCallback, useEffect, useState } from "react";
import { trainingRepo, TRAINING_KEYS } from "@/lib/storage/training";
import type { TraineeProfile } from "@/lib/storage/trainingSchema";
import { uid } from "@/lib/utils";

export function useTraineeProfile() {
  const [profile, setProfile] = useState<TraineeProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setProfile(await trainingRepo.getProfile());
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === TRAINING_KEYS.profile) void refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const save = useCallback(
    async (patch: Omit<TraineeProfile, "id" | "createdAt"> & { id?: string }) => {
      const next: TraineeProfile = {
        id: patch.id ?? profile?.id ?? uid(),
        createdAt: profile?.createdAt ?? new Date().toISOString(),
        badgeId: patch.badgeId,
        name: patch.name,
        rank: patch.rank,
        district: patch.district,
        role: patch.role,
      };
      await trainingRepo.saveProfile(next);
      setProfile(next);
      return next;
    },
    [profile]
  );

  return {
    profile,
    loaded,
    save,
    refresh,
    isInstructor: profile?.role === "instructor",
  };
}
