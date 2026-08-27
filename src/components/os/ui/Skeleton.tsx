import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("os-skeleton rounded-[var(--radius-md)]", className)} />;
}
