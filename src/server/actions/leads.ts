"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";

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

/**
 * Converts a lead into a deal — the only way leads become pipeline
 * opportunities. Creates (or reuses) the Company/Contact so the deal has
 * somewhere to live, links the lead to the new deal, and marks it CONVERTED.
 */
export async function convertLeadToDealAction(leadId: string) {
  const user = await requirePermission("pipeline.write");
  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");
  if (lead.convertedDealId) throw new Error("Lead already converted");

  const result = await db.$transaction(async (tx) => {
    let companyId = lead.companyId;
    let contactId: string | null = null;

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
    contactId = contact.id;

    const deal = await tx.deal.create({
      data: {
        title: lead.interestedProduct ? `${lead.interestedProduct} — ${lead.companyNameRaw || lead.name}` : `${lead.companyNameRaw || lead.name} opportunity`,
        companyId,
        contactId,
        value: lead.value || 0,
        stage: "IDENTIFIED",
        temperature: lead.temperature,
        ownerId: lead.ownerId || user.id,
        productKeys: lead.interestedProduct ? JSON.stringify([lead.interestedProduct]) : "[]",
      },
    });

    await tx.lead.update({ where: { id: leadId }, data: { status: "CONVERTED", convertedDealId: deal.id, companyId } });

    return deal;
  });

  await writeAudit({ actorId: user.id, action: "CONVERT_LEAD", entityType: "Lead", entityId: leadId, after: { dealId: result.id } });
  revalidatePath("/app/leads");
  revalidatePath("/app/deals");
  revalidatePath("/app/clients");
  revalidatePath("/app");
  return result;
}

export async function deleteLeadAction(id: string) {
  const user = await requirePermission("pipeline.write");
  await db.lead.delete({ where: { id } });
  await writeAudit({ actorId: user.id, action: "DELETE_LEAD", entityType: "Lead", entityId: id });
  revalidatePath("/app/leads");
}
