"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search, Brain, Star } from "lucide-react";

export function AeoPageHero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-accent animate-orb absolute -top-20 -left-20 w-[500px] h-[500px] opacity-30" />
      <div className="orb orb-blue animate-orb-2 absolute -bottom-10 -right-10 w-80 h-80 opacity-25" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-8">
          <span className="section-label"><Search className="w-3.5 h-3.5" />The New Frontier of Business Discovery</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--text)]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          AI Engine
          <br />
          <span className="gradient-text">Optimization</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          AEO is the practice of making your brand discoverable, understandable, and
          recommendable by AI systems — the new search engines for modern buyers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Link href="/audit" className="btn-primary group">
            Check Your AI Visibility Score
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/contact" className="btn-secondary">
            Talk to a Strategist
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: Search, label: "AI Discoverability" },
            { icon: Brain,  label: "Entity Understanding" },
            { icon: Star,   label: "AI Recommendations" },
          ].map(({ icon: Icon, label }, i) => (
            <div key={i} className="surface flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--muted)]">
              <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
