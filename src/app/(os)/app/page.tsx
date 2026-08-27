import { requireUser } from "@/server/auth/guard";

export default async function HomePage() {
  const user = await requireUser();
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
        Home — {user.name}
      </h1>
      <p className="text-sm text-[var(--text-muted)] mt-2">Dennis Control Centre lands here in Phase 2.</p>
    </div>
  );
}
