"use client";

import { useEffect, useState } from "react";
import { Settings, Globe, Mail, Calendar, Shield, Save, Clock, CheckCircle2 } from "lucide-react";

const LS_CALENDLY = "tf_calendly_url";
const LS_EMAIL    = "tf_from_email";
const LS_TZ       = "tf_timezone";

export function AdminSettings() {
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [fromEmail, setFromEmail]     = useState("");
  const [timezone, setTimezone]       = useState("Europe/London");
  const [saved, setSaved]             = useState(false);

  // Load persisted values
  useEffect(() => {
    setCalendlyUrl(localStorage.getItem(LS_CALENDLY) ?? "");
    setFromEmail(localStorage.getItem(LS_EMAIL) ?? "");
    setTimezone(localStorage.getItem(LS_TZ) ?? "Europe/London");
  }, []);

  function save() {
    localStorage.setItem(LS_CALENDLY, calendlyUrl);
    localStorage.setItem(LS_EMAIL, fromEmail);
    localStorage.setItem(LS_TZ, timezone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Settings
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Configure integrations and outreach preferences. Saved to browser — instant effect.</p>
      </div>

      {/* Calendly */}
      <div className="surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-glow)" }}>
            <Calendar className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="font-semibold text-[var(--text)]">Calendar Integration</h2>
          {calendlyUrl && (
            <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          )}
        </div>
        <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">
          Calendly Event URL
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="url"
            value={calendlyUrl}
            onChange={e => setCalendlyUrl(e.target.value)}
            placeholder="https://calendly.com/yourname/strategy-call"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">
          This URL is used in the Calendar & Booking tab to embed the scheduler for qualified leads.
          You can find it in your Calendly dashboard under <strong>Event Types → Copy Link</strong>.
        </p>
      </div>

      {/* Outreach email */}
      <div className="surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-glow)" }}>
            <Mail className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="font-semibold text-[var(--text)]">Outreach Email</h2>
        </div>
        <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">
          From Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="email"
            value={fromEmail}
            onChange={e => setFromEmail(e.target.value)}
            placeholder="you@youragency.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>
      </div>

      {/* Sending window */}
      <div className="surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-glow)" }}>
            <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="font-semibold text-[var(--text)]">Sending Window</h2>
        </div>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          Best practice: send outreach Tue–Thu, 8–11am and 1–3pm in the prospect's local timezone.
        </p>
        <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">
          Your Timezone
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none appearance-none"
            style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {[
              "Africa/Nairobi", "Africa/Lagos", "Africa/Johannesburg",
              "Europe/London", "Europe/Dublin", "Asia/Dubai",
              "Australia/Sydney", "Asia/Singapore", "America/New_York",
            ].map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
      </div>

      {/* Qualification Firewall (read-only info) */}
      <div className="surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-glow)" }}>
            <Shield className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="font-semibold text-[var(--text)]">Qualification Firewall</h2>
          <span className="ml-auto text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Leads are automatically scored and qualified when they complete the /audit form.
          Those without budget, authority, or a valid timeline are routed to <strong>Nurture</strong> instead of the sales pipeline.
          This firewall is always on and cannot be disabled.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {[
            "Budget: $1k+ required",
            "Decision maker: must be yes",
            "Timeline: immediate or 1–3mo",
            "Competitors auto-excluded",
          ].map(rule => (
            <div key={rule} className="flex items-center gap-2 text-[var(--muted)]">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              {rule}
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} className="btn-primary gap-2">
        <Save className="w-4 h-4" />
        {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : "Save Settings"}
      </button>
    </div>
  );
}
