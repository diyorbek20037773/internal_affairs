"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Info, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useTrainingSessions } from "@/hooks/useTrainingSessions";
import { trainingRepo } from "@/lib/storage/training";
import { onStoreMode, storeMode, type StoreMode } from "@/lib/storage/trainingRemote";
import type { HimoyaId, TraineeProfile } from "@/lib/storage/trainingSchema";
import { getScenario } from "@/data/scenarios";
import { COMPETENCIES } from "@/data/scenarios/competencies";
import { localized } from "@/data/sops/types";
import { formatDate } from "@/lib/utils";
import { SessionList } from "../SessionList";
import { ProfileGate } from "../profile/ProfileGate";

export function InstructorClient() {
  const t = useTranslations("sim.instructor");
  const td = useTranslations("sim.debrief");
  const locale = useLocale();
  const { profile, loaded: pLoaded, isInstructor } = useTraineeProfile();
  const { sessions, loaded, removeSession } = useTrainingSessions(); // all trainees on this device
  const [ids, setIds] = useState<HimoyaId[]>([]);
  const [profiles, setProfiles] = useState<TraineeProfile[]>([]);
  const [mode, setMode] = useState<StoreMode | null>(null);

  useEffect(() => {
    void trainingRepo.listHimoyaIds().then(setIds);
    void trainingRepo.listProfiles().then(setProfiles);
  }, [sessions]);

  useEffect(() => {
    void storeMode();
    return onStoreMode(setMode);
  }, []);

  const names = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of profiles) m[p.id] = `${p.name} (${p.badgeId})`;
    if (profile) m[profile.id] = `${profile.name} (${profile.badgeId})`;
    return m;
  }, [profile, profiles]);

  const pending = sessions.filter((s) => s.debrief && s.debrief.status === "pending");
  const trainees = Array.from(new Set(sessions.map((s) => s.traineeId)));

  if (pLoaded && !profile) return <ProfileGate />;
  if (pLoaded && !isInstructor) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        {t("title")} — <Link href="/profil" className="text-primary underline">{t("trainee")} → Instruktor</Link>
      </Card>
    );
  }
  if (!loaded) return null;

  return (
    <div className="space-y-8">
      <p className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {mode === "postgres" ? t("serverNote") : t("deviceNote")}
      </p>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold tracking-tight">
          {t("pending")} <Badge variant="accent">{pending.length}</Badge>
        </h3>
        {pending.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">{t("noPending")}</Card>
        ) : (
          <div className="space-y-2">
            {pending.map((s) => {
              const sc = getScenario(s.scenarioId);
              const avg = s.finalScores ? Math.round(COMPETENCIES.reduce((a, c) => a + s.finalScores![c], 0) / 8) : null;
              return (
                <Card key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{sc ? `${sc.code} — ${localized(sc.title, locale)}` : s.scenarioId}</p>
                    <p className="text-xs text-muted-foreground">
                      {names[s.traineeId] ?? s.traineeId.slice(0, 8)} · {formatDate(s.endedAt ?? s.updatedAt, locale)}
                    </p>
                  </div>
                  {avg != null && <Badge>{avg}%</Badge>}
                  <Button asChild size="sm" variant="accent">
                    <Link href={`/simulyator/debrif/${s.id}`}>
                      {td("confirm")} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-lg font-bold tracking-tight">{t("trainees")}</h3>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">{t("trainee")}</th>
                <th className="px-3 py-2">{t("allSessions")}</th>
                {COMPETENCIES.map((c) => (
                  <th key={c} className="px-2 py-2 text-center" title={c}>
                    {c.slice(0, 3).toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainees.map((tid) => {
                const h = ids.find((x) => x.traineeId === tid);
                const n = sessions.filter((s) => s.traineeId === tid).length;
                return (
                  <tr key={tid} className="border-t">
                    <td className="px-3 py-2 font-medium">{names[tid] ?? tid.slice(0, 8)}</td>
                    <td className="px-3 py-2">{n}</td>
                    {COMPETENCIES.map((c) => (
                      <td key={c} className="px-2 py-2 text-center font-mono text-xs">
                        {h && (h.samples[c] ?? 0) > 0 ? h.scores[c] : "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {trainees.length === 0 && (
                <tr>
                  <td colSpan={2 + COMPETENCIES.length} className="px-3 py-6 text-center text-muted-foreground">—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-bold tracking-tight">{t("allSessions")}</h3>
        <SessionList sessions={sessions} onRemove={(id) => void removeSession(id)} showTrainee traineeNames={names} />
      </section>
    </div>
  );
}
