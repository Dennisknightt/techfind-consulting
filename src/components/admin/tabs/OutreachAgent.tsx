"use client";

import { useState } from "react";
import type { ElementType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, RefreshCw, Mail, Linkedin, Globe, Clock, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import { useLeads } from "../useLeads";
import type { Lead } from "../useLeads";

const channels: { key: string; icon: ElementType; label: string }[] = [
  { key: "email",    icon: Mail,     label: "Email" },
  { key: "linkedin", icon: Linkedin, label: "LinkedIn DM" },
  { key: "form",     icon: Globe,    label: "Contact Form" },
];

function opportunityText(lead: Lead): string {
  const missed = lead.opportunities;
  if (missed >= 5) return `${missed} high-value AI queries where you're invisible to buyers`;
  return `multiple AI platforms where competitors appear but you don't`;
}

function generateMessage(lead: Lead, channel: string): string {
  const subject = channel === "email"
    ? `Subject: ${lead.companyName} isn't showing up in AI search — here's proof\n\n`
    : "";
  const oppText = opportunityText(lead);
  return `${subject}Hi [First Name],

I ran a free AI visibility audit on ${lead.companyName}'s website and found something your sales team needs to know.

When potential customers ask ChatGPT, Claude, or Gemini questions like "best ${lead.industry.toLowerCase()} company near me," your business doesn't appear — but your competitors do.

Here's what our audit found:
• AI Visibility Score: ${lead.overallScore}/100 (industry avg: 72)
• ${oppText}
• Technical optimisation gaps blocking AI discovery
• Competitor advantage in entity recognition & authority signals

We help ${lead.industry} companies like yours get recommended by AI — usually within 60–90 days.

I've already prepared your full audit report. Would you like me to send it over? I can also carve out 20 minutes to walk you through a custom fix plan at no cost.

Best,
[Your Name]
TechFind Consulting
techfind.vercel.app`;
}

function gradeColor(g: string) {
  if (g === "A+") return "#10b981";
  if (g === "A")  return "#3b82f6";
  return "#6b7280";
}

export function OutreachAgent() {
  const { leads, loading, updateStage, refresh } = useLeads();
  const [selected, setSelected] = useState<Lead | null>(null);
  const [channel, setChannel]   = useState("email");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage]   = useState("");
  const [sent, setSent]         = useState<Set<string>>(new Set());

  // Only A+ and A graded leads are eligible for outreach
  const eligible = leads.filter(l => l.grade === "A+" || l.grade === "A");

  function generate() {
    if (!selected) return;
    setGenerating(true);
    setTimeout(() => {
      setMessage(generateMessage(selected, channel));
      setGenerating(false);
    }, 900);
  }

  async function markSent() {
    if (!selected) return;
    setSent(prev => new Set([...prev, selected.id]));
    await updateStage(selected.id, "Outreach Sent");
    setMessage("");
    setSelected(null);
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
            Outreach Agent
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            AI-powered personalised outreach generated from real audit data
          </p>
        </div>
        <button onClick={refresh} className="p-2 rounded-xl"
          style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--muted)" }}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Schedule info */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
        <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <p className="text-xs" style={{ color: "var(--accent)" }}>
          <strong>Best sending window:</strong> Tue–Thu · 8–11am and 1–3pm in prospect&rsquo;s local timezone.
          Messages are generated from their real audit data — personalised and specific.
        </p>
      </div>

      {/* Empty state */}
      {!loading && eligible.length === 0 && (
        <div className="surface rounded-2xl p-10 text-center">
          <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <p className="font-bold text-[var(--text)] mb-1">No A+ or A leads yet</p>
          <p className="text-sm text-[var(--muted)]">
            As leads come in and score 80+, they&rsquo;ll appear here ready for outreach
          </p>
        </div>
      )}

      {eligible.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prospect list */}
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-[var(--muted)] uppercase tracking-wider">
              Ready for Outreach ({eligible.length})
            </h2>
            {eligible.map(lead => {
              const isSent = sent.has(lead.id) || lead.stage === "Outreach Sent";
              return (
                <button
                  key={lead.id}
                  onClick={() => { if (!isSent) { setSelected(lead); setMessage(""); } }}
                  className="w-full text-left surface rounded-2xl p-4 transition-all"
                  style={{
                    border: `1px solid ${selected?.id === lead.id ? "var(--border-accent)" : "var(--border)"}`,
                    background: selected?.id === lead.id ? "var(--accent-glow)" : "var(--card)",
                    opacity: isSent ? 0.5 : 1,
                    cursor: isSent ? "not-allowed" : "pointer",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-[var(--text)] truncate">{lead.companyName}</span>
                    {isSent
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <span className="text-xs font-bold shrink-0" style={{ color: gradeColor(lead.grade) }}>
                          {lead.grade} · {lead.overallScore}
                        </span>
                    }
                  </div>
                  <p className="text-xs text-[var(--muted)]">{lead.industry} · {lead.country}</p>
                  {isSent && <p className="text-xs text-emerald-400 mt-1 font-semibold">✓ Outreach sent</p>}
                </button>
              );
            })}
          </div>

          {/* Message builder */}
          <div className="lg:col-span-2 space-y-4">
            {/* Channel tabs */}
            <div className="flex gap-2">
              {channels.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => { setChannel(key); setMessage(""); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: channel === key ? "var(--accent-glow)" : "var(--card-hover)",
                    border: `1px solid ${channel === key ? "var(--border-accent)" : "var(--border)"}`,
                    color: channel === key ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {selected ? (
              <div className="surface rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[var(--text)]">{selected.companyName}</h3>
                    <p className="text-xs text-[var(--muted)]">
                      Score: {selected.overallScore}/100 · {selected.industry} · {selected.budget ?? "Budget unknown"}
                    </p>
                  </div>
                  <button
                    onClick={generate}
                    disabled={generating}
                    className="btn-primary text-sm gap-2"
                  >
                    {generating
                      ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</>
                      : <><Bot className="w-4 h-4" />Generate Message</>}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {message ? (
                    <motion.div key="msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={16}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none font-mono"
                        style={{
                          background: "var(--card-hover)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                        }}
                      />
                      <div className="flex items-center gap-3 mt-3">
                        <a
                          href={`mailto:${selected.email}?subject=${encodeURIComponent(`AI Visibility for ${selected.companyName}`)}&body=${encodeURIComponent(message)}`}
                          className="btn-primary gap-2 text-sm"
                          onClick={markSent}>
                          <Send className="w-4 h-4" /> Open in Email
                        </a>
                        <button onClick={markSent} className="btn-secondary text-sm gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Mark as Sent
                        </button>
                        <button onClick={generate} className="btn-secondary text-sm gap-2">
                          <RefreshCw className="w-4 h-4" /> Regenerate
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" className="flex flex-col items-center justify-center py-12 text-center">
                      <Bot className="w-10 h-10 mb-3" style={{ color: "var(--muted)" }} />
                      <p className="text-sm text-[var(--muted)]">
                        Click <strong>Generate Message</strong> to create a personalised outreach based on their audit
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="surface rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64">
                <AlertTriangle className="w-8 h-8 mb-3" style={{ color: "var(--muted)" }} />
                <p className="text-sm text-[var(--muted)]">Select a prospect on the left to generate outreach</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
