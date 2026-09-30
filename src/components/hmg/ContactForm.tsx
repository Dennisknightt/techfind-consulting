"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ENQUIRY_SERVICES, enquirySchema } from "@/lib/hmg/enquiry";
import { SITE, whatsappLink } from "@/lib/hmg/site";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<string, string>>;

export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  const id = (f: string) => `${uid}-${f}`;

  function validate(data: Record<string, unknown>): Errors {
    const r = enquirySchema.safeParse(data);
    if (r.success) return {};
    const out: Errors = {};
    for (const i of r.error.issues) out[String(i.path[0])] ??= i.message;
    return out;
  }

  function read(): Record<string, unknown> {
    const fd = new FormData(formRef.current!);
    return {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      company: fd.get("company") ?? "",
      service: fd.get("service"),
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      website: fd.get("website") ?? "",
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const data = read();
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("idle");
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/hmg/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.fields) setErrors(json.fields);
        throw new Error(json.error ?? "Something went wrong.");
      }
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function blur(e: React.FocusEvent<HTMLFormElement>) {
    const name = (e.target as unknown as HTMLInputElement).name;
    if (!name || name === "website") return;
    const errs = validate(read());
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  }

  if (status === "success") {
    return (
      <div className="form form--done" role="status">
        <span className="form__tick" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <h3 className="form__done-title">Thank you. Your enquiry is with HMG.</h3>
        <p>A consultant will review it and follow up during working hours ({SITE.hours}). If it is urgent, message us on WhatsApp.</p>
        <a className="btn btn--ghost-dark" href={whatsappLink("Hello HMG, I have just sent an enquiry through the website.")} target="_blank" rel="noopener noreferrer">
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  const field = (name: string) => ({
    id: id(name),
    name,
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": `${id(name)}-err`,
  });
  // The error slot is always rendered so validating on blur never shifts the layout
  // (a shifting form can swallow the very click that caused the blur).
  const err = (name: string) => (
    <p className="form__err" id={`${id(name)}-err`}>
      {errors[name]}
    </p>
  );

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} onBlur={blur} noValidate aria-busy={status === "loading"}>
      <h3 className="form__title">Book a consultation</h3>
      <p className="form__lead">Tell us what you need. A consultant will come back to you personally.</p>

      <div className="form__grid">
        <div className="form__f">
          <label htmlFor={id("name")}>Full name</label>
          <input type="text" autoComplete="name" {...field("name")} />
          {err("name")}
        </div>
        <div className="form__f">
          <label htmlFor={id("email")}>Email</label>
          <input type="email" autoComplete="email" inputMode="email" {...field("email")} />
          {err("email")}
        </div>
        <div className="form__f">
          <label htmlFor={id("phone")}>Phone / WhatsApp</label>
          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+254 7XX XXX XXX" {...field("phone")} />
          {err("phone")}
        </div>
        <div className="form__f">
          <label htmlFor={id("company")}>
            Company <span className="form__opt">(optional)</span>
          </label>
          <input type="text" autoComplete="organization" {...field("company")} />
        </div>
        <div className="form__f form__f--wide">
          <label htmlFor={id("service")}>What do you need help with?</label>
          <select defaultValue="" {...field("service")}>
            <option value="" disabled>
              Select a service
            </option>
            {ENQUIRY_SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err("service")}
        </div>
        <div className="form__f form__f--wide">
          <label htmlFor={id("message")}>Your situation</label>
          <textarea rows={4} placeholder="e.g. We are preparing for our first audit and need our books cleaned up." {...field("message")} />
          {err("message")}
        </div>
      </div>

      {/* honeypot: hidden from people and assistive tech */}
      <div className="form__hp" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form__consent">
        <input type="checkbox" {...field("consent")} />
        <label htmlFor={id("consent")}>I agree that HMG may contact me about this enquiry.</label>
      </div>
      {err("consent")}

      {status === "error" && (
        <div className="form__alert" role="alert">
          <strong>We could not send that.</strong> {serverError}{" "}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> or call{" "}
          <a href={SITE.phoneHref}>{SITE.phone}</a>.
        </div>
      )}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === "loading"} data-magnetic>
        {status === "loading" ? (
          <>
            <span className="spinner" aria-hidden="true" /> Sending…
          </>
        ) : (
          "Send enquiry"
        )}
      </button>
      <p className="form__fine">
        We use your details only to respond to this enquiry. See our <Link href="/hmg/privacy">privacy notice</Link>.
      </p>
    </form>
  );
}
