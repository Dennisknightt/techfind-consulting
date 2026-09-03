"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Task, User, Company } from "@prisma/client";
import type { DealMoney } from "@/lib/os/moneyTypes";
import { Plus, Check, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Input, Label, Textarea } from "@/components/os/ui/Input";
import { Avatar } from "@/components/os/ui/Avatar";
import { Badge } from "@/components/os/ui/Badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import { friendlyDay, isOverdue, dayjs } from "@/lib/os/dates";
import { createTaskAction, completeTaskAction } from "@/server/actions/tasks";

type TaskWithRelations = Task & { assignee: User | null; deal: (DealMoney & { company: Company }) | null };

type ViewKey = "today" | "upcoming" | "overdue" | "mine" | "team" | "high";

const VIEWS: { key: ViewKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "overdue", label: "Overdue" },
  { key: "mine", label: "Mine" },
  { key: "team", label: "Team" },
  { key: "high", label: "High Priority" },
];

const PRIORITY_TONE: Record<string, "danger" | "warning" | "neutral"> = { HIGH: "danger", MEDIUM: "warning", LOW: "neutral" };

export function TasksView({
  initialTasks, users, currentUserId, openCreateOnLoad, canCreate,
}: {
  initialTasks: TaskWithRelations[];
  users: User[];
  currentUserId: string;
  openCreateOnLoad: boolean;
  canCreate: boolean;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<ViewKey>("today");
  const [createOpen, setCreateOpen] = useState(openCreateOnLoad);
  const [completing, setCompleting] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const now = dayjs();
    switch (view) {
      case "today": return tasks.filter(t => t.dueAt && dayjs(t.dueAt).isSame(now, "day"));
      case "upcoming": return tasks.filter(t => t.dueAt && dayjs(t.dueAt).isAfter(now, "day"));
      case "overdue": return tasks.filter(t => t.dueAt && isOverdue(t.dueAt) && !dayjs(t.dueAt).isSame(now, "day"));
      case "mine": return tasks.filter(t => t.assigneeId === currentUserId);
      case "team": return tasks;
      case "high": return tasks.filter(t => t.priority === "HIGH");
      default: return tasks;
    }
  }, [tasks, view, currentUserId]);

  async function complete(task: TaskWithRelations) {
    setCompleting(prev => new Set(prev).add(task.id));
    setTasks(prev => prev.filter(t => t.id !== task.id));
    try {
      await completeTaskAction(task.id, true);
    } catch {
      toast.error("Couldn't complete that task");
      setTasks(prev => [...prev, task]);
    } finally {
      setCompleting(prev => { const n = new Set(prev); n.delete(task.id); return n; });
    }
  }

  function onCreated(task: TaskWithRelations) {
    setTasks(prev => [task, ...prev]);
    setCreateOpen(false);
  }

  const counts: Record<ViewKey, number> = {
    today: tasks.filter(t => t.dueAt && dayjs(t.dueAt).isSame(dayjs(), "day")).length,
    upcoming: tasks.filter(t => t.dueAt && dayjs(t.dueAt).isAfter(dayjs(), "day")).length,
    overdue: tasks.filter(t => t.dueAt && isOverdue(t.dueAt) && !dayjs(t.dueAt).isSame(dayjs(), "day")).length,
    mine: tasks.filter(t => t.assigneeId === currentUserId).length,
    team: tasks.length,
    high: tasks.filter(t => t.priority === "HIGH").length,
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} open`}
        actions={
          canCreate && (
            <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /> New Task
            </Button>
          )
        }
      />

      <div className="flex gap-1.5 flex-wrap mt-5">
        {VIEWS.map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{ background: view === v.key ? "var(--accent-soft)" : "var(--surface-hover)", color: view === v.key ? "var(--accent)" : "var(--text-muted)" }}
          >
            {v.label} <span className="opacity-60">{counts[v.key]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 text-center py-14 rounded-[var(--radius-lg)] border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <CheckCircle2 className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm font-semibold text-[var(--text)]">Nothing here</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">You&rsquo;re caught up on this view.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {filtered.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-[var(--radius-lg)] p-3.5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <button
                onClick={() => complete(task)}
                disabled={completing.has(task.id)}
                className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors hover:border-[var(--accent)] group"
                style={{ borderColor: "var(--border-strong)" }}
              >
                <Check className="w-3 h-3 opacity-0 group-hover:opacity-60" style={{ color: "var(--accent)" }} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text)] truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {task.dueAt && (
                    <span className="text-xs" style={{ color: isOverdue(task.dueAt) ? "var(--danger)" : "var(--text-faint)" }}>
                      {friendlyDay(task.dueAt)}
                    </span>
                  )}
                  <Badge tone={PRIORITY_TONE[task.priority] ?? "neutral"}>{task.priority}</Badge>
                  {task.deal && (
                    <Link href={`/app/deals/${task.deal.id}`} className="text-xs hover:underline" style={{ color: "var(--accent)" }}>
                      {task.deal.company.name}
                    </Link>
                  )}
                </div>
              </div>
              {task.assignee && <Avatar name={task.assignee.name} color={task.assignee.avatarColor} size={28} />}
            </div>
          ))}
        </div>
      )}

      <CreateTaskSheet open={createOpen} onOpenChange={setCreateOpen} users={users} currentUserId={currentUserId} onCreated={onCreated} />
    </div>
  );
}

function CreateTaskSheet({
  open, onOpenChange, users, currentUserId, onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  users: User[];
  currentUserId: string;
  onCreated: (task: TaskWithRelations) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assigneeId, setAssigneeId] = useState(currentUserId);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim()) { toast.error("Give this task a title"); return; }
    setSaving(true);
    try {
      const task = await createTaskAction({
        title, description: description || undefined,
        dueAt: dueAt ? new Date(dueAt) : null,
        priority, assigneeId,
      });
      const assignee = users.find(u => u.id === assigneeId) ?? null;
      onCreated({ ...task, assignee, deal: null } as TaskWithRelations);
      setTitle(""); setDescription(""); setDueAt(""); setPriority("MEDIUM"); setAssigneeId(currentUserId);
      toast.success("Task added");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't create task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader><SheetTitle>New Task</SheetTitle></SheetHeader>
        <SheetBody className="space-y-4">
          <div>
            <Label htmlFor="task-title">Title</Label>
            <Input id="task-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Follow up on proforma" autoFocus />
          </div>
          <div>
            <Label htmlFor="task-desc">Notes</Label>
            <Textarea id="task-desc" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="task-due">Due</Label>
              <Input id="task-due" type="date" value={dueAt} onChange={e => setDueAt(e.target.value)} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button loading={saving} onClick={submit}>Add Task</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
