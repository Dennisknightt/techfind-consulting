import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { DocumentsList } from "@/components/os/documents/DocumentsList";

export const metadata: Metadata = { title: "Quotes & Proformas — Techfind" };

export default async function QuotesPage() {
  await requireUser();

  const documents = await db.salesDocument.findMany({
    where: { type: { in: ["QUOTE", "PROFORMA"] } },
    include: { company: true, owner: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return <DocumentsList documents={documents} title="Quotes & Proformas" subtitle="Generate and send a professional proforma in under 30 seconds" newHref="/app/quotes/new" />;
}
