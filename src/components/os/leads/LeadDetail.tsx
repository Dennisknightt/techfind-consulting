"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lead, User, Product } from "@prisma/client";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Trophy, XCircle, RotateCcw, ArrowRight, Building2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { Badge } from "@/components/os/ui/Badge";
import { Avatar } from "@/components/os/ui/Avatar";
import { formatKES } from "@/lib/os/money";
import { friendlyDate } from "@/lib/os/dates";
import { fadeInUp } from "@/lib/os/motion";
import { StageTiles, TemperatureTiles, NextActionPanel, AttentionBadge } from "./LeadTiles";
import { QuickActionTile } from "@/components/os/common/QuickActionTile";
import { WonSheet, LostSheet } from "./WonLostSheets";
import { isLeadOpen, isLeadWon, isLeadLost, stageLabel, LOST_REASON_LABEL, legacyLostReason, type LostReason } from "@/lib/os/leadStage";
import { reopenLeadAction, deleteLeadAction } from "@/server/actions/leads";

export type LeadWithOwner = Lead & { owner: User | null };

function waLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function LeadDetail({ lead: initialLead, users, products }: {
  lead: LeadWithOwner;
  users: User[];
  products: Product[];
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [wonOpen, setWonOpen] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function patch(p: Partial<Lead>) {
    setLead(prev => ({ ...prev, ...p }));
  }

  async function reopen() {
    setReopening(true);
    try {
      const updated = await reopenLeadAction(lead.id);
      setLead(prev => ({ ...prev, ...updated }));
      toast.success("Lead reopened");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't reopen");
    } finally {
      setReopening(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete ${lead.name}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteLeadAction(lead.id);
      toast.success("Lead deleted");
      router.push("/app/leads");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't delete");
      setDeleting(false);
    }
  }

  const open = isLeadOpen(lead.status);
  const won = isLeadWon(lead.status);
  const lost = isLeadLost(lead.status);
  const displayLostReason: LostReason | null = (lead.lostReason as LostReason | null) ?? legacyLostReason(lead.status);

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <motion.div {...fadeInUp}>
        <Link href="/app/leads" className="text-xs font-medium flex items-center gap-1 mb-3" style={{ color: "var(--text-faint)" }}>
          <ChevronLeft className="w-3.5 h-3.5" /> Leads
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} size={44} />
            <div>
              <h1 className="os-heading-page" style={{ color: "var(--text)" }}>{lead.name}</h1>
              {lead.companyNameRaw && (
                <p className="os-text-body flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                  <Building2 className="w-3.5 h-3.5" /> {lead.companyNameRaw}
                </p>
              )}
            </div>
          </div>
          {lead.owner && (
            <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full" style={{ background: "var(--surface-hover)" }}>
              <Avatar name={lead.owner.name} color={lead.owner.avatarColor} size={22} />
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{lead.owner.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge tone={won ? "success" : lost ? "neutral" : "accent"}>{stageLabel(lead.status)}</Badge>
          <AttentionBadge lead={lead} />
          {lead.value > 0 && (
            <span className="os-text-number text-sm" style={{ color: "var(--text)" }}>{formatKES(lead.value)}</span>
          )}
        </div>
      </motion.div>

      {won && lead.convertedDealId && (
        <motion.div {...fadeInUp} className="mt-6 rounded-[var(--radius-lg)] p-5 flex items-center justify-between gap-3" style={{ background: "var(--success-soft)", border: "1px solid var(--success)" }}>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" style={{ color: "var(--success)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>
              Won{lead.wonAt ? ` ${friendlyDate(lead.wonAt)}` : ""} — now a deal
            </span>
          </div>
          <Button size="sm" variant="secondary" asChild className="gap-1">
            <Link href={`/app/deals/${lead.convertedDealId}`}>View Deal <ArrowRight className="w-3.5 h-3.5" /></Link>
          </Button>
        </motion.div>
      )}

      {lost && (
        <motion.div {...fadeInUp} className="mt-6 rounded-[var(--radius-lg)] p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Lost{displayLostReason ? ` — ${LOST_REASON_LABEL[displayLostReason]}` : ""}
              </p>
              {lead.lostNote && <p className="os-text-meta mt-1">{lead.lostNote}</p>}
              {lead.lostAt && <p className="os-text-meta mt-1">{friendlyDate(lead.lostAt)}</p>}
            </div>
            <Button size="sm" variant="secondary" loading={reopening} onClick={reopen} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reopen
            </Button>
          </div>
        </motion.div>
      )}

      {open && (
        <>
          {/* Next action */}
          <section className="mt-8">
            <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Next Action</h2>
            <div className="rounded-[var(--radius-lg)] p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <NextActionPanel
                leadId={lead.id}
                nextActionType={lead.nextActionType}
                nextActionDue={lead.nextActionDue}
                nextAction={lead.nextAction}
                onUpdated={patch}
              />
            </div>
          </section>

          {/* Quick actions */}
          <section className="mt-8">
            <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Quick Actions</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {lead.phone && <QuickActionTile icon={Phone} label="Call" onClick={() => window.open(`tel:${lead.phone}`)} />}
              {lead.phone && (
                <QuickActionTile icon={MessageCircle} label="WhatsApp" onClick={() => window.open(waLink(lead.phone!, `Hi ${lead.name}, following up on your interest in Techfind.`), "_blank")} />
              )}
              <QuickActionTile icon={Trophy} label="Mark Won" tone="success" onClick={() => setWonOpen(true)} />
              <QuickActionTile icon={XCircle} label="Mark Lost" tone="danger" onClick={() => setLostOpen(true)} />
            </div>
          </section>

          {/* Stage */}
          <section className="mt-8">
            <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Stage</h2>
            <StageTiles leadId={lead.id} status={lead.status} onUpdated={patch} />
          </section>

          {/* Temperature */}
          <section className="mt-8">
            <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Temperature</h2>
            <TemperatureTiles leadId={lead.id} temperature={lead.temperature} onUpdated={patch} />
          </section>
        </>
      )}

      {/* Lead info */}
      <section className="mt-8">
        <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Lead Info</h2>
        <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
          <InfoRow label="Phone" value={lead.phone} />
          <InfoRow label="Email" value={lead.email} />
          <InfoRow label="Industry" value={lead.industry} />
          <InfoRow label="Interested in" value={lead.interestedProduct} />
          <InfoRow label="Source" value={lead.source.charAt(0) + lead.source.slice(1).toLowerCase()} />
          <InfoRow label="Added" value={friendlyDate(lead.createdAt)} />
        </div>
      </section>

      <section className="mt-8 mb-6">
        <Button size="sm" variant="ghost" loading={deleting} onClick={remove} style={{ color: "var(--danger)" }}>
          Delete lead
        </Button>
      </section>

      <WonSheet
        open={wonOpen}
        onOpenChange={setWonOpen}
        leadId={lead.id}
        leadValue={lead.value}
        products={products}
        onWon={(_, dealId) => { toast.success("Converted to a deal"); router.push(`/app/deals/${dealId}`); }}
      />
      <LostSheet
        open={lostOpen}
        onOpenChange={setLostOpen}
        leadId={lead.id}
        onLost={() => { setLostOpen(false); router.refresh(); }}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="os-text-meta">{label}</span>
      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{value}</span>
    </div>
  );
}

