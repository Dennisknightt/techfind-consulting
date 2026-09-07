"use client";

/**
 * App-wide single-key shortcuts (Linear/GitHub-style: no modifier, so they
 * must never fire while the user is typing anywhere). ⌘K itself lives in
 * CommandPalette.tsx since it owns that dialog's state.
 */

import { useEffect, useState } from "react";
import { QuickCreateSheet } from "./QuickCreate";
import { ShortcutsHelpSheet } from "./ShortcutsHelpSheet";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function GlobalShortcuts() {
  const [createOpen, setCreateOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setCreateOpen(true);
      } else if (e.key === "?") {
        e.preventDefault();
        setHelpOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <QuickCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
      <ShortcutsHelpSheet open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}
