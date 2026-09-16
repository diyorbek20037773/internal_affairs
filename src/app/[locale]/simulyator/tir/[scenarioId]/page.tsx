import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { KeysBanner } from "@/components/chat/KeysBanner";
import { TirClient } from "@/components/training/tir/TirClient";
import { TIR_SCENARIOS } from "@/data/scenarios/tir";
import { getTirScenario } from "@/data/scenarios";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => TIR_SCENARIOS.map((s) => ({ locale, scenarioId: s.id })));
}

export default async function TirScenarioPage(
  props: {
    params: Promise<{ locale: string; scenarioId: string }>;
    searchParams: Promise<{ session?: string; exam?: string; stage?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setRequestLocale(params.locale);
  const scenario = getTirScenario(params.scenarioId);
  if (!scenario) notFound();

  return (
    <div className="mx-auto max-w-[1600px] p-3 md:p-5">
      <KeysBanner />
      <TirClient
        scenario={scenario}
        sessionId={searchParams.session}
        exam={
          searchParams.exam && searchParams.stage !== undefined
            ? { examId: searchParams.exam, examStageIndex: Number(searchParams.stage) }
            : undefined
        }
      />
    </div>
  );
}
