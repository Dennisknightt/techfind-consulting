"use client";

import { Sparkles } from "lucide-react";

const platforms = [
  "ChatGPT", "Google Gemini", "Claude AI", "Perplexity", "Google SGE",
  "Microsoft Copilot", "Meta AI", "Grok", "You.com", "Bing AI",
  "ChatGPT", "Google Gemini", "Claude AI", "Perplexity", "Google SGE",
  "Microsoft Copilot", "Meta AI", "Grok", "You.com", "Bing AI",
];

const benefits = [
  "AI Visibility Audit", "Entity Optimization", "Structured Data", "Authority Content",
  "Digital PR & Citations", "AI Search Monitoring", "Competitive Reports", "WhatsApp AI Agents",
  "AI Visibility Audit", "Entity Optimization", "Structured Data", "Authority Content",
  "Digital PR & Citations", "AI Search Monitoring", "Competitive Reports", "WhatsApp AI Agents",
];

export function MarqueeStrip() {
  return (
    <div className="relative py-10 overflow-hidden border-y" style={{ borderColor: "var(--border)" }}>
      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--bg), transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--bg), transparent)" }}
      />

      {/* Platform strip */}
      <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-5 opacity-60">
        We Optimize Your Presence Across
      </p>
      <div className="flex gap-5 animate-marquee whitespace-nowrap mb-4">
        {platforms.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2 surface rounded-full px-4 py-1.5 shrink-0 shadow-[var(--shadow-sm)]"
          >
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--muted)]">{p}</span>
          </div>
        ))}
      </div>

      {/* Benefits strip — reverse */}
      <div
        className="flex gap-6 whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite reverse" }}
      >
        {benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-50" />
            <span className="text-sm text-[var(--muted)] opacity-60">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
