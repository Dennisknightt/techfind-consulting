import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { ClientsView } from "@/components/os/clients/ClientsView";

export const metadata: Metadata = { title: "Clients — Techfind" };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  await requireUser();
  const { new: openCreate } = await searchParams;

  const companies = await db.company.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { deals: true } },
      deals: { where: { stage: "WON" }, select: { value: true } },
    },
    take: 300,
  });

  return <ClientsView initialCompanies={companies} openCreateOnLoad={openCreate === "1"} />;
}
