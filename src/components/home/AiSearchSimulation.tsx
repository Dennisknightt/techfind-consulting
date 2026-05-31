"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Sparkles, Star, CheckCircle2, TrendingUp, Award } from "lucide-react";

const aiResults = [
  {
    name: "SunPower Kenya",
    badge: "Top Rated",
    rating: 4.9,
    reviews: 312,
    description:
      "Leading solar installation company in Nairobi with certified engineers and 10-year warranty on all residential and commercial projects.",
    tags: ["AI Recommended", "Certified", "Nairobi"],
    badgeColor: "text-[var(--accent-2)] bg-[var(--accent-2-glow)]",
    ringColor: "border-[var(--accent-2)]",
  },
  {
    name: "BrightSolar East Africa",
    badge: "Best Value",
    rating: 4.7,
    reviews: 189,
    description:
      "Affordable solar solutions across Kenya, Tanzania & Uganda. Government-accredited with M-PESA financing available.",
    tags: ["Verified", "Financing", "East Africa"],
    badgeColor: "text-[var(--accent)] bg-[var(--accent-glow)]",
    ringColor: "border-[var(--accent)]",
  },
  {
    name: "GreenEnergy Solutions",
    badge: "Expert Approved",
    rating: 4.8,
    reviews: 247,
    description:
      "Commercial and industrial solar specialists. Featured in Forbes Africa's top clean energy companies 2024.",
    tags: ["Commercial", "Award Winning", "Kenya"],
    badgeColor: "text-[var(--highlight)] bg-[var(--accent-glow)]",
    ringColor: "border-[var(--highlight)]",
  },
];

const queryText = "Best solar company in Kenya?";

export function AiSearchSimulation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [phase, setPhase] = useState<"idle" | "typing" | "thinking" | "results">("idle");
  const [typedText, setTypedText] = useState("");
  const [visibleResults, setVisibleResults] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView) return;
    const run = async () => {
      await new Promise((r) => setTimeout(r, 400));
      setPhase("typing");
      for (let i = 0; i <= queryText.length; i++) {
        await new Promise((r) => setTimeout(r, 46));
        setTypedText(queryText.slice(0, i));
      }
      await new Promise((r) => setTimeout(r, 380));
      setPhase("thinking");
      await new Promise((r) => setTimeout(r, 1800));
      setPhase("results");
      for (let i = 0; i < aiResults.length; i++) {
        await new Promise((r) => setTimeout(r, 280));
        setVisibleResults((p) => [...p, i]);
      }
    };
    run();
  }, [isInView]);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="orb orb-accent animate-orb absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-40" />

      <div className="relative max-w-6xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="inline-block mb-4"
          >
            <span className="section-label">AI Search in Action</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            When Buyers Ask AI,
            <br />
            <span className="gradient-text">Who Gets Recommended?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-lg mx-auto text-lg"
          >
            Watch how AI surfaces trusted, optimised businesses — and how we put you in that response.
          </motion.p>
        </div>

        {/* Simulation window */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="surface rounded-3xl overflow-hidden shadow-[var(--shadow-md)]">
            {/* Window chrome */}
            <div
              className="flex items-center gap-3 px-5 py-4 border-b"
              style={{ borderColor: "var(--border)", background: "var(--card-hover)" }}
            >
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <span className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 text-center">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-[var(--muted)]"
                  style={{ background: "var(--card)" }}
                >
                  <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                  AI Business Search Engine
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* User bubble */}
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, x: 16, scale: 0.96 }}
                  animate={phase !== "idle" ? { opacity: 1, x: 0, scale: 1 } : {}}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl rounded-tr-sm px-5 py-3.5 max-w-sm"
                  style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
                >
                  <p className="text-sm text-[var(--text)]">
                    {typedText}
                    {phase === "typing" && (
                      <span className="cursor-blink ml-0.5 inline-block w-0.5 h-4 bg-[var(--accent)] align-middle" />
                    )}
                  </p>
                </motion.div>
              </div>

              {/* Thinking indicator */}
              <AnimatePresence>
                {phase === "thinking" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="surface rounded-2xl rounded-tl-sm px-5 py-3.5">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 rounded-full bg-[var(--accent)]"
                          />
                        ))}
                      </div>
                      <p className="text-[var(--muted)] text-xs mt-2">Analysing trusted sources…</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {phase === "results" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shrink-0 mt-1 shadow-[var(--shadow-sm)]">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div
                        className="surface rounded-2xl rounded-tl-sm px-5 py-3.5 mb-4"
                      >
                        <p className="text-sm text-[var(--muted)]">
                          Here are the top-rated solar companies in Kenya, based on verified
                          reviews, certifications, and trusted industry citations:
                        </p>
                      </div>

                      {aiResults.map((result, i) => (
                        <AnimatePresence key={i}>
                          {visibleResults.includes(i) && (
                            <motion.div
                              initial={{ opacity: 0, x: -16, scale: 0.97 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className={`relative surface rounded-xl p-4 border ${result.ringColor}/20`}
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-[var(--text)] text-sm" style={{ fontFamily: "var(--font-space)" }}>
                                      {result.name}
                                    </span>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${result.badgeColor}`}>
                                      {result.badge}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <span className="text-amber-500 text-xs font-semibold">{result.rating}</span>
                                    <span className="text-[var(--muted)] text-xs">({result.reviews})</span>
                                  </div>
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              </div>
                              <p className="text-[var(--muted)] text-xs leading-relaxed mb-2.5">{result.description}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {result.tags.map((t) => (
                                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full surface text-[var(--muted)]">{t}</span>
                                ))}
                              </div>
                              {i === 0 && (
                                <div className="absolute -top-2.5 -right-2">
                                  <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                    <Award className="w-2.5 h-2.5" />
                                    AI Top Pick
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={phase === "results" ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="text-center text-[var(--muted)] text-sm mt-5"
          >
            <TrendingUp className="w-4 h-4 inline mr-1 text-[var(--accent)]" />
            Optimised brands appear in AI answers. Unoptimised brands don&apos;t exist.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
