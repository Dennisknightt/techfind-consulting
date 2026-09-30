import type { ElementType } from "react";

/** Heading whose lines rise out of a mask when revealed. */
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
    <Tag className={`mask-h ${className}`} data-reveal id={id}>
      {lines.map((l, i) => (
        <span key={i}>
          <span className="mask-h__l">
            <span className="mask-h__t" style={{ ["--i" as string]: i }}>
              {l}
            </span>
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
