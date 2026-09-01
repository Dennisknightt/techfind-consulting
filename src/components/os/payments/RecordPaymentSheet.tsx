"use client";

import { useState } from "react";
import type { Company, SalesDocument } from "@prisma/client";
import { Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { Button } from "@/components/os/ui/Button";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { CompanyPicker } from "@/components/os/common/CompanyPicker";
import { formatKES } from "@/lib/os/money";
import { parseMpesaMessage, looksLikeMpesaMessage } from "@/lib/os/mpesaParse";
import { recordManualPaymentAction, getOutstandingDocumentsAction, type ManualPaymentInput } from "@/server/actions/payments";
import type { Payment } from "@prisma/client";

const METHODS = [
  { value: "MPESA", label: "M-Pesa" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
] as const;

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function RecordPaymentSheet({ open, onOpenChange, onRecorded }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onRecorded: (payment: Payment) => void;
}) {
  const [rawMessage, setRawMessage] = useState("");
  const [parsed, setParsed] = useState(false);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>("MPESA");
  const [transactionCode, setTransactionCode] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [paidAt, setPaidAt] = useState(toDateInputValue(new Date()));
  const [notes, setNotes] = useState("");

  const [company, setCompany] = useState<Company | null>(null);
  const [outstanding, setOutstanding] = useState<SalesDocument[]>([]);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [saving, setSaving] = useState(false);

  function reset() {
    setRawMessage(""); setParsed(false);
    setAmount(""); setMethod("MPESA"); setTransactionCode("");
    setPayerName(""); setPayerPhone(""); setPaidAt(toDateInputValue(new Date()));
    setNotes(""); setCompany(null); setOutstanding([]); setDocumentId(null);
  }

  function parseMessage() {
    if (!rawMessage.trim()) return;
    const result = parseMpesaMessage(rawMessage);
    if (result.amount) setAmount(String(result.amount));
    if (result.transactionCode) setTransactionCode(result.transactionCode);
    if (result.payerName) setPayerName(result.payerName);
    if (result.payerPhone) setPayerPhone(result.payerPhone);
    if (result.paidAt) setPaidAt(toDateInputValue(result.paidAt));
    setMethod("MPESA");
    setParsed(true);
    if (!looksLikeMpesaMessage(rawMessage)) {
      toast.info("Didn't fully recognize that message — check the fields below");
    } else if (!result.amount) {
      toast.info("Couldn't find an amount — fill it in below");
    }
  }

  async function pickCompany(c: Company) {
    setCompany(c);
    setDocumentId(null);
    setLoadingDocs(true);
    try {
      const docs = await getOutstandingDocumentsAction(c.id);
      setOutstanding(docs);
    } finally {
      setLoadingDocs(false);
    }
  }

  async function submit() {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) { toast.error("Enter a valid amount"); return; }
    setSaving(true);
    try {
      const input: ManualPaymentInput = {
        amount: numAmount,
        method,
        transactionCode: transactionCode || undefined,
        payerName: payerName || undefined,
        payerPhone: payerPhone || undefined,
        paidAt: paidAt ? new Date(`${paidAt}T00:00:00`) : undefined,
        companyId: company?.id,
        documentId: documentId || undefined,
        notes: notes || undefined,
        rawMessage: rawMessage || undefined,
      };
      const payment = await recordManualPaymentAction(input);
      toast.success(`${formatKES(numAmount)} recorded`);
      onRecorded(payment);
      reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't record this payment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset(); }}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader><SheetTitle>Record Payment</SheetTitle></SheetHeader>
        <SheetBody className="space-y-5">
          <div>
            <Label>Paste the M-Pesa message (optional)</Label>
            <Textarea
              value={rawMessage}
              onChange={e => { setRawMessage(e.target.value); setParsed(false); }}
              rows={3}
              placeholder="RJ61ABC2D3 Confirmed. You have received Ksh1,500.00 from JOHN KAMAU 254712345678 on 1/9/26 at 2:45 PM…"
              className="mt-1.5"
            />
            <Button
              type="button" size="sm" variant="secondary" className="mt-2 gap-1.5"
              onClick={parseMessage} disabled={!rawMessage.trim()}
            >
              {parsed ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              {parsed ? "Parsed — edit below if needed" : "Parse message"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pay-amount">Amount (KES)</Label>
              <Input id="pay-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1500" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="pay-date">Date received</Label>
              <Input id="pay-date" type="date" value={paidAt} onChange={e => setPaidAt(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label>Method</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {METHODS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMethod(m.value)}
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
              <Label htmlFor="pay-code">Transaction code</Label>
              <Input id="pay-code" value={transactionCode} onChange={e => setTransactionCode(e.target.value.toUpperCase())} placeholder="RJ61ABC2D3" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="pay-phone">Payer phone</Label>
              <Input id="pay-phone" value={payerPhone} onChange={e => setPayerPhone(e.target.value)} placeholder="254712345678" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="pay-payer">Payer name</Label>
            <Input id="pay-payer" value={payerName} onChange={e => setPayerName(e.target.value)} placeholder="John Kamau" className="mt-1.5" />
          </div>

          <div>
            <Label>Client (optional)</Label>
            <div className="mt-1.5">
              <CompanyPicker value={company} onChange={pickCompany} />
            </div>
          </div>

          {company && (
            <div>
              <Label>Apply to an invoice (optional)</Label>
              {loadingDocs ? (
                <p className="os-text-meta mt-1.5">Loading outstanding invoices…</p>
              ) : outstanding.length === 0 ? (
                <p className="os-text-meta mt-1.5">No outstanding invoices for {company.name} — this will be recorded as a general payment.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {outstanding.map(doc => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setDocumentId(prev => (prev === doc.id ? null : doc.id))}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                      style={{ background: documentId === doc.id ? "var(--accent-soft)" : "var(--surface-hover)", color: documentId === doc.id ? "var(--accent)" : "var(--text-muted)" }}
                    >
                      {doc.number} — {formatKES(doc.balance, { compact: true })} due
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="pay-notes">Notes (optional)</Label>
            <Textarea id="pay-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="mt-1.5" />
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button loading={saving} onClick={submit}>Record Payment</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
