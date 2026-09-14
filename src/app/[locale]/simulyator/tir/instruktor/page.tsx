import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { InstructorStation } from "@/components/training/tir/InstructorStation";

export const dynamic = "force-dynamic";

export default async function TirInstructorPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session?: string; scenario?: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.tir");
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <PageHeader title={t("instructor")} subtitle={t("ins.hint")} />
      {searchParams.session && searchParams.scenario ? (
        <InstructorStation sessionId={searchParams.session} scenarioId={searchParams.scenario} />
      ) : (
        <p className="text-sm text-muted-foreground">?session=…&scenario=…</p>
      )}
    </div>
  );
}
