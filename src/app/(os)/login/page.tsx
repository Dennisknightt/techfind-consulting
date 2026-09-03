import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import { LoginForm } from "@/components/os/auth/LoginForm";
import { AuthBrandPanel } from "@/components/os/auth/AuthBrandPanel";

export const metadata: Metadata = { title: "Sign in — Techfind" };

function safeNextPath(raw: string | undefined): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("://")) {
    return raw;
  }
  return "/app";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeNextPath(rawNext);

  const user = await getSessionUser();
  if (user) redirect(next);

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_minmax(0,1fr)]" style={{ background: "var(--bg)" }}>
      <AuthBrandPanel />
      <main className="flex items-center justify-center px-6 py-12 sm:px-12">
        <LoginForm next={next} />
      </main>
    </div>
  );
}
