"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Search, Radar, Star, Bot, Calendar, FileText,
  Kanban, MessageSquare, Settings, ChevronLeft, ChevronRight, Zap, Menu, LogOut,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import type { SessionUser } from "@/server/auth/session";

const nav = [
  { label: "Dashboard",          href: "/admin/revenue-engine", tab: ""          , icon: LayoutDashboard },
  { label: "Prospect Discovery", href: "/admin/revenue-engine", tab: "discovery" , icon: Search },
  { label: "Prospect Audit",     href: "/admin/revenue-engine", tab: "audit"     , icon: Radar },
  { label: "Lead Scoring",       href: "/admin/revenue-engine", tab: "scoring"   , icon: Star },
  { label: "Outreach Agent",     href: "/admin/revenue-engine", tab: "outreach"  , icon: Bot },
  { label: "Calendar & Booking", href: "/admin/revenue-engine", tab: "calendar"  , icon: Calendar },
  { label: "Proposal Generator", href: "/admin/revenue-engine", tab: "proposals" , icon: FileText },
  { label: "CRM Pipeline",       href: "/admin/revenue-engine", tab: "crm"       , icon: Kanban },
  { label: "Communications",     href: "/admin/revenue-engine", tab: "communications", icon: MessageSquare },
  { label: "Settings",           href: "/admin/revenue-engine", tab: "settings"  , icon: Settings },
];

function navHref(tab: string) {
  return tab ? `/admin/revenue-engine?tab=${tab}` : "/admin/revenue-engine";
}

function NavItems({ currentTab, collapsed, onClose }: { currentTab: string; collapsed: boolean; onClose?: () => void }) {
  return (
    <>
      {nav.map(({ label, tab, icon: Icon }) => {
        const active = currentTab === tab;
        return (
          <Link
            key={label}
            href={navHref(tab)}
            onClick={onClose}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              active ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            } ${collapsed ? "justify-center" : ""}`}
            style={{ background: active ? "var(--accent-glow)" : "transparent" }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="font-medium">{label}</span>}
          </Link>
        );
      })}
    </>
  );
}

function SignOutButton({ collapsed }: { collapsed: boolean }) {
  return (
    <button
      onClick={() => { void logoutAction(); }}
      title={collapsed ? "Sign out" : undefined}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl w-full text-sm transition-all ${collapsed ? "justify-center" : ""}`}
      style={{ color: "var(--muted)" }}
    >
      <LogOut className="w-4 h-4 shrink-0" />
      {!collapsed && <span>Sign out</span>}
    </button>
  );
}

export function AdminShell({ children, user }: { children: React.ReactNode; user: SessionUser }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const brandBlock = (
    <div
      className={`flex items-center gap-2 px-4 py-5 border-b ${collapsed ? "justify-center" : ""}`}
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
      >
        <Zap className="w-4 h-4 text-white" />
      </div>
      {!collapsed && (
        <div>
          <p className="text-xs font-bold text-[var(--text)] leading-tight">TechFind</p>
          <p className="text-[10px] text-[var(--muted)]">Revenue Engine</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col border-r shrink-0 overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {brandBlock}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavItems currentTab={currentTab} collapsed={collapsed} />
        </nav>
        <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "var(--border)" }}>
          {!collapsed && (
            <p className="px-3 pb-2 text-xs truncate" style={{ color: "var(--muted)" }} title={user.email}>
              {user.name}
            </p>
          )}
          <SignOutButton collapsed={collapsed} />
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl w-full text-sm transition-all"
            style={{ color: "var(--muted)" }}
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
            }
          </button>
        </div>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden flex flex-col border-r"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              {brandBlock}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <NavItems currentTab={currentTab} collapsed={false} onClose={() => setMobileOpen(false)} />
              </nav>
              <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <p className="px-3 pb-2 text-xs truncate" style={{ color: "var(--muted)" }} title={user.email}>
                  {user.name}
                </p>
                <SignOutButton collapsed={false} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg"
            style={{ color: "var(--muted)" }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-[var(--text)]">Revenue Engine</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
