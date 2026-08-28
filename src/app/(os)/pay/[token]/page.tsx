import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { formatKES } from "@/lib/os/money";
import { getActiveProvider } from "@/server/payments/registry";
import { PayCheckout } from "@/components/os/pay/PayCheckout";

export const metadata: Metadata = { title: "Pay — Techfind" };

export default async function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const session = await db.paymentSession.findUnique({
    where: { token },
    include: { document: { include: { company: true } } },
  });

  if (!session) notFound();

  const expired = session.status !== "ACTIVE" || session.expiresAt < new Date();
  const { provider, devSafetyOverride } = await getActiveProvider();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="text-lg font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>TECHFIND</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Complete your payment</p>
        </div>

        <div className="rounded-[var(--radius-xl)] p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-sm font-semibold text-[var(--text)]">{session.document.company.name}</p>
          <p className="text-xs text-[var(--text-faint)] mt-0.5">{session.document.number}</p>
          <div className="flex items-center justify-between mt-4 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="text-xs text-[var(--text-faint)]">Amount due now</span>
            <span className="text-lg font-bold text-[var(--text)]">{formatKES(session.amountDue)}</span>
          </div>

          <div className="mt-5">
            {expired ? (
              <p className="text-xs text-center" style={{ color: "var(--danger)" }}>This payment link is no longer active. Ask Techfind to send a new one.</p>
            ) : (
              <PayCheckout
                token={token}
                amountDue={session.amountDue}
                supportedMethods={provider.supportedMethods.filter((m): m is "MPESA" | "CARD" => m === "MPESA" || m === "CARD")}
                simulatedEnv={devSafetyOverride}
              />
            )}
          </div>
        </div>

        <p className="text-[10px] text-[var(--text-faint)] text-center mt-5">Secured by Techfind · Payments processed by IntaSend</p>
      </div>
    </div>
  );
}
