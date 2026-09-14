import { getTranslations } from "next-intl/server";
import { FeatureCard } from "@/components/dashboard/FeatureCard";

export const TRAINERS = [
  { key: "dialog", href: "/simulyator/muloqot", icon: "MessageSquareWarning" },
  { key: "decision", href: "/simulyator/qaror", icon: "Gauge" },
  { key: "mahalla", href: "/simulyator/mahalla", icon: "MapPinned" },
  { key: "exam", href: "/simulyator/imtihon", icon: "GraduationCap" },
] as const;

export async function TrainersGrid() {
  const t = await getTranslations("sim.hub");
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {TRAINERS.map((tr) => (
        <FeatureCard
          key={tr.key}
          href={tr.href}
          icon={tr.icon}
          title={t(`${tr.key}.title`)}
          description={t(`${tr.key}.desc`)}
        />
      ))}
    </div>
  );
}
