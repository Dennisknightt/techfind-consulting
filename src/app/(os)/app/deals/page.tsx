import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { PipelineView } from "@/components/os/deals/PipelineView";

export const metadata: Metadata = { title: "Deals — Techfind" };

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const user = await requireUser();
  const { new: openCreate } = await searchParams;

  const [deals, users, products] = await Promise.all([
    db.deal.findMany({
      where: { stage: { not: "LOST" } },
      include: { company: true, owner: true },
      orderBy: { createdAt: "desc" },
    }),
    db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.product.findMany({ where: { isQuickChip: true, active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return <PipelineView initialDeals={deals} users={users} products={products} currentUserId={user.id} openCreateOnLoad={openCreate === "1"} />;
}
