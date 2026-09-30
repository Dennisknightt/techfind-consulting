"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSULT_HREF, NAV } from "@/lib/hmg/site";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const mq = window.matchMedia("(min-width: 960px)");
    const onMq = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <header className={`hdr${scrolled ? " hdr--scrolled" : ""}${open ? " hdr--open" : ""}`}>
      <div className="wrap hdr__bar">
        <Link href="/hmg" className="hdr__logo" aria-label="HMG Group Africa — home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hdr__nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className="hdr__link">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href={CONSULT_HREF} className="btn btn--primary hdr__cta" data-magnetic>
          Book a Consultation
        </Link>
        <button
          type="button"
          className="hdr__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hdr__bars" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <div id="mobile-menu" className="mnav" aria-hidden={!open} inert={!open}>
        <nav className="mnav__inner" aria-label="Mobile">
          {NAV.map((n, i) => (
            <Link key={n.label} href={n.href} className="mnav__link" style={{ ["--i" as string]: i }} onClick={() => setOpen(false)}>
              <span className="mnav__n">0{i + 1}</span>
              {n.label}
            </Link>
          ))}
          <Link
            href={CONSULT_HREF}
            className="btn btn--primary mnav__cta"
            style={{ ["--i" as string]: NAV.length }}
            onClick={() => setOpen(false)}
          >
            Book a Consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}
