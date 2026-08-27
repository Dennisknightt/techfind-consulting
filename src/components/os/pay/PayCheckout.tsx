"use client";

import { useEffect, useRef, useState } from "react";
import { Smartphone, CreditCard, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatKES } from "@/lib/os/money";

type Method = "MPESA" | "CARD";
type Phase = "select" | "mpesa-form" | "pending" | "success" | "failed";

export function PayCheckout({
  token, amountDue, supportedMethods, simulatedEnv,
}: {
  token: string;
  amountDue: number;
  supportedMethods: Method[];
  simulatedEnv: boolean;
}) {
  const [method, setMethod] = useState<Method | null>(null);
  const [phase, setPhase] = useState<Phase>("select");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  function pollStatus(id: string) {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/os/pay/${token}/status?paymentId=${id}`);
        const data = await res.json();
        if (data.status === "SUCCESSFUL") {
          setPhase("success");
          setReference(id);
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (["FAILED", "CANCELLED"].includes(data.status)) {
          setPhase("failed");
          setError("Payment wasn't completed.");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // transient network error — keep polling
      }
      if (attempts > 40 && pollRef.current) { // ~2 minutes at 3s
        clearInterval(pollRef.current);
        setPhase("failed");
        setError("This is taking longer than expected. Please try again or contact Techfind.");
      }
    }, 3000);
  }

  async function startCharge(chosenMethod: Method, phoneNumber?: string) {
    setError(null);
    setPhase("pending");
    try {
      const res = await fetch(`/api/os/pay/${token}/charge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: chosenMethod, phone: phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't start payment");

      setPaymentId(data.paymentId);
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      if (data.status === "SUCCESSFUL") {
        setPhase("success");
        setReference(data.paymentId);
        return;
      }
      pollStatus(data.paymentId);
    } catch (e) {
      setPhase("failed");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function retry() {
    setPhase(method === "MPESA" ? "mpesa-form" : "select");
    setError(null);
  }

  if (phase === "success") {
    return (
      <div className="text-center">
        <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--success)" }} />
        <p className="text-lg font-bold text-[var(--text)]">Payment successful ✓</p>
        <p className="text-2xl font-bold mt-1" style={{ color: "var(--accent)" }}>{formatKES(amountDue)}</p>
        <p className="text-xs text-[var(--text-faint)] mt-3">Reference: {reference}</p>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="text-center">
        <XCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--danger)" }} />
        <p className="text-sm font-semibold text-[var(--text)]">{error ?? "Payment failed"}</p>
        <button onClick={retry} className="mt-4 h-10 px-5 rounded-[var(--radius-md)] text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>
          Try Again
        </button>
      </div>
    );
  }

  if (phase === "pending") {
    return (
      <div className="text-center">
        <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" style={{ color: "var(--accent)" }} />
        <p className="text-sm font-semibold text-[var(--text)]">
          {method === "MPESA" ? "Check your phone to complete payment" : "Confirming payment…"}
        </p>
        {method === "MPESA" && <p className="text-xs text-[var(--text-faint)] mt-1.5">An M-Pesa prompt has been sent to {phone}</p>}
        {simulatedEnv && <p className="text-[10px] text-[var(--text-faint)] mt-3">Test environment — simulating provider response</p>}
        {paymentId && <p className="text-[10px] text-[var(--text-faint)] mt-3">Ref: {paymentId}</p>}
      </div>
    );
  }

  if (phase === "mpesa-form") {
    return (
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">M-Pesa phone number</p>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+254712345678"
          className="w-full h-11 px-3.5 rounded-[var(--radius-md)] text-sm outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)" }}
        />
        {error && <p className="text-xs mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
        <button
          onClick={() => startCharge("MPESA", phone)}
          disabled={phone.replace(/\D/g, "").length < 9}
          className="w-full h-11 mt-3 rounded-[var(--radius-md)] text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: "var(--accent)" }}
        >
          Pay {formatKES(amountDue)}
        </button>
        <button onClick={() => setPhase("select")} className="w-full text-xs text-[var(--text-faint)] mt-2">Back</button>
      </div>
    );
  }

  // select
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--text-muted)] mb-3">Choose how you&rsquo;d like to pay</p>
      <div className="space-y-2">
        {supportedMethods.includes("MPESA") && (
          <button
            onClick={() => { setMethod("MPESA"); setPhase("mpesa-form"); }}
            className="w-full flex items-center gap-3 h-12 px-4 rounded-[var(--radius-md)] text-sm font-medium"
            style={{ background: "var(--surface-hover)", color: "var(--text)" }}
          >
            <Smartphone className="w-4 h-4" style={{ color: "var(--success)" }} /> M-Pesa
          </button>
        )}
        {supportedMethods.includes("CARD") && (
          <button
            onClick={() => { setMethod("CARD"); startCharge("CARD"); }}
            className="w-full flex items-center gap-3 h-12 px-4 rounded-[var(--radius-md)] text-sm font-medium"
            style={{ background: "var(--surface-hover)", color: "var(--text)" }}
          >
            <CreditCard className="w-4 h-4" style={{ color: "var(--accent)" }} /> Card
          </button>
        )}
      </div>
      {simulatedEnv && <p className="text-[10px] text-[var(--text-faint)] mt-3 text-center">Test environment — simulating provider response</p>}
    </div>
  );
}
