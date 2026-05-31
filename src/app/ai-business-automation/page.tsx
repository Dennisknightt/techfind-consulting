import type { Metadata } from "next";
import { AutomationSection } from "@/components/home/AutomationSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { AutomationPageHero } from "@/components/pages/AutomationPageHero";

export const metadata: Metadata = {
  title: "AI Business Automation | TechFind Consulting",
  description: "Automate your business operations with AI — WhatsApp agents, sales automation, payment workflows, and customer support AI.",
};

export default function AutomationPage() {
  return (
    <>
      <AutomationPageHero />
      <AutomationSection />
      <FinalCTA />
    </>
  );
}
