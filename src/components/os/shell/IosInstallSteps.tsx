import { Share } from "lucide-react";

/** The only real "install" mechanism on iOS Safari — no beforeinstallprompt event exists there. */
export function IosInstallSteps() {
  return (
    <ol className="space-y-2 text-xs text-[var(--text-muted)]">
      <li className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>1</span>
        Tap the <Share className="w-3.5 h-3.5 inline mx-0.5" /> Share icon in Safari
      </li>
      <li className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>2</span>
        Scroll down and tap <strong className="text-[var(--text)]">&ldquo;Add to Home Screen&rdquo;</strong>
      </li>
      <li className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>3</span>
        Tap <strong className="text-[var(--text)]">Add</strong> to confirm
      </li>
    </ol>
  );
}
