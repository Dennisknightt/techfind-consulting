import Link from "next/link";
import { JOURNEY, PROCESS, TRUST } from "@/lib/hmg/content";
import { CONSULT_HREF, SITE, whatsappLink } from "@/lib/hmg/site";
import { ContactForm } from "./ContactForm";
import { Eyebrow, Lines } from "./Lines";
import { HeroArt } from "./HeroArt";
import { WhatsAppIcon } from "./Logo";
import { WhyArt } from "./WhyArt";

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

export function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-h">
      <div className="hero__rules" aria-hidden="true" />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__in" style={d(0.05)}>
            Tax · Accounting · Audit · Advisory — Nairobi
          </p>
          <h1 id="hero-h" className="hero__h">
            <span className="hero__mask"><span className="hero__line" style={d(0.2)}>Financial clarity.</span></span>{" "}
            <span className="hero__mask"><span className="hero__line hero__line--em" style={d(0.38)}>Confident growth.</span></span>
          </h1>
          <p className="hero__p hero__in" style={d(0.7)}>
            Tax, accounting, audit and advisory expertise for businesses building their next chapter across Africa.
          </p>
          <div className="hero__cta hero__in" style={d(0.85)}>
            <Link href={CONSULT_HREF} className="btn btn--primary" data-magnetic>Book a Consultation</Link>
            <Link href="/hmg#services" className="btn btn--ghost">Explore Our Services</Link>
          </div>
          <a className="hero__wa hero__in" style={d(1)} href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> <span>Prefer a quick message? <strong>Enquire on WhatsApp</strong></span>
          </a>
        </div>
        <div className="hero__art">
          <HeroArt />
        </div>
      </div>
      <p className="wrap hero__note hero__in" style={d(2.3)}>Illustration — figures shown are fictional.</p>
    </section>
  );
}

export function Trust() {
  return (
    <section className="trust" aria-label="Why businesses trust HMG">
      <ul className="wrap trust__grid">
        {TRUST.map((t, i) => (
          <li key={t.id} className="trust__item" data-reveal style={{ ["--i" as string]: i }}>
            <p className="trust__fig" aria-label={t.figure ? `${t.figure}${t.suffix}` : "KRA"}>
              {t.figure ? (
                <>
                  <span data-count={t.figure} data-from={t.from} style={{ minWidth: `${(String(t.figure).length * 0.53).toFixed(2)}em` }}>{t.figure}</span>
                  {t.suffix}
                </>
              ) : (
                <span>KRA</span>
              )}
            </p>
            <h3 className="trust__label">{t.label}</h3>
            <p className="trust__note">{t.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Approach() {
  return (
    <section className="sec sec--navy approach" id="approach" aria-labelledby="approach-h">
      <div className="wrap">
        <div className="sec__head">
          <Eyebrow>The HMG approach</Eyebrow>
          <Lines id="approach-h" lines={["From scattered numbers", "to confident decisions."]} />
        </div>
        <ol className="steps" data-scroll-path>
          <li className="steps__track" aria-hidden="true" />
          {PROCESS.map((p) => (
            <li key={p.n} className="step" data-step>
              <span className="step__node"><span>{p.n}</span></span>
              <h3 className="step__title">{p.title}</h3>
              <p className="step__body">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Why() {
  const items = [
    ["What is happening", "A live, honest picture of income, costs, cash and obligations."],
    ["What needs attention", "The few items that matter this month, ranked and explained."],
    ["What decision to make next", "A clear recommendation, an owner and a date."],
  ];
  return (
    <section className="sec sec--warm why" id="about" aria-labelledby="why-h">
      <div className="wrap why__grid">
        <div className="why__art" data-reveal>
          <WhyArt />
          <p className="why__cap">Founders and advisors, around one clear set of numbers.</p>
        </div>
        <div className="why__copy">
          <Eyebrow>Why HMG</Eyebrow>
          <Lines id="why-h" lines={["Finance should move", "your business forward."]} />
          <p className="sec__lead" data-reveal>
            HMG offers more than reports. Founded in Nairobi in {SITE.founded}, we are a personal partner that gives you a clear picture of where you stand — and the confidence to act on it.
          </p>
          <ol className="why__list">
            {items.map(([t, b], i) => (
              <li key={t} data-reveal style={{ ["--i" as string]: i }}>
                <span className="why__n">{i + 1}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="why__quote" data-reveal>
            Local knowledge of KRA and Kenyan regulation, with a wider view of how businesses grow across Africa.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Journey() {
  return (
    <section className="sec sec--cream" id="journey" aria-labelledby="journey-h">
      <div className="wrap">
        <div className="sec__head">
          <Eyebrow>Getting started</Eyebrow>
          <Lines id="journey-h" lines={["From first message", "to a clear conversation."]} />
        </div>
        <ol className="flow" data-reveal data-loop>
          <li className="flow__rail" aria-hidden="true"><i /></li>
          {JOURNEY.map((j, i) => (
            <li key={j.title} className="flow__step" style={{ ["--i" as string]: i }}>
              <span className="flow__dot" aria-hidden="true">{i + 1}</span>
              <h3>{j.title}</h3>
              <p>{j.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="sec sec--navy cta" id="contact" aria-labelledby="cta-h">
      <div className="wrap cta__grid">
        <div className="cta__copy">
          <Eyebrow>Contact HMG</Eyebrow>
          <Lines id="cta-h" lines={["Your next smart move", "starts with clarity."]} />
          <div className="cta__actions" data-reveal>
            <Link href={CONSULT_HREF} className="btn btn--primary" data-magnetic>Book a Consultation</Link>
            <a href={whatsappLink()} className="btn btn--ghost-light" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Chat on WhatsApp</a>
            <a href={SITE.phoneHref} className="btn btn--ghost-light">Call HMG</a>
            <a href={SITE.emailHref} className="btn btn--ghost-light">Email HMG</a>
          </div>
          <dl className="cta__details" data-reveal>
            <div><dt>Phone</dt><dd><a href={SITE.phoneHref}>{SITE.phone}</a></dd></div>
            <div><dt>Email</dt><dd><a href={SITE.emailHref}>{SITE.email}</a></dd></div>
            <div><dt>Office</dt><dd>{SITE.address.line}</dd></div>
            <div><dt>Hours</dt><dd>{SITE.hours}</dd></div>
          </dl>
        </div>
        <div className="cta__form" id="consultation" data-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
