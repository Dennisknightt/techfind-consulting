"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { setActivePaymentProviderAction } from "@/server/actions/paymentSettings";

export function PaymentProviderSettings({
  configuredName, devSafetyOverride, canEdit, providers,
}: {
  configuredName: string;
  devSafetyOverride: boolean;
  canEdit: boolean;
  providers: string[];
}) {
  const [active, setActive] = useState(configuredName);
  const [saving, setSaving] = useState(false);

  async function choose(name: string) {
    if (!canEdit) return;
    setSaving(true);
    try {
      await setActivePaymentProviderAction(name);
      setActive(name);
      toast.success(`${name} is now the configured provider`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Payment Provider</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!canEdit && (
          <p className="text-xs px-3 py-2 rounded-[var(--radius-md)]" style={{ background: "var(--warning-soft)", color: "var(--warning)" }}>
            Only Super Admins can change the active payment provider.
          </p>
        )}

        <div className="flex gap-2">
          {providers.map(name => (
            <button
              key={name}
              disabled={!canEdit || saving}
              onClick={() => choose(name)}
              className="px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold disabled:opacity-60"
              style={{ background: active === name ? "var(--accent-soft)" : "var(--surface-hover)", color: active === name ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${active === name ? "var(--accent)" : "transparent"}` }}
            >
              {name === "INTASEND" ? "IntaSend (M-Pesa, Card)" : "Mock (sandbox)"}
            </button>
          ))}
        </div>

        {active === "INTASEND" && (
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-[var(--radius-md)]"
            style={{ background: devSafetyOverride ? "var(--info-soft)" : "var(--success-soft)" }}
          >
            {devSafetyOverride ? (
              <>
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--info)" }} />
                <p className="text-xs" style={{ color: "var(--info)" }}>
                  IntaSend is configured, but this environment isn&rsquo;t production — payments here are automatically simulated by the Mock provider so no real M-Pesa or card charge can happen accidentally. Deploying to production activates live IntaSend.
                </p>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                <p className="text-xs" style={{ color: "var(--success)" }}>
                  IntaSend is live in this environment. Real M-Pesa prompts and card charges will be sent to customers who pay.
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
