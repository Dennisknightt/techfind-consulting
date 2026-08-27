import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";

export const metadata: Metadata = { title: "Communications — Techfind" };

export default async function CommunicationsPage() {
  await requireUser();
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Communications" subtitle="WhatsApp, email, calls and website enquiries — one thread per customer" />
      <div className="mt-6">
        <ComingSoon
          title="The unified inbox arrives in Phase 3"
          note="Conversations · customer context · Reply, Call, WhatsApp, Task, Meeting, Quote, Proforma, Mark Won — all from one screen."
        />
      </div>
    </div>
  );
}
