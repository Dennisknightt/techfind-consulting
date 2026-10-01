import type { Metadata } from "next";
import { pageMeta } from "@/lib/hmg/meta";
import { PageHero } from "@/components/hmg/ui";
import { ROUTES, SITE } from "@/lib/hmg/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy notice",
  description: "How HMG Group Africa collects, uses and protects personal information submitted through this website.",
  path: ROUTES.privacy,
});

export default function Privacy() {
  return (
    <article className="post">
      <PageHero eyebrow="Privacy" title="Privacy notice" lead={`How we handle the information you share with ${SITE.name}.`} crumbs={[{ name: "Home", href: ROUTES.home }, { name: "Privacy notice", href: ROUTES.privacy }]} />
      <div className="wrap post__grid post__grid--single">
        <div className="post__body">
          <section>
            <h2>What we collect</h2>
            <p>When you request a callback or contact us directly, we collect your name, phone number, and — if you choose to share them — your email address, company and a short description of your enquiry.</p>
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
          
        </div>
      </div>
    </article>
  );
}
