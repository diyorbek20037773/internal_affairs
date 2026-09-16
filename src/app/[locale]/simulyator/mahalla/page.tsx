import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScenarioGrid } from "@/components/training/ScenarioGrid";
import { MAHALLA_SCENARIOS } from "@/data/scenarios/mahalla";

export default async function MahallaPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.hub");
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("mahalla.title")} subtitle={t("mahalla.desc")} />
      <ScenarioGrid scenarios={MAHALLA_SCENARIOS} basePath="/simulyator/mahalla" />
    </div>
  );
}
