"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Tone = "success" | "danger" | undefined;

/**
 * The one-tap icon-tile used everywhere a record page or the dashboard
 * offers a short list of "do this now" actions (Call, WhatsApp, Mark Won…).
 * Renders as a real link when `href` is given so it's a normal navigable
 * anchor, not a JS-only button pretending to be one.
 */
export function QuickActionTile({ icon: Icon, label, onClick, href, tone }: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  tone?: Tone;
}) {
  const color = tone === "success" ? "var(--success)" : tone === "danger" ? "var(--danger)" : "var(--accent)";
  const bg = tone === "success" ? "var(--success-soft)" : tone === "danger" ? "var(--danger-soft)" : "var(--accent-soft)";
  const className = "os-card-hover os-press flex flex-col items-center justify-center gap-2 py-5 rounded-[var(--radius-lg)] text-center";
  const style = { background: "var(--surface)", border: "1px solid var(--border)" };
  const content = (
    <>
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: bg }}>
        <Icon className="w-[18px] h-[18px]" style={{ color }} />
      </div>
      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {content}
    </button>
  );
}
