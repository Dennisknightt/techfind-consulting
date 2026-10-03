/**
 * "Typed in ink" text. Each character appears in turn behind a pen caret while
 * ink rises to fill the outlined letters, then an ink underline sweeps in. It
 * repeats every 9s: after a hold the ink lifts back to outlines and retypes.
 * Pure CSS (server-rendered); purely visual — wrap with an sr-only copy of the
 * text. Without JS (`.js` class) or with reduced motion it renders as solid text.
 */
export function TypeInk({ text, start = 0.35, step = 0.06 }: { text: string; start?: number; step?: number }) {
  const chars = [...text];
  return (
    <span className="tw" style={{ ["--t0" as string]: `${start}s`, ["--ts" as string]: `${step}s`, ["--n" as string]: chars.length }} aria-hidden="true">
      {chars.map((ch, i) => (
        <span key={i} className="tw__c" style={{ ["--i" as string]: i }}>{ch}</span>
      ))}
    </span>
  );
}
