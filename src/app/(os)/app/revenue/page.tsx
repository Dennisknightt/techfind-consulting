import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";

export const metadata: Metadata = { title: "Revenue — Techfind" };

export default async function RevenuePage() {
  await requireUser();
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Revenue" subtitle="What's expected, what's received, what's outstanding — today" />
      <div className="mt-6">
        <ComingSoon
          title="The Revenue Control Centre arrives in Phase 5"
          note="Recent payments, awaiting payment, overdue, needs matching, upcoming and recurring revenue — action-first, not a report."
        />
      </div>
    </div>
  );
}
