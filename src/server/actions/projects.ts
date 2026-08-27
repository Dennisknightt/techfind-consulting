"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission, requireUserOrThrow } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { PROJECT_STAGES } from "@/lib/os/projects";

export async function advanceProjectStageAction(id: string, stage: string, note?: string) {
  const user = await requirePermission("projects.write");
  if (!PROJECT_STAGES.includes(stage as (typeof PROJECT_STAGES)[number])) throw new Error("Unknown stage");

  const before = await db.project.findUnique({ where: { id } });
  if (!before) throw new Error("Project not found");

  const data: Record<string, unknown> = { stage };
  if (stage === "LIVE" && !before.liveAt) data.liveAt = new Date();

  const project = await db.project.update({ where: { id }, data });
  await db.projectUpdate.create({
    data: { projectId: id, authorId: user.id, fromStage: before.stage, toStage: stage, note: note || null },
  });

  await writeAudit({ actorId: user.id, action: "ADVANCE_PROJECT_STAGE", entityType: "Project", entityId: id, before: { stage: before.stage }, after: { stage } });
  revalidatePath("/app/projects");
  revalidatePath(`/app/projects/${id}`);
  revalidatePath("/app");
  return project;
}

export async function updateProjectAction(id: string, patch: {
  ownerId?: string;
  targetLiveDate?: Date | null;
  notes?: string | null;
}) {
  const user = await requirePermission("projects.write");
  const before = await db.project.findUnique({ where: { id } });
  if (!before) throw new Error("Project not found");

  const project = await db.project.update({ where: { id }, data: patch });
  await writeAudit({ actorId: user.id, action: "UPDATE_PROJECT", entityType: "Project", entityId: id, before, after: project });
  revalidatePath("/app/projects");
  revalidatePath(`/app/projects/${id}`);
  return project;
}

export async function addProjectNoteAction(id: string, note: string) {
  const user = await requireUserOrThrow();
  if (!note.trim()) throw new Error("Note is required");

  const update = await db.projectUpdate.create({
    data: { projectId: id, authorId: user.id, note: note.trim() },
  });
  revalidatePath(`/app/projects/${id}`);
  return update;
}
