import type { Metadata } from "next";
import { TermsOfServicePage } from "@/components/pages/TermsOfServicePage";

export const metadata: Metadata = {
  title: "Terms of Service | TechFind Consulting",
  description: "TechFind Consulting's terms of service — the terms governing your use of our website and services.",
};

export default function TermsOfService() {
  return <TermsOfServicePage />;
}
