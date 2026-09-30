"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSULT_HREF, whatsappLink } from "@/lib/hmg/site";
import { WhatsAppIcon } from "./Logo";
import { SECTION_IDS, useActiveSection } from "./useActiveSection";

const LABEL: Record<string, string> = {
  services: "Discuss a service",
  decisions: "See this for your business",
  approach: "Start with step one",
  about: "Meet your consultant",
  insights: "Talk it through",
  journey: "Start your enquiry",
};

/**
 * Contextual sticky actions: a WhatsApp button on desktop, and a two-action bar
 * on phones whose label follows the section being read. Hides itself over the
 * contact form and while the mobile menu is open so it never covers content.
 */
export function FloatActions() {
  const section = useActiveSection(SECTION_IDS);
  const [past, setPast] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = past && !atForm;
  const label = (section && LABEL[section]) || "Book a Consultation";
  return (
    <div className={`fa${show ? " fa--show" : ""}`} inert={!show}>
      <Link href={CONSULT_HREF} className="btn btn--primary fa__book">
        <span key={label} className="fa__label">{label}</span>
      </Link>
      <a href={whatsappLink()} className="fa__wa" target="_blank" rel="noopener noreferrer" aria-label="Chat with HMG on WhatsApp">
        <WhatsAppIcon size={24} />
        <span className="fa__wa-t">Chat with HMG</span>
      </a>
    </div>
  );
}
