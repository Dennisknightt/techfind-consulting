import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { ProjectDetail } from "@/components/os/projects/ProjectDetail";

export const metadata: Metadata = { title: "Project — Techfind" };

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: {
      company: true,
      deal: true,
      document: true,
      owner: true,
      tasks: { include: { assignee: true }, orderBy: [{ status: "asc" }, { dueAt: "asc" }] },
      updates: { include: { author: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  const [users, payments] = await Promise.all([
    db.user.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.payment.findMany({ where: { documentId: project.documentId ?? undefined, status: "SUCCESSFUL" }, orderBy: { paidAt: "desc" } }),
  ]);

  return <ProjectDetail project={project} users={users} payments={payments} />;
}
