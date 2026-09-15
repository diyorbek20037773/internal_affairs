"use client";

import { useTranslations } from "next-intl";
import { IdCard, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";

/** Shows a "fill in your profile" banner until a local trainee profile exists. */
export function ProfileGate() {
  const t = useTranslations("dashboard");
  const ta = useTranslations("sim.auth");
  const { profile, loaded, authRequired } = useTraineeProfile();
  if (!loaded || profile) return null;
  return (
    <Card className="flex flex-col items-start gap-4 border-accent/40 bg-accent/5 p-5 sm:flex-row sm:items-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <IdCard className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{authRequired ? ta("login") : t("setupProfile")}</p>
        <p className="text-sm text-muted-foreground">{authRequired ? ta("introShort") : t("setupProfileDesc")}</p>
      </div>
      <Button asChild>
        <Link href="/profil">
          {authRequired ? ta("login") : t("setupProfileCta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}
