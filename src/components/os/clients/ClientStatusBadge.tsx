"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/os/ui/Badge";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/os/ui/DropdownMenu";
import { updateClientStatusAction, type ClientStatus } from "@/server/actions/clients";

const STATUS_META: Record<ClientStatus, { label: string; tone: "cold" | "warm" | "info" | "success" | "danger" | "neutral"; icon: string }> = {
  COLD: { label: "Cold", tone: "cold", icon: "⚪" },
  WARM: { label: "Warm", tone: "warm", icon: "🟡" },
  PITCHED: { label: "Pitched", tone: "info", icon: "📤" },
  WON: { label: "Won", tone: "success", icon: "✅" },
  LOST: { label: "Lost", tone: "danger", icon: "❌" },
  CLOSED: { label: "Closed", tone: "neutral", icon: "⏹️" },
};

const STATUS_ORDER: ClientStatus[] = ["COLD", "WARM", "PITCHED", "WON", "LOST", "CLOSED"];

/**
 * A client's relationship stage — independent of any individual Deal's
 * pipeline stage, since a client can be "Won" overall while a fresh
 * upsell deal against them is still Cold. One tap opens every option;
 * no cycling through five wrong states to reach the sixth.
 */
export function ClientStatusBadge({
  companyId, status, size = "md",
}: {
  companyId: string;
  status: string;
  size?: "sm" | "md";
}) {
  const [current, setCurrent] = useState<ClientStatus>((status as ClientStatus) in STATUS_META ? (status as ClientStatus) : "COLD");
  const [saving, setSaving] = useState(false);
  const meta = STATUS_META[current];

  async function choose(next: ClientStatus) {
    if (next === current || saving) return;
    const prev = current;
    setCurrent(next);
    setSaving(true);
    try {
      await updateClientStatusAction(companyId, next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update status");
      setCurrent(prev);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={e => e.stopPropagation()}
          disabled={saving}
          className="os-press disabled:opacity-60"
        >
          <Badge tone={meta.tone} className={size === "sm" ? undefined : "px-2.5 py-1 text-xs"}>
            {meta.icon} {meta.label}
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={e => e.stopPropagation()}>
        {STATUS_ORDER.map(s => (
          <DropdownMenuItem key={s} onSelect={() => choose(s)}>
            {STATUS_META[s].icon} {STATUS_META[s].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
