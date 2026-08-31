"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow, requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { AVATAR_COLORS } from "@/lib/os/avatarColors";
import type { TaxConfig } from "@/lib/os/documentMath";

const DEFAULT_TAX: TaxConfig = { mode: "EXCLUSIVE", rate: 16, label: "VAT" };

export async function getTaxConfigAction(): Promise<TaxConfig> {
  const row = await db.setting.findUnique({ where: { key: "tax_config" } });
  if (!row) return DEFAULT_TAX;
  try {
    return { ...DEFAULT_TAX, ...JSON.parse(row.value) };
  } catch {
    return DEFAULT_TAX;
  }
}

export async function updateTaxConfigAction(config: TaxConfig): Promise<void> {
  const user = await requirePermission("tax.write");
  const before = await getTaxConfigAction();

  await db.setting.upsert({
    where: { key: "tax_config" },
    update: { value: JSON.stringify(config), updatedById: user.id },
    create: { key: "tax_config", value: JSON.stringify(config), updatedById: user.id },
  });

  await writeAudit({ actorId: user.id, action: "UPDATE_TAX_CONFIG", entityType: "Setting", entityId: "tax_config", before, after: config });
  revalidatePath("/app/settings");
  revalidatePath("/app/quotes/new");
}

export async function updateExperienceSettingsAction(input: {
  welcomeSoundEnabled: boolean;
  welcomeSoundVolume: number;
}): Promise<void> {
  const user = await requireUserOrThrow();
  const volume = Math.max(0, Math.min(1, input.welcomeSoundVolume));

  await db.user.update({
    where: { id: user.id },
    data: { welcomeSoundEnabled: input.welcomeSoundEnabled, welcomeSoundVolume: volume },
  });

  await writeAudit({
    actorId: user.id,
    action: "UPDATE_EXPERIENCE_SETTINGS",
    entityType: "User",
    entityId: user.id,
    after: { welcomeSoundEnabled: input.welcomeSoundEnabled, welcomeSoundVolume: volume },
  });

  revalidatePath("/app/settings");
}

export async function updateProfileAction(input: { name: string; phone: string; avatarColor: string }): Promise<void> {
  const user = await requireUserOrThrow();
  const name = input.name.trim();
  if (!name) throw new Error("Name can't be empty");
  if (!AVATAR_COLORS.includes(input.avatarColor)) throw new Error("Invalid colour");

  const before = await db.user.findUnique({ where: { id: user.id } });
  const updated = await db.user.update({
    where: { id: user.id },
    data: { name, phone: input.phone.trim() || null, avatarColor: input.avatarColor },
  });

  await writeAudit({ actorId: user.id, action: "UPDATE_PROFILE", entityType: "User", entityId: user.id, before, after: updated });
  revalidatePath("/app/settings");
  revalidatePath("/app");
}

export async function changeEmailAction(input: { newEmail: string; currentPassword: string }): Promise<void> {
  const user = await requireUserOrThrow();
  const newEmail = input.newEmail.trim().toLowerCase();
  if (!newEmail || !newEmail.includes("@")) throw new Error("Enter a valid email address");

  const row = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  const valid = await verifyPassword(input.currentPassword, row.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");

  if (newEmail === row.email) return; // no-op

  const existing = await db.user.findUnique({ where: { email: newEmail } });
  if (existing) throw new Error("Another account already uses that email");

  await db.user.update({ where: { id: user.id }, data: { email: newEmail } });
  await writeAudit({ actorId: user.id, action: "CHANGE_EMAIL", entityType: "User", entityId: user.id, before: { email: row.email }, after: { email: newEmail } });
  revalidatePath("/app/settings");
}

export async function changePasswordAction(input: { currentPassword: string; newPassword: string }): Promise<void> {
  const user = await requireUserOrThrow();
  if (input.newPassword.length < 8) throw new Error("New password must be at least 8 characters");

  const row = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  const valid = await verifyPassword(input.currentPassword, row.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");

  const passwordHash = await hashPassword(input.newPassword);
  await db.user.update({ where: { id: user.id }, data: { passwordHash } });

  await writeAudit({ actorId: user.id, action: "CHANGE_PASSWORD", entityType: "User", entityId: user.id });
}
