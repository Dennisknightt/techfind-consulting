"use client";

import { useEffect, useRef, useState } from "react";
import { Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/os/ui/Button";
import { formatKES } from "@/lib/os/money";
import { sendStkPushAction, checkStkStatusAction } from "@/server/actions/payments";

type Phase = "idle" | "waiting" | "received" | "failed";

/**
 * Direct M-Pesa STK push against the client's phone on file — no link,
 * no separate customer step beyond entering their PIN on their own
 * device. This is the "optional" experience alongside the payment link:
 * for a verified phone number, it's the fastest possible collection path.
 */
export function SendStkPushButton({
  documentId, phone, amountDue, disabled,
}: {
  documentId: string;
  phone: string | null;
  amountDue: number;
  disabled?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [receivedAmount, setReceivedAmount] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  function poll(paymentId: string) {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const result = await checkStkStatusAction(paymentId);
        if (result.status === "SUCCESSFUL") {
          setPhase("received");
          setReceivedAmount(result.amount ?? amountDue);
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (["FAILED", "CANCELLED"].includes(result.status)) {
          setPhase("failed");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // transient — keep polling
      }
      if (attempts > 40 && pollRef.current) { // ~2 minutes
        clearInterval(pollRef.current);
        setPhase("failed");
      }
    }, 3000);
  }

  async function send() {
    setPhase("waiting");
    try {
      const result = await sendStkPushAction(documentId);
      if (result.status === "SUCCESSFUL") {
        setPhase("received");
        setReceivedAmount(amountDue);
        return;
      }
      poll(result.paymentId);
    } catch (e) {
      setPhase("idle");
      toast.error(e instanceof Error ? e.message : "Couldn't send the M-Pesa prompt");
    }
  }

  if (phase === "received") {
    return (
      <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--success)" }}>
        <CheckCircle2 className="w-4 h-4" /> {formatKES(receivedAmount ?? amountDue)} received
      </div>
    );
  }

  if (phase === "waiting") {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--accent)" }} /> Waiting for customer…
      </div>
    );
  }

  return (
    <div>
      <Button
        size="sm"
        variant="secondary"
        onClick={send}
        disabled={disabled || !phone || amountDue <= 0}
        className="gap-1.5"
      >
        <Smartphone className="w-3.5 h-3.5" style={{ color: "var(--success)" }} /> Send M-Pesa Prompt
      </Button>
      {phase === "failed" && (
        <p className="text-xs mt-1.5" style={{ color: "var(--danger)" }}>Payment wasn&rsquo;t completed — try again or send a payment link.</p>
      )}
      {!phone && <p className="text-xs mt-1.5" style={{ color: "var(--text-faint)" }}>No phone on file for this client.</p>}
    </div>
  );
}
