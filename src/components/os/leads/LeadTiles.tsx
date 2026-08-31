"use client";

/**
 * Tap-tile building blocks for the lead management system. Every tile here
 * persists immediately to real Lead columns via the server actions in
 * src/server/actions/leads.ts — nothing here is local-only state pretending
 * to be saved. See src/lib/os/leadStage.ts for the shared vocabulary.
 */

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@prisma/client";
import { Check } from "lucide-react";
import {
  LEAD_STAGES, STAGE_META, type LeadStage,
  TEMPERATURES, TEMPERATURE_META, type Temperature,
  LOST_REASONS, LOST_REASON_LABEL, type LostReason,
  ATTENTION_META, getAttentionLevel,
} from "@/lib/os/leadStage";
import type { NextActionType } from "@/lib/os/nextAction";
import { Badge } from "@/components/os/ui/Badge";
import { Button } from "@/components/os/ui/Button";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { NextActionEditor } from "@/components/os/common/NextActionEditor";
import { formatKES } from "@/lib/os/money";
import {
  updateLeadStageAction, updateLeadTemperatureAction, updateLeadNextActionAction,
  markLeadWonAction, markLeadLostAction,
} from "@/server/actions/leads";

export function AttentionBadge({ lead }: { lead: { status: string; nextActionType: string | null; nextActionDue: Date | string | null } }) {
  const level = getAttentionLevel({
    status: lead.status,
    nextActionType: lead.nextActionType,
    nextActionDue: lead.nextActionDue ? new Date(lead.nextActionDue) : null,
  });
  if (level === "NONE") return null;
  const meta = ATTENTION_META[level];
  const tone = meta.tone === "danger" ? "danger" : meta.tone === "warning" ? "warning" : meta.tone === "info" ? "info" : meta.tone === "success" ? "success" : "neutral";
  return <Badge tone={tone}>{meta.icon} {meta.label}</Badge>;
}

