import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import { LoginForm } from "@/components/os/auth/LoginForm";
import { AuthPhotoPanel } from "@/components/os/auth/AuthPhotoPanel";

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
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]" style={{ background: "var(--bg)" }}>
      <AuthPhotoPanel />
      <section className="auth-canvas relative flex items-center justify-center overflow-hidden px-5 py-10 lg:min-h-screen lg:py-12">
        <div className="auth-blob" style={{ width: 520, height: 520, top: "-14%", left: "-16%", background: "color-mix(in srgb, var(--accent) 22%, transparent)" }} />
        <div className="auth-blob auth-blob-2" style={{ width: 480, height: 480, bottom: "-18%", right: "-14%", background: "color-mix(in srgb, var(--accent-2) 24%, transparent)" }} />
        <LoginForm next={next} />
      </section>
    </main>
  );
}
