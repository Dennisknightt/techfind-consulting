"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, ArrowUpRight, Sun, Scale, ShoppingBag } from "lucide-react";
import Link from "next/link";

const caseStudies = [
  {
    icon: Sun,
    tag: "AI Engine Optimization",
    industry: "Solar Energy",
    company: "SunBright Energy Kenya",
    headline: "From invisible to AI's #1 pick for solar installation in Nairobi",
    challenge: "SunBright had great product and strong reviews but was never mentioned when buyers searched for solar companies in Kenya across AI platforms.",
    metrics: [
      { label: "AI Visibility Score", before: "4%", after: "94%" },
      { label: "Inbound Lead Increase", value: "+312%" },
      { label: "Revenue Growth (6 months)", value: "+$180K" },
    ],
    accentColor: "var(--highlight)",
    accentBg: "rgba(8,145,178,0.08)",
    accentBorder: "rgba(8,145,178,0.2)",
    tagBg: "rgba(8,145,178,0.08)",
    tagColor: "var(--highlight)",
    duration: "4 months",
  },
  {
    icon: Scale,
    tag: "AI Engine Optimization",
    industry: "Legal Services",
    company: "Kariuki & Associates Advocates",
    headline: "Top corporate law firm now cited by AI as a trusted legal authority",
    challenge: "The firm had 20+ years of experience but AI systems didn't recognise them as an authority — newer, better-optimised firms were capturing all AI referrals.",
    metrics: [
      { label: "AI Citation Rate", before: "0", after: "43/month" },
      { label: "New Corporate Client Inquiries", value: "+218%" },
      { label: "Client Acquisition Cost", value: "−60%" },
    ],
    accentColor: "var(--accent-2)",
    accentBg: "var(--accent-2-glow)",
    accentBorder: "rgba(59,130,246,0.25)",
    tagBg: "var(--accent-2-glow)",
    tagColor: "var(--accent-2)",
    duration: "6 months",
  },
  {
    icon: ShoppingBag,
    tag: "AI Business Automation",
    industry: "E-Commerce",
    company: "Zuri Fashion House",
    headline: "WhatsApp AI agent converts 68% of browsers into buyers — 24/7",
    challenge: "Zuri's sales team was overwhelmed with WhatsApp inquiries but couldn't respond fast enough — leads went cold and the team burned out.",
    metrics: [
      { label: "Response Time", before: "4.2 hrs", after: "< 30 sec" },
      { label: "WhatsApp Conversion Rate", before: "12%", after: "68%" },
      { label: "Monthly Revenue Uplift", value: "+$42K" },
    ],
    accentColor: "var(--accent)",
    accentBg: "var(--accent-glow)",
    accentBorder: "var(--border-accent)",
    tagBg: "var(--accent-glow)",
    tagColor: "var(--accent)",
    duration: "3 weeks deployment",
  },
];

export function CaseStudies() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="orb orb-accent animate-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-15" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="inline-block mb-4">
            <span className="section-label">Client Results</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Real Results for
            <br />
            <span className="gradient-text">Real Businesses</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-xl mx-auto"
          >
            How TechFind transforms AI visibility and business operations — with measurable outcomes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
          {caseStudies.map((cs, i) => {
            const Icon = cs.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.12 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
                className="surface surface-hover rounded-3xl overflow-hidden cursor-pointer group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: cs.accentBg, border: `1px solid ${cs.accentBorder}` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cs.accentColor }} />
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: cs.tagBg, color: cs.tagColor, border: `1px solid ${cs.accentBorder}` }}
                    >
                      {cs.tag}
                    </span>
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-0.5">{cs.industry}</p>
                  <p className="text-xs text-[var(--muted)] font-medium mb-3">{cs.company}</p>
                  <h3
                    className="font-bold text-[var(--text)] text-base leading-snug mb-4"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    {cs.headline}
                  </h3>
                  <p className="text-[var(--muted)] text-xs leading-relaxed mb-5">{cs.challenge}</p>

                  {/* Metrics */}
                  <div
                    className="space-y-2.5 mb-5 pt-4 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {cs.metrics.map((m, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <span className="text-[var(--muted)] text-xs">{m.label}</span>
                        <div className="flex items-center gap-1.5">
                          {m.before && (
                            <>
                              <span className="text-[var(--muted)] text-xs line-through opacity-50">{m.before}</span>
                              <span className="text-[var(--muted)] text-[10px] opacity-40">→</span>
                              <span className="text-xs font-bold text-[var(--text)]">{m.after}</span>
                            </>
                          )}
                          {m.value && (
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />{m.value}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--muted)] text-xs">{cs.duration}</span>
                    <ArrowUpRight className="w-4 h-4 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link href="/case-studies" className="btn-secondary group inline-flex">
            View All Case Studies
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
