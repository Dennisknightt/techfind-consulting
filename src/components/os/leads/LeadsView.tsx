"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Lead, User, Product } from "@prisma/client";
import { Plus, Search, ArrowRight, Sparkles, ChevronLeft, Check, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { fadeInUp } from "@/lib/os/motion";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { Badge, TemperatureBadge } from "@/components/os/ui/Badge";
import { Avatar } from "@/components/os/ui/Avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { formatKES } from "@/lib/os/money";
import { timeAgo } from "@/lib/os/dates";
import { createLeadAction, convertLeadToDealAction, updateLeadAction } from "@/server/actions/leads";

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

  const TEMP_CYCLE = ["HOT", "WARM", "COLD"] as const;
  async function cycleTemperature(lead: LeadWithOwner) {
    const i = TEMP_CYCLE.indexOf(lead.temperature as (typeof TEMP_CYCLE)[number]);
    const next = TEMP_CYCLE[(i + 1) % TEMP_CYCLE.length];
    setLeads(prev => prev.map(l => (l.id === lead.id ? { ...l, temperature: next } : l)));
    try {
      await updateLeadAction(lead.id, { temperature: next });
    } catch {
      setLeads(prev => prev.map(l => (l.id === lead.id ? { ...l, temperature: lead.temperature } : l)));
      toast.error("Couldn't update temperature");
    }
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
              className="os-press px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
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

      {filtered.length > 0 && (
        <div className="mt-5 rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div
            className="hidden sm:grid items-center gap-3 px-4 py-2 border-b"
            style={{ gridTemplateColumns: "minmax(0,1fr) 130px 100px 100px 40px 120px", borderColor: "var(--border)" }}
          >
            {["Lead", "Source", "Temp", "Value", "", ""].map((h, i) => (
              <span key={i} className="os-text-meta font-semibold uppercase tracking-wide" style={{ fontSize: 11 }}>{h}</span>
            ))}
          </div>
          {filtered.map((lead, i) => (
            <motion.div
              key={lead.id}
              {...fadeInUp}
              className="os-row-hover group grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_130px_100px_100px_40px_120px] items-center gap-x-3 gap-y-1.5 px-4 py-2.5"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={lead.name} size={28} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{lead.name}</span>
                    {lead.status === "CONVERTED" && <Badge tone="success">Converted</Badge>}
                  </div>
                  <p className="os-text-meta truncate">
                    {lead.companyNameRaw || lead.phone || lead.email || timeAgo(lead.createdAt)}
                  </p>
                </div>
              </div>

              <span className="os-text-meta hidden sm:block truncate">{sourceLabel(lead.source)}</span>

              <button onClick={() => cycleTemperature(lead)} className="hidden sm:flex justify-start" title="Click to change">
                <TemperatureBadge temperature={lead.temperature} />
              </button>

              <span className="hidden sm:block os-text-number text-sm text-right" style={{ color: "var(--text)" }}>
                {lead.value > 0 ? formatKES(lead.value, { compact: true }) : "—"}
              </span>

              <span className="hidden sm:flex justify-center">
                {lead.owner && <Avatar name={lead.owner.name} color={lead.owner.avatarColor} size={22} />}
              </span>

              <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
            </motion.div>
          ))}
        </div>
      )}

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

const VALUE_BANDS = [50_000, 100_000, 150_000, 200_000, 300_000];
const TEMPERATURES = [
  { value: "HOT",  label: "Hot",  emoji: "🔥" },
  { value: "WARM", label: "Warm", emoji: "☀️" },
  { value: "COLD", label: "Cold", emoji: "❄️" },
] as const;

const STEPS = ["name", "company", "phone", "source", "product", "value", "temperature", "owner"] as const;
type StepKey = (typeof STEPS)[number];
const STEP_QUESTION: Record<StepKey, string> = {
  name: "Who's the lead?",
  company: "Which company?",
  phone: "Phone number?",
  source: "Where did this come from?",
  product: "What are they interested in?",
  value: "Rough deal size?",
  temperature: "How promising?",
  owner: "Who's chasing this one?",
};

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
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("MANUAL");
  const [product, setProduct] = useState<string | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState("");
  const [temperature, setTemperature] = useState<string>("WARM");
  const [ownerId, setOwnerId] = useState(currentUserId);
  const [saving, setSaving] = useState(false);

  const stepKey = STEPS[step];
  const canFinishEarly = name.trim().length > 0;

  function reset() {
    setStep(0); setName(""); setCompany(""); setPhone(""); setSource("MANUAL");
    setProduct(null); setValue(null); setCustomValue(""); setTemperature("WARM"); setOwnerId(currentUserId);
  }

  function next() {
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep(s => Math.max(s - 1, 0));
  }

  async function submit(finalOwnerId: string) {
    if (!name.trim()) { toast.error("Name is required"); setStep(0); return; }
    setSaving(true);
    try {
      const lead = await createLeadAction({
        name,
        companyNameRaw: company || undefined,
        phone: phone || undefined,
        source,
        interestedProduct: product || undefined,
        value: value ?? undefined,
        temperature,
        ownerId: finalOwnerId,
      });
      const owner = users.find(u => u.id === finalOwnerId) ?? null;
      onCreated({ ...lead, owner } as LeadWithOwner);
      reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't create lead");
    } finally {
      setSaving(false);
    }
  }

  function selectSource(s: string) { setSource(s); next(); }
  function selectProduct(p: string) { setProduct(prev => (prev === p ? null : p)); next(); }
  function selectValue(v: number | null) { setValue(v); next(); }
  function selectTemperature(t: string) { setTemperature(t); next(); }
  function selectOwner(id: string) { setOwnerId(id); submit(id); }

  return (
    <Sheet open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset(); }}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={back} className="shrink-0 p-1 -ml-1 rounded-full hover:bg-[var(--surface-hover)]" aria-label="Back">
                <ChevronLeft className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
              </button>
            )}
            <SheetTitle>New Lead</SheetTitle>
          </div>
          <div className="flex gap-1 mt-3">
            {STEPS.map((s, i) => (
              <div key={s} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? "var(--accent)" : "var(--surface-hover)" }} />
            ))}
          </div>
        </SheetHeader>

        <SheetBody className="flex-1 flex flex-col overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepKey}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="os-heading-section mb-4" style={{ color: "var(--text)" }}>
            {STEP_QUESTION[stepKey]}
          </p>

          {stepKey === "name" && (
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && name.trim()) next(); }}
              placeholder="Lucy Macharia"
              autoFocus
            />
          )}

          {stepKey === "company" && (
            <Input
              value={company}
              onChange={e => setCompany(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") next(); }}
              placeholder="Xpress Shine"
              autoFocus
            />
          )}

          {stepKey === "phone" && (
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") next(); }}
              placeholder="+254712345678"
              autoFocus
            />
          )}

          {stepKey === "source" && (
            <div className="flex flex-wrap gap-2">
              {SOURCES.map(s => (
                <Chip key={s} active={source === s} onClick={() => selectSource(s)}>{sourceLabel(s)}</Chip>
              ))}
            </div>
          )}

          {stepKey === "product" && (
            <div className="flex flex-wrap gap-2">
              {products.map(p => (
                <Chip key={p.key} active={product === p.name} onClick={() => selectProduct(p.name)}>{p.name}</Chip>
              ))}
            </div>
          )}

          {stepKey === "value" && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {VALUE_BANDS.map(v => (
                  <Chip key={v} active={value === v} onClick={() => selectValue(v)}>{formatKES(v, { compact: true })}</Chip>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={customValue}
                  onChange={e => setCustomValue(e.target.value.replace(/[^\d]/g, ""))}
                  onKeyDown={e => { if (e.key === "Enter" && customValue) selectValue(Number(customValue)); }}
                  type="text" inputMode="numeric" placeholder="Custom amount"
                  className="flex-1"
                />
                <Button size="sm" variant="secondary" disabled={!customValue} onClick={() => selectValue(Number(customValue))}>Use</Button>
              </div>
            </div>
          )}

          {stepKey === "temperature" && (
            <div className="flex flex-wrap gap-3">
              {TEMPERATURES.map(t => (
                <button
                  key={t.value}
                  onClick={() => selectTemperature(t.value)}
                  className="os-card-hover os-press flex flex-col items-center gap-1.5 px-6 py-4 rounded-[var(--radius-lg)] text-sm font-semibold"
                  style={{
                    background: temperature === t.value ? "var(--accent-soft)" : "var(--surface-hover)",
                    color: temperature === t.value ? "var(--accent)" : "var(--text)",
                    border: `1px solid ${temperature === t.value ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {stepKey === "owner" && (
            <div className="flex flex-wrap gap-2">
              {users.map(u => (
                <button
                  key={u.id}
                  disabled={saving}
                  onClick={() => selectOwner(u.id)}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                  style={{
                    background: ownerId === u.id ? "var(--accent-soft)" : "var(--surface-hover)",
                    color: ownerId === u.id ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  <Avatar name={u.name} color={u.avatarColor} size={22} /> {u.name}
                </button>
              ))}
            </div>
          )}
        </motion.div>
        </AnimatePresence>
        </SheetBody>

        <SheetFooter className="justify-between">
          <div>
            {stepKey !== "name" && stepKey !== "owner" && (
              <Button variant="ghost" size="sm" onClick={next}>Skip</Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canFinishEarly && stepKey !== "owner" && (
              <Button variant="secondary" size="sm" loading={saving} onClick={() => submit(ownerId)} className="gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Save now
              </Button>
            )}
            {stepKey === "name" && (
              <Button size="sm" disabled={!name.trim()} onClick={next} className="gap-1.5">Next <ArrowRight className="w-3.5 h-3.5" /></Button>
            )}
            {stepKey === "owner" && (
              <Button size="sm" loading={saving} onClick={() => selectOwner(ownerId)} className="gap-1.5"><Check className="w-3.5 h-3.5" /> Add Lead</Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="os-press px-4 py-2 rounded-full text-sm font-medium transition-colors"
      style={{
        background: active ? "var(--accent-soft)" : "var(--surface-hover)",
        color: active ? "var(--accent)" : "var(--text-muted)",
        border: `1px solid ${active ? "var(--accent)" : "transparent"}`,
      }}
    >
      {children}
    </button>
  );
}
