"use client";

import Link from "next/link";
import type { SalesDocument, Company, User } from "@prisma/client";
import { Plus, FileText } from "lucide-react";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Badge } from "@/components/os/ui/Badge";
import { formatKES } from "@/lib/os/money";
import { friendlyDay } from "@/lib/os/dates";

type DocRow = SalesDocument & { company: Company; owner: User | null };

const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  DRAFT: "neutral", SENT: "accent", VIEWED: "accent",
  PARTIALLY_PAID: "warning", PAID: "success", EXPIRED: "danger", CANCELLED: "danger",
};

export function DocumentsList({ documents, title, subtitle, newHref }: { documents: DocRow[]; title: string; subtitle: string; newHref: string }) {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title={title}
        subtitle={`${documents.length} document${documents.length === 1 ? "" : "s"} · ${subtitle}`}
        actions={
          <Button size="sm" asChild className="gap-1.5">
            <Link href={newHref}><Plus className="w-4 h-4" /> New Proforma</Link>
          </Button>
        }
      />

      {documents.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <FileText className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">Nothing here yet</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">Generate your first proforma — it takes under a minute.</p>
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="hidden sm:grid items-center gap-3 px-4 py-2 border-b" style={{ gridTemplateColumns: "110px 1fr 130px 110px", borderColor: "var(--border)" }}>
            {["Number", "Client", "Status", "Total"].map(h => (
              <span key={h} className="os-text-meta font-semibold uppercase tracking-wide" style={{ fontSize: 11 }}>{h}</span>
            ))}
          </div>
          {documents.map((doc, i) => (
            <Link
              key={doc.id}
              href={`/app/quotes/${doc.id}`}
              className="os-row-hover grid grid-cols-2 sm:grid-cols-[110px_1fr_130px_110px] items-center gap-3 px-4 py-2.5"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{doc.number}</p>
                <p className="os-text-meta">{friendlyDay(doc.createdAt)}</p>
              </div>
              <p className="hidden sm:block text-sm truncate" style={{ color: "var(--text)" }}>{doc.company.name}</p>
              <div className="hidden sm:block"><Badge tone={STATUS_TONE[doc.status] ?? "neutral"}>{doc.status.replace(/_/g, " ")}</Badge></div>
              <span className="os-text-number text-sm text-right sm:text-left" style={{ color: "var(--text)" }}>{formatKES(doc.total, { compact: true })}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
