import type { Metadata } from "next";
import Script from "next/script";
import { AuditFlow } from "@/components/audit/AuditFlow";

export const metadata: Metadata = {
  title: "Free AI Visibility Audit | TechFind Consulting",
  description:
    "Get your free AI Visibility Score in 60 seconds. Find out how ChatGPT, Claude, Gemini & Perplexity see your brand — and where you're losing leads to competitors.",
};

export default function AuditPage() {
  return (
    <>
      {/*
        Cloudflare Turnstile — only loads when NEXT_PUBLIC_TURNSTILE_SITE_KEY
        is set. The widget itself is rendered inside AuditForm.tsx.
        When the env var is absent the script tag is not emitted.
      */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
          async
        />
      )}
      <AuditFlow />
    </>
  );
}
