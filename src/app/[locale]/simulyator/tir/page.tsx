import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScenarioGrid } from "@/components/training/ScenarioGrid";
import { TIR_SCENARIOS } from "@/data/scenarios/tir";

export default async function TirPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.hub");
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("tir.title")} subtitle={t("tir.desc")} />
      <ScenarioGrid scenarios={TIR_SCENARIOS} basePath="/simulyator/tir" />
    </div>
  );
}
