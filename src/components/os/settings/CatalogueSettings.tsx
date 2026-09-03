"use client";

import { useState } from "react";
import type { Product, QuickItem, Package as PackageModel } from "@prisma/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { Badge } from "@/components/os/ui/Badge";
import { Switch } from "@/components/os/ui/Switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { formatKES } from "@/lib/os/money";
import { parseJsonArray } from "@/server/json";
import {
  updateProductAction, createQuickItemAction, updateQuickItemAction, deleteQuickItemAction,
  createPackageAction, updatePackageAction, deletePackageAction,
  type QuickItemInput, type PackageInput,
} from "@/server/actions/catalogue";

export function CatalogueSettings({
  products, quickItems, packages, canEdit,
}: {
  products: Product[];
  quickItems: QuickItem[];
  packages: PackageModel[];
  canEdit: boolean;
}) {
  return (
    <div className="space-y-5">
      {!canEdit && (
        <p className="text-xs px-3 py-2 rounded-[var(--radius-md)]" style={{ background: "var(--warning-soft)", color: "var(--warning)" }}>
          Only Super Admins and Management can configure the catalogue.
        </p>
      )}
      <ProductsCard products={products} canEdit={canEdit} />
      <QuickItemsCard quickItems={quickItems} products={products} canEdit={canEdit} />
      <PackagesCard packages={packages} products={products} canEdit={canEdit} />
    </div>
  );
}

function ProductsCard({ products, canEdit }: { products: Product[]; canEdit: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle>Products</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {products.map(p => <ProductRow key={p.id} product={p} canEdit={canEdit} />)}
      </CardContent>
    </Card>
  );
}

