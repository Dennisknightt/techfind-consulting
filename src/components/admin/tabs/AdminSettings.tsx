"use client";

import { useState } from "react";
import { Settings, Globe, Mail, Calendar, Shield, Save, Clock } from "lucide-react";

export function AdminSettings() {
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [timezone, setTimezone] = useState("US/Eastern");
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Settings
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Configure integrations and outreach preferences</p>
      </div>

      {[
        {
          icon: Calendar,
          title: "Calendar Integration",
          fields: [
            {
              label: "Calendly Link",
              value: calendlyUrl,
              onChange: setCalendlyUrl,
              placeholder: "https://calendly.com/yourname/strategy-call",
              icon: Globe,
            },
          ],
        },
        {
          icon: Mail,
          title: "Outreach Email",
          fields: [
            {
              label: "From Email",
              value: fromEmail,
              onChange: setFromEmail,
              placeholder: "you@youragency.com",
              icon: Mail,
            },
          ],
        },
        {
          icon: Clock,
          title: "Sending Window",
          desc: "Outreach messages only send Tue–Thu, 8–11am and 1–3pm in the prospect's local timezone.",
          fields: [
            {
              label: "Default Timezone",
              value: timezone,
              onChange: setTimezone,
              placeholder: "US/Eastern",
              icon: Clock,
            },
          ],
        },
        {
          icon: Shield,
          title: "Qualification Firewall",
          desc: "Leads that answer: No budget / No authority / Students / Competitors → auto-routed to Nurture. This is automatic and cannot be disabled.",
          fields: [],
        },
      ].map(({ icon: Icon, title, desc, fields }) => (
        <div key={title} className="surface rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-glow)" }}>
              <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </div>
            <h2 className="font-semibold text-[var(--text)]">{title}</h2>
          </div>
          {desc && <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">{desc}</p>}
          {fields.map(({ label, value, onChange, placeholder, icon: FIcon }) => (
            <div key={label} className="mb-3">
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">
                {label}
              </label>
              <div className="relative">
                <FIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--card-hover)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      <button onClick={save} className="btn-primary gap-2">
        <Save className="w-4 h-4" />
        {saved ? "Saved ✓" : "Save Settings"}
      </button>
    </div>
  );
}
