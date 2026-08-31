import "server-only";
import { cookies, headers } from "next/headers";
import { randomBytes } from "crypto";
import { db } from "@/server/db";
import type { Role } from "./roles";

const COOKIE_NAME = "tf_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days — "Remember Me" checked
const SHORT_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 1 day — "Remember Me" unchecked

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  avatarColor: string;
  welcomeSoundEnabled: boolean;
  welcomeSoundVolume: number;
}

function newToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * `remember` controls both the server-side session lifetime and whether the
 * cookie survives a browser restart: checked gets the full 30-day window as
 * a persistent cookie; unchecked gets a much shorter server-side TTL *and*
 * a session-only cookie (no `expires`), so it's gone the moment the browser
 * closes even if the tab is left open past the TTL.
 */
export async function createSession(userId: string, remember = true): Promise<void> {
  const token = newToken();
  const ttl = remember ? SESSION_TTL_MS : SHORT_SESSION_TTL_MS;
  const h = await headers();
  await db.session.create({
    data: {
      id: token,
      userId,
      expiresAt: new Date(Date.now() + ttl),
      userAgent: h.get("user-agent") ?? undefined,
      ip: h.get("x-forwarded-for") ?? undefined,
    },
  });

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(remember ? { expires: new Date(Date.now() + ttl) } : {}),
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.session.delete({ where: { id: token } }).catch(() => null);
  }
  jar.delete(COOKIE_NAME);
}

/** Returns the authenticated user for this request, or null. Never throws. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { id: token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user.active) {
    if (session) await db.session.delete({ where: { id: token } }).catch(() => null);
    return null;
  }

  const u = session.user;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role as Role,
    avatarColor: u.avatarColor,
    welcomeSoundEnabled: u.welcomeSoundEnabled,
    welcomeSoundVolume: u.welcomeSoundVolume,
  };
}
