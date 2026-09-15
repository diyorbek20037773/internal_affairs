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
import { trainingRepo } from "@/lib/storage/training";
import { recommendNext, scenarioHref, type MentorRecommendation } from "@/lib/training/mentor";
import { localized } from "@/data/sops/types";
import type { HimoyaId } from "@/lib/storage/trainingSchema";
import { COMPETENCIES } from "@/data/scenarios/competencies";
import { Sparkles } from "lucide-react";

interface MentorAi { text: string; focus: string[]; drill: string }

export function MentorCard() {
  const t = useTranslations("sim.mentor");
  const th = useTranslations("sim.hub");
  const tk = useTranslations("sim.competencies");
  const locale = useLocale();
  const { profile } = useTraineeProfile();
  const { sessions, loaded } = useTrainingSessions(profile?.id);
  const [himoyaId, setHimoyaId] = useState<HimoyaId | undefined>();
  const [rec, setRec] = useState<MentorRecommendation | null>(null);
  const [ai, setAi] = useState<MentorAi | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    void trainingRepo.getHimoyaId(profile.id).then(setHimoyaId);
  }, [profile, sessions]);

  useEffect(() => {
    if (!loaded) return;
    setRec(recommendNext(himoyaId, sessions));
  }, [himoyaId, sessions, loaded]);

  // AI coaching note — one call per (profile update x recommendation), cached locally.
  useEffect(() => {
    if (!profile || !rec || !himoyaId || !sessions.some((s) => s.status === "completed")) { setAi(null); return; }
    const k = `h360:mentor:${profile.id}:${rec.scenario.id}:${himoyaId.updatedAt}`;
    try {
      const cached = localStorage.getItem(k);
      if (cached) { setAi(JSON.parse(cached)); return; }
    } catch {}
    let cancelled = false;
    setAiLoading(true);
    const recent = [...sessions]
      .filter((s) => s.status === "completed")
      .slice(0, 6)
      .map((s) => ({
        scenarioId: s.scenarioId,
        kind: s.kind,
        outcome: s.payload.kind === "tir" ? s.payload.outcome : s.payload.kind === "dialog" ? s.payload.endReason : s.status,
        avg: s.finalScores ? Math.round(COMPETENCIES.reduce((a, c) => a + s.finalScores![c], 0) / 8) : undefined,
        at: s.startedAt,
      }));
    fetch("/api/sim/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, scores: himoyaId.scores, samples: himoyaId.samples, recommendedScenarioId: rec.scenario.id, targetCompetency: rec.competency, recent }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: MentorAi | null) => {
        if (cancelled || !j) return;
        setAi(j);
        try { localStorage.setItem(k, JSON.stringify(j)); } catch {}
      })
      .catch(() => undefined)
      .finally(() => { if (!cancelled) setAiLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, rec?.scenario.id, himoyaId?.updatedAt, locale]);

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
            {ai ? (
              <div className="mt-2 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm">
                <p className="leading-relaxed">{ai.text}</p>
                {ai.focus.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {ai.focus.map((f, i) => (
                      <li key={i}><Badge variant="secondary" className="text-[11px]">{f}</Badge></li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />{t("drill")}: {ai.drill}</p>
              </div>
            ) : aiLoading ? (
              <p className="mt-2 text-xs text-muted-foreground">{t("aiLoading")}</p>
            ) : null}
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
