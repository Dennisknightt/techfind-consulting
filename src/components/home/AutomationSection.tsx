"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageCircle, RefreshCw, GitBranch, HeadphonesIcon,
  BarChart2, Plug, CreditCard, ArrowRight, Zap,
} from "lucide-react";
import Link from "next/link";

const automations = [
  {
    icon: MessageCircle,
    title: "WhatsApp AI Agents",
    description: "24/7 AI assistant that qualifies leads, answers questions, and books appointments directly in WhatsApp.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: RefreshCw,
    title: "Sales Follow-Up Automation",
    description: "Automated follow-up sequences that nurture leads until they're ready to buy — without human intervention.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: GitBranch,
    title: "Approval Workflow Automation",
    description: "Replace manual approval chains with intelligent workflows that route, notify, and escalate automatically.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support AI",
    description: "Train an AI on your knowledge base and let it handle 80% of support tickets instantly, at any hour.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: BarChart2,
    title: "AI Reporting Dashboards",
    description: "Automated data collection and AI-generated insights delivered to your inbox or Slack every morning.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: Plug,
    title: "CRM & ERP Integrations",
    description: "Connect your systems so data flows seamlessly — no more manual updates, exports, or reconciliations.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: CreditCard,
    title: "M-PESA & Payment Automation",
    description: "Automate M-PESA collections, payment reconciliation, invoicing, and financial reporting workflows.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

export function AutomationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/40 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-green-600/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Content */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-2 text-emerald-400 text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 rounded-full px-3 py-1.5 mb-6"
            >
              <Zap className="w-3.5 h-3.5" />
              Secondary Service
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              AI Business
              <br />
              <span className="gradient-text">Automation</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed mb-6"
            >
              While AEO gets you discovered, automation transforms how your business operates.
              We build AI-powered systems that eliminate repetitive work and accelerate your team.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="text-white/50 leading-relaxed mb-8"
            >
              From WhatsApp AI agents that close leads at 2am, to payment automation systems that
              reconcile M-PESA instantly — we build the infrastructure modern businesses need.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {[
                { value: "80%", label: "avg. reduction in manual tasks" },
                { value: "24/7", label: "AI systems work around the clock" },
                { value: "3 wks", label: "avg. deployment time" },
                { value: "10x", label: "ROI within 6 months" },
              ].map(({ value, label }, i) => (
                <div key={i} className="glass border border-white/5 rounded-xl p-4">
                  <div className="text-2xl font-black gradient-text mb-1" style={{ fontFamily: "var(--font-syne)" }}>
                    {value}
                  </div>
                  <div className="text-white/40 text-xs">{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/ai-business-automation"
                className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 group"
              >
                Explore Automation Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Cards */}
          <div className="space-y-3">
            {automations.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4 }}
                  className={`group glass border ${item.border} rounded-2xl p-4 flex items-start gap-4 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white mb-1" style={{ fontFamily: "var(--font-syne)" }}>
                      {item.title}
                    </h3>
                    <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${item.color} shrink-0 mt-3 opacity-0 group-hover:opacity-100 transition-all`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
