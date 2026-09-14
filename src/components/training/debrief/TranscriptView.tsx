"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getScenario } from "@/data/scenarios";
import { localized } from "@/data/sops/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { cn } from "@/lib/utils";

/** Replay of the session with per-turn coach notes / per-node scores (pptx: "xodim o'zini tomondan ko'radi"). */
export function TranscriptView({ session }: { session: TrainingSession }) {
  const t = useTranslations("sim.debrief");
  const td = useTranslations("sim.dialog");
  const tq = useTranslations("sim.decision");
  const tm = useTranslations("sim.mahalla");
  const tdoc = useTranslations("sim.document");
  const locale = useLocale();
  const scenario = getScenario(session.scenarioId);
  const p = session.payload;

  return (
    <Card className="p-5">
      <h4 className="mb-4 font-semibold">{t("transcript")}</h4>

      {p.kind === "dialog" && (
        <ol className="space-y-3 text-sm">
          {p.transcript.map((turn, idx) => {
            const officerIdx = p.transcript.slice(0, idx + 1).filter((x) => x.role === "officer").length;
            return (
              <li key={turn.i} className={cn("rounded-lg border p-3", turn.role === "officer" ? "border-primary/30 bg-primary/5" : "bg-muted/30")}>
                <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider">
                    {turn.role === "officer" ? `${td("you")} · turn:${officerIdx}` : td("citizen")}
                  </span>
                  {turn.assessment && (
                    <>
                      <Badge variant="outline" className="text-[10px]">{td(`tones.${turn.assessment.tone}`)}</Badge>
                      <Badge variant="outline" className="text-[10px]">{td(`phases.${turn.assessment.phaseDetected}`)}</Badge>
                      <Badge
                        variant={turn.assessment.delta.tension < 0 ? "success" : turn.assessment.delta.tension > 0 ? "destructive" : "secondary"}
                        className="font-mono text-[10px]"
                      >
                        {td("tension")} {turn.assessment.delta.tension > 0 ? "+" : ""}{turn.assessment.delta.tension}
                      </Badge>
                      {turn.assessment.flags.map((f) => (
                        <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                      ))}
                    </>
                  )}
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{turn.text}</p>
                {turn.assessment?.coachNote && (
                  <p className="mt-2 border-l-2 border-accent pl-2 text-xs italic text-muted-foreground">
                    {t("coach")}: {turn.assessment.coachNote}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {p.kind === "decision" && scenario?.kind === "decision" && (
        <ol className="space-y-3 text-sm">
          {p.path.map((st, i) => {
            const node = scenario.nodes[st.nodeId];
            const opt = st.optionId ? node?.options.find((o) => o.id === st.optionId) : undefined;
            return (
              <li key={i} className="rounded-lg border p-3">
                <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-mono">node:{st.nodeId}</span>
                  {node?.chainPrompt && <Badge variant="outline" className="text-[10px]">{tq(`chain.${node.chainPrompt}`)}</Badge>}
                  {st.timedOut ? (
                    <Badge variant="destructive" className="text-[10px]">{tq("timeout")}</Badge>
                  ) : opt ? (
                    <>
                      <Badge variant={opt.legality >= 3 ? "success" : opt.legality >= 2 ? "secondary" : "destructive"} className="text-[10px]">
                        {tq("legality")} {opt.legality}/3
                      </Badge>
                      <Badge variant={opt.proportionality >= 3 ? "success" : opt.proportionality >= 2 ? "secondary" : "destructive"} className="text-[10px]">
                        {tq("proportionality")} {opt.proportionality}/3
                      </Badge>
                    </>
                  ) : null}
                </div>
                {node && <p className="text-muted-foreground">{localized(node.situation, locale)}</p>}
                {opt && <p className="mt-1 font-medium">→ {localized(opt.text, locale)}</p>}
                {opt && <p className="mt-1 text-xs text-muted-foreground">{tq("consequence")}: {localized(opt.consequence, locale)}</p>}
              </li>
            );
          })}
        </ol>
      )}

      {p.kind === "mahalla" && scenario?.kind === "mahalla" && (
        <div className="space-y-3 text-sm">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{tm("picked")}</p>
            <ol className="list-decimal space-y-1 pl-5">
              {p.picked.map((id) => {
                const pr = scenario.problems.find((x) => x.id === id);
                const correctIdx = scenario.answerKey.top3.indexOf(id);
                return (
                  <li key={id}>
                    {pr ? localized(pr.title, locale) : id}{" "}
                    <Badge variant={correctIdx === p.picked.indexOf(id) ? "success" : correctIdx >= 0 ? "secondary" : "destructive"} className="ml-1 text-[10px]">
                      {correctIdx >= 0 ? `✓ ${correctIdx + 1}` : "✗"}
                    </Badge>
                  </li>
                );
              })}
            </ol>
          </div>
          {Object.entries(p.plans).map(([id, text]) => {
            const pr = scenario.problems.find((x) => x.id === id);
            const g = p.grade?.planScores[id];
            return (
              <div key={id} className="rounded-lg border p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-medium">{pr ? localized(pr.title, locale) : id}</p>
                  {g && <Badge variant={g.score >= 70 ? "success" : g.score >= 45 ? "secondary" : "destructive"}>{g.score}</Badge>}
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground">{text || "—"}</p>
                {g && g.missing.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold">{tm("missing")}:</span> {g.missing.join("; ")}
                  </p>
                )}
                {g?.feedback && <p className="mt-1 border-l-2 border-accent pl-2 text-xs italic text-muted-foreground">{g.feedback}</p>}
              </div>
            );
          })}
        </div>
      )}

      {p.kind === "document" && scenario?.kind === "document" && (
        <div className="space-y-3 text-sm">
          <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 font-mono text-xs leading-relaxed">{p.text || "—"}</pre>
          {p.grade && (
            <>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{tdoc("result")}:</span>
                <Badge variant={p.grade.score >= 70 ? "success" : p.grade.score >= 45 ? "secondary" : "destructive"}>{p.grade.score}/100</Badge>
              </div>
              <ul className="grid gap-1 sm:grid-cols-2">
                {scenario.rubric.map((r) => (
                  <li key={r.id} className={cn("text-xs", p.grade!.elements[r.id]?.present ? "text-success" : "text-destructive")}>
                    {p.grade!.elements[r.id]?.present ? "✓" : "✗"} {localized(r.label, locale)}
                  </li>
                ))}
              </ul>
              {p.grade.factErrors.length > 0 && <p className="text-xs"><b>{tdoc("factErrors")}:</b> {p.grade.factErrors.join("; ")}</p>}
              {p.grade.legalErrors.length > 0 && <p className="text-xs"><b>{tdoc("legalErrors")}:</b> {p.grade.legalErrors.join("; ")}</p>}
              <p className="border-l-2 border-accent pl-2 text-xs italic text-muted-foreground">{p.grade.feedback}</p>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
