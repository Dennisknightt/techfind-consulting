"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project, Company, User, Task, ProjectUpdate } from "@prisma/client";
import type { DealMoney, SalesDocumentMoney, PaymentMoney } from "@/lib/os/moneyTypes";
import { Building2, FileText, Check, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { Badge } from "@/components/os/ui/Badge";
import { Avatar } from "@/components/os/ui/Avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import { formatKES } from "@/lib/os/money";
import { friendlyDate, friendlyDay, timeAgo } from "@/lib/os/dates";
import { PROJECT_STAGES, PROJECT_STAGE_LABEL, projectStageIndex } from "@/lib/os/projects";
import { advanceProjectStageAction, updateProjectAction, addProjectNoteAction } from "@/server/actions/projects";
import { createTaskAction, completeTaskAction } from "@/server/actions/tasks";

type ProjectFull = Project & {
  company: Company;
  deal: DealMoney;
  document: SalesDocumentMoney | null;
  owner: User | null;
  tasks: (Task & { assignee: User | null })[];
  updates: (ProjectUpdate & { author: User | null })[];
};

export function ProjectDetail({ project: initialProject, users, payments }: { project: ProjectFull; users: User[]; payments: PaymentMoney[] }) {
  const [project, setProject] = useState(initialProject);
  const [savingStage, setSavingStage] = useState(false);
  const [savingOwner, setSavingOwner] = useState(false);
  const [targetLiveDate, setTargetLiveDate] = useState(project.targetLiveDate ? new Date(project.targetLiveDate).toISOString().slice(0, 10) : "");
  const [notes, setNotes] = useState(project.notes ?? "");
  const [savingDetails, setSavingDetails] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState(project.tasks);
  const [completing, setCompleting] = useState<Set<string>>(new Set());
  const [updates, setUpdates] = useState(project.updates);

  const stageIdx = projectStageIndex(project.stage);
  const nextStage = PROJECT_STAGES[stageIdx + 1];

  async function moveStage(stage: string) {
    setSavingStage(true);
    const prev = project.stage;
    setProject(p => ({ ...p, stage }));
    try {
      await advanceProjectStageAction(project.id, stage);
      toast.success(stage === "LIVE" ? "Project is live! 🚀" : `Moved to ${PROJECT_STAGE_LABEL[stage]}`);
      setUpdates(u => [{ id: `temp-${Date.now()}`, projectId: project.id, authorId: null, author: null, fromStage: prev, toStage: stage, note: null, createdAt: new Date() }, ...u]);
    } catch {
      toast.error("Couldn't move stage");
      setProject(p => ({ ...p, stage: prev }));
    } finally {
      setSavingStage(false);
    }
  }

  async function changeOwner(ownerId: string) {
    setSavingOwner(true);
    try {
      await updateProjectAction(project.id, { ownerId });
      const owner = users.find(u => u.id === ownerId) ?? null;
      setProject(p => ({ ...p, ownerId, owner }));
    } catch {
      toast.error("Couldn't reassign owner");
    } finally {
      setSavingOwner(false);
    }
  }

  async function saveDetails() {
    setSavingDetails(true);
    try {
      await updateProjectAction(project.id, {
        targetLiveDate: targetLiveDate ? new Date(targetLiveDate) : null,
        notes: notes || null,
      });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save");
    } finally {
      setSavingDetails(false);
    }
  }

  async function postNote() {
    if (!newNote.trim()) return;
    const text = newNote.trim();
    setNewNote("");
    try {
      const update = await addProjectNoteAction(project.id, text);
      setUpdates(u => [{ ...update, author: null }, ...u]);
    } catch {
      toast.error("Couldn't post update");
    }
  }

  async function addTask() {
    if (!newTaskTitle.trim()) return;
    const title = newTaskTitle.trim();
    setNewTaskTitle("");
    try {
      const task = await createTaskAction({ title, projectId: project.id });
      setTasks(t => [{ ...task, assignee: null }, ...t]);
    } catch {
      toast.error("Couldn't add task");
    }
  }

  async function complete(task: Task) {
    setCompleting(s => new Set(s).add(task.id));
    const done = task.status !== "DONE";
    setTasks(list => list.map(t => t.id === task.id ? { ...t, status: done ? "DONE" : "OPEN" } : t));
    try {
      await completeTaskAction(task.id, done);
    } catch {
      toast.error("Couldn't update task");
    } finally {
      setCompleting(s => { const n = new Set(s); n.delete(task.id); return n; });
    }
  }

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href={`/app/clients/${project.companyId}`} className="text-xs font-medium flex items-center gap-1 mb-1.5" style={{ color: "var(--accent)" }}>
            <Building2 className="w-3 h-3" /> {project.company.name}
          </Link>
          <h1 className="text-xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>{project.name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Link href={`/app/deals/${project.dealId}`} className="text-xs hover:underline" style={{ color: "var(--text-faint)" }}>{project.deal.title}</Link>
            {totalPaid > 0 && <span className="text-xs font-bold" style={{ color: "var(--success)" }}>{formatKES(totalPaid, { compact: true })} received</span>}
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="w-40">
            <Label>Owner</Label>
            <Select value={project.ownerId ?? ""} onValueChange={changeOwner} disabled={savingOwner}>
              <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
              <SelectContent>
                {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Label>Stage</Label>
            <Select value={project.stage} onValueChange={moveStage} disabled={savingStage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROJECT_STAGES.map(s => <SelectItem key={s} value={s}>{PROJECT_STAGE_LABEL[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stage progress */}
      <div className="mt-5 flex items-center gap-1">
        {PROJECT_STAGES.map((s, i) => (
          <div
            key={s}
            title={PROJECT_STAGE_LABEL[s]}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i <= stageIdx ? "var(--accent)" : "var(--surface-hover)" }}
          />
        ))}
      </div>
      {nextStage && (
        <div className="mt-3">
          <Button variant="secondary" size="sm" loading={savingStage} onClick={() => moveStage(nextStage)} className="gap-1.5">
            <Check className="w-3.5 h-3.5" /> Advance to {PROJECT_STAGE_LABEL[nextStage]}
          </Button>
        </div>
      )}

      {/* Target live date + notes */}
      <div className="mt-6 rounded-[var(--radius-lg)] p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-48">
            <Label>Target Live Date</Label>
            <Input type="date" value={targetLiveDate} onChange={e => setTargetLiveDate(e.target.value)} />
          </div>
          <div className="flex-1">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Scope, decisions, blockers…" />
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <Button size="sm" loading={savingDetails} onClick={saveDetails}>Save</Button>
        </div>
      </div>

      {project.document && (
        <Link
          href={`/app/quotes/${project.document.id}`}
          className="mt-4 flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)] hover:shadow-[var(--shadow-sm)] transition-shadow"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
            <FileText className="w-4 h-4" style={{ color: "var(--accent)" }} /> {project.document.number}
          </span>
          <span className="text-xs text-[var(--text-faint)]">{formatKES(project.document.total, { compact: true })} · view document</span>
        </Link>
      )}

      {/* Tasks */}
      <div className="mt-7">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Tasks</p>
        <div className="flex gap-2 mb-2.5">
          <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add a task…" className="flex-1" />
          <Button size="sm" variant="secondary" onClick={addTask} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Add</Button>
        </div>
        <div className="space-y-2">
          {tasks.length === 0 && <p className="text-xs text-[var(--text-faint)] px-1">No tasks yet.</p>}
          {tasks.map(t => (
            <div key={t.id} className="flex items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5" style={{ background: "var(--surface-hover)" }}>
              <button
                onClick={() => complete(t)}
                disabled={completing.has(t.id)}
                className="shrink-0 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-colors hover:border-[var(--accent)]"
                style={{ borderColor: t.status === "DONE" ? "var(--success)" : "var(--border-strong)", background: t.status === "DONE" ? "var(--success)" : "transparent" }}
              >
                {t.status === "DONE" && <Check className="w-2.5 h-2.5 text-white" />}
              </button>
              <span className="flex-1 text-xs text-[var(--text)]" style={{ textDecoration: t.status === "DONE" ? "line-through" : "none", opacity: t.status === "DONE" ? 0.5 : 1 }}>
                {t.title}
              </span>
              {t.assignee && <Avatar name={t.assignee.name} color={t.assignee.avatarColor} size={20} />}
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="mt-7">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Activity</p>
        <div className="flex gap-2 mb-3">
          <Input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === "Enter" && postNote()} placeholder="Post an update…" className="flex-1" />
          <Button size="sm" variant="secondary" onClick={postNote} className="gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Post</Button>
        </div>
        <div className="space-y-2">
          {updates.map(u => (
            <div key={u.id} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
              {u.author ? <Avatar name={u.author.name} color={u.author.avatarColor} size={22} /> : <div className="w-[22px] h-[22px] rounded-full shrink-0" style={{ background: "var(--accent-soft)" }} />}
              <div className="min-w-0 flex-1">
                {u.toStage && (
                  <p className="text-xs font-medium text-[var(--text)]">
                    Moved to <Badge tone="accent">{PROJECT_STAGE_LABEL[u.toStage] ?? u.toStage}</Badge>
                  </p>
                )}
                {u.note && <p className="text-xs text-[var(--text)] mt-0.5">{u.note}</p>}
                <p className="text-[11px] text-[var(--text-faint)] mt-1">{timeAgo(u.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {payments.length > 0 && (
        <div className="mt-7">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Payments</p>
          <div className="space-y-2">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                <span className="text-xs text-[var(--text)]">{p.paidAt ? friendlyDate(p.paidAt) : friendlyDay(p.createdAt)} · {p.method}</span>
                <span className="text-xs font-bold" style={{ color: "var(--success)" }}>{formatKES(p.amount, { compact: true })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
