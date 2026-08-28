import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid, MessageSquare, Users, Handshake, Building2, CalendarDays,
  CheckSquare2, FileText, Receipt, CreditCard, FolderKanban, TrendingUp,
  Sparkles, Settings, MoreHorizontal,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SecondaryNavItem extends NavItem {
  description: string;
  group: "Delivery" | "Money" | "System";
}

/**
 * The six items a CEO should never have to think about finding: always
 * visible, in both the desktop sidebar and the mobile bottom bar. "More"
 * isn't a real route — it opens MoreSheet. Money and Activity are landing
 * pages for a *group* of related modules (see SECONDARY_NAV) rather than
 * a 1:1 module themselves, so the primary bar stays at six items even as
 * the product grows.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Home",     href: "/app",               icon: LayoutGrid },
  { label: "Leads",    href: "/app/leads",          icon: Users },
  { label: "Pipeline", href: "/app/deals",          icon: Handshake },
  { label: "Money",    href: "/app/revenue",        icon: TrendingUp },
  { label: "Activity", href: "/app/communications", icon: MessageSquare },
  { label: "More",     href: "#more",               icon: MoreHorizontal },
];

/** Everything else — reachable via the More sheet or ⌘K, never permanently on-screen. */
export const SECONDARY_NAV: SecondaryNavItem[] = [
  { label: "Clients",            href: "/app/clients",      icon: Building2,      group: "Delivery", description: "Accounts and relationship history" },
  { label: "Meetings",           href: "/app/meetings",     icon: CalendarDays,   group: "Delivery", description: "Scheduled calls and site visits" },
  { label: "Tasks",              href: "/app/tasks",        icon: CheckSquare2,   group: "Delivery", description: "Follow-ups and open action items" },
  { label: "Projects",           href: "/app/projects",     icon: FolderKanban,   group: "Delivery", description: "Work in delivery, post sale" },
  { label: "Quotes & Proformas", href: "/app/quotes",       icon: FileText,       group: "Money",    description: "Draft and sent commercial documents" },
  { label: "Invoices",           href: "/app/invoices",     icon: Receipt,        group: "Money",    description: "Billed amounts awaiting settlement" },
  { label: "Payments",           href: "/app/payments",     icon: CreditCard,     group: "Money",    description: "Payment links and reconciliation" },
  { label: "Intelligence",       href: "/app/intelligence", icon: Sparkles,       group: "System",   description: "Pipeline health and Claude briefings" },
  { label: "Settings",           href: "/app/settings",     icon: Settings,       group: "System",   description: "Team, workspace and preferences" },
];

export const SECONDARY_NAV_GROUPS: SecondaryNavItem["group"][] = ["Delivery", "Money", "System"];

/** Full flat list of real routes (no "#more" sentinel) — for ⌘K "Go to" search. */
export const ALL_NAV: NavItem[] = [
  ...PRIMARY_NAV.filter(item => item.href !== "#more"),
  ...SECONDARY_NAV,
];
