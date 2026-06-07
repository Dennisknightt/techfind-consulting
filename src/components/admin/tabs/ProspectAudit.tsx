"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RefreshCw, Globe, CheckCircle2, AlertTriangle, TrendingUp, Star } from "lucide-react";

type AuditResult = {
  company: string;
  url: string;
  aiVisibility: number;
  technical: number;
  entity: number;
  localAuthority: number;
  competitorGap: number;
  revenueOpportunity: number;
  salesReadiness: number;
  grade: string;
};

function scoreColor(v: number) {
  return v >= 70 ? "#10b981" : v >= 50 ? "#f59e0b" : "#ef4444";
}

function gradeFromScores(scores: number[]): string {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 90) return "A+";
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 50) return "Nurture";
  return "Reject";
}

function runAudit(company: string, url: string): AuditResult {
  const seed = (company.length * 7 + url.length * 3) % 40;
  const base = 25 + seed;
  const scores = [base + 5, base - 3, base + 8, base + 2, base + 12, base - 5];
  return {
    company, url,
    aiVisibility:        scores[0],
    technical:           scores[1],
    entity:              scores[2],
    localAuthority:      scores[3],
    competitorGap:       scores[4],
    revenueOpportunity:  scores[5],
    salesReadiness:      scores[0] + 15,
    grade:               gradeFromScores(scores),
  };
}

const sampleProspects = [
  { company: "Arctic Cool HVAC",    url: "arcticcool.com" },
  { company: "TopLine Roofing",     url: "toplineroofing.com" },
  { company: "ClearPath Law",       url: "clearpathlaw.com" },
  { company: "BrightSmile Dental",  url: "brightsmile.com" },
  { company: "Solaris Energy",      url: "solarisenergy.com" },
];

export function ProspectAudit() {
  const [results, setResults] = useState<AuditResult[]>([]);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<AuditResult | null>(null);

  function runAll() {
    setRunning(true);
    setResults([]);
    let i = 0;
    const id = setInterval(() => {
      const p = sampleProspects[i];
      setResults(prev => [...prev, runAudit(p.company, p.url)]);
      i++;
      if (i >= sampleProspects.length) {
        clearInterval(id);
        setRunning(false);
      }
    }, 700);
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
            Prospect Audit
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Run automated AEO audits on all discovered prospects</p>
        </div>
        <button onClick={runAll} disabled={running} className="btn-primary gap-2">
          {running ? <><RefreshCw className="w-4 h-4 animate-spin" />Auditing…</> : <><Radar className="w-4 h-4" />Run All Audits</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Prospect list */}
        <div className="surface rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b font-semibold text-sm text-[var(--text)]"
            style={{ borderColor: "var(--border)" }}>
            Pending Audits ({sampleProspects.length})
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {sampleProspects.map((p, i) => {
              const result = results.find(r => r.company === p.company);
              return (
                <div
                  key={i}
                  onClick={() => result && setSelected(result)}
                  className={`flex items-center gap-4 px-5 py-3.5 transition-all ${result ? "cursor-pointer hover:bg-[var(--card-hover)]" : ""}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: result ? "var(--accent-glow)" : "var(--card-hover)" }}>
                    {result
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      : running
                      ? <RefreshCw className="w-4 h-4 animate-spin" style={{ color: "var(--muted)" }} />
                      : <Globe className="w-4 h-4" style={{ color: "var(--muted)" }} />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text)]">{p.company}</p>
                    <p className="text-xs text-[var(--muted)]">{p.url}</p>
                  </div>
                  {result && (
                    <div className="text-right">
                      <span className="text-lg font-bold" style={{ color: scoreColor(result.aiVisibility), fontFamily: "var(--font-space)" }}>
                        {result.aiVisibility}
                      </span>
                      <span className="text-xs text-[var(--muted)] ml-1">/100</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.company}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="surface rounded-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[var(--text)]">{selected.company}</h2>
                  <p className="text-xs text-[var(--muted)]">{selected.url}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: `${scoreColor(selected.aiVisibility)}22`,
                    color: scoreColor(selected.aiVisibility),
                  }}>
                  Grade {selected.grade}
                </span>
              </div>

              {[
                { label: "AI Visibility Score",   value: selected.aiVisibility,       icon: Star },
                { label: "Technical SEO",          value: selected.technical,           icon: CheckCircle2 },
                { label: "Entity Score",           value: selected.entity,              icon: TrendingUp },
                { label: "Local Authority",        value: selected.localAuthority,      icon: Globe },
                { label: "Competitor Gap",         value: selected.competitorGap,       icon: AlertTriangle },
                { label: "Revenue Opportunity",    value: selected.revenueOpportunity,  icon: TrendingUp },
                { label: "Sales Readiness",        value: selected.salesReadiness,      icon: Radar },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
                      <span className="text-xs text-[var(--muted)]">{label}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: scoreColor(value) }}>{value}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      style={{ background: scoreColor(value) }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button className="btn-primary flex-1 justify-center text-sm">
                  Start Outreach
                </button>
                <button className="btn-secondary flex-1 justify-center text-sm">
                  Add to CRM
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="surface rounded-2xl p-10 flex flex-col items-center justify-center text-center"
            >
              <Radar className="w-10 h-10 mb-3" style={{ color: "var(--muted)" }} />
              <p className="text-sm text-[var(--muted)]">Click &quot;Run All Audits&quot; then select a result to see the full breakdown</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
