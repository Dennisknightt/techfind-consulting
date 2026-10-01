import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudies } from "@/components/hmg/CaseStudies";
import { ClarityDemo } from "@/components/hmg/ClarityDemo";
import { CoverArt } from "@/components/hmg/CoverArt";
import { HeroArt } from "@/components/hmg/HeroArt";
import { WhatsAppIcon } from "@/components/hmg/Logo";
import { ProblemStatement } from "@/components/hmg/ProblemStatement";
import { ServicesShowcase } from "@/components/hmg/ServicesShowcase";
import { SituationSelector } from "@/components/hmg/SituationSelector";
import { TeamSection, TrustFacts } from "@/components/hmg/Trust";
import { TypeInk } from "@/components/hmg/TypeInk";
import { WhyArt } from "@/components/hmg/WhyArt";
import { JsonLd, orgLd, SectionHead } from "@/components/hmg/ui";
import { ARTICLES, FEATURED_ARTICLES, SERVICES, WHY } from "@/lib/hmg/content";
import { pageMeta } from "@/lib/hmg/meta";
import { abs, CONSULT_HREF, ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";

export const metadata: Metadata = pageMeta({
  title: "HMG Group Africa | Tax, Accounting, Audit & Advisory in Nairobi",
  absoluteTitle: true,
  description: "Nairobi-based tax, accounting, audit and advisory firm serving businesses across Kenya and Africa. Stay compliant, understand your numbers and make better financial decisions.",
  path: ROUTES.home,
});

export default function HmgHome() {
  const [lead, ...more] = FEATURED_ARTICLES.map((s) => ARTICLES.find((a) => a.slug === s)!).filter(Boolean);
  return (
    <>
      <JsonLd data={{ ...orgLd, hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: abs(ROUTES.service(s.slug)) } })) } }} />

      {/* 1 · Hero */}
      <section className="hero" aria-labelledby="hero-h">
        <div className="wrap hero__grid">
          <div className="hero__copy enter">
            <p className="eyebrow">Tax · Accounting · Audit · Advisory</p>
            <h1 id="hero-h" className="hero__h">
              <span className="sr-only">Financial clarity. Confident growth.</span>
              <span aria-hidden="true">Financial clarity. <span className="hero__em"><TypeInk text="Confident growth." /></span></span>
            </h1>
            <p className="hero__p">Stay compliant, understand your numbers and make better financial decisions with one trusted tax, accounting, audit and advisory team.</p>
            <div className="hero__cta">
              <Link href={CONSULT_HREF} className="btn btn--primary">Request a Consultation</Link>
              <a href={whatsappLink()} className="btn btn--ghost" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp HMG</a>
              <Link href={ROUTES.services} className="tlink hero__explore">Explore Services <span aria-hidden="true">→</span></Link>
            </div>
            <p className="hero__cred">{SITE.credibility.map((c) => <span key={c}>{c}</span>)}</p>
          </div>
          <div className="hero__art"><HeroArt /></div>
        </div>
      </section>

      {/* 2 · Problem statement */}
      <ProblemStatement />

      {/* 3 · Verified trust */}
      <TrustFacts />

      {/* 4 · Interactive service selector */}
      <section className="sec sec--ivory" aria-labelledby="sit-h">
        <div className="wrap split">
          <div className="split__intro">
            <p className="eyebrow">Find the right help</p>
            <h2 id="sit-h" className="mask-h">What is happening in your business?</h2>
            <p className="sec__lead">Tell us what you are dealing with and we will show you where HMG fits.</p>
          </div>
          <SituationSelector headingId="sit-h" />
        </div>
      </section>

      {/* 5 · Compact services */}
      <section className="sec" aria-labelledby="svc-h">
        <div className="wrap">
          <div className="sec__headrow">
            <SectionHead id="svc-h" eyebrow="Services" lines={["Six services, one clear view of your finances."]} />
            <Link href={ROUTES.services} className="tlink sec__headlink">All services <span aria-hidden="true">→</span></Link>
          </div>
          <ServicesShowcase />
        </div>
      </section>

      {/* 6 · Financial clarity demonstration */}
      <section className="sec sec--ivory" aria-labelledby="cd-h">
        <div className="wrap">
          <SectionHead id="cd-h" eyebrow="Financial clarity" lines={["See what needs attention before it becomes a problem."]} lead="This is how HMG presents your finances — what is happening, what needs attention and what to do next, in plain language." />
          <ClarityDemo />
        </div>
      </section>

      {/* 7 · Case studies (client-approved only; hidden until supplied) */}
      <CaseStudies />

      {/* 8 · Team preview (real people only; hidden until supplied) */}
      <TeamSection limit={3} title="The people you will work with." />

      {/* 9 · Why HMG — asymmetric, text-led */}
      <section className="sec why" aria-labelledby="why-h">
        <div className="wrap why__grid">
          <div className="why__lead">
            <p className="eyebrow">Why HMG</p>
            <h2 id="why-h" className="why__h">Finance should move your business forward.</h2>
            <p className="sec__lead">More than reports: a clear picture of where you stand, and a consultant who helps you act on it.</p>
            <div className="why__art"><WhyArt /></div>
          </div>
          <ol className="why__list">
            {WHY.map((w, i) => (
              <li key={w.t}>
                <span className="why__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{w.t}</h3><p>{w.d}</p></div>
              </li>
            ))}
            <li className="why__more"><Link href={ROUTES.about} className="tlink">More about HMG <span aria-hidden="true">→</span></Link></li>
          </ol>
        </div>
      </section>

      {/* 10 · Featured insights — one lead, two supporting */}
      <section className="sec sec--ivory" aria-labelledby="ins-h">
        <div className="wrap">
          <div className="sec__headrow">
            <SectionHead id="ins-h" eyebrow="Insights" lines={["Practical thinking for Kenyan business owners."]} />
            <Link href={ROUTES.insights} className="tlink sec__headlink">View all insights <span aria-hidden="true">→</span></Link>
          </div>
          <div className="ifeat">
            {lead && (
              <Link href={ROUTES.article(lead.slug)} className="ifeat__lead">
                <div className="ifeat__cover"><CoverArt kind={lead.kind} /></div>
                <div className="ifeat__body">
                  <p className="meta"><span className="meta__cat">{lead.category}</span><span aria-hidden="true">·</span><span>{lead.readTime} min read</span></p>
                  <h3 className="ifeat__t">{lead.title}</h3>
                  <p className="ifeat__s">{lead.summary}</p>
                  <span className="icard__more">Read article <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            )}
            <ul className="ifeat__more">
              {more.map((a) => (
                <li key={a.slug}>
                  <Link href={ROUTES.article(a.slug)} className="ifeat__item">
                    <p className="meta"><span className="meta__cat">{a.category}</span><span aria-hidden="true">·</span><span>{a.readTime} min read</span></p>
                    <h3>{a.title}</h3>
                    <p>{a.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 11 · Consultation CTA */}
      <section className="sec sec--navy fcta" aria-labelledby="fcta-h">
        <div className="wrap fcta__inner">
          <h2 id="fcta-h" className="fcta__h">Your next smart move starts with clarity.</h2>
          <p className="sec__lead">Tell us what you are dealing with and an HMG consultant will get back to you during working hours, {SITE.hours}.</p>
          <div className="fcta__actions">
            <Link href={CONSULT_HREF} className="btn btn--primary">Request a Consultation</Link>
            <a href={whatsappLink()} className="btn btn--ghost-light" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp HMG</a>
            <a href={SITE.phoneHref} className="btn btn--ghost-light">Call HMG</a>
          </div>
        </div>
      </section>
    </>
  );
}
