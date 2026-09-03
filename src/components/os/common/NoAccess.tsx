import { Lock } from "lucide-react";

/** Full-page guard for a route that is entirely a write flow (e.g. the Proforma Generator) —
    there's no read-only view of it to fall back to, so a VIEWER gets this instead. */
export function NoAccess({ note }: { note?: string }) {
  return (
    <div className="p-6 lg:p-8">
      <div
        className="rounded-[var(--radius-lg)] border border-dashed p-10 text-center max-w-md mx-auto mt-10"
        style={{ borderColor: "var(--border-strong)" }}
      >
        <Lock className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
        <p className="text-sm font-semibold text-[var(--text)]">You don&rsquo;t have access to this page</p>
        {note && <p className="text-xs text-[var(--text-faint)] mt-1.5">{note}</p>}
      </div>
    </div>
  );
}
