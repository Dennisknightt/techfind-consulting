"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-react";

const services = [
  "AI Engine Optimization (AEO)",
  "AI Visibility Audit",
  "AI Business Automation",
  "TechFind Talent Division",
  "Strategy Consultation",
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });

  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="orb orb-accent animate-orb absolute -top-10 left-1/4 w-80 h-80 opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-6">
              <span className="section-label"><Mail className="w-3.5 h-3.5" />Let&apos;s Talk</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-[var(--text)]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Start Your AI
              <br />
              <span className="gradient-text">Visibility Journey</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[var(--muted)] max-w-lg mx-auto"
            >
              Book an AI Visibility Audit, explore our services, or just say hello.
              Our team responds within 24 hours.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              {submitted ? (
                <div
                  className="surface rounded-3xl p-12 text-center"
                  style={{ borderColor: "rgba(16,185,129,0.25)" }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--text)] mb-3" style={{ fontFamily: "var(--font-space)" }}>
                    Message Received!
                  </h3>
                  <p className="text-[var(--muted)] mb-6">
                    Thanks for reaching out. Our team will be in touch within 24 hours to discuss your AI visibility goals.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="surface rounded-3xl p-8 space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { key: "name",    label: "Full Name",      placeholder: "John Mwangi",         type: "text",  span: false },
                      { key: "email",   label: "Email Address",  placeholder: "john@company.co.ke", type: "email", span: false },
                      { key: "company", label: "Company Name",   placeholder: "Your Company Ltd",    type: "text",  span: true },
                    ].map(({ key, label, placeholder, type, span }) => (
                      <div key={key} className={span ? "md:col-span-2" : ""}>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
                          {label}
                        </label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          required
                          className="w-full rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none transition-all"
                          style={{ background: "var(--card-hover)", border: "1px solid var(--border)" }}
                          onFocus={e => (e.currentTarget.style.borderColor = "var(--border-accent)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
                      Service Interested In
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none transition-all appearance-none"
                      style={{ background: "var(--card-hover)", border: "1px solid var(--border)" }}
                    >
                      <option value="">Select a service…</option>
                      {services.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell us about your business and your AI visibility goals…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none transition-all resize-none"
                      style={{ background: "var(--card-hover)", border: "1px solid var(--border)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--border-accent)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center group inline-flex">
                    <Send className="w-4 h-4" />
                    Send Message
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {[
                { icon: Mail,    label: "Email",    value: "hello@techfind.co.ke" },
                { icon: Phone,   label: "Phone",    value: "+254 700 000 000" },
                { icon: MapPin,  label: "Location", value: "Nairobi, Kenya · Global" },
              ].map(({ icon: Icon, label, value }, i) => (
                <div key={i} className="surface rounded-2xl p-5 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
                  >
                    <Icon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] opacity-60">{label}</p>
                    <p className="text-[var(--text)] text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}

              <div
                className="surface rounded-2xl p-6"
                style={{ borderColor: "var(--border-accent)", background: "var(--accent-glow)" }}
              >
                <h4 className="font-bold text-[var(--text)] mb-4" style={{ fontFamily: "var(--font-space)" }}>
                  What happens next?
                </h4>
                <div className="space-y-3">
                  {[
                    "We review your submission within 24 hours",
                    "You'll receive a scheduling link for a discovery call",
                    "We run your AI Visibility Audit",
                    "You get a full strategy presentation",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                      <span
                        className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[var(--accent)]"
                        style={{ background: "var(--card)", border: "1px solid var(--border-accent)" }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
