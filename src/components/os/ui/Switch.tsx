"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: SwitchPrimitive.SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "w-10 h-6 rounded-full relative shrink-0 transition-colors outline-none cursor-pointer",
        "bg-[var(--surface-sunken)] data-[state=checked]:bg-[var(--accent)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block w-[18px] h-[18px] rounded-full bg-white shadow translate-x-[3px] transition-transform data-[state=checked]:translate-x-[19px]" />
    </SwitchPrimitive.Root>
  );
}
