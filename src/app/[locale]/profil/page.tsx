import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileForm } from "@/components/training/profile/ProfileForm";

export default async function ProfilPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.profile");
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ProfileForm />
    </div>
  );
}
