"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Building2, Mail, Phone, BarChart3, MapPin, Sparkles, ShieldCheck, Zap } from "lucide-react";
import type { AuditData } from "./AuditFlow";

const industries = [
  "HVAC & Heating", "Roofing", "Plumbing", "Electrical", "Solar Energy",
  "Landscaping", "Construction", "Home Services", "Law Firm", "Medical Clinic",
  "Dental Practice", "Accounting", "Financial Advisory", "IT Services",
  "Marketing Agency", "Real Estate", "Restaurant / Food", "E-commerce", "Other",
];

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "South Africa",
  "Kenya", "Nigeria", "Germany", "France", "Netherlands", "UAE", "Singapore",
  "India", "Brazil", "Mexico", "Other",
];

const trustItems = [
  { icon: ShieldCheck, label: "100% Free — No credit card" },
  { icon: Zap,         label: "Results in under 60 seconds" },
  { icon: BarChart3,   label: "Trusted by 500+ businesses" },
];

interface Props { onSubmit: (data: AuditData) => void; }

export function AuditForm({ onSubmit }: Props) {
  const [form, setForm] = useState<AuditData>({
    websiteUrl: "", companyName: "", email: "",
    industry: "", country: "", phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AuditData, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.websiteUrl.trim()) e.websiteUrl = "Required";
    else if (!/^https?:\/\//.test(form.websiteUrl) && !form.websiteUrl.includes("."))
      e.websiteUrl = "Enter a valid URL (e.g. yoursite.com)";
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.industry) e.industry = "Required";
    if (!form.country) e.country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    let url = form.websiteUrl.trim();
    if (!url.startsWith("http")) url = "https://" + url;
    onSubmit({ ...form, websiteUrl: url });
  }

  function field(key: keyof AuditData, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="orb orb-accent animate-orb absolute -top-32 -left-32 w-[500px] h-[500px] opacity-25" />
      <div className="orb orb-blue animate-orb-2 absolute -bottom-20 -right-20 w-96 h-96 opacity-20" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border text-xs font-semibold"
            style={{ background: "var(--accent-glow)", borderColor: "var(--border-accent)", color: "var(--accent)" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Free · No credit card · 60-second results
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Get Your Free
            <br />
            <span className="gradient-text">AI Visibility Score</span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-lg mx-auto leading-relaxed">
            Find out if ChatGPT, Claude, Gemini & Perplexity recommend your business — or your competitors.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="surface rounded-3xl p-8 md:p-10 shadow-[var(--shadow-lg)]"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* URL */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">
                Website URL *
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="https://yourwebsite.com"
                  value={form.websiteUrl}
                  onChange={e => field("websiteUrl", e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all outline-none"
                  style={{
                    background: "var(--card-hover)",
                    border: `1px solid ${errors.websiteUrl ? "#ef4444" : "var(--border)"}`,
                    color: "var(--text)",
                  }}
                />
              </div>
              {errors.websiteUrl && <p className="text-xs text-red-400 mt-1">{errors.websiteUrl}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={form.companyName}
                  onChange={e => field("companyName", e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all outline-none"
                  style={{
                    background: "var(--card-hover)",
                    border: `1px solid ${errors.companyName ? "#ef4444" : "var(--border)"}`,
                    color: "var(--text)",
                  }}
                />
              </div>
              {errors.companyName && <p className="text-xs text-red-400 mt-1">{errors.companyName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => field("email", e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all outline-none"
                  style={{
                    background: "var(--card-hover)",
                    border: `1px solid ${errors.email ? "#ef4444" : "var(--border)"}`,
                    color: "var(--text)",
                  }}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Industry + Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">
                  Industry *
                </label>
                <div className="relative">
                  <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                  <select
                    value={form.industry}
                    onChange={e => field("industry", e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm appearance-none transition-all outline-none"
                    style={{
                      background: "var(--card-hover)",
                      border: `1px solid ${errors.industry ? "#ef4444" : "var(--border)"}`,
                      color: form.industry ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    <option value="">Select industry</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                {errors.industry && <p className="text-xs text-red-400 mt-1">{errors.industry}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">
                  Country *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                  <select
                    value={form.country}
                    onChange={e => field("country", e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm appearance-none transition-all outline-none"
                    style={{
                      background: "var(--card-hover)",
                      border: `1px solid ${errors.country ? "#ef4444" : "var(--border)"}`,
                      color: form.country ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    <option value="">Select country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {errors.country && <p className="text-xs text-red-400 mt-1">{errors.country}</p>}
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">
                Phone <span className="normal-case font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={form.phone}
                  onChange={e => field("phone", e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all outline-none"
                  style={{
                    background: "var(--card-hover)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-4 text-base mt-2">
              Run My Free AI Audit
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <Icon className="w-3.5 h-3.5 text-emerald-500" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
