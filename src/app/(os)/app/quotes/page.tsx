import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";

export const metadata: Metadata = { title: "Quotes & Proformas — Techfind" };

export default async function QuotesPage() {
  await requireUser();
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Quotes & Proformas" subtitle="Generate and send a professional proforma in under 30 seconds" />
      <div className="mt-6">
        <ComingSoon
          title="The Quick Proforma Generator arrives in Phase 4"
          note="Customer → items → pricing → payment terms → live PDF preview → Send via WhatsApp with a secure payment link attached."
        />
      </div>
    </div>
  );
}
