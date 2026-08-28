"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { Input, Label } from "@/components/os/ui/Input";
import { Button } from "@/components/os/ui/Button";
import type { TaxConfig, TaxMode } from "@/lib/os/documentMath";
import { updateTaxConfigAction } from "@/server/actions/settings";

const MODES: { value: TaxMode; label: string; hint: string }[] = [
  { value: "EXCLUSIVE", label: "Tax Exclusive", hint: "Tax is added on top of item prices" },
  { value: "INCLUSIVE", label: "Tax Inclusive", hint: "Item prices already include tax" },
  { value: "NONE", label: "No Tax", hint: "No tax applied to any document" },
];

export function TaxSettings({ initial, canEdit }: { initial: TaxConfig; canEdit: boolean }) {
  const [mode, setMode] = useState<TaxMode>(initial.mode);
  const [rate, setRate] = useState(String(initial.rate));
  const [label, setLabel] = useState(initial.label);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await updateTaxConfigAction({ mode, rate: Number(rate) || 0, label: label || "VAT" });
      toast.success("Tax configuration updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Tax Configuration</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {!canEdit && (
          <p className="text-xs px-3 py-2 rounded-[var(--radius-md)]" style={{ background: "var(--warning-soft)", color: "var(--warning)" }}>
            Only Super Admins can change tax configuration. You&rsquo;re viewing the current settings.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {MODES.map(m => (
            <button
              key={m.value}
              disabled={!canEdit}
              onClick={() => setMode(m.value)}
              className="text-left px-4 py-3 rounded-[var(--radius-md)] transition-colors disabled:opacity-60"
              style={{ background: mode === m.value ? "var(--accent-soft)" : "var(--surface-hover)", border: `1px solid ${mode === m.value ? "var(--accent)" : "transparent"}` }}
            >
              <p className="text-sm font-semibold" style={{ color: mode === m.value ? "var(--accent)" : "var(--text)" }}>{m.label}</p>
              <p className="text-[11px] text-[var(--text-faint)] mt-0.5">{m.hint}</p>
            </button>
          ))}
        </div>

        {mode !== "NONE" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tax-label">Tax label</Label>
              <Input id="tax-label" value={label} onChange={e => setLabel(e.target.value)} disabled={!canEdit} placeholder="VAT" />
            </div>
            <div>
              <Label htmlFor="tax-rate">Rate (%)</Label>
              <Input id="tax-rate" type="number" value={rate} onChange={e => setRate(e.target.value)} disabled={!canEdit} placeholder="16" />
            </div>
          </div>
        )}

        {canEdit && <Button size="sm" loading={saving} onClick={save}>Save</Button>}
      </CardContent>
    </Card>
  );
}
