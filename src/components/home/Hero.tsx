"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Globe2, Brain, TrendingUp, Sparkles } from "lucide-react";
import { AnimatedHeroBackground } from "./AnimatedHeroBackground";
import { AiPlatformBadge } from "./AiPlatformLogo";

const aiPlatforms = ["ChatGPT", "Gemini", "Claude", "Perplexity", "Google AI"] as const;

/* Static particle data — never re-computed, no hydration mismatch */
const STREAM_PARTICLES = [
  { top: "22%", dur: 4.5, del: 0.0,  color: 0 },
  { top: "35%", dur: 5.0, del: 0.35, color: 1 },
  { top: "48%", dur: 4.7, del: 0.70, color: 2 },
  { top: "61%", dur: 5.2, del: 1.05, color: 0 },
  { top: "74%", dur: 4.6, del: 1.40, color: 1 },
  { top: "18%", dur: 5.1, del: 1.75, color: 2 },
  { top: "55%", dur: 4.8, del: 2.10, color: 0 },
  { top: "30%", dur: 5.3, del: 2.45, color: 1 },
  { top: "68%", dur: 4.5, del: 2.80, color: 2 },
  { top: "42%", dur: 5.0, del: 3.15, color: 0 },
  { top: "82%", dur: 4.9, del: 3.50, color: 1 },
  { top: "12%", dur: 5.2, del: 3.85, color: 2 },
] as const;
const STREAM_COLORS = ["var(--accent)", "var(--accent-2)", "var(--highlight)"] as const;

const stats = [
  { icon: Globe2,     value: "80%", label: "of buyers use AI for research" },
  { icon: Brain,      value: "3×",  label: "more leads from AI-cited brands" },
  { icon: TrendingUp, value: "92%", label: "B2B decisions start with AI" },
];

const floatingBubbles = [
  { text: "Best solar company in Mexico City?",  delay: 0,   side: "left",  top: "36%" },
  { text: "Top law firms in London for M&A?",   delay: 1.6, side: "right", top: "26%" },
  { text: "AI-powered HR software Berlin?",   delay: 3.2, side: "right", top: "60%" },
];

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
      {/* Animated Hero Background */}
      <AnimatedHeroBackground />

      {/* Orbiting Circles */}
      <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-[var(--border)] opacity-10" />

        {/* Orbit 1 - 20s */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute w-4 h-4 rounded-full bg-[var(--accent)] top-0 left-1/2 -translate-x-1/2 shadow-lg"
            style={{ boxShadow: "0 0 20px var(--accent-glow)" }} />
        </motion.div>

        {/* Orbit 2 - 26s reverse */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute w-3 h-3 rounded-full bg-[var(--accent-2)] right-0 top-1/2 -translate-y-1/2 shadow-lg"
            style={{ boxShadow: "0 0 16px var(--accent-2-glow)" }} />
        </motion.div>

        {/* Orbit 3 - 16s */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute w-4 h-4 rounded-full bg-[var(--highlight)] bottom-0 left-1/2 -translate-x-1/2 shadow-lg"
            style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.4)" }} />
        </motion.div>
      </div>

      {/* Particle Stream — CSS-only, no Math.random() in render */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {STREAM_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: STREAM_COLORS[p.color],
              top: p.top,
              left: "10%",
              willChange: "transform, opacity",
              animation: `stream-particle ${p.dur}s ease-in ${p.del}s infinite`,
            }}
          />
        ))}
      </div>

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
            AI Engine Optimization Agency · Trusted Globally
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

        {/* Platform rotator with logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="flex items-center justify-center gap-3 mb-5 h-10"
        >
          <span className="text-sm text-[var(--muted)]">Appearing on</span>
          <motion.div
            key={platformIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -6 }}
            transition={{ duration: 0.22 }}
          >
            <AiPlatformBadge platform={aiPlatforms[platformIndex]} />
          </motion.div>
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
          <Link href="/audit" className="btn-primary group">
            Get Your Free AI Visibility Audit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/ai-engine-optimization" className="btn-secondary group">
            <Play className="w-4 h-4 text-[var(--accent)]" />
            See How It Works
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
