"use client";

/**
 * Real, persisted light/dark/system theme control. next-themes already
 * handles persistence (storageKey="techfind-os-theme") and the no-FOUC
 * inline script — this component is just UI over `useTheme()`. The full
 * dark palette lives in globals.css's `.dark` block; nothing here invents
 * colors of its own.
 */

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggleIcon() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? theme ?? "system" : "system";
  const idx = OPTIONS.findIndex(o => o.value === current);
  const Icon = OPTIONS[idx === -1 ? 2 : idx].icon;

  function cycle() {
    const next = OPTIONS[(Math.max(idx, 0) + 1) % OPTIONS.length];
    setTheme(next.value);
  }

  return (
    <button
      onClick={cycle}
      className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center transition-colors hover:bg-[var(--surface-hover)]"
      aria-label={`Theme: ${OPTIONS[idx === -1 ? 2 : idx].label}. Click to change.`}
      title={`Theme: ${OPTIONS[idx === -1 ? 2 : idx].label}`}
    >
      {mounted ? <Icon className="w-[18px] h-[18px]" style={{ color: "var(--text-muted)" }} /> : <span className="w-[18px] h-[18px]" />}
    </button>
  );
}

export function ThemeToggleSegmented() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = mounted ? theme ?? "system" : "system";

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-[var(--radius-lg)]" style={{ background: "var(--surface-hover)" }}>
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "os-press flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors"
          )}
          style={{
            background: current === value ? "var(--surface)" : "transparent",
            color: current === value ? "var(--text)" : "var(--text-muted)",
            boxShadow: current === value ? "var(--shadow-xs)" : "none",
          }}
          aria-pressed={current === value}
        >
          <Icon className="w-3.5 h-3.5" /> {label}
        </button>
      ))}
    </div>
  );
}
