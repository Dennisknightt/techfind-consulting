"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "AI Visibility Starter",
    tagline: "For businesses new to AEO",
    description: "Perfect for businesses that want to understand their AI visibility gap and start building a foundational presence across AI search engines.",
    features: ["Full AI Visibility Audit", "Entity & knowledge graph optimization", "Structured data implementation", "2 authority content pieces/month", "Basic AI monitoring dashboard", "Monthly performance report"],
    cta: "Get Custom Quote",
    popular: false,
    badge: null,
  },
  {
    name: "AEO Growth Partner",
    tagline: "For businesses ready to dominate",
    description: "A comprehensive AI Engine Optimization retainer for businesses actively competing for AI recommendations in their industry.",
    features: ["Everything in Starter", "Competitive AI ranking reports", "4 authority content pieces/month", "Digital PR & citation building (8/mo)", "Review & reputation optimization", "WhatsApp/Slack reporting integration", "Quarterly strategy review call"],
    cta: "Get Custom Quote",
    popular: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise AI Visibility",
    tagline: "For large brands & multi-location",
    description: "Full-service AI visibility management for enterprises and businesses operating across multiple markets or verticals.",
    features: ["Everything in Growth Partner", "Multi-market & multilingual AEO", "Unlimited content production", "Aggressive PR & citation program", "Custom AI monitoring platform", "Dedicated AEO strategist", "Weekly executive reporting", "Automation services included"],
    cta: "Book a Strategy Call",
    popular: false,
    badge: "Enterprise",
  },
];

export function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="orb orb-accent animate-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="inline-block mb-4">
            <span className="section-label">Engagement Options</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Custom Pricing for
            <br />
            <span className="gradient-text">Every Business Size</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-lg mx-auto"
          >
            We don&apos;t do one-size-fits-all pricing. Every quote is built around your industry,
            competitive landscape, and growth goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative surface rounded-3xl p-7 flex flex-col ${
                plan.popular
                  ? "ring-2 ring-[var(--accent)] shadow-[0_0_40px_var(--accent-glow)] scale-[1.03] z-10"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-white" />
                    Most Popular
                  </span>
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="text-xs font-bold px-4 py-1.5 rounded-full"
                    style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xl font-bold text-[var(--text)] mb-1" style={{ fontFamily: "var(--font-space)" }}>
                  {plan.name}
                </h3>
                <p className="text-xs font-semibold text-[var(--accent)] mb-3">{plan.tagline}</p>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{plan.description}</p>
              </div>

              <div
                className="flex items-baseline gap-2 mb-6 pb-6 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="text-3xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
                  Custom Quote
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="text-[var(--muted)]">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-medium text-sm transition-all group ${
                  plan.popular ? "btn-primary" : "btn-secondary"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            All packages begin with an AI Visibility Audit to establish your baseline and strategy.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
