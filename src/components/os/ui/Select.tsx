"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;

export function SelectTrigger({ className, children, ...props }: SelectPrimitive.SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-[var(--radius-md)] px-3.5 text-sm",
        "bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)]",
        "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none",
        "data-[placeholder]:text-[var(--text-faint)]",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon><ChevronDown className="w-4 h-4 text-[var(--text-faint)]" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, children, ...props }: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn("z-[310] min-w-[var(--radix-select-trigger-width)] rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] p-1.5 os-animate-in", className)}
        style={{ boxShadow: "var(--shadow-md)" }}
        position="popper"
        sideOffset={6}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: SelectPrimitive.SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex items-center gap-2 pl-7 pr-2.5 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text)] outline-none cursor-pointer",
        "data-[highlighted]:bg-[var(--surface-hover)]",
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex items-center">
        <SelectPrimitive.ItemIndicator><Check className="w-3.5 h-3.5 text-[var(--accent)]" /></SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
