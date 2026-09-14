"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ENTRIES, NAV_GROUPS, type NavEntry } from "./nav";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const { isInstructor } = useTraineeProfile();

  const visible = (e: NavEntry) => !e.instructorOnly || isInstructor;

  return (
    <div className="relative flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_100%_at_20%_0%,hsl(var(--sidebar-accent)/0.16),transparent_70%)]"
      />

      <div className="relative flex items-center gap-3 border-b border-sidebar-border/70 px-5 py-5">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-elevated ring-1 ring-white/15">
          <Image
            src="/iiv_logo.svg"
            alt="HIMOYA-360"
            fill
            className="object-contain p-1"
            sizes="44px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight tracking-tight">
            {tc("appName")}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/55">
            {tc("appSubtitle")}
          </p>
        </div>
      </div>

      <nav className="relative flex-1 space-y-4 overflow-y-auto px-3 py-4 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group} className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40">
              {t(`groups.${group}`)}
            </p>
            {NAV_ENTRIES.filter((e) => e.group === group && visible(e)).map((entry) => {
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
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-sidebar-accent transition-all",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md transition-all",
                      active
                        ? "bg-sidebar-accent text-accent-foreground shadow-[0_2px_10px_-2px_hsl(var(--sidebar-accent)/0.55)]"
                        : "bg-white/5 text-sidebar-foreground/65 group-hover:bg-white/10 group-hover:text-white"
                    )}
                  >
                    <Icon name={entry.icon} className="h-4 w-4" />
                  </span>
                  <span className="truncate">{t(entry.key)}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="relative border-t border-sidebar-border/70 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/95 ring-1 ring-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/iiv_logo.svg"
              alt="IIV gerbi"
              className="h-8 w-8 object-contain"
            />
          </div>
          <p className="text-[11px] leading-tight text-sidebar-foreground/50">
            {tc("ministry")}
          </p>
        </div>
      </div>
    </div>
  );
}
