"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Globe, Star, RefreshCw, ArrowRight, MapPin, Building2, X } from "lucide-react";

const industries = [
  "HVAC", "Roofing", "Plumbing", "Electrical", "Solar", "Landscaping",
  "Restoration", "Construction", "Home Services", "Law Firm", "Clinic",
  "Dental", "Accounting", "Financial Advisory", "IT Services", "Marketing Agency",
];

/** Full prospect dataset — filter logic runs against this */
const ALL_PROSPECTS = [
  { company: "Jua Cool HVAC",          industry: "HVAC",               city: "Nairobi, Nairobi",     size: "11-50",  website: "juacool.co.ke" },
  { company: "TopShield Roofing",      industry: "Roofing",             city: "Mombasa, Coast",       size: "1-10",   website: "topshieldroofing.co.ke" },
  { company: "Amani Law Advocates",    industry: "Law Firm",            city: "Nairobi, Nairobi",     size: "11-50",  website: "amanilaw.co.ke" },
  { company: "PearlSmile Dental",      industry: "Dental",              city: "Nakuru, Rift Valley",  size: "1-10",   website: "pearlsmile.co.ke" },
  { company: "Jua Solar Kenya",        industry: "Solar",               city: "Nairobi, Nairobi",     size: "51-200", website: "juasolar.co.ke" },
  { company: "GreenScape Landscaping", industry: "Landscaping",         city: "Kisumu, Nyanza",       size: "1-10",   website: "greenscapeke.co.ke" },
  { company: "MajiFlow Plumbing",      industry: "Plumbing",            city: "Eldoret, Rift Valley", size: "1-10",   website: "majiflow.co.ke" },
  { company: "Nguvu Electrical",       industry: "Electrical",          city: "Thika, Central",       size: "11-50",  website: "nguvu.co.ke" },
  { company: "Jenga Construction",     industry: "Construction",        city: "Nairobi, Nairobi",     size: "51-200", website: "jengake.co.ke" },
  { company: "Nyumba Home Services",   industry: "Home Services",       city: "Mombasa, Coast",       size: "1-10",   website: "nyumbahome.co.ke" },
  { company: "Hesabu Accounting",      industry: "Accounting",          city: "Nairobi, Nairobi",     size: "11-50",  website: "hesabu.co.ke" },
  { company: "Akiba Financial",        industry: "Financial Advisory",  city: "Nairobi, Nairobi",     size: "11-50",  website: "akibafinancial.co.ke" },
  { company: "Jua Energy Solutions",   industry: "Solar",               city: "Kisumu, Nyanza",       size: "11-50",  website: "juaenergy.co.ke" },
  { company: "Simba IT Solutions",     industry: "IT Services",         city: "Nairobi, Nairobi",     size: "51-200", website: "simbait.co.ke" },
  { company: "Safari Restoration",     industry: "Restoration",         city: "Malindi, Coast",       size: "1-10",   website: "safarirestore.co.ke" },
  { company: "Eden Landscaping",       industry: "Landscaping",         city: "Nakuru, Rift Valley",  size: "11-50",  website: "edenlandscape.co.ke" },
  { company: "Haki Law Group",         industry: "Law Firm",            city: "Mombasa, Coast",       size: "11-50",  website: "hakilaw.co.ke" },
  { company: "Afya Clinic Nakuru",     industry: "Clinic",              city: "Nakuru, Rift Valley",  size: "1-10",   website: "afyaclinic.co.ke" },
  { company: "Panda Digital Marketing",industry: "Marketing Agency",    city: "Nairobi, Nairobi",     size: "1-10",   website: "pandadigital.co.ke" },
  { company: "Baridi Cool HVAC",       industry: "HVAC",                city: "Eldoret, Rift Valley", size: "1-10",   website: "baridihvac.co.ke" },
];

/** Map dropdown value → size prefix used in data */
function sizeMatch(filterVal: string, dataSize: string): boolean {
  if (!filterVal) return true;
  const map: Record<string, string> = {
    "1-10 employees":   "1-10",
    "11-50 employees":  "11-50",
    "51-200 employees": "51-200",
    "200+ employees":   "200+",
  };
  return dataSize.startsWith(map[filterVal] ?? filterVal);
}

export function ProspectDiscovery() {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [country, setCountry] = useState("Kenya");
  const [citySearch, setCitySearch] = useState("");
  const [size, setSize] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(ALL_PROSPECTS);
  const [hasSearched, setHasSearched] = useState(false);

  function toggleIndustry(ind: string) {
    setSelectedIndustries(prev =>
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  }

  function runDiscovery() {
    setRunning(true);
    setTimeout(() => {
      // Apply all active filters
      const cityLower = citySearch.trim().toLowerCase();
      const filtered = ALL_PROSPECTS.filter(p => {
        const industryMatch =
          selectedIndustries.length === 0 ||
          selectedIndustries.some(ind => p.industry.toLowerCase().includes(ind.toLowerCase()));
        const cityMatch =
          !cityLower || p.city.toLowerCase().includes(cityLower);
        const companySizeMatch = sizeMatch(size, p.size);
        return industryMatch && cityMatch && companySizeMatch;
      });
      setResults(filtered);
      setHasSearched(true);
      setRunning(false);
    }, 1200);
  }

  function clearFilters() {
    setSelectedIndustries([]);
    setCitySearch("");
    setSize("");
    setResults(ALL_PROSPECTS);
    setHasSearched(false);
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
                {["Kenya", "Uganda", "Tanzania", "South Africa", "Nigeria", "United Kingdom"].map(c => (
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
                placeholder="e.g. Nairobi, Mombasa…"
                value={citySearch}
                onChange={e => setCitySearch(e.target.value)}
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

        <div className="flex items-center gap-3">
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
          {hasSearched && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm transition-all"
              style={{ background: "var(--card-hover)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="surface rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-[var(--text)]">
            {hasSearched ? "Search Results" : "All Prospects"}{" "}
            <span className="text-[var(--muted)] font-normal text-sm">({results.length})</span>
          </h2>
          {results.length > 0 && (
            <button className="text-xs text-[var(--accent)] hover:underline">Export CSV</button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Search className="w-10 h-10 mb-4" style={{ color: "var(--muted)", opacity: 0.4 }} />
            <p className="font-semibold text-[var(--text)] mb-1">No prospects match your filters</p>
            <p className="text-sm text-[var(--muted)] mb-4">Try removing some filters or broadening your search</p>
            <button
              onClick={clearFilters}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
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
                    key={`${p.company}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
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
        )}
      </div>
    </div>
  );
}
