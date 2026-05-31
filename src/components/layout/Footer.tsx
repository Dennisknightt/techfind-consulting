"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Twitter, Linkedin, Mail, ArrowUpRight, Globe } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "AI Engine Optimization", href: "/ai-engine-optimization" },
    { label: "AI Visibility Audit", href: "/ai-visibility-audit" },
    { label: "AI Business Automation", href: "/ai-business-automation" },
    { label: "TechFind Talent", href: "/talent" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  "AI Platforms": [
    { label: "ChatGPT Optimization", href: "/ai-engine-optimization" },
    { label: "Gemini Visibility", href: "/ai-engine-optimization" },
    { label: "Perplexity Rankings", href: "/ai-engine-optimization" },
    { label: "Google AI Overviews", href: "/ai-engine-optimization" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-[#020817] border-t border-white/5 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span
                className="font-bold text-xl tracking-tight"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                TechFind
                <span className="gradient-text-blue ml-1">Consulting</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              The world&apos;s first AI Engine Optimization agency helping businesses
              get discovered, cited, and recommended by AI systems globally.
            </p>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-white/30" />
              <span className="text-white/30 text-xs">Nairobi, Kenya · Global Reach</span>
            </div>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "mailto:hello@techfind.co.ke", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-blue rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
        >
          <div>
            <h3
              className="text-xl font-bold mb-1"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Is AI recommending your business?
            </h3>
            <p className="text-white/50 text-sm">
              Find out with a free AI Visibility Assessment.
            </p>
          </div>
          <Link
            href="/ai-visibility-audit"
            className="flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all whitespace-nowrap group"
          >
            Book Your AI Audit
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-white/30 text-xs">
            © 2025 TechFind Consulting Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/30 text-xs hover:text-white/60 transition-colors"
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
