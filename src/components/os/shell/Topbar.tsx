"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { QuickCreateMenu } from "./QuickCreate";
import { NotificationsPanel } from "./NotificationsPanel";

export function Topbar({ unreadCount = 0 }: { unreadCount?: number }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-[120] flex items-center gap-3 h-16 px-4 lg:px-6 border-b backdrop-blur-md safe-top"
      style={{ background: "var(--topbar-bg)", borderColor: "var(--border)" }}
    >
      <button
        onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
        className="flex-1 max-w-md flex items-center gap-2.5 h-10 px-3.5 rounded-[var(--radius-md)] text-sm text-left transition-colors"
        style={{ background: "var(--surface-hover)", color: "var(--text-faint)" }}
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 truncate">Ask Techfind or search anything…</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border shrink-0" style={{ borderColor: "var(--border-strong)" }}>
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      <div className="relative">
        <button
          onClick={() => setNotifOpen(v => !v)}
          className="relative w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center transition-colors hover:bg-[var(--surface-hover)]"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" style={{ color: "var(--text-muted)" }} />
          {unreadCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "var(--danger)" }}
            />
          )}
        </button>
        {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
      </div>

      <div className="hidden lg:block">
        <QuickCreateMenu />
      </div>
    </header>
  );
}
