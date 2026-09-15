"use client";

import { useTranslations } from "next-intl";
import { IdCard, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";

/** Shows a "fill in your profile" banner until a local trainee profile exists. */
export function ProfileGate() {
  const t = useTranslations("dashboard");
  const ta = useTranslations("sim.auth");
  const { profile, loaded, authRequired } = useTraineeProfile();
  if (!loaded || profile) return null;
  return (
    <Link href="/profil" className="group block">
      <Card className="flex items-center gap-4 border-accent/40 bg-accent/5 p-4 transition-all hover:border-accent hover:shadow-card-hover">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <IdCard className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{authRequired ? ta("login") : t("setupProfile")}</p>
          <p className="text-sm text-muted-foreground">{authRequired ? ta("intro") : t("setupProfileDesc")}</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
      </Card>
    </Link>
  );
}
