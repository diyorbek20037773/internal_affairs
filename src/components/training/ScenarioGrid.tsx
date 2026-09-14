"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Clock, Scale } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { LAWS } from "@/data/sops/laws";
import type { LawRef } from "@/data/sops/types";
import { localized } from "@/data/sops/types";
import type { Scenario } from "@/data/scenarios/types";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useTrainingSessions } from "@/hooks/useTrainingSessions";
import { sessionHref } from "./SessionList";
import { ProfileGate } from "./profile/ProfileGate";

const KIND_ICON: Record<Scenario["kind"], string> = {
  dialog: "MessageSquareWarning",
  decision: "Gauge",
  mahalla: "MapPinned",
  exam: "GraduationCap",
};

export function ScenarioGrid({ scenarios, basePath }: { scenarios: Scenario[]; basePath: string }) {
  const t = useTranslations("sim.scenario");
  const tc = useTranslations("common");
  const tk = useTranslations("sim.competencies");
  const locale = useLocale();
  const { profile } = useTraineeProfile();
  const { sessions } = useTrainingSessions(profile?.id);

  return (
    <div className="space-y-6">
      <ProfileGate />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {scenarios.map((s) => {
          const inProgress = sessions.find(
            (x) => x.scenarioId === s.id && x.status === "in_progress"
          );
          return (
            <Card key={s.id} className="flex flex-col p-5 transition-all hover:border-primary/30 hover:shadow-card-hover">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)]">
                  <Icon name={KIND_ICON[s.kind]} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.code}</p>
                  <h3 className="font-semibold tracking-tight">{localized(s.title, locale)}</h3>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge variant="outline">
                    {tc("difficulty")} {s.difficulty}/3
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> ~{s.estimatedMinutes} {tc("minutes")}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{localized(s.brief, locale)}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.tags.map((c) => (
                  <Badge key={c} variant="secondary" className="text-[11px]">
                    {tk(c)}
                  </Badge>
                ))}
              </div>
              {s.laws.length > 0 && (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Scale className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>
                    {t("laws")}: {s.laws
                      .map((k) => LAWS[k] as LawRef)
                      .map((l) => `${l.code}${l.article ? ` ${l.article}` : ""}`)
                      .join("; ")}
                  </span>
                </p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <Button asChild className="flex-1" disabled={!profile}>
                  <Link href={`${basePath}/${s.id}`}>
                    {t("start")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                {inProgress && (
                  <Button asChild variant="accent">
                    <Link href={sessionHref(inProgress)}>{t("resume")}</Link>
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
