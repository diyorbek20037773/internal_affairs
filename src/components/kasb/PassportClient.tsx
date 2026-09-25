"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  Route,
  Save,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { AGENCIES, AGENCY_MAP, CLUSTER_MAP, SUBJECT_MAP, getProfession, professionsByAgency } from "@/data/kasblar";
import type { AgencyId, KasbSimResult, ProfessionId } from "@/data/kasblar/types";
import { ALL_SIMS } from "@/data/kasblar/sims";
import { localized, type LocalizedText } from "@/data/sops/types";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { kasbRepo } from "@/lib/storage/kasb";
import { trainingRepo } from "@/lib/storage/training";
import type { HimoyaId } from "@/lib/storage/trainingSchema";
import { GAP_THRESHOLD, STRENGTH_THRESHOLD, buildPassport } from "@/lib/kasb/passport";
import { cn } from "@/lib/utils";

const selectCls =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function PassportClient() {
  const t = useTranslations("kasb.passport");
  const tk = useTranslations("kasb");
  const locale = useLocale();
  const L = useCallback((x: LocalizedText) => localized(x, locale), [locale]);
  const { profile, loaded } = useTraineeProfile();
  const traineeId = profile?.id;

  const [agency, setAgency] = useState<AgencyId>("iiv");
  const [professionId, setProfessionId] = useState<ProfessionId>("profilaktika");
  const [saved, setSaved] = useState<{ agency: AgencyId; profession: ProfessionId } | null>(null);
  const [results, setResults] = useState<KasbSimResult[]>([]);
  const [himoya, setHimoya] = useState<HimoyaId | undefined>(undefined);
  const [ready, setReady] = useState(false);

  // Initial track.
  useEffect(() => {
    void kasbRepo.getTrack().then((tr) => {
      if (tr && getProfession(tr.profession)) {
        setAgency(tr.agency);
        setProfessionId(tr.profession);
        setSaved(tr);
      }
    });
  }, []);

  const load = useCallback(async () => {
    const [rows, h, tr] = await Promise.all([
      kasbRepo.listResults(traineeId),
      traineeId ? trainingRepo.getHimoyaId(traineeId) : Promise.resolve(undefined),
      kasbRepo.getTrack(),
    ]);
    setResults(rows);
    setHimoya(h);
    setSaved(tr);
    setReady(true);
  }, [traineeId]);

  useEffect(() => {
    if (!loaded) return;
    void load();
    const onChange = () => void load();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("h360:")) void load();
    };
    window.addEventListener(kasbRepo.CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(kasbRepo.CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [loaded, load]);

  const profession = getProfession(professionId) ?? getProfession("profilaktika")!;
  const passport = useMemo(
    () =>
      buildPassport({
        profession,
        results,
        klasterId: himoya ? { scores: himoya.scores, samples: himoya.samples } : null,
        sims: ALL_SIMS,
      }),
    [profession, results, himoya]
  );
  const compById = new Map(profession.competencies.map((c) => [c.id, c]));
  const simById = new Map(ALL_SIMS.map((s) => [s.id, s]));
  const agencyProfessions = professionsByAgency(agency);
  const isSaved = saved?.agency === agency && saved?.profession === profession.id;
  const levelInfo = passport.level ? profession.levels[passport.level - 1] : null;

  const onAgency = (a: AgencyId) => {
    setAgency(a);
    const list = professionsByAgency(a);
    if (!list.some((p) => p.id === professionId)) setProfessionId(list[0].id);
  };

  const saveTrack = async () => {
    await kasbRepo.saveTrack({ agency, profession: profession.id });
  };

  return (
    <div className="space-y-6">
      {/* Track selector */}
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="block">
            <span className="label-eyebrow mb-1.5 block">{t("agency")}</span>
            <select className={selectCls} value={agency} onChange={(e) => onAgency(e.target.value as AgencyId)}>
              {AGENCIES.map((a) => (
                <option key={a.id} value={a.id}>
                  {L(a.title)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label-eyebrow mb-1.5 block">{t("profession")}</span>
            <select className={selectCls} value={profession.id} onChange={(e) => setProfessionId(e.target.value as ProfessionId)}>
              {agencyProfessions.map((p) => (
                <option key={p.id} value={p.id}>
                  {L(p.title)}
                </option>
              ))}
            </select>
          </label>
          <Button onClick={saveTrack} disabled={isSaved} className="h-11" variant={isSaved ? "outline" : "default"}>
            {isSaved ? <BadgeCheck className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {isSaved ? t("trackSaved") : t("saveTrack")}
          </Button>
        </div>
        {!profile && loaded && <p className="mt-3 text-xs text-muted-foreground">{t("noProfile")}</p>}
      </Card>

      {/* Header */}
      <div className="brand-gradient overflow-hidden rounded-2xl p-6 text-white md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Icon name={profession.icon} className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{t("eyebrow")}</p>
              <h3 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">{L(profession.title)}</h3>
              <p className="mt-1 text-sm text-white/70">
                {profile ? `${profile.rank} ${profile.name}`.trim() : t("anonymous")} · {L(AGENCY_MAP[agency].short)}
              </p>
              <p className="mt-2 text-xs text-white/60">
                {t("evidence", { n: passport.resultsUsed })}
                {profession.id === "profilaktika" && passport.competencies.some((c) => c.fromKlasterId) && ` · ${t("klasterBlended")}`}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <Ring value={passport.overall} />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/60">{t("level")}</p>
              <p className="text-lg font-semibold">{levelInfo ? `${levelInfo.level}. ${L(levelInfo.title)}` : "—"}</p>
              {levelInfo && <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-white/70">{L(levelInfo.description)}</p>}
            </div>
          </div>
        </div>
      </div>

      {ready && passport.overall === null && (
        <Card className="flex flex-col items-start gap-3 border-dashed p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">{t("emptyTitle")}</p>
              <p className="text-sm text-muted-foreground">{t("emptyText")}</p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/kasb-simulyator?profession=${profession.id}`}>
              <Gamepad2 className="h-4 w-4" />
              {t("startSim")}
            </Link>
          </Button>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Competency bars */}
        <Card className="p-5 lg:col-span-3">
          <SectionTitle icon={<Target className="h-5 w-5" />} title={t("competencies")} />
          <ul className="space-y-4">
            {passport.competencies.map((c) => {
              const meta = compById.get(c.id);
              const s = c.score;
              const tone = s === null ? "none" : s >= STRENGTH_THRESHOLD ? "good" : s < GAP_THRESHOLD ? "gap" : "mid";
              return (
                <li key={c.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="min-w-0 text-sm font-medium">{meta ? L(meta.label) : c.id}</span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {s === null ? <span className="text-xs font-normal text-muted-foreground">{t("notAssessed")}</span> : `${s}%`}
                    </span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        tone === "good" && "bg-success",
                        tone === "mid" && "bg-primary",
                        tone === "gap" && "bg-destructive"
                      )}
                      style={{ width: `${s ?? 0}%` }}
                    />
                    <span aria-hidden className="absolute inset-y-0 w-px bg-foreground/20" style={{ left: `${GAP_THRESHOLD}%` }} />
                    <span aria-hidden className="absolute inset-y-0 w-px bg-foreground/20" style={{ left: `${STRENGTH_THRESHOLD}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {t("sources", { n: c.evidenceCount })}
                    {c.fromKlasterId && ` · ${t("klasterId")}`}
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">{t("thresholds", { gap: GAP_THRESHOLD, strong: STRENGTH_THRESHOLD })}</p>
        </Card>

        {/* Strengths & gaps */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <SectionTitle icon={<CheckCircle2 className="h-5 w-5 text-success" />} title={t("strengths")} />
            <ChipList empty={t("none")} items={passport.strengths.map((id) => (compById.get(id) ? L(compById.get(id)!.label) : id))} tone="good" />
          </Card>
          <Card className="p-5">
            <SectionTitle icon={<TriangleAlert className="h-5 w-5 text-destructive" />} title={t("gaps")} />
            <ChipList empty={t("none")} items={passport.gaps.map((id) => (compById.get(id) ? L(compById.get(id)!.label) : id))} tone="gap" />
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subjects to restudy */}
        <Card className="p-5">
          <SectionTitle icon={<BookOpen className="h-5 w-5" />} title={t("restudy")} subtitle={t("restudyHint")} />
          {passport.recommendedSubjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">{passport.overall === null ? t("restudyNoData") : t("restudyNone")}</p>
          ) : (
            <ul className="divide-y divide-border/60 rounded-lg border border-border/70">
              {passport.recommendedSubjects.map((sid) => {
                const s = SUBJECT_MAP[sid];
                if (!s) return null;
                const cl = CLUSTER_MAP[s.cluster];
                return (
                  <li key={sid}>
                    <Link href={`/klasterlar#${s.cluster}`} className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/40">
                      <Icon name={cl.icon} className="h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="block">{L(s.title)}</span>
                        <span className="block text-[11px] text-muted-foreground">{L(cl.title)}</span>
                      </span>
                      {s.hours && <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{tk("hours", { n: s.hours })}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Recommended simulators */}
        <Card className="p-5">
          <SectionTitle icon={<Gamepad2 className="h-5 w-5" />} title={t("sims")} subtitle={t("simsHint")} />
          {passport.recommendedSims.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("simsNone")}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/kasb-simulyator?profession=${profession.id}`}>
                  {t("allSims")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {passport.recommendedSims.map((sid) => {
                const sim = simById.get(sid);
                const gapHits = sim
                  ? [...new Set(sim.stages.flatMap((st) => st.competencies))].filter((c) => passport.gaps.includes(c))
                  : [];
                return (
                  <li key={sid}>
                    <Link
                      href={`/kasb-simulyator/${sid}`}
                      className="group flex items-center gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:border-primary/40"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Gamepad2 className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {sim ? `${sim.code} · ${L(sim.title)}` : sid}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {gapHits.length > 0
                            ? t("closesGaps", { list: gapHits.map((c) => (compById.get(c) ? L(compById.get(c)!.label) : c)).join(", ") })
                            : t("firstAssessment")}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Individual trajectory */}
      <Card className="p-5">
        <SectionTitle icon={<Route className="h-5 w-5" />} title={t("trajectory")} subtitle={t("trajectoryHint")} />
        <ol className="grid gap-3 md:grid-cols-5">
          {profession.career.map((step, i) => {
            const currentIdx = passport.level ? Math.min(passport.level - 1, profession.career.length - 1) : -1;
            const state = i < currentIdx ? "done" : i === currentIdx ? "current" : i === currentIdx + 1 ? "next" : "later";
            return (
              <li
                key={i}
                className={cn(
                  "rounded-xl border p-3",
                  state === "current" && "border-primary bg-primary/5",
                  state === "next" && "border-dashed border-accent bg-accent/5",
                  state === "done" && "border-border/60 opacity-70",
                  state === "later" && "border-border/60"
                )}
              >
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {state === "current" ? t("stepCurrent") : state === "next" ? t("stepNext") : state === "done" ? t("stepDone") : `${i + 1}`}
                </p>
                <p className="text-sm font-semibold leading-snug">{L(step.title)}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{L(step.requirement)}</p>
              </li>
            );
          })}
        </ol>
        {passport.nextCareerStep && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              {t("nextAdvice", {
                step: L(passport.nextCareerStep.title),
                req: L(passport.nextCareerStep.requirement),
              })}
              {passport.gaps.length > 0 && ` ${t("nextAdviceGaps", { n: passport.gaps.length })}`}
            </span>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/kasblar/${profession.id}`}>{t("openStandard")}</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/tutor?agency=${agency}`}>{t("openTutor")}</Link>
          </Button>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">{t("disclaimer")}</p>
      </Card>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <div className="min-w-0">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function ChipList({ items, empty, tone }: { items: string[]; empty: string; tone: "good" | "gap" }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((x) => (
        <span
          key={x}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            tone === "good" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}
        >
          {x}
        </span>
      ))}
    </div>
  );
}

function Ring({ value }: { value: number | null }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const v = value ?? 0;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="hsl(41 88% 60%)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * v) / 100}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums">
        {value === null ? "—" : `${value}%`}
      </span>
    </div>
  );
}
