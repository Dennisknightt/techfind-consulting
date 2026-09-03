"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, RefreshCw, Download, CheckCircle2, TrendingUp, Calendar, DollarSign, Users } from "lucide-react";
import { useLeads } from "../useLeads";
import type { Lead } from "../useLeads";

/* ── Plan logic from budget ─────────────────────────────────── */
function planFromBudget(budget?: string): { name: string; price: number } {
  if (budget === "$10k+")      return { name: "AEO Enterprise",        price: 2500 };
  if (budget === "$3k-$10k")   return { name: "AEO Growth Partner",    price: 1200 };
  return                               { name: "AEO Visibility Starter", price: 900 };
}

/* ── Derive gaps from sub-scores ──────────────────────────── */
function gapsFromLead(lead: Lead): string[] {
  const gaps: string[] = [];
  if (lead.technicalScore < 75)
    gaps.push(`Technical foundation weak (${lead.technicalScore}/100) — AI crawlers can't parse your content structure`);
  if (lead.entityScore < 75)
    gaps.push(`Entity recognition gaps (${lead.entityScore}/100) — knowledge graphs don't link your brand to its category`);
  if (lead.authorityScore < 75)
    gaps.push(`Low authority signals (${lead.authorityScore}/100) — AI platforms cite competitors before you`);
  if (lead.aiReadinessScore < 75)
    gaps.push(`AI readiness score ${lead.aiReadinessScore}/100 — content not formatted for LLM citation`);
  if (lead.opportunities >= 3)
    gaps.push(`${lead.opportunities} high-value AI queries identified where competitors appear but ${lead.companyName} is invisible`);
  if (!gaps.length)
    gaps.push("Visibility gaps identified across ChatGPT, Claude, Gemini, and Perplexity");
  return gaps;
}

const deliverables = [
  { item: "Full AI Visibility Audit Report",         week: "Week 1" },
  { item: "Entity & Knowledge Graph Optimisation",   week: "Week 2" },
  { item: "Structured Data Implementation",          week: "Week 2–3" },
  { item: "2 Authority Content Pieces / Month",      week: "Ongoing" },
  { item: "Citation & Digital PR (8/mo)",            week: "Ongoing" },
  { item: "Monthly AI Visibility Dashboard Report",  week: "Monthly" },
  { item: "Quarterly Strategy Review Call",          week: "Quarterly" },
];

function gradeColor(g: string) {
  if (g === "A+") return "#10b981";
  if (g === "A")  return "#3b82f6";
  return "#6b7280";
}

