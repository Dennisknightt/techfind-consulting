"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueAt?: Date | null;
  priority?: string;
  assigneeId?: string;
  relatedType?: string;
  relatedId?: string;
  dealId?: string;
  meetingId?: string;
}

export async function createTaskAction(input: CreateTaskInput) {
  const user = await requireUserOrThrow();
  if (!input.title.trim()) throw new Error("Title is required");

  const task = await db.task.create({
    data: {
      title: input.title.trim(),
      description: input.description || null,
      dueAt: input.dueAt ?? null,
      priority: input.priority || "MEDIUM",
      assigneeId: input.assigneeId || user.id,
      creatorId: user.id,
      relatedType: input.relatedType,
      relatedId: input.relatedId,
      dealId: input.dealId,
      meetingId: input.meetingId,
    },
  });

  await writeAudit({ actorId: user.id, action: "CREATE_TASK", entityType: "Task", entityId: task.id, after: task });
  revalidatePath("/app/tasks");
  revalidatePath("/app");
  if (input.dealId) revalidatePath(`/app/deals/${input.dealId}`);
  return task;
}

export async function completeTaskAction(id: string, done: boolean) {
  const user = await requireUserOrThrow();
  const task = await db.task.update({
    where: { id },
    data: { status: done ? "DONE" : "OPEN", completedAt: done ? new Date() : null },
  });
  await writeAudit({ actorId: user.id, action: done ? "COMPLETE_TASK" : "REOPEN_TASK", entityType: "Task", entityId: id });
  revalidatePath("/app/tasks");
  revalidatePath("/app");
  if (task.dealId) revalidatePath(`/app/deals/${task.dealId}`);
  return task;
}

export async function updateTaskAction(id: string, patch: Partial<CreateTaskInput>) {
  const user = await requireUserOrThrow();
  const before = await db.task.findUnique({ where: { id } });
  if (!before) throw new Error("Task not found");

  const task = await db.task.update({
    where: { id },
    data: {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.dueAt !== undefined ? { dueAt: patch.dueAt } : {}),
      ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
      ...(patch.assigneeId !== undefined ? { assigneeId: patch.assigneeId } : {}),
    },
  });

  await writeAudit({ actorId: user.id, action: "UPDATE_TASK", entityType: "Task", entityId: id, before, after: task });
  revalidatePath("/app/tasks");
  return task;
}

export async function deleteTaskAction(id: string) {
  const user = await requireUserOrThrow();
  await db.task.delete({ where: { id } });
  await writeAudit({ actorId: user.id, action: "DELETE_TASK", entityType: "Task", entityId: id });
  revalidatePath("/app/tasks");
}
