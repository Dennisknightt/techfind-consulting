"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Send, Archive } from "lucide-react";

const leads = [
  { company: "Summit HVAC",       score: 94, grade: "A+", industry: "HVAC",     reason: "High AI gap, local SEO weakness, $2M+ revenue" },
  { company: "LexGroup Law",      score: 92, grade: "A+", industry: "Legal",    reason: "Competitor outranking on all AI platforms" },
  { company: "Premier Dental",    score: 91, grade: "A+", industry: "Dental",   reason: "Zero AI citations, strong review profile" },
  { company: "Bright Solar",      score: 88, grade: "A",  industry: "Solar",    reason: "Strong site, weak entity optimization" },
  { company: "Atlas Roofing",     score: 82, grade: "A",  industry: "Roofing",  reason: "5 competitor citations, none for them" },
  { company: "ProPlumb Co",       score: 78, grade: "B",  industry: "Plumbing", reason: "Low authority content, some entity signals" },
  { company: "GreenLawn Pro",     score: 65, grade: "Nurture", industry: "Landscaping", reason: "Small budget indicator, low urgency" },
  { company: "Valley Electric",   score: 58, grade: "Nurture", industry: "Electrical",  reason: "Decision maker unclear, long sales cycle" },
  { company: "Corner Cafe",       score: 32, grade: "Reject",  industry: "Food",        reason: "No marketing budget, consumer business" },
];

const tiers = [
  { grade: "A+",    label: "Elite",   range: "90–100", color: "#10b981", eligible: "Full outreach + calendar booking" },
  { grade: "A",     label: "Strong",  range: "80–89",  color: "#3b82f6", eligible: "Full outreach + calendar booking" },
  { grade: "B",     label: "Warm",    range: "70–79",  color: "#f59e0b", eligible: "Email outreach only, warm before call" },
  { grade: "Nurture", label: "Cold",  range: "50–69",  color: "#8b5cf6", eligible: "Educational email sequence" },
  { grade: "Reject",  label: "Disqualified", range: "<50", color: "#6b7280", eligible: "No outreach — archive" },
];

function gradeColor(g: string) {
  const t = tiers.find(t => t.grade === g);
  return t?.color ?? "#6b7280";
}

export function LeadScoring() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Lead Scoring
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Automatic classification of every audited prospect</p>
      </div>

      {/* Tier legend */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tiers.map(({ grade, label, range, color, eligible }) => (
          <div key={grade} className="surface rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold" style={{ color, fontFamily: "var(--font-space)" }}>{grade}</span>
              <span className="text-xs text-[var(--muted)]">{range}</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text)] mb-1">{label}</p>
            <p className="text-xs text-[var(--muted)]">{eligible}</p>
          </div>
        ))}
      </div>

      {/* Leads table */}
      <div className="surface rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-[var(--text)]">All Scored Leads</h2>
          <div className="flex items-center gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--card-hover)", color: "var(--muted)", border: "1px solid var(--border)" }}>
              Filter by grade
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--card-hover)", color: "var(--muted)", border: "1px solid var(--border)" }}>
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Company", "Industry", "Score", "Grade", "Reason", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b last:border-0 hover:bg-[var(--card-hover)] transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-5 py-3 font-medium text-[var(--text)]">{l.company}</td>
                  <td className="px-5 py-3 text-[var(--muted)]">{l.industry}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: gradeColor(l.grade) }}>{l.score}</span>
                      <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${l.score}%`, background: gradeColor(l.grade) }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: `${gradeColor(l.grade)}22`, color: gradeColor(l.grade) }}>
                      {l.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--muted)] max-w-xs">{l.reason}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {(l.grade === "A+" || l.grade === "A") && (
                        <button className="p-1.5 rounded-lg transition-all"
                          title="Start Outreach"
                          style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg transition-all"
                        title="Add to CRM"
                        style={{ background: "var(--card-hover)", color: "var(--muted)" }}>
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg transition-all"
                        title="Archive"
                        style={{ background: "var(--card-hover)", color: "var(--muted)" }}>
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade breakdown */}
      <div className="surface rounded-2xl p-6">
        <h2 className="font-bold text-[var(--text)] mb-4">Grade Distribution</h2>
        <div className="space-y-3">
          {tiers.map(({ grade, label, color }) => {
            const count = leads.filter(l => l.grade === grade).length;
            const pct = (count / leads.length) * 100;
            return (
              <div key={grade} className="flex items-center gap-4">
                <span className="text-xs font-bold w-16 shrink-0" style={{ color }}>{grade}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                    style={{ background: color }}
                  />
                </div>
                <span className="text-xs text-[var(--muted)] w-12 text-right">{count} leads</span>
                <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
