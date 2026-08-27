import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";

export const metadata: Metadata = { title: "Payments — Techfind" };

export default async function PaymentsPage() {
  await requireUser();
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Payments" subtitle="Every payment, reference, method and reconciliation status" />
      <div className="mt-6">
        <ComingSoon
          title="The payment ledger arrives in Phase 5"
          note="Secure payment links, the Techfind payment page, gateway webhooks, automatic reconciliation and Needs Matching."
        />
      </div>
    </div>
  );
}
