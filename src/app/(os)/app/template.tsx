"use client";

import { motion } from "framer-motion";

/**
 * Next.js remounts a template on every navigation (unlike layout, which
 * persists) — used here purely so route content gets a quick, consistent
 * entrance instead of hard-cutting from one page to the next. The
 * sidebar/topbar live in layout.tsx above this, so they never remount.
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
