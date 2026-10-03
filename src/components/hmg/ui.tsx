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

/** A hairline with a data point travelling along it; decorative, loops only while on screen. */
export function Pulse() {
  return <div className="pline" data-loop aria-hidden="true"><span /><span /></div>;
}

export function PageHero({ eyebrow, title, lead, crumbs, children, art }: { eyebrow: string; title: string; lead: string; crumbs?: { name: string; href: string }[]; children?: React.ReactNode; art?: React.ReactNode }) {
  return (
    <section className={`phero${art ? " phero--art" : ""}`} aria-labelledby="page-h">
      <div className="wrap phero__grid">
        <div className="phero__copy">
          {crumbs && <Breadcrumbs items={crumbs} />}
          <div className="enter">
            <p className="eyebrow">{eyebrow}</p>
            <h1 id="page-h" className="phero__h">{title}</h1>
            <p className="phero__lead">{lead}</p>
            {children}
          </div>
        </div>
        {art && <div className="phero__art enter">{art}</div>}
      </div>
      <Pulse />
    </section>
  );
}

export function CtaBand({ title = "Your next smart move starts with clarity.", lead = "Tell us what you are dealing with. An HMG consultant will get back to you during working hours to agree the next step.", service }: { title?: string; lead?: string; service?: string }) {
  const msg = service ? `Hello HMG, I would like to discuss ${service}.` : undefined;
  return (
    <section className="ctab" aria-labelledby="ctab-h">
      <Pulse />
      <div className="wrap ctab__grid">
        <div>
          <h2 id="ctab-h" className="ctab__h">{title}</h2>
          <p className="ctab__lead">{lead}</p>
        </div>
        <div className="ctab__actions">
          <Link href={CONSULT_HREF} className="btn btn--primary">Request a Consultation</Link>
          <a href={whatsappLink(msg)} className="btn btn--ghost-light" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp HMG</a>
          <a href={SITE.phoneHref} className="btn btn--ghost-light">Call HMG</a>
        </div>
      </div>
    </section>
  );
}

/** Compact, shared four-step process. Each step carries a complete accessible label. */
export function ProcessCompact({ steps = PROCESS, dark = false }: { steps?: readonly { n: string; title: string; body: string }[]; dark?: boolean }) {
  return (
    <ol className={`pc${dark ? " pc--dark" : ""}`} aria-label="How engagement works">
      {steps.map((p, i) => (
        <li key={p.n} className="pc__step">
          <span className="pc__n" aria-hidden="true">{i + 1}</span>
          <div>
            <h3 className="pc__t"><span className="sr-only">{`Step ${i + 1} of ${steps.length}: `}</span>{p.title}</h3>
            <p className="pc__b">{p.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ServiceCard({ s, i = 0, detailed = false }: { s: Service; i?: number; detailed?: boolean }) {
  return (
    <li className="scard">
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
    <li className="icard">
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
  logo: abs("/hmg/brand/hmg-logo.png"),
  image: abs("/hmg/brand/hmg-logo.png"),
  foundingDate: String(SITE.founded),
  telephone: SITE.phone,
  email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: "Nairobi", addressCountry: "KE" },
  areaServed: [{ "@type": "Country", name: "Kenya" }, { "@type": "Continent", name: "Africa" }],
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" }],
  sameAs: [SITE.social.linkedin, SITE.social.facebook].filter(Boolean),
};
