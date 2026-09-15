"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useTrainingSessions } from "@/hooks/useTrainingSessions";
import { trainingRepo } from "@/lib/storage/training";
import { SessionsFileSchema, type HimoyaId } from "@/lib/storage/trainingSchema";
import { HimoyaIdCard } from "./profile/HimoyaIdCard";
import { AmaliyXizmatCard } from "./profile/AmaliyXizmatCard";
import { SessionList } from "./SessionList";
import { ProfileGate } from "./profile/ProfileGate";

export function SessionsClient() {
  const t = useTranslations("sim.sessions");
  const { profile, isInstructor } = useTraineeProfile();
  const { sessions, loaded, removeSession, refresh } = useTrainingSessions(profile?.id);
  const [himoyaId, setHimoyaId] = useState<HimoyaId | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const loadHimoyaId = () => {
    if (profile) void trainingRepo.getHimoyaId(profile.id).then(setHimoyaId);
  };
  useEffect(loadHimoyaId, [profile, sessions]); // eslint-disable-line react-hooks/exhaustive-deps

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ version: 1, items: sessions }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `himoya360-sessions-${profile?.badgeId ?? "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    try {
      const parsed = SessionsFileSchema.safeParse(JSON.parse(await file.text()));
      if (!parsed.success) throw new Error("invalid");
      for (const s of parsed.data.items) await trainingRepo.saveSession(s);
      await refresh();
      toast.success(t("importOk", { n: parsed.data.items.length }));
    } catch {
      toast.error(t("importFail"));
    }
  };

  return (
    <div className="space-y-6">
      <ProfileGate />
      {profile && <HimoyaIdCard profile={profile} himoyaId={himoyaId} />}
      {profile && <AmaliyXizmatCard profile={profile} isInstructor={isInstructor} onUpdated={loadHimoyaId} />}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={exportJson} disabled={sessions.length === 0}>
          <Download className="h-4 w-4" /> {t("export")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" /> {t("import")}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importJson(f);
            e.target.value = "";
          }}
        />
      </div>

      {loaded && <SessionList sessions={sessions} onRemove={(id) => void removeSession(id)} />}
    </div>
  );
}
