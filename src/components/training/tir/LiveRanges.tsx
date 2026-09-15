"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Radio, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTirScenario } from "@/data/scenarios";
import { localized } from "@/data/sops/types";
import type { LiveRange } from "@/lib/tir/relayStore";

/** Ranges currently reporting to the server relay — pick one to open its instructor station on this device. */
export function LiveRanges() {
  const t = useTranslations("sim.tir");
  const locale = useLocale();
  const [items, setItems] = useState<LiveRange[] | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        const r = await fetch("/api/tir/station?list=1", { cache: "no-store" });
        if (r.status === 401 || r.status === 403) { setDenied(true); return; }
        if (r.ok) setItems(((await r.json()) as { items: LiveRange[] }).items);
      } catch {
        /* offline */
      }
      if (!stop) window.setTimeout(() => void tick(), 3000);
    };
    void tick();
    return () => { stop = true; };
  }, []);

  if (denied) return null;
  return (
    <Card className="mb-4 p-4" data-testid="live-ranges">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Radio className="h-3.5 w-3.5 text-accent" /> {t("ins.live")}
      </p>
      {!items || items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("ins.liveEmpty")}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => {
            const sc = r.scenarioId ? getTirScenario(r.scenarioId) : undefined;
            return (
              <li key={r.sessionId} className="flex flex-wrap items-center gap-2 rounded-lg border p-2 text-sm" data-testid="live-range">
                <span className="min-w-0 flex-1 truncate font-medium">{sc ? `${sc.code} — ${localized(sc.title, locale)}` : r.scenarioId ?? r.sessionId}</span>
                <Badge variant={r.lastSeen < 5000 ? "success" : "outline"}>{Math.round(r.lastSeen / 1000)} s</Badge>
                {r.stationSeen >= 0 && r.stationSeen < 10000 && <Badge variant="secondary">{t("ins.stationBusy")}</Badge>}
                <Button asChild size="sm" className="h-9">
                  <Link href={`/simulyator/tir/instruktor?session=${encodeURIComponent(r.sessionId)}&scenario=${encodeURIComponent(r.scenarioId ?? "")}`}>
                    {t("ins.open")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
