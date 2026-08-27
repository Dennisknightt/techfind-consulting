import "server-only";
import { db } from "@/server/db";
import { writeAudit } from "@/server/audit";
import type { SalesDocument } from "@prisma/client";

/**
 * The single trigger for sales → delivery handoff: a deposit payment that
 * clears on a document. Idempotent (dealId is unique on Project) so it's
 * safe to call from both the webhook and polling reconciliation paths.
 *
 * Most sales go through an explicit Deal, but the Quick Proforma Generator
 * also supports a walk-up sale directly against a company with no Deal
 * (minimal data entry, per product philosophy) — so a Deal is inferred
 * here (and backfilled onto the document) rather than required upfront.
 */
export async function handoffToProject(doc: SalesDocument & { company: { name: string } }): Promise<void> {
  let dealId = doc.dealId;

  if (!dealId) {
    const deal = await db.deal.create({
      data: {
        title: `${doc.company.name} — ${doc.number}`,
        companyId: doc.companyId,
        value: doc.total,
        stage: "WON",
        wonAt: new Date(),
        ownerId: doc.ownerId,
      },
    });
    await db.salesDocument.update({ where: { id: doc.id }, data: { dealId: deal.id } });
    dealId = deal.id;
  }

  const existing = await db.project.findUnique({ where: { dealId } });
  if (existing) return;

  const project = await db.project.create({
    data: {
      dealId,
      documentId: doc.id,
      companyId: doc.companyId,
      name: `${doc.company.name} — ${doc.number}`,
      stage: "DEPOSIT",
      ownerId: doc.ownerId,
    },
  });

  await db.projectUpdate.create({
    data: { projectId: project.id, toStage: "DEPOSIT", note: `Handed off from sales — deposit received on ${doc.number}.` },
  });

  if (doc.ownerId) {
    await db.notification.create({
      data: {
        userId: doc.ownerId,
        type: "PROJECT_STARTED",
        title: "📁 Project started",
        body: `${doc.company.name} is now in delivery — deposit received on ${doc.number}.`,
        relatedType: "PROJECT",
        relatedId: project.id,
      },
    });
  }

  await writeAudit({ action: "PROJECT_HANDOFF", entityType: "Project", entityId: project.id, after: project });
}
