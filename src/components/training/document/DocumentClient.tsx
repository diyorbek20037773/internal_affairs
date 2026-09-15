"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowRight, RefreshCw, FileText, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSessionBootstrap } from "@/hooks/useSessionBootstrap";
import { newDocumentSession, touch } from "@/lib/training/sessionFactory";
import { trainingRepo } from "@/lib/storage/training";
import { localized } from "@/data/sops/types";
import { LAWS } from "@/data/sops/laws";
import type { LawRef } from "@/data/sops/types";
import type { DocumentGrade, DocumentScenario } from "@/data/scenarios/types";
import type { DocumentPayload, TrainingSession } from "@/lib/storage/trainingSchema";
import { ProfileGate } from "../profile/ProfileGate";
import { cn } from "@/lib/utils";

export function DocumentClient({
  scenario,
  sessionId,
  exam,
}: {
  scenario: DocumentScenario;
  sessionId?: string;
  exam?: { examId: string; examStageIndex: number };
}) {
  const create = useCallback(
    (traineeId: string, ex?: { examId: string; examStageIndex: number }) =>
      newDocumentSession(scenario, { traineeId, ...ex }),
    [scenario]
  );
  const { session, ready, needsProfile } = useSessionBootstrap({ scenarioId: scenario.id, sessionId, create, exam });
  if (needsProfile) return <ProfileGate />;
  if (!ready || !session) return null;
  return <DocumentRunner scenario={scenario} initial={session} />;
}

function DocumentRunner({ scenario, initial }: { scenario: DocumentScenario; initial: TrainingSession }) {
  const t = useTranslations("sim.document");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [session, setSession] = useState(initial);
  const payload = session.payload as DocumentPayload;
  const [text, setText] = useState(payload.text);
  const [checking, setChecking] = useState(false);
  const finished = session.status !== "in_progress";
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (finished) return;
    const id = window.setTimeout(() => {
      const next = touch(session, { payload: { ...payload, text } });
      setSession(next);
      void trainingRepo.saveSession(next);
    }, 700);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const submit = async () => {
    if (words < 10) return;
    setChecking(true);
    try {
      const res = await fetch("/api/sim/document-check", {
        method: "POST",
        signal: AbortSignal.timeout(90000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id, locale, text }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(
          j.error === "ai_unavailable" ? tc("aiUnavailable") : j.error === "no_keys_configured" ? tc("noKeys") : j.error === "bad_ai_output" ? tc("badOutput") : tc("errorGeneric")
        );
        return;
      }
      const grade = (await res.json()) as DocumentGrade;
      const done = touch(session, {
        status: "completed",
        endedAt: new Date().toISOString(),
        payload: { kind: "document", text, grade },
      });
      await trainingRepo.saveSession(done);
      setSession(done);
    } catch {
      toast.error(tc("errorGeneric"));
    } finally {
      setChecking(false);
    }
  };

  const grade = (session.payload as DocumentPayload).grade;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="h-4 w-4" /> {scenario.code} · {t(`kinds.${scenario.documentKind}`)}
            <span className="ml-auto font-mono normal-case">
              {words} / {scenario.minWords} {t("words")}
            </span>
          </div>
          <div className="p-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={finished}
              rows={18}
              placeholder={t("placeholder")}
              className="font-mono text-sm leading-relaxed"
            />
            {!finished && (
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">{t("hint")}</p>
                <Button onClick={() => void submit()} disabled={words < 10 || checking}>
                  {checking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {checking ? t("checking") : t("submit")}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {grade && (
          <Card className={cn("p-5", grade.score >= 70 ? "border-success/40 bg-success/5" : grade.score >= 45 ? "border-accent/40 bg-accent/5" : "border-destructive/40 bg-destructive/5")}>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold">{t("result")}</h4>
              <Badge variant={grade.score >= 70 ? "success" : grade.score >= 45 ? "accent" : "destructive"} className="text-base">
                {grade.score}/100
              </Badge>
            </div>
            <ul className="mb-3 grid gap-1.5 sm:grid-cols-2">
              {scenario.rubric.map((r) => {
                const e = grade.elements[r.id];
                return (
                  <li key={r.id} className="flex items-start gap-2 text-sm">
                    {e?.present ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
                    <span>
                      {localized(r.label, locale)}
                      {e?.note && <span className="block text-xs text-muted-foreground">{e.note}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
            {grade.factErrors.length > 0 && (
              <ErrList title={t("factErrors")} items={grade.factErrors} />
            )}
            {grade.legalErrors.length > 0 && (
              <ErrList title={t("legalErrors")} items={grade.legalErrors} />
            )}
            {grade.strengths.length > 0 && (
              <p className="mt-2 text-sm"><span className="font-semibold">{t("strengths")}:</span> {grade.strengths.join("; ")}</p>
            )}
            <p className="mt-3 border-l-2 border-accent pl-3 text-sm italic">{grade.feedback}</p>
            <Button className="mt-4" onClick={() => router.push(`/simulyator/debrif/${session.id}`)}>
              {tc("toDebrief")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("facts")}</p>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
            {scenario.facts.map((f, i) => (
              <li key={i}>{localized(f, locale)}</li>
            ))}
          </ol>
        </Card>
        <Card className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("rubric")}</p>
          <ul className="space-y-1 text-sm">
            {scenario.rubric.map((r) => (
              <li key={r.id} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                {localized(r.label, locale)}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-accent" /> {t("forbidden")}
          </p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {scenario.forbidden.map((f, i) => (
              <li key={i}>· {f}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("laws")}</p>
          <ul className="space-y-1 text-xs">
            {scenario.laws.map((k) => {
              const l = LAWS[k] as LawRef;
              return (
                <li key={k}>
                  <a href={l.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    {l.code}{l.article ? `, ${l.article}` : ""}
                  </a>
                  {l.title && <span className="text-muted-foreground"> — {l.title}</span>}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function ErrList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-destructive">{title}</p>
      <ul className="mt-1 space-y-0.5 text-sm">
        {items.map((x, i) => (
          <li key={i}>· {x}</li>
        ))}
      </ul>
    </div>
  );
}