function TileGrid({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Tile({ active, onClick, disabled, children }: { active: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="os-card-hover os-press flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors disabled:opacity-50"
      style={{
        background: active ? "var(--accent-soft)" : "var(--surface-hover)",
        color: active ? "var(--accent)" : "var(--text)",
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
      }}
    >
      {children}
    </button>
  );
}

export function StageTiles({ leadId, status, onUpdated, disabled }: {
  leadId: string;
  status: string;
  onUpdated: (patch: { status: string }) => void;
  disabled?: boolean;
}) {
  const [saving, setSaving] = useState<LeadStage | null>(null);
  const isPastStatus = !LEAD_STAGES.includes(status as LeadStage);

  async function pick(stage: LeadStage) {
    if (stage === status || saving) return;
    setSaving(stage);
    onUpdated({ status: stage });
    try {
      await updateLeadStageAction(leadId, stage);
    } catch (e) {
      onUpdated({ status });
      toast.error(e instanceof Error ? e.message : "Couldn't update stage");
    } finally {
      setSaving(null);
    }
  }

  return (
    <TileGrid>
      {LEAD_STAGES.map(stage => (
        <Tile key={stage} active={status === stage} disabled={disabled || saving !== null} onClick={() => pick(stage)}>
          {status === stage && <Check className="w-3.5 h-3.5" />}
          {STAGE_META[stage].label}
        </Tile>
      ))}
      {isPastStatus && (
        <span className="os-text-meta self-center">Currently {status === "CONVERTED" ? "Won" : status === "LOST" ? "Lost" : status}</span>
      )}
    </TileGrid>
  );
}

export function TemperatureTiles({ leadId, temperature, onUpdated, disabled }: {
  leadId: string;
  temperature: string;
  onUpdated: (patch: { temperature: string }) => void;
  disabled?: boolean;
}) {
  const [saving, setSaving] = useState<Temperature | null>(null);

  async function pick(t: Temperature) {
    if (t === temperature || saving) return;
    setSaving(t);
    onUpdated({ temperature: t });
    try {
      await updateLeadTemperatureAction(leadId, t);
    } catch (e) {
      onUpdated({ temperature });
      toast.error(e instanceof Error ? e.message : "Couldn't update temperature");
    } finally {
      setSaving(null);
    }
  }

  return (
    <TileGrid>
      {TEMPERATURES.map(t => (
        <Tile key={t} active={temperature === t} disabled={disabled || saving !== null} onClick={() => pick(t)}>
          <span>{TEMPERATURE_META[t].icon}</span> {TEMPERATURE_META[t].label}
        </Tile>
      ))}
    </TileGrid>
  );
}

export function NextActionPanel({ leadId, nextActionType, nextActionDue, nextAction, onUpdated }: {
  leadId: string;
  nextActionType: string | null;
  nextActionDue: Date | string | null;
  nextAction: string | null;
  onUpdated: (patch: { nextActionType: string | null; nextActionDue: Date | null; nextAction: string | null }) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function save({ type, due, note }: { type: NextActionType; due: Date | null; note: string }) {
    setSaving(true);
    try {
      await updateLeadNextActionAction(leadId, { type, due, note });
      onUpdated({ nextActionType: type, nextActionDue: due, nextAction: note.trim() || null });
      toast.success("Next action updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update next action");
    } finally {
      setSaving(false);
    }
  }

  return (
    <NextActionEditor type={nextActionType} due={nextActionDue} note={nextAction} onSave={save} saving={saving} />
  );
}

export function WonPanel({ leadId, defaultValue, products, onWon }: {
  leadId: string;
  defaultValue: number;
  products: Product[];
  onWon: (dealId: string) => void;
}) {
  const [value, setValue] = useState(defaultValue > 0 ? String(defaultValue) : "");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggle(key: string) {
    setSelected(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
  }

  async function confirm() {
    const numValue = Number(value.replace(/[^\d.]/g, ""));
    if (!numValue || numValue <= 0) { toast.error("Enter the deal value"); return; }
    if (selected.length === 0) { toast.error("Select at least one product"); return; }
    setSaving(true);
    try {
      const { deal } = await markLeadWonAction(leadId, { value: numValue, productKeys: selected });
      toast.success("Marked Won 🎉");
      onWon(deal.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't mark this lead Won");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Deal value (KES)</Label>
        <Input
          value={value}
          onChange={e => setValue(e.target.value.replace(/[^\d]/g, ""))}
          inputMode="numeric"
          placeholder="150000"
          className="mt-1.5"
          autoFocus
        />
      </div>
      <div>
        <Label>Products</Label>
        <TileGrid>
          {products.map(p => (
            <Tile key={p.key} active={selected.includes(p.key)} onClick={() => toggle(p.key)}>
              {selected.includes(p.key) && <Check className="w-3.5 h-3.5" />} {p.name}
            </Tile>
          ))}
        </TileGrid>
      </div>
      <Button className="w-full" loading={saving} onClick={confirm}>
        Confirm Won — {value ? formatKES(Number(value) || 0) : "…"}
      </Button>
    </div>
  );
}

export function LostPanel({ leadId, onLost }: { leadId: string; onLost: () => void }) {
  const [reason, setReason] = useState<LostReason | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function confirm() {
    if (!reason) { toast.error("Pick a reason"); return; }
    setSaving(true);
    try {
      await markLeadLostAction(leadId, { reason, note });
      toast.success("Marked Lost");
      onLost();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't mark this lead Lost");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Reason</Label>
        <TileGrid>
          {LOST_REASONS.map(r => (
            <Tile key={r} active={reason === r} onClick={() => setReason(r)}>{LOST_REASON_LABEL[r]}</Tile>
          ))}
        </TileGrid>
      </div>
      <div>
        <Label>Note (optional)</Label>
        <Textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Any useful context for next time…" className="mt-1.5" />
      </div>
      <Button variant="danger" className="w-full" loading={saving} disabled={!reason} onClick={confirm}>Confirm Lost</Button>
    </div>
  );
}
