"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EyeOff, Brain, Quote, Star, TrendingUp, ArrowRight } from "lucide-react";

const stages = [
  {
    icon: EyeOff,
    step: "01",
    title: "Invisible Brand",
    description:
      "AI systems don't know your business exists. You're losing leads to competitors every time someone asks AI for a recommendation.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    status: "current for most",
    statusColor: "bg-red-500/20 text-red-300",
  },
  {
    icon: Brain,
    step: "02",
    title: "Understood by AI",
    description:
      "We structure your entity, schema, and knowledge graph presence so AI systems clearly understand what your business does and who it serves.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    status: "phase 1",
    statusColor: "bg-yellow-500/20 text-yellow-300",
  },
  {
    icon: Quote,
    step: "03",
    title: "Cited by AI",
    description:
      "Through authority content, digital PR, and citation building, your brand becomes a source that AI engines pull from and quote in their responses.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    status: "phase 2",
    statusColor: "bg-blue-500/20 text-blue-300",
  },
  {
    icon: Star,
    step: "04",
    title: "Recommended by AI",
    description:
      "Your business appears in AI-generated recommendation lists, answers, and comparisons. Buyers see your brand before they ever visit a website.",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    status: "phase 3",
    statusColor: "bg-violet-500/20 text-violet-300",
  },
  {
    icon: TrendingUp,
    step: "05",
    title: "Leads Generated",
    description:
      "High-intent buyers — already primed by AI — contact your business directly. These are warm leads who AI has already convinced to trust you.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    status: "the outcome",
    statusColor: "bg-emerald-500/20 text-emerald-300",
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/60 to-transparent" />
      <div className="absolute left-1/4 top-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4"
          >
            The AEO Journey
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            From{" "}
            <span className="text-white/30">Invisible</span>{" "}
            to{" "}
            <span className="gradient-text">AI-Recommended</span>
          </motion.h2>
        </div>

        {/* Journey timeline */}
        <div ref={containerRef} className="relative">
          {/* Progress line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden lg:block" />
          <motion.div
            className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-blue-500 to-violet-500 hidden lg:block origin-top"
            style={{ scaleY: scrollYProgress, height: "100%" }}
          />

          <div className="space-y-12 lg:space-y-0">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-12 items-center mb-12`}
                >
                  {/* Left/Right content */}
                  <div className={isLeft ? "lg:text-right" : "lg:col-start-2"}>
                    <div
                      className={`inline-block glass border ${stage.borderColor} rounded-2xl p-6 text-left max-w-sm group hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${stage.bgColor} border ${stage.borderColor} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${stage.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/20 text-xs font-mono">
                              Step {stage.step}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stage.statusColor}`}>
                              {stage.status}
                            </span>
                          </div>
                          <h3
                            className={`text-xl font-black ${stage.color}`}
                            style={{ fontFamily: "var(--font-syne)" }}
                          >
                            {stage.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      className={`w-5 h-5 rounded-full ${stage.bgColor} border-2 ${stage.borderColor} flex items-center justify-center`}
                    >
                      <div className={`w-2 h-2 rounded-full ${stage.color} bg-current`} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/30 text-sm mb-4">Ready to start the journey?</p>
          <a
            href="/ai-visibility-audit"
            className="inline-flex items-center gap-2 text-sm font-medium px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 group"
          >
            Start with Your AI Audit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
