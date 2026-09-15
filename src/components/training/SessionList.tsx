"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Trash2, Clock } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { getScenario } from "@/data/scenarios";
import { isEmptySession } from "@/lib/training/sessionFactory";
import { localized } from "@/data/sops/types";
import { formatDate } from "@/lib/utils";
import type { TrainingSession } from "@/lib/storage/trainingSchema";

const KIND_ICON: Record<TrainingSession["kind"], string> = {
  dialog: "MessageSquareWarning",
  decision: "Gauge",
  mahalla: "MapPinned",
  document: "FileText",
  tir: "Crosshair",
};

export function sessionHref(s: TrainingSession): string {
  if (s.status !== "in_progress") return `/simulyator/debrif/${s.id}`;
  switch (s.kind) {
    case "dialog":
      return `/simulyator/muloqot/${s.scenarioId}?session=${s.id}`;
    case "decision":
      return `/simulyator/qaror/${s.scenarioId}?session=${s.id}`;
    case "mahalla":
      return `/simulyator/mahalla/${s.scenarioId}?session=${s.id}`;
    case "document":
      return `/simulyator/hujjat/${s.scenarioId}?session=${s.id}`;
    case "tir":
      return `/simulyator/tir/${s.scenarioId}?session=${s.id}`;
  }
}

export function SessionList({
  sessions,
  onRemove,
  showTrainee,
  traineeNames,
}: {
  sessions: TrainingSession[];
  onRemove?: (id: string) => void;
  showTrainee?: boolean;
  traineeNames?: Record<string, string>;
}) {
  const t = useTranslations("sim.sessions");
  const td = useTranslations("sim.debrief");
  const locale = useLocale();
  const router = useRouter();

  if (sessions.filter((s) => !isEmptySession(s)).length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-2 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted shadow-[inset_0_0_0_1px_hsl(var(--border))]">
          <Icon name="GraduationCap" className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-medium tracking-tight">{t("empty")}</p>
        <p className="text-sm text-muted-foreground">{t("emptyHint")}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.filter((s) => !isEmptySession(s)).map((s) => {
        const sc = getScenario(s.scenarioId);
        const final = s.finalScores
          ? Math.round(Object.values(s.finalScores).reduce((a, b) => a + b, 0) / 8)
          : undefined;
        return (
          <Card key={s.id} className="flex flex-col p-4 transition-all hover:border-primary/30 hover:shadow-card-hover">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)]">
                <Icon name={KIND_ICON[s.kind]} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold tracking-tight">
                  {sc ? `${sc.code} — ${localized(sc.title, locale)}` : s.scenarioId}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(s.startedAt, locale)}
                  {showTrainee && traineeNames?.[s.traineeId] && (
                    <span className="ml-1 truncate">· {traineeNames[s.traineeId]}</span>
                  )}
                </p>
              </div>
              <Badge
                variant={
                  s.status === "completed" ? "success" : s.status === "in_progress" ? "secondary" : "outline"
                }
              >
                {t(`status.${s.status}`)}
              </Badge>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
              {final != null && <Badge variant="default">{final}%</Badge>}
              {s.debrief && (
                <Badge variant={s.debrief.status === "confirmed" ? "success" : "accent"}>
                  {s.debrief.status === "confirmed" ? td("confirmed") : td("pending")}
                </Badge>
              )}
            </div>

            <div className="mt-auto flex items-center gap-2">
              <Button className="flex-1" size="sm" onClick={() => router.push(sessionHref(s))}>
                {t("open")} <ArrowRight className="h-4 w-4" />
              </Button>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    if (confirm(t("deleteConfirm"))) onRemove(s.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
