"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_ENTRIES } from "./nav";

export function Topbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const active =
    NAV_ENTRIES.find((e) =>
      e.href === "/" ? pathname === "/" : pathname.startsWith(e.href)
    ) ?? NAV_ENTRIES[0];

  return (
    <header className="glass-panel sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 px-4 shadow-xs md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 items-center gap-2">
        <span aria-hidden className="hidden h-5 w-1 rounded-full bg-accent sm:block" />
        <h1 className="truncate text-base font-semibold tracking-tight md:text-lg">
          {t(active.key)}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
