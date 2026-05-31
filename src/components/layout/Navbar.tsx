"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Services",
    href: "#",
    dropdown: [
      { label: "AI Engine Optimization", href: "/ai-engine-optimization" },
      { label: "AI Visibility Audit", href: "/ai-visibility-audit" },
      { label: "AI Business Automation", href: "/ai-business-automation" },
      { label: "TechFind Talent", href: "/talent" },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b border-white/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
            <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-md group-hover:blur-lg transition-all" />
          </div>
          <span
            className="font-display font-bold text-lg tracking-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            TechFind
            <span className="gradient-text-blue ml-1">Consulting</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {link.dropdown ? (
                <button className="flex items-center gap-1 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  {link.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )}

              <AnimatePresence>
                {link.dropdown && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 glass rounded-xl border border-white/10 p-2 overflow-hidden"
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-cyan-400 transition-colors" />
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
          >
            Contact
          </Link>
          <Link
            href="/ai-visibility-audit"
            className="relative group text-sm font-medium px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
          >
            Book AI Audit
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg glass text-white/70 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/5 mt-2"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.dropdown ? (
                    <>
                      <span className="block px-4 py-2 text-xs text-white/40 uppercase tracking-wider font-medium">
                        {link.label}
                      </span>
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-6 py-2 text-sm text-white/70 hover:text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-white/5">
                <Link
                  href="/ai-visibility-audit"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center text-sm font-medium px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                >
                  Book AI Visibility Audit
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