function ProductRow({ product, canEdit }: { product: Product; canEdit: boolean }) {
  const [active, setActive] = useState(product.active);
  const [isQuickChip, setIsQuickChip] = useState(product.isQuickChip);
  const [prices, setPrices] = useState<number[]>(parseJsonArray<number>(product.quickPrices));
  const [newPrice, setNewPrice] = useState("");
  const [saving, setSaving] = useState(false);

  async function persist(next: { active?: boolean; isQuickChip?: boolean; quickPrices?: number[] }) {
    setSaving(true);
    try {
      await updateProductAction(product.id, {
        active: next.active ?? active,
        isQuickChip: next.isQuickChip ?? isQuickChip,
        quickPrices: next.quickPrices ?? prices,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update");
    } finally {
      setSaving(false);
    }
  }

  function addPrice() {
    const n = Number(newPrice);
    if (!Number.isFinite(n) || n <= 0) { toast.error("Enter a valid price"); return; }
    const next = [...prices, n];
    setPrices(next);
    setNewPrice("");
    persist({ quickPrices: next });
  }

  function removePrice(i: number) {
    const next = prices.filter((_, idx) => idx !== i);
    setPrices(next);
    persist({ quickPrices: next });
  }

  return (
    <div className="rounded-[var(--radius-md)] p-3.5" style={{ background: "var(--surface-hover)" }}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{product.name}</p>
          <p className="os-text-meta">{product.category}{product.isRecurring ? " · recurring" : ""}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            Quick chip
            <Switch checked={isQuickChip} disabled={!canEdit || saving} onCheckedChange={v => { setIsQuickChip(v); persist({ isQuickChip: v }); }} />
          </label>
          <label className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            Active
            <Switch checked={active} disabled={!canEdit || saving} onCheckedChange={v => { setActive(v); persist({ active: v }); }} />
          </label>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
        {prices.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ background: "var(--surface)", color: "var(--text)" }}>
            {formatKES(p, { compact: true })}
            {canEdit && <button onClick={() => removePrice(i)} aria-label="Remove price"><X className="w-3 h-3" style={{ color: "var(--text-faint)" }} /></button>}
          </span>
        ))}
        {canEdit && (
          <div className="flex items-center gap-1">
            <Input
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addPrice(); }}
              placeholder="Add price"
              inputMode="numeric"
              className="h-7 w-24 text-xs"
            />
            <Button size="icon" variant="ghost" onClick={addPrice} className="h-7 w-7" aria-label="Add price"><Plus className="w-3.5 h-3.5" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductKeyPicker({ products, selected, onChange }: { products: Product[]; selected: string[]; onChange: (keys: string[]) => void }) {
  function toggle(key: string) {
    onChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key]);
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {products.map(p => (
        <button
          key={p.key}
          type="button"
          onClick={() => toggle(p.key)}
          className="os-press px-2.5 py-1 rounded-full text-xs font-medium"
          style={selected.includes(p.key)
            ? { background: "var(--accent)", color: "white" }
            : { background: "var(--surface-hover)", color: "var(--text-muted)" }}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

function QuickItemsCard({ quickItems, products, canEdit }: { quickItems: QuickItem[]; products: Product[]; canEdit: boolean }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<QuickItem | null>(null);

  async function remove(id: string) {
    try {
      await deleteQuickItemAction(id);
      toast.success("Removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't remove");
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Quick Items</CardTitle>
        {canEdit && <Button size="sm" onClick={() => setCreating(true)} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> New</Button>}
      </CardHeader>
      <CardContent>
        {quickItems.length === 0 ? (
          <p className="os-text-meta">No quick items yet.</p>
        ) : (
          <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
            {quickItems.map(qi => (
              <div key={qi.id} className="flex items-center gap-3 px-4 py-3 flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{qi.label}</p>
                  <p className="os-text-meta">{parseJsonArray<string>(qi.productKeys).join(", ") || "—"}</p>
                </div>
                <span className="os-text-number text-sm" style={{ color: "var(--text)" }}>
                  {formatKES(qi.totalPrice, { compact: true })}{qi.recurring ? "/mo" : ""}
                </span>
                {canEdit && (
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(qi)} aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(qi.id)} aria-label="Delete" style={{ color: "var(--danger)" }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <QuickItemSheet open={creating} onOpenChange={setCreating} products={products} mode="create" />
      {editing && <QuickItemSheet open onOpenChange={() => setEditing(null)} products={products} mode="edit" item={editing} />}
    </Card>
  );
}

function QuickItemSheet({
  open, onOpenChange, products, mode, item,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: Product[];
  mode: "create" | "edit";
  item?: QuickItem;
}) {
  const [label, setLabel] = useState(item?.label ?? "");
  const [price, setPrice] = useState(item ? String(item.totalPrice) : "");
  const [recurring, setRecurring] = useState(item?.recurring ?? false);
  const [productKeys, setProductKeys] = useState<string[]>(item ? parseJsonArray<string>(item.productKeys) : []);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const input: QuickItemInput = { label, productKeys, totalPrice: Number(price), recurring };
    setSaving(true);
    try {
      if (mode === "create") await createQuickItemAction(input);
      else await updateQuickItemAction(item!.id, input);
      toast.success(mode === "create" ? "Quick item added" : "Updated");
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader><SheetTitle>{mode === "create" ? "New Quick Item" : `Edit ${item?.label}`}</SheetTitle></SheetHeader>
        <SheetBody className="space-y-3">
          <div>
            <Label>Label</Label>
            <Input value={label} onChange={e => setLabel(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Total price (KES)</Label>
            <Input value={price} onChange={e => setPrice(e.target.value)} inputMode="numeric" className="mt-1.5" />
          </div>
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
            <Switch checked={recurring} onCheckedChange={setRecurring} /> Recurring (monthly)
          </label>
          <div>
            <Label>Related products</Label>
            <div className="mt-1.5"><ProductKeyPicker products={products} selected={productKeys} onChange={setProductKeys} /></div>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={submit} loading={saving} className="gap-1.5"><Check className="w-3.5 h-3.5" /> Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function PackagesCard({ packages, products, canEdit }: { packages: PackageModel[]; products: Product[]; canEdit: boolean }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<PackageModel | null>(null);

  async function remove(id: string) {
    try {
      await deletePackageAction(id);
      toast.success("Removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't remove");
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Packages</CardTitle>
        {canEdit && <Button size="sm" onClick={() => setCreating(true)} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> New</Button>}
      </CardHeader>
      <CardContent>
        {packages.length === 0 ? (
          <p className="os-text-meta">No packages yet.</p>
        ) : (
          <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
            {packages.map(pkg => (
              <div key={pkg.id} className="flex items-center gap-3 px-4 py-3 flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{pkg.name}</p>
                  <p className="os-text-meta">{pkg.description || parseJsonArray<string>(pkg.productKeys).join(", ") || "—"}</p>
                </div>
                <span className="os-text-number text-sm" style={{ color: "var(--text)" }}>{formatKES(pkg.price, { compact: true })}</span>
                {canEdit && (
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(pkg)} aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(pkg.id)} aria-label="Delete" style={{ color: "var(--danger)" }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <PackageSheet open={creating} onOpenChange={setCreating} products={products} mode="create" />
      {editing && <PackageSheet open onOpenChange={() => setEditing(null)} products={products} mode="edit" pkg={editing} />}
    </Card>
  );
}

function PackageSheet({
  open, onOpenChange, products, mode, pkg,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: Product[];
  mode: "create" | "edit";
  pkg?: PackageModel;
}) {
  const [name, setName] = useState(pkg?.name ?? "");
  const [description, setDescription] = useState(pkg?.description ?? "");
  const [price, setPrice] = useState(pkg ? String(pkg.price) : "");
  const [productKeys, setProductKeys] = useState<string[]>(pkg ? parseJsonArray<string>(pkg.productKeys) : []);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const input: PackageInput = { name, description, productKeys, price: Number(price) };
    setSaving(true);
    try {
      if (mode === "create") await createPackageAction(input);
      else await updatePackageAction(pkg!.id, input);
      toast.success(mode === "create" ? "Package added" : "Updated");
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader><SheetTitle>{mode === "create" ? "New Package" : `Edit ${pkg?.name}`}</SheetTitle></SheetHeader>
        <SheetBody className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Price (KES)</Label>
            <Input value={price} onChange={e => setPrice(e.target.value)} inputMode="numeric" className="mt-1.5" />
          </div>
          <div>
            <Label>Included products</Label>
            <div className="mt-1.5"><ProductKeyPicker products={products} selected={productKeys} onChange={setProductKeys} /></div>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={submit} loading={saving} className="gap-1.5"><Check className="w-3.5 h-3.5" /> Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
