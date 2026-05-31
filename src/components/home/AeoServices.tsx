"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Database, FileCode2, PenLine, Star, Newspaper, BarChart3, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  { icon: Search,    title: "AI Visibility Audit",        description: "Deep analysis of how AI systems currently perceive, understand, and cite your brand — with a detailed gap report.", tag: "Start Here" },
  { icon: Database,  title: "Entity Optimization",         description: "Structure your business identity so AI systems clearly understand who you are, what you do, and why you're trustworthy." },
  { icon: FileCode2, title: "Structured Data & Schema",    description: "Implement advanced schema markup that feeds machine-readable signals directly to AI crawlers and knowledge graphs." },
  { icon: PenLine,   title: "Authority Content",           description: "Create AI-citation-ready content — comprehensive, structured articles that AI engines pull from as authoritative sources." },
  { icon: Star,      title: "Review & Reputation Signals", description: "Optimise your review profile so AI engines surface your business with high confidence scores." },
  { icon: Newspaper, title: "Digital PR & Citations",      description: "Secure mentions and citations in publications that AI systems treat as authoritative references." },
  { icon: BarChart3, title: "AI Search Monitoring",        description: "Track how your brand appears across ChatGPT, Gemini, Perplexity, and Claude with monthly dashboards." },
  { icon: Trophy,    title: "Competitive AI Ranking",      description: "Know exactly where competitors rank in AI responses versus your brand, and what's driving the gap." },
];

export function AeoServices() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="orb orb-accent animate-orb absolute top-0 right-0 w-80 h-80 opacity-30" />
      <div className="orb orb-blue animate-orb-2 absolute bottom-0 left-0 w-80 h-80 opacity-25" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="inline-block mb-4">
            <span className="section-label">Core Services</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Everything You Need to
            <br />
            <span className="gradient-text">Dominate AI Search</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-xl mx-auto"
          >
            A complete AI Engine Optimization system — from audit to ongoing monitoring.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 + i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative surface surface-hover rounded-2xl p-5 cursor-pointer group overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-glow), var(--accent-2-glow))",
                    opacity: hovered === i ? 1 : 0,
                  }}
                />

                {s.tag && (
                  <span className="absolute -top-px -right-px text-[9px] font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white px-2 py-0.5 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">
                    {s.tag}
                  </span>
                )}

                <div className="relative z-10">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{ background: "var(--card-hover)" }}
                  >
                    <Icon className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--highlight)] transition-colors" />
                  </div>
                  <h3 className="font-semibold text-[var(--text)] text-sm mb-2 leading-snug" style={{ fontFamily: "var(--font-space)" }}>
                    {s.title}
                  </h3>
                  <p className="text-[var(--muted)] text-xs leading-relaxed">{s.description}</p>
                </div>

                <motion.div
                  animate={{ opacity: hovered === i ? 1 : 0, x: hovered === i ? 0 : -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-4 right-4"
                >
                  <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link href="/ai-engine-optimization" className="btn-primary group inline-flex">
            Explore Full AEO Service
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
