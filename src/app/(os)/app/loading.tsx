/**
 * Instant pending UI for every /app/* navigation — Next.js wraps this
 * layout's {children} in Suspense automatically, so this shows the moment
 * a nav click fires, before the target page's data has even resolved.
 * Without it, clicking between sections shows nothing at all until the
 * new page's queries finish — the single biggest reason navigation reads
 * as "slow" even when the actual fetch is fast.
 */
export default function AppLoading() {
  return (
    <div className="p-6 lg:p-8 animate-pulse">
      <div className="h-6 w-40 rounded-[var(--radius-sm)]" style={{ background: "var(--surface-hover)" }} />
      <div className="h-3.5 w-64 rounded-[var(--radius-sm)] mt-3" style={{ background: "var(--surface-hover)" }} />

      <div className="mt-7 rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5"
            style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
          >
            <div className="h-3.5 w-1/4 rounded-[var(--radius-sm)]" style={{ background: "var(--surface-hover)" }} />
            <div className="h-3.5 w-1/3 rounded-[var(--radius-sm)] hidden sm:block" style={{ background: "var(--surface-hover)" }} />
            <div className="h-3.5 w-16 rounded-[var(--radius-sm)] ml-auto" style={{ background: "var(--surface-hover)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
