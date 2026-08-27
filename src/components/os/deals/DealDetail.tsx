"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Deal, Company, Contact, User, Meeting, Task } from "@prisma/client";
import { Phone, MessageCircle, Trophy, XCircle, FileText, Building2, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { Badge, TemperatureBadge } from "@/components/os/ui/Badge";
import { Avatar } from "@/components/os/ui/Avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import { formatKES } from "@/lib/os/money";
import { friendlyDate, daysBetween } from "@/lib/os/dates";
import { PIPELINE_STAGES, STAGE_LABEL } from "@/lib/os/pipeline";
import { updateDealStageAction, updateDealAction } from "@/server/actions/deals";
import { LostDealDialog } from "./LostDealDialog";
import { parseJsonArray } from "@/server/json";

type DealFull = Deal & {
  company: Company;
  contact: Contact | null;
  owner: User | null;
  meetings: Meeting[];
  tasks: (Task & { assignee: User | null })[];
};

function waLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function DealDetail({ deal: initialDeal, users }: { deal: DealFull; users: User[] }) {
  const router = useRouter();
  const [deal, setDeal] = useState(initialDeal);
  const [lostOpen, setLostOpen] = useState(false);
  const [nextAction, setNextAction] = useState(deal.nextAction ?? "");
  const [nextActionDue, setNextActionDue] = useState(deal.nextActionDue ? new Date(deal.nextActionDue).toISOString().slice(0, 10) : "");
  const [savingAction, setSavingAction] = useState(false);
  const [savingOwner, setSavingOwner] = useState(false);
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
      if (stage === "WON") toast.success("Deal won! 🎉");
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
      toast.success("Follow-up saved");
    } catch {
      toast.error("Couldn't save follow-up");
    } finally {
      setSavingAction(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href={`/app/clients/${deal.companyId}`} className="text-xs font-medium flex items-center gap-1 mb-1.5" style={{ color: "var(--accent)" }}>
            <Building2 className="w-3 h-3" /> {deal.company.name}
          </Link>
          <h1 className="text-xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>{deal.title}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-lg font-bold" style={{ color: "var(--accent)" }}>{formatKES(deal.value)}</span>
            <TemperatureBadge temperature={deal.temperature} />
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="w-40">
            <Label>Owner</Label>
            <Select value={deal.ownerId ?? ""} onValueChange={changeOwner} disabled={savingOwner}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Label>Stage</Label>
            <Select value={deal.stage} onValueChange={moveStage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PIPELINE_STAGES.map(s => <SelectItem key={s} value={s}>{STAGE_LABEL[s]}</SelectItem>)}
                <SelectItem value="LOST">Mark Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mt-5">
        {deal.company.phone && (
          <>
            <Button variant="secondary" size="sm" onClick={() => window.open(`tel:${deal.company.phone}`)} className="gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Call
            </Button>
            <Button
              variant="secondary" size="sm"
              onClick={() => window.open(waLink(deal.company.phone!, `Hi, following up on ${deal.title} for ${deal.company.name}.`), "_blank")}
              className="gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </Button>
          </>
        )}
        <Button variant="secondary" size="sm" onClick={() => router.push(`/app/quotes?deal=${deal.id}`)} className="gap-1.5">
          <FileText className="w-3.5 h-3.5" /> Create Proforma
        </Button>
        {deal.stage !== "WON" && (
          <Button variant="secondary" size="sm" onClick={() => moveStage("WON")} className="gap-1.5" style={{ color: "var(--success)" }}>
            <Trophy className="w-3.5 h-3.5" /> Mark Won
          </Button>
        )}
        {deal.stage !== "LOST" && (
          <Button variant="ghost" size="sm" onClick={() => setLostOpen(true)} className="gap-1.5" style={{ color: "var(--danger)" }}>
            <XCircle className="w-3.5 h-3.5" /> Mark Lost
          </Button>
        )}
      </div>

      {products.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {products.map(p => <Badge key={p} tone="accent">{p}</Badge>)}
        </div>
      )}

      {/* Next action */}
      <div className="mt-6 rounded-[var(--radius-lg)] p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-3">Next Action</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input value={nextAction} onChange={e => setNextAction(e.target.value)} placeholder="Send proforma, confirm decision maker…" className="flex-1" />
          <Input type="date" value={nextActionDue} onChange={e => setNextActionDue(e.target.value)} className="sm:w-44" />
          <Button size="sm" loading={savingAction} onClick={saveNextAction} className="gap-1.5"><Check className="w-3.5 h-3.5" /> Save</Button>
        </div>
        <p className="text-xs text-[var(--text-faint)] mt-2.5">
          {daysBetween(deal.stageEnteredAt)} day{daysBetween(deal.stageEnteredAt) === 1 ? "" : "s"} in {STAGE_LABEL[deal.stage]}
          {deal.lastContactAt && ` · Last contact ${friendlyDate(deal.lastContactAt)}`}
        </p>
      </div>

      {/* Meetings + tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Meetings</p>
          <div className="space-y-2">
            {deal.meetings.length === 0 && <p className="text-xs text-[var(--text-faint)]">None yet.</p>}
            {deal.meetings.map(m => (
              <div key={m.id} className="flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                <span className="text-xs text-[var(--text)]">{friendlyDate(m.scheduledAt)}</span>
                <Badge tone={m.status === "DONE" ? "success" : "neutral"}>{m.status}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Open Tasks</p>
          <div className="space-y-2">
            {deal.tasks.length === 0 && <p className="text-xs text-[var(--text-faint)]">None yet.</p>}
            {deal.tasks.map(t => (
              <div key={t.id} className="flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                <span className="text-xs text-[var(--text)]">{t.title}</span>
                {t.assignee && <Avatar name={t.assignee.name} color={t.assignee.avatarColor} size={20} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <LostDealDialog
        dealId={deal.id}
        dealTitle={deal.title}
        open={lostOpen}
        onOpenChange={setLostOpen}
        onLost={() => router.push("/app/deals")}
      />
    </div>
  );
}
