"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow, requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";

/** Minimal client creation — Name, Company, Phone only. No forced full CRM onboarding. */
export interface QuickClientInput {
  name: string; // contact name
  companyName: string;
  phone?: string;
  email?: string;
}

export async function createQuickClientAction(input: QuickClientInput) {
  const user = await requirePermission("clients.write");
  if (!input.companyName.trim()) throw new Error("Company name is required");

  const result = await db.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: input.companyName.trim(),
        phone: input.phone?.trim() || null,
        email: input.email?.trim() || null,
        source: "MANUAL",
        ownerId: user.id,
      },
    });
    const contact = await tx.contact.create({
      data: {
        companyId: company.id,
        name: input.name.trim() || input.companyName.trim(),
        phone: input.phone?.trim() || null,
        email: input.email?.trim() || null,
        isPrimary: true,
      },
    });
    return { company, contact };
  });

  await writeAudit({ actorId: user.id, action: "CREATE_CLIENT", entityType: "Company", entityId: result.company.id, after: result.company });
  revalidatePath("/app/clients");
  revalidatePath("/app");
  return result;
}

export interface FullClientInput extends QuickClientInput {
  industry?: string;
  website?: string;
  address?: string;
  notes?: string;
}

export async function createClientAction(input: FullClientInput) {
  const user = await requirePermission("clients.write");
  const result = await db.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: input.companyName.trim(),
        industry: input.industry || null,
        phone: input.phone?.trim() || null,
        email: input.email?.trim() || null,
        website: input.website?.trim() || null,
        address: input.address?.trim() || null,
        notes: input.notes?.trim() || null,
        source: "MANUAL",
        ownerId: user.id,
      },
    });
    const contact = await tx.contact.create({
      data: {
        companyId: company.id,
        name: input.name.trim() || input.companyName.trim(),
        phone: input.phone?.trim() || null,
        email: input.email?.trim() || null,
        isPrimary: true,
      },
    });
    return { company, contact };
  });

  await writeAudit({ actorId: user.id, action: "CREATE_CLIENT", entityType: "Company", entityId: result.company.id, after: result.company });
  revalidatePath("/app/clients");
  revalidatePath("/app");
  return result;
}

export async function searchCompaniesAction(query: string) {
  await requireUserOrThrow();
  const q = query.trim();
  if (!q) {
    return db.company.findMany({ orderBy: { createdAt: "desc" }, take: 8 });
  }
  return db.company.findMany({
    where: { OR: [{ name: { contains: q } }, { phone: { contains: q } }, { email: { contains: q } }] },
    take: 8,
  });
}

export async function updateClientAction(id: string, patch: Partial<FullClientInput> & { ownerId?: string }) {
  const user = await requirePermission("clients.write");
  const before = await db.company.findUnique({ where: { id } });
  if (!before) throw new Error("Client not found");

  const company = await db.company.update({
    where: { id },
    data: {
      ...(patch.companyName !== undefined ? { name: patch.companyName } : {}),
      ...(patch.industry !== undefined ? { industry: patch.industry } : {}),
      ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
      ...(patch.email !== undefined ? { email: patch.email } : {}),
      ...(patch.website !== undefined ? { website: patch.website } : {}),
      ...(patch.address !== undefined ? { address: patch.address } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      ...(patch.ownerId !== undefined ? { ownerId: patch.ownerId } : {}),
    },
  });

  await writeAudit({ actorId: user.id, action: "UPDATE_CLIENT", entityType: "Company", entityId: id, before, after: company });
  revalidatePath("/app/clients");
  revalidatePath(`/app/clients/${id}`);
  return company;
}

const FOOTPRINT_STATUSES = ["NOT_PITCHED", "OPPORTUNITY", "ACTIVE"] as const;
export type FootprintStatus = (typeof FOOTPRINT_STATUSES)[number];

export async function updateFootprintStatusAction(companyId: string, productId: string, status: FootprintStatus) {
  const user = await requirePermission("clients.write");
  if (!FOOTPRINT_STATUSES.includes(status)) throw new Error("Invalid status");

  const existing = await db.productFootprint.findUnique({ where: { companyId_productId: { companyId, productId } } });

  const footprint = await db.productFootprint.upsert({
    where: { companyId_productId: { companyId, productId } },
    create: {
      companyId,
      productId,
      status,
      activatedAt: status === "ACTIVE" ? new Date() : null,
    },
    update: {
      status,
      // First transition into ACTIVE stamps activatedAt; later cycling away and back never overwrites it.
      ...(status === "ACTIVE" && !existing?.activatedAt ? { activatedAt: new Date() } : {}),
    },
  });

  await writeAudit({
    actorId: user.id, action: "UPDATE_PRODUCT_FOOTPRINT", entityType: "ProductFootprint", entityId: footprint.id,
    before: existing, after: footprint,
  });
  revalidatePath(`/app/clients/${companyId}`);
  revalidatePath("/app/clients");
  return footprint;
}
