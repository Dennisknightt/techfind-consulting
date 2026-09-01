"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Company, Communication, User, Contact, Deal } from "@prisma/client";
import { Search, ArrowLeft, Info, Send, Phone, MessageCircle, CalendarDays, CheckSquare, FileText, Trophy, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { toast } from "sonner";
import { CompanyAvatar } from "@/components/os/ui/Avatar";
import { Button } from "@/components/os/ui/Button";
import { Input } from "@/components/os/ui/Input";
import { TemperatureBadge, Badge } from "@/components/os/ui/Badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/os/ui/Sheet";
import { formatKES } from "@/lib/os/money";
import { timeAgo, friendlyDate } from "@/lib/os/dates";
import { STAGE_LABEL } from "@/lib/os/pipeline";
import { CHANNELS, CHANNEL_META, type Channel } from "./channels";
import { logCommunicationAction, getThreadAction, getConversationContextAction } from "@/server/actions/communications";
import { updateDealStageAction } from "@/server/actions/deals";
import { createTaskAction } from "@/server/actions/tasks";
import { ScheduleMeetingSheet } from "@/components/os/meetings/MeetingsView";

type CompanyRow = Company & { communications: Communication[]; _count: { communications: number } };
type ThreadItem = Communication & { author: User | null };
type Context = { company: Company; primaryContact: Contact | null; deal: Deal | null };

function waLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;
}

