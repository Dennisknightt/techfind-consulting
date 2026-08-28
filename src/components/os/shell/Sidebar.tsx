"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LogOut, ChevronsUpDown } from "lucide-react";
import { DESKTOP_NAV } from "./nav";
import { Avatar } from "@/components/os/ui/Avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/os/ui/DropdownMenu";
import { logoutAction } from "@/server/actions/auth";
import { ROLE_LABEL, type Role } from "@/server/auth/roles";
import type { SessionUser } from "@/server/auth/session";

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r"
      style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
    >
      <Link href="/app" className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
        >
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-[15px] text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Techfind
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {DESKTOP_NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors"
              style={{
                background: active ? "var(--accent-soft)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-muted)",
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)] transition-colors text-left">
              <Avatar name={user.name} color={user.avatarColor} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{user.name}</p>
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
