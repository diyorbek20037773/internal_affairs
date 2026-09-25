import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { KasbSimClient } from "@/components/kasb-sim/KasbSimClient";
import { ALL_SIMS, getSim } from "@/data/kasblar/sims";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => ALL_SIMS.map((s) => ({ locale, simId: s.id })));
}

export default async function KasbSimPage(props: { params: Promise<{ locale: string; simId: string }> }) {
  const { locale, simId } = await props.params;
  setRequestLocale(locale);
  const sim = getSim(simId);
  if (!sim) notFound();
  return (
    <div className="mx-auto max-w-7xl p-3 md:p-6">
      <KasbSimClient sim={sim} />
    </div>
  );
}
