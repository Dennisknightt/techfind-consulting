"use client";

import { useEffect, useState } from "react";

/** Returns the id of the section crossing the middle of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Which nav item each page section belongs to. */
export const SECTION_TO_NAV: Record<string, string> = {
  home: "home",
  services: "services",
  decisions: "services",
  approach: "services",
  about: "about",
  insights: "insights",
  journey: "insights",
  contact: "contact",
  consultation: "contact",
};
export const SECTION_IDS = Object.keys(SECTION_TO_NAV);
