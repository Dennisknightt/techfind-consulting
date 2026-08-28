"use server";

import { requireUserOrThrow } from "@/server/auth/guard";
import { buildClaudeBriefing } from "@/server/intelligence/briefing";

export async function prepareClaudeBriefingAction(): Promise<string> {
  await requireUserOrThrow();
  return buildClaudeBriefing();
}
