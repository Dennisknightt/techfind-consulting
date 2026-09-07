"use client";

import { useState } from "react";
import type { User } from "@prisma/client";
import { toast } from "sonner";
import { Plus, Copy, KeyRound, UserX, UserCheck, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { Badge } from "@/components/os/ui/Badge";
import { Avatar } from "@/components/os/ui/Avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import {
  createTeamMemberAction, updateTeamMemberAction, setTeamMemberActiveAction, resetTeamMemberPasswordAction,
} from "@/server/actions/team";
import { ROLES, ROLE_LABEL, type Role } from "@/server/auth/roles";

export function TeamSettings({ users, canEdit, currentUserId }: { users: User[]; canEdit: boolean; currentUserId: string }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [revealed, setRevealed] = useState<{ email: string; password: string } | null>(null);

  async function copyPassword() {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed.password);
    toast.success("Password copied");
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Team</CardTitle>
        {canEdit && (
          <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add teammate
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!canEdit && (
          <p className="text-xs px-3 py-2 rounded-[var(--radius-md)] mb-3" style={{ background: "var(--warning-soft)", color: "var(--warning)" }}>
            Only Super Admins can manage the team.
          </p>
        )}

        {revealed && (
          <div className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-[var(--radius-md)] mb-3" style={{ background: "var(--success-soft)" }}>
            <div className="min-w-0">
              <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>Password for {revealed.email} — shown once, share it now</p>
              <p className="text-sm font-mono mt-0.5" style={{ color: "var(--text)" }}>{revealed.password}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button size="sm" variant="secondary" onClick={copyPassword} className="gap-1.5"><Copy className="w-3.5 h-3.5" /> Copy</Button>
              <Button size="sm" variant="ghost" onClick={() => setRevealed(null)}>Dismiss</Button>
            </div>
          </div>
        )}

        <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3 flex-wrap">
              <Avatar name={u.name} color={u.avatarColor} size={32} />
              <div className="flex-1 min-w-[160px]">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {u.name} {u.id === currentUserId && <span className="os-text-meta">(you)</span>}
                </p>
                <p className="os-text-meta">{u.email}</p>
              </div>
              <Badge tone={u.active ? "accent" : "neutral"}>{ROLE_LABEL[u.role as Role]}</Badge>
              {!u.active && <Badge tone="danger">Deactivated</Badge>}
              {canEdit && (
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(u)}>Edit</Button>
                  <ResetPasswordButton userId={u.id} onDone={pwd => setRevealed({ email: u.email, password: pwd })} />
                  {u.id !== currentUserId && (
                    <ToggleActiveButton userId={u.id} active={u.active} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <AddTeamMemberSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={pwd => setRevealed(pwd)}
      />
      {editing && (
        <EditTeamMemberSheet user={editing} onOpenChange={() => setEditing(null)} />
      )}
    </Card>
  );
}

function ResetPasswordButton({ userId, onDone }: { userId: string; onDone: (password: string) => void }) {
  const [loading, setLoading] = useState(false);
  async function reset() {
    setLoading(true);
    try {
      const { tempPassword } = await resetTeamMemberPasswordAction(userId);
      onDone(tempPassword);
      toast.success("Password reset");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't reset password");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button size="sm" variant="ghost" onClick={reset} loading={loading} className="gap-1.5">
      <KeyRound className="w-3.5 h-3.5" /> Reset password
    </Button>
  );
}

function ToggleActiveButton({ userId, active }: { userId: string; active: boolean }) {
  const [loading, setLoading] = useState(false);
  async function toggle() {
    setLoading(true);
    try {
      await setTeamMemberActiveAction(userId, !active);
      toast.success(active ? "Deactivated" : "Reactivated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button size="sm" variant="ghost" onClick={toggle} loading={loading} className="gap-1.5" style={{ color: active ? "var(--danger)" : "var(--success)" }}>
      {active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
      {active ? "Deactivate" : "Reactivate"}
    </Button>
  );
}

function RoleSelect({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  return (
    <Select value={value} onValueChange={v => onChange(v as Role)}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        {ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function AddTeamMemberSheet({
  open, onOpenChange, onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (result: { email: string; password: string }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("SALES");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim() || !email.trim()) { toast.error("Name and email are required"); return; }
    setSaving(true);
    try {
      const { tempPassword } = await createTeamMemberAction({ name, email, phone, role });
      onCreated({ email: email.trim().toLowerCase(), password: tempPassword });
      toast.success(`${name} added`);
      setName(""); setEmail(""); setPhone(""); setRole("SALES");
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't add teammate");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add teammate</SheetTitle>
          <SheetDescription>Creates their account with a one-time password to share with them directly — there's no email invite system yet.</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254712345000" className="mt-1.5" />
          </div>
          <div>
            <Label>Role</Label>
            <div className="mt-1.5"><RoleSelect value={role} onChange={setRole} /></div>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={submit} loading={saving} className="gap-1.5"><Check className="w-3.5 h-3.5" /> Add teammate</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function EditTeamMemberSheet({ user, onOpenChange }: { user: User; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [role, setRole] = useState<Role>(user.role as Role);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) { toast.error("Name can't be empty"); return; }
    setSaving(true);
    try {
      await updateTeamMemberAction(user.id, { name, phone, role });
      toast.success("Updated");
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit {user.name}</SheetTitle>
        </SheetHeader>
        <SheetBody className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Role</Label>
            <div className="mt-1.5"><RoleSelect value={role} onChange={setRole} /></div>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={submit} loading={saving} className="gap-1.5"><Check className="w-3.5 h-3.5" /> Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
