"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, Globe2, Brain, TrendingUp, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

const aiPlatforms = ["ChatGPT", "Gemini", "Claude", "Perplexity", "Google AI"];

const stats = [
  { icon: Globe2,     value: "80%", label: "of buyers use AI for research" },
  { icon: Brain,      value: "3×",  label: "more leads from AI-cited brands" },
  { icon: TrendingUp, value: "92%", label: "B2B decisions start with AI" },
];

const floatingBubbles = [
  { text: "Best solar company in Nairobi?",  delay: 0,   side: "left",  top: "36%" },
  { text: "Top law firms in East Africa?",   delay: 1.6, side: "right", top: "26%" },
  { text: "AI-powered HR software Kenya?",   delay: 3.2, side: "right", top: "60%" },
];

/* ─────────────────────────────────────────────────────
   Globe watermark — crops to the globe half of Logo.png,
   fills the full hero as a high-visibility blended texture.
───────────────────────────────────────────────────────── */
function GlobeWatermark() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/*
        The PNG layout: [ globe (≈43% width) | text (≈57%) ]
        Strategy: render the image at 220vw wide so it's massive.
        translateX(-21.5%) centres the globe's midpoint (21.5% of total)
        at the viewport centre. The text half drifts far off-screen right.
        Opacity raised to 0.13 in light, 0.16 in dark — visible but natural.
        mix-blend-mode: multiply fuses the navy/teal lines with the bg.
      */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: "220vw",
          transform: "translate(-21.5%, -52%)",
          opacity: isDark ? 0.16 : 0.13,
          filter: isDark
            ? "brightness(0) invert(1)"
            : "saturate(0.8) brightness(0.9) contrast(1.1)",
          mixBlendMode: isDark ? "screen" : "multiply",
          willChange: "transform",
        }}
      >
        <Image
          src="/Logo.png"
          alt=""
          width={2200}
          height={590}
          priority
          className="w-full h-auto"
          draggable={false}
        />
      </div>

      {/* Very soft centre-fade so the text area stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(7,11,20,0.55) 0%, transparent 80%)"
            : "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(248,250,252,0.50) 0%, transparent 80%)",
        }}
      />
    </div>
  );
}

export function Hero() {
  const [platformIndex, setPlatformIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPlatformIndex((i) => (i + 1) % aiPlatforms.length);
        setVisible(true);
      }, 280);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20"
      style={{ background: "var(--bg)" }}
    >
      {/* Globe background */}
      <GlobeWatermark />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Floating query bubbles */}
      {floatingBubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 + i * 0.3, duration: 0.6 }}
          className="absolute hidden xl:block"
          style={b.side === "left" ? { left: "4%", top: b.top } : { right: "4%", top: b.top }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
            className="surface rounded-2xl px-4 py-3 max-w-[200px] shadow-[var(--shadow-md)]"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] mt-0.5 shrink-0" />
              <p className="text-xs text-[var(--muted)] leading-relaxed">{b.text}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* ═══════════════════════════
          CONTENT — sits inside globe
      ═══════════════════════════════ */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-block mb-7"
        >
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Africa&apos;s First AI Engine Optimization Agency · Global
          </span>
        </motion.div>

        {/* Main headline — sits right over the globe */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-4 leading-[1.0] text-[var(--text)]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Get Your Business
          <br />
          <span className="gradient-text">Recommended by AI.</span>
        </motion.h1>

        {/* Platform rotator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="flex items-center justify-center gap-3 mb-5 h-8"
        >
          <span className="text-sm text-[var(--muted)]">Appearing on</span>
          <motion.span
            key={platformIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -6 }}
            transition={{ duration: 0.22 }}
            className="text-sm font-semibold text-[var(--accent)] surface px-3 py-1 rounded-full"
          >
            {aiPlatforms[platformIndex]}
          </motion.span>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          TechFind Consulting helps brands rank, appear, and get cited across ChatGPT,
          Gemini, Claude, Perplexity, and Google AI — globally.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/ai-visibility-audit" className="btn-primary group">
            Book AI Visibility Audit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/ai-engine-optimization" className="btn-secondary group">
            <Play className="w-4 h-4 text-[var(--accent)]" />
            See How AEO Works
          </Link>
        </motion.div>

        {/* Stats — float naturally over the globe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full"
        >
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="surface surface-hover rounded-2xl p-5 text-center group cursor-default"
            >
              <Icon className="w-5 h-5 text-[var(--accent)] mx-auto mb-2.5 group-hover:text-[var(--highlight)] transition-colors" />
              <div
                className="text-2xl font-bold gradient-text mb-1"
                style={{ fontFamily: "var(--font-geist)" }}
              >
                {value}
              </div>
              <div className="text-xs text-[var(--muted)] leading-snug">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] opacity-40">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-8 opacity-30"
          style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
