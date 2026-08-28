"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow, requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";

export interface CreateDealInput {
  title: string;
  companyId: string;
  contactId?: string;
  value: number;
  temperature?: string;
  ownerId?: string;
  productKeys?: string[];
}

export async function dealsForCompanyAction(companyId: string) {
  await requireUserOrThrow();
  return db.deal.findMany({ where: { companyId, stage: { not: "LOST" } }, orderBy: { createdAt: "desc" } });
}

export async function createDealAction(input: CreateDealInput) {
  const user = await requirePermission("pipeline.write");
  const deal = await db.deal.create({
    data: {
      title: input.title,
      companyId: input.companyId,
      contactId: input.contactId,
      value: input.value,
      temperature: input.temperature || "WARM",
      ownerId: input.ownerId || user.id,
      productKeys: JSON.stringify(input.productKeys ?? []),
    },
  });
  await writeAudit({ actorId: user.id, action: "CREATE_DEAL", entityType: "Deal", entityId: deal.id, after: deal });
  revalidatePath("/app/deals");
  revalidatePath("/app");
  return deal;
}

export async function updateDealStageAction(id: string, stage: string) {
  const user = await requirePermission("pipeline.write");
  const before = await db.deal.findUnique({ where: { id } });
  if (!before) throw new Error("Deal not found");

  const data: Record<string, unknown> = { stage, stageEnteredAt: new Date() };
  if (stage === "WON" && !before.wonAt) data.wonAt = new Date();

  const deal = await db.deal.update({ where: { id }, data });
  await writeAudit({ actorId: user.id, action: "MOVE_DEAL_STAGE", entityType: "Deal", entityId: id, before: { stage: before.stage }, after: { stage } });
  revalidatePath("/app/deals");
  revalidatePath(`/app/deals/${id}`);
  revalidatePath("/app");
  return deal;
}

export async function markDealLostAction(id: string, reason: string) {
  const user = await requirePermission("pipeline.write");
  const before = await db.deal.findUnique({ where: { id } });
  if (!before) throw new Error("Deal not found");

  const deal = await db.deal.update({
    where: { id },
    data: { stage: "LOST", lostAt: new Date(), lostReason: reason, stageEnteredAt: new Date() },
  });

  await writeAudit({ actorId: user.id, action: "MARK_DEAL_LOST", entityType: "Deal", entityId: id, before: { stage: before.stage }, after: { reason } });
  revalidatePath("/app/deals");
  revalidatePath(`/app/deals/${id}`);
  revalidatePath("/app");
  return deal;
}

export async function updateDealAction(id: string, patch: {
  title?: string;
  value?: number;
  temperature?: string;
  nextAction?: string | null;
  nextActionDue?: Date | null;
  lastContactAt?: Date;
  ownerId?: string;
}) {
  const user = await requirePermission("pipeline.write");
  const before = await db.deal.findUnique({ where: { id } });
  if (!before) throw new Error("Deal not found");

  const deal = await db.deal.update({ where: { id }, data: patch });
  await writeAudit({ actorId: user.id, action: "UPDATE_DEAL", entityType: "Deal", entityId: id, before, after: deal });
  revalidatePath("/app/deals");
  revalidatePath(`/app/deals/${id}`);
  revalidatePath("/app");
  return deal;
}
