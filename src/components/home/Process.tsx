"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Target, Settings, Shield, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  { number: "01", icon: Search,    title: "AI Visibility Audit",        description: "We run a comprehensive audit of how AI systems currently perceive your brand — what they know, what they misunderstand, and where you're missing from AI responses.", deliverable: "AI Presence Report + Gap Analysis", duration: "Week 1" },
  { number: "02", icon: Target,    title: "AEO Strategy",                description: "We build a custom AI Engine Optimization strategy based on your industry, target queries, competitor AI presence, and the specific AI platforms your buyers use.", deliverable: "90-Day AEO Roadmap", duration: "Week 2" },
  { number: "03", icon: Settings,  title: "Website & Entity Optimization", description: "We optimise your website's structured data, entity information, knowledge graph signals, and content architecture so AI can understand and trust your business.", deliverable: "Technical AEO Implementation", duration: "Weeks 3–5" },
  { number: "04", icon: Shield,    title: "Authority Building",           description: "We create citation-worthy content, secure digital PR placements, and build the reputation signals that make AI systems confident recommending your brand.", deliverable: "Authority Content + Citations", duration: "Months 2–4" },
  { number: "05", icon: BarChart3, title: "AI Monitoring & Reporting",    description: "Monthly reporting on your AI visibility score, citation rate, competitor positioning, and lead attribution — so you always know what's working.", deliverable: "Monthly AI Visibility Dashboard", duration: "Ongoing" },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="orb orb-blue animate-orb-2 absolute top-0 right-0 w-80 h-80 opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="inline-block mb-4">
            <span className="section-label">How We Work</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            A Systematic Path to
            <br />
            <span className="gradient-text">AI Visibility</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-lg mx-auto"
          >
            Every TechFind engagement follows a proven 5-step framework — built on data, not guesswork.
          </motion.p>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.08 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="surface surface-hover rounded-2xl p-6 flex flex-col md:flex-row items-start gap-6 group"
              >
                {/* Step number */}
                <div className="flex items-center gap-4 md:w-48 shrink-0">
                  <span
                    className="text-6xl font-bold opacity-[0.06] select-none text-[var(--text)]"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    {step.number}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
                  >
                    <Icon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-bold text-[var(--text)] text-lg" style={{ fontFamily: "var(--font-space)" }}>
                      {step.title}
                    </h3>
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}
                    >
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Deliverable */}
                <div className="shrink-0 md:text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] opacity-60 mb-1">Deliverable</p>
                  <p className="text-xs font-semibold text-[var(--accent)]">{step.deliverable}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className="text-center mt-12"
        >
          <Link href="/ai-visibility-audit" className="btn-primary group inline-flex">
            Start Step 1: Book Your Audit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
