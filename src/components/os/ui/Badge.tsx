import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "hot" | "warm" | "cold";

const toneClass: Record<Tone, string> = {
  neutral: "bg-[var(--surface-hover)] text-[var(--text-muted)]",
  accent:  "bg-[var(--accent-soft)] text-[var(--accent)]",
  success: "bg-[var(--success-soft)] text-[var(--success)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  danger:  "bg-[var(--danger-soft)] text-[var(--danger)]",
  info:    "bg-[var(--info-soft)] text-[var(--info)]",
  hot:     "bg-[color-mix(in_srgb,var(--hot)_14%,transparent)] text-[var(--hot)]",
  warm:    "bg-[color-mix(in_srgb,var(--warm)_14%,transparent)] text-[var(--warm)]",
  cold:    "bg-[color-mix(in_srgb,var(--cold)_14%,transparent)] text-[var(--cold)]",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap",
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const TEMP_TONE: Record<string, Tone> = { HOT: "hot", WARM: "warm", COLD: "cold" };
const TEMP_ICON: Record<string, string> = { HOT: "🔥", WARM: "🟡", COLD: "⚪" };

export function TemperatureBadge({ temperature }: { temperature: string }) {
  return (
    <Badge tone={TEMP_TONE[temperature] ?? "neutral"}>
      {TEMP_ICON[temperature] ?? ""} {temperature.charAt(0) + temperature.slice(1).toLowerCase()}
    </Badge>
  );
}
