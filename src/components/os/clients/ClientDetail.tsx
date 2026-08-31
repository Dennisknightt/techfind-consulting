"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Company, Contact, Deal, User, Meeting, ProductFootprint, Product, Task, SalesDocument } from "@prisma/client";
import { Plus, Phone, Mail, Globe, Star, CalendarDays, MessageSquare, FileText, FolderKanban, CreditCard, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/os/ui/Button";
import { Badge, TemperatureBadge } from "@/components/os/ui/Badge";
import { CompanyAvatar, Avatar } from "@/components/os/ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/os/ui/Tabs";
import { ComingSoon } from "@/components/os/common/ComingSoon";
import { RequestPaymentButton } from "@/components/os/payments/RequestPaymentButton";
import { formatKES } from "@/lib/os/money";
import { friendlyDate, friendlyDay } from "@/lib/os/dates";
import { CreateDealSheet } from "@/components/os/deals/CreateDealSheet";
import { ScheduleMeetingSheet } from "@/components/os/meetings/MeetingsView";
import type { DealWithRelations } from "@/components/os/deals/PipelineView";
import { updateFootprintStatusAction, type FootprintStatus } from "@/server/actions/clients";

type CompanyFull = Company & {
  contacts: Contact[];
  owner: User | null;
  deals: (Deal & { owner: User | null })[];
  meetings: Meeting[];
  footprint: (ProductFootprint & { product: Product })[];
};

const FOOTPRINT_META: Record<string, { label: string; tone: "success" | "warning" | "neutral"; icon: string }> = {
  ACTIVE: { label: "Active", tone: "success", icon: "✅" },
  OPPORTUNITY: { label: "Opportunity", tone: "warning", icon: "🟡" },
  NOT_PITCHED: { label: "Not Pitched", tone: "neutral", icon: "⚪" },
};

const FOOTPRINT_NEXT: Record<string, FootprintStatus> = {
  NOT_PITCHED: "OPPORTUNITY",
  OPPORTUNITY: "ACTIVE",
  ACTIVE: "NOT_PITCHED",
};

function recommendNextProduct(footprint: CompanyFull["footprint"]) {
  const statusOf = (key: string) => footprint.find(f => f.product.key === key)?.status ?? "NOT_PITCHED";
  if (statusOf("whatsapp") !== "NOT_PITCHED" && statusOf("crm") === "NOT_PITCHED") {
    return { name: "CRM", reason: "This client receives WhatsApp leads but doesn't have structured lead management yet." };
  }
  if (statusOf("website") === "ACTIVE" && statusOf("whatsapp") === "NOT_PITCHED") {
    return { name: "WhatsApp Automation", reason: "This client has a live website but no automated WhatsApp follow-up." };
  }
  if (statusOf("crm") === "ACTIVE" && statusOf("maintenance") === "NOT_PITCHED") {
    return { name: "Maintenance", reason: "Active systems with no ongoing maintenance plan attached." };
  }
  return null;
}

export function ClientDetail({
  company, tasks, allProducts, users, currentUserId, documents,
}: {
  company: CompanyFull;
  tasks: (Task & { assignee: User | null })[];
  allProducts: Product[];
  users: User[];
  currentUserId: string;
  documents: SalesDocument[];
}) {
  const router = useRouter();
  const [dealOpen, setDealOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [footprintOverrides, setFootprintOverrides] = useState<Record<string, FootprintStatus>>({});
  const [footprintSaving, setFootprintSaving] = useState<string | null>(null);

  function statusFor(productId: string): FootprintStatus {
    return footprintOverrides[productId] ?? (company.footprint.find(f => f.productId === productId)?.status as FootprintStatus | undefined) ?? "NOT_PITCHED";
  }

  async function cycleFootprint(productId: string) {
    const next = FOOTPRINT_NEXT[statusFor(productId)];
    setFootprintOverrides(prev => ({ ...prev, [productId]: next }));
    setFootprintSaving(productId);
    try {
      await updateFootprintStatusAction(company.id, productId, next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update — try again");
      setFootprintOverrides(prev => { const { [productId]: _drop, ...rest } = prev; return rest; });
    } finally {
      setFootprintSaving(null);
    }
  }

  const wonDeals = company.deals.filter(d => d.stage === "WON");
  const openDeals = company.deals.filter(d => !["WON", "LOST"].includes(d.stage));
  const lifetimeValue = wonDeals.reduce((s, d) => s + d.value, 0);
  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0);
  const recurring = company.footprint.filter(f => f.status === "ACTIVE" && f.mrr).reduce((s, f) => s + (f.mrr ?? 0), 0);
  const recommendation = recommendNextProduct(company.footprint);
  const outstandingDocs = documents.filter(d => d.balance > 0).sort((a, b) => b.balance - a.balance);
  const outstandingBalance = outstandingDocs.reduce((s, d) => s + d.balance, 0);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-start gap-4 flex-wrap justify-between">
        <div className="flex items-center gap-3.5">
          <CompanyAvatar name={company.name} size={52} />
          <div>
            <h1 className="text-xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>{company.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-faint)] flex-wrap">
              {company.industry && <span>{company.industry}</span>}
              {company.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{company.phone}</span>}
              {company.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{company.email}</span>}
              {company.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{company.website}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setMeetingOpen(true)} className="gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Meeting</Button>
          <Button size="sm" onClick={() => setDealOpen(true)} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> New Deal</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 rounded-[var(--radius-lg)] border p-4" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "Lifetime Value", value: formatKES(lifetimeValue, { compact: true }) },
          { label: "Open Pipeline", value: `${formatKES(pipelineValue, { compact: true })} (${openDeals.length})` },
          { label: "Recurring Revenue", value: recurring > 0 ? `${formatKES(recurring, { compact: true })}/mo` : "—" },
          { label: "Outstanding Balance", value: outstandingBalance > 0 ? formatKES(outstandingBalance, { compact: true }) : "KES 0", tone: outstandingBalance > 0 ? "warning" as const : undefined },
        ].map(s => (
          <div key={s.label}>
            <p className="os-text-number text-base" style={{ color: s.tone === "warning" ? "var(--warning)" : "var(--text)" }}>{s.value}</p>
            <p className="os-text-meta mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {outstandingDocs.length > 0 && (
        <div className="mt-4 rounded-[var(--radius-lg)] p-4 flex items-center justify-between gap-3 flex-wrap" style={{ background: "var(--warning-soft)" }}>
          <p className="text-sm" style={{ color: "var(--warning)" }}>
            <strong>{formatKES(outstandingBalance, { compact: true })}</strong> outstanding across {outstandingDocs.length} invoice{outstandingDocs.length === 1 ? "" : "s"}
          </p>
          <RequestPaymentButton
            documentId={outstandingDocs[0].id}
            label={outstandingDocs[0].paidAmount > 0 ? "Request Balance" : "Request Payment"}
            size="sm"
          />
        </div>
      )}

      {recommendation && (
        <div className="mt-4 rounded-[var(--radius-lg)] p-4 flex items-start gap-3 border" style={{ borderColor: "var(--border)" }}>
          <Star className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <div className="flex-1 min-w-0">
            <p className="os-text-body font-medium" style={{ color: "var(--text)" }}>Recommended next: {recommendation.name}</p>
            <p className="os-text-meta mt-0.5">{recommendation.reason}</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setDealOpen(true)} className="shrink-0">Create Opportunity</Button>
        </div>
      )}

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities ({company.deals.length})</TabsTrigger>
          <TabsTrigger value="meetings">Meetings ({company.meetings.length})</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="more">More</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Product Footprint</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allProducts.filter(p => p.isQuickChip || company.footprint.some(f => f.productId === p.id)).map(p => {
                const fp = company.footprint.find(f => f.productId === p.id);
                const status = statusFor(p.id);
                const meta = FOOTPRINT_META[status];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => cycleFootprint(p.id)}
                    disabled={footprintSaving === p.id}
                    title={`Tap to mark as ${FOOTPRINT_META[FOOTPRINT_NEXT[status]].label}`}
                    className="os-press flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)] text-left transition-colors hover:bg-[var(--surface-sunken)] disabled:opacity-60"
                    style={{ background: "var(--surface-hover)" }}
                  >
                    <span className="text-sm text-[var(--text)]">{p.name}</span>
                    <Badge tone={meta.tone}>{meta.icon} {meta.label}{fp?.mrr ? ` · ${formatKES(fp.mrr, { compact: true })}/mo` : ""}</Badge>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Contacts</p>
            <div className="space-y-2">
              {company.contacts.map(c => (
                <div key={c.id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                  <Avatar name={c.name} size={30} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text)]">{c.name} {c.isPrimary && <span className="text-[10px] font-bold ml-1" style={{ color: "var(--accent)" }}>PRIMARY</span>}</p>
                    <p className="text-xs text-[var(--text-faint)]">{[c.phone, c.email].filter(Boolean).join(" · ") || "No contact details"}</p>
                  </div>
                </div>
              ))}
              {company.contacts.length === 0 && <p className="text-xs text-[var(--text-faint)]">No contacts yet.</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-5">
          {company.deals.length === 0 ? (
            <ComingSoon title="No opportunities yet" note="Create one to start tracking this client through the pipeline." />
          ) : (
            <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
              {company.deals.map(d => (
                <Link key={d.id} href={`/app/deals/${d.id}`} className="os-row-hover flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{d.title}</p>
                    <p className="os-text-meta mt-0.5">{d.stage.replace(/_/g, " ")}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TemperatureBadge temperature={d.temperature} />
                    <span className="os-text-number text-sm" style={{ color: "var(--text)" }}>{formatKES(d.value, { compact: true })}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="meetings" className="mt-5 space-y-2">
          {company.meetings.length === 0 && <ComingSoon title="No meetings yet" note="Schedule one to prep and capture outcomes fast." />}
          {company.meetings.map(m => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)]" style={{ border: "1px solid var(--border)" }}>
              <span className="text-sm text-[var(--text)]">{friendlyDate(m.scheduledAt)}</span>
              <Badge tone={m.status === "DONE" ? "success" : "neutral"}>{m.status}</Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="mt-5 space-y-2">
          {tasks.length === 0 && <ComingSoon title="No open tasks" note="Tasks linked to this client's deals will show up here." />}
          {tasks.map(t => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)]" style={{ border: "1px solid var(--border)" }}>
              <span className="text-sm text-[var(--text)]">{t.title}</span>
              <div className="flex items-center gap-2">
                {t.dueAt && <span className="text-xs text-[var(--text-faint)]">{friendlyDay(t.dueAt)}</span>}
                {t.assignee && <Avatar name={t.assignee.name} color={t.assignee.avatarColor} size={22} />}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="more" className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <LinkOutCard icon={MessageSquare} title="Conversations" note="WhatsApp, email and call history" href={`/app/communications?company=${company.id}`} />
          <LinkOutCard icon={FileText} title="Quotes & Proformas" note="Documents sent to this client" href="/app/quotes" />
          <LinkOutCard icon={CreditCard} title="Payments" note="Reconciled payments" href="/app/payments" />
          <LinkOutCard icon={FolderKanban} title="Projects" note="Delivery once a deal is won" href="/app/projects" />
        </TabsContent>
      </Tabs>

      <CreateDealSheet
        open={dealOpen}
        onOpenChange={setDealOpen}
        users={users}
        products={allProducts.filter(p => p.isQuickChip)}
        currentUserId={currentUserId}
        lockedCompany={company}
        onCreated={(deal: DealWithRelations) => { setDealOpen(false); router.push(`/app/deals/${deal.id}`); }}
      />
      <ScheduleMeetingSheet
        open={meetingOpen}
        onOpenChange={setMeetingOpen}
        lockedCompany={company}
        onScheduled={() => { setMeetingOpen(false); router.refresh(); }}
      />
    </div>
  );
}

function LinkOutCard({ icon: Icon, title, note, href }: { icon: typeof MessageSquare; title: string; note: string; href: string }) {
  return (
    <Link href={href} className="os-row-hover flex items-start justify-between gap-3 rounded-[var(--radius-lg)] border p-4" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start gap-3 min-w-0">
        <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--text-faint)" }} />
        <div className="min-w-0">
          <p className="os-text-body font-medium" style={{ color: "var(--text)" }}>{title}</p>
          <p className="os-text-meta mt-0.5">{note}</p>
        </div>
      </div>
      <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--text-faint)" }} />
    </Link>
  );
}
