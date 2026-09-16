import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScenarioGrid } from "@/components/training/ScenarioGrid";
import { DIALOG_SCENARIOS } from "@/data/scenarios/dialog";

export default async function MuloqotPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.hub");
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("dialog.title")} subtitle={t("dialog.desc")} />
      <ScenarioGrid scenarios={DIALOG_SCENARIOS} basePath="/simulyator/muloqot" />
    </div>
  );
}
