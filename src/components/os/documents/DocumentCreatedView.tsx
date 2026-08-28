"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send, Download, Copy, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/os/ui/Button";
import { formatKES } from "@/lib/os/money";
import { markDocumentSentAction } from "@/server/actions/documents";
import type { createDocumentAction } from "@/server/actions/documents";

type CreatedDoc = Awaited<ReturnType<typeof createDocumentAction>>;

function waLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;
}

export function DocumentCreatedView({ doc, onCreateAnother }: { doc: CreatedDoc; onCreateAnother: () => void }) {
  const [sent, setSent] = useState(doc.status === "SENT");
  const [sending, setSending] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const session = doc.paymentSessions[0];
  const paymentUrl = session ? `${baseUrl}/pay/${session.token}` : null;
  const pdfUrl = `/api/os/documents/${doc.id}/pdf`;
  const docLabel = doc.type === "PROFORMA" ? "proforma" : "quote";

  function buildMessage(contactFirstName: string) {
    const lines = [
      `Hi ${contactFirstName},`,
      "",
      `Please find your Techfind ${docLabel} ${doc.number}.`,
      "",
      `Total: ${formatKES(doc.total)}`,
    ];
    if (doc.depositRequired > 0 && doc.depositRequired < doc.total) {
      lines.push(`Deposit required: ${formatKES(doc.depositRequired)}`);
    }
    if (paymentUrl) {
      lines.push("", "You can securely make payment here:", paymentUrl);
    }
    lines.push("", `View the full ${docLabel}:`, `${baseUrl}${pdfUrl}`, "", "Thank you.");
    return lines.join("\n");
  }

  async function sendWhatsApp() {
    if (!doc.company.phone) { toast.error("This client has no phone number on file"); return; }
    setSending(true);
    try {
      const message = buildMessage(doc.company.name.split(" ")[0]);
      window.open(waLink(doc.company.phone, message), "_blank");
      await markDocumentSentAction(doc.id, { channel: "WHATSAPP", message });
      setSent(true);
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
    <div className="p-6 lg:p-8 max-w-lg mx-auto text-center">
      <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-5" style={{ background: "var(--success-soft)" }}>
        <CheckCircle2 className="w-7 h-7" style={{ color: "var(--success)" }} />
      </div>
      <h1 className="text-xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>{doc.number} created</h1>
      <p className="text-sm text-[var(--text-muted)] mt-1.5">
        {doc.company.name} · {formatKES(doc.total)}
        {doc.depositRequired > 0 && doc.depositRequired < doc.total && ` · ${formatKES(doc.depositRequired)} deposit`}
      </p>

      <div className="mt-7 space-y-2.5">
        <Button size="lg" onClick={sendWhatsApp} loading={sending} className="w-full gap-2">
          <Send className="w-4 h-4" /> {sent ? "Sent — Send Again" : "Send via WhatsApp"}
        </Button>
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="secondary" asChild className="gap-1.5">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer"><Download className="w-3.5 h-3.5" /> Download PDF</a>
          </Button>
          <Button variant="secondary" onClick={copyLink} disabled={!paymentUrl} className="gap-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy Payment Link
          </Button>
        </div>
        {paymentUrl && (
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-xs hover:underline" style={{ color: "var(--accent)" }}>
            Preview payment page <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        <button onClick={onCreateAnother} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--accent)" }}>
          <Plus className="w-3.5 h-3.5" /> Create Another
        </button>
        <Link href="/app/quotes" className="text-sm font-medium text-[var(--text-muted)]">View All Quotes</Link>
      </div>
    </div>
  );
}
