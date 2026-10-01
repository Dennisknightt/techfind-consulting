import type { Metadata } from "next";
import { pageMeta } from "@/lib/hmg/meta";
import { ContactForm } from "@/components/hmg/ContactForm";
import { WhatsAppIcon } from "@/components/hmg/Logo";
import { JsonLd, orgLd, PageHero } from "@/components/hmg/ui";
import { ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";

export const metadata: Metadata = pageMeta({
  title: "Contact HMG — Book a Consultation in Nairobi",
  description: "Call +254 703 126 677, WhatsApp or email HMG Group Africa, or request a callback. Akai Plaza, Garden Estate Road, Nairobi. Monday–Friday, 8:00 AM–5:00 PM.",
  path: ROUTES.contact,
});

export default function Contact() {
  const crumbs = [{ name: "Home", href: ROUTES.home }, { name: "Contact", href: ROUTES.contact }];
  return (
    <>
      <JsonLd data={{ ...orgLd, "@type": ["ProfessionalService", "AccountingService"], contactPoint: { "@type": "ContactPoint", telephone: SITE.phone, email: SITE.email, contactType: "customer service", areaServed: "KE", availableLanguage: ["English", "Swahili"] } }} />
      <PageHero eyebrow="Contact" title="Let’s talk about your business." lead="Call, WhatsApp or email us — or request a callback and a consultant will contact you during working hours." crumbs={crumbs} />
      <section className="sec sec--tight contact" aria-label="Contact details and consultation form">
        <div className="wrap contact__grid">
          <div className="contact__info">
            <ul className="cways">
              <li>
                <a href={SITE.phoneHref} className="cway">
                  <span className="cway__k">Call</span>
                  <span className="cway__v">{SITE.phone}</span>
                </a>
              </li>
              <li>
                <a href={whatsappLink()} className="cway" target="_blank" rel="noopener noreferrer">
                  <span className="cway__k"><WhatsAppIcon size={16} /> WhatsApp</span>
                  <span className="cway__v">Message us on WhatsApp</span>
                </a>
              </li>
              <li>
                <a href={SITE.emailHref} className="cway">
                  <span className="cway__k">Email</span>
                  <span className="cway__v">{SITE.email}</span>
                </a>
              </li>
            </ul>
            <div className="addr">
              <p className="addr__t">Visit our office</p>
              <p>{SITE.address.line}</p>
              <p>{SITE.hours}</p>
              <a href={SITE.mapUrl} className="btn btn--ghost btn--sm" target="_blank" rel="noopener noreferrer">Get directions</a>
              <svg className="addr__map" viewBox="0 0 320 140" aria-hidden="true">
                <rect width="320" height="140" rx="12" className="f-cream" />
                <path d="M0 96 C80 90 120 70 180 74 S280 40 320 36" fill="none" stroke="#092B46" strokeOpacity=".18" strokeWidth="14" />
                <path d="M120 0 V140" stroke="#092B46" strokeOpacity=".12" strokeWidth="10" />
                <path d="M0 40 H320" stroke="#092B46" strokeOpacity=".08" strokeWidth="6" />
                <g transform="translate(170 62)"><path d="M0-26c-10 0-17 7-17 16 0 13 17 30 17 30S17 3 17-10C17-19 10-26 0-26Z" className="f-navy" /><circle cy="-10" r="6" className="f-teal" /></g>
                <text x="196" y="58" fontSize="11" fontWeight="700" fill="#062E4F">Akai Plaza</text>
                <text x="196" y="72" fontSize="10" fill="#3F5A70">Garden Estate Rd</text>
              </svg>
            </div>
          </div>
          <div id="consultation" className="contact__form">
            <ContactForm variant="full" />
          </div>
        </div>
      </section>
    </>
  );
}
