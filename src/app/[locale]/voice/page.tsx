import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { VoiceClient } from "@/components/voice/VoiceClient";

export default async function VoicePage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("voice");

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <VoiceClient />
    </div>
  );
}
