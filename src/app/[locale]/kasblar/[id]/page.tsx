import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Gamepad2,
  GraduationCap,
  Landmark,
  ListChecks,
  Route,
  TriangleAlert,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { ChainDiagram } from "@/components/kasb/ChainDiagram";
import { AGENCY_MAP, CLUSTER_MAP, PROFESSIONS, SUBJECT_MAP, getProfession } from "@/data/kasblar";
import { LAWS } from "@/data/sops/laws";
import { localized } from "@/data/sops/types";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => PROFESSIONS.map((p) => ({ locale, id: p.id })));
}

const TRAINER_META: Record<string, { key: string; icon: string }> = {
  "/simulyator/muloqot": { key: "muloqot", icon: "MessagesSquare" },
  "/simulyator/qaror": { key: "qaror", icon: "Scale" },
  "/simulyator/mahalla": { key: "mahalla", icon: "Home" },
  "/simulyator/hujjat": { key: "hujjat", icon: "FileText" },
  "/simulyator/tir": { key: "tir", icon: "Crosshair" },
  "/simulyator/imtihon": { key: "imtihon", icon: "GraduationCap" },
};

export default async function ProfessionPage(props: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await props.params;
  setRequestLocale(locale);
  const p = getProfession(id);
  if (!p) notFound();
  const t = await getTranslations("kasb");
  const L = (x: Parameters<typeof localized>[0]) => localized(x, locale);
  const primaryAgency = p.agencies[0];

  const nav = [
    ["functions", t("detail.functions")],
    ["competencies", t("detail.competencies")],
    ["levels", t("detail.levels")],
    ["education", t("detail.education")],
    ["legal", t("detail.legal")],
    ["career", t("detail.career")],
    ["clusters", t("detail.clusters")],
    ["trainers", t("detail.trainers")],
  ] as const;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <Link href="/kasblar" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        {t("detail.back")}
      </Link>

      {/* Hero */}
      <div className="brand-gradient mb-6 overflow-hidden rounded-2xl p-6 text-white md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Icon name={p.icon} className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{t("detail.eyebrow")}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-balance md:text-3xl">{L(p.title)}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">{L(p.short)}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.agencies.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs ring-1 ring-white/15">
                    <Icon name={AGENCY_MAP[a].icon} className="h-3 w-3" />
                    {L(AGENCY_MAP[a].title)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 md:flex-col">
            <Button asChild className="bg-white text-primary hover:bg-white/90">
              <Link href={`/kasb-simulyator?profession=${p.id}`}>
                <Gamepad2 className="h-4 w-4" />
                {t("detail.openSimulator")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/pasport">
                <BadgeCheck className="h-4 w-4" />
                {t("detail.openPassport")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <nav aria-label={t("detail.sections")} className="mb-6 flex flex-wrap gap-2">
        {nav.map(([anchor, label]) => (
          <a
            key={anchor}
            href={`#${anchor}`}
            className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-primary"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        {/* Labor functions */}
        <Section id="functions" icon={<ListChecks className="h-5 w-5" />} title={t("detail.functions")} subtitle={t("detail.functionsHint")}>
          <div className="grid gap-3 md:grid-cols-2">
            {p.functions.map((f, i) => (
              <div key={f.id} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                <p className="mb-2 flex items-start gap-2 font-semibold leading-snug">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  {L(f.title)}
                </p>
                <ul className="space-y-1.5 pl-8 text-sm text-muted-foreground">
                  {f.tasks.map((task, j) => (
                    <li key={j} className="list-disc leading-relaxed marker:text-primary/50">
                      {L(task)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Knowledge & skills */}
        <div className="grid gap-6 md:grid-cols-2">
          <Section icon={<GraduationCap className="h-5 w-5" />} title={t("detail.knowledge")}>
            <CheckList items={p.knowledge.map(L)} />
          </Section>
          <Section icon={<ClipboardCheck className="h-5 w-5" />} title={t("detail.skills")}>
            <CheckList items={p.skills.map(L)} />
          </Section>
        </div>

        {/* Competencies */}
        <Section id="competencies" icon={<Icon name="Target" className="h-5 w-5" />} title={t("detail.competencies")} subtitle={t("detail.competenciesHint")}>
          <div className="grid gap-3 md:grid-cols-2">
            {p.competencies.map((c) => (
              <div key={c.id} className="flex flex-col rounded-xl border border-border/70 p-4">
                <p className="font-semibold">{L(c.label)}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{L(c.description)}</p>
                <div className="mt-3 border-t border-border/60 pt-3">
                  <p className="label-eyebrow mb-1.5">{t("detail.trainedBy")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.subjects.map((s) => {
                      const sub = SUBJECT_MAP[s];
                      if (!sub) return null;
                      return (
                        <Link
                          key={s}
                          href={`/klasterlar#${sub.cluster}`}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/5 px-2 py-1 text-xs text-primary hover:bg-primary/10"
                        >
                          <Icon name={CLUSTER_MAP[sub.cluster].icon} className="h-3 w-3" />
                          {L(sub.title)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Levels */}
        <Section id="levels" icon={<Icon name="BarChart3" className="h-5 w-5" />} title={t("detail.levels")}>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {p.levels.map((lv) => (
              <li key={lv.level} className="rounded-xl border border-border/70 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex gap-0.5" aria-hidden>
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={cn("h-3.5 w-1.5 rounded-sm", n <= lv.level ? "bg-primary" : "bg-muted")} />
                    ))}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {lv.level}. {L(lv.title)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{L(lv.description)}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Education + practice */}
        <div id="education" className="grid scroll-mt-20 gap-6 md:grid-cols-2">
          <Section icon={<GraduationCap className="h-5 w-5" />} title={t("detail.education")}>
            <CheckList items={p.education.map(L)} />
          </Section>
          <Section icon={<Icon name="Workflow" className="h-5 w-5" />} title={t("detail.practice")}>
            <ol className="space-y-3">
              {p.practice.map((st, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{L(st.title)}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{L(st.description)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        {/* Legal basis + assessment */}
        <div id="legal" className="grid scroll-mt-20 gap-6 md:grid-cols-2">
          <Section icon={<Landmark className="h-5 w-5" />} title={t("detail.legal")} subtitle={t("detail.legalHint")}>
            <ul className="space-y-2">
              {p.legalBasis.map((lb, i) => {
                const law = lb.lawKey ? LAWS[lb.lawKey] : null;
                if (law) {
                  return (
                    <li key={i} className="rounded-lg border border-border/70 p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">
                          {law.code}
                          {"article" in law && law.article ? `, ${law.article}` : ""}
                        </span>
                        {law.verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                            <BadgeCheck className="h-3 w-3" />
                            {t("detail.verified")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent-foreground dark:text-accent">
                            <TriangleAlert className="h-3 w-3" />
                            {t("detail.verify")}
                          </span>
                        )}
                      </div>
                      {law.title && <p className="mt-1 text-muted-foreground">{law.title}</p>}
                      {law.url && (
                        <a href={law.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-primary hover:underline">
                          lex.uz ↗
                        </a>
                      )}
                    </li>
                  );
                }
                return lb.title ? (
                  <li key={i} className="rounded-lg border border-dashed border-border/80 p-3 text-sm">
                    <span className="font-semibold">{L(lb.title)}</span>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t("detail.actOnly")}</p>
                  </li>
                ) : null;
              })}
            </ul>
          </Section>
          <Section icon={<ClipboardCheck className="h-5 w-5" />} title={t("detail.assessment")}>
            <CheckList items={p.assessment.map(L)} />
          </Section>
        </div>

        {/* Career */}
        <Section id="career" icon={<Route className="h-5 w-5" />} title={t("detail.career")} subtitle={t("detail.careerHint")}>
          <ol className="relative grid gap-4 md:grid-cols-5">
            {p.career.map((c, i) => (
              <li key={i} className="relative flex gap-3 md:flex-col md:gap-2">
                <div className="flex flex-col items-center md:flex-row">
                  <span
                    className={cn(
                      "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      i === 0 ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                    )}
                  >
                    {i + 1}
                  </span>
                  {i < p.career.length - 1 && (
                    <span aria-hidden className="w-px flex-1 bg-border md:h-px md:w-full md:flex-1" />
                  )}
                </div>
                <div className="pb-2 md:pr-3">
                  <p className="text-sm font-semibold leading-snug">{L(c.title)}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{L(c.requirement)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Clusters */}
        <Section id="clusters" icon={<Icon name="Layers" className="h-5 w-5" />} title={t("detail.clusters")} subtitle={t("detail.clustersHint")}>
          <div className="grid gap-3 sm:grid-cols-2">
            {p.clusters.map((cid) => {
              const cl = CLUSTER_MAP[cid];
              const used = new Set(p.competencies.flatMap((c) => c.subjects));
              const subjects = cl.subjects.filter((s) => used.has(s.id));
              return (
                <Link key={cid} href={`/klasterlar#${cid}`} className="group block rounded-xl border border-border/70 p-4 transition-colors hover:border-primary/40">
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={cl.icon} className="h-4 w-4" />
                    </span>
                    {L(cl.title)}
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </p>
                  {subjects.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {subjects.map((s) => (
                        <li key={s.id} className="flex justify-between gap-2">
                          <span>{L(s.title)}</span>
                          {s.hours && <span className="shrink-0 tabular-nums text-xs">{t("hours", { n: s.hours })}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              );
            })}
          </div>
        </Section>

        {/* Trainers & simulators */}
        <Section id="trainers" icon={<Gamepad2 className="h-5 w-5" />} title={t("detail.trainers")} subtitle={t("detail.trainersHint")}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <TrainerLink
              href={`/kasb-simulyator?profession=${p.id}`}
              icon={<Gamepad2 className="h-5 w-5" />}
              title={t("detail.profSim")}
              desc={t("detail.profSimDesc")}
              primary
            />
            <TrainerLink
              href={`/tutor?agency=${primaryAgency}`}
              icon={<Bot className="h-5 w-5" />}
              title={t("detail.tutor")}
              desc={t("detail.tutorDesc", { agency: L(AGENCY_MAP[primaryAgency].short) })}
            />
            {p.trainers.map((href) => {
              const meta = TRAINER_META[href];
              if (!meta) return null;
              return (
                <TrainerLink
                  key={href}
                  href={href}
                  icon={<Icon name={meta.icon} className="h-5 w-5" />}
                  title={t(`trainers.${meta.key}`)}
                  desc={t("detail.platformTrainer")}
                />
              );
            })}
          </div>
        </Section>

        <ChainDiagram variant="compact" className="pt-2" />
      </div>
    </div>
  );
}

function Section({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-20 p-5 md:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((x, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

function TrainerLink({
  href,
  icon,
  title,
  desc,
  primary,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-start gap-3 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
        primary ? "border-primary/40 bg-primary/5" : "border-border/70 hover:border-primary/40"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          primary ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-sm font-semibold">
          {title}
          <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{desc}</span>
      </span>
    </Link>
  );
}
