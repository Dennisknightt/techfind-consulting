import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Badge } from "@/components/os/ui/Badge";
import { RequestPaymentButton } from "@/components/os/payments/RequestPaymentButton";
import { OutstandingClientsCallout } from "@/components/os/payments/OutstandingClientsCallout";
import { formatKES } from "@/lib/os/money";
import { friendlyDate, dayjs } from "@/lib/os/dates";

export const metadata: Metadata = { title: "Revenue — Techfind" };

export default async function RevenuePage() {
  await requireUser();
  const now = dayjs();
  const startOfDay = now.startOf("day").toDate();
  const endOfDay = now.endOf("day").toDate();
  const startOfMonth = now.startOf("month").toDate();

  const [receivedToday, receivedThisMonth, receivedTotal, awaiting, overdue, recentPayments, footprint] = await Promise.all([
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESSFUL", paidAt: { gte: startOfDay, lte: endOfDay } } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESSFUL", paidAt: { gte: startOfMonth } } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESSFUL" } }),
    db.salesDocument.findMany({
      where: { type: "PROFORMA", status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] }, balance: { gt: 0 }, OR: [{ validUntil: null }, { validUntil: { gte: now.toDate() } }] },
      include: { company: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.salesDocument.findMany({
      where: { type: "PROFORMA", status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] }, balance: { gt: 0 }, validUntil: { lt: now.toDate() } },
      include: { company: true },
      orderBy: { validUntil: "asc" },
      take: 20,
    }),
    db.payment.findMany({ where: { status: "SUCCESSFUL" }, include: { company: true }, orderBy: { paidAt: "desc" }, take: 10 }),
    db.productFootprint.findMany({ where: { status: "ACTIVE", mrr: { gt: 0 } }, include: { company: true, product: true } }),
  ]);

  const outstandingDocs = [...overdue, ...awaiting];
  const expected = outstandingDocs.reduce((s, d) => s + d.balance, 0);
  const recurringTotal = footprint.reduce((s, f) => s + (f.mrr ?? 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <PageHeader title="Money" subtitle="Who owes us, how much, and whether I can ask them right now" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <Stat label="Today" value={formatKES(receivedToday._sum.amount ?? 0, { compact: true })} tone="success" />
        <Stat label="This Month" value={formatKES(receivedThisMonth._sum.amount ?? 0, { compact: true })} tone="success" />
        <Stat label="Awaiting Payment" value={formatKES(expected, { compact: true })} tone="warning" />
        <Stat label="Received (All Time)" value={formatKES(receivedTotal._sum.amount ?? 0, { compact: true })} />
      </div>

      <OutstandingClientsCallout
        docs={outstandingDocs.map(d => ({ id: d.id, number: d.number, balance: d.balance, paidAmount: d.paidAmount, companyName: d.company.name }))}
      />

      {overdue.length > 0 && (
        <Section title="Overdue" tone="danger">
          {overdue.map(d => (
            <DocRow key={d.id} doc={d} overdue />
          ))}
        </Section>
      )}

      <Section title="Awaiting Payment">
        {awaiting.length === 0 ? <Empty text="Nothing awaiting payment right now." /> : awaiting.map(d => <DocRow key={d.id} doc={d} />)}
      </Section>

      <Section title="Recent Payments">
        {recentPayments.length === 0 ? <Empty text="No payments received yet." /> : recentPayments.map(p => (
          <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)]" style={{ border: "1px solid var(--border)" }}>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">{p.company?.name ?? "—"}</p>
              <p className="text-xs text-[var(--text-faint)]">{p.paidAt ? friendlyDate(p.paidAt) : ""} · {p.method}</p>
            </div>
            <span className="text-sm font-bold" style={{ color: "var(--success)" }}>{formatKES(p.amount, { compact: true })}</span>
          </div>
        ))}
      </Section>

      <Section title="Recurring Revenue">
        {footprint.length === 0 ? (
          <Empty text="No active recurring subscriptions tracked yet." />
        ) : (
          <>
            {footprint.map(f => (
              <div key={f.id} className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)]" style={{ border: "1px solid var(--border)" }}>
                <div>
                  <Link href={`/app/clients/${f.companyId}`} className="text-sm font-medium hover:underline" style={{ color: "var(--text)" }}>{f.company.name}</Link>
                  <p className="text-xs text-[var(--text-faint)]">{f.product.name}</p>
                </div>
                <span className="text-sm font-bold text-[var(--text)]">{formatKES(f.mrr ?? 0, { compact: true })}/mo</span>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <span className="text-xs font-semibold text-[var(--text-faint)]">Total: {formatKES(recurringTotal, { compact: true })}/mo</span>
            </div>
          </>
        )}
      </Section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" }) {
  return (
    <div className="rounded-[var(--radius-lg)] p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <p className="text-lg font-bold" style={{ fontFamily: "var(--font-space)", color: tone === "success" ? "var(--success)" : tone === "warning" ? "var(--warning)" : "var(--text)" }}>{value}</p>
      <p className="text-xs text-[var(--text-faint)] mt-0.5">{label}</p>
    </div>
  );
}

function Section({ title, tone, children }: { title: string; tone?: "danger"; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: tone === "danger" ? "var(--danger)" : "var(--text-faint)" }}>{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-xs text-[var(--text-faint)] px-1">{text}</p>;
}

function DocRow({ doc, overdue }: { doc: { id: string; number: string; balance: number; paidAmount: number; validUntil: Date | null; company: { id: string; name: string } }; overdue?: boolean }) {
  return (
    <div className="relative flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-lg)] flex-wrap" style={{ border: "1px solid var(--border)" }}>
      <Link href={`/app/quotes/${doc.id}`} className="absolute inset-0 rounded-[var(--radius-lg)] hover:bg-[var(--surface-hover)] transition-colors" aria-label={`Open ${doc.number}`} />
      <div className="relative">
        <p className="text-sm font-medium text-[var(--text)]">{doc.company.name}</p>
        <p className="text-xs text-[var(--text-faint)]">{doc.number}{doc.validUntil ? ` · Due ${friendlyDate(doc.validUntil)}` : ""}</p>
      </div>
      <div className="relative z-10 flex items-center gap-2">
        <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{formatKES(doc.balance, { compact: true })}</span>
        {overdue && <Badge tone="danger">Overdue</Badge>}
        <RequestPaymentButton documentId={doc.id} label={doc.paidAmount > 0 ? "Balance" : "Request"} size="sm" variant="secondary" />
      </div>
    </div>
  );
}
