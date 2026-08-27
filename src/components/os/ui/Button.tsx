"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const variantClass: Record<Variant, string> = {
  primary:
    "text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-[0.98]",
  secondary:
    "bg-[var(--surface-hover)] text-[var(--text)] hover:bg-[var(--surface-sunken)] active:scale-[0.98]",
  outline:
    "bg-transparent border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-hover)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] active:scale-[0.98]",
  danger:
    "bg-[var(--danger)] text-white hover:opacity-90 active:scale-[0.98]",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-base gap-2 rounded-[var(--radius-md)]",
  icon: "h-10 w-10 rounded-[var(--radius-md)]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none select-none",
          variantClass[variant],
          sizeClass[size],
          className
        )}
        style={variant === "primary" ? { background: "linear-gradient(135deg, var(--accent), var(--accent-2))", ...style } : style}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
