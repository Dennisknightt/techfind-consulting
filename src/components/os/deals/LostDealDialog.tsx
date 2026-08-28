"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/os/ui/Dialog";
import { Button } from "@/components/os/ui/Button";
import { markDealLostAction } from "@/server/actions/deals";
import { LOST_REASONS } from "@/lib/os/pipeline";

export function LostDealDialog({
  dealId,
  dealTitle,
  open,
  onOpenChange,
  onLost,
}: {
  dealId: string | null;
  dealTitle?: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onLost: (dealId: string, reason: string) => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!dealId || !reason) return;
    setSaving(true);
    try {
      await markDealLostAction(dealId, reason);
      onLost(dealId, reason);
      onOpenChange(false);
      setReason(null);
      toast("Deal marked as lost", { description: reason });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update this deal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Why was this deal lost?</DialogTitle>
        <DialogDescription>{dealTitle ? `${dealTitle} — this` : "This"} helps Intelligence spot patterns later.</DialogDescription>
        <div className="grid grid-cols-2 gap-2">
          {LOST_REASONS.map(r => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className="px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-left font-medium transition-colors"
              style={{
                background: reason === r ? "var(--danger-soft)" : "var(--surface-hover)",
                color: reason === r ? "var(--danger)" : "var(--text-muted)",
                border: `1px solid ${reason === r ? "var(--danger)" : "transparent"}`,
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="danger" disabled={!reason} loading={saving} onClick={submit}>Mark Lost</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
