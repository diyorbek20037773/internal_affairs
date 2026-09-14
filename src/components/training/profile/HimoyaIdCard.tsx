"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMPETENCIES, type Competency } from "@/data/scenarios/competencies";
import { strengthsAndGaps } from "@/lib/training/competency";
import type { HimoyaId, TraineeProfile } from "@/lib/storage/trainingSchema";
import { CompetencyRadar } from "@/components/training/debrief/CompetencyRadar";
import { cn } from "@/lib/utils";

export function HimoyaIdCard({
  profile,
  himoyaId,
}: {
  profile: TraineeProfile | null;
  himoyaId: HimoyaId | undefined;
}) {
  const t = useTranslations("sim.himoyaId");
  const tk = useTranslations("sim.competencies");

  const rated = himoyaId ? COMPETENCIES.filter((c) => (himoyaId.samples[c] ?? 0) > 0) : [];
  const { strengths, gaps } = himoyaId ? strengthsAndGaps(himoyaId) : { strengths: [], gaps: [] };

  return (
    <Card className="overflow-hidden">
      <div className="brand-gradient p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{t("title")}</p>
            <p className="mt-1 truncate text-lg font-bold">{profile?.name ?? "—"}</p>
            <p className="truncate text-sm text-white/75">
              {[profile?.badgeId, profile?.rank, profile?.district].filter(Boolean).join(" • ")}
            </p>
          </div>
          {profile && (
            <Badge variant="accent" className="shrink-0 font-mono">
              {profile.badgeId}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>

        {!himoyaId || rated.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="mt-4 grid gap-6 md:grid-cols-[220px_1fr]">
            <CompetencyRadar scores={himoyaId.scores} rated={rated} />
            <div className="space-y-4">
              <ScoreList title={t("strengths")} items={strengths} himoyaId={himoyaId} tk={tk} tone="good" samplesLabel={t("samples")} />
              <ScoreList title={t("develop")} items={gaps} himoyaId={himoyaId} tk={tk} tone="bad" samplesLabel={t("samples")} />
            </div>
          </div>
        )}

        {himoyaId && himoyaId.history.some((h) => h.provisional) && (
          <p className="mt-3 rounded-md bg-accent/10 px-3 py-1.5 text-center text-xs text-accent-foreground">
            {t("provisional", { n: himoyaId.history.filter((h) => h.provisional).length })}
          </p>
        )}
        <p className="mt-5 text-center text-xs italic text-muted-foreground">{t("question")}</p>
      </div>
    </Card>
  );
}

function ScoreList({
  title,
  items,
  himoyaId,
  tk,
  tone,
  samplesLabel,
}: {
  title: string;
  items: Competency[];
  himoyaId: HimoyaId;
  tk: (k: string) => string;
  tone: "good" | "bad";
  samplesLabel: string;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <ul className="space-y-2">
        {items.map((c) => {
          const v = himoyaId.scores[c];
          return (
            <li key={c} className="text-sm">
              <div className="flex items-center justify-between gap-2">
                <span>{tk(c)}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {v}% · {himoyaId.samples[c]} {samplesLabel}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn("h-full rounded-full", tone === "good" ? "bg-success" : "bg-accent")}
                  style={{ width: `${v}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
