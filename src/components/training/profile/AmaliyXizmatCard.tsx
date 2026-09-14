"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Briefcase, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { localCasesRepo } from "@/lib/storage/cases";
import { localTrainingRepo } from "@/lib/storage/training";
import { applyKpiToHimoyaId, newHimoyaId } from "@/lib/training/competency";
import type { TraineeProfile } from "@/lib/storage/trainingSchema";

function daysAgo(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

/**
 * AMALIY XIZMAT — 30–90 kunlik natija (pptx slide 2, stage 6). Pulls real
 * service activity from the "Mening Inspektorim" module (cases on this device)
 * and lets an instructor record a KPI score into HIMOYA-ID → natijadorlik.
 */
export function AmaliyXizmatCard({
  profile,
  isInstructor,
  onUpdated,
}: {
  profile: TraineeProfile;
  isInstructor: boolean;
  onUpdated?: () => void;
}) {
  const t = useTranslations("sim.kpi");
  const [stats, setStats] = useState({ d30: 0, d90: 0, done90: 0, steps90: 0 });
  const [kpi, setKpi] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cases = localCasesRepo.list();
    const in90 = cases.filter((c) => daysAgo(c.createdAt) <= 90);
    setStats({
      d30: cases.filter((c) => daysAgo(c.createdAt) <= 30).length,
      d90: in90.length,
      done90: in90.filter((c) => c.workflow.progressPct >= 100).length,
      steps90: in90.reduce((a, c) => a + c.workflow.completedStepIds.length, 0),
    });
  }, []);

  const save = async () => {
    const v = Number(kpi);
    if (!Number.isFinite(v) || v < 0 || v > 100) return;
    setSaving(true);
    try {
      const cur = (await localTrainingRepo.getHimoyaId(profile.id)) ?? newHimoyaId(profile.id);
      await localTrainingRepo.saveHimoyaId(applyKpiToHimoyaId(cur, v));
      setKpi("");
      toast.success(t("saved"));
      onUpdated?.();
    } finally {
      setSaving(false);
    }
  };

  const autoKpi = stats.d90 ? Math.round((stats.done90 / stats.d90) * 100) : null;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("title")}</p>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t("cases30")} value={stats.d30} />
        <Stat label={t("cases90")} value={stats.d90} />
        <Stat label={t("done90")} value={stats.done90} />
        <Stat label={t("steps90")} value={stats.steps90} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <TrendingUp className="h-4 w-4 text-success" />
        <span className="text-muted-foreground">{t("autoKpi")}:</span>
        <Badge variant={autoKpi == null ? "outline" : autoKpi >= 70 ? "success" : "accent"}>{autoKpi == null ? "—" : `${autoKpi}%`}</Badge>
      </div>
      {isInstructor && (
        <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center">
          <label className="text-sm font-medium">{t("enter")}</label>
          <Input
            type="number"
            min={0}
            max={100}
            value={kpi}
            onChange={(e) => setKpi(e.target.value)}
            placeholder={autoKpi != null ? String(autoKpi) : "0–100"}
            className="sm:w-32"
          />
          <Button size="sm" onClick={() => void save()} disabled={saving || kpi === ""}>
            {t("save")}
          </Button>
        </div>
      )}
      <p className="mt-3 text-xs italic text-muted-foreground">{t("note")}</p>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
