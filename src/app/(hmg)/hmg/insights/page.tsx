import type { Metadata } from "next";
import { pageMeta } from "@/lib/hmg/meta";
import { InsightsLibrary } from "@/components/hmg/InsightsLibrary";
import { CtaBand, JsonLd, PageHero } from "@/components/hmg/ui";
import { ARTICLES } from "@/lib/hmg/content";
import { abs, ROUTES } from "@/lib/hmg/site";

export const metadata: Metadata = pageMeta({
  title: "Insights on Kenyan Tax, Cash Flow, Payroll and Audit",
  description: "Practical guidance for Kenyan business owners on KRA compliance, eTIMS, cash-flow planning, payroll, financial controls, audits and growth planning.",
  path: ROUTES.insights,
});

export default function InsightsPage() {
  const crumbs = [{ name: "Home", href: ROUTES.home }, { name: "Insights", href: ROUTES.insights }];
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "HMG Insights", url: abs(ROUTES.insights), hasPart: ARTICLES.map((a) => ({ "@type": "Article", headline: a.title, url: abs(ROUTES.article(a.slug)) })) }} />
      <PageHero eyebrow="Insights" title="Practical guidance you can act on." lead="Short reads on compliance, cash, payroll, audits and growth — written for Kenyan business owners and finance teams." crumbs={crumbs} />
      <section className="sec sec--tight" aria-label="Article library">
        <div className="wrap">
          <InsightsLibrary />
        </div>
      </section>
      <CtaBand title="Have a question about your own numbers?" />
    </>
  );
}
