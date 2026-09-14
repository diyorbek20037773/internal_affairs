"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, ShieldCheck, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useDebrief } from "@/hooks/useDebrief";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { getScenario } from "@/data/scenarios";
import { COMPETENCIES } from "@/data/scenarios/competencies";
import { localized } from "@/data/sops/types";
import { formatDate, cn } from "@/lib/utils";
import { CompetencyRadar } from "./CompetencyRadar";
import { TranscriptView } from "./TranscriptView";

export function DebriefView({ sessionId }: { sessionId: string }) {
  const t = useTranslations("sim.debrief");
  const tc = useTranslations("common");
  const tk = useTranslations("sim.competencies");
  const ts = useTranslations("sim.sessions");
  const locale = useLocale();
  const { profile, isInstructor } = useTraineeProfile();
  const { session, loaded, generating, error, clearError, generate, confirm } = useDebrief(sessionId, locale);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!error) return;
    toast.error(
      error === "ai_unavailable"
        ? tc("aiUnavailable")
        : error === "no_keys_configured"
          ? tc("noKeys")
          : error === "bad_ai_output"
            ? tc("badOutput")
            : tc("errorGeneric")
    );
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (!loaded) return <Skeleton className="h-64 w-full" />;
  if (!session) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        {ts("empty")}{" "}
        <Link href="/mashgulotlarim" className="text-primary underline">
          {ts("title")}
        </Link>
      </Card>
    );
  }

  const scenario = getScenario(session.scenarioId);
  const d = session.debrief;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {scenario?.code} · {formatDate(session.startedAt, locale)}
          </p>
          <h3 className="mt-1 text-lg font-bold tracking-tight">
            {scenario ? localized(scenario.title, locale) : session.scenarioId}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("cycle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={session.status === "completed" ? "success" : "outline"}>{ts(`status.${session.status}`)}</Badge>
          {d && (
            <Badge variant={d.status === "confirmed" ? "success" : "accent"}>
              {d.status === "confirmed" ? t("confirmed") : t("pending")}
            </Badge>
          )}
        </div>
      </Card>

      {/* Generating */}
      {!d && (
        <Card className="space-y-3 p-6">
          {generating ? (
            <>
              <p className="flex items-center gap-2 text-sm font-medium">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" /> {t("generating")}
              </p>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
              <Button onClick={() => void generate(true)}>
                <RefreshCw className="h-4 w-4" /> {t("regenerate")}
              </Button>
            </div>
          )}
        </Card>
      )}

      {d && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <QuestionCard n={1} title={t("q1")} items={d.whatWentRight} tone="good" />
            <QuestionCard
              n={2}
              title={t("q2")}
              items={d.mistakes.map((m) => `${m.text}`)}
              refs={d.mistakes.map((m) => m.ref)}
              tone="bad"
            />
            <QuestionCard n={3} title={t("q3")} items={d.doDifferently} tone="next" />
          </div>

          {/* Scores */}
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold">{t("scores")}</h4>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> {t("final")}</span>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
              {session.finalScores && <CompetencyRadar scores={session.finalScores} />}
              <div className="space-y-2.5">
                {COMPETENCIES.map((c) => {
                  const fin = session.finalScores?.[c] ?? d.scores[c];
                  const det = session.deterministicScores?.[c];
                  return (
                    <div key={c} className="text-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span>{tk(c)}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {det != null && <span title={t("deterministic")}>{det} · </span>}
                          <span title={t("llm")}>{d.scores[c]}</span>
                          <span className="ml-2 font-bold text-foreground">{fin}</span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn("h-full rounded-full transition-all", fin >= 70 ? "bg-success" : fin >= 45 ? "bg-accent" : "bg-destructive")}
                          style={{ width: `${fin}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-muted/50 p-4 text-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("summary")}</p>
              <p className="leading-relaxed">{d.summary}</p>
            </div>
          </Card>

          {/* Instructor confirm */}
          <Card className={cn("p-5", d.status === "confirmed" ? "border-success/40 bg-success/5" : "border-accent/40 bg-accent/5")}>
            <div className="flex items-start gap-3">
              {d.status === "confirmed" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              ) : (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{d.status === "confirmed" ? t("confirmed") : t("pending")}</p>
                <p className="text-sm text-muted-foreground">{t("aiNote")}</p>
                {d.status === "confirmed" && d.instructorNote && (
                  <p className="mt-2 rounded-md bg-background/60 p-3 text-sm">{d.instructorNote}</p>
                )}
                {d.status !== "confirmed" && isInstructor && profile && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={t("instructorNote")}
                      rows={2}
                    />
                    <Button variant="accent" onClick={() => void confirm(profile.id, note)}>
                      <ShieldCheck className="h-4 w-4" /> {t("confirm")}
                    </Button>
                  </div>
                )}
              </div>
              {d.status !== "confirmed" && isInstructor && (
                <Button variant="ghost" size="sm" onClick={() => void generate(true)} disabled={generating}>
                  <RefreshCw className={cn("h-4 w-4", generating && "animate-spin")} /> {t("regenerate")}
                </Button>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Transcript */}
      <TranscriptView session={session} />

      <div className="flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/mashgulotlarim">{ts("title")}</Link>
        </Button>
        <Button asChild>
          <Link href={session.examId ? "/simulyator/imtihon" : "/simulyator"}>
            <User className="h-4 w-4" /> {tc("next")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function QuestionCard({
  n,
  title,
  items,
  refs,
  tone,
}: {
  n: number;
  title: string;
  items: string[];
  refs?: string[];
  tone: "good" | "bad" | "next";
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
            tone === "good" && "bg-success/15 text-success",
            tone === "bad" && "bg-destructive/15 text-destructive",
            tone === "next" && "bg-primary/15 text-primary"
          )}
        >
          {n}
        </span>
        <h4 className="font-semibold leading-tight">{title}</h4>
      </div>
      <ul className="space-y-2 text-sm leading-relaxed">
        {items.length === 0 && <li className="text-muted-foreground">—</li>}
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
            <span>
              {refs?.[i] && (
                <Badge variant="outline" className="mr-1.5 font-mono text-[10px]">
                  {refs[i]}
                </Badge>
              )}
              {it}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
