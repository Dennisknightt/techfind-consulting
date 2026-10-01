import type { ElementType } from "react";

/** Section heading. Lines are joined; wrapping is left to the browser (text-wrap: balance). */
export function Lines({
  lines,
  as: Tag = "h2",
  className = "",
  id,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  return (
    <Tag className={`mask-h ${className}`} id={id}>
      {lines.join(" ")}
    </Tag>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
