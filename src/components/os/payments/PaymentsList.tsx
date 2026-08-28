"use client";

import Link from "next/link";
import type { Payment, Company, SalesDocument, Receipt } from "@prisma/client";
import { CreditCard, Download } from "lucide-react";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Badge } from "@/components/os/ui/Badge";
import { formatKES } from "@/lib/os/money";
import { friendlyDate } from "@/lib/os/dates";

type PaymentRow = Payment & { company: Company | null; document: SalesDocument | null; receipt: Receipt | null };

const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  PENDING: "neutral", PROCESSING: "accent", SUCCESSFUL: "success",
  FAILED: "danger", CANCELLED: "danger", REVERSED: "danger",
  REFUNDED: "warning", PARTIALLY_REFUNDED: "warning", NEEDS_MATCHING: "warning",
};

export function PaymentsList({ payments }: { payments: PaymentRow[] }) {
  const received = payments.filter(p => p.status === "SUCCESSFUL").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Payments" subtitle={`${payments.length} transactions · ${formatKES(received, { compact: true })} received`} />

      {payments.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <CreditCard className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">No payments yet</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">Payments made against proformas will show up here automatically.</p>
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--surface-hover)" }}>
                {["Reference", "Client", "Document", "Method", "Amount", "Status", "Date", ""].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3 text-xs text-[var(--text-faint)]">{p.reference}</td>
                  <td className="px-4 py-3 font-medium text-[var(--text)]">{p.company?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {p.document ? <Link href={`/app/quotes/${p.document.id}`} className="hover:underline" style={{ color: "var(--accent)" }}>{p.document.number}</Link> : "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{p.method}</td>
                  <td className="px-4 py-3 font-bold text-[var(--text)]">{formatKES(p.amount, { compact: true })}</td>
                  <td className="px-4 py-3"><Badge tone={STATUS_TONE[p.status] ?? "neutral"}>{p.status.replace(/_/g, " ")}</Badge></td>
                  <td className="px-4 py-3 text-xs text-[var(--text-faint)]">{friendlyDate(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    {p.receipt && (
                      <a href={`/api/os/receipts/${p.receipt.id}/pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs hover:underline" style={{ color: "var(--accent)" }}>
                        <Download className="w-3 h-3" /> Receipt
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
