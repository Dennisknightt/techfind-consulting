import type { Metadata } from "next";
import { InsightLab } from "@/components/hmg/InsightLab";
import { InsightsSection } from "@/components/hmg/InsightsSection";
import { Services } from "@/components/hmg/Services";
import { Approach, FinalCta, Hero, Journey, Trust, Why } from "@/components/hmg/Sections";
import { SERVICES } from "@/lib/hmg/content";
import { SITE } from "@/lib/hmg/site";

export const metadata: Metadata = {
  alternates: { canonical: "/hmg" },
  openGraph: { url: "/hmg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/hmg/logo.svg`,
      foundingDate: String(SITE.founded),
      email: SITE.email,
      telephone: SITE.phone,
      sameAs: [SITE.social.linkedin, SITE.social.facebook],
    },
    {
      "@type": ["ProfessionalService", "AccountingService"],
      "@id": `${SITE.url}/#service`,
      name: SITE.name,
      description: SITE.description,
      url: `${SITE.url}/hmg`,
      telephone: SITE.phone,
      email: SITE.email,
      parentOrganization: { "@id": `${SITE.url}/#org` },
      address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: "Nairobi", addressCountry: "KE" },
      areaServed: [{ "@type": "Country", name: "Kenya" }, { "@type": "Continent", name: "Africa" }],
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Core services",
        itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.summary } })),
      },
    },
  ],
};

export default function HmgHome() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <Trust />
      <Services />
      <InsightLab />
      <Approach />
      <Why />
      <InsightsSection />
      <Journey />
      <FinalCta />
    </>
  );
}
