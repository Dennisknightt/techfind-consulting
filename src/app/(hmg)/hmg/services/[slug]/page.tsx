import type { Metadata } from "next";
import { pageMeta } from "@/lib/hmg/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/hmg/Logo";
import { ServiceArt } from "@/components/hmg/ServiceMotifs";
import { CtaBand, Faq, faqLd, InsightCard, JsonLd, PageHero, ProcessSteps, SectionHead } from "@/components/hmg/ui";
import { ARTICLES, getService, SERVICES } from "@/lib/hmg/content";
import { abs, CONSULT_HREF, ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  const url = ROUTES.service(s.slug);
  return pageMeta({ title: s.seoTitle, description: s.seoDescription, path: url });
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const url = ROUTES.service(s.slug);
  const crumbs = [{ name: "Home", href: ROUTES.home }, { name: "Services", href: ROUTES.services }, { name: s.title, href: url }];
  const related = s.related.map((r) => ARTICLES.find((a) => a.slug === r)).filter((a): a is NonNullable<typeof a> => !!a);
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 5);
  const waMsg = `Hello HMG, I'd like to discuss ${s.title}.`;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: s.title, serviceType: s.title, description: s.seoDescription, url: abs(url), areaServed: { "@type": "Country", name: "Kenya" }, provider: { "@id": `${SITE.url}/#org`, "@type": "ProfessionalService", name: SITE.name } }} />
      <JsonLd data={faqLd(s.faqs)} />
      <PageHero eyebrow={s.title} title={s.outcome} lead={s.lead} crumbs={crumbs} art={<div className="phero__svc"><ServiceArt motif={s.motif} /></div>}>
        <div className="hero__cta">
          <Link href={CONSULT_HREF} className="btn btn--primary" data-magnetic>Book a Consultation</Link>
          <a href={whatsappLink(waMsg)} className="btn btn--ghost" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp HMG</a>
        </div>
        <p className="phero__who"><strong>Who it is for:</strong> {s.whoFor}</p>
      </PageHero>

      <section className="sec sec--tight" aria-labelledby="prob-h">
        <div className="wrap cols">
          <SectionHead id="prob-h" eyebrow="Sound familiar?" lines={["The problems", "we solve."]} />
          <ul className="probs">
            {s.problems.map((p, i) => <li key={p} data-reveal style={{ ["--i" as string]: i % 2 }}>{p}</li>)}
          </ul>
        </div>
      </section>

      <section className="sec sec--cream" aria-labelledby="hand-h">
        <div className="wrap">
          <SectionHead id="hand-h" eyebrow="What HMG handles" lines={["Handled for you,", "end to end."]} />
          <ul className="tiles tiles--3">
            {s.handles.map((h, i) => (
              <li key={h.t} className="tile" data-reveal style={{ ["--i" as string]: i % 3 }}><h3>{h.t}</h3><p>{h.d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec" aria-labelledby="out-h">
        <div className="wrap cols">
          <SectionHead id="out-h" eyebrow="Expected outcomes" lines={["What changes", "for your business."]} />
          <ul className="checks">
            {s.outcomes.map((o) => <li key={o} data-reveal>{o}</li>)}
          </ul>
        </div>
      </section>

      <section className="sec sec--navy" aria-labelledby="eng-h">
        <div className="wrap">
          <SectionHead id="eng-h" eyebrow="How we engage" lines={["Simple to start."]} />
          <ProcessSteps />
        </div>
      </section>

      <section className="sec" aria-labelledby="faq-h">
        <div className="wrap cols">
          <SectionHead id="faq-h" eyebrow="FAQs" lines={["Common questions."]} lead="Have a different question? Ask us on WhatsApp or by phone." />
          <Faq items={s.faqs} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="sec sec--cream" aria-labelledby="rel-h">
          <div className="wrap">
            <SectionHead id="rel-h" eyebrow="Related insights" lines={["Further reading."]} />
            <ul className="igrid">{related.map((a, i) => <InsightCard key={a.slug} a={a} i={i} />)}</ul>
          </div>
        </section>
      )}

      <section className="sec sec--tight" aria-labelledby="oth-h">
        <div className="wrap">
          <h2 id="oth-h" className="subh">Other HMG services</h2>
          <ul className="olinks">
            {others.map((o) => <li key={o.slug}><Link href={ROUTES.service(o.slug)}>{o.title} <span aria-hidden="true">→</span></Link></li>)}
          </ul>
        </div>
      </section>

      <CtaBand title={`Ready to talk about ${s.title}?`} service={s.title} />
    </>
  );
}
