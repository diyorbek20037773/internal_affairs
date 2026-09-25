"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, AlertTriangle, Scale, ExternalLink, ListChecks } from "lucide-react";
import { LAWS } from "@/data/sops/laws";
import { localized } from "@/data/sops/types";
import type { LegalBasis, TutorTopic } from "@/data/kasblar/types";
import { cn } from "@/lib/utils";

function LegalLine({ b, locale }: { b: LegalBasis; locale: string }) {
  const t = useTranslations("tutor");
  if (b.lawKey) {
    const law = LAWS[b.lawKey];
    const art = "article" in law && law.article ? `, ${law.article}` : "";
    return (
      <li className="text-sm leading-snug">
        <a href={law.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 hover:underline">
          <span>
            <span className="font-medium">{law.code}{art}</span>
            {law.title ? <span className="text-muted-foreground"> — {law.title}</span> : null}
          </span>
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </a>
        {!law.verified && (
          <span className="ml-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] text-amber-700 dark:text-amber-400">
            {t("verifyBadge")}
          </span>
        )}
      </li>
    );
  }
  if (!b.title) return null;
  return <li className="text-sm leading-snug font-medium">{localized(b.title, locale)}</li>;
}

export function LessonPanel({
  topic,
  locale,
  checked,
  onToggle,
}: {
  topic: TutorTopic;
  locale: string;
  checked: Set<number>;
  onToggle: (i: number) => void;
}) {
  const t = useTranslations("tutor");
  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <ListChecks className="h-4 w-4 text-primary" /> {t("stepsTitle")}
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {checked.size}/{topic.steps.length}
          </span>
        </h3>
        <p className="mb-2 text-xs text-muted-foreground">{t("stepsHint")}</p>
        <ol className="space-y-1.5">
          {topic.steps.map((s, i) => {
            const on = checked.has(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onToggle(i)}
                  aria-pressed={on}
                  className={cn(
                    "flex min-h-10 w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    on ? "border-emerald-500/40 bg-emerald-500/10" : "border-border/70 hover:bg-secondary"
                  )}
                >
                  {on ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={cn(on && "text-muted-foreground line-through")}>
                    <span className="font-medium">{i + 1}.</span> {localized(s, locale)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="h-4 w-4 text-amber-600" /> {t("pitfallsTitle")}
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {topic.pitfalls.map((p, i) => (
            <li key={i}>{localized(p, locale)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Scale className="h-4 w-4 text-primary" /> {t("legalTitle")}
        </h3>
        <ul className="space-y-1.5">
          {topic.legalBasis.map((b, i) => (
            <LegalLine key={i} b={b} locale={locale} />
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">{t("legalNote")}</p>
      </section>
    </div>
  );
}
