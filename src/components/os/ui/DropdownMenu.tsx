"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuSubTrigger = DropdownMenuPrimitive.SubTrigger;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export function DropdownMenuContent({ className, sideOffset = 6, ...props }: DropdownMenuPrimitive.DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-[310] min-w-[200px] rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] p-1.5 os-animate-in",
          className
        )}
        style={{ boxShadow: "var(--shadow-md)" }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }: DropdownMenuPrimitive.DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text)] outline-none cursor-pointer",
        "data-[highlighted]:bg-[var(--surface-hover)] data-[disabled]:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({ className, children, ...props }: DropdownMenuPrimitive.DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text)] outline-none cursor-pointer",
        "data-[highlighted]:bg-[var(--surface-hover)]",
        className
      )}
      {...props}
    >
      <DropdownMenuPrimitive.ItemIndicator><Check className="w-3.5 h-3.5" /></DropdownMenuPrimitive.ItemIndicator>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuLabel({ className, ...props }: DropdownMenuPrimitive.DropdownMenuLabelProps) {
  return <DropdownMenuPrimitive.Label className={cn("px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)]", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuPrimitive.DropdownMenuSeparatorProps) {
  return <DropdownMenuPrimitive.Separator className={cn("h-px my-1 bg-[var(--border)]", className)} {...props} />;
}

export function DropdownMenuSubContent({ className, ...props }: DropdownMenuPrimitive.DropdownMenuSubContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        className={cn("z-[310] min-w-[180px] rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] p-1.5", className)}
        style={{ boxShadow: "var(--shadow-md)" }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export { ChevronRight as DropdownMenuSubTriggerIcon };
