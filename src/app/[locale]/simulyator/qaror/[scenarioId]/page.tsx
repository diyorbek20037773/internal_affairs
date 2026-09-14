import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DecisionSimClient } from "@/components/training/decision/DecisionSimClient";
import { DECISION_SCENARIOS } from "@/data/scenarios/decision";
import { getDecisionScenario } from "@/data/scenarios";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DECISION_SCENARIOS.map((s) => ({ locale, scenarioId: s.id }))
  );
}

export default function QarorScenarioPage({
  params,
  searchParams,
}: {
  params: { locale: string; scenarioId: string };
  searchParams: { session?: string; exam?: string; stage?: string };
}) {
  setRequestLocale(params.locale);
  const scenario = getDecisionScenario(params.scenarioId);
  if (!scenario) notFound();

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <DecisionSimClient scenario={scenario} sessionId={searchParams.session}
          exam={
            searchParams.exam && searchParams.stage !== undefined
              ? { examId: searchParams.exam, examStageIndex: Number(searchParams.stage) }
              : undefined
          }
        />
    </div>
  );
}
