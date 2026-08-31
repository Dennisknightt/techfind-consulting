"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import {
  LEAD_STAGES, TEMPERATURES, NEXT_ACTION_TYPES, LOST_REASONS,
  type LeadStage, type Temperature, type NextActionType, type LostReason,
} from "@/lib/os/leadStage";

export interface CreateLeadInput {
  name: string;
  companyNameRaw?: string;
  phone?: string;
  email?: string;
  industry?: string;
  interestedProduct?: string;
  source?: string;
  value?: number;
  temperature?: string;
  ownerId?: string;
}

export async function createLeadAction(input: CreateLeadInput) {
  const user = await requirePermission("pipeline.write");
  if (!input.name.trim()) throw new Error("Name is required");

  const lead = await db.lead.create({
    data: {
      name: input.name.trim(),
      companyNameRaw: input.companyNameRaw?.trim() || null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      industry: input.industry || null,
      interestedProduct: input.interestedProduct || null,
      source: input.source || "MANUAL",
      value: input.value ?? 0,
      temperature: input.temperature || "WARM",
      ownerId: input.ownerId || user.id,
    },
  });

  await writeAudit({ actorId: user.id, action: "CREATE_LEAD", entityType: "Lead", entityId: lead.id, after: lead });
  revalidatePath("/app/leads");
  revalidatePath("/app");
  return lead;
}

export async function updateLeadAction(id: string, patch: Partial<CreateLeadInput> & { status?: string; nextAction?: string; nextActionDue?: Date | null }) {
  const user = await requirePermission("pipeline.write");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) throw new Error("Lead not found");

  const lead = await db.lead.update({
    where: { id },
    data: {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.companyNameRaw !== undefined ? { companyNameRaw: patch.companyNameRaw } : {}),
      ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
      ...(patch.email !== undefined ? { email: patch.email } : {}),
      ...(patch.industry !== undefined ? { industry: patch.industry } : {}),
      ...(patch.interestedProduct !== undefined ? { interestedProduct: patch.interestedProduct } : {}),
      ...(patch.value !== undefined ? { value: patch.value } : {}),
      ...(patch.temperature !== undefined ? { temperature: patch.temperature } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.ownerId !== undefined ? { ownerId: patch.ownerId } : {}),
      ...(patch.nextAction !== undefined ? { nextAction: patch.nextAction } : {}),
      ...(patch.nextActionDue !== undefined ? { nextActionDue: patch.nextActionDue } : {}),
    },
  });

  await writeAudit({ actorId: user.id, action: "UPDATE_LEAD", entityType: "Lead", entityId: id, before, after: lead });
  revalidatePath("/app/leads");
  revalidatePath("/app");
  return lead;
}

export async function updateLeadStageAction(id: string, stage: LeadStage) {
  const user = await requirePermission("pipeline.write");
  if (!LEAD_STAGES.includes(stage)) throw new Error("Invalid stage");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) throw new Error("Lead not found");
  if (before.convertedDealId) throw new Error("This lead already converted to a deal");

  const lead = await db.lead.update({ where: { id }, data: { status: stage } });
  await writeAudit({ actorId: user.id, action: "UPDATE_LEAD_STAGE", entityType: "Lead", entityId: id, before: { status: before.status }, after: { status: stage } });
  revalidatePath("/app/leads");
  revalidatePath(`/app/leads/${id}`);
  revalidatePath("/app");
  return lead;
}

export async function updateLeadTemperatureAction(id: string, temperature: Temperature) {
  const user = await requirePermission("pipeline.write");
  if (!TEMPERATURES.includes(temperature)) throw new Error("Invalid temperature");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) throw new Error("Lead not found");

  const lead = await db.lead.update({ where: { id }, data: { temperature } });
  await writeAudit({ actorId: user.id, action: "UPDATE_LEAD_TEMPERATURE", entityType: "Lead", entityId: id, before: { temperature: before.temperature }, after: { temperature } });
  revalidatePath("/app/leads");
  revalidatePath(`/app/leads/${id}`);
  revalidatePath("/app");
  return lead;
}

export async function updateLeadNextActionAction(id: string, input: { type: NextActionType; due: Date | null; note?: string }) {
  const user = await requirePermission("pipeline.write");
  if (!NEXT_ACTION_TYPES.includes(input.type)) throw new Error("Invalid action type");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) throw new Error("Lead not found");

  const lead = await db.lead.update({
    where: { id },
    data: { nextActionType: input.type, nextActionDue: input.due, nextAction: input.note?.trim() || null },
  });
  await writeAudit({
    actorId: user.id, action: "UPDATE_LEAD_NEXT_ACTION", entityType: "Lead", entityId: id,
    before: { nextActionType: before.nextActionType, nextActionDue: before.nextActionDue },
    after: { nextActionType: input.type, nextActionDue: input.due },
  });
  revalidatePath("/app/leads");
  revalidatePath(`/app/leads/${id}`);
  revalidatePath("/app");
  return lead;
}

