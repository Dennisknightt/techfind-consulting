"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow, requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
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
