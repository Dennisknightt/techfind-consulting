import type { Metadata } from "next";
import { RevenueEngine } from "@/components/admin/RevenueEngine";

export const metadata: Metadata = {
  title: "AI Revenue Engine | Admin",
  robots: "noindex,nofollow",
};

export default function RevenueEnginePage() {
  return <RevenueEngine />;
}
