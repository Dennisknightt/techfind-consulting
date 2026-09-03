"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { Button } from "@/components/os/ui/Button";
import { Badge } from "@/components/os/ui/Badge";
import { Switch } from "@/components/os/ui/Switch";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/os/ui/Dialog";
import { formatKES } from "@/lib/os/money";
import {
  type CatalogueData,
  type CatalogueProduct,
  type CatalogueQuickItem,
  type CataloguePackage,
  type QuickItemInput,
  type PackageInput,
  updateProductAction,
  createQuickItemAction,
  updateQuickItemAction,
  deleteQuickItemAction,
  createPackageAction,
  updatePackageAction,
  deletePackageAction,
} from "@/server/actions/catalogue";

function ProductRow({ product, canEdit, onSaved }: { product: CatalogueProduct; canEdit: boolean; onSaved: (p: CatalogueProduct) => void }) {
  const [prices, setPrices] = useState(product.quickPrices.join(", "));
  const [isQuickChip, setIsQuickChip] = useState(product.isQuickChip);
  const [active, setActive] = useState(product.active);
  const [saving, setSaving] = useState(false);
  const dirty = prices !== product.quickPrices.join(", ") || isQuickChip !== product.isQuickChip || active !== product.active;

  async function save() {
    const quickPrices = prices.split(",").map(s => Number(s.trim())).filter(n => Number.isFinite(n) && n >= 0);
    setSaving(true);
    try {
      const result = await updateProductAction(product.id, { quickPrices, isQuickChip, active });
      if (result.error) { toast.error(result.error); return; }
      onSaved({ ...product, quickPrices, isQuickChip, active });
      toast.success(`${product.name} updated`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2.5 border-b border-[var(--border)] last:border-0">
      <p className="text-sm font-medium text-[var(--text)] w-40 shrink-0 truncate">{product.name}</p>
      {canEdit ? (
        <Input
          value={prices} onChange={e => setPrices(e.target.value)} placeholder="e.g. 100000, 150000"
          className="flex-1 h-8 text-xs"
        />
      ) : (
        <p className="flex-1 text-xs text-[var(--text-faint)]">
          {product.quickPrices.length ? product.quickPrices.map(p => formatKES(p)).join(" · ") : "No quick prices"}
        </p>
      )}
      {canEdit && (
        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)]">
            <Switch checked={isQuickChip} onCheckedChange={setIsQuickChip} /> Quick chip
          </label>
          <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)]">
            <Switch checked={active} onCheckedChange={setActive} /> Active
          </label>
          <Button size="sm" variant="secondary" disabled={!dirty} loading={saving} onClick={save}>Save</Button>
        </div>
      )}
      {!canEdit && (
        <div className="flex items-center gap-2 shrink-0">
          {product.isQuickChip && <Badge tone="accent">Quick chip</Badge>}
          <Badge tone={product.active ? "success" : "neutral"}>{product.active ? "Active" : "Inactive"}</Badge>
        </div>
      )}
    </div>
  );
}

function ProductKeysPicker({ products, selected, onChange }: { products: CatalogueProduct[]; selected: string[]; onChange: (keys: string[]) => void }) {
  function toggle(key: string) {
    onChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key]);
  }
  return (
    <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-1.5 p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-hover)]">
      {products.map(p => (
        <label key={p.key} className="flex items-center gap-1.5 text-xs text-[var(--text)] cursor-pointer">
          <input type="checkbox" checked={selected.includes(p.key)} onChange={() => toggle(p.key)} className="rounded accent-[var(--accent)]" />
          {p.name}
        </label>
      ))}
    </div>
  );
}

