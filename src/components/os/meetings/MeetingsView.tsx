"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Meeting, Company, Contact, Deal, Product } from "@prisma/client";
import { Plus, Calendar, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { Badge, TemperatureBadge } from "@/components/os/ui/Badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { CompanyPicker } from "@/components/os/common/CompanyPicker";
import { QuickClientDialog } from "@/components/os/common/QuickClientDialog";
import { formatKES } from "@/lib/os/money";
import { friendlyDate, dayjs, isOverdue } from "@/lib/os/dates";
import { scheduleMeetingAction, completeMeetingAction } from "@/server/actions/meetings";
import { dealsForCompanyAction } from "@/server/actions/deals";

type MeetingWithRelations = Meeting & { company: Company; contact: Contact | null; deal: Deal | null };

const BUDGET_OPTIONS = ["< 50K", "50K–150K", "150K–300K", "300K+", "Unknown"];
const DECISION_OPTIONS = ["Yes", "No", "Unsure"];

export function MeetingsView({
  initialMeetings, products, openCreateOnLoad,
}: {
  initialMeetings: MeetingWithRelations[];
  products: Product[];
  openCreateOnLoad: boolean;
}) {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [scheduleOpen, setScheduleOpen] = useState(openCreateOnLoad);
  const [completing, setCompleting] = useState<MeetingWithRelations | null>(null);

  const now = dayjs();
  const needsCompletion = meetings.filter(m => m.status === "SCHEDULED" && dayjs(m.scheduledAt).isBefore(now));
  const upcoming = meetings.filter(m => m.status === "SCHEDULED" && !dayjs(m.scheduledAt).isBefore(now));
  const done = meetings.filter(m => m.status === "DONE").slice(0, 10);

  function onScheduled(meeting: MeetingWithRelations) {
    setMeetings(prev => [...prev, meeting]);
    setScheduleOpen(false);
  }

  function onCompleted(id: string, temperature: string) {
    setMeetings(prev => prev.map(m => (m.id === id ? { ...m, status: "DONE", temperature } : m)));
    setCompleting(null);
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Meetings"
        subtitle={`${upcoming.length} upcoming${needsCompletion.length ? ` · ${needsCompletion.length} need a recap` : ""}`}
        actions={
          <Button size="sm" onClick={() => setScheduleOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Schedule Meeting
          </Button>
        }
      />

      {needsCompletion.length > 0 && (
        <Section title="Needs a recap" tone="danger">
          <MeetingList>
            {needsCompletion.map(m => (
              <MeetingCard key={m.id} meeting={m} onComplete={() => setCompleting(m)} />
            ))}
          </MeetingList>
        </Section>
      )}

      <Section title="Upcoming">
        {upcoming.length === 0 ? (
          <EmptyRow text="Nothing scheduled — meetings you book will appear here." />
        ) : (
          <MeetingList>
            {upcoming.map(m => <MeetingCard key={m.id} meeting={m} onComplete={() => setCompleting(m)} />)}
          </MeetingList>
        )}
      </Section>

      {done.length > 0 && (
        <Section title="Recently completed">
          <MeetingList>
            {done.map(m => <MeetingCard key={m.id} meeting={m} completed />)}
          </MeetingList>
        </Section>
      )}

      <ScheduleMeetingSheet open={scheduleOpen} onOpenChange={setScheduleOpen} onScheduled={onScheduled} />
      {completing && (
        <CompleteMeetingSheet
          meeting={completing}
          products={products}
          open={!!completing}
          onOpenChange={(v) => !v && setCompleting(null)}
          onCompleted={onCompleted}
        />
      )}
    </div>
  );
}

function Section({ title, tone, children }: { title: string; tone?: "danger"; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <p className="os-text-meta font-semibold uppercase tracking-wider mb-2.5" style={{ color: tone === "danger" ? "var(--danger)" : undefined }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function MeetingList({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
      {children}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="text-center py-10 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
      <Calendar className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--text-faint)" }} />
      <p className="text-xs text-[var(--text-faint)]">{text}</p>
    </div>
  );
}

function MeetingCard({ meeting, onComplete, completed }: { meeting: MeetingWithRelations; onComplete?: () => void; completed?: boolean }) {
  const overdue = meeting.status === "SCHEDULED" && isOverdue(meeting.scheduledAt);
  return (
    <div className="os-row-hover px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-[var(--text)]">{meeting.company.name}</span>
          {meeting.contact && <span className="text-xs text-[var(--text-faint)]">· {meeting.contact.name}</span>}
          {completed && meeting.temperature && <TemperatureBadge temperature={meeting.temperature} />}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap text-xs" style={{ color: overdue ? "var(--danger)" : "var(--text-faint)" }}>
          <span>{friendlyDate(meeting.scheduledAt)}</span>
          {meeting.deal && (
            <>
              <span>·</span>
              <Link href={`/app/deals/${meeting.deal.id}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                {meeting.deal.title} ({formatKES(meeting.deal.value, { compact: true })})
              </Link>
            </>
          )}
          {overdue && <Badge tone="danger">Recap needed</Badge>}
        </div>
      </div>
      {!completed && onComplete && (
        <Button size="sm" variant="secondary" onClick={onComplete} className="gap-1.5 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" /> Complete
        </Button>
      )}
      {!completed && !onComplete && <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--text-faint)" }} />}
    </div>
  );
}

export function ScheduleMeetingSheet({
  open, onOpenChange, onScheduled, lockedCompany,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onScheduled: (meeting: MeetingWithRelations) => void;
  lockedCompany?: Company;
}) {
  const [company, setCompany] = useState<Company | null>(lockedCompany ?? null);
  const [quickClientOpen, setQuickClientOpen] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealId, setDealId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [agenda, setAgenda] = useState("");
  const [saving, setSaving] = useState(false);

  async function pickCompany(c: Company) {
    setCompany(c);
    setDealId(null);
    const list = await dealsForCompanyAction(c.id);
    setDeals(list);
  }

  useEffect(() => {
    if (open && lockedCompany) pickCompany(lockedCompany);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lockedCompany?.id]);

  async function submit() {
    if (!company) { toast.error("Select a client first"); return; }
    if (!date) { toast.error("Pick a date"); return; }
    setSaving(true);
    try {
      const scheduledAt = new Date(`${date}T${time || "10:00"}:00`);
      const meeting = await scheduleMeetingAction({ companyId: company.id, dealId: dealId ?? undefined, scheduledAt, agenda: agenda || undefined });
      const deal = deals.find(d => d.id === dealId) ?? null;
      onScheduled({ ...meeting, company, contact: null, deal } as MeetingWithRelations);
      toast.success("Meeting scheduled");
      setCompany(lockedCompany ?? null); setDealId(null); setDate(""); setTime("10:00"); setAgenda("");
      setDeals(lockedCompany ? await dealsForCompanyAction(lockedCompany.id) : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't schedule meeting");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right">
          <SheetHeader><SheetTitle>Schedule Meeting</SheetTitle></SheetHeader>
          <SheetBody className="space-y-4">
            {lockedCompany ? (
              <div>
                <Label>Client</Label>
                <div className="h-10 flex items-center px-3.5 rounded-[var(--radius-md)] text-sm font-medium" style={{ background: "var(--surface-hover)", color: "var(--text)" }}>
                  {lockedCompany.name}
                </div>
              </div>
            ) : (
              <div>
                <Label>Client</Label>
                <CompanyPicker value={company} onChange={pickCompany} onCreateNew={() => setQuickClientOpen(true)} />
              </div>
            )}
            {deals.length > 0 && (
              <div>
                <Label>Linked opportunity (optional)</Label>
                <div className="flex flex-wrap gap-1.5">
                  {deals.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setDealId(prev => (prev === d.id ? null : d.id))}
                      className="px-2.5 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: dealId === d.id ? "var(--accent-soft)" : "var(--surface-hover)", color: dealId === d.id ? "var(--accent)" : "var(--text-muted)" }}
                    >
                      {d.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="mtg-date">Date</Label>
                <Input id="mtg-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="mtg-time">Time</Label>
                <Input id="mtg-time" type="time" value={time} onChange={e => setTime(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="mtg-agenda">Agenda (optional)</Label>
              <Textarea id="mtg-agenda" value={agenda} onChange={e => setAgenda(e.target.value)} rows={2} placeholder="Outstanding questions to cover…" />
            </div>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button loading={saving} onClick={submit}>Schedule</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <QuickClientDialog open={quickClientOpen} onOpenChange={setQuickClientOpen} onCreated={pickCompany} />
    </>
  );
}

function CompleteMeetingSheet({
  meeting, products, open, onOpenChange, onCompleted,
}: {
  meeting: MeetingWithRelations;
  products: Product[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCompleted: (id: string, temperature: string) => void;
}) {
  const [temperature, setTemperature] = useState("WARM");
  const [budget, setBudget] = useState<string | null>(null);
  const [decisionMaker, setDecisionMaker] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [objection, setObjection] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [nextAction, setNextAction] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleProduct(name: string) {
    setSelectedProducts(prev => (prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]));
  }

  async function submit() {
    setSaving(true);
    try {
      await completeMeetingAction(meeting.id, {
        temperature, budget: budget || undefined, decisionMaker: decisionMaker || undefined,
        problem: problem || undefined, objection: objection || undefined,
        productsDiscussed: selectedProducts, nextAction: nextAction || undefined,
        nextActionDue: dueDate ? new Date(dueDate) : null,
      });
      onCompleted(meeting.id, temperature);
      toast.success("Recap saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save recap");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{meeting.company.name}</SheetTitle>
        </SheetHeader>
        <SheetBody className="space-y-4">
          <div>
            <Label>Temperature</Label>
            <div className="flex gap-1.5">
              {["HOT", "WARM", "COLD"].map(t => (
                <button key={t} onClick={() => setTemperature(t)} className="flex-1 px-3 py-2 rounded-[var(--radius-md)] text-sm font-semibold"
                  style={{ background: temperature === t ? "var(--accent-soft)" : "var(--surface-hover)", color: temperature === t ? "var(--accent)" : "var(--text-muted)" }}>
                  {t === "HOT" ? "🔥 Hot" : t === "WARM" ? "🟡 Warm" : "⚪ Cold"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Budget</Label>
            <div className="flex flex-wrap gap-1.5">
              {BUDGET_OPTIONS.map(b => (
                <button key={b} onClick={() => setBudget(b)} className="px-2.5 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: budget === b ? "var(--accent-soft)" : "var(--surface-hover)", color: budget === b ? "var(--accent)" : "var(--text-muted)" }}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Decision maker in the room?</Label>
            <div className="flex gap-1.5">
              {DECISION_OPTIONS.map(d => (
                <button key={d} onClick={() => setDecisionMaker(d)} className="flex-1 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium"
                  style={{ background: decisionMaker === d ? "var(--accent-soft)" : "var(--surface-hover)", color: decisionMaker === d ? "var(--accent)" : "var(--text-muted)" }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="mtg-problem">Problem they need solved</Label>
            <Input id="mtg-problem" value={problem} onChange={e => setProblem(e.target.value)} placeholder="Losing leads that come via WhatsApp" />
          </div>
          <div>
            <Label htmlFor="mtg-objection">Objection raised</Label>
            <Input id="mtg-objection" value={objection} onChange={e => setObjection(e.target.value)} placeholder="Price, timing, needs partner buy-in…" />
          </div>
          <div>
            <Label>Products discussed</Label>
            <div className="flex flex-wrap gap-1.5">
              {products.map(p => (
                <button key={p.key} onClick={() => toggleProduct(p.name)} className="px-2.5 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: selectedProducts.includes(p.name) ? "var(--accent-soft)" : "var(--surface-hover)", color: selectedProducts.includes(p.name) ? "var(--accent)" : "var(--text-muted)" }}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="mtg-next">Next action</Label>
              <Input id="mtg-next" value={nextAction} onChange={e => setNextAction(e.target.value)} placeholder="Send proforma" />
            </div>
            <div>
              <Label htmlFor="mtg-due">Due</Label>
              <Input id="mtg-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button loading={saving} onClick={submit}>Save Recap</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
