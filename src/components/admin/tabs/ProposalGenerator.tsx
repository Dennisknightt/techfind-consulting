"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, RefreshCw, Download, CheckCircle2, TrendingUp, Calendar, DollarSign } from "lucide-react";

const clients = [
  { company: "Summit HVAC",    score: 94, plan: "AEO Growth Partner", price: 1200, currency: "USD" },
  { company: "LexGroup Law",   score: 92, plan: "AEO Growth Partner", price: 1200, currency: "USD" },
  { company: "Premier Dental", score: 91, plan: "AEO Visibility Starter", price: 900, currency: "USD" },
];

const gaps = [
  "Not appearing in ChatGPT, Claude, Gemini, or Perplexity for any target queries",
  "Missing FAQ schema markup — AI can't parse your service offerings",
  "Weak entity optimization — knowledge graphs don't recognise your brand",
  "Competitor APEX ranked in 12/12 AI queries for your market",
  "No authority content for AI citation building",
  "Incomplete NAP consistency reducing local AI signals",
];

const deliverables = [
  { item: "Full AI Visibility Audit",          week: "Week 1" },
  { item: "Entity & Knowledge Graph Setup",    week: "Week 2" },
  { item: "Structured Data Implementation",    week: "Week 2-3" },
  { item: "2 Authority Content Pieces/Month",  week: "Ongoing" },
  { item: "Citation & Digital PR (8/mo)",      week: "Ongoing" },
  { item: "Monthly AI Visibility Report",      week: "Monthly" },
  { item: "Quarterly Strategy Review",         week: "Quarterly" },
];

export function ProposalGenerator() {
  const [selected, setSelected] = useState<typeof clients[0] | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  function generate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerated(true);
      setGenerating(false);
    }, 1400);
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Proposal Generator
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Generate professional PDF proposals for qualified leads after a strategy call</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client selector */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">Select Client</h2>
          {clients.map((c, i) => (
            <button
              key={i}
              onClick={() => { setSelected(c); setGenerated(false); }}
              className="w-full text-left surface rounded-2xl p-4 transition-all"
              style={{
                border: `1px solid ${selected?.company === c.company ? "var(--border-accent)" : "var(--border)"}`,
                background: selected?.company === c.company ? "var(--accent-glow)" : "var(--card)",
              }}
            >
              <p className="font-semibold text-sm text-[var(--text)]">{c.company}</p>
              <p className="text-xs text-[var(--muted)]">{c.plan}</p>
              <p className="text-xs font-bold mt-1" style={{ color: "var(--accent)" }}>${c.price}/mo</p>
            </button>
          ))}
        </div>

        {/* Proposal preview */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[var(--text)]">Proposal for {selected.company}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={generate}
                    disabled={generating}
                    className="btn-primary text-sm gap-2"
                  >
                    {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</> : <><FileText className="w-4 h-4" />Generate Proposal</>}
                  </button>
                  {generated && (
                    <button className="btn-secondary text-sm gap-2">
                      <Download className="w-4 h-4" /> Export PDF
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {generated ? (
                  <motion.div
                    key="proposal"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="surface rounded-2xl p-8 space-y-8"
                  >
                    {/* Header */}
                    <div className="pb-6 border-b" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-[var(--text)] mb-1">AI Engine Optimization Proposal</h3>
                          <p className="text-sm text-[var(--muted)]">Prepared for {selected.company} · June 2026</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "var(--font-space)" }}>
                            ${selected.price}<span className="text-sm font-normal text-[var(--muted)">/mo</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Executive summary */}
                    <div>
                      <h4 className="font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Executive Summary
                      </h4>
                      <p className="text-sm text-[var(--muted)] leading-relaxed">
                        {selected.company} currently has an AI Visibility Score of {selected.score}/100, meaning your business
                        is largely invisible when potential customers use AI assistants to find services like yours.
                        This proposal outlines TechFind Consulting&apos;s plan to systematically improve your AI presence,
                        drive qualified inbound leads from AI platforms, and outrank your competitors in AI-powered search.
                      </p>
                    </div>

                    {/* Gaps */}
                    <div>
                      <h4 className="font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" style={{ color: "var(--accent)" }} /> Key Gaps Identified
                      </h4>
                      <div className="space-y-2">
                        {gaps.map((g, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                            <span className="text-[var(--muted)]">{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <h4 className="font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: "var(--accent)" }} /> What We&apos;ll Deliver
                      </h4>
                      <div className="space-y-2">
                        {deliverables.map(({ item, week }, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
                            style={{ borderColor: "var(--border)" }}>
                            <div className="flex items-center gap-2.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-[var(--text)]">{item}</span>
                            </div>
                            <span className="text-xs text-[var(--muted)]">{week}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Investment */}
                    <div className="rounded-2xl p-5"
                      style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-[var(--text)] flex items-center gap-2">
                          <DollarSign className="w-4 h-4" style={{ color: "var(--accent)" }} /> Investment
                        </h4>
                        <span className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "var(--font-space)" }}>
                          ${selected.price}/mo
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted)]">
                        {selected.plan} · Month-to-month · No long-term contract required
                      </p>
                      <p className="text-xs text-emerald-400 font-semibold mt-2">
                        ✓ First results visible within 60 days · ROI typically 3–8× within 6 months
                      </p>
                    </div>

                    {/* Next steps */}
                    <div>
                      <h4 className="font-bold text-[var(--text)] mb-2">Next Steps</h4>
                      <ol className="space-y-1.5 text-sm text-[var(--muted)]">
                        {["Sign the service agreement", "Complete onboarding questionnaire (15 min)", "We begin the AI Visibility Audit", "Weekly update calls begin"].map((s, i) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                              {i + 1}
                            </span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    className="surface rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64"
                  >
                    <FileText className="w-10 h-10 mb-3" style={{ color: "var(--muted)" }} />
                    <p className="text-sm text-[var(--muted)]">Click &quot;Generate Proposal&quot; to create a full professional proposal</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="surface rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64">
              <FileText className="w-10 h-10 mb-3" style={{ color: "var(--muted)" }} />
              <p className="text-sm text-[var(--muted)]">Select a client on the left to generate their proposal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
