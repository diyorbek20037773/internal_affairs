export type NavKey =
  | "dashboard"
  | "kasblar"
  | "klasterlar"
  | "kasbSim"
  | "tutor"
  | "pasport"
  | "simulyator"
  | "mashgulotlarim"
  | "instruktor"
  | "profil"
  | "inspektor"
  | "hodisa"
  | "qonunchilik"
  | "ishlarim"
  | "guide";

export type NavGroup = "platforma" | "himoya" | "inspektor";

export interface NavEntry {
  key: NavKey;
  href: string;
  icon: string; // lucide icon name (registered in components/icon.tsx)
  group: NavGroup;
  /** Hidden unless the local profile role is "instructor". */
  instructorOnly?: boolean;
}

/**
 * Huquqni muhofaza qilish ta'lim klasteri is the platform; "Mening Inspektorim" is a module inside it.
 * Sidebar renders the two groups with headings (see Sidebar.tsx).
 */
export const NAV_ENTRIES: NavEntry[] = [
  { key: "dashboard", href: "/", icon: "LayoutDashboard", group: "platforma" },
  { key: "kasblar", href: "/kasblar", icon: "Layers", group: "platforma" },
  { key: "klasterlar", href: "/klasterlar", icon: "Library", group: "platforma" },
  { key: "kasbSim", href: "/kasb-simulyator", icon: "Workflow", group: "platforma" },
  { key: "tutor", href: "/tutor", icon: "BookOpenCheck", group: "platforma" },
  { key: "pasport", href: "/pasport", icon: "Award", group: "platforma" },
  { key: "mashgulotlarim", href: "/mashgulotlarim", icon: "GraduationCap", group: "platforma" },
  { key: "instruktor", href: "/instruktor", icon: "Users", group: "platforma", instructorOnly: true },
  { key: "profil", href: "/profil", icon: "IdCard", group: "platforma" },

  { key: "simulyator", href: "/simulyator", icon: "Target", group: "himoya" },

  { key: "inspektor", href: "/inspektor", icon: "Bot", group: "inspektor" },
  { key: "hodisa", href: "/hodisa", icon: "Siren", group: "inspektor" },
  { key: "qonunchilik", href: "/qonunchilik", icon: "Scale", group: "inspektor" },
  { key: "ishlarim", href: "/ishlarim", icon: "Briefcase", group: "inspektor" },
  { key: "guide", href: "/guide", icon: "BookOpen", group: "inspektor" },
];

export const NAV_GROUPS: NavGroup[] = ["platforma", "himoya", "inspektor"];
