"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, ArrowRight, Clock, Star, TrendingUp, FileText, Users } from "lucide-react";

const meetings = [
  {
    company: "Summit HVAC",
    contact: "James Ortega",
    date: "Jun 10, 2026 · 9:00 AM CST",
    score: 94,
    grade: "A+",
    package: "AEO Growth Partner ($1,200/mo)",
    closeProbability: 78,
    salesAngle: "Competitor Apex HVAC shows in ChatGPT for all 12 target queries. Summit appears in 0. Show the screenshot — let the data do the talking.",
    brief: "James runs a $2.8M/yr HVAC business in Dallas. Been in business 11 years. Currently spending $2K/mo on Google Ads. No SEO. No AI strategy. Very active on Google reviews (4.9★, 312 reviews). His biggest competitor is Apex HVAC who dominates AI search.",
  },
  {
    company: "LexGroup Law",
    contact: "Priya Singh",
    date: "Jun 11, 2026 · 2:00 PM EST",
    score: 92,
    grade: "A+",
    package: "AEO Growth Partner ($1,200/mo)",
    closeProbability: 71,
    salesAngle: "Priya's firm focuses on M&A and corporate law. Major AI gap in 'M&A lawyer [city]' queries. Show entity gap report.",
    brief: "Priya is managing partner at LexGroup, a 12-partner corporate law firm. $8M revenue. Marketing spend $5K/mo (mostly LinkedIn). Very competitive market in Chicago.",
  },
];

const gradeColor = (g: string) => g === "A+" ? "#10b981" : "#3b82f6";

export function CalendarBooking() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Calendar & Booking
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Only qualified leads (A+ and A grade) access booking. Pre-call briefs auto-generated.
        </p>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Calendly", connected: false, desc: "Embed your Calendly scheduling link" },
          { label: "Google Calendar", connected: false, desc: "Connect your Google Calendar directly" },
        ].map(({ label, connected, desc }) => (
          <div key={label} className="surface rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--card-hover)" }}>
                <Calendar className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--text)]">{label}</p>
                <p className="text-xs text-[var(--muted)]">{desc}</p>
              </div>
            </div>
            <button className={connected ? "btn-secondary text-xs" : "btn-primary text-xs"}>
              {connected ? "Connected ✓" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      {/* Upcoming meetings */}
      <div>
        <h2 className="font-bold text-[var(--text)] mb-4">Upcoming Strategy Calls</h2>
        <div className="space-y-4">
          {meetings.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="surface rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${gradeColor(m.grade)}22` }}>
                    <Users className="w-5 h-5" style={{ color: gradeColor(m.grade) }} />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text)]">{m.company}</p>
                    <p className="text-xs text-[var(--muted)]">{m.contact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-0.5">
                    <Clock className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
                    <span className="text-xs text-[var(--muted)]">{m.date}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${gradeColor(m.grade)}22`, color: gradeColor(m.grade) }}>
                    Grade {m.grade}
                  </span>
                </div>
              </div>

              {/* Brief */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                    Company Brief
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{m.brief}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted)" }}>
                      Suggested Sales Angle
                    </p>
                    <p className="text-sm text-[var(--text)] leading-relaxed">{m.salesAngle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                    <span className="text-xs text-[var(--muted)]">Lead score: <strong className="text-[var(--text)]">{m.score}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-[var(--muted)]">Close probability: <strong className="text-emerald-400">{m.closeProbability}%</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" style={{ color: "var(--accent-2)" }} />
                    <span className="text-xs text-[var(--muted)]">Recommend: <strong className="text-[var(--text)]">{m.package}</strong></span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="btn-primary text-xs flex-1 justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                    </button>
                    <button className="btn-secondary text-xs flex-1 justify-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Create Proposal
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
