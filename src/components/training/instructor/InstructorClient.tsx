"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Info, ArrowRight, Search, Printer, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useTrainingSessions } from "@/hooks/useTrainingSessions";
import { trainingRepo } from "@/lib/storage/training";
import { onStoreMode, storeMode, type StoreMode } from "@/lib/storage/trainingRemote";
import type { ExamSignoff, HimoyaId, TraineeProfile } from "@/lib/storage/trainingSchema";
import { getScenario, getExamScenario } from "@/data/scenarios";
import { COMPETENCIES, COMPETENCY_LABELS } from "@/data/scenarios/competencies";
import { localized } from "@/data/sops/types";
import { cn, formatDate } from "@/lib/utils";
import { SessionList } from "../SessionList";
import { ProfileGate } from "../profile/ProfileGate";
import { TraineeReport } from "./TraineeReport";
import { DEFAULT_FILTER, avgScore, examAttempts, filterSessions, groupsOf, matchesTrainee, type CabinetFilter, type ExamAttempt } from "./cabinetFilters";

const KINDS = ["all", "dialog", "decision", "mahalla", "document", "tir"] as const;
const PERIODS = ["7", "30", "all"] as const;

export function InstructorClient() {
  const t = useTranslations("sim.instructor");
  const td = useTranslations("sim.debrief");
  const locale = useLocale();
  const { profile, loaded: pLoaded, isInstructor } = useTraineeProfile();
  const { sessions, loaded, removeSession } = useTrainingSessions(); // all trainees (device, or server when logged in)
  const [ids, setIds] = useState<HimoyaId[]>([]);
  const [profiles, setProfiles] = useState<TraineeProfile[]>([]);
  const [signoffs, setSignoffs] = useState<ExamSignoff[]>([]);
  const [mode, setMode] = useState<StoreMode | null>(null);
  const [filter, setFilter] = useState<CabinetFilter>(DEFAULT_FILTER);
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    void trainingRepo.listHimoyaIds().then(setIds);
    void trainingRepo.listProfiles().then(setProfiles);
    void trainingRepo.listSignoffs().then(setSignoffs);
  }, [sessions]);

  useEffect(() => {
    void storeMode();
    return onStoreMode(setMode);
  }, []);

  const profileMap = useMemo(() => {
    const m = new Map<string, TraineeProfile>();
    for (const p of profiles) m.set(p.id, p);
    if (profile) m.set(profile.id, profile);
    return m;
  }, [profile, profiles]);

  const names = useMemo(() => {
    const m: Record<string, string> = {};
    for (const [id, p] of profileMap) m[id] = `${p.name} (${p.badgeId})`;
    return m;
  }, [profileMap]);

  const groups = useMemo(() => groupsOf(profileMap.values()), [profileMap]);
  const filtered = useMemo(() => filterSessions(sessions, profileMap, filter), [sessions, profileMap, filter]);
  const pending = filtered.filter((s) => s.debrief && s.debrief.status === "pending");
  const trainees = Array.from(new Set(filtered.map((s) => s.traineeId)));
  const attempts = useMemo(
    () => examAttempts(filtered, signoffs).filter((a) => matchesTrainee(profileMap.get(a.traineeId), filter, a.traineeId)),
    [filtered, signoffs, profileMap, filter]
  );
  const active = filter.q || filter.group || filter.kind !== "all" || filter.period !== "all";

  const sign = useCallback(
    async (a: ExamAttempt, verdict: ExamSignoff["verdict"], note: string) => {
      if (!profile) return;
      const x: ExamSignoff = { examId: a.examId, traineeId: a.traineeId, verdict, note, signedBy: profile.id, signedByName: profile.name, updatedAt: new Date().toISOString() };
      await trainingRepo.saveSignoff(x);
      setSignoffs(await trainingRepo.listSignoffs());
      toast.success(t("signed"));
    },
    [profile, t]
  );

  if (pLoaded && !profile) return <ProfileGate />;
  if (pLoaded && !isInstructor) {
    return (
      <Card className="space-y-3 p-8 text-center">
        <p className="font-semibold">{t("notInstructorTitle")}</p>
        <p className="text-sm text-muted-foreground">{t("notInstructorDesc")}</p>
        <Button asChild variant="outline" size="sm"><Link href="/profil">{t("openProfile")}</Link></Button>
      </Card>
    );
  }
  if (!loaded) return null;

  if (report) {
    return (
      <TraineeReport
        traineeId={report}
        profile={profileMap.get(report)}
        himoyaId={ids.find((h) => h.traineeId === report)}
        sessions={sessions.filter((s) => s.traineeId === report)}
        signoffs={signoffs.filter((x) => x.traineeId === report)}
        instructorName={profile?.name ?? ""}
        onClose={() => setReport(null)}
      />
    );
  }

  return (
    <div className="space-y-8" id="h360-print">
      <p className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-xs text-muted-foreground print:hidden">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {mode === "postgres" ? t("serverNote") : t("deviceNote")}
      </p>

      {/* Filters */}
      <Card className="flex flex-wrap items-center gap-2 p-3 print:hidden" data-testid="cabinet-filters">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} placeholder={t("filter.search")} className="h-10 pl-9" data-testid="filter-q" />
        </label>
        <select value={filter.group} onChange={(e) => setFilter({ ...filter, group: e.target.value })} className="h-10 rounded-md border bg-background px-2 text-sm" data-testid="filter-group" aria-label={t("filter.group")}>
          <option value="">{t("filter.allGroups")}</option>
          {groups.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={filter.kind} onChange={(e) => setFilter({ ...filter, kind: e.target.value as CabinetFilter["kind"] })} className="h-10 rounded-md border bg-background px-2 text-sm" data-testid="filter-kind" aria-label={t("filter.kind")}>
          {KINDS.map((k) => <option key={k} value={k}>{k === "all" ? t("filter.allKinds") : t(`kinds.${k}`)}</option>)}
        </select>
        <div className="flex overflow-hidden rounded-md border" role="radiogroup" aria-label={t("filter.period")}>
          {PERIODS.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={filter.period === p} onClick={() => setFilter({ ...filter, period: p })} className={cn("h-10 px-3 text-sm", filter.period === p ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
              {t(`filter.period_${p}`)}
            </button>
          ))}
        </div>
        {active && <Button variant="ghost" size="sm" className="h-10" onClick={() => setFilter(DEFAULT_FILTER)}><X className="mr-1 h-4 w-4" /> {t("filter.reset")}</Button>}
        <Button variant="outline" size="sm" className="ml-auto h-10" onClick={() => window.print()} data-testid="cabinet-print"><Printer className="mr-1 h-4 w-4" /> {t("report.print")}</Button>
      </Card>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold tracking-tight">
          {t("pending")} <Badge variant="accent">{pending.length}</Badge>
        </h3>
        {pending.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">{t("noPending")}</Card>
        ) : (
          <div className="space-y-2">
            {pending.map((s) => {
              const sc = getScenario(s.scenarioId);
              const avg = avgScore(s);
              return (
                <Card key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{sc ? `${sc.code} — ${localized(sc.title, locale)}` : s.scenarioId}</p>
                    <p className="text-xs text-muted-foreground">
                      {names[s.traineeId] ?? s.traineeId.slice(0, 8)} · {formatDate(s.endedAt ?? s.updatedAt, locale)}
                    </p>
                  </div>
                  {avg != null && <Badge>{avg}%</Badge>}
                  <Button asChild size="sm" variant="accent" className="print:hidden">
                    <Link href={`/simulyator/debrif/${s.id}`}>
                      {td("confirm")} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Exams: one row per attempt, instructor signs off */}
      <section data-testid="exam-signoffs">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold tracking-tight">
          {t("exams")} <Badge variant="secondary">{attempts.filter((a) => !a.signoff).length}</Badge>
        </h3>
        {attempts.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">{t("noExams")}</Card>
        ) : (
          <div className="space-y-2">
            {attempts.map((a) => <ExamRow key={a.examId} attempt={a} name={names[a.traineeId] ?? a.traineeId.slice(0, 8)} onSign={sign} />)}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-lg font-bold tracking-tight">{t("trainees")} <span className="text-sm font-normal text-muted-foreground">({trainees.length})</span></h3>
        <p className="mb-2 text-xs text-muted-foreground">{t("legend")}: {COMPETENCIES.map((c) => localized(COMPETENCY_LABELS[c], locale)).join(" · ")}</p>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">{t("trainee")}</th>
                <th className="px-3 py-2">{t("group")}</th>
                <th className="px-3 py-2">{t("allSessions")}</th>
                {COMPETENCIES.map((c) => (
                  <th key={c} className="px-2 py-2 text-center" title={localized(COMPETENCY_LABELS[c], locale)}>
                    {localized(COMPETENCY_LABELS[c], locale).split(" ")[0].slice(0, 5)}
                  </th>
                ))}
                <th className="px-2 py-2 print:hidden" />
              </tr>
            </thead>
            <tbody>
              {trainees.map((tid) => {
                const h = ids.find((x) => x.traineeId === tid);
                const n = filtered.filter((s) => s.traineeId === tid).length;
                return (
                  <tr key={tid} className="border-t" data-testid="trainee-row">
                    <td className="px-3 py-2 font-medium">{names[tid] ?? tid.slice(0, 8)}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{profileMap.get(tid)?.district || "—"}</td>
                    <td className="px-3 py-2">{n}</td>
                    {COMPETENCIES.map((c) => (
                      <td key={c} className="px-2 py-2 text-center font-mono text-xs">
                        {h && (h.samples[c] ?? 0) > 0 ? h.scores[c] : "—"}
                      </td>
                    ))}
                    <td className="px-2 py-1 text-right print:hidden">
                      <Button size="sm" variant="outline" className="h-9" onClick={() => setReport(tid)} data-testid="open-report"><FileText className="mr-1 h-4 w-4" /> {t("report.open")}</Button>
                    </td>
                  </tr>
                );
              })}
              {trainees.length === 0 && (
                <tr>
                  <td colSpan={4 + COMPETENCIES.length} className="px-3 py-6 text-center text-muted-foreground">{active ? t("noMatch") : t("noTrainees")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="print:hidden">
        <h3 className="mb-3 text-lg font-bold tracking-tight">{t("allSessions")} <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span></h3>
        <SessionList sessions={filtered} onRemove={(id) => void removeSession(id)} showTrainee traineeNames={names} />
      </section>
    </div>
  );
}

function ExamRow({ attempt: a, name, onSign }: { attempt: ExamAttempt; name: string; onSign: (a: ExamAttempt, v: ExamSignoff["verdict"], note: string) => Promise<void> }) {
  const t = useTranslations("sim.instructor");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(a.signoff?.note ?? "");
  const [busy, setBusy] = useState(false);
  const exam = getExamScenario(a.baseExamId);
  const total = exam?.stages.length ?? 0;
  const complete = total > 0 && a.stagesDone >= total;
  const act = async (v: ExamSignoff["verdict"]) => {
    setBusy(true);
    try { await onSign(a, v, note.trim()); setOpen(false); } finally { setBusy(false); }
  };
  return (
    <Card className="p-4" data-testid="exam-row">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{exam ? localized(exam.title, locale) : a.baseExamId}{a.examId.includes("~") && <span className="ml-1 text-xs text-muted-foreground">({t("retakeTag")})</span>}</p>
          <p className="text-xs text-muted-foreground">{name} · {formatDate(a.updatedAt, locale)} · {t("stages", { done: a.stagesDone, total })}</p>
        </div>
        {a.avg != null && <Badge>{a.avg}%</Badge>}
        {a.signoff ? (
          <Badge variant={a.signoff.verdict === "passed" ? "success" : a.signoff.verdict === "failed" ? "destructive" : "secondary"} data-testid="signoff-badge">
            {t(`verdict.${a.signoff.verdict}`)}
          </Badge>
        ) : (
          <Badge variant="outline">{complete ? t("awaitingSignoff") : t("inProgress")}</Badge>
        )}
        <Button size="sm" variant={a.signoff ? "ghost" : "accent"} className="h-9 print:hidden" onClick={() => setOpen((v) => !v)} data-testid="signoff-toggle">
          {a.signoff ? t("changeSignoff") : t("signoff")}
        </Button>
      </div>
      {open && (
        <div className="mt-3 space-y-2 border-t pt-3 print:hidden">
          {!complete && <p className="text-xs text-destructive">{t("signoffIncomplete")}</p>}
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("signoffNote")} rows={2} data-testid="signoff-note" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-10" disabled={busy} onClick={() => void act("passed")} data-testid="sign-passed">{t("verdict.passed")}</Button>
            <Button size="sm" variant="secondary" className="h-10" disabled={busy} onClick={() => void act("retake")} data-testid="sign-retake">{t("verdict.retake")}</Button>
            <Button size="sm" variant="destructive" className="h-10" disabled={busy} onClick={() => void act("failed")} data-testid="sign-failed">{t("verdict.failed")}</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
