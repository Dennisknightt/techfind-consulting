"use client";

import { useState } from "react";
import type { Company, User, Product } from "@prisma/client";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { Input, Label } from "@/components/os/ui/Input";
import { Button } from "@/components/os/ui/Button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import { CompanyPicker } from "@/components/os/common/CompanyPicker";
import { QuickClientDialog } from "@/components/os/common/QuickClientDialog";
import { createDealAction } from "@/server/actions/deals";
import type { DealWithRelations } from "./PipelineView";

const TEMPS = ["HOT", "WARM", "COLD"];

export function CreateDealSheet({
  open,
  onOpenChange,
  users,
  products,
  currentUserId,
  onCreated,
  lockedCompany,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  users: User[];
  products: Product[];
  currentUserId: string;
  onCreated: (deal: DealWithRelations) => void;
  /** When set (e.g. from a Client's detail page) the company is fixed and the picker is hidden. */
  lockedCompany?: Company;
}) {
  const [company, setCompany] = useState<Company | null>(lockedCompany ?? null);
  const [quickClientOpen, setQuickClientOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [temperature, setTemperature] = useState("WARM");
  const [ownerId, setOwnerId] = useState(currentUserId);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleProduct(name: string) {
    setSelectedProducts(prev => (prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]));
  }

  async function submit() {
    if (!company) { toast.error("Select or add a client first"); return; }
    if (!title.trim()) { toast.error("Give this deal a name"); return; }
    setSaving(true);
    try {
      const deal = await createDealAction({
        title,
        companyId: company.id,
        value: value ? Number(value) : 0,
        temperature,
        ownerId,
        productKeys: selectedProducts,
      });
      const owner = users.find(u => u.id === ownerId) ?? null;
      onCreated({ ...deal, company, owner } as DealWithRelations);
      toast.success("Deal created");
      setCompany(lockedCompany ?? null); setTitle(""); setValue(""); setTemperature("WARM"); setSelectedProducts([]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't create deal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>New Deal</SheetTitle>
          </SheetHeader>
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
                <CompanyPicker value={company} onChange={setCompany} onCreateNew={() => setQuickClientOpen(true)} />
              </div>
            )}
            <div>
              <Label htmlFor="deal-title">Opportunity</Label>
              <Input id="deal-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Manufacturing Management System" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="deal-value">Value (KES)</Label>
                <Input id="deal-value" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="150000" />
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
            <div>
              <Label>Temperature</Label>
              <div className="flex gap-1.5">
                {TEMPS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTemperature(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                    style={{
                      background: temperature === t ? "var(--accent-soft)" : "var(--surface-hover)",
                      color: temperature === t ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    {t === "HOT" ? "🔥 Hot" : t === "WARM" ? "🟡 Warm" : "⚪ Cold"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Products</Label>
              <div className="flex flex-wrap gap-1.5">
                {products.map(p => (
                  <button
                    key={p.key}
                    onClick={() => toggleProduct(p.name)}
                    className="px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{
                      background: selectedProducts.includes(p.name) ? "var(--accent-soft)" : "var(--surface-hover)",
                      color: selectedProducts.includes(p.name) ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button loading={saving} onClick={submit}>Create Deal</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <QuickClientDialog open={quickClientOpen} onOpenChange={setQuickClientOpen} onCreated={setCompany} />
    </>
  );
}
