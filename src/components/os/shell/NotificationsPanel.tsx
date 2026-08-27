"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { timeAgo } from "@/lib/os/dates";
import { getNotificationsAction, markAllNotificationsReadAction } from "@/server/actions/notifications";

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string | null;
  relatedType: string | null;
  relatedId: string | null;
  read: boolean;
  createdAt: Date;
}

function hrefFor(n: Notif): string {
  if (!n.relatedType || !n.relatedId) return "/app";
  const map: Record<string, string> = {
    CLIENT: "/app/clients",
    DEAL: "/app/deals",
    PAYMENT: "/app/payments",
    PROJECT: "/app/projects",
    TASK: "/app/tasks",
  };
  const base = map[n.relatedType];
  return base ? `${base}/${n.relatedId}` : "/app";
}

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<Notif[] | null>(null);

  useEffect(() => {
    getNotificationsAction().then(setItems);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[130]" onClick={onClose} />
      <div
        className="absolute right-0 top-12 z-[131] w-80 max-h-[70vh] overflow-y-auto rounded-[var(--radius-lg)] border os-animate-in"
        style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <span className="text-sm font-bold text-[var(--text)]">Notifications</span>
          <button
            onClick={() => { markAllNotificationsReadAction(); setItems(prev => prev?.map(n => ({ ...n, read: true })) ?? null); }}
            className="text-xs flex items-center gap-1 text-[var(--text-faint)] hover:text-[var(--accent)]"
          >
            <Check className="w-3 h-3" /> Mark all read
          </button>
        </div>

        {items === null && (
          <div className="p-8 text-center text-sm text-[var(--text-faint)]">Loading…</div>
        )}

        {items?.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--text-faint)" }} />
            <p className="text-sm text-[var(--text-faint)]">You&apos;re all caught up</p>
          </div>
        )}

        {items?.map(n => (
          <Link
            key={n.id}
            href={hrefFor(n)}
            onClick={onClose}
            className="flex items-start gap-2.5 px-4 py-3 border-b last:border-0 hover:bg-[var(--surface-hover)] transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: n.read ? "transparent" : "var(--accent)" }}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-[var(--text)]">{n.title}</span>
              {n.body && <span className="block text-xs text-[var(--text-faint)] mt-0.5">{n.body}</span>}
              <span className="block text-[11px] text-[var(--text-faint)] mt-1">{timeAgo(n.createdAt)}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
