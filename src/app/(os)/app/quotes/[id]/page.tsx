import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/guard";
import { getDocumentAction } from "@/server/actions/documents";
import { DocumentDetail } from "@/components/os/documents/DocumentDetail";

export const metadata: Metadata = { title: "Document — Techfind" };

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;

  const doc = await getDocumentAction(id).catch(() => null);
  if (!doc) notFound();

  return <DocumentDetail doc={doc} />;
}
