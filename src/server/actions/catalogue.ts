"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { toJson } from "@/server/json";

export async function updateProductAction(id: string, input: { active: boolean; isQuickChip: boolean; quickPrices: number[] }): Promise<void> {
  const user = await requirePermission("settings.write");
  const prices = input.quickPrices.filter(p => Number.isFinite(p) && p >= 0);

  const before = await db.product.findUnique({ where: { id } });
  if (!before) throw new Error("Product not found");

  const updated = await db.product.update({
    where: { id },
    data: { active: input.active, isQuickChip: input.isQuickChip, quickPrices: toJson(prices) },
  });

  await writeAudit({ actorId: user.id, action: "UPDATE_PRODUCT", entityType: "Product", entityId: id, before, after: updated });
  revalidatePath("/app/settings");
  revalidatePath("/app/quotes/new");
}

export interface QuickItemInput {
  label: string;
  productKeys: string[];
  totalPrice: number;
  recurring: boolean;
}

export async function createQuickItemAction(input: QuickItemInput): Promise<void> {
  const user = await requirePermission("settings.write");
  if (!input.label.trim()) throw new Error("Label is required");
  if (!(input.totalPrice > 0)) throw new Error("Price must be greater than 0");

  const item = await db.quickItem.create({
    data: {
      label: input.label.trim(),
      productKeys: toJson(input.productKeys),
      totalPrice: input.totalPrice,
      recurring: input.recurring,
      ownerId: user.id,
      global: true,
    },
  });

  await writeAudit({ actorId: user.id, action: "CREATE_QUICK_ITEM", entityType: "QuickItem", entityId: item.id, after: item });
  revalidatePath("/app/settings");
  revalidatePath("/app/quotes/new");
}

export async function updateQuickItemAction(id: string, input: QuickItemInput): Promise<void> {
  const user = await requirePermission("settings.write");
  if (!input.label.trim()) throw new Error("Label is required");
  if (!(input.totalPrice > 0)) throw new Error("Price must be greater than 0");

  const before = await db.quickItem.findUnique({ where: { id } });
  if (!before) throw new Error("Quick item not found");

  const updated = await db.quickItem.update({
    where: { id },
    data: { label: input.label.trim(), productKeys: toJson(input.productKeys), totalPrice: input.totalPrice, recurring: input.recurring },
  });

  await writeAudit({ actorId: user.id, action: "UPDATE_QUICK_ITEM", entityType: "QuickItem", entityId: id, before, after: updated });
  revalidatePath("/app/settings");
  revalidatePath("/app/quotes/new");
}

export async function deleteQuickItemAction(id: string): Promise<void> {
  const user = await requirePermission("settings.write");
  const before = await db.quickItem.findUnique({ where: { id } });
  if (!before) throw new Error("Quick item not found");

  await db.quickItem.delete({ where: { id } });
  await writeAudit({ actorId: user.id, action: "DELETE_QUICK_ITEM", entityType: "QuickItem", entityId: id, before });
  revalidatePath("/app/settings");
  revalidatePath("/app/quotes/new");
}

export interface PackageInput {
  name: string;
  description: string;
  productKeys: string[];
  price: number;
}

export async function createPackageAction(input: PackageInput): Promise<void> {
  const user = await requirePermission("settings.write");
  if (!input.name.trim()) throw new Error("Name is required");
  if (!(input.price > 0)) throw new Error("Price must be greater than 0");

  const pkg = await db.package.create({
    data: {
      name: input.name.trim(),
      description: input.description.trim() || null,
      productKeys: toJson(input.productKeys),
      price: input.price,
    },
  });

  await writeAudit({ actorId: user.id, action: "CREATE_PACKAGE", entityType: "Package", entityId: pkg.id, after: pkg });
  revalidatePath("/app/settings");
  revalidatePath("/app/quotes/new");
}

export async function updatePackageAction(id: string, input: PackageInput): Promise<void> {
  const user = await requirePermission("settings.write");
  if (!input.name.trim()) throw new Error("Name is required");
  if (!(input.price > 0)) throw new Error("Price must be greater than 0");

  const before = await db.package.findUnique({ where: { id } });
  if (!before) throw new Error("Package not found");

  const updated = await db.package.update({
    where: { id },
    data: { name: input.name.trim(), description: input.description.trim() || null, productKeys: toJson(input.productKeys), price: input.price },
  });

  await writeAudit({ actorId: user.id, action: "UPDATE_PACKAGE", entityType: "Package", entityId: id, before, after: updated });
  revalidatePath("/app/settings");
  revalidatePath("/app/quotes/new");
}

export async function deletePackageAction(id: string): Promise<void> {
  const user = await requirePermission("settings.write");
  const before = await db.package.findUnique({ where: { id } });
  if (!before) throw new Error("Package not found");

  await db.package.delete({ where: { id } });
  await writeAudit({ actorId: user.id, action: "DELETE_PACKAGE", entityType: "Package", entityId: id, before });
  revalidatePath("/app/settings");
  revalidatePath("/app/quotes/new");
}
