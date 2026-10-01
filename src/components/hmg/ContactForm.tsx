"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { contactFormSchema, ENQUIRY_SERVICES, enquirySchema } from "@/lib/hmg/enquiry";
import { ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";
import { track } from "./Analytics";
import { WhatsAppIcon } from "./Logo";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<string, string>>;

const FIELD_ORDER = ["name", "phone", "email", "company", "service", "message", "consent"];

export function ContactForm({ variant = "full", defaultService = "" }: { variant?: "full" | "callback"; defaultService?: string }) {
  const full = variant === "full";
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const mounted = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errCode, setErrCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [ok, setOk] = useState<Record<string, boolean>>({});
  const [snapshot, setSnapshot] = useState<Record<string, unknown>>({});
  const id = (f: string) => `${uid}-${f}`;
  const schema = full ? contactFormSchema : enquirySchema;

  useEffect(() => {
    mounted.current = performance.now();
  }, []);

  function read(): Record<string, unknown> {
    const fd = new FormData(formRef.current!);
    return {
      name: fd.get("name") ?? "",
      phone: fd.get("phone") ?? "",
      email: fd.get("email") ?? "",
      company: fd.get("company") ?? "",
      service: fd.get("service") ?? "",
      message: fd.get("message") ?? "",
      consent: fd.get("consent") === "on",
      website: fd.get("website") ?? "",
      elapsed: Math.round(performance.now() - mounted.current),
      source: full ? "contact" : "callback",
    };
  }

  function validate(data: Record<string, unknown>): Errors {
    const r = schema.safeParse(data);
    if (r.success) return {};
    const out: Errors = {};
    for (const i of r.error.issues) out[String(i.path[0])] ??= i.message;
    return out;
  }

  // Errors appear on blur (once a field has content) and clear while typing —
  // never on blur — so the layout cannot shift between a press and its release.
  function onBlur(e: React.FocusEvent<HTMLFormElement>) {
    const name = (e.target as unknown as HTMLInputElement).name;
    if (!name || name === "website") return;
    const data = read();
    const msg = validate(data)[name];
    if (msg && data[name] !== "") setErrors((p) => ({ ...p, [name]: msg }));
    setOk((o) => ({ ...o, [name]: !msg && !!data[name] }));
  }

  function onInput(e: React.FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name;
    if (!name || !errors[name]) return;
    if (!validate(read())[name]) {
      setErrors((p) => ({ ...p, [name]: undefined }));
      setOk((o) => ({ ...o, [name]: true }));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const data = read();
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = FIELD_ORDER.find((f) => errs[f]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      const f = formRef.current;
      if (f && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        f.classList.remove("form--shake");
        void f.offsetWidth;
        f.classList.add("form--shake");
      }
      return;
    }
    setSnapshot(data);
    setStatus("loading");
    setErrCode("");
    try {
      const res = await fetch("/api/hmg/enquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.fields) setErrors(json.fields);
        setErrCode(json.code ?? "unknown");
        setStatus("error");
        return;
      }
      track("form_submit_success");
      setStatus("success");
    } catch {
      setErrCode("network");
      setStatus("error");
    }
  }

  // WhatsApp fallback: mentions the service only — personal details never go into a URL.
  const waFromForm = () => {
    const svc = typeof snapshot.service === "string" && snapshot.service ? ` about ${snapshot.service}` : "";
    return whatsappLink(`Hello HMG, I'd like a callback${svc}.`);
  };

  if (status === "success") {
    return (
      <div className="form form--done" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <span className="form__tick" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <h3 className="form__done-title">Thank you — your request is with HMG.</h3>
        <p>A consultant will call you back during working hours ({SITE.hours}). If it is urgent, message us on WhatsApp.</p>
        <a className="btn btn--ghost" href={waFromForm()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Continue on WhatsApp</a>
      </div>
    );
  }

  const field = (name: string) => ({
    id: id(name),
    name,
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": `${id(name)}-err`,
  });
  // Always rendered (empty when valid) so validation never shifts the layout.
  const err = (name: string) => (
    <p className="form__err" id={`${id(name)}-err`} aria-live="polite">{errors[name]}</p>
  );
  const fcls = (name: string, extra = "") => `form__f${extra}${ok[name] ? " form__f--ok" : ""}`;

  return (
    <form ref={formRef} className={`form${full ? "" : " form--compact"}`} onSubmit={onSubmit} onBlur={onBlur} onInput={onInput} onChange={onInput} noValidate aria-busy={status === "loading"} aria-labelledby={`${uid}-title`}>
      <h3 className="form__title" id={`${uid}-title`}>{full ? "Request a callback" : "Prefer a call back?"}</h3>
      <p className="form__lead">{full ? "Share a few details. A consultant will call you to understand your needs." : "Leave your number and we will call you during working hours."}</p>

      <div className="form__grid">
        <div className={fcls("name")}>
          <label htmlFor={id("name")}>Full name</label>
          <input type="text" autoComplete="name" {...field("name")} />
          {err("name")}
        </div>
        <div className={fcls("phone")}>
          <label htmlFor={id("phone")}>Phone or WhatsApp</label>
          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="0712 345 678 or +254…" {...field("phone")} />
          {err("phone")}
        </div>
        {full && (
          <>
            <div className={fcls("email")}>
              <label htmlFor={id("email")}>Email <span className="form__opt">(optional)</span></label>
              <input type="email" autoComplete="email" inputMode="email" {...field("email")} />
              {err("email")}
            </div>
            <div className={fcls("company")}>
              <label htmlFor={id("company")}>Company <span className="form__opt">(optional)</span></label>
              <input type="text" autoComplete="organization" {...field("company")} />
              {err("company")}
            </div>
          </>
        )}
        <div className={fcls("service", " form__f--wide")}>
          <label htmlFor={id("service")}>Service required</label>
          <select defaultValue={defaultService} {...field("service")}>
            <option value="" disabled>Select a service</option>
            {ENQUIRY_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {err("service")}
        </div>
        {full && (
          <div className={fcls("message", " form__f--wide")}>
            <label htmlFor={id("message")}>Short description</label>
            <textarea rows={3} placeholder="e.g. We received a KRA notice about last year's VAT." {...field("message")} />
            {err("message")}
          </div>
        )}
      </div>

      <div className="form__hp" aria-hidden="true">
        <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="form__consent">
        <input type="checkbox" {...field("consent")} />
        <label htmlFor={id("consent")}>I agree that HMG may contact me about this request. See the <Link href={ROUTES.privacy}>privacy notice</Link>.</label>
      </div>
      {err("consent")}

      {status === "error" && (
        <div className="form__alert" role="alert">
          {errCode === "not_configured" ? (
            <>
              <strong>Your request could not be sent online right now.</strong> Nothing was submitted, and your answers are still in the form. Please reach us directly:
            </>
          ) : errCode === "invalid" ? (
            <><strong>Please check the highlighted fields.</strong></>
          ) : errCode === "rate_limited" ? (
            <><strong>Too many attempts.</strong> Please wait a few minutes, or contact us directly:</>
          ) : (
            <><strong>We could not send your request.</strong> Please try again, or contact us directly:</>
          )}
          {errCode !== "invalid" && (
            <div className="form__alt">
              <a className="btn btn--sm btn--wa" href={waFromForm()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16} /> Message HMG on WhatsApp</a>
              <a className="btn btn--sm btn--ghost" href={SITE.phoneHref}>Call {SITE.phone}</a>
            </div>
          )}
        </div>
      )}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === "loading"}>
        {status === "loading" ? (<><span className="spinner" aria-hidden="true" /> Sending…</>) : "Request a Callback"}
      </button>
    </form>
  );
}
