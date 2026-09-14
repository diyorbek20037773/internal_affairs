import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { SessionsClient } from "@/components/training/SessionsClient";

export default async function MashgulotlarimPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.sessions");
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <SessionsClient />
    </div>
  );
}
