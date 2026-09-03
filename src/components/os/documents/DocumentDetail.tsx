"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Download, Copy, ExternalLink, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/os/ui/Button";
import { Badge } from "@/components/os/ui/Badge";
import { formatKES } from "@/lib/os/money";
import { friendlyDate } from "@/lib/os/dates";
import { markDocumentSentAction } from "@/server/actions/documents";
import type { getDocumentAction } from "@/server/actions/documents";
import { waLink } from "@/lib/os/whatsapp";
import { RequestPaymentButton } from "@/components/os/payments/RequestPaymentButton";
import { SendStkPushButton } from "@/components/os/payments/SendStkPushButton";

type Doc = Awaited<ReturnType<typeof getDocumentAction>>;

const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  DRAFT: "neutral", SENT: "accent", VIEWED: "accent",
  PARTIALLY_PAID: "warning", PAID: "success", EXPIRED: "danger", CANCELLED: "danger",
};

export function DocumentDetail({ doc: initialDoc }: { doc: Doc }) {
  const [doc, setDoc] = useState(initialDoc);
  const [sending, setSending] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const session = doc.paymentSessions[0];
  const paymentUrl = session ? `${baseUrl}/pay/${session.token}` : null;
  const pdfUrl = `/api/os/documents/${doc.id}/pdf`;
  const docLabel = doc.type === "PROFORMA" ? "proforma" : doc.type === "INVOICE" ? "invoice" : "quote";

  async function sendWhatsApp() {
    if (!doc.company.phone) { toast.error("This client has no phone number on file"); return; }
    setSending(true);
    try {
      const lines = [
        `Hi ${doc.company.name.split(" ")[0]},`,
        "",
        `Please find your Techfind ${docLabel} ${doc.number}.`,
        "",
        `Total: ${formatKES(doc.total)}`,
      ];
      if (doc.depositRequired > 0 && doc.depositRequired < doc.total) lines.push(`Deposit required: ${formatKES(doc.depositRequired)}`);
      if (paymentUrl) lines.push("", "You can securely make payment here:", paymentUrl);
      lines.push("", `View the full ${docLabel}:`, `${baseUrl}${pdfUrl}`, "", "Thank you.");
      const message = lines.join("\n");

      window.open(waLink(doc.company.phone, message), "_blank");
      const updated = await markDocumentSentAction(doc.id, { channel: "WHATSAPP", message });
      setDoc(prev => ({ ...prev, status: updated.status, sentAt: updated.sentAt }));
      toast.success("Logged to the customer timeline");
    } catch {
      toast.error("Couldn't log the send");
    } finally {
      setSending(false);
    }
  }

  function copyLink() {
    if (!paymentUrl) return;
    navigator.clipboard.writeText(paymentUrl);
    toast.success("Payment link copied");
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>{doc.number}</h1>
            <Badge tone={STATUS_TONE[doc.status] ?? "neutral"}>{doc.status.replace(/_/g, " ")}</Badge>
          </div>
          <Link href={`/app/clients/${doc.companyId}`} className="text-xs font-medium flex items-center gap-1 mt-1.5" style={{ color: "var(--accent)" }}>
            <Building2 className="w-3 h-3" /> {doc.company.name}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" asChild className="gap-1.5">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer"><Download className="w-3.5 h-3.5" /> PDF</a>
          </Button>
          <Button size="sm" onClick={sendWhatsApp} loading={sending} className="gap-1.5">
            <Send className="w-3.5 h-3.5" /> {doc.sentAt ? "Send Again" : "Send via WhatsApp"}
          </Button>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--surface-hover)" }}>
              {["Item", "Qty", "Unit Price", "Amount"].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doc.items.map(it => (
              <tr key={it.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--text)]">{it.label}</p>
                  {it.description && <p className="text-xs text-[var(--text-faint)] mt-0.5">{it.description}</p>}
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{it.quantity}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{formatKES(it.unitPrice, { compact: true })}</td>
                <td className="px-4 py-3 font-semibold text-[var(--text)]">{formatKES(it.amount, { compact: true })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mt-4">
        <div className="w-64 space-y-1.5">
          <Row label="Subtotal" value={formatKES(doc.subtotal)} />
          {doc.discount > 0 && <Row label="Discount" value={`-${formatKES(doc.discount)}`} />}
          {doc.taxMode !== "NONE" && <Row label={`Tax ${doc.taxMode === "INCLUSIVE" ? "(incl.)" : ""}`} value={formatKES(doc.taxAmount)} />}
          <div className="flex justify-between pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <span className="text-sm font-bold text-[var(--text)]">Total</span>
            <span className="text-sm font-bold text-[var(--text)]">{formatKES(doc.total)}</span>
          </div>
        </div>
      </div>

      {/* Deposit + payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="rounded-[var(--radius-lg)] border p-4" style={{ borderColor: "var(--border)" }}>
          <p className="os-text-meta font-semibold uppercase tracking-wider mb-2">Payment</p>
          {doc.balance <= 0 ? (
            <div className="flex items-center gap-1.5 mb-1" style={{ color: "var(--success)" }}>
              <CheckCircle2 className="w-4 h-4" /> <span className="text-sm font-bold">Fully paid</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--text)]">Deposit: <strong>{formatKES(doc.depositRequired)}</strong></p>
              <p className="text-sm text-[var(--text)]">Outstanding: <strong style={{ color: "var(--warning)" }}>{formatKES(doc.balance)}</strong></p>
            </>
          )}
          <p className="os-text-meta mt-2">Paid so far: {formatKES(doc.paidAmount)}{doc.payments.length > 0 ? " — " : ""}
            {doc.payments.length > 0 && <Link href="/app/payments" className="hover:underline" style={{ color: "var(--accent)" }}>view payments</Link>}
          </p>

          {doc.balance > 0 && (
            <div className="flex flex-col items-start gap-2 mt-3">
              <RequestPaymentButton documentId={doc.id} label={doc.paidAmount > 0 ? "Request Balance" : "Request Payment"} />
              <SendStkPushButton documentId={doc.id} phone={doc.company.phone} amountDue={doc.balance} />
            </div>
          )}
        </div>
        <div className="rounded-[var(--radius-lg)] border p-4" style={{ borderColor: "var(--border)" }}>
          <p className="os-text-meta font-semibold uppercase tracking-wider mb-2">Payment Link</p>
          {paymentUrl ? (
            <>
              <p className="text-xs text-[var(--text-muted)] break-all">{paymentUrl}</p>
              <div className="flex gap-2 mt-2.5">
                <Button size="sm" variant="secondary" onClick={copyLink} className="gap-1.5"><Copy className="w-3 h-3" /> Copy</Button>
                <Button size="sm" variant="ghost" asChild className="gap-1.5">
                  <a href={paymentUrl} target="_blank" rel="noopener noreferrer">Open <ExternalLink className="w-3 h-3" /></a>
                </Button>
              </div>
            </>
          ) : (
            <p className="text-xs text-[var(--text-faint)]">No payment link — total is KES 0.</p>
          )}
        </div>
      </div>

      {(doc.notes || doc.terms) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {doc.notes && <div><p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-1.5">Notes</p><p className="text-xs text-[var(--text-muted)] whitespace-pre-wrap">{doc.notes}</p></div>}
          {doc.terms && <div><p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-1.5">Terms</p><p className="text-xs text-[var(--text-muted)] whitespace-pre-wrap">{doc.terms}</p></div>}
        </div>
      )}

      <p className="text-[11px] text-[var(--text-faint)] mt-6">
        Created {friendlyDate(doc.createdAt)} by {doc.owner?.name ?? "—"}{doc.validUntil && ` · Valid until ${friendlyDate(doc.validUntil)}`}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--text-faint)]">{label}</span>
      <span className="text-[var(--text)]">{value}</span>
    </div>
  );
}
