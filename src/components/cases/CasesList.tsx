"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Trash2, Clock } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useCases } from "@/hooks/useCases";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { INCIDENT_ICON } from "@/types/incident";
import { formatDate } from "@/lib/utils";

export function CasesList() {
  const t = useTranslations("cases");
  const tType = useTranslations("incidentTypes");
  const locale = useLocale();
  const router = useRouter();
  const { cases, loaded, removeCase } = useCases();

  if (loaded && cases.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-2 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted shadow-[inset_0_0_0_1px_hsl(var(--border))]">
          <Icon name="Briefcase" className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-medium tracking-tight">{t("empty")}</p>
        <p className="text-sm text-muted-foreground">{t("emptyHint")}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((c) => (
        <Card
          key={c.id}
          className="flex flex-col p-4 transition-all hover:border-primary/30 hover:shadow-card-hover"
        >
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)]">
              <Icon name={INCIDENT_ICON[c.incidentType]} className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold tracking-tight">
                {tType(c.incidentType)}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(c.createdAt, locale)}
              </p>
            </div>
            <Badge variant={c.workflow.progressPct >= 100 ? "success" : "secondary"}>
              {c.workflow.progressPct}%
            </Badge>
          </div>

          <div className="mb-4 mt-auto">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>{t("progress")}</span>
              <span>{c.workflow.progressPct}%</span>
            </div>
            <Progress
              value={c.workflow.progressPct}
              indicatorClassName={
                c.workflow.progressPct >= 100 ? "bg-success" : "bg-primary"
              }
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => router.push(`/inspektor?case=${c.id}`)}
            >
              {t("continue")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="delete"
              onClick={() => {
                if (window.confirm(t("deleteConfirm"))) removeCase(c.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
