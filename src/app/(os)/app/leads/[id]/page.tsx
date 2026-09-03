import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { LeadDetail } from "@/components/os/leads/LeadDetail";

export const metadata: Metadata = { title: "Lead — Techfind" };

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;

  const [lead, users, products] = await Promise.all([
    db.lead.findUnique({ where: { id }, include: { owner: true } }),
    db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.product.findMany({ where: { isQuickChip: true, active: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!lead) notFound();

  return <LeadDetail lead={lead} users={users} products={products} />;
}
