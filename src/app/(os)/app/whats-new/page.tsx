import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { WhatsNewView } from "@/components/os/system/WhatsNewView";

export const metadata: Metadata = { title: "What's New — Techfind" };

export default async function WhatsNewPage() {
  await requireUser();
  return <WhatsNewView />;
}
