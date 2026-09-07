"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { PageHeader } from "@/components/os/common/PageHeader";
import { friendlyDay } from "@/lib/os/dates";
import { staggerContainer, staggerItem } from "@/lib/os/motion";
import { CHANGELOG } from "@/lib/os/changelog";
import { markChangelogSeen } from "@/lib/os/useChangelogSeen";

export function WhatsNewView() {
  useEffect(() => {
    markChangelogSeen();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <PageHeader title="What's New" subtitle="A running record of what changed in Techfind" />

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="mt-6 space-y-4">
        {CHANGELOG.map(entry => (
          <motion.div
            key={entry.id}
            variants={staggerItem}
            className="rounded-[var(--radius-lg)] border p-4 sm:p-5 flex gap-3.5"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--accent-soft)" }}>
              <Megaphone className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </div>
            <div className="min-w-0">
              <p className="os-text-meta">{friendlyDay(entry.date)}</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text)" }}>{entry.title}</p>
              <p className="os-text-body mt-1" style={{ color: "var(--text-muted)" }}>{entry.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
