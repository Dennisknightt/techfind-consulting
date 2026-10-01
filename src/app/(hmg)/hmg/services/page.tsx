import type { Metadata } from "next";
import { pageMeta } from "@/lib/hmg/meta";
import { ServiceSelector } from "@/components/hmg/ServiceSelector";
import { CtaBand, JsonLd, PageHero, SectionHead, ServiceCard } from "@/components/hmg/ui";
import { SERVICES } from "@/lib/hmg/content";
import { abs, ROUTES } from "@/lib/hmg/site";

export const metadata: Metadata = pageMeta({
  title: "Tax, Accounting, Audit and Advisory Services in Nairobi",
  description: "Tax and KRA advisory, accounting and bookkeeping, audit and assurance, financial advisory, payroll and tax health checks for Kenyan businesses. Find the service you need.",
  path: ROUTES.services,
});

export default function ServicesPage() {
  const crumbs = [{ name: "Home", href: ROUTES.home }, { name: "Services", href: ROUTES.services }];
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: abs(ROUTES.service(s.slug)) })) }} />
      <PageHero eyebrow="Services" title="Find the help your business needs." lead="Six connected services, one team. Start with the problem you are facing — we will take care of the rest." crumbs={crumbs} />

      <section className="sec sec--tight" aria-labelledby="sel-h">
        <div className="wrap">
          <SectionHead id="sel-h" eyebrow="Service guide" lines={["Which service", "do you need?"]} lead="Choose the situation closest to yours." />
          <ServiceSelector />
        </div>
      </section>

      <section className="sec sec--cream" aria-labelledby="all-h">
        <div className="wrap">
          <SectionHead id="all-h" eyebrow="All services" lines={["What each service", "solves."]} />
          <ul className="sgrid sgrid--detailed">
            {SERVICES.map((s, i) => <ServiceCard key={s.slug} s={s} i={i} detailed />)}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
