export type NavKey =
  | "dashboard"
  | "simulyator"
  | "mashgulotlarim"
  | "instruktor"
  | "profil"
  | "inspektor"
  | "hodisa"
  | "qonunchilik"
  | "ishlarim"
  | "guide";

export type NavGroup = "himoya" | "inspektor";

export interface NavEntry {
  key: NavKey;
  href: string;
  icon: string; // lucide icon name (registered in components/icon.tsx)
  group: NavGroup;
  /** Hidden unless the local profile role is "instructor". */
  instructorOnly?: boolean;
}

/**
 * HIMOYA-360 is the platform; "Mening Inspektorim" is a module inside it.
 * Sidebar renders the two groups with headings (see Sidebar.tsx).
 */
export const NAV_ENTRIES: NavEntry[] = [
  { key: "dashboard", href: "/", icon: "LayoutDashboard", group: "himoya" },
  { key: "simulyator", href: "/simulyator", icon: "Target", group: "himoya" },
  { key: "mashgulotlarim", href: "/mashgulotlarim", icon: "GraduationCap", group: "himoya" },
  { key: "instruktor", href: "/instruktor", icon: "Users", group: "himoya", instructorOnly: true },
  { key: "profil", href: "/profil", icon: "IdCard", group: "himoya" },

  { key: "inspektor", href: "/inspektor", icon: "Bot", group: "inspektor" },
  { key: "hodisa", href: "/hodisa", icon: "Siren", group: "inspektor" },
  { key: "qonunchilik", href: "/qonunchilik", icon: "Scale", group: "inspektor" },
  { key: "ishlarim", href: "/ishlarim", icon: "Briefcase", group: "inspektor" },
  { key: "guide", href: "/guide", icon: "BookOpen", group: "inspektor" },
];

export const NAV_GROUPS: NavGroup[] = ["himoya", "inspektor"];
