"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow, requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { nextDocumentNumber } from "@/server/documents/numbering";
import { computeForSubmission, type DraftItemInput } from "@/server/documents/compute";

const PIPELINE_ORDER = [
  "IDENTIFIED", "CONTACTED", "INTERESTED", "DEMO_BOOKED", "DEMO_DONE",
  "PROPOSAL", "PROFORMA_SENT", "DEPOSIT_PENDING", "NEGOTIATING", "WON",
];

export interface CreateDocumentInput {
  type: "QUOTE" | "PROFORMA";
  companyId: string;
  contactId?: string;
  dealId?: string;
  items: DraftItemInput[];
  discount: number;
  paymentTermsLabel: string;
  depositPercent: number;
  notes?: string;
  terms?: string;
  validUntilDays?: number;
}

const SESSION_TTL_DAYS = 30;

export async function createDocumentAction(input: CreateDocumentInput) {
  const user = await requirePermission("documents.write");
  if (input.items.length === 0) throw new Error("Add at least one item");

  const { totals, tax } = await computeForSubmission({
    items: input.items,
    discount: input.discount,
    depositPercent: input.depositPercent,
  });

  const number = await nextDocumentNumber(input.type);

  const doc = await db.$transaction(async (tx) => {
    const created = await tx.salesDocument.create({
      data: {
        type: input.type,
        number,
        companyId: input.companyId,
        contactId: input.contactId,
        dealId: input.dealId,
        subtotal: totals.subtotal,
        discount: totals.discount,
        taxMode: tax.mode,
        taxRate: tax.mode === "NONE" ? 0 : tax.rate,
        taxAmount: totals.taxAmount,
        total: totals.total,
        paymentTermsLabel: input.paymentTermsLabel,
        depositRequired: totals.depositRequired,
        balance: totals.balance,
        validUntil: input.validUntilDays ? new Date(Date.now() + input.validUntilDays * 86_400_000) : null,
        notes: input.notes || null,
        terms: input.terms || null,
        status: "DRAFT",
        ownerId: user.id,
        items: {
          create: input.items.map((it, i) => ({
            productKey: it.productKey,
            label: it.label,
            description: it.description || null,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            amount: it.quantity * it.unitPrice,
            sortOrder: i,
          })),
        },
      },
      include: { items: true, company: true },
    });

    // Every proforma/invoice gets a unique, opaque payment link the moment
    // it exists — the token references this session server-side, nothing
    // about the invoice is encoded in the URL itself.
    const amountDue = created.depositRequired > 0 ? created.depositRequired : created.total;
    if (amountDue > 0) {
      await tx.paymentSession.create({
        data: {
          token: randomBytes(24).toString("hex"),
          documentId: created.id,
          amountDue,
          expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000),
        },
      });
    }

    return created;
  });

  await writeAudit({ actorId: user.id, action: "CREATE_DOCUMENT", entityType: "SalesDocument", entityId: doc.id, after: doc });
  revalidatePath("/app/quotes");
  revalidatePath("/app/invoices");

  const withSession = await db.salesDocument.findUniqueOrThrow({
    where: { id: doc.id },
    include: { items: true, company: true, paymentSessions: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return withSession;
}

export async function getDocumentAction(id: string) {
  await requireUserOrThrow();
  const doc = await db.salesDocument.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
      company: true,
      contact: true,
      deal: true,
      owner: true,
      paymentSessions: { orderBy: { createdAt: "desc" }, take: 1 },
      payments: true,
    },
  });
  if (!doc) throw new Error("Document not found");
  return doc;
}

export async function markDocumentSentAction(id: string, opts?: { channel?: string; message?: string }) {
  const user = await requirePermission("documents.write");
  const doc = await db.salesDocument.findUnique({ where: { id }, include: { deal: true, company: true } });
  if (!doc) throw new Error("Document not found");

  const updated = await db.salesDocument.update({
    where: { id },
    data: { status: doc.status === "DRAFT" ? "SENT" : doc.status, sentAt: doc.sentAt ?? new Date() },
  });

  if (opts?.message) {
    await db.communication.create({
      data: {
        companyId: doc.companyId,
        contactId: doc.contactId,
        dealId: doc.dealId,
        channel: opts.channel || "WHATSAPP",
        direction: "OUTBOUND",
        subject: `${doc.type === "PROFORMA" ? "Proforma" : "Quote"} ${doc.number}`,
        body: opts.message,
        authorId: user.id,
      },
    });
  }

  // A sent proforma is real sales progress — nudge the deal forward, never backward.
  if (doc.dealId && doc.deal && doc.type === "PROFORMA") {
    const currentIdx = PIPELINE_ORDER.indexOf(doc.deal.stage);
    const targetIdx = PIPELINE_ORDER.indexOf("PROFORMA_SENT");
    if (currentIdx >= 0 && currentIdx < targetIdx) {
      await db.deal.update({ where: { id: doc.dealId }, data: { stage: "PROFORMA_SENT", stageEnteredAt: new Date(), lastContactAt: new Date() } });
    } else {
      await db.deal.update({ where: { id: doc.dealId }, data: { lastContactAt: new Date() } });
    }
  }

  await writeAudit({ actorId: user.id, action: "SEND_DOCUMENT", entityType: "SalesDocument", entityId: id, after: { status: updated.status } });
  revalidatePath("/app/quotes");
  revalidatePath(`/app/quotes/${id}`);
  if (doc.dealId) revalidatePath(`/app/deals/${doc.dealId}`);
  return updated;
}
