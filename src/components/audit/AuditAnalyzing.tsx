"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Globe, Search, BarChart3, Shield, Zap } from "lucide-react";

const steps = [
  { icon: Globe,    label: "Scanning website structure…",          color: "var(--accent)" },
  { icon: Search,   label: "Querying ChatGPT, Gemini & Perplexity…", color: "var(--accent-2)" },
  { icon: Brain,    label: "Analysing entity recognition…",         color: "var(--highlight)" },
  { icon: BarChart3,label: "Benchmarking against competitors…",     color: "var(--accent)" },
  { icon: Shield,   label: "Calculating authority signals…",        color: "var(--accent-2)" },
  { icon: Zap,      label: "Generating AI Visibility Score…",       color: "var(--highlight)" },
];

interface Props { url: string; }

export function AuditAnalyzing({ url }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = 3600;
    const stepDur = total / steps.length;
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += 60;
      setProgress(Math.min(99, Math.round((elapsed / total) * 100)));
      setActiveStep(Math.min(steps.length - 1, Math.floor(elapsed / stepDur)));
      if (elapsed >= total) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="orb orb-accent animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20" />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Pulse ring */}
        <div className="relative mx-auto mb-10 w-28 h-28">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--accent-glow)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--accent-glow)" }}
          />
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: "var(--card)", border: "1px solid var(--border-accent)" }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Brain className="w-10 h-10" style={{ color: "var(--accent)" }} />
            </motion.div>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-2"
          style={{ fontFamily: "var(--font-space)" }}
        >
          Auditing your AI visibility…
        </motion.h2>
        <p className="text-[var(--muted)] text-sm mb-8 truncate max-w-xs mx-auto">{url}</p>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full mb-6" style={{ background: "var(--border)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-[var(--muted)] mb-8">{progress}% complete</p>

        {/* Steps */}
        <div className="space-y-2.5 text-left">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const state = i < activeStep ? "done" : i === activeStep ? "active" : "pending";
            return (
              <AnimatePresence key={i} mode="wait">
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: state === "pending" ? 0.3 : 1 }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{
                    background: state === "active" ? "var(--card-hover)" : "transparent",
                    border: state === "active" ? "1px solid var(--border-accent)" : "1px solid transparent",
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color: state === "done" ? "#10b981" : s.color }} />
                  <span className="text-sm" style={{ color: state === "done" ? "#10b981" : "var(--muted)" }}>
                    {state === "done" ? "✓ " : ""}{s.label}
                  </span>
                  {state === "active" && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-auto text-xs font-semibold"
                      style={{ color: s.color }}
                    >
                      Running
                    </motion.span>
                  )}
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </section>
  );
}
