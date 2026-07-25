"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";

export function KeysBanner() {
  const tc = useTranslations("common");
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => {
        if (active && typeof d?.keysConfigured === "number") {
          setMissing(d.keysConfigured === 0);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!missing) return null;

  return (
    <div className="mb-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-foreground">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <span>{tc("keysSetupHint")}</span>
    </div>
  );
}
