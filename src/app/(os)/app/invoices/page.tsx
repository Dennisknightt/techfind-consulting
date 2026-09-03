import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { DocumentsList } from "@/components/os/documents/DocumentsList";

export const metadata: Metadata = { title: "Invoices — Techfind" };

export default async function InvoicesPage() {
  await requireUser();

  const documents = await db.salesDocument.findMany({
    where: { type: "INVOICE" },
    include: { company: true, owner: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <DocumentsList
      documents={documents}
      title="Invoices"
      subtitle="What's owed, by whom, and since when"
      emptyTitle="No invoices yet"
      emptyNote="Invoices are generated automatically once a proforma is paid."
    />
  );
}
