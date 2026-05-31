"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Twitter, Linkedin, Mail, ArrowUpRight, Globe } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "AI Engine Optimization", href: "/ai-engine-optimization" },
    { label: "AI Visibility Audit",    href: "/ai-visibility-audit" },
    { label: "AI Business Automation", href: "/ai-business-automation" },
    { label: "TechFind Talent",        href: "/talent" },
  ],
  Company: [
    { label: "About",       href: "/about" },
    { label: "Case Studies",href: "/case-studies" },
    { label: "Insights",    href: "/insights" },
    { label: "Contact",     href: "/contact" },
  ],
  "AI Platforms": [
    { label: "ChatGPT Optimization", href: "/ai-engine-optimization" },
    { label: "Gemini Visibility",    href: "/ai-engine-optimization" },
    { label: "Perplexity Rankings",  href: "/ai-engine-optimization" },
    { label: "Google AI Overviews",  href: "/ai-engine-optimization" },
  ],
};

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-[0_4px_14px_var(--accent-glow)]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
                TechFind
                <span className="gradient-text-violet ml-1">Consulting</span>
              </span>
            </Link>
            <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 max-w-xs">
              The world&apos;s first AI Engine Optimization agency helping businesses get discovered,
              cited, and recommended by AI systems globally.
            </p>
            <div className="flex items-center gap-1.5 mb-5">
              <Globe className="w-3.5 h-3.5 text-[var(--muted)] opacity-50" />
              <span className="text-xs text-[var(--muted)] opacity-50">Nairobi, Kenya · Global Reach</span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { icon: Twitter,  href: "#",    label: "Twitter" },
                { icon: Linkedin, href: "#",    label: "LinkedIn" },
                { icon: Mail,     href: "mailto:hello@techfind.co.ke", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full surface flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--border-accent)] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-60 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-5 mb-10"
          style={{ background: "linear-gradient(135deg, var(--accent-glow), var(--accent-2-glow))", border: "1px solid var(--border-accent)" }}
        >
          <div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-1" style={{ fontFamily: "var(--font-space)" }}>
              Is AI recommending your business?
            </h3>
            <p className="text-[var(--muted)] text-sm">Find out with a free AI Visibility Assessment.</p>
          </div>
          <Link href="/ai-visibility-audit" className="btn-primary text-sm whitespace-nowrap group">
            Book Your AI Audit
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs text-[var(--muted)] opacity-50">
            © 2025 TechFind Consulting Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-[var(--muted)] opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-all"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
