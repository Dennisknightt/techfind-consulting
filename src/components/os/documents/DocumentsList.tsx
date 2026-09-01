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

export function DocumentsList({ documents, title, subtitle, newHref, canCreate }: { documents: DocRow[]; title: string; subtitle: string; newHref: string; canCreate: boolean }) {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title={title}
        subtitle={`${documents.length} document${documents.length === 1 ? "" : "s"} · ${subtitle}`}
        actions={
          canCreate && (
            <Button size="sm" asChild className="gap-1.5">
              <Link href={newHref}><Plus className="w-4 h-4" /> New Proforma</Link>
            </Button>
          )
        }
      />

      {documents.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <FileText className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">Nothing here yet</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">Generate your first proforma — it takes under a minute.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {documents.map(doc => (
            <Link
              key={doc.id}
              href={`/app/quotes/${doc.id}`}
              className="flex items-center gap-4 px-4 py-3.5 rounded-[var(--radius-lg)] hover:bg-[var(--surface-hover)] transition-colors flex-wrap"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="min-w-[140px]">
                <p className="text-sm font-bold text-[var(--text)]">{doc.number}</p>
                <p className="text-[11px] text-[var(--text-faint)]">{friendlyDay(doc.createdAt)}</p>
              </div>
              <div className="flex-1 min-w-[160px]">
                <p className="text-sm text-[var(--text)]">{doc.company.name}</p>
              </div>
              <Badge tone={STATUS_TONE[doc.status] ?? "neutral"}>{doc.status.replace(/_/g, " ")}</Badge>
              <span className="text-sm font-bold shrink-0" style={{ color: "var(--accent)" }}>{formatKES(doc.total, { compact: true })}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
