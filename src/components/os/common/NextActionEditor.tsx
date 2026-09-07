"use client";

/**
 * Tap-tile "what's next" editor shared by Lead and Deal records — no typing
 * required. Purely presentational + local draft state; the caller decides
 * how to persist via `onSave` (each record type has its own server action).
 */

import { useState } from "react";
import { NEXT_ACTION_TYPES, NEXT_ACTION_META, type NextActionType } from "@/lib/os/nextAction";
import { Input } from "@/components/os/ui/Input";
import { Button } from "@/components/os/ui/Button";

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function NextActionEditor({ type: initialType, due: initialDue, note: initialNote, onSave, saving }: {
  type: string | null;
  due: Date | string | null;
  note: string | null;
  onSave: (input: { type: NextActionType; due: Date | null; note: string }) => void | Promise<void>;
  saving?: boolean;
}) {
  const [type, setType] = useState<NextActionType | null>((initialType as NextActionType) ?? null);
  const [due, setDue] = useState(initialDue ? toDateInputValue(new Date(initialDue)) : "");
  const [note, setNote] = useState(initialNote ?? "");

  const needsDate = type !== null && type !== "WAIT";
  const initialDueValue = initialDue ? toDateInputValue(new Date(initialDue)) : "";
  const dirty = type !== (initialType ?? null) || due !== initialDueValue || note !== (initialNote ?? "");

  function today() { setDue(toDateInputValue(new Date())); }
  function tomorrow() { const d = new Date(); d.setDate(d.getDate() + 1); setDue(toDateInputValue(d)); }

  async function save() {
    if (!type) return;
    const dueDate = needsDate && due ? new Date(`${due}T00:00:00`) : null;
    await onSave({ type, due: dueDate, note });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {NEXT_ACTION_TYPES.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className="os-card-hover os-press flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors"
            style={{
              background: type === t ? "var(--accent-soft)" : "var(--surface-hover)",
              color: type === t ? "var(--accent)" : "var(--text)",
              border: `1px solid ${type === t ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            <span>{NEXT_ACTION_META[t].icon}</span> {NEXT_ACTION_META[t].label}
          </button>
        ))}
      </div>

      {needsDate && (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant={due === toDateInputValue(new Date()) ? "primary" : "secondary"} onClick={today}>Today</Button>
          <Button type="button" size="sm" variant="secondary" onClick={tomorrow}>Tomorrow</Button>
          <Input type="date" value={due} onChange={e => setDue(e.target.value)} className="w-auto" />
        </div>
      )}

      <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note (e.g. confirm decision maker)" />

      <Button type="button" size="sm" loading={saving} disabled={!type || !dirty} onClick={save}>Save next action</Button>
    </div>
  );
}
