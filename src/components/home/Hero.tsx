"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, Globe2, Brain, TrendingUp, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

const aiPlatforms = ["ChatGPT", "Gemini", "Claude", "Perplexity", "Google AI"];

const stats = [
  { icon: Globe2,    value: "80%",  label: "of buyers now use AI for research" },
  { icon: Brain,     value: "3×",   label: "more leads from AI-cited brands" },
  { icon: TrendingUp,value: "92%",  label: "B2B decisions start with an AI query" },
];

const floatingBubbles = [
  { text: "Best solar company in Nairobi?",   delay: 0,   side: "left",  top: "38%" },
  { text: "Top law firms in East Africa?",    delay: 1.6, side: "right", top: "28%" },
  { text: "AI-powered HR software Kenya?",    delay: 3.2, side: "right", top: "62%" },
];

function HeroLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <Image
      src="/Logo.png"
      alt="TechFind International Consulting"
      width={320}
      height={86}
      priority
      className={`h-20 md:h-24 lg:h-28 w-auto object-contain animate-logo-reveal logo-hero-glow ${
        isDark ? "brightness-0 invert" : ""
      }`}
      style={{
        filter: isDark
          ? "brightness(0) invert(1) drop-shadow(0 8px 32px rgba(124,58,237,0.4))"
          : "drop-shadow(0 6px 24px rgba(124,58,237,0.18)) drop-shadow(0 2px 6px rgba(37,99,235,0.10))",
      }}
    />
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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20 section-tinted">

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-accent animate-orb  absolute -top-40 -left-32  w-[700px] h-[700px] opacity-40" />
      <div className="orb orb-blue  animate-orb-2 absolute -bottom-40 -right-32 w-[500px] h-[500px] opacity-30" />
      <div className="orb orb-cyan  animate-orb-3 absolute top-1/3 right-1/4   w-[300px] h-[300px] opacity-20" />

      {/* ── Floating query bubbles ── */}
      {floatingBubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 + i * 0.3, duration: 0.6 }}
          className="absolute hidden xl:block"
          style={b.side === "left" ? { left: "3%", top: b.top } : { right: "3%", top: b.top }}
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">

        {/* ══════════════════════════════════════
            LOGO — THE CENTREPIECE
        ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 relative"
        >
          {/* Halo ring behind logo */}
          <div
            className="absolute inset-0 rounded-full blur-3xl scale-150 animate-pulse-glow pointer-events-none"
            style={{ background: "radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)" }}
          />
          <HeroLogo />
        </motion.div>

        {/* ── Divider line ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-px mb-8 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent)" }}
        />

        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="inline-block mb-6"
        >
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Africa&apos;s First AI Engine Optimization Agency
          </span>
        </motion.div>

        {/* ── Main headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-[1.0] text-[var(--text)]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Get Your Business
          <br />
          <span className="gradient-text">Recommended by AI.</span>
        </motion.h1>

        {/* ── Platform rotator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
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

        {/* ── Subheadline ── */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          TechFind Consulting helps brands rank, appear, and get cited across ChatGPT,
          Gemini, Claude, Perplexity, and Google AI — globally.
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
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

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8 }}
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

      {/* ── Scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
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
