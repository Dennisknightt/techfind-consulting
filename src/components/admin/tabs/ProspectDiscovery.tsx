"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Globe, Star, RefreshCw, ArrowRight, MapPin, Building2 } from "lucide-react";

const industries = [
  "HVAC", "Roofing", "Plumbing", "Electrical", "Solar", "Landscaping",
  "Restoration", "Construction", "Home Services", "Law Firm", "Clinic",
  "Dental", "Accounting", "Financial Advisory", "IT Services", "Marketing Agency",
];

const mockProspects = [
  { company: "Arctic Cool HVAC", industry: "HVAC", city: "Dallas, TX", size: "11-50", website: "arcticcool.com", score: null },
  { company: "TopLine Roofing",  industry: "Roofing", city: "Phoenix, AZ", size: "1-10", website: "toplineroofing.com", score: null },
  { company: "ClearPath Law",    industry: "Law Firm", city: "Chicago, IL", size: "11-50", website: "clearpathlaw.com", score: null },
  { company: "BrightSmile Dental", industry: "Dental", city: "Austin, TX", size: "1-10", website: "brightsmile.com", score: null },
  { company: "Solaris Energy",   industry: "Solar", city: "San Diego, CA", size: "51-200", website: "solarisenergy.com", score: null },
  { company: "GreenLawn Pro",    industry: "Landscaping", city: "Nashville, TN", size: "1-10", website: "greenlawnpro.com", score: null },
];

export function ProspectDiscovery() {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(mockProspects);

  function toggleIndustry(ind: string) {
    setSelectedIndustries(prev =>
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  }

  function runDiscovery() {
    setRunning(true);
    setTimeout(() => setRunning(false), 2200);
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          Prospect Discovery
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Find and surface high-potential prospects by industry, location, and size</p>
      </div>

      {/* Filters */}
      <div className="surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <h2 className="font-semibold text-[var(--text)]">Search Filters</h2>
        </div>

        {/* Industries */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-3">
            Priority Industries
          </label>
          <div className="flex flex-wrap gap-2">
            {industries.map(ind => (
              <button
                key={ind}
                onClick={() => toggleIndustry(ind)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: selectedIndustries.includes(ind) ? "var(--accent-glow)" : "var(--card-hover)",
                  border: `1px solid ${selectedIndustries.includes(ind) ? "var(--border-accent)" : "var(--border)"}`,
                  color: selectedIndustries.includes(ind) ? "var(--accent)" : "var(--muted)",
                }}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">Country</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                {["United States", "United Kingdom", "Canada", "Australia", "South Africa"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="e.g. Dallas, Phoenix…"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">Company Size</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                style={{ background: "var(--card-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                <option value="">Any size</option>
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>200+ employees</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={runDiscovery}
          disabled={running}
          className="btn-primary gap-2"
        >
          {running ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Discovering…</>
          ) : (
            <><Search className="w-4 h-4" /> Discover Prospects</>
          )}
        </button>
      </div>

      {/* Results */}
      <div className="surface rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-[var(--text)]">Discovered Prospects <span className="text-[var(--muted)] font-normal text-sm">({results.length})</span></h2>
          <button className="text-xs text-[var(--accent)] hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Company", "Industry", "Location", "Size", "Website", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((p, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b last:border-0 hover:bg-[var(--card-hover)] transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-5 py-3 font-medium text-[var(--text)]">{p.company}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}>
                      {p.industry}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)]">{p.city}</td>
                  <td className="px-5 py-3 text-[var(--muted)]">{p.size}</td>
                  <td className="px-5 py-3 text-[var(--muted)]">{p.website}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                        style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}>
                        <Star className="w-3 h-3" /> Audit
                      </button>
                      <button className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                        style={{ background: "var(--card-hover)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                        Add to CRM <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
