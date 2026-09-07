import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { getDealDetailAction } from "@/server/actions/deals";
import { DealDetail } from "@/components/os/deals/DealDetail";

export const metadata: Metadata = { title: "Deal — Techfind" };

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;

  const deal = await getDealDetailAction(id);
  if (!deal) notFound();

  const users = await db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } });

  return <DealDetail deal={deal} users={users} />;
}
