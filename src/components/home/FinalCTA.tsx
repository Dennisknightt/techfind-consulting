"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const checks = [
  "No long-term contracts required",
  "Results visible within 60 days",
  "Africa-based team, global standards",
];

export function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="orb orb-accent animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-30" />
      <div className="orb orb-blue animate-orb-2 absolute top-1/4 left-1/4 w-60 h-60 opacity-20" />
      <div className="orb orb-cyan animate-orb-3 absolute bottom-1/4 right-1/4 w-60 h-60 opacity-15" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block mb-8"
        >
          <span className="section-label">
            <Zap className="w-3.5 h-3.5" />
            Start Today. See Results in 60 Days.
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--text)]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Find out if AI
          <br />
          <span className="gradient-text">recommends your</span>
          <br />
          business.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[var(--muted)] text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto"
        >
          Your competitors are already building their AI presence. Every day without an AEO
          strategy is a day of lost leads.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-center gap-10 mb-10"
        >
          {[
            { value: 50, suffix: "+", label: "brands optimised" },
            { value: 94, suffix: "%", label: "avg. visibility improvement" },
            { value: 60, suffix: " days", label: "to first results" },
          ].map(({ value, suffix, label }, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-space)" }}>
                <AnimatedCounter end={value} suffix={suffix} />
              </div>
              <div className="text-xs text-[var(--muted)]">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <Link href="/audit" className="btn-primary text-base px-8 py-5 group inline-flex">
            Get Your Free AI Visibility Audit
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Trust checks */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {checks.map((check, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {check}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
