"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { trainingRepo } from "@/lib/storage/training";
import { EMBED_PROTOCOL, embedPost, installEmbedReceiver, isEmbedded, onHostCommand } from "@/lib/embed/bridge";

/**
 * Mounted once in the locale layout. In embed mode (E-O'quv tablet app) it
 * announces `h360:ready`, mirrors the current profile to the host and executes
 * host commands (set-profile / navigate / get-sessions / logout).
 */
export function EmbedBridge() {
  const locale = useLocale();
  const router = useRouter();
  const { profile, loaded, authEnabled, save, logout } = useTraineeProfile();

  useEffect(() => {
    if (!isEmbedded()) return;
    installEmbedReceiver();
  }, []);

  useEffect(() => {
    if (!loaded || !isEmbedded()) return;
    embedPost({ type: "h360:ready", protocol: EMBED_PROTOCOL, locale, authEnabled });
    embedPost({ type: "h360:profile", profile });
  }, [loaded, locale, authEnabled, profile]);

  useEffect(() => {
    if (!isEmbedded()) return;
    return onHostCommand(async (cmd) => {
      switch (cmd.type) {
        case "h360:set-profile": {
          if (authEnabled) {
            embedPost({ type: "h360:error", code: "auth_enabled", message: "profile is managed by badge+PIN login on this server" });
            return;
          }
          const p = cmd.profile;
          if (!p || typeof p.badgeId !== "string" || typeof p.name !== "string") {
            embedPost({ type: "h360:error", code: "bad_profile", message: "badgeId and name are required" });
            return;
          }
          await save({
            badgeId: p.badgeId.trim(),
            name: p.name.trim(),
            rank: p.rank?.trim() ?? "",
            district: p.district?.trim() ?? "",
            role: p.role === "instructor" ? "instructor" : "trainee",
          });
          break;
        }
        case "h360:navigate": {
          const path = typeof cmd.path === "string" && cmd.path.startsWith("/") ? cmd.path : "/";
          router.push(path as never);
          embedPost({ type: "h360:navigate", path });
          break;
        }
        case "h360:get-sessions": {
          const items = await trainingRepo.listSessions(profile?.id);
          for (const session of items) embedPost({ type: "h360:session", session });
          break;
        }
        case "h360:logout":
          await logout();
          break;
      }
    });
  }, [authEnabled, profile?.id, router, save, logout]);

  return null;
}
