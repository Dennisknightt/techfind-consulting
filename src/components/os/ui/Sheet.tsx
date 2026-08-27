"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

type Side = "right" | "bottom";

const sideClass: Record<Side, string> = {
  right:
    "right-0 top-0 h-full w-full sm:max-w-md border-l data-[state=open]:animate-none",
  bottom:
    "bottom-0 left-0 w-full max-h-[88vh] rounded-t-[var(--radius-xl)] border-t",
};

export function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  ...props
}: DialogPrimitive.DialogContentProps & { side?: Side; showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        data-side={side}
        className={cn(
          "fixed z-[301] bg-[var(--surface)] border-[var(--border)] flex flex-col focus:outline-none",
          "os-sheet-slide",
          sideClass[side],
          className
        )}
        style={{ boxShadow: "var(--shadow-lg)" }}
        {...props}
      >
        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-[var(--text-faint)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] transition-colors">
            <X className="w-4 h-4" />
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-5 border-b border-[var(--border)] shrink-0", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-bold text-[var(--text)]", className)}
      style={{ fontFamily: "var(--font-space)" }}
      {...props}
    />
  );
}

export function SheetDescription({ className, ...props }: DialogPrimitive.DialogDescriptionProps) {
  return <DialogPrimitive.Description className={cn("text-sm text-[var(--text-muted)] mt-1", className)} {...props} />;
}

export function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto px-6 py-5", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-4 border-t border-[var(--border)] flex items-center justify-end gap-2 shrink-0 safe-bottom", className)}
      {...props}
    />
  );
}
