"use client";

import React from "react";

interface AiPlatformLogoProps {
  platform: "ChatGPT" | "Gemini" | "Claude" | "Perplexity" | "Google AI";
  size?: "sm" | "md" | "lg";
}

export function AiPlatformLogo({ platform, size = "md" }: AiPlatformLogoProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const platformConfigs = {
    ChatGPT: {
      bg: "bg-gradient-to-br from-[#10A37F] to-[#0EA593]",
      label: "ChatGPT",
    },
    Gemini: {
      bg: "bg-gradient-to-br from-[#4285F4] via-[#EA4335] to-[#FBBC04]",
      label: "Gemini",
    },
    Claude: {
      bg: "bg-gradient-to-br from-[#000000] to-[#1a1a1a]",
      label: "Claude",
    },
    Perplexity: {
      bg: "bg-gradient-to-br from-[#FF6B35] to-[#FF4500]",
      label: "Perplexity",
    },
    "Google AI": {
      bg: "bg-gradient-to-br from-[#3B82F6] to-[#1E40AF]",
      label: "Google AI",
    },
  };

  const config = platformConfigs[platform];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeMap[size]} rounded-lg ${config.bg} flex items-center justify-center shrink-0 shadow-md`}
        title={platform}
      />
      <span className="text-sm font-medium text-[var(--text)]">{config.label}</span>
    </div>
  );
}

export function AiPlatformBadge({
  platform,
}: {
  platform: "ChatGPT" | "Gemini" | "Claude" | "Perplexity" | "Google AI";
}) {
  const platformConfigs = {
    ChatGPT: { bg: "from-[#10A37F] to-[#0EA593]", text: "ChatGPT" },
    Gemini: { bg: "from-[#4285F4] via-[#EA4335] to-[#FBBC04]", text: "Gemini" },
    Claude: { bg: "from-[#000000] to-[#1a1a1a]", text: "Claude" },
    Perplexity: { bg: "from-[#FF6B35] to-[#FF4500]", text: "Perplexity" },
    "Google AI": { bg: "from-[#3B82F6] to-[#1E40AF]", text: "Google AI" },
  };

  const config = platformConfigs[platform];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${config.bg} shadow-lg`}
    >
      <div className="w-3 h-3 rounded-sm bg-white/30" />
      {config.text}
    </div>
  );
}
