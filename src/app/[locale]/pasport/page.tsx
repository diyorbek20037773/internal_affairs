import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { PassportClient } from "@/components/kasb/PassportClient";
import { ChainDiagram } from "@/components/kasb/ChainDiagram";

export default async function PasportPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("kasb.passport");

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ChainDiagram variant="compact" className="mb-6" />
      <PassportClient />
    </div>
  );
}
