import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid, MessageSquare, Users, Handshake, Building2, CalendarDays,
  CheckSquare2, FileText, Receipt, CreditCard, FolderKanban, TrendingUp,
  Sparkles, Settings, Inbox, MoreHorizontal,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DESKTOP_NAV: NavItem[] = [
  { label: "Home",              href: "/app",               icon: LayoutGrid },
  { label: "Communications",    href: "/app/communications", icon: MessageSquare },
  { label: "Leads",             href: "/app/leads",          icon: Users },
  { label: "Deals",             href: "/app/deals",          icon: Handshake },
  { label: "Clients",           href: "/app/clients",        icon: Building2 },
  { label: "Meetings",          href: "/app/meetings",       icon: CalendarDays },
  { label: "Tasks",             href: "/app/tasks",          icon: CheckSquare2 },
  { label: "Quotes & Proformas", href: "/app/quotes",        icon: FileText },
  { label: "Invoices",          href: "/app/invoices",       icon: Receipt },
  { label: "Payments",          href: "/app/payments",       icon: CreditCard },
  { label: "Projects",          href: "/app/projects",       icon: FolderKanban },
  { label: "Revenue",           href: "/app/revenue",        icon: TrendingUp },
  { label: "Intelligence",      href: "/app/intelligence",   icon: Sparkles },
  { label: "Settings",          href: "/app/settings",       icon: Settings },
];

export const MOBILE_PRIMARY_NAV: NavItem[] = [
  { label: "Home",  href: "/app",               icon: LayoutGrid },
  { label: "Inbox", href: "/app/communications", icon: Inbox },
  { label: "Leads", href: "/app/leads",          icon: Users },
  { label: "Tasks", href: "/app/tasks",          icon: CheckSquare2 },
  { label: "More",  href: "#more",               icon: MoreHorizontal },
];

export const MOBILE_MORE_NAV: NavItem[] = [
  { label: "Deals",             href: "/app/deals",        icon: Handshake },
  { label: "Clients",           href: "/app/clients",      icon: Building2 },
  { label: "Meetings",          href: "/app/meetings",     icon: CalendarDays },
  { label: "Quotes & Proformas", href: "/app/quotes",      icon: FileText },
  { label: "Invoices",          href: "/app/invoices",     icon: Receipt },
  { label: "Payments",          href: "/app/payments",     icon: CreditCard },
  { label: "Projects",          href: "/app/projects",     icon: FolderKanban },
  { label: "Revenue",           href: "/app/revenue",      icon: TrendingUp },
  { label: "Intelligence",      href: "/app/intelligence", icon: Sparkles },
  { label: "Settings",          href: "/app/settings",     icon: Settings },
];
