"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content: [
      "**Contact information** you provide voluntarily — name, email address, company name, and phone number — when you submit an enquiry, book a consultation, or fill in our contact form.",
      "**Usage data** collected automatically when you visit our website, including your IP address, browser type, pages visited, and time spent on pages. This data is collected via standard analytics tools and is used in aggregate form only.",
      "**Communication records** — any emails, messages, or submissions you send to us, retained to provide our services and respond to your enquiries.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To respond to your enquiries and provide the services you request.",
      "To send you information about our services, case studies, and insights — only where you have expressed interest or consented.",
      "To improve our website and services based on aggregated usage patterns.",
      "To comply with our legal obligations.",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We may share information with trusted service providers who assist us in operating our website and delivering our services (e.g., email delivery, analytics), bound by strict confidentiality obligations.",
      "We may disclose information where required by law or to protect the rights, property, or safety of TechFind Consulting, our clients, or others.",
    ],
  },
  {
    title: "Data Retention",
    content: [
      "We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law.",
      "Contact enquiry records are retained for up to 3 years after the last interaction.",
      "You may request deletion of your personal data at any time by contacting us at hello@techfind.co.ke.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "Our website uses cookies to enhance your browsing experience. These include essential cookies (required for the site to function) and analytics cookies (to understand how visitors use our site).",
      "You may disable cookies through your browser settings, though this may affect certain features of the website.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access the personal information we hold about you.",
      "You have the right to request correction of inaccurate information.",
      "You have the right to request deletion of your data, subject to our legal obligations.",
      "You have the right to withdraw consent for marketing communications at any time.",
      "To exercise any of these rights, contact us at hello@techfind.co.ke.",
    ],
  },
  {
    title: "Security",
    content: [
      "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.",
      "While we take reasonable precautions, no method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. The updated version will be indicated by the 'Last updated' date below.",
      "We encourage you to review this policy periodically.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have questions about this Privacy Policy or how we handle your data, please contact us at:",
      "**TechFind Consulting Ltd.**\nNairobi, Kenya\nEmail: hello@techfind.co.ke",
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20 overflow-hidden hero-page">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="orb orb-accent animate-orb absolute -top-20 -left-20 w-96 h-96 opacity-25" />

        <div className="relative max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-8"
          >
            <span className="section-label"><Shield className="w-3.5 h-3.5" />Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Privacy <span className="gradient-text">Policy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] text-sm mb-12"
          >
            Last updated: June 2026
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="surface rounded-3xl p-8 mb-8"
          >
            <p className="text-[var(--muted)] leading-relaxed">
              TechFind Consulting Ltd. (&ldquo;TechFind&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy.
              This policy explains how we collect, use, and safeguard the personal information you share with us
              when you visit our website or engage with our services.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="surface rounded-2xl p-7"
              >
                <h2
                  className="text-lg font-bold text-[var(--text)] mb-4"
                  style={{ fontFamily: "var(--font-space)" }}
                >
                  {i + 1}. {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, j) => (
                    <li key={j} className="text-sm text-[var(--muted)] leading-relaxed">
                      {item.split(/\*\*(.*?)\*\*/g).map((part, k) =>
                        k % 2 === 1 ? (
                          <strong key={k} className="text-[var(--text)] font-semibold">
                            {part}
                          </strong>
                        ) : (
                          <span key={k}>{part}</span>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
