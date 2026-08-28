"use client";

import { useState } from "react";
import type { Company } from "@prisma/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/os/ui/Dialog";
import { Input, Label } from "@/components/os/ui/Input";
import { Button } from "@/components/os/ui/Button";
import { createQuickClientAction } from "@/server/actions/clients";

export function QuickClientDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (company: Company) => void;
}) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!companyName.trim()) { toast.error("Company name is required"); return; }
    setSaving(true);
    try {
      const { company } = await createQuickClientAction({ name, companyName, phone });
      onCreated(company);
      onOpenChange(false);
      setName(""); setCompanyName(""); setPhone("");
      toast.success(`${company.name} added`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't create client");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Quick Client</DialogTitle>
        <DialogDescription>Just enough to move forward — you can fill in the rest later.</DialogDescription>
        <div className="space-y-4">
          <div>
            <Label htmlFor="qc-company">Company *</Label>
            <Input id="qc-company" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Xpress Shine Detergents" autoFocus />
          </div>
          <div>
            <Label htmlFor="qc-name">Contact name</Label>
            <Input id="qc-name" value={name} onChange={e => setName(e.target.value)} placeholder="Lucy Macharia" />
          </div>
          <div>
            <Label htmlFor="qc-phone">Phone</Label>
            <Input id="qc-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254712345678" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button loading={saving} onClick={submit}>Add Client</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
