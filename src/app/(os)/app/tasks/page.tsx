import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { can } from "@/server/auth/roles";
import { db } from "@/server/db";
import { TasksView } from "@/components/os/tasks/TasksView";

export const metadata: Metadata = { title: "Tasks — Techfind" };

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const user = await requireUser();
  const { new: openCreate } = await searchParams;
  const canCreate = can(user.role, "tasks.write");

  const [tasks, users] = await Promise.all([
    db.task.findMany({
      where: { status: "OPEN" },
      include: { assignee: true, deal: { include: { company: true } } },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      take: 300,
    }),
    db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <TasksView
      initialTasks={tasks}
      users={users}
      currentUserId={user.id}
      openCreateOnLoad={openCreate === "1" && canCreate}
      canCreate={canCreate}
    />
  );
}