export function ProposalGenerator() {
  const { leads, loading, updateStage, refresh } = useLeads();
  const [selected, setSelected]   = useState<Lead | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Only qualified A+/A leads get proposals
  const eligible = leads.filter(l => (l.grade === "A+" || l.grade === "A") && l.qualified);

  function generate() {
    setGenerating(true);
    setTimeout(async () => {
      setGenerated(true);
      setGenerating(false);
      if (selected && selected.stage !== "Proposal Sent") {
        await updateStage(selected.id, "Proposal Sent");
      }
    }, 1400);
  }

  function selectLead(lead: Lead) {
    setSelected(lead);
    setGenerated(false);
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
            Proposal Generator
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Professional proposals generated from real audit data — no copy-paste required
          </p>
        </div>
        <button onClick={refresh} className="p-2 rounded-xl"
          style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--muted)" }}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Empty state */}
      {!loading && eligible.length === 0 && (
        <div className="surface rounded-2xl p-10 text-center">
          <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <p className="font-bold text-[var(--text)] mb-1">No qualified leads yet</p>
          <p className="text-sm text-[var(--muted)]">
            A+ and A leads who pass qualification appear here.
          </p>
        </div>
      )}

      {eligible.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead selector */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
              Qualified Leads ({eligible.length})
            </h2>
            {eligible.map(lead => {
              const { name: planName, price } = planFromBudget(lead.budget);
              return (
                <button
                  key={lead.id}
                  onClick={() => selectLead(lead)}
                  className="w-full text-left surface rounded-2xl p-4 transition-all"
                  style={{
                    border: `1px solid ${selected?.id === lead.id ? "var(--border-accent)" : "var(--border)"}`,
                    background: selected?.id === lead.id ? "var(--accent-glow)" : "var(--card)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-[var(--text)] truncate">{lead.companyName}</p>
                    <span className="text-xs font-bold shrink-0 ml-1" style={{ color: gradeColor(lead.grade) }}>
                      {lead.grade}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-1">{lead.industry} · Score: {lead.overallScore}</p>
                  <p className="text-xs font-bold" style={{ color: "var(--accent)" }}>${price}/mo — {planName}</p>
                  {lead.stage === "Proposal Sent" && (
                    <p className="text-xs text-emerald-400 font-semibold mt-1">✓ Proposal sent</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Proposal preview */}
          <div className="lg:col-span-2">
            {selected ? (() => {
              const { name: planName, price } = planFromBudget(selected.budget);
              const gaps = gapsFromLead(selected);
              const date = new Date(selected.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[var(--text)]">Proposal for {selected.companyName}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={generate}
                        disabled={generating}
                        className="btn-primary text-sm gap-2"
                      >
                        {generating
                          ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</>
                          : <><FileText className="w-4 h-4" />Generate Proposal</>}
                      </button>
                      {generated && (
                        <button className="btn-secondary text-sm gap-2"
                          onClick={() => window.print()}>
                          <Download className="w-4 h-4" /> Print / Save PDF
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
                              <h3 className="text-xl font-bold text-[var(--text)] mb-1">AI Engine Optimisation Proposal</h3>
                              <p className="text-sm text-[var(--muted)]">Prepared for {selected.companyName} · {date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "var(--font-space)" }}>
                                ${price}
                                <span className="text-sm font-normal text-[var(--muted)]">/mo</span>
                              </p>
                              <p className="text-xs text-[var(--muted)]">{planName}</p>
                            </div>
                          </div>
                        </div>

                        {/* Executive summary */}
                        <div>
                          <h4 className="font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Executive Summary
                          </h4>
                          <p className="text-sm text-[var(--muted)] leading-relaxed">
                            {selected.companyName} currently has an AI Visibility Score of {selected.overallScore}/100, placing
                            it {selected.overallScore >= 80 ? "above" : "below"} the industry average of 72. Despite this,
                            there are significant gaps preventing the business from being recommended by AI assistants
                            like ChatGPT, Claude, and Gemini when potential customers search in the {selected.industry} space.
                            This proposal outlines TechFind Consulting&rsquo;s plan to close those gaps and drive qualified
                            inbound leads from AI-powered search within 60–90 days.
                          </p>
                        </div>

                        {/* Score breakdown */}
                        <div>
                          <h4 className="font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" style={{ color: "var(--accent)" }} /> Audit Score Breakdown
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { label: "Technical",    val: selected.technicalScore },
                              { label: "Entity",       val: selected.entityScore },
                              { label: "Authority",    val: selected.authorityScore },
                              { label: "AI Readiness", val: selected.aiReadinessScore },
                            ].map(({ label, val }) => (
                              <div key={label} className="flex items-center gap-3 p-3 rounded-xl"
                                style={{ background: "var(--card-hover)" }}>
                                <span className="text-xs text-[var(--muted)] w-24 shrink-0">{label}</span>
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                  <div className="h-full rounded-full"
                                    style={{ width: `${val}%`, background: val >= 75 ? "#10b981" : val >= 50 ? "#f59e0b" : "#ef4444" }} />
                                </div>
                                <span className="text-xs font-bold text-[var(--text)]">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Gaps */}
                        <div>
                          <h4 className="font-bold text-[var(--text)] mb-3">Key Gaps Identified</h4>
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
                            <Calendar className="w-4 h-4" style={{ color: "var(--accent)" }} /> What We&rsquo;ll Deliver
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
                              ${price}/mo
                            </span>
                          </div>
                          <p className="text-xs text-[var(--muted)]">
                            {planName} · Month-to-month · No long-term contract required
                          </p>
                          <p className="text-xs text-emerald-400 font-semibold mt-2">
                            ✓ First results visible within 60 days · ROI typically 3–8× within 6 months
                          </p>
                        </div>

                        {/* Next steps */}
                        <div>
                          <h4 className="font-bold text-[var(--text)] mb-2">Next Steps</h4>
                          <ol className="space-y-1.5 text-sm text-[var(--muted)]">
                            {[
                              "Sign the service agreement",
                              "Complete onboarding questionnaire (15 min)",
                              "We begin your AI Visibility Audit deep-dive",
                              "Weekly update calls begin in Week 2",
                            ].map((s, i) => (
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

                        {/* Footer CTA */}
                        <div className="pt-4 border-t text-center" style={{ borderColor: "var(--border)" }}>
                          <a
                            href={`mailto:${selected.email}?subject=Your AEO Proposal from TechFind Consulting&body=Hi, please find your AI Engine Optimisation proposal attached. Looking forward to working with ${selected.companyName}.`}
                            className="btn-primary inline-flex gap-2">
                            Email Proposal to {selected.email}
                          </a>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        className="surface rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64"
                      >
                        <FileText className="w-10 h-10 mb-3" style={{ color: "var(--muted)" }} />
                        <p className="text-sm text-[var(--muted)]">
                          Click <strong>Generate Proposal</strong> to create a full personalised proposal using their audit data
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })() : (
              <div className="surface rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64">
                <FileText className="w-10 h-10 mb-3" style={{ color: "var(--muted)" }} />
                <p className="text-sm text-[var(--muted)]">Select a qualified lead on the left to generate their proposal</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
