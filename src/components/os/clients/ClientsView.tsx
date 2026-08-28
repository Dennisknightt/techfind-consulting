"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Company } from "@prisma/client";
import { Plus, Search, Building2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { CompanyAvatar } from "@/components/os/ui/Avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { formatKES } from "@/lib/os/money";
import { createClientAction } from "@/server/actions/clients";

type CompanyWithCounts = Company & { _count: { deals: number }; deals: { value: number }[] };

export function ClientsView({ initialCompanies, openCreateOnLoad }: { initialCompanies: CompanyWithCounts[]; openCreateOnLoad: boolean }) {
  const router = useRouter();
  const [companies, setCompanies] = useState(initialCompanies);
  const [createOpen, setCreateOpen] = useState(openCreateOnLoad);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return companies;
    const q = query.toLowerCase();
    return companies.filter(c => c.name.toLowerCase().includes(q) || (c.phone ?? "").includes(q) || (c.industry ?? "").toLowerCase().includes(q));
  }, [companies, query]);

  function onCreated(company: Company) {
    setCompanies(prev => [{ ...company, _count: { deals: 0 }, deals: [] }, ...prev]);
    setCreateOpen(false);
    router.push(`/app/clients/${company.id}`);
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Clients"
        subtitle={`${companies.length} companies`}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> New Client
          </Button>
        }
      />

      <div className="relative max-w-xs mt-5">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search clients…" className="pl-8" />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <Building2 className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">No clients yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
          {filtered.map(c => {
            const lifetimeValue = c.deals.reduce((s, d) => s + d.value, 0);
            return (
              <button
                key={c.id}
                onClick={() => router.push(`/app/clients/${c.id}`)}
                className="text-left rounded-[var(--radius-lg)] p-4 transition-shadow hover:shadow-[var(--shadow-sm)]"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <CompanyAvatar name={c.name} size={38} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)] truncate">{c.name}</p>
                    <p className="text-xs text-[var(--text-faint)] truncate">{c.industry ?? "—"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-faint)]">{c._count.deals} opportunit{c._count.deals === 1 ? "y" : "ies"}</span>
                  {lifetimeValue > 0 && <span className="font-bold" style={{ color: "var(--accent)" }}>{formatKES(lifetimeValue, { compact: true })}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <CreateClientSheet open={createOpen} onOpenChange={setCreateOpen} onCreated={onCreated} />
    </div>
  );
}

function CreateClientSheet({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: (c: Company) => void }) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!companyName.trim()) { toast.error("Company name is required"); return; }
    setSaving(true);
    try {
      const { company } = await createClientAction({ name, companyName, phone, email, industry, website });
      onCreated(company);
      setName(""); setCompanyName(""); setPhone(""); setEmail(""); setIndustry(""); setWebsite("");
      toast.success(`${company.name} added`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't create client");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader><SheetTitle>New Client</SheetTitle></SheetHeader>
        <SheetBody className="space-y-4">
          <div>
            <Label htmlFor="cl-company">Company *</Label>
            <Input id="cl-company" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Xpress Shine Detergents" autoFocus />
          </div>
          <div>
            <Label htmlFor="cl-name">Primary contact</Label>
            <Input id="cl-name" value={name} onChange={e => setName(e.target.value)} placeholder="Lucy Macharia" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cl-phone">Phone</Label>
              <Input id="cl-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254712345678" />
            </div>
            <div>
              <Label htmlFor="cl-email">Email</Label>
              <Input id="cl-email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cl-industry">Industry</Label>
              <Input id="cl-industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Manufacturing" />
            </div>
            <div>
              <Label htmlFor="cl-website">Website</Label>
              <Input id="cl-website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="xpressshine.co.ke" />
            </div>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button loading={saving} onClick={submit}>Add Client</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
