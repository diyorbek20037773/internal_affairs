"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, ListChecks, MessagesSquare, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { ProfileGate } from "@/components/training/profile/ProfileGate";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { kasbRepo, type TutorProgress } from "@/lib/storage/kasb";
import { AGENCIES } from "@/data/kasblar/agencies";
import { AGENCY_IDS, type AgencyId } from "@/data/kasblar/types";
import { localized } from "@/data/sops/types";
import { topicsByAgency } from "@/data/tutor";
import { cn } from "@/lib/utils";

const isAgency = (v: string | undefined | null): v is AgencyId => !!v && (AGENCY_IDS as string[]).includes(v);

export function TutorHub({ initialAgency }: { initialAgency?: string }) {
  const t = useTranslations("tutor");
  const locale = useLocale();
  const { profile } = useTraineeProfile();
  const [agency, setAgency] = useState<AgencyId>(isAgency(initialAgency) ? initialAgency : "iiv");
  const [progress, setProgress] = useState<TutorProgress[]>([]);

  // Default tab from the learner's track when no ?agency= was given.
  useEffect(() => {
    if (isAgency(initialAgency)) return;
    let alive = true;
    void kasbRepo.getTrack().then((tr) => {
      if (alive && tr && isAgency(tr.agency)) setAgency(tr.agency);
    });
    return () => {
      alive = false;
    };
  }, [initialAgency]);

  useEffect(() => {
    if (!profile) return;
    const load = () => void kasbRepo.listTutor(profile.id).then(setProgress);
    load();
    window.addEventListener(kasbRepo.CHANGE_EVENT, load);
    return () => window.removeEventListener(kasbRepo.CHANGE_EVENT, load);
  }, [profile]);

  const topics = useMemo(() => topicsByAgency(agency), [agency]);
  const byTopic = useMemo(() => new Map(progress.map((p) => [p.topicId, p])), [progress]);
  const doneCount = topics.filter((tp) => byTopic.get(tp.id)?.completed).length;

  const selectAgency = (id: AgencyId) => {
    setAgency(id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("agency", id);
      window.history.replaceState(null, "", url.toString());
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      <ProfileGate />

      <div role="tablist" aria-label={t("agencyTabs")} className="flex flex-wrap gap-2">
        {AGENCIES.map((a) => {
          const on = a.id === agency;
          return (
            <button
              key={a.id}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => selectAgency(a.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors",
                on
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/80 bg-card hover:border-primary/40 hover:bg-secondary"
              )}
            >
              <Icon name={a.icon} className="h-4 w-4" />
              {localized(a.short, locale)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{t("topicsCount", { count: topics.length })}</span>
        {profile && (
          <>
            <span aria-hidden>·</span>
            <span>{t("doneCount", { done: doneCount, total: topics.length })}</span>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((tp) => {
          const p = byTopic.get(tp.id);
          return (
            <Link key={tp.id} href={`/tutor/${tp.id}`} className="group block min-w-0">
              <Card className="flex h-full flex-col gap-3 p-4 transition-shadow group-hover:shadow-md">
                <div className="flex items-start gap-2">
                  <p className="min-w-0 flex-1 font-semibold leading-snug">{localized(tp.title, locale)}</p>
                  {p?.completed && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-label={t("completed")} />}
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{localized(tp.summary, locale)}</p>
                <div className="mt-auto flex flex-wrap items-center gap-1.5 text-xs">
                  <Badge variant="outline" className="gap-1">
                    <ListChecks className="h-3 w-3" /> {t("stepsCount", { count: tp.steps.length })}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <MessagesSquare className="h-3 w-3" /> {t("questionsCount", { count: tp.questions.length })}
                  </Badge>
                  {p && (
                    <Badge variant="outline" className="gap-1">
                      <Zap className="h-3 w-3" />
                      {p.quizScore !== undefined ? `${p.quizScore}%` : t("turnsShort", { count: p.turns })}
                    </Badge>
                  )}
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
