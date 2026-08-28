import type { Metadata } from "next";
import { CaseStudies } from "@/components/home/CaseStudies";
import { FinalCTA } from "@/components/home/FinalCTA";
import { CaseStudiesHero } from "@/components/pages/CaseStudiesHero";

export const metadata: Metadata = {
  title: "Case Studies | TechFind Consulting",
  description: "Real results from TechFind's AEO and AI automation engagements — measurable AI visibility improvements and business growth.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudiesHero />
      <CaseStudies />
      <FinalCTA />
    </>
  );
}
