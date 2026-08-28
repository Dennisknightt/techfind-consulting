"use client";

import { useState, useEffect, useCallback } from "react";
import type { Communication, CommChannel, CommDirection } from "@/lib/store";

export type { Communication, CommChannel, CommDirection };

/** All communications across every lead — powers the inbox list. */
export function useAllCommunications() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/communications", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const { communications } = await res.json();
      setCommunications(communications);
    } catch {
      // Inbox stays at last-known state on transient failures.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 20_000);
    return () => clearInterval(id);
  }, [fetchAll]);

  return { communications, loading, refresh: fetchAll };
}

/** Thread for a single lead, plus the ability to log a new entry. */
export function useLeadCommunications(leadId: string | null) {
  const [thread, setThread]   = useState<Communication[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchThread = useCallback(async () => {
    if (!leadId) { setThread([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/communications`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const { communications } = await res.json();
      setThread(communications);
    } catch {
      // keep previous thread on failure
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => { fetchThread(); }, [fetchThread]);

  const logCommunication = useCallback(async (entry: {
    channel: CommChannel;
    direction: CommDirection;
    subject?: string;
    body: string;
  }) => {
    if (!leadId) return null;
    setSending(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/communications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error("Failed to log communication");
      const { communication } = await res.json();
      setThread(prev => [...prev, communication]);
      return communication as Communication;
    } finally {
      setSending(false);
    }
  }, [leadId]);

  return { thread, loading, sending, logCommunication, refresh: fetchThread };
}
