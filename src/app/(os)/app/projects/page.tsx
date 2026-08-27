import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { ProjectsView } from "@/components/os/projects/ProjectsView";

export const metadata: Metadata = { title: "Projects — Techfind" };

export default async function ProjectsPage() {
  await requireUser();
  const projects = await db.project.findMany({
    include: { company: true, owner: true },
    orderBy: { startedAt: "desc" },
  });

  return <ProjectsView initialProjects={projects} />;
}
