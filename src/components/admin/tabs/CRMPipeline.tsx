"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Kanban, List, MoreHorizontal } from "lucide-react";

type Stage = "Discovered" | "Audited" | "Qualified" | "Outreach Sent" | "Responded" |
             "Meeting Booked" | "Proposal Sent" | "Negotiation" | "Won" | "Lost" | "Nurture";

type Lead = {
  id: number;
  company: string;
  industry: string;
  score: number;
  grade: string;
  stage: Stage;
  value: number;
};

const stageColors: Record<Stage, string> = {
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

const stageOrder: Stage[] = [
  "Discovered", "Audited", "Qualified", "Outreach Sent", "Responded",
  "Meeting Booked", "Proposal Sent", "Negotiation", "Won", "Lost", "Nurture",
];

const initialLeads: Lead[] = [
  { id: 1,  company: "Summit HVAC",      industry: "HVAC",       score: 94, grade: "A+", stage: "Meeting Booked",  value: 14400 },
  { id: 2,  company: "LexGroup Law",     industry: "Legal",      score: 92, grade: "A+", stage: "Outreach Sent",   value: 14400 },
  { id: 3,  company: "Premier Dental",   industry: "Dental",     score: 91, grade: "A+", stage: "Proposal Sent",   value: 10800 },
  { id: 4,  company: "Bright Solar",     industry: "Solar",      score: 88, grade: "A",  stage: "Responded",       value: 14400 },
  { id: 5,  company: "Atlas Roofing",    industry: "Roofing",    score: 82, grade: "A",  stage: "Qualified",       value: 10800 },
  { id: 6,  company: "ProPlumb Co",      industry: "Plumbing",   score: 78, grade: "B",  stage: "Audited",         value: 10800 },
  { id: 7,  company: "GreenLawn Pro",    industry: "Landscaping",score: 65, grade: "N",  stage: "Nurture",         value: 0 },
  { id: 8,  company: "Nexus IT",         industry: "IT",         score: 87, grade: "A",  stage: "Negotiation",     value: 14400 },
  { id: 9,  company: "ClearPath Law",    industry: "Legal",      score: 89, grade: "A",  stage: "Won",             value: 14400 },
  { id: 10, company: "Apex Accounting",  industry: "Accounting", score: 83, grade: "A",  stage: "Meeting Booked",  value: 10800 },
];

function gradeColor(g: string) {
  if (g === "A+") return "#10b981";
  if (g === "A")  return "#3b82f6";
  if (g === "B")  return "#f59e0b";
  return "#6b7280";
}

export function CRMPipeline() {
  const [leads, setLeads] = useState(initialLeads);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [dragging, setDragging] = useState<number | null>(null);

  function moveStage(id: number, direction: number) {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l;
      const idx = stageOrder.indexOf(l.stage);
      const next = stageOrder[Math.max(0, Math.min(stageOrder.length - 1, idx + direction))];
      return { ...l, stage: next };
    }));
  }

  const pipelineStages: Stage[] = ["Qualified", "Outreach Sent", "Responded", "Meeting Booked", "Proposal Sent", "Negotiation", "Won"];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
            CRM Pipeline
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Track every lead from discovery to closed client</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: "kanban", icon: Kanban, label: "Kanban" },
            { key: "table",  icon: List,   label: "Table" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setView(key as "kanban" | "table")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all"
              style={{
                background: view === key ? "var(--accent-glow)" : "var(--card-hover)",
                border: `1px solid ${view === key ? "var(--border-accent)" : "var(--border)"}`,
                color: view === key ? "var(--accent)" : "var(--muted)",
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline value summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Pipeline",   value: `$${(leads.filter(l => !["Lost","Nurture","Discovered","Audited"].includes(l.stage)).reduce((s, l) => s + l.value, 0) / 1000).toFixed(0)}K` },
          { label: "Won (This Month)", value: `$${(leads.filter(l => l.stage === "Won").reduce((s, l) => s + l.value, 0) / 1000).toFixed(0)}K` },
          { label: "Active Deals",     value: leads.filter(l => pipelineStages.includes(l.stage)).length.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="surface rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--text)] mb-1" style={{ fontFamily: "var(--font-space)" }}>{value}</p>
            <p className="text-xs text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>

      {view === "kanban" ? (
        /* Kanban board — horizontal scroll */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {pipelineStages.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage);
              const color = stageColors[stage];
              return (
                <div key={stage} className="w-56 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-xs font-semibold text-[var(--text)]">{stage}</span>
                    </div>
                    <span className="text-xs text-[var(--muted)]">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-2.5 min-h-32">
                    {stageLeads.map(lead => (
                      <motion.div
                        key={lead.id}
                        layout
                        className="surface rounded-xl p-3.5 cursor-grab"
                        style={{ border: `1px solid var(--border)` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs font-semibold text-[var(--text)] leading-tight">{lead.company}</p>
                          <button className="opacity-50 hover:opacity-100">
                            <MoreHorizontal className="w-3.5 h-3.5 text-[var(--muted)]" />
                          </button>
                        </div>
                        <p className="text-[10px] text-[var(--muted)] mb-2">{lead.industry}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${gradeColor(lead.grade)}22`, color: gradeColor(lead.grade) }}>
                            {lead.grade}
                          </span>
                          {lead.value > 0 && (
                            <span className="text-[10px] text-[var(--muted)]">
                              ${(lead.value / 1000).toFixed(1)}K/yr
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-2.5">
                          <button
                            onClick={() => moveStage(lead.id, -1)}
                            className="flex-1 text-[10px] py-1 rounded-lg transition-all"
                            style={{ background: "var(--card-hover)", color: "var(--muted)" }}
                          >← Back</button>
                          <button
                            onClick={() => moveStage(lead.id, 1)}
                            className="flex-1 text-[10px] py-1 rounded-lg transition-all"
                            style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
                          >Next →</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table view */
        <div className="surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Company", "Industry", "Score", "Grade", "Stage", "Value/yr", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-[var(--card-hover)] transition-colors"
                    style={{ borderColor: "var(--border)" }}>
                    <td className="px-5 py-3 font-medium text-[var(--text)]">{l.company}</td>
                    <td className="px-5 py-3 text-[var(--muted)]">{l.industry}</td>
                    <td className="px-5 py-3 font-bold text-[var(--text)]">{l.score}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: `${gradeColor(l.grade)}22`, color: gradeColor(l.grade) }}>
                        {l.grade}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs"
                        style={{ background: `${stageColors[l.stage]}22`, color: stageColors[l.stage] }}>
                        {l.stage}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[var(--muted)]">
                      {l.value > 0 ? `$${(l.value / 1000).toFixed(1)}K` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => moveStage(l.id, 1)}
                          className="text-xs px-2.5 py-1 rounded-lg"
                          style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                          Advance →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
