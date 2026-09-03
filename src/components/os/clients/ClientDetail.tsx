"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Company, Contact, User, Meeting, Product, Task } from "@prisma/client";
import type { DealMoney, ProductFootprintMoney } from "@/lib/os/moneyTypes";
import { Plus, Phone, Mail, Globe, Star, CalendarDays, MessageSquare, FileText, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Badge, TemperatureBadge } from "@/components/os/ui/Badge";
import { CompanyAvatar, Avatar } from "@/components/os/ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/os/ui/Tabs";
import { ComingSoon } from "@/components/os/common/ComingSoon";
import { formatKES } from "@/lib/os/money";
import { friendlyDate, friendlyDay } from "@/lib/os/dates";
import { CreateDealSheet } from "@/components/os/deals/CreateDealSheet";
import { ScheduleMeetingSheet } from "@/components/os/meetings/MeetingsView";
import type { DealWithRelations } from "@/components/os/deals/PipelineView";

type CompanyFull = Company & {
  contacts: Contact[];
  owner: User | null;
  deals: (DealMoney & { owner: User | null })[];
  meetings: Meeting[];
  footprint: (ProductFootprintMoney & { product: Product })[];
};

const FOOTPRINT_META: Record<string, { label: string; tone: "success" | "warning" | "neutral"; icon: string }> = {
  ACTIVE: { label: "Active", tone: "success", icon: "✅" },
  OPPORTUNITY: { label: "Opportunity", tone: "warning", icon: "🟡" },
  NOT_PITCHED: { label: "Not Pitched", tone: "neutral", icon: "⚪" },
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
  company, tasks, allProducts, users, currentUserId, canCreateDeal, canCreateMeeting,
}: {
  company: CompanyFull;
  tasks: (Task & { assignee: User | null })[];
  allProducts: Product[];
  users: User[];
  currentUserId: string;
  canCreateDeal: boolean;
  canCreateMeeting: boolean;
}) {
  const router = useRouter();
  const [dealOpen, setDealOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);

  const wonDeals = company.deals.filter(d => d.stage === "WON");
  const openDeals = company.deals.filter(d => !["WON", "LOST"].includes(d.stage));
  const lifetimeValue = wonDeals.reduce((s, d) => s + d.value, 0);
  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0);
  const recurring = company.footprint.filter(f => f.status === "ACTIVE" && f.mrr).reduce((s, f) => s + (f.mrr ?? 0), 0);
  const recommendation = recommendNextProduct(company.footprint);

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
          {canCreateMeeting && (
            <Button size="sm" variant="secondary" onClick={() => setMeetingOpen(true)} className="gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Meeting</Button>
          )}
          {canCreateDeal && (
            <Button size="sm" onClick={() => setDealOpen(true)} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> New Deal</Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {[
          { label: "Lifetime Value", value: formatKES(lifetimeValue, { compact: true }) },
          { label: "Open Pipeline", value: `${formatKES(pipelineValue, { compact: true })} (${openDeals.length})` },
          { label: "Recurring Revenue", value: recurring > 0 ? `${formatKES(recurring, { compact: true })}/mo` : "—" },
          { label: "Outstanding Balance", value: "—" },
        ].map(s => (
          <div key={s.label} className="rounded-[var(--radius-lg)] p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-lg font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>{s.value}</p>
            <p className="text-xs text-[var(--text-faint)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {recommendation && (
        <div className="mt-4 rounded-[var(--radius-lg)] p-4 flex items-start gap-3" style={{ background: "var(--accent-soft)", border: "1px solid var(--border-strong)" }}>
          <Star className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--text)]">Recommended Next Product: {recommendation.name}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{recommendation.reason}</p>
          </div>
          {canCreateDeal && <Button size="sm" variant="secondary" onClick={() => setDealOpen(true)} className="shrink-0">Create Opportunity</Button>}
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
                const meta = FOOTPRINT_META[fp?.status ?? "NOT_PITCHED"];
                return (
                  <div key={p.id} className="flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                    <span className="text-sm text-[var(--text)]">{p.name}</span>
                    <Badge tone={meta.tone}>{meta.icon} {meta.label}{fp?.mrr ? ` · ${formatKES(fp.mrr, { compact: true })}/mo` : ""}</Badge>
                  </div>
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

        <TabsContent value="opportunities" className="mt-5 space-y-2">
          {company.deals.length === 0 && <ComingSoon title="No opportunities yet" note="Create one to start tracking this client through the pipeline." />}
          {company.deals.map(d => (
            <Link key={d.id} href={`/app/deals/${d.id}`} className="flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-lg)] hover:bg-[var(--surface-hover)] transition-colors" style={{ border: "1px solid var(--border)" }}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text)] truncate">{d.title}</p>
                <p className="text-xs text-[var(--text-faint)] mt-0.5">{d.stage.replace(/_/g, " ")}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <TemperatureBadge temperature={d.temperature} />
                <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{formatKES(d.value, { compact: true })}</span>
              </div>
            </Link>
          ))}
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
          <ComingSoonCard icon={MessageSquare} title="Conversations" note="WhatsApp, email and call history — Phase 3." />
          <ComingSoonCard icon={FileText} title="Quotes, Proformas & Invoices" note="Full document history — Phase 4." />
          <ComingSoonCard icon={FolderKanban} title="Payments & Projects" note="Reconciled payments and project delivery — Phase 5–6." />
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

function ComingSoonCard({ icon: Icon, title, note }: { icon: typeof MessageSquare; title: string; note: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed p-5" style={{ borderColor: "var(--border-strong)" }}>
      <Icon className="w-4 h-4 mb-2" style={{ color: "var(--text-faint)" }} />
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      <p className="text-xs text-[var(--text-faint)] mt-1">{note}</p>
    </div>
  );
}
