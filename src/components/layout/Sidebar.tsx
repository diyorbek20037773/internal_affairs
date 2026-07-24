"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ENTRIES } from "./nav";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15">
          <Image
            src="/my_inspector_logo.jpg"
            alt="Mening Inspektorim"
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">
            {tc("appName")}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/60">
            {tc("appSubtitle")}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-thin">
        {NAV_ENTRIES.map((entry) => {
          const active =
            entry.href === "/"
              ? pathname === "/"
              : pathname.startsWith(entry.href);
          return (
            <Link
              key={entry.key}
              href={entry.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                  active
                    ? "bg-sidebar-accent text-accent-foreground"
                    : "bg-white/5 text-sidebar-foreground/70 group-hover:text-white"
                )}
              >
                <Icon name={entry.icon} className="h-4 w-4" />
              </span>
              <span className="truncate">{t(entry.key)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-md bg-white/10">
            <Image
              src="/iiv_logo.jpg"
              alt="IIV"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <p className="text-[11px] leading-tight text-sidebar-foreground/55">
            {tc("ministry")}
          </p>
        </div>
      </div>
    </div>
  );
}
