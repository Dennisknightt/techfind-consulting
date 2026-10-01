import Link from "next/link";
import type { Article, Service } from "@/lib/hmg/content";
import { formatDate, PROCESS } from "@/lib/hmg/content";
import { abs, CONSULT_HREF, ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";
import { CoverArt } from "./CoverArt";
import { Eyebrow, Lines } from "./Lines";
import { WhatsAppIcon } from "./Logo";
import { ServiceArt } from "./ServiceMotifs";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.href) })),
  };
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="crumbs">
        <ol>
          {items.map((it, i) => (
            <li key={it.href}>
              {i < items.length - 1 ? <Link href={it.href}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(items)} />
    </>
  );
}

export function SectionHead({ eyebrow, lines, lead, id, children }: { eyebrow: string; lines: string[]; lead?: string; id: string; children?: React.ReactNode }) {
  return (
    <div className="sec__head">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Lines id={id} lines={lines} />
      {lead && <p className="sec__lead">{lead}</p>}
      {children}
    </div>
  );
}

export function PageHero({ eyebrow, title, lead, crumbs, children, art }: { eyebrow: string; title: string; lead: string; crumbs?: { name: string; href: string }[]; children?: React.ReactNode; art?: React.ReactNode }) {
  return (
    <section className={`phero${art ? " phero--art" : ""}`} aria-labelledby="page-h">
      <div className="wrap phero__grid">
        <div className="phero__copy">
          {crumbs && <Breadcrumbs items={crumbs} />}
          <p className="eyebrow hero__in" style={{ ["--d" as string]: "0s" }}>{eyebrow}</p>
          <h1 id="page-h" className="phero__h">
            <span className="hero__mask"><span className="hero__line" style={{ ["--d" as string]: ".05s" }}>{title}</span></span>
          </h1>
          <p className="phero__lead hero__in" style={{ ["--d" as string]: ".2s" }}>{lead}</p>
          {children && <div className="hero__in" style={{ ["--d" as string]: ".3s" }}>{children}</div>}
        </div>
        {art && <div className="phero__art hero__in" style={{ ["--d" as string]: ".25s" }}>{art}</div>}
      </div>
    </section>
  );
}

export function CtaBand({ title = "Your next smart move starts with clarity.", lead = "Tell us what you are dealing with. An HMG consultant will call you back and agree the next step with you.", service }: { title?: string; lead?: string; service?: string }) {
  const msg = service ? `Hello HMG, I would like to discuss ${service}.` : undefined;
  return (
    <section className="ctab" aria-labelledby="ctab-h">
      <div className="wrap ctab__grid">
        <div>
          <h2 id="ctab-h" className="ctab__h">{title}</h2>
          <p className="ctab__lead">{lead}</p>
        </div>
        <div className="ctab__actions">
          <Link href={CONSULT_HREF} className="btn btn--primary" data-magnetic>Book a Consultation</Link>
          <a href={whatsappLink(msg)} className="btn btn--ghost-light" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Chat on WhatsApp</a>
          <a href={SITE.phoneHref} className="btn btn--ghost-light">Call {SITE.phone}</a>
        </div>
      </div>
    </section>
  );
}

export function ProcessSteps({ steps = PROCESS }: { steps?: readonly { n: string; title: string; body: string }[] }) {
  return (
    <ol className="steps" data-scroll-path>
      <li className="steps__track" aria-hidden="true" />
      {steps.map((p) => (
        <li key={p.n} className="step" data-step>
          <span className="step__node" aria-hidden="true"><span>{p.n}</span></span>
          <h3 className="step__title"><span className="sr-only">Step {Number(p.n)}: </span>{p.title}</h3>
          <p className="step__body">{p.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function ServiceCard({ s, i = 0, detailed = false }: { s: Service; i?: number; detailed?: boolean }) {
  return (
    <li className="scard" data-reveal style={{ ["--i" as string]: i % 3 }}>
      <Link href={ROUTES.service(s.slug)} className="scard__link">
        <div className="scard__art"><ServiceArt motif={s.motif} /></div>
        <div className="scard__body">
          <h3 className="scard__title">{s.title}</h3>
          {detailed && <p className="scard__who"><span>For</span>{s.whoFor}</p>}
          <p className="scard__row"><span>The problem</span>{s.problem}</p>
          {detailed && (
            <p className="scard__row"><span>HMG handles</span>{s.handles.slice(0, 4).map((h) => h.t).join(" · ")}</p>
          )}
          <p className="scard__out"><span>Outcome</span>{s.outcome}</p>
          <span className="scard__more">Explore service <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </li>
  );
}

export function InsightCard({ a, i = 0, showDate = true }: { a: Article; i?: number; showDate?: boolean }) {
  return (
    <li className="icard" data-reveal style={{ ["--i" as string]: i % 3 }}>
      <Link href={ROUTES.article(a.slug)} className="icard__link">
        <div className="icard__cover"><CoverArt kind={a.kind} /></div>
        <div className="icard__body">
          <p className="meta">
            <span className="meta__cat">{a.category}</span>
            <span aria-hidden="true">·</span>
            <span>{a.readTime} min read</span>
            {showDate && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={a.published}>{formatDate(a.published)}</time>
              </>
            )}
          </p>
          <h3 className="icard__title">{a.title}</h3>
          <p className="icard__sum">{a.summary}</p>
          <span className="icard__more">Read article <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </li>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q} className="faq__item">
          <summary>
            <span>{f.q}</span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export const orgLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "AccountingService"],
  "@id": `${SITE.url}/#org`,
  name: SITE.name,
  description: SITE.description,
  url: abs(ROUTES.home),
  logo: abs("/hmg/logo.svg"),
  image: abs("/hmg/logo.svg"),
  foundingDate: String(SITE.founded),
  telephone: SITE.phone,
  email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: "Nairobi", addressCountry: "KE" },
  areaServed: [{ "@type": "Country", name: "Kenya" }],
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" }],
  sameAs: [SITE.social.linkedin, SITE.social.facebook].filter(Boolean),
};
