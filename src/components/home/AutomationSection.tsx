"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, RefreshCw, GitBranch, Headphones, BarChart2, Plug, CreditCard, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const automations = [
  { icon: MessageCircle, title: "WhatsApp AI Agents",          description: "24/7 AI assistant that qualifies leads, answers questions, and books appointments directly in WhatsApp." },
  { icon: RefreshCw,     title: "Sales Follow-Up Automation",  description: "Automated follow-up sequences that nurture leads until they're ready to buy — without human intervention." },
  { icon: GitBranch,     title: "Approval Workflow Automation", description: "Replace manual approval chains with intelligent workflows that route, notify, and escalate automatically." },
  { icon: Headphones,    title: "Customer Support AI",          description: "Train an AI on your knowledge base and let it handle 80% of support tickets instantly, at any hour." },
  { icon: BarChart2,     title: "AI Reporting Dashboards",      description: "Automated data collection and AI-generated insights delivered to your inbox or Slack every morning." },
  { icon: Plug,          title: "CRM & ERP Integrations",       description: "Connect your systems so data flows seamlessly — no more manual updates, exports, or reconciliations." },
  { icon: CreditCard,    title: "M-PESA & Payment Automation",  description: "Automate M-PESA collections, payment reconciliation, invoicing, and financial reporting workflows." },
];

export function AutomationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="orb orb-cyan animate-orb-2 absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left sticky */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-block mb-6"
            >
              <span className="section-label" style={{ color: "#10b981", background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}>
                <Zap className="w-3.5 h-3.5" />
                Secondary Service
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[var(--text)]"
              style={{ fontFamily: "var(--font-space)" }}
            >
              AI Business
              <br />
              <span className="gradient-text">Automation</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-[var(--muted)] text-lg leading-relaxed mb-6"
            >
              While AEO gets you discovered, automation transforms how your business operates.
              We build AI-powered systems that eliminate repetitive work and accelerate your team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="grid grid-cols-2 gap-3 mb-8"
            >
              {[
                { value: "80%", label: "avg. reduction in manual tasks" },
                { value: "24/7", label: "AI systems work around the clock" },
                { value: "3 wks", label: "avg. deployment time" },
                { value: "10×", label: "ROI within 6 months" },
              ].map(({ value, label }, i) => (
                <div key={i} className="surface rounded-xl p-4">
                  <div className="text-2xl font-bold gradient-text mb-1" style={{ fontFamily: "var(--font-space)" }}>{value}</div>
                  <div className="text-xs text-[var(--muted)]">{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35 }}
            >
              <Link href="/ai-business-automation" className="btn-primary group inline-flex">
                Explore Automation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: cards */}
          <div className="space-y-3">
            {automations.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4 }}
                  className="surface surface-hover rounded-2xl p-4 flex items-start gap-4 group cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{ background: "var(--card-hover)" }}
                  >
                    <Icon className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--highlight)] transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-[var(--text)] mb-1" style={{ fontFamily: "var(--font-space)" }}>
                      {item.title}
                    </h3>
                    <p className="text-[var(--muted)] text-xs leading-relaxed">{item.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--accent)] shrink-0 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
