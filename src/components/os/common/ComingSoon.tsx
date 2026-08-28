import { Sparkles } from "lucide-react";

export function ComingSoon({ title, note }: { title: string; note?: string }) {
  return (
    <div
      className="rounded-[var(--radius-lg)] border border-dashed p-10 text-center"
      style={{ borderColor: "var(--border-strong)" }}
    >
      <Sparkles className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      {note && <p className="text-xs text-[var(--text-faint)] mt-1.5 max-w-sm mx-auto">{note}</p>}
    </div>
  );
}
