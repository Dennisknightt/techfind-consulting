import { MotionToggle } from "./MotionToggle";
import Link from "next/link";
import { SERVICES } from "@/lib/hmg/content";
import { ROUTES, SITE } from "@/lib/hmg/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="ftr" id="site-footer">
      <div className="wrap ftr__grid">
        <div className="ftr__brand">
          <Link href={ROUTES.home}>
            <Logo light />
          </Link>
          <p className="ftr__pos">{SITE.positioning}</p>
        </div>
        <nav aria-label="Services">
          <h2 className="ftr__h">Services</h2>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={ROUTES.service(s.slug)}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className="ftr__h">Company</h2>
          <ul>
            <li><Link href={ROUTES.about}>About HMG</Link></li>
            <li><Link href={ROUTES.services}>All services</Link></li>
            <li><Link href={ROUTES.insights}>Insights</Link></li>
            <li><Link href={ROUTES.contact}>Contact</Link></li>
            <li><Link href={ROUTES.privacy}>Privacy notice</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="ftr__h">Contact</h2>
          <ul>
            <li><a href={SITE.phoneHref}>{SITE.phone}</a></li>
            <li><a href={SITE.emailHref}>{SITE.email}</a></li>
            <li><a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer">{SITE.address.line}</a></li>
            <li>{SITE.hours}</li>
          </ul>
          <ul className="ftr__social">
            <li><a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            {SITE.social.facebook && (
              <li><a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="wrap ftr__base">
        <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
        <p>Content on this site is general guidance, not individual tax, legal or accounting advice.</p>
        <MotionToggle className="mtoggle--dark" />
      </div>
    </footer>
  );
}
