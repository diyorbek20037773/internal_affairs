import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { KeysBanner } from "@/components/chat/KeysBanner";
import { MahallaClient } from "@/components/training/mahalla/MahallaClient";
import { MAHALLA_SCENARIOS } from "@/data/scenarios/mahalla";
import { getMahallaScenario } from "@/data/scenarios";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    MAHALLA_SCENARIOS.map((s) => ({ locale, scenarioId: s.id }))
  );
}

export default function MahallaScenarioPage({
  params,
  searchParams,
}: {
  params: { locale: string; scenarioId: string };
  searchParams: { session?: string; exam?: string; stage?: string };
}) {
  setRequestLocale(params.locale);
  const scenario = getMahallaScenario(params.scenarioId);
  if (!scenario) notFound();

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <KeysBanner />
      <MahallaClient scenario={scenario} sessionId={searchParams.session}
          exam={
            searchParams.exam && searchParams.stage !== undefined
              ? { examId: searchParams.exam, examStageIndex: Number(searchParams.stage) }
              : undefined
          }
        />
    </div>
  );
}
