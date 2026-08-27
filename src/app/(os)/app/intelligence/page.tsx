import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";

export const metadata: Metadata = { title: "Intelligence — Techfind" };

export default async function IntelligencePage() {
  await requireUser();
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Intelligence" subtitle="What Techfind's data is telling you to do next" />
      <div className="mt-6">
        <ComingSoon
          title="Intelligence arrives in Phase 7"
          note="Revenue at risk, unfollowed opportunities, upsell candidates, and Prepare with Claude exports — once there's real pipeline data to reason over."
        />
      </div>
    </div>
  );
}
