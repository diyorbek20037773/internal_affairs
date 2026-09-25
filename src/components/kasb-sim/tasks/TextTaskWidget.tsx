"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, Loader2, Mic, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { SimTask } from "@/data/kasblar/types";
import { useSpeech } from "@/hooks/useSpeech";
import { wordCount, type SimAnswer } from "@/lib/kasb/simEngine";
import type { KasbGrade } from "@/app/api/sim/kasb-grade/route";
import { cn } from "@/lib/utils";

export interface TextGradeExtra {
  feedback?: string;
  missing?: string[];
  tooShort?: boolean;
}

/**
 * Written answer (typed or dictated via server STT) graded by /api/sim/kasb-grade
 * against the authored rubric. On AI failure: retry, or continue ungraded
 * (the stage is then excluded from competency scores).
 */
export function TextTaskWidget({
  simId,
  stageId,
  task,
  locale,
  onSubmit,
}: {
  simId: string;
  stageId: string;
  task: Extract<SimTask, { kind: "text" }>;
  locale: string;
  onSubmit: (a: SimAnswer, extra?: TextGradeExtra) => void;
}) {
  const t = useTranslations("kasbsim.run");
  const speech = useSpeech({ locale, maxRecordMs: 60_000 });
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const words = wordCount(text);

  // Each finished recording is appended — the officer can dictate in pieces.
  useEffect(() => {
    if (!speech.transcript) return;
    setText((prev) => (prev ? `${prev.trim()} ${speech.transcript}` : speech.transcript));
    speech.setTranscript("");
  }, [speech.transcript, speech.setTranscript]);

  const grade = async () => {
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/sim/kasb-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(60_000),
        body: JSON.stringify({ simId, stageId, answer: text.trim(), locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const g = (await res.json()) as KasbGrade;
      onSubmit({ kind: "text", text: text.trim(), aiScore: g.score03 }, { feedback: g.feedback, missing: g.missing, tooShort: g.tooShort });
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const skip = () => onSubmit({ kind: "text", text: text.trim(), aiScore: null });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("textPlaceholder")}
          rows={9}
          className="pr-14 text-base leading-relaxed"
          disabled={busy}
          data-testid="kasb-text"
        />
        {speech.sttSupported && (
          <button
            type="button"
            onClick={() => (speech.listening ? speech.stopListening() : speech.startListening())}
            disabled={speech.processing || busy}
            aria-label={speech.listening ? t("stop") : t("dictate")}
            className={cn(
              "absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground shadow transition-all active:scale-95 disabled:opacity-50",
              speech.listening ? "animate-pulse bg-destructive" : "bg-primary"
            )}
          >
            {speech.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : speech.listening ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        )}
      </div>
      {(speech.listening || speech.processing) && (
        <p className="text-xs font-medium text-primary">{speech.processing ? t("processing") : t("listening")}</p>
      )}
      {speech.sttError && !speech.listening && <p className="text-xs text-destructive">{t("micError")}</p>}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={cn("text-xs", words < task.minWords ? "text-muted-foreground" : "text-success")}>{t("words", { n: words, min: task.minWords })}</span>
        <Button onClick={() => void grade()} disabled={busy || words === 0 || speech.listening || speech.processing} className="min-h-11">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {busy ? t("grading") : t("submitText")}
        </Button>
      </div>

      {failed && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-accent/40 bg-accent/5 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-accent" />
          <span className="mr-auto">{t("gradeFailed")}</span>
          <Button size="sm" variant="outline" className="min-h-10" onClick={() => void grade()}>
            {t("retry")}
          </Button>
          <Button size="sm" variant="ghost" className="min-h-10" onClick={skip}>
            {t("skipUngraded")}
          </Button>
        </div>
      )}
    </div>
  );
}
