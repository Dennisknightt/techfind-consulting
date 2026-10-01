"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Privacy-safe event tracking. Only these events are emitted, with the page
 * path and no personal or enquiry data:
 *   consultation_request · form_submit_success · whatsapp_click · phone_click · email_click
 * Events go to window.dataLayer (consumed by GTM/GA4 if HMG adds a tag);
 * nothing is sent anywhere if no tag is installed.
 */
export type HmgEvent = "consultation_request" | "form_submit_success" | "whatsapp_click" | "phone_click" | "email_click";

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

export function track(event: HmgEvent) {
  if (typeof window === "undefined") return;
  (window.dataLayer ??= []).push({ event, page: window.location.pathname });
}

export function Analytics() {
  const path = usePathname();

  // Delegated click tracking for contact links and consultation CTAs.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me/")) track("whatsapp_click");
      else if (href.startsWith("tel:")) track("phone_click");
      else if (href.startsWith("mailto:") && !href.startsWith("mailto:?")) track("email_click");
      else if (href.endsWith("#consultation")) track("consultation_request");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // After client-side navigation, move focus to the new page's heading.
  useEffect(() => {
    if (!(window as unknown as { __hmgNav?: boolean }).__hmgNav) {
      (window as unknown as { __hmgNav?: boolean }).__hmgNav = true;
      return; // first load: leave focus alone
    }
    if (window.location.hash) return;
    const h1 = document.querySelector<HTMLElement>("#main h1");
    if (h1) {
      h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    }
  }, [path]);

  return null;
}
