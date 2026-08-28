import { Hero } from "@/components/home/Hero";
import { AiSearchSimulation } from "@/components/home/AiSearchSimulation";
import { ProblemSection } from "@/components/home/ProblemSection";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { AeoServices } from "@/components/home/AeoServices";
import { ScrollStorytelling } from "@/components/home/ScrollStorytelling";
import { Industries } from "@/components/home/Industries";
import { AutomationSection } from "@/components/home/AutomationSection";
import { TalentSection } from "@/components/home/TalentSection";
import { CaseStudies } from "@/components/home/CaseStudies";
import { Process } from "@/components/home/Process";
import { Pricing } from "@/components/home/Pricing";
import { Testimonials } from "@/components/home/Testimonials";
import { OptimizedFAQ } from "@/components/home/OptimizedFAQ";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    /* Wrap in a single flow — gradient transitions between sections
       are handled via CSS .section-tinted / .section-tinted-2 classes
       applied inside each component */
    <div className="relative">
      <Hero />
      <MarqueeStrip />
      <AiSearchSimulation />
      <ProblemSection />
      <AeoServices />
      <ScrollStorytelling />
      <Industries />
      <AutomationSection />
      <TalentSection />
      <CaseStudies />
      <Process />
      <Pricing />
      <Testimonials />
      <OptimizedFAQ />
      <FinalCTA />
    </div>
  );
}
