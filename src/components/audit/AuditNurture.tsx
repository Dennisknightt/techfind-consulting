"use client";

import { motion } from "framer-motion";
import { BookOpen, Mail, ArrowRight, TrendingUp, Lightbulb } from "lucide-react";
import Link from "next/link";
import type { AuditData, AuditScores } from "./AuditFlow";

interface Props { data: AuditData; scores: AuditScores; }

const resources = [
  { icon: BookOpen,   title: "AEO Beginner's Guide",         desc: "Everything you need to understand AI Engine Optimization" },
  { icon: TrendingUp, title: "5 Ways AI is Changing Search", desc: "How to position your business for the AI search revolution" },
  { icon: Lightbulb,  title: "Schema Markup Starter Kit",    desc: "Free templates to start improving your structured data today" },
];

export function AuditNurture({ data, scores }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
            <Mail className="w-7 h-7" style={{ color: "var(--accent)" }} />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Your Report Is On Its Way
          </h2>
          <p className="text-[var(--muted)] mb-2">
            We&apos;ve sent your AI Visibility Score of <strong style={{ color: "#f59e0b" }}>{scores.overall}/100</strong> to <strong className="text-[var(--text)]">{data.email}</strong>.
          </p>
          <p className="text-[var(--muted)] text-sm mb-10">
            Over the next few days we&apos;ll send you educational content and quick wins
            you can implement today — no commitment required.
          </p>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3 mb-10"
        >
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-4">
            Free resources to get you started
          </p>
          {resources.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="surface rounded-2xl p-4 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-glow)" }}>
                <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--text)]">{title}</p>
                <p className="text-xs text-[var(--muted)]">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--muted)] ml-auto shrink-0" />
            </div>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface rounded-2xl p-6 mb-6"
          style={{ border: "1px solid var(--border-accent)" }}
        >
          <p className="font-bold text-[var(--text)] mb-1">Stay ahead of AI search</p>
          <p className="text-xs text-[var(--muted)] mb-4">Weekly AEO tips from TechFind — join 2,000+ business owners</p>
          <div className="flex gap-2">
            <input
              type="email"
              defaultValue={data.email}
              readOnly
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button className="btn-primary text-sm px-5">Subscribe</button>
          </div>
        </motion.div>

        <Link href="/insights" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1">
          Browse our Insights blog
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
