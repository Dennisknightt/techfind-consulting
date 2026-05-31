"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageSquare, Search, Zap, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

const shifts = [
  {
    old: "Google Search",
    new: "ChatGPT, Gemini, Perplexity",
    icon: Search,
    stat: "40%",
    statLabel: "of Gen Z use AI first",
  },
  {
    old: "Review sites",
    new: "AI recommendation summaries",
    icon: MessageSquare,
    stat: "67%",
    statLabel: "prefer AI-curated answers",
  },
  {
    old: "Directory listings",
    new: "AI-cited authority sources",
    icon: Zap,
    stat: "3×",
    statLabel: "higher conversion from AI leads",
  },
];

const queries = [
  "Best hospital near me?", "Trusted law firm for corporate work?",
  "Top interior designer in Nairobi?", "Best hotel for a business trip?",
  "Reliable solar installation company?", "Which recruitment agency is best?",
  "Best hospital near me?", "Trusted law firm for corporate work?",
  "Top interior designer in Nairobi?", "Best hotel for a business trip?",
  "Reliable solar installation company?", "Which recruitment agency is best?",
];

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      {/* Query marquee — decorative */}
      <div className="absolute top-6 left-0 right-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {queries.map((q, i) => (
            <span
              key={i}
              className="surface text-[var(--muted)] text-sm px-4 py-1.5 rounded-full shrink-0"
            >
              &ldquo;{q}&rdquo;
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-block mb-6"
            >
              <span className="section-label" style={{ color: "var(--highlight)", background: "var(--orb-3)", borderColor: "rgba(8,145,178,0.25)" }}>
                <AlertTriangle className="w-3.5 h-3.5" />
                The Search Behaviour Shift
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-[var(--text)]"
              style={{ fontFamily: "var(--font-space)" }}
            >
              Your customers are no longer{" "}
              <span className="line-through text-[var(--muted)] decoration-red-400">only searching on Google.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-[var(--muted)] text-lg leading-relaxed mb-5"
            >
              Today&apos;s buyers open ChatGPT, Gemini, or Perplexity and ask:{" "}
              <em className="not-italic font-semibold text-[var(--text)]">
                &ldquo;Which company should I hire for this?&rdquo;
              </em>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="text-[var(--muted)] text-lg leading-relaxed mb-8"
            >
              AI systems respond with recommended companies, comparison breakdowns, price ranges,
              and trust signals — without showing a search results page.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="surface rounded-2xl p-5 mb-8"
              style={{ borderColor: "var(--border-accent)", background: "var(--accent-glow)" }}
            >
              <p className="font-semibold text-[var(--text)] text-lg mb-1" style={{ fontFamily: "var(--font-space)" }}>
                If AI doesn&apos;t know you exist —
              </p>
              <p className="text-[var(--muted)] text-sm">
                your competitors are capturing every AI-generated lead. This is the new first-mover advantage.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35 }}
            >
              <Link
                href="/ai-engine-optimization"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors group"
              >
                Learn what AEO is
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right — shift cards */}
          <div className="space-y-4">
            {shifts.map(({ old, new: newLabel, icon: Icon, stat, statLabel }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="surface surface-hover rounded-2xl p-5 flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ background: "var(--card-hover)" }}>
                  <Icon className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-[var(--muted)] line-through opacity-60">{old}</span>
                    <ChevronRight className="w-3 h-3 text-[var(--accent)]" />
                    <span className="text-sm font-medium text-[var(--text)]">{newLabel}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-space)" }}>{stat}</div>
                  <div className="text-[10px] text-[var(--muted)] max-w-[80px] text-right leading-tight">{statLabel}</div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{ background: "linear-gradient(135deg, var(--accent-glow), var(--accent-2-glow))", border: "1px solid var(--border-accent)" }}
            >
              <p className="text-2xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: "var(--font-space)" }}>
                AI is the new search engine.
              </p>
              <p className="text-sm text-[var(--muted)]">
                AEO (AI Engine Optimization) is the new SEO. We make sure AI recommends your business.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
