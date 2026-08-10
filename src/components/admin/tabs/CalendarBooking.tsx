"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Star, TrendingUp, FileText, Users, Settings, ExternalLink, RefreshCw } from "lucide-react";
import { useLeads } from "../useLeads";

/* ── Load Calendly widget script once ─────────────────────────────── */
function useCalendlyScript() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.getElementById("calendly-script")) { setReady(true); return; }
    const script = document.createElement("script");
    script.id  = "calendly-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);

    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
  }, []);
  return ready;
}

function gradeColor(g: string) {
  if (g === "A+") return "#10b981";
  if (g === "A")  return "#3b82f6";
  return "#6b7280";
}

export function CalendarBooking() {
  const { leads, loading, refresh } = useLeads();
  useCalendlyScript(); // loads Calendly widget.js + CSS into the page
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [showEmbed, setShowEmbed] = useState<string | null>(null); // lead id

  // Load saved Calendly URL from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tf_calendly_url") ?? "";
    setCalendlyUrl(saved);
  }, []);

  function saveCalendlyUrl(url: string) {
    setCalendlyUrl(url);
    localStorage.setItem("tf_calendly_url", url);
  }

  // Qualified leads (A+ or A) eligible for booking
  const qualifiedLeads = leads.filter(l =>
    (l.grade === "A+" || l.grade === "A") && l.qualified
  );
  const meetingLeads = leads.filter(l => l.stage === "Meeting Booked");

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
            Calendar & Booking
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Only A+ and A qualified leads can book. Live Calendly embed.
          </p>
        </div>
        <button onClick={refresh} className="p-2 rounded-xl"
          style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--muted)" }}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Calendly URL config */}
      <div className="surface rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-glow)" }}>
            <Calendar className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="font-semibold text-[var(--text)]">Calendly Integration</h2>
          {calendlyUrl && (
            <span className="ml-auto text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <input
            type="url"
            value={calendlyUrl}
            onChange={e => saveCalendlyUrl(e.target.value)}
            placeholder="https://calendly.com/yourname/strategy-call"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          {calendlyUrl && (
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-sm gap-1.5 inline-flex items-center">
              Preview <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        {!calendlyUrl && (
          <p className="text-xs text-[var(--muted)] mt-2">
            Paste your Calendly event URL above. Qualified leads will book directly through the embedded calendar.
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Qualified for Booking", value: qualifiedLeads.length },
          { label: "Meetings Booked",        value: meetingLeads.length },
          { label: "Total Leads",            value: leads.length },
        ].map(({ label, value }) => (
          <div key={label} className="surface rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--text)] mb-1" style={{ fontFamily: "var(--font-space)" }}>
              {loading ? "—" : value}
            </p>
            <p className="text-xs text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Qualified leads list */}
      {qualifiedLeads.length === 0 && !loading ? (
        <div className="surface rounded-2xl p-10 text-center">
          <p className="text-2xl mb-3">📅</p>
          <p className="font-bold text-[var(--text)] mb-1">No qualified leads yet</p>
          <p className="text-sm text-[var(--muted)]">
            A+ and A graded leads who pass qualification will appear here ready for booking
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-bold text-[var(--text)]">Qualified for Strategy Call ({qualifiedLeads.length})</h2>
          {qualifiedLeads.map((lead, i) => (
            <motion.div key={lead.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="surface rounded-2xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${gradeColor(lead.grade)}22` }}>
                    <Users className="w-5 h-5" style={{ color: gradeColor(lead.grade) }} />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text)]">{lead.companyName}</p>
                    <p className="text-xs text-[var(--muted)]">{lead.email} · {lead.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${gradeColor(lead.grade)}22`, color: gradeColor(lead.grade) }}>
                    Grade {lead.grade}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  {[
                    { icon: Star,       label: "AI Score",    val: `${lead.overallScore}/100` },
                    { icon: TrendingUp, label: "Industry",    val: lead.industry },
                    { icon: FileText,   label: "Budget",      val: lead.budget ?? "Not stated" },
                    { icon: CheckCircle2, label: "Timeline",  val: lead.timeline ?? "—" },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--muted)" }} />
                      <span className="text-[var(--muted)]">{label}:</span>
                      <span className="font-semibold text-[var(--text)]">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Calendly embed or prompt */}
                <div>
                  {calendlyUrl ? (
                    showEmbed === lead.id ? (
                      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                        <div
                          className="calendly-inline-widget"
                          data-url={`${calendlyUrl}?name=${encodeURIComponent(lead.companyName)}&email=${encodeURIComponent(lead.email)}&a1=${lead.overallScore}`}
                          style={{ minWidth: "100%", height: 420 }}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowEmbed(lead.id)}
                        className="btn-primary w-full justify-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Book Strategy Call for {lead.companyName}
                      </button>
                    )
                  ) : (
                    <div className="rounded-xl p-5 flex flex-col items-center justify-center text-center h-full"
                      style={{ background: "var(--card-hover)", border: "1px dashed var(--border)" }}>
                      <Settings className="w-7 h-7 mb-2" style={{ color: "var(--muted)" }} />
                      <p className="text-xs text-[var(--muted)]">
                        Add your Calendly URL above to activate booking for this lead
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
