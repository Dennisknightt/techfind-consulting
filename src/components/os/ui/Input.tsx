"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-md)] px-3.5 text-sm outline-none transition-colors",
        "bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)]",
        "placeholder:text-[var(--text-faint)]",
        "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm outline-none transition-colors resize-none",
        "bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)]",
        "placeholder:text-[var(--text-faint)]",
        "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-semibold text-[var(--text-muted)] mb-1.5 block", className)}
      {...props}
    />
  );
}
