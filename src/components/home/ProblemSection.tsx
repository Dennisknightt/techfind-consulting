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
    statLabel: "of Gen Z now use AI first",
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
    stat: "3x",
    statLabel: "higher conversion from AI leads",
  },
];

const queries = [
  "Best hospital near me?",
  "Trusted law firm for corporate work?",
  "Top interior designer in Nairobi?",
  "Best hotel for a business trip?",
  "Reliable solar installation company?",
  "Which recruitment agency is best?",
];

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/80 to-transparent" />

      {/* Query marquee */}
      <div className="absolute top-8 left-0 right-0 overflow-hidden opacity-20">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...queries, ...queries].map((q, i) => (
            <span key={i} className="text-white/60 text-sm font-medium px-4 py-1.5 glass border border-white/10 rounded-full">
              "{q}"
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-2 text-amber-400 text-xs font-medium border border-amber-500/30 bg-amber-500/10 rounded-full px-3 py-1.5 mb-6"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              The Search Behavior Shift
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Your customers are no longer{" "}
              <span className="relative">
                <span className="text-white/30 line-through decoration-red-500">only searching on Google.</span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed mb-6"
            >
              Today&apos;s buyers open ChatGPT, Gemini, or Perplexity and ask:{" "}
              <em className="text-white/70 not-italic font-medium">
                &quot;Which company should I hire for this?&quot;
              </em>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="text-white/50 text-lg leading-relaxed mb-8"
            >
              AI systems respond with recommended companies, comparison breakdowns, service
              providers, price ranges, and trust signals — without ever loading a search results page.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="p-5 glass-blue border border-blue-500/20 rounded-2xl mb-8"
            >
              <p className="text-blue-200 font-semibold text-lg mb-1">
                If AI doesn&apos;t know you exist —
              </p>
              <p className="text-white/60">
                your competitors are getting all the AI-generated leads. This is the new
                first-mover advantage.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
            >
              <Link
                href="/ai-engine-optimization"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
              >
                Learn what AEO is
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Shift cards */}
          <div className="space-y-4">
            {shifts.map(({ old, new: newLabel, icon: Icon, stat, statLabel }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass border border-white/5 rounded-2xl p-5 group hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors shrink-0">
                    <Icon className="w-5 h-5 text-white/40 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm text-white/30 line-through">{old}</span>
                      <ChevronRight className="w-3 h-3 text-blue-500" />
                      <span className="text-sm text-white font-medium">{newLabel}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-black gradient-text" style={{ fontFamily: "var(--font-syne)" }}>
                      {stat}
                    </div>
                    <div className="text-[10px] text-white/30 leading-tight max-w-[80px] text-right">
                      {statLabel}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Bottom callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
              className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-600/15 to-violet-600/15 border border-blue-500/20"
            >
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl" />
              <p className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-syne)" }}>
                AI is the new search engine.
              </p>
              <p className="text-white/50 text-sm">
                AEO (AI Engine Optimization) is the new SEO. We make sure AI
                recommends your business.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
