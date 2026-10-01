import type { Metadata } from "next";
import { pageMeta } from "@/lib/hmg/meta";
import Link from "next/link";
import { TeamSection, TrustFacts } from "@/components/hmg/Trust";
import { CtaBand, JsonLd, orgLd, PageHero, SectionHead } from "@/components/hmg/ui";
import { OPTIONAL, VERIFIED } from "@/lib/hmg/credentials";
import { CONSULT_HREF, ROUTES, SITE } from "@/lib/hmg/site";

export const metadata: Metadata = pageMeta({
  title: "About HMG — Nairobi Tax, Accounting and Advisory Firm",
  description: "HMG Group Africa was founded in Nairobi in 2020 to help businesses stay compliant, understand their numbers and make confident financial decisions. Meet our approach.",
  path: ROUTES.about,
});

const PHILOSOPHY = [
  { t: "Clarity before complexity", d: "We explain what the numbers mean before we explain how they were prepared." },
  { t: "Decisions, not just documents", d: "Every report should end with a recommendation you can act on." },
  { t: "Prevention over cure", d: "Deadlines, exposures and cash pressure are easier to manage when they are seen early." },
  { t: "Integrity in every filing", d: "We keep your affairs correct and defensible, because that is what protects you." },
];

const RELATIONSHIP = [
  { t: "A named consultant", d: "You work with a consultant who gets to know your business." },
  { t: "Agreed scope and rhythm", d: "We agree what we do, when you will hear from us and what we need from you." },
  { t: "Plain language", d: "No jargon for its own sake. If something matters, we explain why." },
  { t: "Confidentiality", d: "Your financial information is handled carefully and in line with Kenya’s Data Protection Act, 2019." },
];

export default function About() {
  const crumbs = [{ name: "Home", href: ROUTES.home }, { name: "About", href: ROUTES.about }];
  return (
    <>
      <JsonLd data={orgLd} />
      <PageHero
        eyebrow="About HMG"
        title="A finance partner that helps you see what to do next."
        lead={`Founded in Nairobi in ${VERIFIED.founded}, HMG Group Africa helps businesses across Kenya and Africa stay compliant, understand their numbers and make confident financial decisions.`}
        crumbs={crumbs}
      >
        <Link href={CONSULT_HREF} className="btn btn--primary">Request a Consultation</Link>
      </PageHero>

      <section className="sec" aria-labelledby="story-h">
        <div className="wrap cols">
          <SectionHead id="story-h" eyebrow="Our story" lines={["More than", "number-crunchers."]} />
          <div className="prose">
            <p>HMG Group Africa was established in Nairobi in {VERIFIED.founded} with a simple idea: businesses need more than compliance paperwork. They need a partner who keeps them on the right side of Kenya’s regulations and helps them understand what their numbers are saying.</p>
            <p>Today we work with individuals, startups, SMEs, corporations and NGOs across tax, accounting, audit, financial advisory and payroll. Whether a client is answering a KRA notice, preparing for an audit or planning expansion, we walk with them every step of the way.</p>
            <p>Our work is built on integrity, expertise and a practical understanding of Africa’s evolving financial and regulatory landscape.</p>
          </div>
        </div>
      </section>

      <section className="sec sec--cream" aria-labelledby="mission-h">
        <div className="wrap">
          <div className="mission">
            <p className="eyebrow">Our mission</p>
            <h2 id="mission-h" className="mission__t">To simplify financial complexity, reduce risk, and turn regulatory requirements into clear next steps for growing businesses.</h2>
          </div>
          <h3 className="subh">Our advisory philosophy</h3>
          <ul className="tiles">
            {PHILOSOPHY.map((p, i) => (
              <li key={p.t} className="tile"><h4>{p.t}</h4><p>{p.d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <TeamSection />

      <TrustFacts heading="HMG at a glance" />

      <section className="sec sec--cream" aria-labelledby="who-h">
        <div className="wrap cols">
          <SectionHead id="who-h" eyebrow="Who we work with" lines={["From first-time founders", "to established organisations."]} />
          <div>
            <ul className="tags">
              {VERIFIED.audiences.map((a) => <li key={a}>{a}</li>)}
              {OPTIONAL.industries.map((a) => <li key={a}>{a}</li>)}
            </ul>
            <p className="prose-s">If your business is building its next chapter — starting, growing, raising funds or getting its compliance in order — we can help.</p>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="nbo-h">
        <div className="wrap cols">
          <SectionHead id="nbo-h" eyebrow="Our Nairobi presence" lines={["Nairobi-based, serving Kenya and Africa."]} lead="Our office is at Akai Plaza on Garden Estate Road, Nairobi. Meet us in person, or work with us by phone, WhatsApp and email wherever your business operates." />
          <div className="addr">
            <p className="addr__t">{SITE.name}</p>
            <p>{SITE.address.line}</p>
            <p>{SITE.hours}</p>
            <p><a href={SITE.phoneHref}>{SITE.phone}</a> · <a href={SITE.emailHref}>{SITE.email}</a></p>
            <a href={SITE.mapUrl} className="btn btn--ghost btn--sm" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
          </div>
        </div>
      </section>

      <section className="sec sec--cream" aria-labelledby="rel-h">
        <div className="wrap">
          <SectionHead id="rel-h" eyebrow="Client relationships" lines={["How we work", "with you."]} />
          <ul className="tiles tiles--4">
            {RELATIONSHIP.map((p, i) => (
              <li key={p.t} className="tile"><h3>{p.t}</h3><p>{p.d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
