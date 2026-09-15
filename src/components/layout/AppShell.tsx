import { SidebarContent } from "./Sidebar";
import { Topbar } from "./Topbar";

/** `.h360-chrome` is hidden by CSS when `<html data-embed="1">` (E-O'quv embed mode). */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-muted/30">
      <aside className="h360-chrome hidden w-72 shrink-0 border-r border-sidebar-border/70 md:block">
        <SidebarContent />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h360-chrome contents">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
