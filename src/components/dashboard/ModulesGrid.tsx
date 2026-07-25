"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface ModuleDef {
  key: string;
  icon: string;
  href?: string; // internal route if we implement it
  tone?: "primary" | "danger";
}

// Modules mirrored from the real "Mening Inspektorim" / E-patrul app.
const MODULES: ModuleDef[] = [
  { key: "epatrul", icon: "ShieldCheck" },
  { key: "profilaktik_suhbat", icon: "MessagesSquare", href: "/inspektor" },
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
  const tc = useTranslations("common");
  const router = useRouter();

  const open = (m: ModuleDef) => {
    if (m.href) router.push(m.href);
    else toast.info(`${t(m.key)} — ${tc("comingSoon")}`);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {MODULES.map((m) => (
        <button key={m.key} onClick={() => open(m)} className="group text-left">
          <Card className="relative flex h-full items-center gap-3 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)] group-hover:bg-primary group-hover:text-primary-foreground"
              )}
            >
              <Icon name={m.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-tight">
                {t(m.key)}
              </p>
              {!m.href && (
                <Badge variant="outline" className="mt-1 text-[10px]">
                  {tc("comingSoon")}
                </Badge>
              )}
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
}
