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
  ShieldCheck,
  FileText,
  MapPin,
  MessagesSquare,
  ClipboardCheck,
  MessageCircle,
  Users,
  Plane,
  Home,
  Map as MapIcon,
  ScanFace,
  Inbox,
  Building2,
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
  ShieldCheck,
  FileText,
  MapPin,
  MessagesSquare,
  ClipboardCheck,
  MessageCircle,
  Users,
  Plane,
  Home,
  Map: MapIcon,
  ScanFace,
  Inbox,
  Building2,
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
