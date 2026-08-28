import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { DealDetail } from "@/components/os/deals/DealDetail";

export const metadata: Metadata = { title: "Deal — Techfind" };

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;

  const deal = await db.deal.findUnique({
    where: { id },
    include: {
      company: true,
      contact: true,
      owner: true,
      meetings: { orderBy: { scheduledAt: "desc" } },
      tasks: { where: { status: "OPEN" }, include: { assignee: true }, orderBy: { dueAt: "asc" } },
      project: true,
      documents: { orderBy: { createdAt: "desc" } },
      communications: { include: { author: true }, orderBy: { createdAt: "desc" }, take: 30 },
    },
  });

  if (!deal) notFound();

  const users = await db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } });

  return <DealDetail deal={deal} users={users} />;
}
