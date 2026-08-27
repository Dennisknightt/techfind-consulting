"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Activity, Users, Radar, Star, Send, MessageSquare, Calendar, FileText, CheckCircle2, TrendingUp, DollarSign, RefreshCw } from "lucide-react";
import { useLeads } from "../useLeads";

function gradeColor(g: string) {
  if (g === "A+") return "#10b981";
  if (g === "A")  return "#3b82f6";
  if (g === "B")  return "#f59e0b";
  return "#6b7280";
}

const quickLinks = [
  { label: "Discover Prospects",  href: "?tab=discovery", icon: Users },
  { label: "Run Prospect Audit",  href: "?tab=audit",     icon: Radar },
  { label: "View CRM Pipeline",   href: "?tab=crm",       icon: Activity },
  { label: "Communications",      href: "?tab=communications", icon: MessageSquare },
  { label: "Create Proposal",     href: "?tab=proposals", icon: FileText },
];

export function RevDashboard() {
  const { leads, loading, error, refresh } = useLeads();

  const qualified   = leads.filter(l => ["A+", "A"].includes(l.grade));
  const meetings    = leads.filter(l => l.stage === "Meeting Booked");
  const proposals   = leads.filter(l => l.stage === "Proposal Sent");
  const won         = leads.filter(l => l.stage === "Won");
  const mrr         = won.length * 1200;
  const pipeline    = leads.filter(l => !["Lost","Nurture","Discovered"].includes(l.stage)).length * 1200;

  const stats = [
    { label: "Leads Captured",   value: leads.length.toString(),          icon: Users,         color: "var(--accent)" },
    { label: "Qualified Leads",  value: qualified.length.toString(),       icon: Star,          color: "#f59e0b" },
    { label: "Meetings Booked",  value: meetings.length.toString(),        icon: Calendar,      color: "var(--accent-2)" },
    { label: "Proposals Sent",   value: proposals.length.toString(),       icon: FileText,      color: "#ec4899" },
    { label: "Clients Won",      value: won.length.toString(),             icon: CheckCircle2,  color: "#10b981" },
    { label: "MRR Added",        value: `$${mrr.toLocaleString()}`,        icon: TrendingUp,    color: "#10b981" },
    { label: "Pipeline Value",   value: `$${(pipeline/1000).toFixed(0)}K`, icon: DollarSign,    color: "var(--accent)" },
  ];

  const recent = leads.slice(0, 8);

  const funnelStages = [
    { label: "Captured",       count: leads.length },
    { label: "Qualified",      count: qualified.length },
    { label: "Meetings",       count: meetings.length },
    { label: "Proposals",      count: proposals.length },
    { label: "Won",            count: won.length },
  ];
  const funnelMax = leads.length || 1;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
            AI Revenue Engine
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Live data — real audit submissions from your website
          </p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
          style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--muted)" }}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Error / Empty state */}
      {error && (
        <div className="rounded-2xl px-5 py-4 text-sm text-red-400" style={{ background: "#ef444420", border: "1px solid #ef444440" }}>
          {error}
        </div>
      )}

      {!loading && leads.length === 0 && (
        <div className="surface rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-bold text-[var(--text)] mb-2">No leads yet</h3>
          <p className="text-sm text-[var(--muted)] mb-4">
            Share your <strong>/audit</strong> page link and leads will appear here in real time as visitors complete the audit.
          </p>
          <Link href="/audit" target="_blank"
            className="btn-primary text-sm inline-flex gap-2">
            Open Audit Page <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Stats grid */}
      {leads.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {stats.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="surface rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}22` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                </div>
                <div className="text-xl font-bold text-[var(--text)] mb-0.5" style={{ fontFamily: "var(--font-space)" }}>
                  {loading ? "—" : value}
                </div>
                <div className="text-xs text-[var(--muted)]">{label}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href}
                className="surface surface-hover rounded-2xl p-4 flex items-center gap-3 transition-all group">
                <Icon className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm font-medium text-[var(--text)]">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--accent)" }} />
              </Link>
            ))}
          </div>

          {/* Recent leads table */}
          <div className="surface rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-bold text-[var(--text)]">
                Recent Leads <span className="text-[var(--muted)] font-normal text-sm">({leads.length} total)</span>
              </h2>
              <Link href="?tab=crm" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
                View all in CRM <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                    {["Company", "Industry", "Score", "Grade", "Qualified", "Stage", "Date"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((l, i) => (
                    <motion.tr key={l.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
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
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold ${l.qualified ? "text-emerald-400" : "text-[var(--muted)]"}`}>
                          {l.qualified ? "✓ Yes" : "Nurture"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "var(--card-hover)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                          {l.stage}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-[var(--muted)]">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Funnel */}
          <div className="surface rounded-2xl p-6">
            <h2 className="font-bold text-[var(--text)] mb-5">Conversion Funnel</h2>
            <div className="space-y-3">
              {funnelStages.map(({ label, count }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="text-xs text-[var(--muted)] w-24 shrink-0">{label}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / funnelMax) * 100}%` }}
                      transition={{ duration: 0.8 }}
                      style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text)] w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
