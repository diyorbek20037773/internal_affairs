import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChainDiagram } from "@/components/kasb/ChainDiagram";
import { ProfessionsExplorer } from "@/components/kasb/ProfessionsExplorer";
import { AGENCIES, CLUSTERS, PROFESSIONS, allCompetencies } from "@/data/kasblar";
import type { AgencyId } from "@/data/kasblar/types";

export default async function KasblarPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ agency?: string }>;
}) {
  const { locale } = await props.params;
  const sp = await props.searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("kasb");
  const initialAgency = AGENCIES.some((a) => a.id === sp.agency) ? (sp.agency as AgencyId) : null;

  const stats = [
    { value: AGENCIES.length, label: t("stats.agencies") },
    { value: PROFESSIONS.length, label: t("stats.professions") },
    { value: Object.keys(allCompetencies).length, label: t("stats.competencies") },
    { value: CLUSTERS.length, label: t("stats.clusters") },
    { value: CLUSTERS.reduce((n, c) => n + c.subjects.length, 0), label: t("stats.subjects") },
  ];

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader
        title={t("list.title")}
        subtitle={t("list.subtitle")}
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/klasterlar">{t("nav.clusters")}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/pasport">
                {t("nav.passport")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        }
      />

      <ChainDiagram variant="full" className="mb-6" />

      <dl className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card p-3 text-center shadow-card">
            <dt className="order-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{s.label}</dt>
            <dd className="text-2xl font-bold tabular-nums text-primary">{s.value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mb-1 text-lg font-semibold tracking-tight">{t("list.gridTitle")}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{t("list.gridSubtitle")}</p>
      <ProfessionsExplorer initialAgency={initialAgency} />
    </div>
  );
}
