"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, Radar, Star, Send, MessageSquare, Calendar, FileText,
  CheckCircle2, TrendingUp, DollarSign, ArrowUpRight, ArrowRight,
  Activity
} from "lucide-react";

const stats = [
  { label: "Prospects Discovered",  value: "1,284", delta: "+48 today",  icon: Users,          color: "var(--accent)" },
  { label: "Prospects Audited",     value: "876",   delta: "+23 today",  icon: Radar,          color: "var(--accent-2)" },
  { label: "Qualified Leads",       value: "142",   delta: "+7 today",   icon: Star,           color: "#f59e0b" },
  { label: "Outreach Sent",         value: "389",   delta: "+18 today",  icon: Send,           color: "var(--accent)" },
  { label: "Replies Received",      value: "67",    delta: "+4 today",   icon: MessageSquare,  color: "#10b981" },
  { label: "Meetings Booked",       value: "31",    delta: "+2 today",   icon: Calendar,       color: "var(--accent-2)" },
  { label: "Proposals Sent",        value: "19",    delta: "+1 today",   icon: FileText,       color: "#f59e0b" },
  { label: "Clients Closed",        value: "8",     delta: "This month", icon: CheckCircle2,   color: "#10b981" },
  { label: "MRR Added",             value: "$9,600", delta: "+$1,200",   icon: TrendingUp,     color: "#10b981" },
  { label: "Pipeline Value",        value: "$47K",  delta: "Active",     icon: DollarSign,     color: "var(--accent)" },
];

const recentLeads = [
  { company: "Summit HVAC",     score: 94, grade: "A+", status: "Outreach Sent",  industry: "HVAC" },
  { company: "Bright Solar Co", score: 88, grade: "A",  status: "Meeting Booked", industry: "Solar" },
  { company: "Premier Dental",  score: 91, grade: "A+", status: "Proposal Sent",  industry: "Dental" },
  { company: "Atlas Roofing",   score: 82, grade: "A",  status: "Responded",      industry: "Roofing" },
  { company: "LexGroup Law",    score: 95, grade: "A+", status: "Meeting Booked", industry: "Legal" },
];

const gradeColor = (g: string) =>
  g === "A+" ? "#10b981" : g === "A" ? "#3b82f6" : "#f59e0b";

const quickLinks = [
  { label: "Discover Prospects",  href: "?tab=discovery", icon: Users },
  { label: "Run Prospect Audit",  href: "?tab=audit",     icon: Radar },
  { label: "View CRM Pipeline",   href: "?tab=crm",       icon: Activity },
  { label: "Create Proposal",     href: "?tab=proposals", icon: FileText },
];

export function RevDashboard() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          AI Revenue Engine
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Your automated outbound + inbound client acquisition system
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, delta, icon: Icon, color }, i) => (
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
              <span className="text-xs text-emerald-400 font-semibold">{delta}</span>
            </div>
            <div className="text-xl font-bold text-[var(--text)] mb-0.5" style={{ fontFamily: "var(--font-space)" }}>
              {value}
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
          <h2 className="font-bold text-[var(--text)]">Recent Qualified Leads</h2>
          <Link href="?tab=crm" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Company", "Industry", "Score", "Grade", "Status"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((l, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-[var(--card-hover)] transition-colors"
                  style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-3 font-medium text-[var(--text)]">{l.company}</td>
                  <td className="px-6 py-3 text-[var(--muted)]">{l.industry}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text)]">{l.score}</span>
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${l.score}%`, background: gradeColor(l.grade) }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: `${gradeColor(l.grade)}22`, color: gradeColor(l.grade) }}>
                      {l.grade}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs"
                      style={{ background: "var(--card-hover)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="surface rounded-2xl p-6">
        <h2 className="font-bold text-[var(--text)] mb-5">Conversion Funnel</h2>
        <div className="space-y-3">
          {[
            { label: "Discovered",    count: 1284, pct: 100 },
            { label: "Audited",       count: 876,  pct: 68 },
            { label: "Qualified",     count: 142,  pct: 11 },
            { label: "Outreach Sent", count: 389,  pct: 30 },
            { label: "Responded",     count: 67,   pct: 5.2 },
            { label: "Meetings",      count: 31,   pct: 2.4 },
            { label: "Proposals",     count: 19,   pct: 1.5 },
            { label: "Won",           count: 8,    pct: 0.6 },
          ].map(({ label, count, pct }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="text-xs text-[var(--muted)] w-28 shrink-0">{label}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8 }}
                  style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
                />
              </div>
              <span className="text-xs font-semibold text-[var(--text)] w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
