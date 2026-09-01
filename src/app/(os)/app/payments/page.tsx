import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { can } from "@/server/auth/roles";
import { db } from "@/server/db";
import { PaymentsList } from "@/components/os/payments/PaymentsList";

export const metadata: Metadata = { title: "Payments — Techfind" };

export default async function PaymentsPage() {
  const user = await requireUser();

  const payments = await db.payment.findMany({
    include: { company: true, document: true, receipt: true },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return <PaymentsList payments={payments} canRecord={can(user.role, "payments.write")} />;
}
