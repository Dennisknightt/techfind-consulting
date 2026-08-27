import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

export function Separator({ className, orientation = "horizontal", ...props }: SeparatorPrimitive.SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      className={cn(
        "bg-[var(--border)]",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
      {...props}
    />
  );
}