function QuickItemDialog({
  products, existing, open, onOpenChange, onSaved,
}: {
  products: CatalogueProduct[];
  existing: CatalogueQuickItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (item: CatalogueQuickItem) => void;
}) {
  const [label, setLabel] = useState(existing?.label ?? "");
  const [productKeys, setProductKeys] = useState<string[]>(existing?.productKeys ?? []);
  const [totalPrice, setTotalPrice] = useState(existing ? String(existing.totalPrice) : "");
  const [recurring, setRecurring] = useState(existing?.recurring ?? false);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const input: QuickItemInput = { label, productKeys, totalPrice: Number(totalPrice) || 0, recurring };
    setSaving(true);
    try {
      if (existing) {
        const result = await updateQuickItemAction(existing.id, input);
        if (result.error) { toast.error(result.error); return; }
        onSaved({ ...existing, ...input });
      } else {
        const result = await createQuickItemAction(input);
        if (result.error || !result.item) { toast.error(result.error ?? "Couldn't create quick item"); return; }
        onSaved(result.item);
      }
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{existing ? "Edit quick item" : "New quick item"}</DialogTitle>
        <DialogDescription>A one-click bundle for the Quick Proforma Generator.</DialogDescription>
        <div className="space-y-3">
          <div>
            <Label htmlFor="qi-label">Label</Label>
            <Input id="qi-label" value={label} onChange={e => setLabel(e.target.value)} placeholder="Website + WA — 200K" />
          </div>
          <div>
            <Label>Products</Label>
            <ProductKeysPicker products={products} selected={productKeys} onChange={setProductKeys} />
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <Label htmlFor="qi-price">Total price (KES)</Label>
              <Input id="qi-price" type="number" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} placeholder="150000" />
            </div>
            <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] pb-2.5">
              <Switch checked={recurring} onCheckedChange={setRecurring} /> Recurring (monthly)
            </label>
          </div>
        </div>
        <Button className="w-full mt-4" loading={saving} onClick={submit}>{existing ? "Save changes" : "Create"}</Button>
      </DialogContent>
    </Dialog>
  );
}

