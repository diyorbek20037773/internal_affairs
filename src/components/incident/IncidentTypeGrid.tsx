"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { INCIDENT_TYPES, INCIDENT_ICON } from "@/types/incident";

export function IncidentTypeGrid() {
  const t = useTranslations("incidentTypes");
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {INCIDENT_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => router.push(`/inspektor?type=${type}`)}
          className="group text-left"
        >
          <Card className="flex h-full flex-col items-start gap-3 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)] transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
              <Icon name={INCIDENT_ICON[type]} className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium leading-tight">{t(type)}</span>
          </Card>
        </button>
      ))}
    </div>
  );
}
