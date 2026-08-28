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
export const SECONDARY_NAV: NavItem[] = [
  { label: "Clients",             href: "/app/clients",      icon: Building2 },
  { label: "Meetings",            href: "/app/meetings",     icon: CalendarDays },
  { label: "Tasks",               href: "/app/tasks",        icon: CheckSquare2 },
  { label: "Quotes & Proformas",  href: "/app/quotes",       icon: FileText },
  { label: "Invoices",            href: "/app/invoices",     icon: Receipt },
  { label: "Payments",            href: "/app/payments",     icon: CreditCard },
  { label: "Projects",            href: "/app/projects",     icon: FolderKanban },
  { label: "Intelligence",        href: "/app/intelligence", icon: Sparkles },
  { label: "Settings",            href: "/app/settings",     icon: Settings },
];

/** Full flat list of real routes (no "#more" sentinel) — for ⌘K "Go to" search. */
export const ALL_NAV: NavItem[] = [
  ...PRIMARY_NAV.filter(item => item.href !== "#more"),
  ...SECONDARY_NAV,
];
