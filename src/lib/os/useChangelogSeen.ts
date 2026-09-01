"use client";

import { useEffect, useState } from "react";
import { LATEST_CHANGELOG_ID } from "./changelog";

const STORAGE_KEY = "techfind_changelog_seen";

/** True once we know (post-mount) the viewer hasn't seen the latest entry yet. Starts false to avoid a hydration mismatch. */
export function useHasUnseenChangelog(): boolean {
  const [unseen, setUnseen] = useState(false);

  useEffect(() => {
    try {
      setUnseen(localStorage.getItem(STORAGE_KEY) !== LATEST_CHANGELOG_ID);
    } catch {
      // localStorage unavailable (private mode, etc.) — just don't show the dot.
    }
  }, []);

  return unseen;
}

export function markChangelogSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, LATEST_CHANGELOG_ID);
  } catch {
    // Nothing to do if storage is blocked — worst case the dot reappears next visit.
  }
}
