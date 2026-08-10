"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lead, LeadStage } from "@/lib/store";

export type { Lead };

export function useLeads() {
  const [leads, setLeads]     = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);  // true only until first fetch completes
  const [error, setError]     = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      // Only show the loading spinner on the very first fetch.
      // Background polls must not flash the UI blank every 30 seconds.
      const res = await fetch("/api/leads", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const { leads } = await res.json();
      setLeads(leads);
      setError(null);
    } catch {
      setError("Could not load leads. Is the server running?");
    } finally {
      setLoading(false);   // clears initial spinner; ignored on subsequent polls
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    // Poll every 30s to pick up new audit submissions
    const id = setInterval(fetchLeads, 30_000);
    return () => clearInterval(id);
  }, [fetchLeads]);

  const updateStage = useCallback(async (id: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
  }, []);

  const deleteLead = useCallback(async (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
  }, []);

  const refresh = fetchLeads;

  return { leads, loading, error, updateStage, deleteLead, refresh };
}
