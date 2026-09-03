import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { can } from "@/server/auth/roles";
import { db } from "@/server/db";
import { CommunicationsHub } from "@/components/os/communications/CommunicationsHub";

export const metadata: Metadata = { title: "Communications — Techfind" };

export default async function CommunicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const user = await requireUser();
  const { company: initialCompanyId } = await searchParams;

  const companies = await db.company.findMany({
    include: {
      communications: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { communications: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  // Companies with at least one logged touch surface first, most-recent first;
  // companies with none (not yet contacted) trail behind, newest client first.
  const sorted = [...companies].sort((a, b) => {
    const at = a.communications[0]?.createdAt?.getTime() ?? 0;
    const bt = b.communications[0]?.createdAt?.getTime() ?? 0;
    return bt - at;
  });

  return (
    <CommunicationsHub
      companies={sorted}
      currentUserId={user.id}
      initialCompanyId={initialCompanyId}
      canLog={can(user.role, "communications.write")}
    />
  );
}