/**
 * Marks a lead Won: the only way leads become pipeline deals. Creates (or
 * reuses) the Company/Contact, creates the Deal with the confirmed value and
 * product selection, links the lead to it, and stamps wonAt/wonProductKeys
 * so the win is attributable even though the lead's own status flips to
 * CONVERTED (see isLeadWon in leadStage.ts).
 */
export async function markLeadWonAction(leadId: string, input: { value: number; productKeys: string[] }) {
  const user = await requirePermission("pipeline.write");
  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");
  if (lead.convertedDealId) throw new Error("Lead already converted");
  if (!input.productKeys.length) throw new Error("Select at least one product");
  if (input.value < 0) throw new Error("Value can't be negative");

  const products = await db.product.findMany({ where: { key: { in: input.productKeys } } });
  const productNames = products.map(p => p.name);

  const result = await db.$transaction(async (tx) => {
    let companyId = lead.companyId;

    if (!companyId) {
      const company = await tx.company.create({
        data: {
          name: lead.companyNameRaw || lead.name,
          industry: lead.industry,
          phone: lead.phone,
          email: lead.email,
          source: lead.source,
          ownerId: lead.ownerId || user.id,
        },
      });
      companyId = company.id;
    }

    const contact = await tx.contact.create({
      data: { companyId, name: lead.name, phone: lead.phone, email: lead.email, isPrimary: true },
    });

    const deal = await tx.deal.create({
      data: {
        title: productNames.length ? `${productNames.join(" + ")} — ${lead.companyNameRaw || lead.name}` : `${lead.companyNameRaw || lead.name} opportunity`,
        companyId,
        contactId: contact.id,
        value: input.value,
        stage: "IDENTIFIED",
        temperature: lead.temperature,
        ownerId: lead.ownerId || user.id,
        productKeys: JSON.stringify(input.productKeys),
      },
    });

    const updatedLead = await tx.lead.update({
      where: { id: leadId },
      data: {
        status: "CONVERTED",
        convertedDealId: deal.id,
        companyId,
        value: input.value,
        wonAt: new Date(),
        wonProductKeys: JSON.stringify(input.productKeys),
      },
    });

    return { deal, lead: updatedLead };
  });

  await writeAudit({ actorId: user.id, action: "MARK_LEAD_WON", entityType: "Lead", entityId: leadId, after: { dealId: result.deal.id, value: input.value, productKeys: input.productKeys } });
  revalidatePath("/app/leads");
  revalidatePath(`/app/leads/${leadId}`);
  revalidatePath("/app/deals");
  revalidatePath("/app/clients");
  revalidatePath("/app");
  return result;
}

export async function markLeadLostAction(id: string, input: { reason: LostReason; note?: string }) {
  const user = await requirePermission("pipeline.write");
  if (!LOST_REASONS.includes(input.reason)) throw new Error("Invalid reason");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) throw new Error("Lead not found");
  if (before.convertedDealId) throw new Error("This lead already converted to a deal");

  const lead = await db.lead.update({
    where: { id },
    data: { status: "LOST", lostReason: input.reason, lostNote: input.note?.trim() || null, lostAt: new Date() },
  });

  await writeAudit({ actorId: user.id, action: "MARK_LEAD_LOST", entityType: "Lead", entityId: id, before: { status: before.status }, after: { status: "LOST", lostReason: input.reason } });
  revalidatePath("/app/leads");
  revalidatePath(`/app/leads/${id}`);
  revalidatePath("/app");
  return lead;
}

export async function reopenLeadAction(id: string) {
  const user = await requirePermission("pipeline.write");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) throw new Error("Lead not found");
  if (before.convertedDealId) throw new Error("Won leads can't be reopened — see the deal instead");

  const lead = await db.lead.update({
    where: { id },
    data: { status: "NEW", lostReason: null, lostNote: null, lostAt: null },
  });

  await writeAudit({ actorId: user.id, action: "REOPEN_LEAD", entityType: "Lead", entityId: id, before: { status: before.status }, after: { status: "NEW" } });
  revalidatePath("/app/leads");
  revalidatePath(`/app/leads/${id}`);
  revalidatePath("/app");
  return lead;
}

export async function deleteLeadAction(id: string) {
  const user = await requirePermission("pipeline.write");
  await db.lead.delete({ where: { id } });
  await writeAudit({ actorId: user.id, action: "DELETE_LEAD", entityType: "Lead", entityId: id });
  revalidatePath("/app/leads");
}
