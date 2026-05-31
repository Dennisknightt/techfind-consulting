"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Globe2, Brain, TrendingUp, Sparkles } from "lucide-react";

const aiPlatforms = ["ChatGPT", "Gemini", "Claude", "Perplexity", "Google AI"];

const floatingBubbles = [
  { text: "Best solar company in Nairobi?", delay: 0, x: "-4%", y: "32%" },
  { text: "Top law firms in East Africa?", delay: 1.5, x: "77%", y: "22%" },
  { text: "AI-powered HR software Kenya?", delay: 3, x: "78%", y: "64%" },
];

const stats = [
  { icon: Globe2, value: "80%", label: "of buyers now use AI for research" },
  { icon: Brain, value: "3×", label: "more leads from AI-cited brands" },
  { icon: TrendingUp, value: "92%", label: "B2B decisions start with an AI query" },
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
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Ambient background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-accent animate-orb absolute -top-40 -left-40 w-[600px] h-[600px] opacity-60" />
      <div className="orb orb-blue animate-orb-2 absolute -bottom-40 -right-40 w-[500px] h-[500px] opacity-50" />
      <div className="orb orb-cyan animate-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 opacity-30" />

      {/* Floating query bubbles */}
      {floatingBubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 + i * 0.3, duration: 0.6 }}
          className="absolute hidden xl:block"
          style={{ left: b.x, top: b.y }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
            className="surface rounded-2xl px-4 py-3 max-w-[210px] shadow-[var(--shadow-md)]"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] mt-0.5 shrink-0" />
              <p className="text-xs text-[var(--muted)] leading-relaxed">{b.text}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-8"
        >
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            The Future of Business Discovery is Here
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 leading-[0.95] text-[var(--text)]"
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
          transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-3 mb-6 h-8"
        >
          <span className="text-sm text-[var(--muted)]">Appearing on</span>
          <motion.span
            key={platformIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
            transition={{ duration: 0.22 }}
            className="text-sm font-semibold text-[var(--accent)] surface px-3 py-1 rounded-full"
          >
            {aiPlatforms[platformIndex]}
          </motion.span>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          TechFind Consulting helps brands rank, appear, and get cited across ChatGPT,
          Gemini, Claude, Perplexity, and Google AI search experiences.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
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
                style={{ fontFamily: "var(--font-space)" }}
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
        <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] opacity-50">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[var(--accent)] to-transparent opacity-40"
        />
      </motion.div>
    </section>
  );
}
