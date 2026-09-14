import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { KeysBanner } from "@/components/chat/KeysBanner";
import { DocumentClient } from "@/components/training/document/DocumentClient";
import { DOCUMENT_SCENARIOS } from "@/data/scenarios/document";
import { getDocumentScenario } from "@/data/scenarios";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DOCUMENT_SCENARIOS.map((s) => ({ locale, scenarioId: s.id }))
  );
}

export default function HujjatScenarioPage({
  params,
  searchParams,
}: {
  params: { locale: string; scenarioId: string };
  searchParams: { session?: string; exam?: string; stage?: string };
}) {
  setRequestLocale(params.locale);
  const scenario = getDocumentScenario(params.scenarioId);
  if (!scenario) notFound();

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <KeysBanner />
      <DocumentClient
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
