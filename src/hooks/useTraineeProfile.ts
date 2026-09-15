"use client";

import { useCallback, useEffect, useState } from "react";
import { trainingRepo, TRAINING_KEYS } from "@/lib/storage/training";
import { remoteAuth, storeMode } from "@/lib/storage/trainingRemote";
import type { TraineeProfile } from "@/lib/storage/trainingSchema";
import { uid } from "@/lib/utils";

/** Same-tab broadcast so every hook instance (gate, form, cabinet) refreshes after login/logout. */
const CHANGE_EVENT = "h360:profile-changed";
const broadcast = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
};

/**
 * Current profile. Two modes:
 *  - local (no DATABASE_URL, or server unreachable): the device profile, as before;
 *  - auth (server store on): the profile comes from `/api/auth/me`; until the
 *    tablet signs in `profile` is null and `authRequired` is true. On login the
 *    server profile is mirrored to localStorage so every hook keeps working offline.
 */
export function useTraineeProfile() {
  const [profile, setProfile] = useState<TraineeProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [authEnabled, setAuthEnabled] = useState(false);

  const refresh = useCallback(async () => {
    const me = await remoteAuth.me();
    if (me.enabled) {
      setAuthEnabled(true);
      if (me.profile) await trainingRepo.saveProfile(me.profile);
      setProfile(me.profile);
    } else {
      setAuthEnabled(false);
      setProfile(await trainingRepo.getProfile());
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === TRAINING_KEYS.profile) void refresh();
    };
    const onChange = () => void refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, onChange);
    };
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
        // In auth mode the role is decided server-side (INSTRUCTOR_BADGES).
        role: authEnabled && profile ? profile.role : patch.role,
      };
      await trainingRepo.saveProfile(next);
      setProfile(next);
      return next;
    },
    [profile, authEnabled]
  );

  const afterAuth = useCallback(async (p: TraineeProfile | null | undefined) => {
    if (!p) return;
    await trainingRepo.saveProfile(p);
    await storeMode(true);
    setProfile(p);
    broadcast();
  }, []);

  const login = useCallback(
    async (badgeId: string, pin: string): Promise<{ ok: true } | { ok: false; error: string }> => {
      const { status, data } = await remoteAuth.login(badgeId, pin);
      if (status === 200 && data.profile) {
        await afterAuth(data.profile);
        return { ok: true };
      }
      return { ok: false, error: data.error ?? (status === 423 ? "locked" : "invalid_credentials") };
    },
    [afterAuth]
  );

  const register = useCallback(
    async (input: { badgeId: string; pin: string; name: string; rank: string; district: string }) => {
      const { status, data } = await remoteAuth.register(input);
      if (status === 201 && data.profile) {
        await afterAuth(data.profile);
        return { ok: true as const };
      }
      return { ok: false as const, error: data.error ?? "bad_request" };
    },
    [afterAuth]
  );

  const logout = useCallback(async () => {
    await remoteAuth.logout();
    await trainingRepo.clearProfile();
    await storeMode(true);
    setProfile(null);
    broadcast();
  }, []);

  return {
    profile,
    loaded,
    save,
    refresh,
    isInstructor: profile?.role === "instructor",
    authEnabled,
    authRequired: loaded && authEnabled && !profile,
    login,
    register,
    logout,
  };
}
