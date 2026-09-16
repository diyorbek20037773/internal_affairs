import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { KeysBanner } from "@/components/chat/KeysBanner";
import { DialogSimClient } from "@/components/training/dialog/DialogSimClient";
import { DIALOG_SCENARIOS } from "@/data/scenarios/dialog";
import { getDialogScenario } from "@/data/scenarios";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DIALOG_SCENARIOS.map((s) => ({ locale, scenarioId: s.id }))
  );
}

export default async function MuloqotScenarioPage(
  props: {
    params: Promise<{ locale: string; scenarioId: string }>;
    searchParams: Promise<{ session?: string; exam?: string; stage?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setRequestLocale(params.locale);
  const scenario = getDialogScenario(params.scenarioId);
  if (!scenario) notFound();

  return (
    <div className="flex h-full flex-col p-3 md:p-4">
      <KeysBanner />
      <div className="min-h-0 flex-1">
        <DialogSimClient scenario={scenario} sessionId={searchParams.session}
          exam={
            searchParams.exam && searchParams.stage !== undefined
              ? { examId: searchParams.exam, examStageIndex: Number(searchParams.stage) }
              : undefined
          }
        />
      </div>
    </div>
  );
}
