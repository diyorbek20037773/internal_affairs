import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScenarioGrid } from "@/components/training/ScenarioGrid";
import { DOCUMENT_SCENARIOS } from "@/data/scenarios/document";

export default async function HujjatPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.hub");
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("document.title")} subtitle={t("document.desc")} />
      <ScenarioGrid scenarios={DOCUMENT_SCENARIOS} basePath="/simulyator/hujjat" />
    </div>
  );
}
