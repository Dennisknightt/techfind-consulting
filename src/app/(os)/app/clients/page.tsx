import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { can } from "@/server/auth/roles";
import { db } from "@/server/db";
import { ClientsView } from "@/components/os/clients/ClientsView";

export const metadata: Metadata = { title: "Clients — Techfind" };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const user = await requireUser();
  const { new: openCreate } = await searchParams;

  const companies = await db.company.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { deals: true } },
      deals: { where: { stage: "WON" }, select: { value: true } },
    },
    take: 300,
  });

  const canCreate = can(user.role, "clients.write");
  return <ClientsView initialCompanies={companies} openCreateOnLoad={openCreate === "1" && canCreate} canCreate={canCreate} />;
}
