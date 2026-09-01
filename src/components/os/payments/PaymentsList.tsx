"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Payment, Company, SalesDocument, Receipt } from "@prisma/client";
import { CreditCard, Download, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Badge } from "@/components/os/ui/Badge";
import { formatKES } from "@/lib/os/money";
import { friendlyDate } from "@/lib/os/dates";
import { fadeInUp } from "@/lib/os/motion";
import { RecordPaymentSheet } from "./RecordPaymentSheet";
import { PaymentDetailSheet } from "./PaymentDetailSheet";

export type PaymentRow = Payment & { company: Company | null; document: SalesDocument | null; receipt: Receipt | null };

export const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  PENDING: "neutral", PROCESSING: "accent", SUCCESSFUL: "success",
  FAILED: "danger", CANCELLED: "danger", REVERSED: "danger",
  REFUNDED: "warning", PARTIALLY_REFUNDED: "warning", NEEDS_MATCHING: "warning",
};

export function PaymentsList({ payments, canRecord }: { payments: PaymentRow[]; canRecord: boolean }) {
  const router = useRouter();
  const [recordOpen, setRecordOpen] = useState(false);
  const [selected, setSelected] = useState<PaymentRow | null>(null);
  const received = payments.filter(p => p.status === "SUCCESSFUL").reduce((s, p) => s + p.amount, 0);

  function onRecorded() {
    setRecordOpen(false);
    router.refresh();
  }

  function onChanged() {
    setSelected(null);
    router.refresh();
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} transactions · ${formatKES(received, { compact: true })} received`}
        actions={
          canRecord ? (
            <Button size="sm" onClick={() => setRecordOpen(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /> Record Payment
            </Button>
          ) : undefined
        }
      />

      {payments.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <CreditCard className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">No payments yet</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">Payments made against proformas will show up here automatically.</p>
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div
            className="hidden sm:grid items-center gap-3 px-4 py-2 border-b"
            style={{ gridTemplateColumns: "1fr 1fr 90px 100px 110px 90px 32px", borderColor: "var(--border)" }}
          >
            {["Client", "Document", "Method", "Amount", "Status", "Date", ""].map(h => (
              <span key={h} className="os-text-meta font-semibold uppercase tracking-wide" style={{ fontSize: 11 }}>{h}</span>
            ))}
          </div>
          {payments.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              {...fadeInUp}
              onClick={() => setSelected(p)}
              className="os-row-hover w-full grid grid-cols-2 sm:grid-cols-[1fr_1fr_90px_100px_110px_90px_32px] items-center gap-3 px-4 py-2.5 text-left"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{p.company?.name ?? "—"}</p>
                <p className="os-text-meta truncate sm:hidden">{p.reference}</p>
              </div>
              <div className="hidden sm:block min-w-0">
                {p.document ? (
                  <Link
                    href={`/app/quotes/${p.document.id}`}
                    onClick={e => e.stopPropagation()}
                    className="text-sm hover:underline truncate block"
                    style={{ color: "var(--accent)" }}
                  >
                    {p.document.number}
                  </Link>
                ) : (
                  <span className="os-text-meta">—</span>
                )}
              </div>
              <span className="hidden sm:block os-text-meta">{p.method}</span>
              <span className="hidden sm:block os-text-number text-sm" style={{ color: "var(--text)" }}>{formatKES(p.amount, { compact: true })}</span>
              <div className="hidden sm:block"><Badge tone={STATUS_TONE[p.status] ?? "neutral"}>{p.status.replace(/_/g, " ")}</Badge></div>
              <span className="hidden sm:block os-text-meta">{friendlyDate(p.createdAt)}</span>
              <div className="flex justify-end">
                {p.receipt && (
                  <a
                    href={`/api/os/receipts/${p.receipt.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    aria-label="Download receipt"
                    style={{ color: "var(--text-faint)" }}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {canRecord && (
        <RecordPaymentSheet open={recordOpen} onOpenChange={setRecordOpen} onRecorded={onRecorded} />
      )}

      <PaymentDetailSheet
        payment={selected}
        open={selected !== null}
        onOpenChange={v => { if (!v) setSelected(null); }}
        canEdit={canRecord}
        onChanged={onChanged}
        onDeleted={onChanged}
      />
    </div>
  );
}
