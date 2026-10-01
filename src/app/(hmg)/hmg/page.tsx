import type { Metadata } from "next";
import { pageMeta } from "@/lib/hmg/meta";
import Link from "next/link";
import { ClarityDemo } from "@/components/hmg/ClarityDemo";
import { ContactForm } from "@/components/hmg/ContactForm";
import { HeroArt } from "@/components/hmg/HeroArt";
import { WhatsAppIcon } from "@/components/hmg/Logo";
import { OutcomeArt } from "@/components/hmg/OutcomeArt";
import { WhyArt } from "@/components/hmg/WhyArt";
import { InsightCard, JsonLd, orgLd, ProcessSteps, SectionHead, ServiceCard } from "@/components/hmg/ui";
import { ARTICLES, FEATURED_ARTICLES, OUTCOMES, SERVICES, WHY } from "@/lib/hmg/content";
import { PENDING, SHOW_PLACEHOLDERS, VERIFIED } from "@/lib/hmg/credentials";
import { abs, CONSULT_HREF, ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";

export const metadata: Metadata = pageMeta({
  title: "HMG Group Africa | Tax, Accounting, Audit & Advisory in Nairobi",
  absoluteTitle: true,
  description: "Stay compliant, understand your numbers and make better financial decisions with one trusted tax, accounting, audit and advisory team in Nairobi, Kenya.",
  path: ROUTES.home,
});

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

export default function HmgHome() {
  const featured = FEATURED_ARTICLES.map((s) => ARTICLES.find((a) => a.slug === s)!).filter(Boolean);
  return (
    <>
      <JsonLd data={{ ...orgLd, hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: abs(ROUTES.service(s.slug)) } })) } }} />

      {/* Hero */}
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero__rules" aria-hidden="true" />
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <p className="eyebrow hero__in" style={d(0)}>Tax · Accounting · Audit · Advisory</p>
            <h1 id="hero-h" className="hero__h">
              <span className="hero__mask"><span className="hero__line" style={d(0.08)}>Financial clarity.</span></span>{" "}
              <span className="hero__mask"><span className="hero__line hero__line--em" style={d(0.2)}>Confident growth.</span></span>
            </h1>
            <p className="hero__p hero__in" style={d(0.35)}>
              Stay compliant, understand your numbers and make better financial decisions with one trusted tax, accounting, audit and advisory team.
            </p>
            <div className="hero__cta hero__in" style={d(0.45)}>
              <Link href={CONSULT_HREF} className="btn btn--primary" data-magnetic>Book a Consultation</Link>
              <a href={whatsappLink()} className="btn btn--ghost" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp HMG</a>
            </div>
            <Link href={ROUTES.services} className="tlink hero__in" style={d(0.55)}>Explore services <span aria-hidden="true">→</span></Link>
            <p className="hero__cred hero__in" style={d(0.6)}>
              <span>Nairobi-based</span><span>Kenyan regulatory expertise</span><span>Personal consultant support</span>
            </p>
          </div>
          <div className="hero__art"><HeroArt /></div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="outc" aria-label="What HMG helps you achieve">
        <ul className="wrap outc__grid">
          {OUTCOMES.map((o, i) => (
            <li key={o.id} className="outc__item" data-reveal style={{ ["--i" as string]: i }}>
              <OutcomeArt id={o.id} />
              <div>
                <h2 className="outc__t">{o.title}</h2>
                <p className="outc__b">{o.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Services preview */}
      <section className="sec" aria-labelledby="svc-h">
        <div className="wrap">
          <SectionHead id="svc-h" eyebrow="Services" lines={["Six services.", "One clear view of your finances."]} lead="Start with the problem you have today. Each service links to the detail — what we handle, what you get and how it works." />
          <ul className="sgrid">
            {SERVICES.map((s, i) => <ServiceCard key={s.slug} s={s} i={i} />)}
          </ul>
          <p className="sec__more"><Link href={ROUTES.services} className="tlink">Find the right service <span aria-hidden="true">→</span></Link></p>
        </div>
      </section>

      {/* Clarity demo */}
      <section className="sec sec--cream" aria-labelledby="cd-h">
        <div className="wrap">
          <SectionHead id="cd-h" eyebrow="Financial clarity" lines={["See what needs attention", "before it becomes a problem."]} lead="This is how HMG presents your finances: what is happening, what needs attention, and the next action — in plain language." />
          <ClarityDemo />
        </div>
      </section>

      {/* Why HMG */}
      <section className="sec" aria-labelledby="why-h">
        <div className="wrap why__grid">
          <div className="why__copy">
            <SectionHead id="why-h" eyebrow="Why HMG" lines={["Finance should move", "your business forward."]} lead="HMG offers more than reports. You get a clear picture of where you stand and a consultant who helps you act on it." />
            <ul className="why__list">
              {WHY.map((w, i) => (
                <li key={w.t} data-reveal style={{ ["--i" as string]: i % 3 }}>
                  <span className="why__n" aria-hidden="true">{i + 1}</span>
                  <div><h3>{w.t}</h3><p>{w.d}</p></div>
                </li>
              ))}
            </ul>
            <Link href={ROUTES.about} className="tlink">More about HMG <span aria-hidden="true">→</span></Link>
          </div>
          <div className="why__art" data-reveal>
            <WhyArt />
          </div>
        </div>
      </section>

      {/* Trust — verified facts only */}
      <section className="trust" aria-labelledby="trust-h">
        <div className="wrap">
          <h2 id="trust-h" className="trust__h">The facts behind HMG</h2>
          <dl className="trust__grid">
            <div className="trust__item"><dt>Established</dt><dd>{VERIFIED.founded}</dd><p>Founded in Nairobi</p></div>
            <div className="trust__item"><dt>Office</dt><dd>Nairobi</dd><p>{VERIFIED.office}</p></div>
            <div className="trust__item"><dt>Services</dt><dd>{VERIFIED.serviceLines} lines</dd><p>Tax, accounting, audit, advisory, payroll and health checks</p></div>
            <div className="trust__item"><dt>Who we serve</dt><dd>Startups to NGOs</dd><p>{VERIFIED.audiences.join(", ")}</p></div>
          </dl>
          {PENDING.testimonials.length > 0 && (
            <ul className="quotes">
              {PENDING.testimonials.map((t) => (
                <li key={t.name}><blockquote>“{t.quote}”</blockquote><p>{t.name}, {t.role}, {t.company}</p></li>
              ))}
            </ul>
          )}
          {SHOW_PLACEHOLDERS && (
            <div className="ph">Content required from HMG: professional registrations, qualifications and client testimonials (with written permission). See <code>src/lib/hmg/credentials.ts</code>.</div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="sec sec--navy" aria-labelledby="proc-h">
        <div className="wrap">
          <SectionHead id="proc-h" eyebrow="How it works" lines={["Four simple steps", "to clear next steps."]} />
          <ProcessSteps />
        </div>
      </section>

      {/* Insights */}
      <section className="sec" aria-labelledby="ins-h">
        <div className="wrap">
          <div className="sec__headrow">
            <SectionHead id="ins-h" eyebrow="Insights" lines={["Practical thinking for", "Kenyan business owners."]} />
            <Link href={ROUTES.insights} className="tlink sec__headlink">View all insights <span aria-hidden="true">→</span></Link>
          </div>
          <ul className="igrid">
            {featured.map((a, i) => <InsightCard key={a.slug} a={a} i={i} showDate={false} />)}
          </ul>
        </div>
      </section>

      {/* Final CTA + callback */}
      <section className="sec sec--navy fcta" aria-labelledby="fcta-h">
        <div className="wrap fcta__grid">
          <div>
            <p className="eyebrow">Talk to HMG</p>
            <h2 id="fcta-h" className="mask-h">Your next smart move starts with clarity.</h2>
            <p className="sec__lead">Book a consultation, message us on WhatsApp or call. We respond during working hours, {SITE.hours}.</p>
            <div className="fcta__actions">
              <Link href={CONSULT_HREF} className="btn btn--primary" data-magnetic>Book a Consultation</Link>
              <a href={whatsappLink()} className="btn btn--ghost-light" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Chat on WhatsApp</a>
              <a href={SITE.phoneHref} className="btn btn--ghost-light">Call HMG</a>
            </div>
          </div>
          <div id="callback">
            <ContactForm variant="callback" />
          </div>
        </div>
      </section>
    </>
  );
}
