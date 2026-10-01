"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONSULT_HREF, SITE, whatsappLink } from "@/lib/hmg/site";
import { WhatsAppIcon } from "./Logo";

/**
 * Phones: a Call / WhatsApp / Consult bar after the visitor leaves the first
 * screen. Desktop: a compact WhatsApp button. Both hide while the contact form
 * or the footer is on screen, so they never cover a form field or footer link.
 */
export function ActionBar() {
  const path = usePathname();
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  useEffect(() => {
    const targets = ["consultation", "site-footer", "callback"].map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
      setBlocked(seen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [path]);

  const show = past && !blocked;
  return (
    <div className={`abar${show ? " abar--show" : ""}`} inert={!show}>
      <nav className="abar__m" aria-label="Quick actions">
        <a href={SITE.phoneHref} className="abar__btn">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1Z" fill="currentColor" /></svg>
          Call
        </a>
        <a href={whatsappLink()} className="abar__btn" target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={20} />
          WhatsApp
        </a>
        <Link href={CONSULT_HREF} className="abar__btn abar__btn--primary">Consult</Link>
      </nav>
      <a href={whatsappLink()} className="abar__wa" target="_blank" rel="noopener noreferrer" aria-label="Chat with HMG on WhatsApp">
        <WhatsAppIcon size={22} />
        <span>Chat with HMG</span>
      </a>
    </div>
  );
}
