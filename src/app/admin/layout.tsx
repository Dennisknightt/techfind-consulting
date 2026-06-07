import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Portal | TechFind Consulting",
  robots: "noindex,nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-sm" style={{ color: "var(--muted)" }}>Loading…</div>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
