"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";

export interface ScheduleMeetingInput {
  companyId: string;
  contactId?: string;
  dealId?: string;
  scheduledAt: Date;
  agenda?: string;
}

export async function scheduleMeetingAction(input: ScheduleMeetingInput) {
  const user = await requireUserOrThrow();
  const meeting = await db.meeting.create({
    data: {
      companyId: input.companyId,
      contactId: input.contactId,
      dealId: input.dealId,
      scheduledAt: input.scheduledAt,
      agenda: input.agenda || null,
    },
  });
  await writeAudit({ actorId: user.id, action: "SCHEDULE_MEETING", entityType: "Meeting", entityId: meeting.id, after: meeting });
  revalidatePath("/app/meetings");
  revalidatePath("/app");
  return meeting;
}

export interface CompleteMeetingInput {
  temperature: string;
  budget?: string;
  decisionMaker?: string;
  problem?: string;
  objection?: string;
  productsDiscussed?: string[];
  nextAction?: string;
  nextActionDue?: Date | null;
}

export async function completeMeetingAction(id: string, input: CompleteMeetingInput) {
  const user = await requireUserOrThrow();
  const before = await db.meeting.findUnique({ where: { id } });
  if (!before) throw new Error("Meeting not found");

  const meeting = await db.meeting.update({
    where: { id },
    data: {
      status: "DONE",
      completedAt: new Date(),
      temperature: input.temperature,
      budget: input.budget || null,
      decisionMaker: input.decisionMaker || null,
      problem: input.problem || null,
      objection: input.objection || null,
      productsDiscussed: JSON.stringify(input.productsDiscussed ?? []),
      nextAction: input.nextAction || null,
      nextActionDue: input.nextActionDue ?? null,
    },
  });

  // Post-meeting temperature/next-action should flow straight onto the deal —
  // that's the whole point of capturing it fast.
  if (before.dealId) {
    await db.deal.update({
      where: { id: before.dealId },
      data: {
        temperature: input.temperature,
        lastContactAt: new Date(),
        ...(input.nextAction ? { nextAction: input.nextAction, nextActionDue: input.nextActionDue ?? null } : {}),
      },
    });
    revalidatePath(`/app/deals/${before.dealId}`);
  }

  await writeAudit({ actorId: user.id, action: "COMPLETE_MEETING", entityType: "Meeting", entityId: id, before, after: meeting });
  revalidatePath("/app/meetings");
  revalidatePath("/app");
  return meeting;
}

export async function cancelMeetingAction(id: string) {
  const user = await requireUserOrThrow();
  const meeting = await db.meeting.update({ where: { id }, data: { status: "CANCELLED" } });
  await writeAudit({ actorId: user.id, action: "CANCEL_MEETING", entityType: "Meeting", entityId: id });
  revalidatePath("/app/meetings");
  return meeting;
}
