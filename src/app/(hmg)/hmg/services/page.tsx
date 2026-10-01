import type { Metadata } from "next";
import { ServicesShowcase } from "@/components/hmg/ServicesShowcase";
import { SituationSelector } from "@/components/hmg/SituationSelector";
import { CtaBand, JsonLd, PageHero, SectionHead } from "@/components/hmg/ui";
import { SERVICES } from "@/lib/hmg/content";
import { pageMeta } from "@/lib/hmg/meta";
import { abs, ROUTES } from "@/lib/hmg/site";

export const metadata: Metadata = pageMeta({
  title: "Tax, Accounting, Audit and Advisory Services in Nairobi",
  description: "Tax and KRA advisory, accounting and bookkeeping, audit and assurance, financial advisory, payroll and tax health checks for businesses across Kenya and Africa.",
  path: ROUTES.services,
});

export default function ServicesPage() {
  const crumbs = [{ name: "Home", href: ROUTES.home }, { name: "Services", href: ROUTES.services }];
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: abs(ROUTES.service(s.slug)) })) }} />
      <PageHero eyebrow="Services" title="Find the help your business needs." lead="Six connected services from one Nairobi-based team, serving businesses across Kenya and Africa. Start with what is happening — we will take care of the rest." crumbs={crumbs} />
      <section className="sec sec--ivory" aria-labelledby="sit-h">
        <div className="wrap split">
          <div className="split__intro">
            <p className="eyebrow">Service guide</p>
            <h2 id="sit-h" className="mask-h">What is happening in your business?</h2>
            <p className="sec__lead">Select everything that applies to see the services that fit.</p>
          </div>
          <SituationSelector headingId="sit-h" />
        </div>
      </section>
      <section className="sec" aria-labelledby="all-h">
        <div className="wrap">
          <SectionHead id="all-h" eyebrow="All services" lines={["What each service solves."]} />
          <ServicesShowcase detailed />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
