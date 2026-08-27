import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { LeadsView } from "@/components/os/leads/LeadsView";

export const metadata: Metadata = { title: "Leads — Techfind" };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const user = await requireUser();
  const { new: openCreate } = await searchParams;

  const [leads, users, products] = await Promise.all([
    db.lead.findMany({ orderBy: { createdAt: "desc" }, include: { owner: true }, take: 200 }),
    db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.product.findMany({ where: { isQuickChip: true, active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <LeadsView
      initialLeads={leads}
      users={users}
      products={products}
      currentUserId={user.id}
      openCreateOnLoad={openCreate === "1"}
    />
  );
}
