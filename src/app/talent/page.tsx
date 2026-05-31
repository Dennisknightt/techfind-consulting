import type { Metadata } from "next";
import { TalentSection } from "@/components/home/TalentSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { TalentPageHero } from "@/components/pages/TalentPageHero";

export const metadata: Metadata = {
  title: "TechFind Talent Division | TechFind Consulting",
  description: "Access vetted AI engineers, software developers, data engineers, and automation specialists through TechFind's talent network.",
};

export default function TalentPage() {
  return (
    <>
      <TalentPageHero />
      <TalentSection />
      <FinalCTA />
    </>
  );
}
