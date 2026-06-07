"use client";

import React from "react";

interface AvatarProps {
  name: string;
  role?: string;
  initials: string;
  bgColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-2xl",
};

const colorPalette = [
  "bg-gradient-to-br from-[#7C3AED] to-[#5B21B6]",
  "bg-gradient-to-br from-[#3B82F6] to-[#1E40AF]",
  "bg-gradient-to-br from-[#22D3EE] to-[#0891B2]",
  "bg-gradient-to-br from-[#EC4899] to-[#BE185D]",
  "bg-gradient-to-br from-[#F59E0B] to-[#D97706]",
  "bg-gradient-to-br from-[#10B981] to-[#047857]",
];

export function Avatar({ name, role, initials, bgColor, size = "md" }: AvatarProps) {
  const bg = bgColor || colorPalette[initials.charCodeAt(0) % colorPalette.length];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeMap[size]} ${bg} rounded-full flex items-center justify-center font-bold text-white shadow-md`}
      >
        {initials}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--text)]">{name}</p>
        {role && <p className="text-xs text-[var(--muted)]">{role}</p>}
      </div>
    </div>
  );
}

export function AvatarGroup({
  avatars,
  max = 3,
}: {
  avatars: AvatarProps[];
  max?: number;
}) {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {displayed.map((avatar, i) => (
        <div
          key={i}
          className="w-10 h-10 rounded-full border-2 border-[var(--card)] bg-gradient-to-br flex items-center justify-center font-bold text-white text-xs shadow-md"
          style={{
            background: colorPalette[avatar.initials.charCodeAt(0) % colorPalette.length],
            zIndex: displayed.length - i,
          }}
          title={avatar.name}
        >
          {avatar.initials}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-10 h-10 rounded-full border-2 border-[var(--card)] bg-[var(--card-hover)] flex items-center justify-center font-bold text-[var(--muted)] text-xs shadow-md">
          +{remaining}
        </div>
      )}
    </div>
  );
}