function PackageDialog({
  products, existing, open, onOpenChange, onSaved,
}: {
  products: CatalogueProduct[];
  existing: CataloguePackage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (pkg: CataloguePackage) => void;
}) {
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [productKeys, setProductKeys] = useState<string[]>(existing?.productKeys ?? []);
  const [price, setPrice] = useState(existing ? String(existing.price) : "");
  const [saving, setSaving] = useState(false);

  async function submit() {
    const input: PackageInput = { name, description, productKeys, price: Number(price) || 0 };
    setSaving(true);
    try {
      if (existing) {
        const result = await updatePackageAction(existing.id, input);
        if (result.error) { toast.error(result.error); return; }
        onSaved({ ...existing, ...input, description: input.description || null });
      } else {
        const result = await createPackageAction(input);
        if (result.error || !result.pkg) { toast.error(result.error ?? "Couldn't create package"); return; }
        onSaved(result.pkg);
      }
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{existing ? "Edit package" : "New package"}</DialogTitle>
        <DialogDescription>A named bundle of products at a fixed price.</DialogDescription>
        <div className="space-y-3">
          <div>
            <Label htmlFor="pkg-name">Name</Label>
            <Input id="pkg-name" value={name} onChange={e => setName(e.target.value)} placeholder="Digital Starter" />
          </div>
          <div>
            <Label htmlFor="pkg-desc">Description (optional)</Label>
            <Textarea id="pkg-desc" rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Website + WhatsApp Automation" />
          </div>
          <div>
            <Label>Products</Label>
            <ProductKeysPicker products={products} selected={productKeys} onChange={setProductKeys} />
          </div>
          <div>
            <Label htmlFor="pkg-price">Price (KES)</Label>
            <Input id="pkg-price" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="200000" />
          </div>
        </div>
        <Button className="w-full mt-4" loading={saving} onClick={submit}>{existing ? "Save changes" : "Create"}</Button>
      </DialogContent>
    </Dialog>
  );
}

export function CatalogueSettings({ initial, canEdit }: { initial: CatalogueData; canEdit: boolean }) {
  const [products, setProducts] = useState(initial.products);
  const [quickItems, setQuickItems] = useState(initial.quickItems);
  const [packages, setPackages] = useState(initial.packages);

  const [quickItemDialog, setQuickItemDialog] = useState<{ open: boolean; existing: CatalogueQuickItem | null }>({ open: false, existing: null });
  const [packageDialog, setPackageDialog] = useState<{ open: boolean; existing: CataloguePackage | null }>({ open: false, existing: null });

  const productsByCategory = products.reduce<Record<string, CatalogueProduct[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  async function removeQuickItem(item: CatalogueQuickItem) {
    if (!confirm(`Delete "${item.label}"?`)) return;
    const result = await deleteQuickItemAction(item.id);
    if (result.error) { toast.error(result.error); return; }
    setQuickItems(prev => prev.filter(q => q.id !== item.id));
    toast.success("Quick item deleted");
  }

  async function removePackage(pkg: CataloguePackage) {
    if (!confirm(`Delete "${pkg.name}"?`)) return;
    const result = await deletePackageAction(pkg.id);
    if (result.error) { toast.error(result.error); return; }
    setPackages(prev => prev.filter(p => p.id !== pkg.id));
    toast.success("Package deleted");
  }

  return (
    <div className="space-y-5">
      {!canEdit && (
        <p className="text-xs px-3 py-2 rounded-[var(--radius-md)]" style={{ background: "var(--warning-soft)", color: "var(--warning)" }}>
          Only Super Admins can configure the catalogue. You&rsquo;re viewing the current setup.
        </p>
      )}

      <Card>
        <CardHeader><CardTitle>Products &amp; quick prices</CardTitle></CardHeader>
        <CardContent>
          {Object.entries(productsByCategory).map(([category, items]) => (
            <div key={category} className="mb-4 last:mb-0">
              <p className="text-[11px] font-semibold tracking-wide text-[var(--text-faint)] uppercase mb-1">{category.replace(/_/g, " ")}</p>
              {items.map(p => (
                <ProductRow key={p.id} product={p} canEdit={canEdit} onSaved={updated => setProducts(prev => prev.map(x => x.id === updated.id ? updated : x))} />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quick items</CardTitle>
          {canEdit && (
            <Button size="sm" onClick={() => setQuickItemDialog({ open: true, existing: null })}>
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-1">
          {quickItems.length === 0 && <p className="text-xs text-[var(--text-faint)]">No quick items yet.</p>}
          {quickItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text)] truncate">{item.label}</p>
                <p className="text-xs text-[var(--text-faint)]">{formatKES(item.totalPrice)}{item.recurring ? " / mo" : ""}</p>
              </div>
              {canEdit && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => setQuickItemDialog({ open: true, existing: item })}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => removeQuickItem(item)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Packages</CardTitle>
          {canEdit && (
            <Button size="sm" onClick={() => setPackageDialog({ open: true, existing: null })}>
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-1">
          {packages.length === 0 && <p className="text-xs text-[var(--text-faint)]">No packages yet.</p>}
          {packages.map(pkg => (
            <div key={pkg.id} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text)] truncate">{pkg.name}</p>
                <p className="text-xs text-[var(--text-faint)] truncate">{pkg.description ?? ""} {pkg.description ? "· " : ""}{formatKES(pkg.price)}</p>
              </div>
              {canEdit && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => setPackageDialog({ open: true, existing: pkg })}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => removePackage(pkg)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {quickItemDialog.open && (
        <QuickItemDialog
          products={products}
          existing={quickItemDialog.existing}
          open={quickItemDialog.open}
          onOpenChange={open => setQuickItemDialog(prev => ({ ...prev, open }))}
          onSaved={item => setQuickItems(prev => quickItemDialog.existing ? prev.map(q => q.id === item.id ? item : q) : [...prev, { ...item, id: item.id || crypto.randomUUID() }])}
        />
      )}
      {packageDialog.open && (
        <PackageDialog
          products={products}
          existing={packageDialog.existing}
          open={packageDialog.open}
          onOpenChange={open => setPackageDialog(prev => ({ ...prev, open }))}
          onSaved={pkg => setPackages(prev => packageDialog.existing ? prev.map(p => p.id === pkg.id ? pkg : p) : [...prev, { ...pkg, id: pkg.id || crypto.randomUUID() }])}
        />
      )}
    </div>
  );
}
