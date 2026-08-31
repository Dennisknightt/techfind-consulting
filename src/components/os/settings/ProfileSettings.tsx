"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { Avatar } from "@/components/os/ui/Avatar";
import { updateProfileAction, changeEmailAction, changePasswordAction } from "@/server/actions/settings";
import { AVATAR_COLORS } from "@/lib/os/avatarColors";
import { ROLE_LABEL, type Role } from "@/server/auth/roles";

export function ProfileSettings({
  name: initialName, email, phone: initialPhone, avatarColor: initialColor, role,
}: {
  name: string;
  email: string;
  phone: string | null;
  avatarColor: string;
  role: Role;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [avatarColor, setAvatarColor] = useState(initialColor);
  const [saving, setSaving] = useState(false);

  const [currentEmail, setCurrentEmail] = useState(email);
  const [newEmail, setNewEmail] = useState(email);
  const [emailPassword, setEmailPassword] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const dirty = name !== initialName || phone !== (initialPhone ?? "") || avatarColor !== initialColor;

  async function saveProfile() {
    if (!name.trim()) { toast.error("Name can't be empty"); return; }
    setSaving(true);
    try {
      await updateProfileAction({ name, phone, avatarColor });
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update profile");
    } finally {
      setSaving(false);
    }
  }

  async function submitEmailChange() {
    if (!newEmail.trim() || !newEmail.includes("@")) { toast.error("Enter a valid email address"); return; }
    if (!emailPassword) { toast.error("Enter your current password to confirm"); return; }
    setChangingEmail(true);
    try {
      await changeEmailAction({ newEmail, currentPassword: emailPassword });
      setCurrentEmail(newEmail.trim().toLowerCase());
      setEmailPassword("");
      toast.success("Email updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't change email");
    } finally {
      setChangingEmail(false);
    }
  }

  async function submitPasswordChange() {
    if (newPassword.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }
    setChangingPassword(true);
    try {
      await changePasswordAction({ currentPassword, newPassword });
      toast.success("Password changed");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't change password");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={name || initialName} color={avatarColor} size={52} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{currentEmail}</p>
              <p className="os-text-meta">{ROLE_LABEL[role]}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254712345000" className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label>Avatar colour</Label>
            <div className="flex items-center gap-2 mt-1.5">
              {AVATAR_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAvatarColor(c)}
                  aria-label={c}
                  className="os-press w-7 h-7 rounded-full shrink-0"
                  style={{ background: c, outline: avatarColor === c ? "2px solid var(--text)" : "none", outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>

          <Button size="sm" onClick={saveProfile} loading={saving} disabled={!dirty}>Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change email</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>New email</Label>
            <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Current password</Label>
            <Input type="password" value={emailPassword} onChange={e => setEmailPassword(e.target.value)} className="mt-1.5" />
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={submitEmailChange}
            loading={changingEmail}
            disabled={!emailPassword || newEmail.trim().toLowerCase() === currentEmail}
          >
            Change email
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Current password</Label>
            <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>New password</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Confirm new password</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={submitPasswordChange}
            loading={changingPassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Change password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
