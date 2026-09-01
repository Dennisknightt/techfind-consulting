"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Company } from "@prisma/client";
import type { PaymentMoney, SalesDocumentMoney, ReceiptMoney } from "@/lib/os/moneyTypes";
import { CreditCard, Download, Undo2 } from "lucide-react";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Badge } from "@/components/os/ui/Badge";
import { Button } from "@/components/os/ui/Button";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/os/ui/Dialog";
import { formatKES } from "@/lib/os/money";
import { friendlyDate } from "@/lib/os/dates";
import { refundPaymentAction } from "@/server/actions/payments";

type PaymentRow = PaymentMoney & { company: Company | null; document: SalesDocumentMoney | null; receipt: ReceiptMoney | null };

const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  PENDING: "neutral", PROCESSING: "accent", SUCCESSFUL: "success",
  FAILED: "danger", CANCELLED: "danger", REVERSED: "danger",
  REFUNDED: "warning", PARTIALLY_REFUNDED: "warning", NEEDS_MATCHING: "warning",
};

function RefundDialog({ payment, open, onOpenChange, onRefunded }: {
  payment: PaymentRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefunded: (payment: PaymentRow) => void;
}) {
  const remaining = payment.amount - payment.refundedAmount;
  const [amount, setAmount] = useState(String(remaining));
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      const result = await refundPaymentAction(payment.id, Number(amount), reason);
      if (result.error) { toast.error(result.error); return; }
      const refundedAmount = payment.refundedAmount + Number(amount);
      const status = refundedAmount >= payment.amount ? "REFUNDED" : "PARTIALLY_REFUNDED";
      onRefunded({ ...payment, refundedAmount, status });
      toast.success("Refund processed");
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Refund payment</DialogTitle>
        <DialogDescription>
          {payment.reference} · {payment.company?.name ?? "Unknown client"} · up to {formatKES(remaining)} refundable.
        </DialogDescription>
        <div className="space-y-3">
          <div>
            <Label htmlFor="refund-amount">Amount (KES)</Label>
            <Input id="refund-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} max={remaining} min={0} />
          </div>
          <div>
            <Label htmlFor="refund-reason">Reason (required, kept on the audit trail)</Label>
            <Textarea id="refund-reason" rows={2} value={reason} onChange={e => setReason(e.target.value)} placeholder="Client cancelled, duplicate charge, ..." />
          </div>
        </div>
        <Button
          variant="danger" className="w-full mt-4" loading={saving}
          disabled={!reason.trim() || !Number(amount) || Number(amount) <= 0 || Number(amount) > remaining}
          onClick={submit}
        >
          Confirm refund
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function PaymentsList({ payments: initialPayments, canRefund }: { payments: PaymentRow[]; canRefund: boolean }) {
  const [payments, setPayments] = useState(initialPayments);
  const [refundTarget, setRefundTarget] = useState<PaymentRow | null>(null);
  const received = payments.filter(p => p.status === "SUCCESSFUL" || p.status === "PARTIALLY_REFUNDED").reduce((s, p) => s + p.amount, 0);

  function onRefunded(updated: PaymentRow) {
    setPayments(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Payments" subtitle={`${payments.length} transactions · ${formatKES(received, { compact: true })} received`} />

      {payments.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <CreditCard className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">No payments yet</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">Payments made against proformas will show up here automatically.</p>
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--surface-hover)" }}>
                {["Reference", "Client", "Document", "Method", "Amount", "Status", "Date", ""].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const refundable = (p.status === "SUCCESSFUL" || p.status === "PARTIALLY_REFUNDED") && p.amount - p.refundedAmount > 0;
                return (
                  <tr key={p.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-3 text-xs text-[var(--text-faint)]">{p.reference}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text)]">{p.company?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      {p.document ? <Link href={`/app/quotes/${p.document.id}`} className="hover:underline" style={{ color: "var(--accent)" }}>{p.document.number}</Link> : "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{p.method}</td>
                    <td className="px-4 py-3 font-bold text-[var(--text)]">
                      {formatKES(p.amount, { compact: true })}
                      {p.refundedAmount > 0 && (
                        <span className="block text-[10px] font-normal text-[var(--text-faint)]">
                          {formatKES(p.refundedAmount, { compact: true })} refunded
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3"><Badge tone={STATUS_TONE[p.status] ?? "neutral"}>{p.status.replace(/_/g, " ")}</Badge></td>
                    <td className="px-4 py-3 text-xs text-[var(--text-faint)]">{friendlyDate(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.receipt && (
                          <a href={`/api/os/receipts/${p.receipt.id}/pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs hover:underline" style={{ color: "var(--accent)" }}>
                            <Download className="w-3 h-3" /> Receipt
                          </a>
                        )}
                        {canRefund && refundable && (
                          <button
                            onClick={() => setRefundTarget(p)}
                            className="flex items-center gap-1 text-xs hover:underline"
                            style={{ color: "var(--danger)" }}
                          >
                            <Undo2 className="w-3 h-3" /> Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {refundTarget && (
        <RefundDialog
          payment={refundTarget}
          open={!!refundTarget}
          onOpenChange={open => { if (!open) setRefundTarget(null); }}
          onRefunded={updated => { onRefunded(updated); setRefundTarget(null); }}
        />
      )}
    </div>
  );
}
