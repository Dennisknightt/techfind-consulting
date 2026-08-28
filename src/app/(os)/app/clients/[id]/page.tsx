import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { ClientDetail } from "@/components/os/clients/ClientDetail";

export const metadata: Metadata = { title: "Client — Techfind" };

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const company = await db.company.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { isPrimary: "desc" } },
      owner: true,
      deals: { include: { owner: true }, orderBy: { createdAt: "desc" } },
      meetings: { orderBy: { scheduledAt: "desc" }, take: 10 },
      footprint: { include: { product: true } },
    },
  });

  if (!company) notFound();

  const dealIds = company.deals.map(d => d.id);
  const tasks = dealIds.length
    ? await db.task.findMany({ where: { dealId: { in: dealIds }, status: "OPEN" }, include: { assignee: true }, orderBy: { dueAt: "asc" } })
    : [];

  const [allProducts, users] = await Promise.all([
    db.product.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return <ClientDetail company={company} tasks={tasks} allProducts={allProducts} users={users} currentUserId={user.id} />;
}
