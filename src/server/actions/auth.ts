"use server";

import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { verifyPassword } from "@/server/auth/password";
import { createSession, destroySession } from "@/server/auth/session";
import { writeAudit } from "@/server/audit";
import { rateLimit } from "@/lib/ratelimit";
import { hashIp } from "@/lib/ip";
import { headers } from "next/headers";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  // Reuse the marketing site's IP rate limiter to slow down credential stuffing.
  const h = await headers();
  const ip =
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-vercel-forwarded-for") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "127.0.0.1";
  const ipHash = hashIp(ip);
  const limited = await rateLimit(`login:${ipHash}`, 10, 10 * 60_000);
  if (!limited.allowed) {
    return { error: "Too many attempts. Please try again shortly." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await writeAudit({ actorId: user.id, action: "LOGIN_FAILED", entityType: "User", entityId: user.id });
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
  await writeAudit({ actorId: user.id, action: "LOGIN", entityType: "User", entityId: user.id });

  redirect("/app");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
