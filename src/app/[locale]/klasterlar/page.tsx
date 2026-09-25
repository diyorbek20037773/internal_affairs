import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, ClipboardCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { ChainDiagram } from "@/components/kasb/ChainDiagram";
import { CLUSTERS, PROFESSIONS, professionsOfCluster } from "@/data/kasblar";
import type { Subject } from "@/data/kasblar/types";
import { localized, type LocalizedText } from "@/data/sops/types";
import { cn } from "@/lib/utils";

const KIND_STYLE: Record<Subject["kind"], string> = {
  nazariy: "bg-muted text-muted-foreground",
  amaliy: "bg-primary/10 text-primary",
  simulyatsion: "bg-accent/15 text-accent-foreground dark:text-accent",
};

export default async function KlasterlarPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("kasb");
  const L = (x: LocalizedText) => localized(x, locale);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("clusters.title")} subtitle={t("clusters.subtitle")} />

      <ChainDiagram variant="compact" className="mb-6" />

      {/* Linkage explainer */}
      <Card className="mb-6 p-5">
        <p className="label-eyebrow mb-3">{t("clusters.linkTitle")}</p>
        <ol className="grid gap-2 sm:grid-cols-4">
          {(["profession", "competency", "subject", "practice"] as const).map((k, i) => (
            <li key={k} className="relative flex items-start gap-2 rounded-lg bg-muted/50 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-semibold">{t(`clusters.link.${k}`)}</span>
                <span className="block text-xs leading-relaxed text-muted-foreground">{t(`clusters.link.${k}Hint`)}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <nav aria-label={t("clusters.title")} className="mb-6 flex flex-wrap gap-2">
        {CLUSTERS.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-primary"
          >
            <Icon name={c.icon} className="h-3.5 w-3.5" />
            {L(c.title)}
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        {CLUSTERS.map((c, ci) => {
          const profs = professionsOfCluster(c.id);
          const hours = c.subjects.reduce((n, s) => n + (s.hours ?? 0), 0);
          // Profession → competencies trained by this cluster's subjects.
          const links = profs
            .map((p) => ({
              p,
              comps: p.competencies
                .map((comp) => ({ comp, subs: comp.subjects.filter((s) => c.subjects.some((x) => x.id === s)) }))
                .filter((x) => x.subs.length > 0),
            }))
            .filter((x) => x.comps.length > 0);
          return (
            <Card key={c.id} id={c.id} className="scroll-mt-20 overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/30 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("clusters.clusterN", { n: ci + 1 })}
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight">{L(c.title)}</h3>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{L(c.description)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold tabular-nums text-primary">{c.subjects.length}</p>
                    <p className="text-[11px] text-muted-foreground">{t("clusters.subjects")}</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums text-primary">{hours}</p>
                    <p className="text-[11px] text-muted-foreground">{t("clusters.hoursTotal")}</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums text-primary">{profs.length}</p>
                    <p className="text-[11px] text-muted-foreground">{t("clusters.professions")}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-5">
                {/* Subjects */}
                <div className="lg:col-span-3">
                  <p className="label-eyebrow mb-2">{t("clusters.subjectsTitle")}</p>
                  <ul className="divide-y divide-border/60 rounded-lg border border-border/70">
                    {c.subjects.map((s) => (
                      <li key={s.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                        <span className="w-14 shrink-0 font-mono text-[11px] text-muted-foreground">{s.id}</span>
                        <span className="min-w-0 flex-1">{L(s.title)}</span>
                        <span className={cn("hidden shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium sm:inline", KIND_STYLE[s.kind])}>
                          {t(`kind.${s.kind}`)}
                        </span>
                        {s.hours && <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{t("hours", { n: s.hours })}</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practice */}
                <div className="lg:col-span-2">
                  <p className="label-eyebrow mb-2">{t("clusters.practiceTitle")}</p>
                  <ul className="space-y-2">
                    {c.practice.map((pr, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed">
                        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                        {L(pr)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Profession → competency → subject linkage */}
              <div className="border-t border-border/60 p-5">
                <p className="label-eyebrow mb-3">{t("clusters.whoUses")}</p>
                <ul className="space-y-2.5">
                  {links.map(({ p, comps }) => (
                    <li key={p.id} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
                      <Link
                        href={`/kasblar/${p.id}`}
                        className="inline-flex w-fit shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary sm:w-56"
                      >
                        <Icon name={p.icon} className="h-4 w-4 text-primary" />
                        {L(p.title)}
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                      <div className="flex flex-wrap gap-1.5">
                        {comps.map(({ comp, subs }) => (
                          <span
                            key={comp.id}
                            title={subs.join(", ")}
                            className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-card px-2 py-0.5 text-xs"
                          >
                            {L(comp.label)}
                            <span className="font-mono text-[10px] text-muted-foreground">{subs.join(" · ")}</span>
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Matrix */}
      <Card className="mt-8 p-5">
        <h3 className="font-semibold tracking-tight">{t("clusters.matrixTitle")}</h3>
        <p className="mb-4 mt-0.5 text-sm text-muted-foreground">{t("clusters.matrixHint")}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left font-medium text-muted-foreground">{t("clusters.profession")}</th>
                {CLUSTERS.map((c) => (
                  <th key={c.id} className="p-2 text-center font-medium text-muted-foreground" title={L(c.title)}>
                    <span className="flex flex-col items-center gap-1">
                      <Icon name={c.icon} className="h-4 w-4 text-primary" />
                      <span className="max-w-[88px] leading-tight">{L(c.title)}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROFESSIONS.map((p) => (
                <tr key={p.id} className="border-t border-border/60">
                  <td className="p-2">
                    <Link href={`/kasblar/${p.id}`} className="font-medium hover:text-primary">
                      {L(p.title)}
                    </Link>
                  </td>
                  {CLUSTERS.map((c) => {
                    const n = p.competencies.filter((comp) => comp.clusters.includes(c.id)).length;
                    const on = p.clusters.includes(c.id);
                    return (
                      <td key={c.id} className="p-2 text-center">
                        {on ? (
                          <span
                            className={cn(
                              "inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md px-1 font-semibold",
                              n >= 3 ? "bg-primary text-primary-foreground" : n > 0 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            )}
                            title={t("clusters.cellHint", { n })}
                          >
                            {n > 0 ? n : <Check className="h-3.5 w-3.5" />}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
