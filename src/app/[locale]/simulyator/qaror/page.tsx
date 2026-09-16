import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScenarioGrid } from "@/components/training/ScenarioGrid";
import { DECISION_SCENARIOS } from "@/data/scenarios/decision";

export default async function QarorPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.hub");
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("decision.title")} subtitle={t("decision.desc")} />
      <ScenarioGrid scenarios={DECISION_SCENARIOS} basePath="/simulyator/qaror" />
    </div>
  );
}
