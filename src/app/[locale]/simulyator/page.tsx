import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrainersGrid } from "@/components/training/TrainersGrid";
import { MentorCard } from "@/components/training/profile/MentorCard";
import { ProfileGate } from "@/components/training/profile/ProfileGate";
import { validateScenarioGraph } from "@/data/scenarios";

export default async function SimulyatorPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.hub");
  const problems = process.env.NODE_ENV !== "production" ? validateScenarioGraph() : [];

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {problems.length > 0 && (
        <pre className="mb-6 overflow-x-auto rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          {t("graphProblems")}:{"\n"}
          {problems.join("\n")}
        </pre>
      )}
      <div className="mb-6">
        <ProfileGate />
      </div>
      <TrainersGrid />
      <div className="mt-8">
        <MentorCard />
      </div>
    </div>
  );
}
