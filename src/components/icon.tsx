"use client";

import {
  LayoutDashboard,
  Bot,
  Siren,
  Mic,
  Scale,
  Briefcase,
  BookOpen,
  PackageOpen,
  CreditCard,
  Swords,
  UserMinus,
  Megaphone,
  HeartCrack,
  Car,
  UserSearch,
  Skull,
  Bug,
  ScrollText,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Bot,
  Siren,
  Mic,
  Scale,
  Briefcase,
  BookOpen,
  PackageOpen,
  CreditCard,
  Swords,
  UserMinus,
  Megaphone,
  HeartCrack,
  Car,
  UserSearch,
  Skull,
  Bug,
  ScrollText,
  CircleHelp,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = MAP[name] ?? CircleHelp;
  return <Cmp className={className} />;
}
