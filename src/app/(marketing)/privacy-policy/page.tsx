import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/pages/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | TechFind Consulting",
  description: "TechFind Consulting's privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}
