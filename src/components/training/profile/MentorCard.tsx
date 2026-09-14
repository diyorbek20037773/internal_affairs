"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Brain, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useTrainingSessions } from "@/hooks/useTrainingSessions";
import { localTrainingRepo } from "@/lib/storage/training";
import { recommendNext, scenarioHref, type MentorRecommendation } from "@/lib/training/mentor";
import { localized } from "@/data/sops/types";
import type { HimoyaId } from "@/lib/storage/trainingSchema";

export function MentorCard() {
  const t = useTranslations("sim.mentor");
  const th = useTranslations("sim.hub");
  const tk = useTranslations("sim.competencies");
  const locale = useLocale();
  const { profile } = useTraineeProfile();
  const { sessions, loaded } = useTrainingSessions(profile?.id);
  const [himoyaId, setHimoyaId] = useState<HimoyaId | undefined>();
  const [rec, setRec] = useState<MentorRecommendation | null>(null);

  useEffect(() => {
    if (!profile) return;
    void localTrainingRepo.getHimoyaId(profile.id).then(setHimoyaId);
  }, [profile, sessions]);

  useEffect(() => {
    if (!loaded) return;
    setRec(recommendNext(himoyaId, sessions));
  }, [himoyaId, sessions, loaded]);

  if (!profile || !loaded) return null;

  const hasAny = sessions.some((s) => s.status === "completed");

  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Brain className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {th("mentorTitle")}
        </p>
        {rec && hasAny ? (
          <>
            <p className="mt-1 font-semibold">
              {t("recommend")}: {rec.scenario.code} — {localized(rec.scenario.title, locale)}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {rec.score == null
                ? t("reasonNew", { competency: tk(rec.competency) })
                : t("reasonWeak", { competency: tk(rec.competency), score: rec.score })}
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">{th("mentorEmpty")}</p>
        )}
      </div>
      {rec && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex">
            {rec.scenario.kind}
          </Badge>
          <Button asChild variant={hasAny ? "accent" : "outline"}>
            <Link href={scenarioHref(rec.scenario)}>
              {t("go")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}
