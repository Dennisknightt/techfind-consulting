"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlarmClock, BookOpen, Building, Building2, Calendar, CalendarClock, CalendarDays, CalendarRange, ClipboardCheck, Compass, FileWarning,
  HandHeart, Landmark, Mail, MessageSquare, Phone, Repeat, Rocket, Search, ShieldCheck, Store, TrendingUp, User, Users, Wallet, type LucideIcon,
} from "lucide-react";
import { CHANNELS, isValidPhone, labelOf, NEEDS, PROFILES, SITUATION_OPTS, URGENCY } from "@/lib/hmg/enquiry";
import { ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";
import Link from "next/link";
import { track } from "./Analytics";
import { WhatsAppIcon } from "./Logo";

type Answers = {
  needs: string[]; profile: string; situation: string[]; other: string; urgency: string; channels: string[];
  name: string; phone: string; email: string; company: string; consent: boolean;
};
const EMPTY: Answers = { needs: [], profile: "", situation: [], other: "", urgency: "", channels: [], name: "", phone: "", email: "", company: "", consent: false };

const STEPS = [
  { key: "needs", title: "What do you need help with?", hint: "Select all that apply — you can choose more than one." },
  { key: "profile", title: "What best describes you?", hint: "Choose one." },
  { key: "situation", title: "What is happening now?", hint: "Select all that apply — you can choose more than one." },
  { key: "urgency", title: "How urgent is it?", hint: "Choose one." },
  { key: "channels", title: "How should HMG reach you?", hint: "Select all that apply — you can choose more than one." },
  { key: "details", title: "Your contact details", hint: "We use these only to respond to this request." },
] as const;
const TOTAL = STEPS.length;

/** One icon per option, per step. */
const ICONS: Record<string, Record<string, LucideIcon | "whatsapp">> = {
  needs: { tax: Landmark, accounting: BookOpen, audit: ClipboardCheck, advisory: TrendingUp, payroll: Users, health: ShieldCheck, urgent: FileWarning, unsure: Compass },
  profile: { individual: User, startup: Rocket, sme: Store, corporation: Building2, ngo: HandHeart, other: Building },
  situation: { kra: CalendarClock, books: BookOpen, compliance: ShieldCheck, audit: ClipboardCheck, cash: Wallet, payroll: Users, growth: TrendingUp, ongoing: Repeat, other: MessageSquare },
  urgency: { "48h": AlarmClock, week: CalendarDays, "2weeks": CalendarRange, month: Calendar, exploring: Search },
  channels: { phone: Phone, whatsapp: "whatsapp", email: Mail },
};

type Errs = Partial<Record<keyof Answers, string>>;

function validateStep(i: number, a: Answers): Errs {
  const e: Errs = {};
  if (i === 0 && !a.needs.length) e.needs = "Choose at least one option.";
  if (i === 1 && !a.profile) e.profile = "Choose the option that fits best.";
  if (i === 2) {
    if (!a.situation.length) e.situation = "Choose at least one option.";
    if (a.situation.includes("other") && a.other.trim().length < 3) e.other = "Tell us briefly what is happening.";
  }
  if (i === 3 && !a.urgency) e.urgency = "Choose how urgent this is.";
  if (i === 4 && !a.channels.length) e.channels = "Choose at least one way to reach you.";
  if (i === 5) {
    if (a.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!isValidPhone(a.phone)) e.phone = "Enter a valid phone number.";
    if (a.channels.includes("email") && !a.email.trim()) e.email = "Add an email address so we can reply by email.";
    else if (a.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) e.email = "Enter a valid email address.";
    if (!a.consent) e.consent = "Please confirm we may contact you.";
  }
  return e;
}

export function EnquiryFlow() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0); // 0..5 questions/details, 6 = review
  const [a, setA] = useState<Answers>(EMPTY);
  const [errs, setErrs] = useState<Errs>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errCode, setErrCode] = useState("");
  const [ref, setRef] = useState("");
  const [announce, setAnnounce] = useState("");
  const headRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);
  const skipFocus = useRef(true);

  // Preselect a service from ?need=<service-slug> (from service pages and the selector).
  useEffect(() => {
    const need = new URLSearchParams(window.location.search).get("need");
    const match = NEEDS.find((n) => n.service === need && n.id !== "urgent");
    if (match) setA((x) => ({ ...x, needs: [match.id] }));
  }, []);

  useEffect(() => {
    if (!started) return;
    if (skipFocus.current) { skipFocus.current = false; }
    headRef.current?.focus();
    setAnnounce(step < TOTAL ? `Step ${step + 1} of ${TOTAL}: ${STEPS[step].title}` : "Review your answers");
  }, [step, started]);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => {
    setA((x) => ({ ...x, [k]: v }));
    if (errs[k]) setErrs((e) => ({ ...e, [k]: undefined }));
  };
  const toggle = (k: "needs" | "situation" | "channels", id: string) => {
    const cur = a[k];
    let next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    if (k === "needs") next = id === "unsure" && !cur.includes(id) ? ["unsure"] : next.filter((x) => id === "unsure" || x !== "unsure");
    set(k, next);
  };

  function next() {
    const e = validateStep(step, a);
    setErrs(e);
    if (Object.keys(e).length) {
      setAnnounce(Object.values(e)[0] as string);
      return;
    }
    setStep((s) => s + 1);
  }
  const back = () => { setErrs({}); setStep((s) => Math.max(0, s - 1)); };

  async function submit() {
    if (status === "loading") return;
    setStatus("loading");
    setErrCode("");
    try {
      const res = await fetch("/api/hmg/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...a, website: (document.getElementById("hmg-hp") as HTMLInputElement | null)?.value ?? "", elapsed: Math.round(performance.now() - startedAt.current) }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setErrCode(json.code ?? "unknown");
        if (json.fields) setErrs(json.fields);
        setStatus("error");
        setAnnounce("Your request could not be sent. Your answers are kept.");
        return;
      }
      setRef(json.reference ?? "");
      track("form_submit_success");
      setStatus("success");
    } catch {
      setErrCode("network");
      setStatus("error");
      setAnnounce("Your request could not be sent. Your answers are kept.");
    }
  }

  const primaryNeed = NEEDS.find((n) => a.needs.includes(n.id) && n.id !== "unsure") ?? NEEDS.find((n) => a.needs.includes(n.id));

  /* ── Opening ── */
  if (!started) {
    return (
      <div className="qf qf--intro">
        <h2 className="qf__title">Let’s find the right person to help.</h2>
        <p className="qf__lead">Answer a few quick questions and an HMG consultant will contact you with a clear understanding of what you need.</p>
        <button type="button" className="btn btn--primary" onClick={() => { startedAt.current = performance.now(); setStarted(true); }}>
          Start — takes under one minute
        </button>
        <p className="qf__alt">Prefer to talk now? <a href={SITE.phoneHref}>Call {SITE.phone}</a> or <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp HMG</a>.</p>
      </div>
    );
  }

  /* ── Success (only after server confirmation) ── */
  if (status === "success") {
    return (
      <div className="qf qf--done" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <span className="form__tick" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        <h2 className="qf__title">Thank you, {a.name.split(" ")[0]}. Your request is with HMG.</h2>
        <dl className="qf__sum">
          <div><dt>Reference</dt><dd className="qf__ref">{ref}</dd></div>
          <div><dt>Service</dt><dd>{a.needs.map((n) => labelOf(NEEDS, n)).join(", ")}</dd></div>
          <div><dt>We will contact you by</dt><dd>{a.channels.map((c) => labelOf(CHANNELS, c)).join(", ")}</dd></div>
          <div><dt>Working hours</dt><dd>{SITE.hours}</dd></div>
        </dl>
        <a className="btn btn--ghost" href={whatsappLink(`Hello HMG, I have just sent a consultation request (ref ${ref}).`)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Continue on WhatsApp</a>
      </div>
    );
  }

  const progress = Math.min(step, TOTAL) / TOTAL;
  const err = (k: keyof Answers) => <p className="form__err" id={`qf-${k}-err`} aria-live="polite">{errs[k]}</p>;

  return (
    <div className="qf">
      <p className="sr-only" aria-live="polite">{announce}</p>
      <div className="qf__progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress || 0.04})` }} /></div>
      <p className="qf__count">{step < TOTAL ? `Step ${step + 1} of ${TOTAL}` : "Review"}</p>

      <div className="qf__step" key={step}>
        {step < 5 && (() => {
          const s = STEPS[step];
          const multi = s.key !== "profile" && s.key !== "urgency";
          const list = s.key === "needs" ? NEEDS : s.key === "profile" ? PROFILES : s.key === "situation" ? SITUATION_OPTS : s.key === "urgency" ? URGENCY : CHANNELS;
          const key = s.key as "needs" | "profile" | "situation" | "urgency" | "channels";
          return (
            <fieldset className="qf__fs" aria-describedby={`qf-${key}-hint qf-${key}-err`}>
              <legend><h2 className="qf__q" ref={headRef} tabIndex={-1}>{s.title}</h2></legend>
              <p className="qf__hint" id={`qf-${key}-hint`}>{s.hint}</p>
              <div className={`qf__tiles${list.length <= 3 ? " qf__tiles--3" : ""}`}>
                {list.map((o) => {
                  const on = multi ? (a[key] as string[]).includes(o.id) : a[key] === o.id;
                  const Icon = ICONS[key][o.id];
                  return (
                    <label key={o.id} className={`qf__tile${on ? " is-on" : ""}${multi ? "" : " qf__tile--single"}`}>
                      <input
                        type={multi ? "checkbox" : "radio"}
                        name={`qf-${key}`}
                        value={o.id}
                        checked={on}
                        onChange={() => (multi ? toggle(key as "needs" | "situation" | "channels", o.id) : set(key as "profile" | "urgency", o.id))}
                      />
                      <span className="sit__icon" aria-hidden="true">
                        {Icon === "whatsapp" ? <WhatsAppIcon size={22} /> : Icon ? <Icon size={22} strokeWidth={1.8} /> : null}
                      </span>
                      <span className="qf__tlabel">{o.label}</span>
                      <span className="sit__check" aria-hidden="true">
                        {multi ? <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg> : <i className="qf__dot" />}
                      </span>
                    </label>
                  );
                })}
              </div>
              {err(key)}
              {key === "situation" && a.situation.includes("other") && (
                <div className="form__f qf__other">
                  <label htmlFor="qf-other">Briefly, what is happening?</label>
                  <textarea id="qf-other" rows={3} value={a.other} onChange={(e) => set("other", e.target.value)} aria-invalid={errs.other ? true : undefined} aria-describedby="qf-other-err" />
                  {err("other")}
                </div>
              )}
            </fieldset>
          );
        })()}

        {step === 5 && (
          <div className="qf__fs">
            <h2 className="qf__q" ref={headRef} tabIndex={-1}>{STEPS[5].title}</h2>
            <p className="qf__hint">{STEPS[5].hint}</p>
            <div className="form form--plain">
              <div className="form__f">
                <label htmlFor="qf-name">Full name</label>
                <input id="qf-name" type="text" autoComplete="name" value={a.name} onChange={(e) => set("name", e.target.value)} aria-invalid={errs.name ? true : undefined} aria-describedby="qf-name-err" />
                {err("name")}
              </div>
              <div className="form__f">
                <label htmlFor="qf-phone">Phone or WhatsApp</label>
                <input id="qf-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678 or +254…" value={a.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={errs.phone ? true : undefined} aria-describedby="qf-phone-err" />
                {err("phone")}
              </div>
              <div className="form__f">
                <label htmlFor="qf-email">Email {a.channels.includes("email") ? "" : <span className="form__opt">(optional)</span>}</label>
                <input id="qf-email" type="email" inputMode="email" autoComplete="email" value={a.email} onChange={(e) => set("email", e.target.value)} aria-invalid={errs.email ? true : undefined} aria-describedby="qf-email-err" />
                {err("email")}
              </div>
              <div className="form__f">
                <label htmlFor="qf-company">Company <span className="form__opt">(optional)</span></label>
                <input id="qf-company" type="text" autoComplete="organization" value={a.company} onChange={(e) => set("company", e.target.value)} />
                <p className="form__err" />
              </div>
              <div className="form__hp" aria-hidden="true"><label>Website <input id="hmg-hp" type="text" tabIndex={-1} autoComplete="off" /></label></div>
              <div className="form__consent">
                <input id="qf-consent" type="checkbox" checked={a.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={errs.consent ? true : undefined} aria-describedby="qf-consent-err" />
                <label htmlFor="qf-consent">I agree that HMG may contact me about this request. See the <Link href={ROUTES.privacy}>privacy notice</Link>.</label>
              </div>
              {err("consent")}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="qf__fs">
            <h2 className="qf__q" ref={headRef} tabIndex={-1}>Review your request</h2>
            <dl className="qf__review">
              {[
                ["Help with", a.needs.map((n) => labelOf(NEEDS, n)).join(", "), 0],
                ["You are", labelOf(PROFILES, a.profile), 1],
                ["What is happening", a.situation.map((s) => labelOf(SITUATION_OPTS, s)).join(", ") + (a.other ? ` — “${a.other}”` : ""), 2],
                ["Urgency", labelOf(URGENCY, a.urgency), 3],
                ["Contact by", a.channels.map((c) => labelOf(CHANNELS, c)).join(", "), 4],
                ["Your details", [a.name, a.phone, a.email, a.company].filter(Boolean).join(" · "), 5],
              ].map(([k, v, i]) => (
                <div key={k as string}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                  <button type="button" className="qf__edit" onClick={() => setStep(i as number)} aria-label={`Edit: ${k}`}>Edit</button>
                </div>
              ))}
            </dl>
            {status === "error" && (
              <div className="form__alert" role="alert">
                <strong>{errCode === "not_configured" ? "Online requests are not connected yet." : errCode === "rate_limited" ? "Too many attempts — please wait a few minutes." : "We could not send your request."}</strong>{" "}
                Nothing was submitted and your answers are kept. You can try again, or reach us directly:
                <div className="form__alt">
                  <a className="btn btn--sm btn--wa" href={whatsappLink(primaryNeed ? `Hello HMG, I'd like help with ${primaryNeed.label.toLowerCase()}.` : undefined)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16} /> WhatsApp HMG</a>
                  <a className="btn btn--sm btn--ghost" href={SITE.phoneHref}>Call {SITE.phone}</a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="qf__nav">
        {step > 0 && <button type="button" className="btn btn--ghost" onClick={back}>Back</button>}
        {step < 6 ? (
          <button type="button" className="btn btn--primary" onClick={next}>{step === 5 ? "Review" : "Continue"}</button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={submit} disabled={status === "loading"}>
            {status === "loading" ? (<><span className="spinner" aria-hidden="true" /> Sending…</>) : "Request My Consultation"}
          </button>
        )}
      </div>
    </div>
  );
}
