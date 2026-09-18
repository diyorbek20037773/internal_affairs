"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useTrainingSessions } from "@/hooks/useTrainingSessions";
import { trainingRepo } from "@/lib/storage/training";
import { COMPETENCIES } from "@/data/scenarios/competencies";
import type { HimoyaId } from "@/lib/storage/trainingSchema";
import { StatCard } from "./StatCard";

/** Training KPIs for the signed-in officer: sessions, completed, confirmed debriefs, Klaster-ID average. */
export function DashboardStats() {
  const t = useTranslations("dashboard.stats");
  const { profile } = useTraineeProfile();
  const { sessions, loaded } = useTrainingSessions(profile?.id);
  const [hid, setHid] = useState<HimoyaId | null>(null);

  useEffect(() => {
    if (!profile) return;
    let on = true;
    void trainingRepo.getHimoyaId(profile.id).then((h) => { if (on) setHid(h ?? null); });
    return () => { on = false; };
  }, [profile, sessions.length]);

  const stats = useMemo(() => {
    const completed = sessions.filter((s) => s.status === "completed").length;
    const confirmed = sessions.filter((s) => s.debrief?.status === "confirmed").length;
    const pending = sessions.filter((s) => s.debrief?.status === "pending").length;
    const rated = hid ? COMPETENCIES.filter((c) => (hid.samples[c] ?? 0) > 0) : [];
    const avg = rated.length ? Math.round(rated.reduce((a, c) => a + hid!.scores[c], 0) / rated.length) : null;
    return { total: sessions.length, completed, confirmed, pending, avg };
  }, [sessions, hid]);

  const value = (n: number | null) => (!loaded ? "—" : n == null ? "—" : n);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label={t("sessions")} value={value(stats.total)} icon="Target" accent="primary" />
      <StatCard label={t("completed")} value={value(stats.completed)} icon="CheckCircle2" accent="success" />
      <StatCard label={t("pendingDebriefs")} value={value(stats.pending)} icon="ClipboardList" accent="accent" />
      <StatCard label={t("himoyaAvg")} value={stats.avg == null ? value(null) : `${stats.avg}%`} icon="Radar" accent="muted" />
    </div>
  );
}
