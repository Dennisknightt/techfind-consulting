"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, Company, User } from "@prisma/client";
import { Search, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Input } from "@/components/os/ui/Input";
import { Badge } from "@/components/os/ui/Badge";
import { CompanyAvatar, Avatar } from "@/components/os/ui/Avatar";
import { PROJECT_STAGES, PROJECT_STAGE_LABEL, projectStageIndex } from "@/lib/os/projects";
import { daysBetween } from "@/lib/os/dates";

type ProjectRow = Project & { company: Company; owner: User | null };

function stageTone(stage: string): "success" | "accent" | "neutral" {
  if (stage === "LIVE" || stage === "MAINTENANCE") return "success";
  if (stage === "DEPOSIT") return "neutral";
  return "accent";
}

export function ProjectsView({ initialProjects }: { initialProjects: ProjectRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return initialProjects.filter(p => {
      if (stageFilter !== "ALL" && p.stage !== stageFilter) return false;
      if (query.trim() && !p.company.name.toLowerCase().includes(query.toLowerCase()) && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [initialProjects, stageFilter, query]);

  const activeCount = initialProjects.filter(p => p.stage !== "LIVE" && p.stage !== "MAINTENANCE").length;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Projects" subtitle={`${initialProjects.length} projects · ${activeCount} in delivery`} />

      <div className="flex flex-wrap items-center gap-2 mt-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects…" className="pl-8" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["ALL", ...PROJECT_STAGES].map(s => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
              style={{
                background: stageFilter === s ? "var(--accent-soft)" : "var(--surface-hover)",
                color: stageFilter === s ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {s === "ALL" ? "All" : PROJECT_STAGE_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <FolderKanban className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">No projects yet</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">A project starts itself the moment a client's deposit clears.</p>
        </div>
      ) : (
        <div className="space-y-2 mt-5">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => router.push(`/app/projects/${p.id}`)}
              className="w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-[var(--radius-lg)] transition-shadow hover:shadow-[var(--shadow-sm)]"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <CompanyAvatar name={p.company.name} size={38} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{p.company.name}</p>
                <p className="text-xs text-[var(--text-faint)] truncate">{p.name}</p>
              </div>
              <div className="hidden sm:block w-40">
                <div className="h-1.5 rounded-full" style={{ background: "var(--surface-hover)" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${((projectStageIndex(p.stage) + 1) / PROJECT_STAGES.length) * 100}%`, background: "var(--accent)" }}
                  />
                </div>
              </div>
              <Badge tone={stageTone(p.stage)}>{PROJECT_STAGE_LABEL[p.stage] ?? p.stage}</Badge>
              <span className="hidden md:inline text-xs text-[var(--text-faint)] w-24 text-right">
                {daysBetween(p.startedAt)}d in delivery
              </span>
              {p.owner && <Avatar name={p.owner.name} color={p.owner.avatarColor} size={26} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
