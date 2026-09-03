import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Portal | TechFind Consulting",
  robots: "noindex,nofollow",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");

  // The Revenue Engine surfaces every lead/communication across the whole
  // business — gated to SUPER_ADMIN, not just "logged in", since the CRM's
  // other roles (Sales, Finance, Management, Viewer) have no reason to see it.
  if (user.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center" style={{ background: "var(--bg)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
          You don&apos;t have access to this page.
        </p>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Signed in as {user.email}. The Revenue Engine admin panel is restricted to Super
          Admins.
        </p>
        <a href="/app" className="text-xs font-medium" style={{ color: "var(--accent)" }}>
          Back to the app
        </a>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-sm" style={{ color: "var(--muted)" }}>Loading…</div>}>
      <AdminShell user={user}>{children}</AdminShell>
    </Suspense>
  );
}
