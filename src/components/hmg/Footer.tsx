import Link from "next/link";
import { SERVICES } from "@/lib/hmg/content";
import { SITE } from "@/lib/hmg/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr__grid">
        <div className="ftr__brand">
          <Link href="/hmg" aria-label="HMG Group Africa — home"><Logo light /></Link>
          <p className="ftr__pos">A personal financial partner for African businesses — bringing clarity to the numbers so you can decide with confidence.</p>
        </div>
        <nav aria-label="Core services">
          <h2 className="ftr__h">Core services</h2>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.id}><Link href="/hmg#services">{s.title}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="ftr__h">Contact</h2>
          <ul>
            <li><a href={SITE.phoneHref}>{SITE.phone}</a></li>
            <li><a href={SITE.emailHref}>{SITE.email}</a></li>
            <li>{SITE.address.line}</li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
        <div>
          <h2 className="ftr__h">Follow</h2>
          <ul>
            <li><a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><Link href="/hmg/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap ftr__base">
        <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
        <p>Articles are general guidance, not individual tax or legal advice.</p>
      </div>
    </footer>
  );
}
