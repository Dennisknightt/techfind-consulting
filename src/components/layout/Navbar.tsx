"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Services",
    href: "#",
    dropdown: [
      { label: "AI Engine Optimization", href: "/ai-engine-optimization" },
      { label: "AI Visibility Audit",    href: "/ai-visibility-audit" },
      { label: "AI Business Automation", href: "/ai-business-automation" },
      { label: "TechFind Talent",        href: "/talent" },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About",        href: "/about" },
  { label: "Insights",     href: "/insights" },
];

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9 rounded-full" />;
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--border-accent)] transition-all duration-200"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
          transition={{ duration: 0.18 }}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

/* ─── Logo — theme-aware ─────────────────────────────────────────── */
function NavLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // On dark backgrounds the logo's dark navy text becomes invisible.
  // brightness(0) invert(1) renders a clean white silhouette — standard
  // practice for dark-mode logos (Apple, Stripe, Vercel, etc.).
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Image
      src="/Logo.png"
      alt="TechFind International Consulting"
      width={180}
      height={48}
      priority
      className="h-10 w-auto object-contain transition-all duration-300"
      style={{ filter: isDark ? "brightness(0) invert(1)" : "none" }}
    />
  );
}

export function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-2 shadow-[var(--shadow-sm)]" : "py-4 bg-transparent"
      )}
      style={
        scrolled
          ? { background: "var(--nav-bg)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }
          : {}
      }
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center group shrink-0">
          <NavLogo />
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {link.dropdown ? (
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors rounded-xl hover:bg-[var(--card)]">
                  {link.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors rounded-xl hover:bg-[var(--card)] block"
                >
                  {link.label}
                </Link>
              )}

              <AnimatePresence>
                {link.dropdown && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl border p-2 shadow-[var(--shadow-md)]"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all group/item"
                        style={{ color: "var(--muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--card-hover)";
                          e.currentTarget.style.color = "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "var(--muted)";
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/contact"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors px-4 py-2"
          >
            Contact
          </Link>
          <Link href="/ai-visibility-audit" className="btn-primary text-sm">
            Book AI Audit
          </Link>
        </div>

        {/* ── Mobile: toggle + burger ── */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl border text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t mt-2 overflow-hidden"
            style={{
              background: "var(--nav-bg)",
              backdropFilter: "blur(20px)",
              borderColor: "var(--border)",
            }}
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.dropdown ? (
                    <>
                      <span className="block px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                        {link.label}
                      </span>
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-6 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors rounded-xl hover:bg-[var(--card-hover)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors rounded-xl hover:bg-[var(--card-hover)]"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <Link
                  href="/ai-visibility-audit"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center text-sm inline-flex"
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
