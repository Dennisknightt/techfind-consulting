import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { can } from "@/server/auth/roles";
import { db } from "@/server/db";
import { getTaxConfigAction } from "@/server/actions/settings";
import { ProformaGenerator } from "@/components/os/documents/ProformaGenerator";
import { NoAccess } from "@/components/os/common/NoAccess";

export const metadata: Metadata = { title: "New Proforma — Techfind" };

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ deal?: string }>;
}) {
  const user = await requireUser();
  if (!can(user.role, "documents.write")) {
    return <NoAccess note="Creating quotes and proformas is restricted to Sales, Management and Super Admin." />;
  }
  const { deal: dealId } = await searchParams;

  const [products, quickItems, packages, tax, deal] = await Promise.all([
    db.product.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.quickItem.findMany({ where: { global: true }, orderBy: { sortOrder: "asc" } }),
    db.package.findMany({ orderBy: { sortOrder: "asc" } }),
    getTaxConfigAction(),
    dealId ? db.deal.findUnique({ where: { id: dealId }, include: { company: true, contact: true } }) : null,
  ]);

  return (
    <ProformaGenerator
      products={products}
      quickItems={quickItems}
      packages={packages}
      tax={tax}
      initialDeal={deal}
    />
  );
}
