"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, Circle, Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useTrainingSessions } from "@/hooks/useTrainingSessions";
import { getScenario } from "@/data/scenarios";
import type { ExamScenario } from "@/data/scenarios/types";
import { localized } from "@/data/sops/types";
import { COMPETENCIES } from "@/data/scenarios/competencies";
import { ProfileGate } from "../profile/ProfileGate";
import { ExamSummary } from "./ExamSummary";
import { cn } from "@/lib/utils";

const KIND_PATH = { dialog: "muloqot", decision: "qaror", mahalla: "mahalla", document: "hujjat", tir: "tir" } as const;

/**
 * "Bir kunlik xizmat" — pptx slide 9. Stages run in order; each stage is a
 * normal trainer session tagged with examId/examStageIndex. Progress derives
 * from the session store, so a 4G drop or tab close never loses the exam.
 */
export function ExamClient({ exam }: { exam: ExamScenario }) {
  const t = useTranslations("sim.exam");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { profile, loaded: pLoaded } = useTraineeProfile();
  const { sessions, loaded } = useTrainingSessions(profile?.id);

  if (pLoaded && !profile) return <ProfileGate />;
  if (!loaded) return null;

  const mine = sessions.filter((s) => s.examId === exam.id);
  const stageSession = (i: number) =>
    mine
      .filter((s) => s.examStageIndex === i)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const doneCount = exam.stages.filter((_, i) => stageSession(i)?.status === "completed").length;
  const nextIdx = exam.stages.findIndex((_, i) => stageSession(i)?.status !== "completed");
  const allDone = nextIdx === -1;

  const completed = exam.stages.map((_, i) => stageSession(i)).filter((s) => s?.status === "completed" && s.finalScores);
  const aggregate = completed.length
    ? Math.round(
        completed.reduce((a, s) => a + COMPETENCIES.reduce((x, c) => x + s!.finalScores![c], 0) / 8, 0) / completed.length
      )
    : null;

  return (
    <div className="space-y-6">
      <Card className="brand-gradient p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{exam.code}</p>
        <h3 className="mt-1 text-xl font-bold">{localized(exam.title, locale)}</h3>
        <p className="mt-2 text-sm text-white/80">{localized(exam.brief, locale)}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-white transition-all" style={{ width: `${(doneCount / exam.stages.length) * 100}%` }} />
          </div>
          <span className="font-mono text-sm">{doneCount}/{exam.stages.length}</span>
          {aggregate != null && <Badge variant="accent">{aggregate}%</Badge>}
        </div>
      </Card>

      <ol className="relative space-y-3 border-l-2 border-border/70 pl-6">
        {exam.stages.map((st, i) => {
          const s = stageSession(i);
          const done = s?.status === "completed";
          const isNext = i === nextIdx;
          const locked = !done && !isNext;
          const target = getScenario(st.scenarioId);
          const href = s && s.status === "in_progress"
            ? `/simulyator/${KIND_PATH[st.kind]}/${st.scenarioId}?session=${s.id}`
            : `/simulyator/${KIND_PATH[st.kind]}/${st.scenarioId}?exam=${exam.id}&stage=${i}`;
          return (
            <li key={i} className="relative">
              <span
                className={cn(
                  "absolute -left-[31px] top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background",
                  done ? "border-success text-success" : isNext ? "border-primary text-primary" : "border-border text-muted-foreground"
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : locked ? <Lock className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              </span>
              <Card className={cn("flex flex-col gap-3 p-4 sm:flex-row sm:items-center", isNext && "border-primary/50 shadow-card-hover", locked && "opacity-60")}>
                <div className="w-14 shrink-0 font-mono text-lg font-bold text-primary">{st.time}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{localized(st.title, locale)}</p>
                  <p className="text-xs text-muted-foreground">
                    {target ? `${target.code} — ${localized(target.title, locale)}` : st.scenarioId}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {done && s?.finalScores && (
                    <Badge variant="success">
                      {Math.round(COMPETENCIES.reduce((a, c) => a + s.finalScores![c], 0) / 8)}%
                    </Badge>
                  )}
                  {done ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/simulyator/debrif/${s!.id}`}>{t("stageDone")}</Link>
                    </Button>
                  ) : isNext ? (
                    <Button asChild size="sm">
                      <Link href={href}>
                        {s?.status === "in_progress" ? tc("continue") : i === 0 ? t("startExam") : t("stageNext")}{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </Card>
            </li>
          );
        })}
        <li className="relative">
          <span className={cn("absolute -left-[31px] top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background", allDone ? "border-success text-success" : "border-border text-muted-foreground")}>
            {allDone ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-3 w-3" />}
          </span>
          <Card className={cn("flex flex-col gap-3 p-4 sm:flex-row sm:items-center", !allDone && "opacity-60")}>
            <div className="w-14 shrink-0 font-mono text-lg font-bold text-primary">16:30</div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{t("finalStage")}</p>
              <p className="text-xs text-muted-foreground">{t("finalStageDesc")}</p>
            </div>
            {aggregate != null && <Badge variant={allDone ? "success" : "outline"}>{aggregate}%</Badge>}
          </Card>
        </li>
      </ol>

      {allDone && profile && (
        <ExamSummary exam={exam} sessions={exam.stages.map((_, i) => stageSession(i))} traineeId={profile.id} />
      )}

      {allDone && (
        <Card className="border-success/40 bg-success/5 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <p className="mt-3 font-semibold">{t("allDone")}</p>
          <p className="mt-2 text-sm italic text-muted-foreground">{t("passed")}</p>
        </Card>
      )}
    </div>
  );
}
