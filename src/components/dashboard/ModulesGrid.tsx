"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface ModuleDef {
  key: string;
  icon: string;
  /** Internal route when the module exists in Huquqni muhofaza qilish ta'lim klasteri. */
  href?: string;
}

/**
 * Service modules of the real "Mening Inspektorim" / E-patrul tablet app.
 * Shown as an integration map, not as buttons: only modules with `href`
 * are clickable; the rest are labelled as integration targets.
 */
const MODULES: ModuleDef[] = [
  { key: "profilaktik_suhbat", icon: "MessagesSquare", href: "/inspektor" },
  { key: "epatrul", icon: "ShieldCheck" },
  { key: "shakl17", icon: "FileText" },
  { key: "vaqtinchalik", icon: "MapPin" },
  { key: "eprobatsiya", icon: "ClipboardCheck" },
  { key: "qalqon", icon: "MessageCircle" },
  { key: "ijtimoiy", icon: "Users" },
  { key: "migratsion", icon: "Plane" },
  { key: "raqamli_mahalla", icon: "Building2" },
  { key: "xarita", icon: "Map" },
  { key: "yuz_qidiruv", icon: "ScanFace" },
  { key: "murojaatlar", icon: "Inbox" },
];

export function ModulesGrid() {
  const t = useTranslations("modules");

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {MODULES.map((m) => {
        const body = (
          <Card
            className={cn(
              "flex h-full items-center gap-3 p-3",
              m.href ? "transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover" : "border-dashed bg-muted/30 shadow-none"
            )}
          >
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", m.href ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
              <Icon name={m.icon} className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className={cn("truncate text-sm leading-tight", m.href ? "font-medium" : "text-muted-foreground")}>{t(m.key)}</p>
              <Badge variant={m.href ? "success" : "outline"} className="mt-1 text-[10px]">
                {m.href ? t("available") : t("planned")}
              </Badge>
            </div>
          </Card>
        );
        return m.href ? (
          <Link key={m.key} href={m.href} className="block">
            {body}
          </Link>
        ) : (
          <div key={m.key} aria-disabled>
            {body}
          </div>
        );
      })}
    </div>
  );
}
