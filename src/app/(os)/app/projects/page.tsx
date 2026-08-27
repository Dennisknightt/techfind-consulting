import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";

export const metadata: Metadata = { title: "Projects — Techfind" };

export default async function ProjectsPage() {
  await requireUser();
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Projects" subtitle="From deposit paid to live and in maintenance" />
      <div className="mt-6">
        <ComingSoon
          title="Projects arrive in Phase 6"
          note="Deposit → Requirements → Design → Development → Client Review → Changes → Deployment → Training → Live → Maintenance — carrying full sales context."
        />
      </div>
    </div>
  );
}
