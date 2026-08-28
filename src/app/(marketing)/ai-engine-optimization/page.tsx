import type { Metadata } from "next";
import { AeoPageHero } from "@/components/pages/AeoPageHero";
import { AeoDetails } from "@/components/pages/AeoDetails";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "AI Engine Optimization (AEO) | TechFind Consulting",
  description:
    "AI Engine Optimization is the practice of making your brand discoverable, understandable, and recommendable by AI systems. Learn how TechFind gets you there.",
};

export default function AeoPage() {
  return (
    <>
      <AeoPageHero />
      <AeoDetails />
      <FinalCTA />
    </>
  );
}
