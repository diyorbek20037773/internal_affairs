"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Zap } from "lucide-react";
import { localized } from "@/data/sops/types";
import type { TutorQuizItem } from "@/data/kasblar/types";
import { cn } from "@/lib/utils";

/** "Tezkor tekshiruv" — the 2–3 quiz items; answer once, instant explanation. */
export function QuickQuiz({
  items,
  locale,
  answers,
  onAnswer,
}: {
  items: TutorQuizItem[];
  locale: string;
  answers: Record<string, string>;
  onAnswer: (itemId: string, optionId: string) => void;
}) {
  const t = useTranslations("tutor");
  const answered = items.filter((q) => answers[q.id]).length;
  const correct = items.filter((q) => q.options.find((o) => o.id === answers[q.id])?.correct).length;

  return (
    <section>
      <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <Zap className="h-4 w-4 text-accent" /> {t("quizTitle")}
        <span className="ml-auto text-xs font-normal text-muted-foreground">
          {answered === items.length ? t("quizScore", { correct, total: items.length }) : `${answered}/${items.length}`}
        </span>
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">{t("quizHint")}</p>
      <div className="space-y-4">
        {items.map((q, qi) => {
          const chosen = answers[q.id];
          return (
            <div key={q.id} className="rounded-lg border border-border/70 p-3">
              <p className="mb-2 text-sm font-medium">
                {qi + 1}. {localized(q.question, locale)}
              </p>
              <div className="space-y-1.5">
                {q.options.map((o) => {
                  const isChosen = chosen === o.id;
                  const reveal = !!chosen;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      disabled={reveal}
                      onClick={() => onAnswer(q.id, o.id)}
                      className={cn(
                        "flex min-h-10 w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default",
                        !reveal && "border-border/70 hover:border-primary/40 hover:bg-secondary",
                        reveal && o.correct && "border-emerald-500/50 bg-emerald-500/10",
                        reveal && isChosen && !o.correct && "border-destructive/50 bg-destructive/10",
                        reveal && !isChosen && !o.correct && "border-border/50 opacity-60"
                      )}
                    >
                      {reveal && o.correct ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : reveal && isChosen ? (
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                      ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/40" />
                      )}
                      <span>{localized(o.text, locale)}</span>
                    </button>
                  );
                })}
              </div>
              {chosen && (
                <p className="mt-2 rounded-md bg-muted/60 p-2 text-xs leading-relaxed">
                  <span className="font-semibold">
                    {q.options.find((o) => o.id === chosen)?.correct ? t("quizCorrect") : t("quizWrong")}
                  </span>{" "}
                  {localized(q.explanation, locale)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
