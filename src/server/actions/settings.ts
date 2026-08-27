"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";

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
