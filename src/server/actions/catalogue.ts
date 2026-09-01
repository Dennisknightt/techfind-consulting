"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow, requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { toJson, parseJsonArray } from "@/server/json";

export interface CatalogueProduct {
  id: string;
  key: string;
  category: string;
  name: string;
  isRecurring: boolean;
  isQuickChip: boolean;
  quickPrices: number[];
  active: boolean;
  sortOrder: number;
}

export interface CatalogueQuickItem {
  id: string;
  label: string;
  productKeys: string[];
  totalPrice: number;
  recurring: boolean;
  sortOrder: number;
}

export interface CataloguePackage {
  id: string;
  name: string;
  description: string | null;
  productKeys: string[];
  price: number;
  sortOrder: number;
}

export interface CatalogueData {
  products: CatalogueProduct[];
  quickItems: CatalogueQuickItem[];
  packages: CataloguePackage[];
}

export async function listCatalogueAction(): Promise<CatalogueData> {
  await requireUserOrThrow();
  const [products, quickItems, packages] = await Promise.all([
    db.product.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
    db.quickItem.findMany({ where: { global: true }, orderBy: { sortOrder: "asc" } }),
    db.package.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return {
    products: products.map(p => ({
      id: p.id, key: p.key, category: p.category, name: p.name,
      isRecurring: p.isRecurring, isQuickChip: p.isQuickChip,
      quickPrices: parseJsonArray<number>(p.quickPrices), active: p.active, sortOrder: p.sortOrder,
    })),
    quickItems: quickItems.map(q => ({
      id: q.id, label: q.label, productKeys: parseJsonArray<string>(q.productKeys),
      totalPrice: q.totalPrice, recurring: q.recurring, sortOrder: q.sortOrder,
    })),
    packages: packages.map(pkg => ({
      id: pkg.id, name: pkg.name, description: pkg.description,
      productKeys: parseJsonArray<string>(pkg.productKeys), price: pkg.price, sortOrder: pkg.sortOrder,
    })),
  };
}

export interface CatalogueMutationResult {
  error?: string;
}

export interface CreateQuickItemResult {
  error?: string;
  item?: CatalogueQuickItem;
}

export interface CreatePackageResult {
  error?: string;
  pkg?: CataloguePackage;
}

/* ─── Products — quick prices, quick-chip visibility, active only ────────
   Base products (key/category/name) are seeded, not created here — adding
   a genuinely new product line touches the Quick Proforma Generator's
   category grouping and is out of scope for this settings page. */

export async function updateProductAction(
  id: string,
  input: { quickPrices: number[]; isQuickChip: boolean; active: boolean },
): Promise<CatalogueMutationResult> {
  const actor = await requirePermission("settings.write");
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return { error: "Product not found." };

  const quickPrices = input.quickPrices.filter(n => Number.isFinite(n) && n >= 0);

  await db.product.update({
    where: { id },
    data: { quickPrices: toJson(quickPrices), isQuickChip: input.isQuickChip, active: input.active },
  });
  await writeAudit({
    actorId: actor.id, action: "CATALOGUE_PRODUCT_UPDATED", entityType: "Product", entityId: id,
    before: { quickPrices: parseJsonArray<number>(product.quickPrices), isQuickChip: product.isQuickChip, active: product.active },
    after: { quickPrices, isQuickChip: input.isQuickChip, active: input.active },
  });
  revalidatePath("/app/settings");
  return {};
}

/* ─── Quick items ────────────────────────────────────────────────────── */

export interface QuickItemInput {
  label: string;
  productKeys: string[];
  totalPrice: number;
  recurring: boolean;
}

function validateQuickItemInput(input: QuickItemInput): string | null {
  if (!input.label.trim()) return "A label is required.";
  if (input.productKeys.length === 0) return "Pick at least one product.";
  if (!Number.isFinite(input.totalPrice) || input.totalPrice <= 0) return "Enter a valid price.";
  return null;
}

export async function createQuickItemAction(input: QuickItemInput): Promise<CreateQuickItemResult> {
  const actor = await requirePermission("settings.write");
  const error = validateQuickItemInput(input);
  if (error) return { error };

  const created = await db.quickItem.create({
    data: {
      label: input.label.trim(), productKeys: toJson(input.productKeys),
      totalPrice: input.totalPrice, recurring: input.recurring, global: true,
    },
  });
  await writeAudit({ actorId: actor.id, action: "CATALOGUE_QUICK_ITEM_CREATED", entityType: "QuickItem", entityId: created.id, after: input });
  revalidatePath("/app/settings");
  return {
    item: {
      id: created.id, label: created.label, productKeys: parseJsonArray<string>(created.productKeys),
      totalPrice: created.totalPrice, recurring: created.recurring, sortOrder: created.sortOrder,
    },
  };
}

export async function updateQuickItemAction(id: string, input: QuickItemInput): Promise<CatalogueMutationResult> {
  const actor = await requirePermission("settings.write");
  const error = validateQuickItemInput(input);
  if (error) return { error };

  const existing = await db.quickItem.findUnique({ where: { id } });
  if (!existing) return { error: "Quick item not found." };

  await db.quickItem.update({
    where: { id },
    data: {
      label: input.label.trim(), productKeys: toJson(input.productKeys),
      totalPrice: input.totalPrice, recurring: input.recurring,
    },
  });
  await writeAudit({
    actorId: actor.id, action: "CATALOGUE_QUICK_ITEM_UPDATED", entityType: "QuickItem", entityId: id,
    before: { label: existing.label, productKeys: parseJsonArray<string>(existing.productKeys), totalPrice: existing.totalPrice, recurring: existing.recurring },
    after: input,
  });
  revalidatePath("/app/settings");
  return {};
}

export async function deleteQuickItemAction(id: string): Promise<CatalogueMutationResult> {
  const actor = await requirePermission("settings.write");
  const existing = await db.quickItem.findUnique({ where: { id } });
  if (!existing) return { error: "Quick item not found." };

  await db.quickItem.delete({ where: { id } });
  await writeAudit({ actorId: actor.id, action: "CATALOGUE_QUICK_ITEM_DELETED", entityType: "QuickItem", entityId: id, before: { label: existing.label } });
  revalidatePath("/app/settings");
  return {};
}

/* ─── Packages ───────────────────────────────────────────────────────── */

export interface PackageInput {
  name: string;
  description: string;
  productKeys: string[];
  price: number;
}

function validatePackageInput(input: PackageInput): string | null {
  if (!input.name.trim()) return "A name is required.";
  if (input.productKeys.length === 0) return "Pick at least one product.";
  if (!Number.isFinite(input.price) || input.price <= 0) return "Enter a valid price.";
  return null;
}

export async function createPackageAction(input: PackageInput): Promise<CreatePackageResult> {
  const actor = await requirePermission("settings.write");
  const error = validatePackageInput(input);
  if (error) return { error };

  const created = await db.package.create({
    data: {
      name: input.name.trim(), description: input.description.trim() || null,
      productKeys: toJson(input.productKeys), price: input.price,
    },
  });
  await writeAudit({ actorId: actor.id, action: "CATALOGUE_PACKAGE_CREATED", entityType: "Package", entityId: created.id, after: input });
  revalidatePath("/app/settings");
  return {
    pkg: {
      id: created.id, name: created.name, description: created.description,
      productKeys: parseJsonArray<string>(created.productKeys), price: created.price, sortOrder: created.sortOrder,
    },
  };
}

export async function updatePackageAction(id: string, input: PackageInput): Promise<CatalogueMutationResult> {
  const actor = await requirePermission("settings.write");
  const error = validatePackageInput(input);
  if (error) return { error };

  const existing = await db.package.findUnique({ where: { id } });
  if (!existing) return { error: "Package not found." };

  await db.package.update({
    where: { id },
    data: {
      name: input.name.trim(), description: input.description.trim() || null,
      productKeys: toJson(input.productKeys), price: input.price,
    },
  });
  await writeAudit({
    actorId: actor.id, action: "CATALOGUE_PACKAGE_UPDATED", entityType: "Package", entityId: id,
    before: { name: existing.name, description: existing.description, productKeys: parseJsonArray<string>(existing.productKeys), price: existing.price },
    after: input,
  });
  revalidatePath("/app/settings");
  return {};
}

export async function deletePackageAction(id: string): Promise<CatalogueMutationResult> {
  const actor = await requirePermission("settings.write");
  const existing = await db.package.findUnique({ where: { id } });
  if (!existing) return { error: "Package not found." };

  await db.package.delete({ where: { id } });
  await writeAudit({ actorId: actor.id, action: "CATALOGUE_PACKAGE_DELETED", entityType: "Package", entityId: id, before: { name: existing.name } });
  revalidatePath("/app/settings");
  return {};
}
