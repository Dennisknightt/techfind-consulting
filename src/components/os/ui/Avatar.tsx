import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  color = "var(--accent)",
  size = 36,
  className,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-full font-bold text-white shrink-0", className)}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.38,
        fontFamily: "var(--font-space)",
      }}
    >
      {initials(name)}
    </div>
  );
}

export function CompanyAvatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-[10px] font-bold shrink-0", className)}
      style={{
        width: size,
        height: size,
        background: "var(--accent-soft)",
        color: "var(--accent)",
        fontSize: size * 0.38,
        fontFamily: "var(--font-space)",
      }}
    >
      {initials(name)}
    </div>
  );
}
