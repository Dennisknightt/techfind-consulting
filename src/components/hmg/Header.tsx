"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SERVICES } from "@/lib/hmg/content";
import { CONSULT_HREF, NAV, ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";
import { Logo, WhatsAppIcon } from "./Logo";

const isActive = (path: string, href: string) => (href === ROUTES.home ? path === href : path === href || path.startsWith(`${href}/`));

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const path = usePathname() ?? "";
  const [open, setOpen] = useState(false); // mobile menu
  const [svcOpen, setSvcOpen] = useState(false); // desktop dropdown
  const [mSvc, setMSvc] = useState(false); // mobile services accordion
  const [scrolled, setScrolled] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  const ddBtn = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);

  // Close everything on navigation.
  useEffect(() => {
    setOpen(false);
    setSvcOpen(false);
  }, [path]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, Esc to close, auto-close on desktop widths.
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  // Desktop dropdown: Esc returns focus to the toggle, click outside closes.
  useEffect(() => {
    if (!svcOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSvcOpen(false);
        ddBtn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!ddRef.current?.contains(e.target as Node)) setSvcOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [svcOpen]);

  const hoverOpen = useCallback((v: boolean) => {
    window.clearTimeout(closeTimer.current);
    if (v) {
      setSvcOpen((o) => {
        if (!o) hoverOpenedAt.current = performance.now();
        return true;
      });
    }
    else closeTimer.current = window.setTimeout(() => setSvcOpen(false), 160);
  }, []);

  return (
    <header className={`hdr${scrolled ? " hdr--scrolled" : ""}${open ? " hdr--open" : ""}`}>
      <div className="wrap hdr__bar">
        <Link href={ROUTES.home} className="hdr__logo">
          <Logo />
        </Link>

        <nav className="hdr__nav" aria-label="Primary">
          <ul className="hdr__list">
            {NAV.map((n) =>
              n.label === "Services" ? (
                <li
                  key={n.label}
                  className="hdr__item hdr__item--dd"
                  onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen(true)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && hoverOpen(false)}
                >
                  <div ref={ddRef} className="dd">
                    <span className="dd__pair">
                      <Link href={n.href} className="hdr__link" aria-current={isActive(path, n.href) ? "page" : undefined}>
                        Services
                      </Link>
                      <button
                        ref={ddBtn}
                        type="button"
                        className="dd__toggle"
                        aria-expanded={svcOpen}
                        aria-controls="svc-menu"
                        aria-label="Show all services"
                        onClick={() => setSvcOpen((v) => (v && performance.now() - hoverOpenedAt.current < 400 ? true : !v))}
                      >
                        <Chevron />
                      </button>
                    </span>
                    <div id="svc-menu" className={`dd__panel${svcOpen ? " is-open" : ""}`} hidden={!svcOpen}>
                      <ul className="dd__grid">
                        {SERVICES.map((s) => (
                          <li key={s.slug}>
                            <Link href={ROUTES.service(s.slug)} className="dd__link" onClick={() => setSvcOpen(false)}>
                              <span className="dd__t">{s.title}</span>
                              <span className="dd__d">{s.outcome}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="dd__foot">
                        <Link href={ROUTES.services} onClick={() => setSvcOpen(false)}>
                          Compare all services and find the right one →
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={n.label} className="hdr__item">
                  <Link href={n.href} className="hdr__link" aria-current={isActive(path, n.href) ? "page" : undefined}>
                    {n.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <Link href={CONSULT_HREF} className="btn btn--primary hdr__cta">
          Request a Consultation
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

      <div id="mobile-menu" className="mnav" inert={!open}>
        <nav className="mnav__inner" aria-label="Mobile">
          <ul>
            {NAV.map((n, i) =>
              n.label === "Services" ? (
                <li key={n.label} className="mnav__item" style={{ ["--i" as string]: i }}>
                  <div className="mnav__row">
                    <Link href={n.href} className="mnav__link" aria-current={isActive(path, n.href) ? "page" : undefined}>
                      Services
                    </Link>
                    <button type="button" className="mnav__more" aria-expanded={mSvc} aria-controls="m-svc" aria-label="Show services" onClick={() => setMSvc((v) => !v)}>
                      <Chevron />
                    </button>
                  </div>
                  <div id="m-svc" className={`mnav__sub${mSvc ? " is-open" : ""}`}>
                    <ul>
                      {SERVICES.map((s) => (
                        <li key={s.slug}>
                          <Link href={ROUTES.service(s.slug)} aria-current={path === ROUTES.service(s.slug) ? "page" : undefined}>
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={n.label} className="mnav__item" style={{ ["--i" as string]: i }}>
                  <Link href={n.href} className="mnav__link" aria-current={isActive(path, n.href) ? "page" : undefined}>
                    {n.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="mnav__actions" style={{ ["--i" as string]: NAV.length }}>
            <Link href={CONSULT_HREF} className="btn btn--primary btn--block">Request a Consultation</Link>
            <a href={whatsappLink()} className="btn btn--ghost-light btn--block" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> WhatsApp HMG
            </a>
            <a href={SITE.phoneHref} className="mnav__tel">{SITE.phone}</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
