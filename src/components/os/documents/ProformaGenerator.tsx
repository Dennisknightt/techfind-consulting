"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Company, Contact } from "@prisma/client";
import type { QuickItemMoney, PackageMoney, DealMoney } from "@/lib/os/moneyTypes";
import { Plus, Minus, X, FileText, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { CompanyPicker } from "@/components/os/common/CompanyPicker";
import { QuickClientDialog } from "@/components/os/common/QuickClientDialog";
import { DocumentPreview, type PreviewItem } from "./DocumentPreview";
import { PAYMENT_TERMS, depositPercentFor, computeDocumentTotals, type PaymentTermsPreset } from "@/lib/os/documentMath";
import { parseJsonArray } from "@/server/json";
import { createDocumentAction } from "@/server/actions/documents";
import { DocumentCreatedView } from "./DocumentCreatedView";

interface DraftItem extends PreviewItem {
  id: string;
  productKey?: string;
}

const DEFAULT_TERMS = "50% deposit due on acceptance. Balance due before delivery/go-live. Prices quoted in Kenyan Shillings.";

export function ProformaGenerator({
  products, quickItems, packages, tax, initialDeal,
}: {
  products: Product[];
  quickItems: QuickItemMoney[];
  packages: PackageMoney[];
  tax: import("@/lib/os/documentMath").TaxConfig;
  initialDeal: (DealMoney & { company: Company; contact: Contact | null }) | null;
}) {
  const router = useRouter();
  const [docType, setDocType] = useState<"PROFORMA" | "QUOTE">("PROFORMA");
  const [company, setCompany] = useState<Company | null>(initialDeal?.company ?? null);
  const [contact] = useState<Contact | null>(initialDeal?.contact ?? null);
  const [quickClientOpen, setQuickClientOpen] = useState(false);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [termsPreset, setTermsPreset] = useState<PaymentTermsPreset>("100%");
  const [customDepositPct, setCustomDepositPct] = useState("100");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [validUntilDays, setValidUntilDays] = useState("14");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [creating, setCreating] = useState(false);
  const [createdDoc, setCreatedDoc] = useState<Awaited<ReturnType<typeof createDocumentAction>> | null>(null);

  const quickChipProducts = products.filter(p => p.isQuickChip);
  const depositPercent = depositPercentFor(termsPreset, Number(customDepositPct));
  const totals = useMemo(
    () => computeDocumentTotals({ items, discount: Number(discount) || 0, tax, depositPercent }),
    [items, discount, tax, depositPercent]
  );

  function addItem(item: Omit<DraftItem, "id">) {
    setItems(prev => [...prev, { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }]);
    setExpandedKey(null);
    setCustomAmount("");
  }

  function addProductPrice(product: Product, price: number) {
    addItem({ label: product.name, quantity: 1, unitPrice: price, productKey: product.key });
  }

  function addQuickItem(qi: QuickItemMoney) {
    const keys = parseJsonArray<string>(qi.productKeys);
    const names = products.filter(p => keys.includes(p.key)).map(p => p.name).join(" + ");
    addItem({ label: qi.label.replace(/\s*—.*$/, ""), description: names || undefined, quantity: 1, unitPrice: qi.totalPrice });
  }

  function addPackage(pkg: PackageMoney) {
    addItem({ label: pkg.name, description: pkg.description ?? undefined, quantity: 1, unitPrice: pkg.price });
  }

  function updateItem(id: string, patch: Partial<DraftItem>) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)));
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  async function submit() {
    if (!company) { toast.error("Select or add a client first"); return; }
    if (items.length === 0) { toast.error("Add at least one item"); return; }
    setCreating(true);
    try {
      const doc = await createDocumentAction({
        type: docType,
        companyId: company.id,
        contactId: contact?.id,
        dealId: initialDeal?.id,
        items: items.map(i => ({ productKey: i.productKey, label: i.label, description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
        discount: Number(discount) || 0,
        paymentTermsLabel: termsPreset,
        depositPercent,
        notes: notes || undefined,
        terms: terms || undefined,
        validUntilDays: Number(validUntilDays) || undefined,
      });
      setCreatedDoc(doc);
      toast.success(`${doc.number} created`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't create document");
    } finally {
      setCreating(false);
    }
  }

  if (createdDoc) {
    return <DocumentCreatedView doc={createdDoc} onCreateAnother={() => { setCreatedDoc(null); setItems([]); setCompany(null); }} />;
  }

  const previewValidUntil = new Date(Date.now() + (Number(validUntilDays) || 14) * 86_400_000);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader title={`New ${docType === "PROFORMA" ? "Proforma" : "Quote"}`} subtitle="Customer, items, pricing — done in under a minute" />

      {/* Mobile Edit/Preview toggle */}
      <div className="lg:hidden flex gap-1 p-1 rounded-[var(--radius-md)] mt-4 mb-2" style={{ background: "var(--surface-hover)" }}>
        {(["edit", "preview"] as const).map(t => (
          <button
            key={t}
            onClick={() => setMobileTab(t)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold capitalize"
            style={{ background: mobileTab === t ? "var(--surface)" : "transparent", color: mobileTab === t ? "var(--text)" : "var(--text-faint)" }}
          >
            {t === "edit" ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* LEFT — form */}
        <div className={`space-y-5 ${mobileTab === "preview" ? "hidden lg:block" : ""}`}>
          <div className="flex gap-1.5">
            {(["PROFORMA", "QUOTE"] as const).map(t => (
              <button key={t} onClick={() => setDocType(t)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: docType === t ? "var(--accent-soft)" : "var(--surface-hover)", color: docType === t ? "var(--accent)" : "var(--text-muted)" }}>
                {t === "PROFORMA" ? "Proforma" : "Quote"}
              </button>
            ))}
          </div>

          <Section title="Customer">
            <CompanyPicker value={company} onChange={setCompany} onCreateNew={() => setQuickClientOpen(true)} />
          </Section>

          <Section title="What are we charging for?">
            {quickItems.length > 0 && (
              <ChipRow label="My Quick Items">
                {quickItems.map(qi => (
                  <Chip key={qi.id} onClick={() => addQuickItem(qi)}>{qi.label}</Chip>
                ))}
              </ChipRow>
            )}
            {packages.length > 0 && (
              <ChipRow label="Packages">
                {packages.map(pkg => (
                  <Chip key={pkg.id} onClick={() => addPackage(pkg)}>{pkg.name} — {(pkg.price / 1000).toFixed(0)}K</Chip>
                ))}
              </ChipRow>
            )}
            <ChipRow label="Products">
              {quickChipProducts.map(p => (
                <Chip key={p.key} active={expandedKey === p.key} onClick={() => setExpandedKey(prev => (prev === p.key ? null : p.key))}>
                  {p.name}
                </Chip>
              ))}
            </ChipRow>
            {expandedKey && (
              <div className="flex flex-wrap gap-1.5 p-3 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                {parseJsonArray<number>(products.find(p => p.key === expandedKey)?.quickPrices).map(price => (
                  <Chip key={price} onClick={() => addProductPrice(products.find(p => p.key === expandedKey)!, price)}>
                    {(price / 1000).toFixed(0)}K
                  </Chip>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    placeholder="Custom"
                    className="w-20 h-7 px-2 rounded-full text-xs outline-none"
                    style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
                  />
                  <button
                    onClick={() => { const v = Number(customAmount); if (v > 0) addProductPrice(products.find(p => p.key === expandedKey)!, v); }}
                    className="h-7 px-2.5 rounded-full text-xs font-semibold" style={{ background: "var(--accent)", color: "white" }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className="space-y-2 mt-2">
                {items.map(it => (
                  <div key={it.id} className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{it.label}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => updateItem(it.id, { quantity: Math.max(1, it.quantity - 1) })} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--surface)" }}><Minus className="w-3 h-3" /></button>
                      <span className="text-xs w-5 text-center">{it.quantity}</span>
                      <button onClick={() => updateItem(it.id, { quantity: it.quantity + 1 })} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--surface)" }}><Plus className="w-3 h-3" /></button>
                    </div>
                    <input
                      type="number"
                      value={it.unitPrice}
                      onChange={e => updateItem(it.id, { unitPrice: Number(e.target.value) || 0 })}
                      className="w-24 h-7 px-2 rounded-md text-xs text-right outline-none shrink-0"
                      style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
                    />
                    <button onClick={() => removeItem(it.id)} className="shrink-0"><X className="w-3.5 h-3.5" style={{ color: "var(--text-faint)" }} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Label className="mb-0 shrink-0">Discount (KES)</Label>
              <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" className="h-8 text-xs" />
            </div>
          </Section>

          <Section title="Payment Terms">
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_TERMS.map(t => (
                <Chip key={t} active={termsPreset === t} onClick={() => setTermsPreset(t)}>{t}</Chip>
              ))}
            </div>
            {termsPreset === "Custom" && (
              <div className="flex items-center gap-2 mt-2">
                <Label className="mb-0 shrink-0">Deposit %</Label>
                <Input type="number" value={customDepositPct} onChange={e => setCustomDepositPct(e.target.value)} className="h-8 w-24 text-xs" />
              </div>
            )}
          </Section>

          <Section title="Details">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="valid-days">Valid for (days)</Label>
                <Input id="valid-days" type="number" value={validUntilDays} onChange={e => setValidUntilDays(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="pf-notes">Notes (optional)</Label>
              <Textarea id="pf-notes" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything specific to this proposal…" />
            </div>
            <div>
              <Label htmlFor="pf-terms">Terms</Label>
              <Textarea id="pf-terms" rows={2} value={terms} onChange={e => setTerms(e.target.value)} />
            </div>
          </Section>

          <Button size="lg" loading={creating} onClick={submit} className="w-full gap-2">
            <FileText className="w-4 h-4" /> Generate {docType === "PROFORMA" ? "Proforma" : "Quote"}
          </Button>
        </div>

        {/* RIGHT — live preview */}
        <div className={mobileTab === "edit" ? "hidden lg:block" : ""}>
          <div className="lg:sticky lg:top-4">
            <DocumentPreview
              type={docType}
              number={`TF-${docType === "PROFORMA" ? "PF" : "QT"}-${new Date().getFullYear()}-XXXX`}
              companyName={company?.name ?? ""}
              contactName={contact?.name}
              phone={company?.phone}
              email={company?.email}
              items={items}
              subtotal={totals.subtotal}
              discount={totals.discount}
              tax={tax}
              taxAmount={totals.taxAmount}
              total={totals.total}
              depositRequired={totals.depositRequired}
              balance={totals.balance}
              paymentTermsLabel={termsPreset}
              notes={notes}
              terms={terms}
              validUntil={previewValidUntil}
            />
          </div>
        </div>
      </div>

      <QuickClientDialog open={quickClientOpen} onOpenChange={setQuickClientOpen} onCreated={setCompany} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">{title}</p>
      {children}
    </div>
  );
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="text-[10px] font-semibold text-[var(--text-faint)] mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
      style={{ background: active ? "var(--accent-soft)" : "var(--surface-hover)", color: active ? "var(--accent)" : "var(--text-muted)" }}
    >
      {children}
    </button>
  );
}
