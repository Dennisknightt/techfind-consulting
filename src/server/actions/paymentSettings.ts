"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { listProviderNames } from "@/server/payments/registry";

export async function setActivePaymentProviderAction(name: string): Promise<void> {
  const user = await requirePermission("tax.write"); // Super Admin only — same bar as tax config
  if (!listProviderNames().includes(name)) throw new Error("Unknown provider");

  await db.setting.upsert({
    where: { key: "payment_provider" },
    update: { value: JSON.stringify({ active: name }), updatedById: user.id },
    create: { key: "payment_provider", value: JSON.stringify({ active: name }), updatedById: user.id },
  });

  await writeAudit({ actorId: user.id, action: "SET_PAYMENT_PROVIDER", entityType: "Setting", entityId: "payment_provider", after: { active: name } });
  revalidatePath("/app/settings");
}
