import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/hmg/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How HMG Group Africa collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/hmg/privacy" },
};

export default function Privacy() {
  return (
    <article className="post">
      <header className="post__head wrap">
        <nav aria-label="Breadcrumb" className="post__crumb"><Link href="/hmg">← Back to home</Link></nav>
        <h1 className="post__h">Privacy notice</h1>
        <p className="post__lead">How we handle the information you share with {SITE.name}.</p>
      </header>
      <div className="wrap post__grid post__grid--single">
        <div className="post__body">
          <section>
            <h2>What we collect</h2>
            <p>When you submit the consultation form or contact us directly, we collect your name, email, phone number, company (optional) and the details you choose to share about your enquiry.</p>
          </section>
          <section>
            <h2>How we use it</h2>
            <p>We use this information only to respond to your enquiry, arrange a consultation and, if you become a client, provide our services. We do not sell personal information.</p>
          </section>
          <section>
            <h2>Your rights</h2>
            <p>Under Kenya&apos;s Data Protection Act, 2019 you may ask to access, correct or delete your personal data. Write to <a href={SITE.emailHref}>{SITE.email}</a> and we will respond.</p>
          </section>
          <section>
            <h2>Contact</h2>
            <p>{SITE.name}, {SITE.address.line}. Phone <a href={SITE.phoneHref}>{SITE.phone}</a>.</p>
          </section>
          <p className="fine">This is a summary notice for the website and should be reviewed by HMG&apos;s legal advisers before publication.</p>
        </div>
      </div>
    </article>
  );
}
