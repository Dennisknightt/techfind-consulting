"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LogOut, ChevronsUpDown, Search } from "lucide-react";
import { PRIMARY_NAV } from "./nav";
import { MoreSheet } from "./MoreSheet";
import { Avatar } from "@/components/os/ui/Avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/os/ui/DropdownMenu";
import { logoutAction } from "@/server/actions/auth";
import { ROLE_LABEL, type Role } from "@/server/auth/roles";
import type { SessionUser } from "@/server/auth/session";

function openCommandPalette() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
}

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 border-r"
      style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
    >
      <Link href="/app" className="flex items-center gap-2 px-4 h-14 shrink-0">
        <div
          className="w-6 h-6 rounded-[7px] flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
        >
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-[13px] text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Techfind
        </span>
      </Link>

      <div className="px-3 pb-2">
        <button
          onClick={openCommandPalette}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-left transition-colors hover:bg-[var(--surface-hover)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-faint)" }} />
          <span className="text-xs flex-1" style={{ color: "var(--text-faint)" }}>Search…</span>
          <kbd className="text-[10px] px-1 rounded" style={{ color: "var(--text-faint)", border: "1px solid var(--border)" }}>⌘K</kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-px">
        {PRIMARY_NAV.map(({ label, href, icon: Icon }) => {
          if (href === "#more") {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(true)}
                className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[var(--radius-sm)] text-[13px] transition-colors text-left hover:bg-[var(--surface-hover)]"
                style={{ color: "var(--text-muted)", fontWeight: 500 }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            );
          }
          const active = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-2.5 px-2.5 py-[7px] rounded-[var(--radius-sm)] text-[13px] transition-colors"
              style={{
                background: active ? "var(--surface-hover)" : "transparent",
                color: active ? "var(--text)" : "var(--text-muted)",
                fontWeight: active ? 600 : 500,
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0" style={{ color: active ? "var(--accent)" : "var(--text-faint)" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />

      <div className="p-2.5 border-t" style={{ borderColor: "var(--border)" }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)] transition-colors text-left">
              <Avatar name={user.name} color={user.avatarColor} size={26} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--text)] truncate">{user.name}</p>
                <p className="text-[11px] text-[var(--text-faint)] truncate">{ROLE_LABEL[user.role as Role]}</p>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[var(--danger)]"
              onSelect={() => { void logoutAction(); }}
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
