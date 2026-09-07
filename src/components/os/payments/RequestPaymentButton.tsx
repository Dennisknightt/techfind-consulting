"use client";

import { useState } from "react";
import { Send, MessageCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/os/ui/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { formatKES } from "@/lib/os/money";
import { waLink } from "@/lib/os/whatsapp";
import { getPaymentRequestPreviewAction, logPaymentRequestSentAction, type PaymentRequestPreview } from "@/server/actions/payments";

/**
 * The one-click "Request Payment" entry point — usable from anywhere the
 * CRM already knows the document (deal, client, invoice list, invoice
 * detail). Never asks for anything it can already resolve server-side;
 * the confirm step exists purely so nobody fat-fingers a send to the
 * wrong client, not to collect input.
 */
export function RequestPaymentButton({
  documentId, label = "Request Payment", size = "sm", variant = "primary", className, onSent,
}: {
  documentId: string;
  label?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
  onSent?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState<PaymentRequestPreview | null>(null);

  async function openSheet() {
    setOpen(true);
    setLoading(true);
    setPreview(null);
    try {
      setPreview(await getPaymentRequestPreviewAction(documentId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't prepare the request");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function buildMessage(p: PaymentRequestPreview): string {
    const firstName = p.clientName.split(" ")[0];
    return [
      `Hi ${firstName},`,
      "",
      `${p.isBalance ? "Here's the remaining balance on" : "Please find the payment request for"} ${p.documentNumber}.`,
      "",
      `Amount due: ${formatKES(p.amountDue)}`,
      "",
      "You can securely pay via M-Pesa or card here:",
      p.url,
      "",
      "Thank you.",
    ].join("\n");
  }

  async function copyLink() {
    if (!preview) return;
    await navigator.clipboard.writeText(preview.url);
    toast.success("Payment link copied");
  }

  async function send() {
    if (!preview) return;
    setSending(true);
    try {
      const message = buildMessage(preview);
      if (preview.phone) {
        window.open(waLink(preview.phone, message), "_blank");
      } else {
        await navigator.clipboard.writeText(message);
        toast.success("No phone on file — message copied instead");
      }
      await logPaymentRequestSentAction(documentId, message);
      toast.success(`Payment request sent to ${preview.clientName}`);
      setOpen(false);
      onSent?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't send the request");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Button size={size} variant={variant} onClick={openSheet} className={className ?? "gap-1.5"}>
        <Send className="w-3.5 h-3.5" /> {label}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>{label}</SheetTitle>
            <SheetDescription>Sent straight to the client — nothing to re-enter.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            {loading || !preview ? (
              <p className="text-sm text-[var(--text-faint)] text-center py-6">Preparing…</p>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-faint)" }}>Request</p>
                <p className="text-3xl font-bold mt-1.5" style={{ color: "var(--text)", fontFamily: "var(--font-space)" }}>
                  {formatKES(preview.amountDue)}
                </p>
                <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>from {preview.clientName}?</p>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs" style={{ color: "var(--text-faint)" }}>
                  <MessageCircle className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />
                  {preview.phone ? `WhatsApp • ${preview.phone}` : "No phone on file — link will be copied"}
                </div>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-1 text-[11px] mt-2 hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  <Copy className="w-3 h-3" /> Copy link instead
                </button>
              </div>
            )}
          </SheetBody>
          <SheetFooter>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={send} loading={sending} disabled={!preview} className="gap-1.5">
              <Send className="w-3.5 h-3.5" /> Send Payment Request
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
