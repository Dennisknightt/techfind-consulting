"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

export function TalentPageHero() {
  return (
    <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="orb orb-accent animate-orb absolute -top-20 -left-20 w-[500px] h-[500px] opacity-25" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-8">
          <span className="section-label"><Users className="w-3.5 h-3.5" />Vetted Technical Talent</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--text)]"
          style={{ fontFamily: "var(--font-space)" }}
        >
          TechFind
          <br />
          <span className="gradient-text-violet">Talent Division</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[var(--muted)] text-lg max-w-2xl mx-auto leading-relaxed"
        >
          When your business needs hands-on AI and tech talent to execute, TechFind&apos;s
          Talent Division provides access to a curated network of vetted professionals.
        </motion.p>
      </div>
    </section>
  );
}
