import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { can } from "@/server/auth/roles";
import { db } from "@/server/db";
import { MeetingsView } from "@/components/os/meetings/MeetingsView";

export const metadata: Metadata = { title: "Meetings — Techfind" };

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const user = await requireUser();
  const { new: openCreate } = await searchParams;
  const canCreate = can(user.role, "meetings.write");

  const [meetings, products] = await Promise.all([
    db.meeting.findMany({
      where: { status: { not: "CANCELLED" } },
      include: { company: true, contact: true, deal: true },
      orderBy: { scheduledAt: "asc" },
      take: 200,
    }),
    db.product.findMany({ where: { isQuickChip: true, active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <MeetingsView
      initialMeetings={meetings}
      products={products}
      openCreateOnLoad={openCreate === "1" && canCreate}
      canCreate={canCreate}
    />
  );
}
