import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import { LoginForm } from "@/components/os/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in — Techfind" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/app");

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <LoginForm />
    </div>
  );
}