export function CommunicationsHub({
  companies, currentUserId, initialCompanyId, canLog,
}: {
  companies: CompanyRow[];
  currentUserId: string;
  initialCompanyId?: string;
  canLog: boolean;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | undefined>(initialCompanyId);
  const [query, setQuery] = useState("");
  const [thread, setThread] = useState<ThreadItem[] | null>(null);
  const [context, setContext] = useState<Context | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return companies;
    const q = query.toLowerCase();
    return companies.filter(c => c.name.toLowerCase().includes(q) || (c.phone ?? "").includes(q));
  }, [companies, query]);

  const load = useCallback(async (companyId: string) => {
    setThread(null);
    setContext(null);
    const [t, c] = await Promise.all([getThreadAction(companyId), getConversationContextAction(companyId)]);
    setThread(t);
    setContext(c);
  }, []);

  useEffect(() => {
    if (selectedId) load(selectedId);
  }, [selectedId, load]);

  function select(id: string) {
    setSelectedId(id);
    router.push(`/app/communications?company=${id}`, { scroll: false });
  }

  function back() {
    setSelectedId(undefined);
    router.push("/app/communications", { scroll: false });
  }

  const selectedCompany = companies.find(c => c.id === selectedId);

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* LEFT — conversations */}
      <div
        className={`w-full lg:w-80 shrink-0 border-r flex-col ${selectedId ? "hidden lg:flex" : "flex"}`}
        style={{ borderColor: "var(--border)" }}
      >
        <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search conversations…" className="pl-8" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-xs text-[var(--text-faint)] text-center py-10 px-4">No clients yet — they&rsquo;ll show up here once captured.</p>
          )}
          {filtered.map(c => {
            const last = c.communications[0];
            const Icon = last ? CHANNEL_META[last.channel as Channel]?.icon : undefined;
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => select(c.id)}
                className="w-full text-left px-4 py-3 border-b flex items-start gap-3 transition-colors"
                style={{ borderColor: "var(--border)", background: active ? "var(--accent-soft)" : "transparent" }}
              >
                <CompanyAvatar name={c.name} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[var(--text)] truncate">{c.name}</span>
                    {last && <span className="text-[10px] text-[var(--text-faint)] shrink-0">{timeAgo(last.createdAt)}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-[var(--text-faint)]">
                    {Icon && <Icon className="w-3 h-3 shrink-0" />}
                    <span className="truncate">{last ? (last.subject || last.body) : "No conversation yet"}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTRE — thread */}
      <div className={`flex-1 min-w-0 flex-col ${selectedId ? "flex" : "hidden lg:flex"}`}>
        {!selectedId || !selectedCompany ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <MessageCircle className="w-8 h-8 mb-3" style={{ color: "var(--text-faint)" }} />
            <p className="text-sm text-[var(--text-faint)]">Select a conversation to see the full thread</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 h-14 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
              <button onClick={back} aria-label="Back to conversations" className="lg:hidden shrink-0"><ArrowLeft className="w-4.5 h-4.5" style={{ color: "var(--text-muted)" }} /></button>
              <CompanyAvatar name={selectedCompany.name} size={32} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{selectedCompany.name}</p>
              </div>
              <button onClick={() => setDrawerOpen(true)} aria-label="Client details" className="lg:hidden shrink-0">
                <Info className="w-4.5 h-4.5" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {thread === null && <p className="text-xs text-[var(--text-faint)] text-center py-10">Loading…</p>}
              {thread?.length === 0 && <p className="text-xs text-[var(--text-faint)] text-center py-10">No messages yet — log the first touch below.</p>}
              {thread?.map(item => {
                const meta = CHANNEL_META[item.channel as Channel];
                const Icon = meta.icon;
                const out = item.direction === "OUTBOUND";
                return (
                  <div key={item.id} className={`flex ${out ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[75%] rounded-[var(--radius-lg)] px-4 py-2.5" style={{ background: out ? "var(--accent-soft)" : "var(--surface-hover)" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3 h-3" style={{ color: meta.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
                        {out ? <ArrowUpRight className="w-2.5 h-2.5 text-[var(--text-faint)]" /> : <ArrowDownLeft className="w-2.5 h-2.5 text-[var(--text-faint)]" />}
                        <span className="text-[10px] text-[var(--text-faint)] ml-auto">{timeAgo(item.createdAt)}</span>
                      </div>
                      {item.subject && <p className="text-xs font-semibold text-[var(--text)] mb-0.5">{item.subject}</p>}
                      <p className="text-sm text-[var(--text)] whitespace-pre-wrap leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Composer company={selectedCompany} dealId={context?.deal?.id} canLog={canLog} onSent={(c) => setThread(prev => [...(prev ?? []), c])} />
          </>
        )}
      </div>

      {/* RIGHT — context (desktop) */}
      {selectedId && (
        <div className="hidden lg:flex w-80 shrink-0 border-l flex-col overflow-y-auto" style={{ borderColor: "var(--border)" }}>
          <ContextPanel context={context} currentUserId={currentUserId} />
        </div>
      )}

      {/* Mobile context drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetTitle className="sr-only">{selectedCompany?.name ?? "Conversation"} details</SheetTitle>
          <ContextPanel context={context} currentUserId={currentUserId} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Composer({ company, dealId, canLog, onSent }: { company: Company; dealId?: string; canLog: boolean; onSent: (c: ThreadItem) => void }) {
  const [channel, setChannel] = useState<Channel>("WHATSAPP");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  if (!canLog) {
    return (
      <div className="border-t p-3 shrink-0 safe-bottom text-center" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs text-[var(--text-faint)]">Your role can view this thread but can&rsquo;t log new messages.</p>
      </div>
    );
  }

  async function send() {
    if (!text.trim()) return;
    setSending(true);
    try {
      const comm = await logCommunicationAction({ companyId: company.id, dealId, channel, direction: "OUTBOUND", body: text.trim() });
      if (channel === "WHATSAPP" && company.phone) {
        window.open(waLink(company.phone, text.trim()), "_blank");
      } else if (channel === "EMAIL" && company.email) {
        window.open(`mailto:${company.email}?body=${encodeURIComponent(text.trim())}`, "_blank");
      }
      onSent({ ...comm, author: null } as ThreadItem);
      setText("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-t p-3 shrink-0 safe-bottom" style={{ borderColor: "var(--border)" }}>
      <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
        {CHANNELS.map(ch => {
          const meta = CHANNEL_META[ch];
          const Icon = meta.icon;
          return (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0"
              style={{ background: channel === ch ? "var(--accent-soft)" : "var(--surface-hover)", color: channel === ch ? "var(--accent)" : "var(--text-muted)" }}
            >
              <Icon className="w-3 h-3" /> {meta.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={`Log a ${CHANNEL_META[channel].label.toLowerCase()} message…`}
          rows={2}
          className="flex-1 px-3.5 py-2.5 rounded-[var(--radius-md)] text-sm outline-none resize-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)" }}
        />
        <Button size="icon" aria-label="Send" onClick={send} loading={sending} disabled={!text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ContextPanel({ context, currentUserId }: { context: Context | null; currentUserId: string }) {
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [markingWon, setMarkingWon] = useState(false);

  if (!context) {
    return <div className="p-5"><p className="text-xs text-[var(--text-faint)]">Loading…</p></div>;
  }

  const { company, primaryContact, deal } = context;

  async function markWon() {
    if (!deal) return;
    setMarkingWon(true);
    try {
      await updateDealStageAction(deal.id, "WON");
      toast.success("Deal won! 🎉");
    } catch {
      toast.error("Couldn't update deal");
    } finally {
      setMarkingWon(false);
    }
  }

  async function quickTask() {
    if (!deal) return;
    try {
      await createTaskAction({ title: `Follow up with ${company.name}`, dealId: deal.id, assigneeId: currentUserId });
      toast.success("Task added");
    } catch {
      toast.error("Couldn't add task");
    }
  }

  return (
    <div className="p-5 space-y-5">
      <div>
        {primaryContact && <p className="text-sm font-bold text-[var(--text)]">{primaryContact.name}</p>}
        <Link href={`/app/clients/${company.id}`} className="text-xs hover:underline" style={{ color: "var(--accent)" }}>{company.name}</Link>
      </div>

      {deal ? (
        <div className="rounded-[var(--radius-lg)] p-4 space-y-2" style={{ background: "var(--surface-hover)" }}>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">Opportunity</p>
          <Link href={`/app/deals/${deal.id}`} className="text-sm font-semibold text-[var(--text)] hover:underline block">{deal.title}</Link>
          <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>{formatKES(deal.value)}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone="accent">{STAGE_LABEL[deal.stage] ?? deal.stage}</Badge>
            <TemperatureBadge temperature={deal.temperature} />
          </div>
          {deal.nextAction && <p className="text-xs text-[var(--text-muted)]">Next: {deal.nextAction}</p>}
          {deal.lastContactAt && <p className="text-[11px] text-[var(--text-faint)]">Last interaction {friendlyDate(deal.lastContactAt)}</p>}
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] p-4 text-center" style={{ background: "var(--surface-hover)" }}>
          <p className="text-xs text-[var(--text-faint)] mb-2.5">No open opportunity yet</p>
          <Button size="sm" variant="secondary" asChild className="w-full">
            <Link href={`/app/clients/${company.id}`}>Start Opportunity</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {company.phone && (
          <Button size="sm" variant="secondary" onClick={() => window.open(`tel:${company.phone}`)} className="gap-1.5"><Phone className="w-3.5 h-3.5" /> Call</Button>
        )}
        <Button size="sm" variant="secondary" onClick={() => setMeetingOpen(true)} className="gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Meeting</Button>
        <Button size="sm" variant="secondary" onClick={quickTask} disabled={!deal} className="gap-1.5"><CheckSquare className="w-3.5 h-3.5" /> Task</Button>
        <Button size="sm" variant="secondary" asChild className="gap-1.5">
          <Link href={deal ? `/app/quotes/new?deal=${deal.id}` : "/app/quotes/new"}><FileText className="w-3.5 h-3.5" /> Proforma</Link>
        </Button>
      </div>

      {deal && (
        <Button size="sm" onClick={markWon} loading={markingWon} className="w-full gap-1.5" style={{ background: "var(--success)" }}>
          <Trophy className="w-3.5 h-3.5" /> Mark Won
        </Button>
      )}

      <ScheduleMeetingSheet open={meetingOpen} onOpenChange={setMeetingOpen} lockedCompany={company} onScheduled={() => { setMeetingOpen(false); toast.success("Meeting scheduled"); }} />
    </div>
  );
}
