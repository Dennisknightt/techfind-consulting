import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import { LoginForm } from "@/components/os/auth/LoginForm";

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
    <main className="auth-canvas relative min-h-screen overflow-hidden flex items-center justify-center px-5 py-12">
      {/* Ambient blobs — read the accent tokens, so they're on-brand for free */}
      <div className="auth-blob" style={{ width: 560, height: 560, top: "-14%", left: "-10%", background: "color-mix(in srgb, var(--accent) 22%, transparent)" }} />
      <div className="auth-blob auth-blob-2" style={{ width: 520, height: 520, bottom: "-18%", right: "-12%", background: "color-mix(in srgb, var(--accent-2) 24%, transparent)" }} />
      <LoginForm next={next} />
    </main>
  );
}
