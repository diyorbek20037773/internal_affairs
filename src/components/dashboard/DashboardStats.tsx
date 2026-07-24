"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useCases } from "@/hooks/useCases";
import { StatCard } from "./StatCard";

export function DashboardStats() {
  const t = useTranslations("dashboard.stats");
  const { cases, loaded } = useCases();

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayIncidents = cases.filter((c) =>
      c.createdAt.startsWith(today)
    ).length;
    const completed = cases.filter((c) => c.workflow.progressPct >= 100).length;
    const protocols = cases.reduce(
      (sum, c) => sum + c.workflow.completedStepIds.length,
      0
    );
    return {
      todayIncidents,
      completed,
      protocols,
      conversations: cases.length,
    };
  }, [cases]);

  const value = (n: number) => (loaded ? n : "—");

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label={t("todayIncidents")}
        value={value(stats.todayIncidents)}
        icon="Siren"
        accent="primary"
      />
      <StatCard
        label={t("completed")}
        value={value(stats.completed)}
        icon="Briefcase"
        accent="success"
      />
      <StatCard
        label={t("protocols")}
        value={value(stats.protocols)}
        icon="ScrollText"
        accent="accent"
      />
      <StatCard
        label={t("conversations")}
        value={value(stats.conversations)}
        icon="Bot"
        accent="muted"
      />
    </div>
  );
}
