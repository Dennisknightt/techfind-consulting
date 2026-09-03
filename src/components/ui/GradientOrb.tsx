"use client";

import { cn } from "@/lib/utils";

interface GradientOrbProps {
  className?: string;
  color?: "blue" | "violet" | "cyan" | "mixed";
  size?: "sm" | "md" | "lg" | "xl";
  blur?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  animationDelay?: number;
}

const colorMap = {
  blue: "bg-sky-500/20",
  violet: "bg-emerald-600/20",
  cyan: "bg-amber-500/20",
  mixed: "bg-gradient-to-br from-emerald-600/20 to-sky-500/20",
};

const sizeMap = {
  sm: "w-40 h-40",
  md: "w-64 h-64",
  lg: "w-96 h-96",
  xl: "w-[600px] h-[600px]",
};

const blurMap = {
  sm: "blur-xl",
  md: "blur-2xl",
  lg: "blur-3xl",
  xl: "blur-[100px]",
};

const animationMap = [
  "animate-orb",
  "animate-orb-2",
  "animate-orb-3",
];

export function GradientOrb({
  className,
  color = "blue",
  size = "lg",
  blur = "xl",
  animate = true,
  animationDelay = 0,
}: GradientOrbProps) {
  return (
    <div
      className={cn(
        "rounded-full pointer-events-none select-none",
        colorMap[color],
        sizeMap[size],
        blurMap[blur],
        animate && animationMap[animationDelay % 3],
        className
      )}
    />
  );
}
