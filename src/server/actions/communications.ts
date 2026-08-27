"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";

export interface LogCommunicationInput {
  companyId: string;
  contactId?: string;
  dealId?: string;
  channel: string; // WHATSAPP | EMAIL | WEBSITE | CALL | META | TIKTOK | REFERRAL | NOTE
  direction: string; // OUTBOUND | INBOUND
  subject?: string;
  body: string;
}

export async function logCommunicationAction(input: LogCommunicationInput) {
  const user = await requireUserOrThrow();
  if (!input.body.trim()) throw new Error("Message can't be empty");

  const comm = await db.communication.create({
    data: {
      companyId: input.companyId,
      contactId: input.contactId,
      dealId: input.dealId,
      channel: input.channel,
      direction: input.direction,
      subject: input.subject || null,
      body: input.body.trim(),
      authorId: user.id,
    },
  });

  // A logged touch is a real interaction — keep the deal's "last contact" honest.
  if (input.dealId) {
    await db.deal.update({ where: { id: input.dealId }, data: { lastContactAt: new Date() } }).catch(() => null);
  }

  await writeAudit({ actorId: user.id, action: "LOG_COMMUNICATION", entityType: "Communication", entityId: comm.id, after: comm });
  revalidatePath("/app/communications");
  revalidatePath("/app");
  return comm;
}

export async function getThreadAction(companyId: string) {
  await requireUserOrThrow();
  return db.communication.findMany({
    where: { companyId },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });
}

/** Everything the right-hand context panel needs, fetched together on conversation open. */
export async function getConversationContextAction(companyId: string) {
  await requireUserOrThrow();
  const [company, primaryContact, deal] = await Promise.all([
    db.company.findUnique({ where: { id: companyId } }),
    db.contact.findFirst({ where: { companyId }, orderBy: { isPrimary: "desc" } }),
    db.deal.findFirst({
      where: { companyId, stage: { notIn: ["WON", "LOST"] } },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  if (!company) throw new Error("Client not found");
  return { company, primaryContact, deal };
}
