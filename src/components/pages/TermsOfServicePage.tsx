"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using the TechFind Consulting website (techfind.co.ke) or engaging our services, you agree to be bound by these Terms of Service and our Privacy Policy.",
      "If you do not agree to these terms, please do not use our website or services.",
    ],
  },
  {
    title: "Description of Services",
    content: [
      "TechFind Consulting provides AI Engine Optimization (AEO), AI Visibility Audits, AI Business Automation, and talent placement services.",
      "Specific services, deliverables, timelines, and fees are defined in individual service agreements or proposals issued to clients.",
      "We reserve the right to modify, suspend, or discontinue any aspect of our services with reasonable notice.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All content on this website — including text, graphics, logos, images, and code — is the property of TechFind Consulting Ltd. and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, or create derivative works from our content without prior written permission.",
      "Deliverables produced for clients under a paid engagement are subject to the terms of the applicable service agreement.",
    ],
  },
  {
    title: "Client Obligations",
    content: [
      "Clients are responsible for providing accurate, complete, and timely information required for us to deliver services effectively.",
      "Clients are responsible for ensuring they have the rights and permissions necessary for any content, brand assets, or materials they provide to us.",
      "Clients must not use our services for any unlawful purpose or in violation of these terms.",
    ],
  },
  {
    title: "Payment Terms",
    content: [
      "Payment terms, rates, and schedules are set out in individual service agreements.",
      "Unless otherwise agreed, invoices are due within 14 days of issue.",
      "TechFind Consulting reserves the right to pause or suspend services on accounts with overdue balances.",
    ],
  },
  {
    title: "Confidentiality",
    content: [
      "Both parties agree to treat confidential information shared in the course of engagement with appropriate care and discretion.",
      "We will not disclose client-specific information, strategies, or results without written consent, except as required by law.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "TechFind Consulting's liability for any claim arising from our services is limited to the fees paid for the specific service giving rise to the claim.",
      "We are not liable for indirect, incidental, or consequential damages, including lost profits or revenue.",
      "We do not guarantee specific results from AEO or automation services, as outcomes depend on factors outside our control, including AI platform algorithm changes.",
    ],
  },
  {
    title: "Disclaimers",
    content: [
      "Our website and services are provided 'as is' without warranties of any kind, express or implied.",
      "We make no warranties regarding the accuracy or completeness of information on this website.",
      "AI platform behaviours and algorithms change frequently; we cannot guarantee permanence of any AI visibility outcomes.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These Terms of Service are governed by the laws of Kenya.",
      "Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya.",
    ],
  },
  {
    title: "Changes to Terms",
    content: [
      "We may update these Terms of Service at any time. Continued use of our website or services after changes constitutes acceptance of the updated terms.",
      "Material changes will be communicated via email to active clients.",
    ],
  },
  {
    title: "Contact",
    content: [
      "For questions about these Terms of Service, please contact us at:",
      "**TechFind Consulting Ltd.**\nNairobi, Kenya\nEmail: hello@techfind.co.ke",
    ],
  },
];

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20 overflow-hidden hero-page">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="orb orb-blue animate-orb-2 absolute -top-20 right-0 w-96 h-96 opacity-25" />

        <div className="relative max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-8"
          >
            <span className="section-label"><FileText className="w-3.5 h-3.5" />Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Terms of <span className="gradient-text">Service</span>
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
              These Terms of Service govern your use of the TechFind Consulting website and our professional services.
              Please read them carefully before engaging with us or accessing our site.
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
