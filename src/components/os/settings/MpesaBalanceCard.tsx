"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Wallet, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { formatKES } from "@/lib/os/money";
import { timeAgo } from "@/lib/os/dates";
import { requestMpesaBalanceAction, getMpesaBalanceStatusAction } from "@/server/actions/paymentSettings";
import type { MpesaBalanceState } from "@/server/payments/mpesaBalance";

/** Only shown once Daraja is the configured provider — Account Balance is Daraja-specific, not something IntaSend/Mock expose. */
export function MpesaBalanceCard({ initial, canEdit }: { initial: MpesaBalanceState | null; canEdit: boolean }) {
  const [state, setState] = useState(initial);
  const [checking, setChecking] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  async function check() {
    if (!canEdit) return;
    setChecking(true);
    try {
      await requestMpesaBalanceAction();
      toast.success("Balance requested — Safaricom will confirm shortly");
      setState(prev => ({ ...(prev ?? { requestedAt: new Date().toISOString() }), status: "PENDING", requestedAt: new Date().toISOString() }));

      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts += 1;
        const latest = await getMpesaBalanceStatusAction();
        if (latest && latest.status !== "PENDING") {
          setState(latest);
          setChecking(false);
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (attempts > 20) { // ~1 minute at 3s
          setChecking(false);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 3000);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't request balance");
      setChecking(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>M-Pesa Account Balance</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {!canEdit && (
          <p className="text-xs px-3 py-2 rounded-[var(--radius-md)]" style={{ background: "var(--warning-soft)", color: "var(--warning)" }}>
            Only Super Admins can check the M-Pesa balance.
          </p>
        )}

        {state?.status === "RECEIVED" && state.balance !== undefined ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--accent-soft)" }}>
              <Wallet className="w-[18px] h-[18px]" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="os-text-number text-xl" style={{ color: "var(--text)" }}>
                {formatKES(state.balance)}
              </p>
              <p className="os-text-meta">
                {state.accountName ?? "Working Account"} · checked {state.receivedAt ? timeAgo(state.receivedAt) : "recently"}
              </p>
            </div>
          </div>
        ) : state?.status === "PENDING" ? (
          <p className="os-text-meta">Waiting for Safaricom to confirm the balance…</p>
        ) : state?.status === "FAILED" ? (
          <p className="text-xs" style={{ color: "var(--danger)" }}>
            {state.resultDesc ?? "Couldn't get the balance"}
          </p>
        ) : (
          <p className="os-text-meta">Never checked.</p>
        )}

        {state?.raw && (
          <p className="text-[11px] font-mono truncate" style={{ color: "var(--text-faint)" }} title={state.raw}>
            {state.raw}
          </p>
        )}

        <Button size="sm" variant="secondary" disabled={!canEdit || checking} loading={checking} onClick={check} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Check Balance
        </Button>
      </CardContent>
    </Card>
  );
}
