"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { History } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { localized } from "@/data/sops/types";
import type { KasbSimResult } from "@/data/kasblar/types";
import { getSim } from "@/data/kasblar/sims";
import { kasbRepo } from "@/lib/storage/kasb";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { cn } from "@/lib/utils";

/** The trainee's latest profession-simulator runs (local-first via kasbRepo). */
export function KasbRecentResults({ limit = 6 }: { limit?: number }) {
  const t = useTranslations("kasbsim.hub");
  const locale = useLocale();
  const { profile, loaded } = useTraineeProfile();
  const [rows, setRows] = useState<KasbSimResult[]>([]);

  useEffect(() => {
    if (!profile) return;
    const load = () => void kasbRepo.listResults(profile.id).then((r) => setRows(r.slice(0, limit)));
    load();
    window.addEventListener(kasbRepo.CHANGE_EVENT, load);
    return () => window.removeEventListener(kasbRepo.CHANGE_EVENT, load);
  }, [profile, limit]);

  if (!loaded || !profile) return null;

  return (
    <Card className="p-5">
      <h3 className="mb-3 flex items-center gap-2 font-bold">
        <History className="h-4 w-4 text-primary" /> {t("recent")}
      </h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noRecent")}</p>
      ) : (
        <ul className="divide-y">
          {rows.map((r) => {
            const sim = getSim(r.simId);
            const done = !!r.finishedAt;
            const score = done ? r.total ?? 0 : null;
            return (
              <li key={r.id}>
                <Link href={`/kasb-simulyator/${r.simId}`} className="flex min-h-12 items-center gap-3 py-2 text-sm hover:bg-muted/40">
                  <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">{sim?.code ?? "—"}</span>
                  <span className="min-w-0 flex-1 truncate">{sim ? localized(sim.title, locale) : r.simId}</span>
                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                    {new Date(r.finishedAt ?? r.startedAt).toLocaleDateString(locale === "en" ? "en-GB" : "ru-RU")}
                  </span>
                  <b
                    className={cn(
                      "w-20 shrink-0 text-right tabular-nums",
                      score === null ? "text-muted-foreground" : score >= 75 ? "text-success" : score >= 50 ? "text-accent" : "text-destructive"
                    )}
                  >
                    {score === null ? t("inProgress", { n: r.stages.length, total: sim?.stages.length ?? 0 }) : `${score}%`}
                  </b>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
