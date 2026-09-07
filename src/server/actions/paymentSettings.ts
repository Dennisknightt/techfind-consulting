"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { listProviderNames } from "@/server/payments/registry";
import { requestAccountBalance, getMpesaBalanceState, type MpesaBalanceState } from "@/server/payments/mpesaBalance";

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

/** Kicks off a Daraja Account Balance request — the figure itself lands later via a webhook, so this just confirms Safaricom accepted the request. */
export async function requestMpesaBalanceAction(): Promise<void> {
  const user = await requirePermission("tax.write"); // same bar as the provider toggle above
  await requestAccountBalance(user.id);
  await writeAudit({ actorId: user.id, action: "REQUEST_MPESA_BALANCE", entityType: "Setting", entityId: "mpesa_account_balance" });
  revalidatePath("/app/settings");
}

export async function getMpesaBalanceStatusAction(): Promise<MpesaBalanceState | null> {
  await requirePermission("tax.write");
  return getMpesaBalanceState();
}
