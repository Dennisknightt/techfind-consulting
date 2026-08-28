import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";

export const metadata: Metadata = { title: "Invoices — Techfind" };

export default async function InvoicesPage() {
  await requireUser();
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Invoices" subtitle="What's owed, by whom, and since when" />
      <div className="mt-6">
        <ComingSoon title="Invoices arrive in Phase 4" note="Generated automatically from paid proformas, carrying the full document chain." />
      </div>
    </div>
  );
}
