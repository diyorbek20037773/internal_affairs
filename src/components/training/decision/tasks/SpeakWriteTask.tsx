"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Mic, Square, Volume2, AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { localized } from "@/data/sops/types";
import type { DecisionTask, LocalizedText } from "@/data/scenarios/types";
import { useSpeech } from "@/hooks/useSpeech";
import { wordCount, type TaskResult } from "@/lib/training/decisionEngine";
import type { GradeExtra } from "@/hooks/useDecisionSim";
import type { TaskGrade } from "@/app/api/sim/task-grade/route";
import { cn } from "@/lib/utils";

type FreeTaskDef = Extract<DecisionTask, { kind: "voice" | "text" }>;

/**
 * Voice or written answer graded against the task's rubric by /api/sim/task-grade.
 * Voice records through server STT (the transcript stays editable, typing is the
 * fallback). If AI is unavailable the trainee can retry or continue ungraded —
 * a neutral score that the instructor sees flagged.
 */
export function SpeakWriteTask({
  scenarioId,
  nodeId,
  task,
  situation,
  onSubmit,
}: {
  scenarioId: string;
  nodeId: string;
  task: FreeTaskDef;
  situation: LocalizedText;
  onSubmit: (r: TaskResult, extra?: GradeExtra) => void;
}) {
  const t = useTranslations("sim.decision");
  const tt = useTranslations(`sim.decision.task.${task.kind}`);
  const locale = useLocale();
  const speech = useSpeech({ locale, maxRecordMs: 60_000 });
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const voice = task.kind === "voice";
  const words = wordCount(text);

  // Each finished recording is appended, so the officer can speak in pieces.
  useEffect(() => {
    if (!speech.transcript) return;
    setText((prev) => (prev ? `${prev.trim()} ${speech.transcript}` : speech.transcript));
    speech.setTranscript("");
  }, [speech.transcript, speech.setTranscript]);

  const grade = async () => {
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/sim/task-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(60_000),
        body: JSON.stringify({ scenarioId, nodeId, locale, response: text.trim() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const g = (await res.json()) as TaskGrade;
      onSubmit(
        { score: g.score, response: text.trim(), rubric: g.rubric, feedback: g.feedback },
        { strength: g.strength, violation: g.violation, tooShort: g.tooShort }
      );
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  // AI outage must not steer the story against the trainee: benefit of the doubt, instructor grades it.
  const skip = () => onSubmit({ score: 2, response: text.trim(), ungraded: true });

  return (
    <div className="space-y-3">
      {task.addressee && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm">
            <span className="text-muted-foreground">{t("addressee")}: </span>
            <b>{localized(task.addressee, locale)}</b>
          </p>
          {voice && (
            <Button variant="ghost" size="sm" onClick={() => void speech.speak(localized(situation, locale))} disabled={speech.speaking}>
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {voice && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
          {speech.sttSupported ? (
            <>
              <button
                type="button"
                onClick={() => (speech.listening ? speech.stopListening() : speech.startListening())}
                disabled={speech.processing || busy}
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-all active:scale-95 disabled:opacity-50",
                  speech.listening ? "animate-pulse bg-destructive" : "bg-primary hover:brightness-110"
                )}
                aria-label={speech.listening ? tt("stop") : tt("record")}
              >
                {speech.processing ? <Loader2 className="h-8 w-8 animate-spin" /> : speech.listening ? <Square className="h-8 w-8" /> : <Mic className="h-9 w-9" />}
              </button>
              <span className="text-sm font-medium">
                {speech.processing ? tt("processing") : speech.listening ? tt("stop") : tt("record")}
              </span>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{tt("noMic")}</p>
          )}
        </div>
      )}

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={tt("placeholder")}
        rows={voice ? 4 : 9}
        className="text-base leading-relaxed"
        disabled={busy}
        data-testid="task-answer"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={cn("text-xs", words < task.minWords ? "text-muted-foreground" : "text-success")}>
          {t("words", { n: words, min: task.minWords })}
        </span>
        <Button onClick={() => void grade()} disabled={busy || words === 0 || speech.listening || speech.processing}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {busy ? t("grading") : tt("submit")}
        </Button>
      </div>

      {failed && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-accent/40 bg-accent/5 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-accent" />
          <span className="mr-auto">{t("gradeFailed")}</span>
          <Button size="sm" variant="outline" onClick={() => void grade()}>
            {t("retry")}
          </Button>
          <Button size="sm" variant="ghost" onClick={skip}>
            {t("skipUngraded")}
          </Button>
        </div>
      )}
    </div>
  );
}
