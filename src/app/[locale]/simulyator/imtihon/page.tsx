import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExamClient } from "@/components/training/exam/ExamClient";
import { EXAM_SCENARIOS } from "@/data/scenarios";

export default async function ImtihonPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.exam");
  const exam = EXAM_SCENARIOS[0];
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ExamClient exam={exam} />
    </div>
  );
}
