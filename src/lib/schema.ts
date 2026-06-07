// Schema Markup Generator for TechFind
// Generates JSON-LD structured data for SEO/AEO optimization

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TechFind",
  "legalName": "TechFind Global Recruitment Ltd",
  "url": "https://techfind.vercel.app",
  "logo": "https://techfind.vercel.app/Logo.png",
  "description": "Global tech recruitment platform connecting companies with world-class African software developers for remote positions",
  "foundingDate": "2024",
  "areaServed": ["AF", "EU", "US", "AS", "AUS"],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+254-700-000-000",
    "contactType": "Customer Service",
    "email": "hello@techfind.co.ke"
  },
  "sameAs": [
    "https://linkedin.com/company/techfind",
    "https://twitter.com/techfind"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KE",
    "addressLocality": "Nairobi",
    "addressRegion": "Nairobi County",
    "streetAddress": "Tech Hub Nairobi"
  }
};

export const serviceSchema = (serviceName: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "TechFind",
    "url": "https://techfind.vercel.app"
  },
  "areaServed": {
    "@type": "Country",
    "name": ["United States", "United Kingdom", "European Union", "Asia", "Australia"]
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Recruitment Services",
    "itemListElement": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": serviceName
      }
    }
  }
});

export const faqSchema = (questions: Array<{ q: string; a: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": questions.map((item) => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a
    }
  }))
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const jobPostingSchema = (
  jobTitle: string,
  jobLocation: string,
  employmentType: string = "CONTRACTOR"
) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": jobTitle,
  "description": `TechFind is hiring ${jobTitle}s for our global client base. Remote position with competitive benefits.`,
  "hiringOrganization": {
    "@type": "Organization",
    "name": "TechFind",
    "sameAs": "https://techfind.vercel.app",
    "logo": "https://techfind.vercel.app/Logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Remote",
      "addressLocality": jobLocation
    }
  },
  "employmentType": employmentType,
  "baseSalary": {
    "@type": "PriceSpecification",
    "priceCurrency": "USD",
    "price": "Competitive"
  }
});

export const reviewSchema = (
  rating: number,
  reviewer: string,
  text: string
) => ({
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": rating,
    "bestRating": 5,
    "worstRating": 1
  },
  "reviewer": {
    "@type": "Person",
    "name": reviewer
  },
  "reviewBody": text
});

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "TechFind",
  "image": "https://techfind.vercel.app/Logo.png",
  "description": "Global tech recruitment platform specializing in African software developers",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tech Hub Nairobi",
    "addressLocality": "Nairobi",
    "addressRegion": "Nairobi County",
    "postalCode": "00100",
    "addressCountry": "KE"
  },
  "telephone": "+254-700-000-000",
  "priceRange": "Varies",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "08:00",
    "closes": "18:00"
  }
};

export const aggregateRatingSchema = (
  ratingValue: number = 4.9,
  reviewCount: number = 487
) => ({
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "ratingValue": ratingValue,
  "reviewCount": reviewCount,
  "bestRating": 5,
  "worstRating": 1
});
