"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, FileText, Download, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { Button } from "@/components/os/ui/Button";
import { Badge } from "@/components/os/ui/Badge";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { formatKES } from "@/lib/os/money";
import { friendlyDate } from "@/lib/os/dates";
import { parseManualPaymentMeta } from "@/lib/os/paymentSmsParse";
import { updatePaymentAction, deletePaymentAction } from "@/server/actions/payments";
import { STATUS_TONE, type PaymentRow } from "./PaymentsList";

const METHODS = [
  { value: "MPESA", label: "M-Pesa" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
] as const;

function toDateInputValue(d: Date | string) {
  return new Date(d).toISOString().slice(0, 10);
}

export function PaymentDetailSheet({ payment, open, onOpenChange, canEdit, onChanged, onDeleted }: {
  payment: PaymentRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  canEdit: boolean;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("MPESA");
  const [transactionCode, setTransactionCode] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [paidAt, setPaidAt] = useState(toDateInputValue(new Date()));
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!payment) return;
    const meta = parseManualPaymentMeta(payment.gatewayRaw);
    setAmount(String(payment.amount));
    setMethod(payment.method);
    setTransactionCode(payment.gatewayReference ?? "");
    setPayerName(meta.payerName ?? "");
    setPayerPhone(meta.payerPhone ?? "");
    setPaidAt(toDateInputValue(payment.paidAt ?? payment.createdAt));
    setNotes(payment.notes ?? "");
    setEditing(false);
  }, [payment]);

  if (!payment) return null;
  const meta = parseManualPaymentMeta(payment.gatewayRaw);
  const isManual = payment.gateway === "MANUAL";

  async function save() {
    if (!payment) return;
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) { toast.error("Enter a valid amount"); return; }
    setSaving(true);
    try {
      await updatePaymentAction(payment.id, {
        amount: isManual ? numAmount : undefined,
        method,
        transactionCode: transactionCode || null,
        payerName: payerName || null,
        payerPhone: payerPhone || null,
        paidAt: new Date(`${paidAt}T00:00:00`),
        notes: notes || null,
      });
      toast.success("Payment updated");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update this payment");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!payment) return;
    const warning = payment.status === "SUCCESSFUL" && payment.documentId
      ? `Delete this ${formatKES(payment.amount)} payment? The invoice's balance will be restored. This won't undo a deal marked Won or a project it may have started.`
      : `Delete this ${formatKES(payment.amount)} payment? This can't be undone.`;
    if (!confirm(warning)) return;
    setDeleting(true);
    try {
      await deletePaymentAction(payment.id);
      toast.success("Payment deleted");
      onDeleted();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't delete this payment");
      setDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{editing ? "Edit Payment" : payment.reference}</SheetTitle>
        </SheetHeader>

        {editing ? (
          <>
            <SheetBody className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ep-amount">Amount (KES)</Label>
                  <Input
                    id="ep-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    disabled={!isManual} className="mt-1.5"
                  />
                  {!isManual && <p className="os-text-meta mt-1">Gateway-confirmed — amount can't be edited</p>}
                </div>
                <div>
                  <Label htmlFor="ep-date">Date received</Label>
                  <Input id="ep-date" type="date" value={paidAt} onChange={e => setPaidAt(e.target.value)} className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label>Method</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {METHODS.map(m => (
                    <button
                      key={m.value} type="button" onClick={() => setMethod(m.value)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                      style={{ background: method === m.value ? "var(--accent-soft)" : "var(--surface-hover)", color: method === m.value ? "var(--accent)" : "var(--text-muted)" }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ep-code">Transaction code</Label>
                  <Input id="ep-code" value={transactionCode} onChange={e => setTransactionCode(e.target.value.toUpperCase())} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="ep-phone">Payer phone</Label>
                  <Input id="ep-phone" value={payerPhone} onChange={e => setPayerPhone(e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="ep-payer">Payer name</Label>
                <Input id="ep-payer" value={payerName} onChange={e => setPayerName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="ep-notes">Notes</Label>
                <Textarea id="ep-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="mt-1.5" />
              </div>
            </SheetBody>
            <SheetFooter>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button loading={saving} onClick={save}>Save changes</Button>
            </SheetFooter>
          </>
        ) : (
          <>
            <SheetBody className="space-y-5">
              <div>
                <p className="os-text-number text-3xl" style={{ color: "var(--text)" }}>{formatKES(payment.amount)}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge tone={STATUS_TONE[payment.status] ?? "neutral"}>{payment.status.replace(/_/g, " ")}</Badge>
                  <span className="os-text-meta">{payment.method}{isManual ? " · Manually recorded" : ` · ${payment.gateway}`}</span>
                </div>
              </div>

              <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
                {payment.gatewayReference && <InfoRow label="Transaction code" value={payment.gatewayReference} />}
                {meta.payerName && <InfoRow label="Payer" value={meta.payerName} />}
                {meta.payerPhone && <InfoRow label="Payer phone" value={meta.payerPhone} />}
                <InfoRow label="Date received" value={friendlyDate(payment.paidAt ?? payment.createdAt)} />
                {payment.notes && <InfoRow label="Notes" value={payment.notes} />}
              </div>

              <div className="space-y-2">
                {payment.company && (
                  <Link href={`/app/clients/${payment.company.id}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
                    <Building2 className="w-3.5 h-3.5" /> {payment.company.name}
                  </Link>
                )}
                {payment.document && (
                  <Link href={`/app/quotes/${payment.document.id}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
                    <FileText className="w-3.5 h-3.5" /> {payment.document.number}
                  </Link>
                )}
                {payment.receipt && (
                  <a
                    href={`/api/os/receipts/${payment.receipt.id}/pdf`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}
                  >
                    <Download className="w-3.5 h-3.5" /> Download receipt
                  </a>
                )}
              </div>
            </SheetBody>
            {canEdit && (
              <SheetFooter className="justify-between">
                <Button variant="ghost" loading={deleting} onClick={remove} className="gap-1.5" style={{ color: "var(--danger)" }}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
                <Button variant="secondary" onClick={() => setEditing(true)} className="gap-1.5">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Button>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="os-text-meta">{label}</span>
      <span className="text-sm font-medium text-right" style={{ color: "var(--text)" }}>{value}</span>
    </div>
  );
}
