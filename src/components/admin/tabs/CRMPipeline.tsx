"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Kanban, List, RefreshCw, ExternalLink, MessageSquare } from "lucide-react";
import { useLeads } from "../useLeads";
import type { LeadStage } from "@/lib/store";

const stageColors: Record<LeadStage, string> = {
  "Discovered":     "#6b7280",
  "Audited":        "#8b5cf6",
  "Qualified":      "#3b82f6",
  "Outreach Sent":  "#06b6d4",
  "Responded":      "#f59e0b",
  "Meeting Booked": "#f97316",
  "Proposal Sent":  "#ec4899",
  "Negotiation":    "#10b981",
  "Won":            "#10b981",
  "Lost":           "#ef4444",
  "Nurture":        "#6b7280",
};

const pipelineStages: LeadStage[] = [
  "Audited", "Qualified", "Outreach Sent", "Responded",
  "Meeting Booked", "Proposal Sent", "Negotiation", "Won",
];

const allStages: LeadStage[] = [
  "Discovered","Audited","Qualified","Outreach Sent","Responded",
  "Meeting Booked","Proposal Sent","Negotiation","Won","Lost","Nurture",
];

function gradeColor(g: string) {
  if (g === "A+") return "#10b981";
  if (g === "A")  return "#3b82f6";
  if (g === "B")  return "#f59e0b";
  return "#6b7280";
}

export function CRMPipeline() {
  const { leads, loading, updateStage, refresh } = useLeads();
  const [view, setView] = useState<"kanban" | "table">("kanban");

  const activeLeads  = leads.filter(l => !["Lost","Nurture"].includes(l.stage));
  const wonLeads     = leads.filter(l => l.stage === "Won");
  const pipelineVal  = activeLeads.length * 1200;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
            CRM Pipeline
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Real-time lead tracking from audit submission to closed client</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="p-2 rounded-xl"
            style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <RefreshCw className="w-4 h-4" />
          </button>
          {["kanban","table"].map(v => (
            <button key={v} onClick={() => setView(v as "kanban"|"table")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all"
              style={{
                background: view === v ? "var(--accent-glow)" : "var(--card-hover)",
                border: `1px solid ${view === v ? "var(--border-accent)" : "var(--border)"}`,
                color: view === v ? "var(--accent)" : "var(--muted)",
              }}>
              {v === "kanban" ? <Kanban className="w-4 h-4" /> : <List className="w-4 h-4" />}
              <span className="capitalize">{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Leads",      value: leads.length },
          { label: "Active Pipeline",  value: `$${(pipelineVal/1000).toFixed(0)}K` },
          { label: "Won This Session", value: wonLeads.length },
        ].map(({ label, value }) => (
          <div key={label} className="surface rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--text)] mb-1" style={{ fontFamily: "var(--font-space)" }}>
              {loading ? "—" : value}
            </p>
            <p className="text-xs text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && leads.length === 0 && (
        <div className="surface rounded-2xl p-10 text-center">
          <p className="text-2xl mb-3">📋</p>
          <p className="font-bold text-[var(--text)] mb-1">Pipeline is empty</p>
          <p className="text-sm text-[var(--muted)]">New leads will appear here automatically</p>
        </div>
      )}

      {/* Kanban */}
      {leads.length > 0 && view === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {pipelineStages.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage);
              const color = stageColors[stage];
              const idx = allStages.indexOf(stage);
              return (
                <div key={stage} className="w-56 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-xs font-semibold text-[var(--text)]">{stage}</span>
                    </div>
                    <span className="text-xs text-[var(--muted)]">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-2.5 min-h-24">
                    {stageLeads.map(lead => (
                      <motion.div key={lead.id} layout
                        className="surface rounded-xl p-3.5"
                        style={{ border: "1px solid var(--border)" }}>
                        <div className="flex items-start justify-between mb-1.5">
                          <p className="text-xs font-semibold text-[var(--text)] leading-tight">{lead.companyName}</p>
                          <span className="text-[10px] font-bold ml-1 shrink-0"
                            style={{ color: gradeColor(lead.grade) }}>{lead.grade}</span>
                        </div>
                        <p className="text-[10px] text-[var(--muted)] mb-2">{lead.industry} · {lead.country}</p>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[10px] font-bold" style={{ color: gradeColor(lead.grade) }}>
                            {lead.overallScore}/100
                          </span>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/revenue-engine?tab=communications&lead=${lead.id}`}
                              className="text-[10px] text-[var(--accent)] hover:underline flex items-center gap-0.5">
                              <MessageSquare className="w-2.5 h-2.5" /> Log
                            </Link>
                            {lead.email && (
                              <a href={`mailto:${lead.email}`}
                                className="text-[10px] text-[var(--accent)] hover:underline flex items-center gap-0.5">
                                Email <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => idx > 0 && updateStage(lead.id, allStages[idx - 1])}
                            disabled={idx === 0}
                            className="flex-1 text-[10px] py-1 rounded-lg transition-all disabled:opacity-30"
                            style={{ background: "var(--card-hover)", color: "var(--muted)" }}>
                            ← Back
                          </button>
                          <button
                            onClick={() => idx < allStages.length - 1 && updateStage(lead.id, allStages[idx + 1])}
                            disabled={idx >= allStages.length - 1}
                            className="flex-1 text-[10px] py-1 rounded-lg transition-all disabled:opacity-30"
                            style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                            Next →
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="rounded-xl border-2 border-dashed flex items-center justify-center h-16"
                        style={{ borderColor: "var(--border)" }}>
                        <span className="text-[10px] text-[var(--muted)]">Empty</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table view */}
      {leads.length > 0 && view === "table" && (
        <div className="surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Company", "Industry", "Score", "Grade", "Budget", "Email", "Stage", "Move", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => {
                  const idx = allStages.indexOf(l.stage);
                  return (
                    <tr key={l.id}
                      className="border-b last:border-0 hover:bg-[var(--card-hover)] transition-colors"
                      style={{ borderColor: "var(--border)" }}>
                      <td className="px-5 py-3 font-medium text-[var(--text)]">{l.companyName}</td>
                      <td className="px-5 py-3 text-[var(--muted)]">{l.industry}</td>
                      <td className="px-5 py-3 font-bold" style={{ color: gradeColor(l.grade) }}>{l.overallScore}</td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: `${gradeColor(l.grade)}22`, color: gradeColor(l.grade) }}>
                          {l.grade}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-[var(--muted)]">{l.budget ?? "—"}</td>
                      <td className="px-5 py-3">
                        <a href={`mailto:${l.email}`} className="text-xs text-[var(--accent)] hover:underline">
                          {l.email}
                        </a>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${stageColors[l.stage]}22`, color: stageColors[l.stage] }}>
                          {l.stage}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={l.stage}
                          onChange={e => updateStage(l.id, e.target.value as LeadStage)}
                          className="text-xs px-2 py-1.5 rounded-lg outline-none"
                          style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}>
                          {allStages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <Link href={`/admin/revenue-engine?tab=communications&lead=${l.id}`}
                          className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 whitespace-nowrap">
                          <MessageSquare className="w-3 h-3" /> Log
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
