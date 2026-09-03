"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";
import type { SessionUser } from "@/server/auth/session";

export function AppShell({ user, unreadCount, children }: { user: SessionUser; unreadCount: number; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar user={user} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar role={user.role} unreadCount={unreadCount} />
        <main className="flex-1 pb-24 lg:pb-8">{children}</main>
      </div>
      <MobileNav role={user.role} />
      <CommandPalette />
    </div>
  );
}
