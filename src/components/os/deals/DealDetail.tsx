"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Deal, Company, Contact, User, Meeting, Task, Project, SalesDocument, Communication } from "@prisma/client";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, Trophy, FileText, Building2, Check,
  FolderKanban, CalendarPlus, StickyNote, Send,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { Badge, TemperatureBadge } from "@/components/os/ui/Badge";
import { Avatar } from "@/components/os/ui/Avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import { formatKES } from "@/lib/os/money";
import { friendlyDate, friendlyDay, daysBetween, dayjs } from "@/lib/os/dates";
import { STAGE_LABEL } from "@/lib/os/pipeline";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/os/motion";
import { updateDealStageAction, updateDealAction } from "@/server/actions/deals";
import { logCommunicationAction } from "@/server/actions/communications";
import { LostDealDialog } from "./LostDealDialog";
import { StageTracker } from "./StageTracker";
import { ScheduleMeetingSheet } from "@/components/os/meetings/MeetingsView";
import { parseJsonArray } from "@/server/json";

type CommunicationWithAuthor = Communication & { author: User | null };
export type DealFull = Deal & {
  company: Company;
  contact: Contact | null;
  owner: User | null;
  meetings: Meeting[];
  tasks: (Task & { assignee: User | null })[];
  project: Project | null;
  documents: SalesDocument[];
  communications: CommunicationWithAuthor[];
};

function waLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function DealDetail({
  deal: initialDeal, users, onDealChange, onLost: onLostProp,
}: {
  deal: DealFull;
  users: User[];
  /** Fires whenever the local deal state changes — lets a drawer host (Pipeline) keep its own list in sync. */
  onDealChange?: (deal: DealFull) => void;
  /** Drawer context: called instead of navigating to /app/deals after marking lost. */
  onLost?: (reason: string) => void;
}) {
  const router = useRouter();
  const [deal, setDeal] = useState(initialDeal);
  const [lostOpen, setLostOpen] = useState(false);

  // Only re-fire when `deal` itself changes — including `onDealChange` here would
  // re-run on every parent re-render (it's typically an inline arrow function),
  // which risks a render loop if the parent updates its own state in response.
  useEffect(() => { onDealChange?.(deal); }, [deal]); // eslint-disable-line react-hooks/exhaustive-deps
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [nextAction, setNextAction] = useState(deal.nextAction ?? "");
  const [nextActionDue, setNextActionDue] = useState(deal.nextActionDue ? new Date(deal.nextActionDue).toISOString().slice(0, 10) : "");
  const [savingAction, setSavingAction] = useState(false);
  const [savingOwner, setSavingOwner] = useState(false);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const products = parseJsonArray<string>(deal.productKeys);

  async function changeOwner(ownerId: string) {
    setSavingOwner(true);
    try {
      await updateDealAction(deal.id, { ownerId });
      const owner = users.find(u => u.id === ownerId) ?? null;
      setDeal(d => ({ ...d, ownerId, owner }));
    } catch {
      toast.error("Couldn't reassign owner");
    } finally {
      setSavingOwner(false);
    }
  }

  async function moveStage(stage: string) {
    if (stage === "LOST") { setLostOpen(true); return; }
    const prev = deal.stage;
    setDeal(d => ({ ...d, stage, stageEnteredAt: new Date() }));
    try {
      await updateDealStageAction(deal.id, stage);
      if (stage === "WON") toast.success(`${formatKES(deal.value)} WON 🎉`);
      else toast.success(`Moved to ${STAGE_LABEL[stage]}`);
    } catch {
      toast.error("Couldn't move stage");
      setDeal(d => ({ ...d, stage: prev }));
    }
  }

  async function saveNextAction() {
    setSavingAction(true);
    try {
      await updateDealAction(deal.id, {
        nextAction: nextAction || null,
        nextActionDue: nextActionDue ? new Date(nextActionDue) : null,
        lastContactAt: new Date(),
      });
      setDeal(d => ({ ...d, nextAction, nextActionDue: nextActionDue ? new Date(nextActionDue) : null, lastContactAt: new Date() }));
      toast.success("Next action saved");
    } catch {
      toast.error("Couldn't save follow-up");
    } finally {
      setSavingAction(false);
    }
  }

  async function saveNote() {
    if (!note.trim()) return;
    setSavingNote(true);
    try {
      const comm = await logCommunicationAction({
        companyId: deal.companyId,
        dealId: deal.id,
        channel: "NOTE",
        direction: "OUTBOUND",
        body: note.trim(),
      });
      setDeal(d => ({ ...d, communications: [{ ...comm, author: null }, ...d.communications], lastContactAt: new Date() }));
      setNote("");
    } catch {
      toast.error("Couldn't save note");
    } finally {
      setSavingNote(false);
    }
  }

  function onMeetingScheduled(meeting: Meeting) {
    setDeal(d => ({ ...d, meetings: [meeting, ...d.meetings] }));
    setMeetingOpen(false);
    toast.success("Meeting scheduled");
  }

  const upcomingMeetings = deal.meetings.filter(m => m.status === "SCHEDULED");

  const quoted = deal.documents.reduce((s, d) => s + d.total, 0);
  const paid = deal.documents.reduce((s, d) => s + d.paidAmount, 0);
  const outstanding = deal.documents.reduce((s, d) => s + d.balance, 0);

  const timeline = [
    ...deal.communications.map(c => ({
      id: `comm-${c.id}`,
      at: c.createdAt,
      text: c.channel === "NOTE" ? c.body : `${c.channel === "WHATSAPP" ? "WhatsApp" : c.channel.charAt(0) + c.channel.slice(1).toLowerCase()} ${c.direction === "INBOUND" ? "message received" : "message sent"}${c.channel === "NOTE" ? "" : `: ${c.body}`}`,
      isNote: c.channel === "NOTE",
    })),
    ...deal.meetings.filter(m => m.status === "DONE").map(m => ({
      id: `mtg-${m.id}`,
      at: m.scheduledAt,
      text: "Meeting completed",
      isNote: false,
    })),
    { id: "created", at: deal.createdAt, text: "Deal created", isNote: false },
  ].sort((a, b) => dayjs(b.at).valueOf() - dayjs(a.at).valueOf());

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <motion.div {...fadeInUp}>
        <Link href={`/app/clients/${deal.companyId}`} className="text-xs font-medium flex items-center gap-1 mb-2" style={{ color: "var(--accent)" }}>
          <Building2 className="w-3 h-3" /> {deal.company.name}
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="os-heading-page" style={{ color: "var(--text)" }}>{deal.title}</h1>
            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              <span className="os-text-number text-2xl" style={{ color: "var(--accent)" }}>{formatKES(deal.value)}</span>
              <TemperatureBadge temperature={deal.temperature} />
            </div>
            {products.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {products.map(p => <Badge key={p} tone="accent">{p}</Badge>)}
              </div>
            )}
          </div>
          <div className="w-40">
            <Label>Owner</Label>
            <Select value={deal.ownerId ?? ""} onValueChange={changeOwner} disabled={savingOwner}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Next Best Action */}
      <motion.div
        {...fadeInUp}
        className="mt-6 rounded-[var(--radius-xl)] p-5"
        style={{ background: "var(--accent-soft)", border: "1px solid var(--border-strong)" }}
      >
        <p className="os-text-meta font-bold uppercase tracking-wider mb-3" style={{ color: "var(--accent)" }}>Next Best Action</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input value={nextAction} onChange={e => setNextAction(e.target.value)} placeholder="Send proforma, confirm decision maker…" className="flex-1" />
          <Input type="date" value={nextActionDue} onChange={e => setNextActionDue(e.target.value)} className="sm:w-44" />
          <Button size="sm" loading={savingAction} onClick={saveNextAction} className="gap-1.5"><Check className="w-3.5 h-3.5" /> Save</Button>
        </div>
        <p className="os-text-meta mt-2.5">
          {daysBetween(deal.stageEnteredAt)} day{daysBetween(deal.stageEnteredAt) === 1 ? "" : "s"} in {STAGE_LABEL[deal.stage]}
          {deal.lastContactAt && ` · Last contact ${friendlyDate(deal.lastContactAt)}`}
        </p>
      </motion.div>

      {/* Deal Journey */}
      <section className="mt-8">
        <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Deal Journey</h2>
        <StageTracker stage={deal.stage} onSelect={moveStage} />
        {deal.stage !== "LOST" && (
          <button onClick={() => setLostOpen(true)} className="mt-2 text-xs font-medium hover:underline" style={{ color: "var(--text-faint)" }}>
            Mark as lost instead
          </button>
        )}
      </section>

      {/* Quick Actions */}
      <section className="mt-8">
        <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {deal.company.phone && (
            <QuickActionTile icon={Phone} label="Call" onClick={() => window.open(`tel:${deal.company.phone}`)} />
          )}
          {deal.company.phone && (
            <QuickActionTile
              icon={MessageCircle}
              label="WhatsApp"
              onClick={() => window.open(waLink(deal.company.phone!, `Hi, following up on ${deal.title} for ${deal.company.name}.`), "_blank")}
            />
          )}
          <QuickActionTile icon={CalendarPlus} label="Meeting" onClick={() => setMeetingOpen(true)} />
          <QuickActionTile icon={FileText} label="Quotation" onClick={() => router.push(`/app/quotes/new?deal=${deal.id}`)} />
          {deal.project && (
            <QuickActionTile icon={FolderKanban} label="Project" onClick={() => router.push(`/app/projects/${deal.project!.id}`)} />
          )}
          {deal.stage !== "WON" && (
            <QuickActionTile icon={Trophy} label="Mark Won" tone="success" onClick={() => moveStage("WON")} />
          )}
        </div>
      </section>

      {/* Upcoming meetings */}
      {upcomingMeetings.length > 0 && (
        <section className="mt-8">
          <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Upcoming</h2>
          <div className="space-y-2">
            {upcomingMeetings.map(m => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)]" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="os-text-body flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <CalendarPlus className="w-4 h-4" style={{ color: "var(--accent)" }} /> {friendlyDate(m.scheduledAt)}
                </span>
                <Badge tone="accent">Scheduled</Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="mt-8">
        <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Timeline</h2>
        {timeline.length === 0 ? (
          <p className="os-text-meta">Nothing logged yet.</p>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-1">
            {groupByDay(timeline).map(group => (
              <div key={group.day} className="mb-4">
                <p className="os-text-meta font-bold uppercase tracking-wider mb-2">{group.day}</p>
                <div className="space-y-2.5">
                  {group.items.map(item => (
                    <motion.div key={item.id} variants={staggerItem} className="flex items-start gap-3">
                      <span className="os-text-meta shrink-0 w-16 pt-0.5">{dayjs(item.at).format("h:mm A")}</span>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: item.isNote ? "var(--accent)" : "var(--text-faint)" }} />
                      <span className="os-text-body flex-1" style={{ color: "var(--text)" }}>{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Commercial */}
      <section className="mt-8">
        <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Commercial</h2>
        <div className="rounded-[var(--radius-xl)] p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="grid grid-cols-3 gap-4">
            <CommercialStat label="Quoted" value={quoted} />
            <CommercialStat label="Paid" value={paid} tone="success" />
            <CommercialStat label="Outstanding" value={outstanding} tone={outstanding > 0 ? "warning" : undefined} />
          </div>
          {deal.documents.length === 0 && (
            <Button size="sm" variant="secondary" className="mt-4 gap-1.5" onClick={() => router.push(`/app/quotes/new?deal=${deal.id}`)}>
              <FileText className="w-3.5 h-3.5" /> Create quotation
            </Button>
          )}
        </div>
      </section>

      {/* Notes */}
      <section className="mt-8 mb-4">
        <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Notes</h2>
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 shrink-0" style={{ color: "var(--text-faint)" }} />
          <Input
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && note.trim()) saveNote(); }}
            placeholder="Quick note — press Enter to save"
            disabled={savingNote}
            className="flex-1"
          />
          {note.trim() && (
            <Button size="icon" variant="secondary" loading={savingNote} onClick={saveNote} aria-label="Save note">
              <Send className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </section>

      {/* Open tasks */}
      {deal.tasks.length > 0 && (
        <section className="mb-4">
          <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Open Tasks</h2>
          <div className="space-y-2">
            {deal.tasks.map(t => (
              <div key={t.id} className="flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                <span className="os-text-body" style={{ color: "var(--text)" }}>{t.title}</span>
                {t.assignee && <Avatar name={t.assignee.name} color={t.assignee.avatarColor} size={20} />}
              </div>
            ))}
          </div>
        </section>
      )}

      <LostDealDialog
        dealId={deal.id}
        dealTitle={deal.title}
        open={lostOpen}
        onOpenChange={setLostOpen}
        onLost={(_dealId, reason) => (onLostProp ? onLostProp(reason) : router.push("/app/deals"))}
      />
      <ScheduleMeetingSheet
        open={meetingOpen}
        onOpenChange={setMeetingOpen}
        onScheduled={onMeetingScheduled}
        lockedCompany={deal.company}
      />
    </div>
  );
}

function groupByDay(items: { id: string; at: Date | string; text: string; isNote: boolean }[]) {
  const groups: { day: string; items: typeof items }[] = [];
  for (const item of items) {
    const day = friendlyDay(item.at);
    const existing = groups.find(g => g.day === day);
    if (existing) existing.items.push(item);
    else groups.push({ day, items: [item] });
  }
  return groups;
}

function QuickActionTile({
  icon: Icon, label, onClick, tone,
}: { icon: typeof Phone; label: string; onClick: () => void; tone?: "success" }) {
  const color = tone === "success" ? "var(--success)" : "var(--accent)";
  return (
    <button
      onClick={onClick}
      className="os-card-hover os-press flex flex-col items-center justify-center gap-2 py-5 rounded-[var(--radius-lg)] text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: tone === "success" ? "var(--success-soft)" : "var(--accent-soft)" }}>
        <Icon className="w-[18px] h-[18px]" style={{ color }} />
      </div>
      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{label}</span>
    </button>
  );
}

function CommercialStat({ label, value, tone }: { label: string; value: number; tone?: "success" | "warning" }) {
  const color = tone === "success" ? "var(--success)" : tone === "warning" ? "var(--warning)" : "var(--text)";
  return (
    <div>
      <p className="os-text-meta mb-1">{label}</p>
      <p className="os-text-number text-lg" style={{ color }}>{formatKES(value, { compact: true })}</p>
    </div>
  );
}
