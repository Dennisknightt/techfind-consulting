"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function CaseStudiesHero() {
  return (
    <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-28 pb-12">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="orb orb-blue animate-orb absolute top-0 right-0 w-80 h-80 opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-8">
          <span className="section-label" style={{ color: "#10b981", background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}>
            <TrendingUp className="w-3.5 h-3.5" />
            Proof of Performance
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--text)]"
          style={{ fontFamily: "var(--font-space)" }}
        >
          Results That
          <br />
          <span className="gradient-text">Speak for Themselves</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[var(--muted)] text-lg max-w-xl mx-auto"
        >
          Real client outcomes. Measurable AI visibility gains. Business results that justify the investment in AI Engine Optimization.
        </motion.p>
      </div>
    </section>
  );
}
