"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, KeyRound, Copy, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { Input, Label } from "@/components/os/ui/Input";
import { Button } from "@/components/os/ui/Button";
import { Badge } from "@/components/os/ui/Badge";
import { Avatar } from "@/components/os/ui/Avatar";
import { Switch } from "@/components/os/ui/Switch";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/os/ui/Dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import { ROLES, ROLE_LABEL, type Role } from "@/server/auth/roles";
import {
  createTeamMemberAction,
  updateTeamMemberRoleAction,
  setTeamMemberActiveAction,
  resetTeamMemberPasswordAction,
  type TeamMember,
} from "@/server/actions/team";

function TempPasswordReveal({ name, password, onClose }: { name: string; password: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Temporary password for {name}</DialogTitle>
        <DialogDescription>
          Share this with them directly — it won&rsquo;t be shown again. Techfind doesn&rsquo;t send
          invite emails yet, so this is the only copy.
        </DialogDescription>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3.5 py-2.5 rounded-[var(--radius-md)] text-sm bg-[var(--surface-hover)] text-[var(--text)]">
            {password}
          </code>
          <Button variant="secondary" size="icon" onClick={copy} title="Copy">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <Button className="w-full mt-4" onClick={onClose}>Done</Button>
      </DialogContent>
    </Dialog>
  );
}

function AddTeammateDialog({ onCreated }: { onCreated: (member: TeamMember, tempPassword: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("SALES");
  const [saving, setSaving] = useState(false);

  function reset() {
    setName(""); setEmail(""); setPhone(""); setRole("SALES");
  }

  async function submit() {
    setSaving(true);
    try {
      const result = await createTeamMemberAction({ name, email, phone, role });
      if (result.error || !result.member || !result.tempPassword) {
        toast.error(result.error ?? "Couldn't create teammate");
        return;
      }
      onCreated(result.member, result.tempPassword);
      setOpen(false);
      reset();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-3.5 h-3.5" /> Add teammate
      </Button>
      <DialogContent>
        <DialogTitle>Add a teammate</DialogTitle>
        <DialogDescription>They&rsquo;ll get a temporary password to sign in with.</DialogDescription>
        <div className="space-y-3">
          <div>
            <Label htmlFor="tm-name">Name</Label>
            <Input id="tm-name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <Label htmlFor="tm-email">Email</Label>
            <Input id="tm-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@techfind.co.ke" />
          </div>
          <div>
            <Label htmlFor="tm-phone">Phone (optional)</Label>
            <Input id="tm-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+2547..." />
          </div>
          <div>
            <Label htmlFor="tm-role">Role</Label>
            <Select value={role} onValueChange={v => setRole(v as Role)}>
              <SelectTrigger id="tm-role"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="w-full mt-4" loading={saving} disabled={!name.trim() || !email.trim()} onClick={submit}>
          Create account
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function TeamSettings({
  initialMembers, canEdit, currentUserId,
}: {
  initialMembers: TeamMember[];
  canEdit: boolean;
  currentUserId: string;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [reveal, setReveal] = useState<{ name: string; password: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function patch(id: string, patch: Partial<TeamMember>) {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...patch } : m)));
  }

  async function changeRole(member: TeamMember, role: Role) {
    setBusyId(member.id);
    try {
      const result = await updateTeamMemberRoleAction(member.id, role);
      if (result.error) { toast.error(result.error); return; }
      patch(member.id, { role });
      toast.success(`${member.name} is now ${ROLE_LABEL[role]}`);
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(member: TeamMember, active: boolean) {
    setBusyId(member.id);
    try {
      const result = await setTeamMemberActiveAction(member.id, active);
      if (result.error) { toast.error(result.error); return; }
      patch(member.id, { active });
      toast.success(active ? `${member.name} reactivated` : `${member.name} deactivated`);
    } finally {
      setBusyId(null);
    }
  }

  async function resetPassword(member: TeamMember) {
    setBusyId(member.id);
    try {
      const result = await resetTeamMemberPasswordAction(member.id);
      if (result.error || !result.tempPassword) { toast.error(result.error ?? "Couldn't reset password"); return; }
      setReveal({ name: member.name, password: result.tempPassword });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team</CardTitle>
          {canEdit && <AddTeammateDialog onCreated={(member, tempPassword) => { setMembers(prev => [...prev, member]); setReveal({ name: member.name, password: tempPassword }); }} />}
        </CardHeader>
        <CardContent className="space-y-1">
          {!canEdit && (
            <p className="text-xs px-3 py-2 mb-2 rounded-[var(--radius-md)]" style={{ background: "var(--warning-soft)", color: "var(--warning)" }}>
              Only Super Admins can manage the team. You&rsquo;re viewing the current roster.
            </p>
          )}
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
              <Avatar name={member.name} size={32} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text)] truncate">
                  {member.name}
                  {member.id === currentUserId && <span className="text-[var(--text-faint)] font-normal"> (you)</span>}
                </p>
                <p className="text-xs text-[var(--text-faint)] truncate">{member.email}</p>
              </div>

              {canEdit ? (
                <Select value={member.role} onValueChange={v => changeRole(member, v as Role)}>
                  <SelectTrigger className="w-[150px] h-8 text-xs" disabled={busyId === member.id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Badge tone="accent">{ROLE_LABEL[member.role]}</Badge>
              )}

              {canEdit && (
                <>
                  <Button
                    variant="ghost" size="icon" title="Reset password"
                    disabled={busyId === member.id}
                    onClick={() => resetPassword(member)}
                  >
                    <KeyRound className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={member.active}
                    disabled={busyId === member.id}
                    onCheckedChange={(checked: boolean) => toggleActive(member, checked)}
                    title={member.active ? "Active — click to deactivate" : "Deactivated — click to reactivate"}
                  />
                </>
              )}
              {!canEdit && <Badge tone={member.active ? "success" : "neutral"}>{member.active ? "Active" : "Inactive"}</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      {reveal && <TempPasswordReveal name={reveal.name} password={reveal.password} onClose={() => setReveal(null)} />}
    </>
  );
}
