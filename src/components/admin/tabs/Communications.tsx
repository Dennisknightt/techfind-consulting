"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare, Mail, Phone, Linkedin, StickyNote, Send,
  RefreshCw, ArrowDownLeft, ArrowUpRight, Search,
} from "lucide-react";
import { useLeads } from "../useLeads";
import { useAllCommunications, useLeadCommunications } from "../useCommunications";
import type { Lead } from "../useLeads";
import type { CommChannel, CommDirection } from "../useCommunications";

const channelMeta: Record<CommChannel, { label: string; icon: ElementType; color: string }> = {
  email:    { label: "Email",    icon: Mail,          color: "#3b82f6" },
  call:     { label: "Call",     icon: Phone,         color: "#10b981" },
  linkedin: { label: "LinkedIn", icon: Linkedin,      color: "#0ea5e9" },
  sms:      { label: "SMS",      icon: MessageSquare, color: "#f59e0b" },
  note:     { label: "Note",     icon: StickyNote,    color: "#6b7280" },
};

function gradeColor(g: string) {
  if (g === "A+") return "#10b981";
  if (g === "A")  return "#3b82f6";
  if (g === "B")  return "#f59e0b";
  return "#6b7280";
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function Communications() {
  const router = useRouter();
  const params = useSearchParams();
  const preselectId = params.get("lead");

  const { leads, loading: leadsLoading } = useLeads();
  const { communications, refresh: refreshAll } = useAllCommunications();
  const [selectedId, setSelectedId] = useState<string | null>(preselectId);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (preselectId) setSelectedId(preselectId);
  }, [preselectId]);

  const selected = useMemo<Lead | null>(
    () => leads.find(l => l.id === selectedId) ?? null,
    [leads, selectedId]
  );

  const { thread, sending, logCommunication } = useLeadCommunications(selectedId);

  // Build inbox rows: every lead, annotated with its most recent communication.
  const rows = useMemo(() => {
    const lastByLead = new Map<string, (typeof communications)[number]>();
    for (const c of communications) {
      if (!lastByLead.has(c.leadId)) lastByLead.set(c.leadId, c); // communications already sorted desc
    }
    return leads
      .map(lead => ({ lead, last: lastByLead.get(lead.id) }))
      .filter(({ lead }) =>
        !query.trim() ||
        lead.companyName.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const at = a.last ? new Date(a.last.createdAt).getTime() : new Date(a.lead.createdAt).getTime();
        const bt = b.last ? new Date(b.last.createdAt).getTime() : new Date(b.lead.createdAt).getTime();
        return bt - at;
      });
  }, [leads, communications, query]);

  const [channel, setChannel]     = useState<CommChannel>("email");
  const [direction, setDirection] = useState<CommDirection>("outbound");
  const [subject, setSubject]     = useState("");
  const [draft, setDraft]         = useState("");

  function selectLead(id: string) {
    setSelectedId(id);
    setDraft("");
    setSubject("");
    router.replace(`/admin/revenue-engine?tab=communications&lead=${id}`, { scroll: false });
  }

  async function handleLog() {
    if (!draft.trim()) return;
    await logCommunication({ channel, direction, subject: subject || undefined, body: draft.trim() });
    setDraft("");
    setSubject("");
    refreshAll();
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
            Communications
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Every email, call, LinkedIn touch and note — logged against each lead in one thread
          </p>
        </div>
        <button onClick={refreshAll} className="p-2 rounded-xl"
          style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--muted)" }}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {!leadsLoading && leads.length === 0 ? (
        <div className="surface rounded-2xl p-10 text-center">
          <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <p className="font-bold text-[var(--text)] mb-1">No leads to message yet</p>
          <p className="text-sm text-[var(--muted)]">New leads will appear here automatically</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: 560 }}>
          {/* Inbox list */}
          <div className="surface rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: 640 }}>
            <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search leads…"
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {rows.map(({ lead, last }) => {
                const Icon = last ? channelMeta[last.channel].icon : MessageSquare;
                const active = lead.id === selectedId;
                return (
                  <button
                    key={lead.id}
                    onClick={() => selectLead(lead.id)}
                    className="w-full text-left px-4 py-3 border-b transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      background: active ? "var(--accent-glow)" : "transparent",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[var(--text)] truncate">{lead.companyName}</span>
                      <span className="text-[10px] font-bold shrink-0" style={{ color: gradeColor(lead.grade) }}>
                        {lead.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate flex-1">
                        {last ? (last.subject || last.body) : "No communications logged yet"}
                      </span>
                      <span className="shrink-0">{timeAgo(last?.createdAt ?? lead.createdAt)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thread + composer */}
          <div className="lg:col-span-2 flex flex-col">
            {selected ? (
              <div className="surface rounded-2xl flex flex-col flex-1 overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <h3 className="font-bold text-[var(--text)]">{selected.companyName}</h3>
                    <p className="text-xs text-[var(--muted)]">
                      {selected.email} · {selected.industry} · {selected.stage}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{ background: `${gradeColor(selected.grade)}22`, color: gradeColor(selected.grade) }}>
                    {selected.overallScore}/100
                  </span>
                </div>

                {/* Thread */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3" style={{ minHeight: 280 }}>
                  {thread.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <MessageSquare className="w-8 h-8 mb-3" style={{ color: "var(--muted)" }} />
                      <p className="text-sm text-[var(--muted)]">No messages logged yet — log the first touch below</p>
                    </div>
                  )}
                  {thread.map(c => {
                    const meta = channelMeta[c.channel];
                    const Icon = meta.icon;
                    const out = c.direction === "outbound";
                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${out ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-[80%] rounded-2xl px-4 py-3"
                          style={{
                            background: out ? "var(--accent-glow)" : "var(--card-hover)",
                            border: `1px solid ${out ? "var(--border-accent)" : "var(--border)"}`,
                          }}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Icon className="w-3 h-3" style={{ color: meta.color }} />
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>
                              {meta.label}
                            </span>
                            {out
                              ? <ArrowUpRight className="w-3 h-3" style={{ color: "var(--muted)" }} />
                              : <ArrowDownLeft className="w-3 h-3" style={{ color: "var(--muted)" }} />}
                            <span className="text-[10px] text-[var(--muted)] ml-auto">{timeAgo(c.createdAt)}</span>
                          </div>
                          {c.subject && (
                            <p className="text-xs font-semibold text-[var(--text)] mb-1">{c.subject}</p>
                          )}
                          <p className="text-sm text-[var(--text)] whitespace-pre-wrap leading-relaxed">{c.body}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Composer */}
                <div className="border-t p-4 space-y-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex flex-wrap items-center gap-2">
                    {(Object.keys(channelMeta) as CommChannel[]).map(key => {
                      const meta = channelMeta[key];
                      const Icon = meta.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setChannel(key)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                          style={{
                            background: channel === key ? "var(--accent-glow)" : "var(--card-hover)",
                            border: `1px solid ${channel === key ? "var(--border-accent)" : "var(--border)"}`,
                            color: channel === key ? "var(--accent)" : "var(--muted)",
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" /> {meta.label}
                        </button>
                      );
                    })}
                    <div className="ml-auto flex gap-1 p-1 rounded-lg" style={{ background: "var(--card-hover)" }}>
                      {(["outbound", "inbound"] as CommDirection[]).map(d => (
                        <button
                          key={d}
                          onClick={() => setDirection(d)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium transition-all capitalize"
                          style={{
                            background: direction === d ? "var(--accent)" : "transparent",
                            color: direction === d ? "white" : "var(--muted)",
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {channel === "email" && (
                    <input
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Subject (optional)"
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
                    />
                  )}

                  <div className="flex items-end gap-2">
                    <textarea
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      placeholder={`Log a ${channelMeta[channel].label.toLowerCase()}…`}
                      rows={3}
                      className="flex-1 px-3 py-2 rounded-xl text-sm outline-none resize-none"
                      style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
                    />
                    <div className="flex flex-col gap-2">
                      {channel === "email" && selected.email && (
                        <a
                          href={`mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`}
                          className="btn-secondary text-xs px-3 py-2 whitespace-nowrap"
                        >
                          Open Email
                        </a>
                      )}
                      <button
                        onClick={handleLog}
                        disabled={!draft.trim() || sending}
                        className="btn-primary text-xs px-3 py-2 gap-1.5 whitespace-nowrap disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" /> {sending ? "Logging…" : "Log"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="surface rounded-2xl flex-1 flex flex-col items-center justify-center text-center p-10">
                <MessageSquare className="w-10 h-10 mb-3" style={{ color: "var(--muted)" }} />
                <p className="text-sm text-[var(--muted)]">Select a lead on the left to view and log communications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
