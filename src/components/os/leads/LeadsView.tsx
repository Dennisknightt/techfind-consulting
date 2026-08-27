"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Lead, User, Product } from "@prisma/client";
import { Plus, Search, Phone, Mail, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { Badge, TemperatureBadge } from "@/components/os/ui/Badge";
import { Avatar } from "@/components/os/ui/Avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import { formatKES } from "@/lib/os/money";
import { timeAgo } from "@/lib/os/dates";
import { createLeadAction, convertLeadToDealAction } from "@/server/actions/leads";

type LeadWithOwner = Lead & { owner: User | null };

const SOURCES = ["WHATSAPP", "WEBSITE", "META", "TIKTOK", "EMAIL", "PHONE", "REFERRAL", "MANUAL"];
const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "DISQUALIFIED"];

function sourceLabel(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export function LeadsView({
  initialLeads,
  users,
  products,
  currentUserId,
  openCreateOnLoad,
}: {
  initialLeads: LeadWithOwner[];
  users: User[];
  products: Product[];
  currentUserId: string;
  openCreateOnLoad: boolean;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [createOpen, setCreateOpen] = useState(openCreateOnLoad);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        (l.companyNameRaw ?? "").toLowerCase().includes(q) ||
        (l.phone ?? "").includes(q)
      );
    });
  }, [leads, statusFilter, query]);

  async function convert(lead: LeadWithOwner) {
    setConvertingId(lead.id);
    try {
      const deal = await convertLeadToDealAction(lead.id);
      setLeads(prev => prev.map(l => (l.id === lead.id ? { ...l, status: "CONVERTED", convertedDealId: deal.id } : l)));
      toast.success(`${lead.name} converted to a deal`);
      router.push(`/app/deals/${deal.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't convert this lead");
    } finally {
      setConvertingId(null);
    }
  }

  function onCreated(lead: LeadWithOwner) {
    setLeads(prev => [lead, ...prev]);
    setCreateOpen(false);
    toast.success(`${lead.name} added to Leads`);
    startTransition(() => router.refresh());
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Leads"
        subtitle={`${leads.length} captured · minimal typing, fast follow-up`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> New Lead
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mt-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search leads…" className="pl-8" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["ALL", ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: statusFilter === s ? "var(--accent-soft)" : "var(--surface-hover)",
                color: statusFilter === s ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <Sparkles className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">No leads match yet</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">New leads from WhatsApp, the website and referrals land here automatically.</p>
        </div>
      )}

      <div className="mt-5 space-y-2.5">
        {filtered.map(lead => (
          <div
            key={lead.id}
            className="rounded-[var(--radius-lg)] border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <Avatar name={lead.name} size={38} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-[var(--text)]">{lead.name}</span>
                {lead.companyNameRaw && <span className="text-xs text-[var(--text-faint)]">· {lead.companyNameRaw}</span>}
                <TemperatureBadge temperature={lead.temperature} />
                <Badge tone="neutral">{sourceLabel(lead.source)}</Badge>
                {lead.status === "CONVERTED" && <Badge tone="success">Converted</Badge>}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--text-faint)] flex-wrap">
                {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
                {lead.interestedProduct && <span>Interested: {lead.interestedProduct}</span>}
                <span>{timeAgo(lead.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {lead.value > 0 && <span className="text-sm font-bold text-[var(--text)]">{formatKES(lead.value, { compact: true })}</span>}
              {lead.owner && <Avatar name={lead.owner.name} color={lead.owner.avatarColor} size={26} />}
              {lead.status !== "CONVERTED" ? (
                <Button size="sm" variant="secondary" loading={convertingId === lead.id} onClick={() => convert(lead)} className="gap-1">
                  Convert <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : lead.convertedDealId ? (
                <Button size="sm" variant="ghost" onClick={() => router.push(`/app/deals/${lead.convertedDealId}`)}>
                  View Deal
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <CreateLeadSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        users={users}
        products={products}
        currentUserId={currentUserId}
        onCreated={onCreated}
      />
    </div>
  );
}

function CreateLeadSheet({
  open,
  onOpenChange,
  users,
  products,
  currentUserId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  users: User[];
  products: Product[];
  currentUserId: string;
  onCreated: (lead: LeadWithOwner) => void;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("MANUAL");
  const [product, setProduct] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [ownerId, setOwnerId] = useState(currentUserId);
  const [saving, setSaving] = useState(false);

  function reset() {
    setName(""); setCompany(""); setPhone(""); setEmail(""); setSource("MANUAL");
    setProduct(null); setValue(""); setOwnerId(currentUserId);
  }

  async function submit() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const lead = await createLeadAction({
        name,
        companyNameRaw: company || undefined,
        phone: phone || undefined,
        email: email || undefined,
        source,
        interestedProduct: product || undefined,
        value: value ? Number(value) : undefined,
        ownerId,
      });
      const owner = users.find(u => u.id === ownerId) ?? null;
      onCreated({ ...lead, owner } as LeadWithOwner);
      reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't create lead");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Lead</SheetTitle>
        </SheetHeader>
        <SheetBody className="space-y-4">
          <div>
            <Label htmlFor="lead-name">Name *</Label>
            <Input id="lead-name" value={name} onChange={e => setName(e.target.value)} placeholder="Lucy Macharia" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="lead-company">Company</Label>
              <Input id="lead-company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Xpress Shine" />
            </div>
            <div>
              <Label htmlFor="lead-phone">Phone</Label>
              <Input id="lead-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254712345678" />
            </div>
          </div>
          <div>
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="lucy@xpressshine.co.ke" />
          </div>

          <div>
            <Label>Source</Label>
            <div className="flex flex-wrap gap-1.5">
              {SOURCES.map(s => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className="px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background: source === s ? "var(--accent-soft)" : "var(--surface-hover)",
                    color: source === s ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {sourceLabel(s)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Interested product</Label>
            <div className="flex flex-wrap gap-1.5">
              {products.map(p => (
                <button
                  key={p.key}
                  onClick={() => setProduct(prev => (prev === p.name ? null : p.name))}
                  className="px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background: product === p.name ? "var(--accent-soft)" : "var(--surface-hover)",
                    color: product === p.name ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="lead-value">Est. value (KES)</Label>
              <Input id="lead-value" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="150000" />
            </div>
            <div>
              <Label>Owner</Label>
              <Select value={ownerId} onValueChange={setOwnerId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button loading={saving} onClick={submit}>Add Lead</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
