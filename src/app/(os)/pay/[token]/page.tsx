import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { formatKES } from "@/lib/os/money";

export const metadata: Metadata = { title: "Pay — Techfind" };

// Full checkout (method selection, gateway integration, webhooks) lands in
// Phase 5. This confirms the link is real and safe — no payment details are
// collected yet — rather than 404ing on a link a customer already has.
export default async function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const session = await db.paymentSession.findUnique({
    where: { token },
    include: { document: { include: { company: true } } },
  });

  if (!session) notFound();

  const expired = session.status !== "ACTIVE" || session.expiresAt < new Date();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm text-center">
        <p className="text-lg font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>TECHFIND</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">Complete your payment</p>

        <div className="mt-8 rounded-[var(--radius-xl)] p-6 text-left" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-sm font-semibold text-[var(--text)]">{session.document.company.name}</p>
          <p className="text-xs text-[var(--text-faint)] mt-0.5">{session.document.number}</p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <span className="text-xs text-[var(--text-faint)]">Amount due now</span>
            <span className="text-lg font-bold text-[var(--text)]">{formatKES(session.amountDue)}</span>
          </div>
        </div>

        {expired ? (
          <p className="text-xs text-[var(--danger)] mt-6">This payment link is no longer active. Ask Techfind to send a new one.</p>
        ) : (
          <p className="text-xs text-[var(--text-faint)] mt-6">
            Online checkout (M-Pesa, card, bank transfer) is being connected. In the meantime, your Techfind contact can share alternative payment instructions.
          </p>
        )}
      </div>
    </div>
  );
}
