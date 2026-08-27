"use client";

import { useEffect, useRef, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command } from "cmdk";
import type { Company } from "@prisma/client";
import { Search, ChevronDown, Plus, Building2 } from "lucide-react";
import { searchCompaniesAction } from "@/server/actions/clients";

export function CompanyPicker({
  value,
  onChange,
  onCreateNew,
  placeholder = "Company, customer or phone…",
}: {
  value: Company | null;
  onChange: (company: Company) => void;
  onCreateNew?: () => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await searchCompaniesAction(query);
      setResults(res);
    }, 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, open]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className="w-full h-10 flex items-center gap-2.5 px-3.5 rounded-[var(--radius-md)] text-sm text-left"
          style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: value ? "var(--text)" : "var(--text-faint)" }}
        >
          <Building2 className="w-4 h-4 shrink-0" style={{ color: "var(--text-faint)" }} />
          <span className="flex-1 truncate">{value ? value.name : placeholder}</span>
          <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-faint)" }} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-[310] w-[var(--radix-popover-trigger-width)] rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden os-animate-in"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <Command shouldFilter={false}>
            <div className="flex items-center gap-2 px-3 border-b" style={{ borderColor: "var(--border)" }}>
              <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-faint)" }} />
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder={placeholder}
                className="flex-1 h-10 bg-transparent outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)]"
              />
            </div>
            <Command.List className="max-h-64 overflow-y-auto p-1.5">
              {results.map(c => (
                <Command.Item
                  key={c.id}
                  onSelect={() => { onChange(c); setOpen(false); }}
                  className="px-2.5 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text)] cursor-pointer data-[selected=true]:bg-[var(--surface-hover)]"
                >
                  <span className="font-medium">{c.name}</span>
                  {c.phone && <span className="text-xs text-[var(--text-faint)] ml-2">{c.phone}</span>}
                </Command.Item>
              ))}
              {results.length === 0 && (
                <div className="px-2.5 py-4 text-center text-xs text-[var(--text-faint)]">No matches</div>
              )}
            </Command.List>
            {onCreateNew && (
              <button
                type="button"
                onClick={() => { setOpen(false); onCreateNew(); }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border-t"
                style={{ borderColor: "var(--border)", color: "var(--accent)" }}
              >
                <Plus className="w-3.5 h-3.5" /> Quick Client
              </button>
            )}
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
