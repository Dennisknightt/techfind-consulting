"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { Sparkles, Star, MapPin, CheckCircle2, TrendingUp, Award } from "lucide-react";

const aiResults = [
  {
    name: "SunPower Kenya",
    badge: "Top Rated",
    rating: 4.9,
    reviews: 312,
    description:
      "Leading solar installation company in Nairobi with certified engineers and 10-year warranty on all residential and commercial projects.",
    tags: ["AI Recommended", "Certified", "Nairobi"],
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    badgeColor: "bg-blue-500/20 text-blue-300",
  },
  {
    name: "BrightSolar East Africa",
    badge: "Best Value",
    rating: 4.7,
    reviews: 189,
    description:
      "Affordable solar solutions across Kenya, Tanzania & Uganda. Government-accredited with M-PESA financing available.",
    tags: ["Verified", "Financing", "East Africa"],
    color: "from-violet-500/15 to-blue-500/15",
    borderColor: "border-violet-500/20",
    badgeColor: "bg-violet-500/20 text-violet-300",
  },
  {
    name: "GreenEnergy Solutions",
    badge: "Expert Approved",
    rating: 4.8,
    reviews: 247,
    description:
      "Commercial and industrial solar specialists. Featured in Forbes Africa's top clean energy companies 2024.",
    tags: ["Commercial", "Award Winning", "Kenya"],
    color: "from-cyan-500/10 to-blue-500/10",
    borderColor: "border-cyan-500/20",
    badgeColor: "bg-cyan-500/20 text-cyan-300",
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

    const startSequence = async () => {
      await new Promise((r) => setTimeout(r, 500));
      setPhase("typing");

      for (let i = 0; i <= queryText.length; i++) {
        await new Promise((r) => setTimeout(r, 50));
        setTypedText(queryText.slice(0, i));
      }

      await new Promise((r) => setTimeout(r, 400));
      setPhase("thinking");
      await new Promise((r) => setTimeout(r, 1800));
      setPhase("results");

      for (let i = 0; i < aiResults.length; i++) {
        await new Promise((r) => setTimeout(r, 300));
        setVisibleResults((prev) => [...prev, i]);
      }
    };

    startSequence();
  }, [isInView]);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4"
          >
            AI Search in Action
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            When Buyers Ask AI,
            <br />
            <span className="gradient-text">Who Gets Recommended?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-lg mx-auto text-lg"
          >
            Watch how AI engines surface trusted, optimized businesses — and how we get
            your brand into that response.
          </motion.p>
        </div>

        {/* Simulation window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          {/* AI Chat window */}
          <div className="glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10">
            {/* Window chrome */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-1.5 text-xs text-white/40">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  AI Business Search Engine
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User query bubble */}
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={phase !== "idle" ? { opacity: 1, x: 0, scale: 1 } : {}}
                  transition={{ duration: 0.4 }}
                  className="bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-tr-sm px-5 py-3.5 max-w-sm"
                >
                  <p className="text-white text-sm">
                    {typedText}
                    {phase === "typing" && (
                      <span className="cursor-blink ml-0.5 inline-block w-0.5 h-4 bg-blue-400 align-middle" />
                    )}
                  </p>
                </motion.div>
              </div>

              {/* AI thinking state */}
              <AnimatePresence>
                {phase === "thinking" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="glass border border-white/10 rounded-2xl rounded-tl-sm px-5 py-3.5">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 rounded-full bg-blue-400"
                          />
                        ))}
                      </div>
                      <p className="text-white/30 text-xs mt-2">Analyzing trusted sources...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Response */}
              <AnimatePresence>
                {phase === "results" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="glass border border-white/10 rounded-2xl rounded-tl-sm px-5 py-3.5 mb-4">
                        <p className="text-white/70 text-sm">
                          Here are the top-rated solar companies in Kenya, based on verified
                          reviews, certifications, and trusted industry citations:
                        </p>
                      </div>

                      {/* Result cards */}
                      {aiResults.map((result, i) => (
                        <AnimatePresence key={i}>
                          {visibleResults.includes(i) && (
                            <motion.div
                              initial={{ opacity: 0, x: -20, scale: 0.97 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className={`relative bg-gradient-to-br ${result.color} border ${result.borderColor} rounded-xl p-4`}
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-white text-sm">
                                      {result.name}
                                    </span>
                                    <span
                                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${result.badgeColor}`}
                                    >
                                      {result.badge}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-yellow-300 text-xs font-medium">
                                      {result.rating}
                                    </span>
                                    <span className="text-white/30 text-xs">
                                      ({result.reviews} reviews)
                                    </span>
                                  </div>
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                              </div>
                              <p className="text-white/50 text-xs leading-relaxed mb-2.5">
                                {result.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {result.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              {i === 0 && (
                                <div className="absolute -top-2 -right-2">
                                  <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
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

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={phase === "results" ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
            className="text-center text-white/30 text-sm mt-5"
          >
            <TrendingUp className="w-4 h-4 inline mr-1 text-blue-400" />
            Optimized brands appear in AI answers. Unoptimized brands don&apos;t exist.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
