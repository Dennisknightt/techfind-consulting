"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { EyeOff, Brain, Quote, Star, TrendingUp, ArrowRight } from "lucide-react";

const stages = [
  {
    icon: EyeOff,
    step: "01",
    title: "Invisible Brand",
    description: "AI systems don't know your business exists. You're losing leads to competitors every time someone asks AI for a recommendation.",
    statusLabel: "where most businesses are",
    accentColor: "var(--highlight)",
    bg: "rgba(8,145,178,0.08)",
    border: "rgba(8,145,178,0.2)",
  },
  {
    icon: Brain,
    step: "02",
    title: "Understood by AI",
    description: "We structure your entity, schema, and knowledge graph presence so AI systems clearly understand what your business does and who it serves.",
    statusLabel: "Phase 1",
    accentColor: "var(--accent-2)",
    bg: "var(--accent-2-glow)",
    border: "rgba(59,130,246,0.25)",
  },
  {
    icon: Quote,
    step: "03",
    title: "Cited by AI",
    description: "Through authority content, digital PR, and citation building, your brand becomes a source that AI engines pull from and quote in their responses.",
    statusLabel: "Phase 2",
    accentColor: "var(--accent)",
    bg: "var(--accent-glow)",
    border: "var(--border-accent)",
  },
  {
    icon: Star,
    step: "04",
    title: "Recommended by AI",
    description: "Your business appears in AI-generated recommendation lists and comparisons. Buyers see your brand before they visit any website.",
    statusLabel: "Phase 3",
    accentColor: "var(--accent)",
    bg: "var(--accent-glow)",
    border: "var(--border-accent)",
  },
  {
    icon: TrendingUp,
    step: "05",
    title: "Leads Generated",
    description: "High-intent buyers — already primed by AI — contact your business directly. These are warm leads who AI has already convinced to trust you.",
    statusLabel: "The outcome",
    accentColor: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
];

export function ScrollStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="orb orb-accent animate-orb absolute left-1/4 top-1/3 w-64 h-64 opacity-25" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block mb-4">
            <span className="section-label">The AEO Journey</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            From{" "}
            <span className="text-[var(--muted)]">Invisible</span>{" "}
            to{" "}
            <span className="gradient-text">AI-Recommended</span>
          </motion.h2>
        </div>

        <div ref={containerRef} className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block opacity-20"
            style={{ background: "var(--border)" }}
          />
          <motion.div
            className="absolute left-1/2 top-0 w-px hidden lg:block origin-top"
            style={{
              scaleY: scrollYProgress,
              height: "100%",
              background: "linear-gradient(to bottom, var(--accent), var(--accent-2))",
            }}
          />

          <div className="space-y-12 lg:space-y-0">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-12 items-center mb-12`}
                >
                  <div className={isLeft ? "lg:text-right lg:flex lg:justify-end" : "lg:col-start-2"}>
                    <div
                      className="surface surface-hover rounded-2xl p-6 max-w-sm text-left group cursor-default"
                      style={{ borderColor: stage.border }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: stage.bg, border: `1px solid ${stage.border}` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: stage.accentColor }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-[var(--muted)]">Step {stage.step}</span>
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: stage.bg, color: stage.accentColor, border: `1px solid ${stage.border}` }}
                            >
                              {stage.statusLabel}
                            </span>
                          </div>
                          <h3
                            className="text-lg font-bold"
                            style={{ fontFamily: "var(--font-space)", color: stage.accentColor }}
                          >
                            {stage.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[var(--muted)] text-sm leading-relaxed">{stage.description}</p>
                    </div>
                  </div>

                  {/* Centre dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center"
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ background: stage.bg, borderColor: stage.accentColor }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: stage.accentColor }} />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-[var(--muted)] text-sm mb-4">Ready to start the journey?</p>
          <Link href="/ai-visibility-audit" className="btn-primary group inline-flex">
            Start with Your AI Audit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
