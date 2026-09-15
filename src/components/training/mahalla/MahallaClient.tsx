"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowRight, Clock, GripVertical, X, RefreshCw } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSessionBootstrap } from "@/hooks/useSessionBootstrap";
import { newMahallaSession, touch } from "@/lib/training/sessionFactory";
import { trainingRepo } from "@/lib/storage/training";
import { localized } from "@/data/sops/types";
import type { MahallaGrade, MahallaScenario } from "@/data/scenarios/types";
import type { MahallaPayload, TrainingSession } from "@/lib/storage/trainingSchema";
import { ProfileGate } from "../profile/ProfileGate";
import { DistrictMap } from "./DistrictMap";
import { cn } from "@/lib/utils";

export function MahallaClient({ scenario, sessionId, exam }: { scenario: MahallaScenario; sessionId?: string; exam?: { examId: string; examStageIndex: number } }) {
  const create = useCallback(
    (traineeId: string, exam?: { examId: string; examStageIndex: number }) =>
      newMahallaSession(scenario, { traineeId, ...exam }),
    [scenario]
  );
  const { session, ready, needsProfile } = useSessionBootstrap({ scenarioId: scenario.id, sessionId, create, exam });
  if (needsProfile) return <ProfileGate />;
  if (!ready || !session) return null;
  return <MahallaRunner scenario={scenario} initial={session} />;
}

function MahallaRunner({ scenario, initial }: { scenario: MahallaScenario; initial: TrainingSession }) {
  const t = useTranslations("sim.mahalla");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [session, setSession] = useState(initial);
  const payload = session.payload as MahallaPayload;
  const [picked, setPicked] = useState<string[]>(payload.picked);
  const [plans, setPlans] = useState<Record<string, string>>(payload.plans);
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [grading, setGrading] = useState(false);

  // Persist drafts (4G-drop safe).
  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = touch(session, { payload: { ...payload, picked, plans } });
      setSession(next);
      void trainingRepo.saveSession(next);
    }, 600);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, plans]);

  const feed = useMemo(
    () => (activePoint ? scenario.feed.filter((f) => f.pointId === activePoint) : scenario.feed),
    [scenario.feed, activePoint]
  );

  const toggle = (id: string) => {
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 3 ? [...cur, id] : cur));
  };
  const move = (id: string, dir: -1 | 1) => {
    setPicked((cur) => {
      const i = cur.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const submit = async () => {
    if (picked.length !== 3) return;
    setGrading(true);
    try {
      const res = await fetch("/api/sim/mahalla-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id, locale, picked, plans }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(
          j.error === "ai_unavailable" ? tc("aiUnavailable") : j.error === "no_keys_configured" ? tc("noKeys") : j.error === "bad_ai_output" ? tc("badOutput") : tc("errorGeneric")
        );
        return;
      }
      const grade = (await res.json()) as MahallaGrade;
      const done = touch(session, {
        status: "completed",
        endedAt: new Date().toISOString(),
        payload: { kind: "mahalla", picked, plans, grade },
      });
      await trainingRepo.saveSession(done);
      setSession(done);
      router.push(`/simulyator/debrif/${done.id}`);
    } catch {
      toast.error(tc("errorGeneric"));
    } finally {
      setGrading(false);
    }
  };

  const finished = session.status !== "in_progress";

  return (
    <div className="space-y-4">
      <Card className="brand-gradient p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
          {scenario.district.code} · {localized(scenario.district.name, locale)}
        </p>
        <p className="mt-1 text-lg font-bold">{t("question")}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Map + feed */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("map")}</p>
              <div className="flex gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-success" />{t("legend.green")}</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-accent" />{t("legend.yellow")}</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-destructive" />{t("legend.red")}</span>
              </div>
            </div>
            <DistrictMap scenario={scenario} activePointId={activePoint} onSelect={setActivePoint} />
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("feed")}</p>
              {activePoint && (
                <Button variant="ghost" size="sm" onClick={() => setActivePoint(null)}>
                  <X className="h-3.5 w-3.5" /> {tc("close")}
                </Button>
              )}
            </div>
            <ul className="space-y-2">
              {feed.map((f) => {
                const point = scenario.district.points.find((p) => p.id === f.pointId);
                return (
                  <li
                    key={f.id}
                    className={cn(
                      "rounded-lg border p-3 text-sm transition-colors",
                      f.type === "xavf_indikatori" && "border-destructive/30 bg-destructive/5",
                      f.type === "takroriy_hodisa" && "border-accent/30 bg-accent/5"
                    )}
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {f.at}
                      <Badge variant="outline" className="text-[10px]">{t(`feedTypes.${f.type}`)}</Badge>
                      {point && (
                        <button className="underline-offset-2 hover:underline" onClick={() => setActivePoint(f.pointId ?? null)}>
                          {localized(point.label, locale)}
                        </button>
                      )}
                    </div>
                    <p className="leading-relaxed">{localized(f.text, locale)}</p>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        {/* Problems + plans */}
        <div className="space-y-4">
          <Card className="p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("problems")}</p>
            <p className="mb-3 text-sm text-muted-foreground">{t("pickTop3")}</p>
            <ul className="space-y-2">
              {scenario.problems.map((p) => {
                const idx = picked.indexOf(p.id);
                const sel = idx >= 0;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      disabled={finished || (!sel && picked.length >= 3)}
                      onClick={() => toggle(p.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all disabled:opacity-50",
                        sel ? "border-primary bg-primary/5" : "hover:border-primary/40"
                      )}
                    >
                      <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", sel ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                        {sel ? idx + 1 : "·"}
                      </span>
                      <span className="flex-1">{localized(p.title, locale)}</span>
                      {sel && !finished && (
                        <span className="flex flex-col">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </span>
                      )}
                    </button>
                    {sel && !finished && (
                      <div className="mt-1 flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => move(p.id, -1)} disabled={idx === 0}>↑</Button>
                        <Button variant="ghost" size="sm" onClick={() => move(p.id, 1)} disabled={idx === picked.length - 1}>↓</Button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>

          {picked.length > 0 && (
            <Card className="space-y-4 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("plan")}</p>
              {picked.map((id, i) => {
                const p = scenario.problems.find((x) => x.id === id)!;
                return (
                  <div key={id}>
                    <p className="mb-1 text-sm font-medium">
                      {i + 1}. {localized(p.title, locale)}
                    </p>
                    <Textarea
                      rows={3}
                      disabled={finished}
                      value={plans[id] ?? ""}
                      onChange={(e) => setPlans((cur) => ({ ...cur, [id]: e.target.value }))}
                      placeholder={t("planPlaceholder")}
                    />
                  </div>
                );
              })}
              {!finished && (
                <Button size="lg" className="w-full" disabled={picked.length !== 3 || grading} onClick={() => void submit()}>
                  {grading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {grading ? t("grading") : t("submit")}
                </Button>
              )}
              {finished && (
                <Button className="w-full" onClick={() => router.push(`/simulyator/debrif/${session.id}`)}>
                  Smart Debrifing <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
