"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Search, BarChart3, Target, FileText } from "lucide-react";

const auditIncludes = [
  { icon: Search,    title: "AI Platform Scan",      desc: "We query ChatGPT, Gemini, Perplexity, and Claude with 50+ prompts relevant to your business and industry." },
  { icon: BarChart3, title: "AI Visibility Score",   desc: "You receive a proprietary 0–100 score showing how well AI platforms currently know and represent your brand." },
  { icon: Target,    title: "Competitor Comparison", desc: "See exactly where your competitors appear in AI responses that you're missing from." },
  { icon: FileText,  title: "AEO Strategy Report",   desc: "A detailed, actionable roadmap showing exactly what needs to change to get your brand AI-recommended." },
];

const deliverables = [
  "Current AI visibility score (0–100)",
  "AI brand perception analysis",
  "Gap identification across all major AI platforms",
  "Competitor AI positioning report",
  "Entity optimization recommendations",
  "Structured data opportunities",
  "Content gap analysis",
  "90-day AEO action plan",
  "30-minute strategy call to review findings",
];

export function AuditPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 grid-bg" />
        <div className="orb orb-accent animate-orb absolute -top-20 left-0 w-[500px] h-[500px] opacity-25" />
        <div className="orb orb-blue animate-orb-2 absolute bottom-0 right-0 w-80 h-80 opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-8">
            <span className="section-label"><Search className="w-3.5 h-3.5" />Step 1 of Every Engagement</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            AI Visibility
            <br />
            <span className="gradient-text">Audit</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Before we can get you recommended by AI, we need to understand exactly where you stand.
            The AI Visibility Audit is a comprehensive analysis of how AI systems currently perceive,
            represent, and cite your brand.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link href="/contact" className="btn-primary text-base group inline-flex">
              Book Your AI Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
              What&apos;s <span className="gradient-text">Inside the Audit</span>
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              A forensic-level analysis of your AI presence across all major AI platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {auditIncludes.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="surface surface-hover rounded-2xl p-6"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
                  >
                    <Icon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="font-bold text-[var(--text)] mb-2 text-sm" style={{ fontFamily: "var(--font-space)" }}>{item.title}</h3>
                  <p className="text-[var(--muted)] text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-[var(--text)] mb-6" style={{ fontFamily: "var(--font-space)" }}>
                What You Receive
              </h3>
              <ul className="space-y-3">
                {deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="surface rounded-3xl p-8"
              style={{ borderColor: "var(--border-accent)", background: "var(--accent-glow)" }}
            >
              <h3 className="text-2xl font-bold text-[var(--text)] mb-4" style={{ fontFamily: "var(--font-space)" }}>
                Book Your Audit
              </h3>
              <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">
                The AI Visibility Audit is the starting point for every TechFind engagement.
                Whether you&apos;re a startup or enterprise, this audit reveals exactly what AI
                systems know — and don&apos;t know — about your business.
              </p>
              <div className="space-y-3 mb-6">
                {["Industry-specific query testing", "Multi-platform AI analysis", "Competitive benchmarking", "Strategy call included"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn-primary w-full justify-center group inline-flex">
                Book Your AI Audit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
