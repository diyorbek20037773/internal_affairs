"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Route-level error boundary: a crashed page shows a recoverable card instead of Next's blank "Application error". */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("common");
  useEffect(() => {
    console.error("[h360] page error", error);
  }, [error]);
  return (
    <div className="mx-auto max-w-lg p-6 md:p-10">
      <Card className="space-y-4 p-6 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
        <h2 className="text-lg font-bold">{t("pageErrorTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("pageErrorDesc")}</p>
        {error.digest && <p className="font-mono text-[11px] text-muted-foreground/70">ID: {error.digest}</p>}
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={reset}><RotateCcw className="h-4 w-4" /> {t("retry")}</Button>
          <Button variant="outline" onClick={() => { window.location.href = "/"; }}><Home className="h-4 w-4" /> {t("goHome")}</Button>
        </div>
      </Card>
    </div>
  );
}
