"use server";

import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guard";

export async function getNotificationsAction() {
  const user = await requireUserOrThrow();
  return db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function unreadNotificationCountAction(): Promise<number> {
  const user = await requireUserOrThrow();
  return db.notification.count({ where: { userId: user.id, read: false } });
}

export async function markNotificationReadAction(id: string): Promise<void> {
  const user = await requireUserOrThrow();
  await db.notification.updateMany({ where: { id, userId: user.id }, data: { read: true } });
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const user = await requireUserOrThrow();
  await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
}
