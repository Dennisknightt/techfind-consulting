"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, RefreshCw, Mail, Linkedin, Globe, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

const prospects = [
  { company: "Summit HVAC",    industry: "HVAC",   score: 94, gap: "Not found in ChatGPT or Gemini", opportunity: "$180K+ in missed leads/year" },
  { company: "LexGroup Law",   industry: "Legal",  score: 92, gap: "Competitor Apex Law ranks in all AI queries", opportunity: "$240K+ in missed referrals/year" },
  { company: "Premier Dental", industry: "Dental", score: 91, gap: "Zero AI citations despite 200+ reviews", opportunity: "$120K+ new patient revenue at risk" },
];

const channels: { key: string; icon: React.ElementType; label: string }[] = [
  { key: "email",    icon: Mail,     label: "Email" },
  { key: "linkedin", icon: Linkedin, label: "LinkedIn DM" },
  { key: "form",     icon: Globe,    label: "Contact Form" },
];

function generateMessage(prospect: typeof prospects[0], channel: string): string {
  const subject = channel === "email" ? `Subject: Your ${prospect.industry} business isn't showing up in AI search — here's proof\n\n` : "";
  return `${subject}Hi [First Name],

I ran a quick AI visibility audit on ${prospect.company}'s website and found something concerning.

When potential customers ask ChatGPT, Claude, or Gemini questions like "best ${prospect.industry.toLowerCase()} company near me," your business doesn't appear — but your competitors do.

Here's what we found:
• ${prospect.gap}
• Estimated missed opportunity: ${prospect.opportunity}
• Your AI Visibility Score: ${prospect.score}/100 (industry avg: 72)

We help ${prospect.industry} companies like yours get recommended by AI — usually within 90 days.

Would you be open to a 20-minute call to see your full report and a custom fix plan? I can send it over to you right now.

Best,
[Your Name]
TechFind Consulting`;
}

export function OutreachAgent() {
  const [selected, setSelected] = useState<typeof prospects[0] | null>(null);
  const [channel, setChannel] = useState("email");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  function generate() {
    if (!selected) return;
    setGenerating(true);
    setTimeout(() => {
      setMessage(generateMessage(selected, channel));
      setGenerating(false);
    }, 900);
  }

  function markSent() {
    if (!selected) return;
    setSent(prev => [...prev, selected.company]);
    setMessage("");
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Outreach Agent
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          AI-powered personalised outreach — email, LinkedIn, contact forms
        </p>
      </div>

      {/* Schedule info */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
        <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <p className="text-xs" style={{ color: "var(--accent)" }}>
          <strong>Sending window:</strong> Tue–Thu · 8–11am and 1–3pm in prospect&apos;s local timezone.
          Research and message generation run 24/7. Sending is gated to business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prospect list */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-[var(--muted)] uppercase tracking-wider">
            Ready for Outreach (A+ & A)
          </h2>
          {prospects.map((p, i) => {
            const isSent = sent.includes(p.company);
            return (
              <button
                key={i}
                onClick={() => !isSent && setSelected(p)}
                className="w-full text-left surface rounded-2xl p-4 transition-all"
                style={{
                  border: `1px solid ${selected?.company === p.company ? "var(--border-accent)" : "var(--border)"}`,
                  background: selected?.company === p.company ? "var(--accent-glow)" : "var(--card)",
                  opacity: isSent ? 0.5 : 1,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-[var(--text)]">{p.company}</span>
                  {isSent
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <span className="text-xs font-bold text-[var(--accent)]">{p.score}</span>
                  }
                </div>
                <span className="text-xs text-[var(--muted)]">{p.industry}</span>
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
                onClick={() => setChannel(key)}
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
                  <h3 className="font-bold text-[var(--text)]">{selected.company}</h3>
                  <p className="text-xs text-[var(--muted)]">{selected.opportunity}</p>
                </div>
                <button
                  onClick={generate}
                  disabled={generating}
                  className="btn-primary text-sm gap-2"
                >
                  {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</> : <><Bot className="w-4 h-4" />Generate Message</>}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {message ? (
                  <motion.div key="msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={14}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none font-mono"
                      style={{
                        background: "var(--card-hover)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                      }}
                    />
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={markSent} className="btn-primary gap-2 text-sm">
                        <Send className="w-4 h-4" /> Mark as Sent
                      </button>
                      <button onClick={generate} className="btn-secondary text-sm gap-2">
                        <RefreshCw className="w-4 h-4" /> Regenerate
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="flex flex-col items-center justify-center py-12 text-center">
                    <Bot className="w-10 h-10 mb-3" style={{ color: "var(--muted)" }} />
                    <p className="text-sm text-[var(--muted)]">Click Generate to create a personalised message</p>
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
    </div>
  );
}
