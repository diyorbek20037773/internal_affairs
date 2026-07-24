export interface NavEntry {
  key: "dashboard" | "inspektor" | "hodisa" | "voice" | "qonunchilik" | "ishlarim" | "guide";
  href: string;
  icon: string; // lucide icon name
}

export const NAV_ENTRIES: NavEntry[] = [
  { key: "dashboard", href: "/", icon: "LayoutDashboard" },
  { key: "inspektor", href: "/inspektor", icon: "Bot" },
  { key: "hodisa", href: "/hodisa", icon: "Siren" },
  { key: "voice", href: "/voice", icon: "Mic" },
  { key: "qonunchilik", href: "/qonunchilik", icon: "Scale" },
  { key: "ishlarim", href: "/ishlarim", icon: "Briefcase" },
  { key: "guide", href: "/guide", icon: "BookOpen" },
];
