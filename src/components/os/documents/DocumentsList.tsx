"use client";

import Link from "next/link";
import type { SalesDocument, Company, User } from "@prisma/client";
import { Plus, FileText } from "lucide-react";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Badge } from "@/components/os/ui/Badge";
import { RequestPaymentButton } from "@/components/os/payments/RequestPaymentButton";
import { formatKES } from "@/lib/os/money";
import { friendlyDay } from "@/lib/os/dates";

type DocRow = SalesDocument & { company: Company; owner: User | null };

const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  DRAFT: "neutral", SENT: "accent", VIEWED: "accent",
  PARTIALLY_PAID: "warning", PAID: "success", EXPIRED: "danger", CANCELLED: "danger",
};

export function DocumentsList({
  documents, title, subtitle, newHref, newLabel = "New Proforma", emptyTitle = "Nothing here yet", emptyNote = "Generate your first proforma — it takes under a minute.",
}: {
  documents: DocRow[];
  title: string;
  subtitle: string;
  newHref?: string;
  newLabel?: string;
  emptyTitle?: string;
  emptyNote?: string;
}) {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title={title}
        subtitle={`${documents.length} document${documents.length === 1 ? "" : "s"} · ${subtitle}`}
        actions={
          newHref ? (
            <Button size="sm" asChild className="gap-1.5">
              <Link href={newHref}><Plus className="w-4 h-4" /> {newLabel}</Link>
            </Button>
          ) : undefined
        }
      />

      {documents.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <FileText className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">{emptyTitle}</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">{emptyNote}</p>
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="hidden sm:grid items-center gap-3 px-4 py-2 border-b" style={{ gridTemplateColumns: "110px 1fr 130px 110px 110px", borderColor: "var(--border)" }}>
            {["Number", "Client", "Status", "Total", ""].map(h => (
              <span key={h} className="os-text-meta font-semibold uppercase tracking-wide" style={{ fontSize: 11 }}>{h}</span>
            ))}
          </div>
          {documents.map((doc, i) => (
            <div
              key={doc.id}
              className="os-row-hover relative block sm:grid sm:grid-cols-[110px_1fr_130px_110px_110px] items-center gap-3 px-4 py-2.5"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <Link href={`/app/quotes/${doc.id}`} className="absolute inset-0" aria-label={`Open ${doc.number}`} />

              {/* Mobile card layout */}
              <div className="flex sm:hidden items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{doc.number}</p>
                  <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>{doc.company.name}</p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    <Badge tone={STATUS_TONE[doc.status] ?? "neutral"}>{doc.status.replace(/_/g, " ")}</Badge>
                    <span className="os-text-meta">{friendlyDay(doc.createdAt)}</span>
                  </div>
                </div>
                <span className="os-text-number text-sm shrink-0" style={{ color: "var(--text)" }}>{formatKES(doc.total, { compact: true })}</span>
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{doc.number}</p>
                <p className="os-text-meta">{friendlyDay(doc.createdAt)}</p>
              </div>
              <p className="hidden sm:block text-sm truncate" style={{ color: "var(--text)" }}>{doc.company.name}</p>
              <div className="hidden sm:block"><Badge tone={STATUS_TONE[doc.status] ?? "neutral"}>{doc.status.replace(/_/g, " ")}</Badge></div>
              <span className="hidden sm:block os-text-number text-sm" style={{ color: "var(--text)" }}>{formatKES(doc.total, { compact: true })}</span>
              <div className="relative z-10 hidden sm:flex justify-end">
                {doc.balance > 0 && (
                  <RequestPaymentButton documentId={doc.id} label={doc.paidAmount > 0 ? "Balance" : "Request"} size="sm" variant="secondary" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
