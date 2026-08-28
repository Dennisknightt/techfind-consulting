"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, ArrowRight, Plus } from "lucide-react";
import { ALL_NAV } from "./nav";
import { QUICK_CREATE_ITEMS } from "./QuickCreate";
import { globalSearchAction, type SearchResult } from "@/server/actions/search";

const GROUP_HEADING_CLASS =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--text-faint)]";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) { setQuery(""); setResults([]); }
  }, [open]);

  const runSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await globalSearchAction(q);
      setResults(res);
    } finally {
      setLoading(false);
    }
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-start justify-center pt-[12vh] px-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <Command
        className="relative w-full max-w-xl rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden os-animate-in"
        style={{ boxShadow: "var(--shadow-lg)" }}
        shouldFilter={false}
      >
        <div className="flex items-center gap-3 px-4 border-b" style={{ borderColor: "var(--border)" }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-faint)" }} />
          <Command.Input
            autoFocus
            value={query}
            onValueChange={runSearch}
            placeholder="Search or jump to…"
            className="flex-1 h-12 bg-transparent outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)]"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}>
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length < 2 && (
            <>
              <Command.Group heading="Create" className={GROUP_HEADING_CLASS}>
                {QUICK_CREATE_ITEMS.map(({ label, href, icon: Icon }) => (
                  <Command.Item
                    key={href}
                    onSelect={() => go(href)}
                    className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--text)] cursor-pointer data-[selected=true]:bg-[var(--surface-hover)]"
                  >
                    <Plus className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
                    {label === "Proforma" ? "Create Quotation" : `Add ${label}`}
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading="Go to" className={GROUP_HEADING_CLASS}>
                {ALL_NAV.map(({ label, href, icon: Icon }) => (
                  <Command.Item
                    key={href}
                    onSelect={() => go(href)}
                    className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--text)] cursor-pointer data-[selected=true]:bg-[var(--surface-hover)]"
                  >
                    <Icon className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
                    {label}
                  </Command.Item>
                ))}
              </Command.Group>
            </>
          )}

          {query.trim().length >= 2 && (
            <Command.Group heading={loading ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"}`} className={GROUP_HEADING_CLASS}>
              {results.map(r => (
                <Command.Item
                  key={`${r.type}-${r.id}`}
                  onSelect={() => go(r.href)}
                  className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--text)] cursor-pointer data-[selected=true]:bg-[var(--surface-hover)]"
                >
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide w-14 shrink-0"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {r.type}
                  </span>
                  <span className="flex-1 min-w-0 truncate">{r.title}</span>
                  {r.subtitle && <span className="text-xs text-[var(--text-faint)] truncate shrink-0">{r.subtitle}</span>}
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-faint)" }} />
                </Command.Item>
              ))}
              {!loading && results.length === 0 && (
                <div className="px-2.5 py-6 text-center text-sm text-[var(--text-faint)]">No matches for &ldquo;{query}&rdquo;</div>
              )}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}
