"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function AutomationPageHero() {
  return (
    <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="orb orb-cyan animate-orb-3 absolute -top-20 -right-20 w-[500px] h-[500px] opacity-25" />
      <div className="orb orb-blue animate-orb-2 absolute bottom-0 left-0 w-80 h-80 opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-8">
          <span className="section-label" style={{ color: "#10b981", background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}>
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Operations
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--text)]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          AI Business
          <br />
          <span className="gradient-text">Automation</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[var(--muted)] text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Eliminate manual work, close leads faster, and scale operations without scaling headcount. We build AI systems that run your business while you focus on growth.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link href="/contact" className="btn-primary group inline-flex">
            Book Automation Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
