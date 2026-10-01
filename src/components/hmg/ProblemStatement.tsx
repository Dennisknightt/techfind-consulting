import { PROBLEM_QUESTIONS } from "@/lib/hmg/content";

const SPARKS = [
  "M2 30 L18 26 L34 28 L50 18 L66 20 L82 10 L98 8",
  "M2 12 L18 16 L34 14 L50 24 L66 20 L82 28 L98 22",
  "M2 22 L18 22 L34 12 L50 26 L66 16 L82 18 L98 14",
  "M2 28 L18 24 L34 25 L50 20 L66 14 L82 12 L98 4",
];

/** Navy full-width statement with four questions; each carries a small data line that draws as it scrolls in. */
export function ProblemStatement() {
  return (
    <section className="prob" aria-labelledby="prob-h">
      <div className="wrap prob__grid">
        <h2 id="prob-h" className="prob__h">You should not have to wait until year-end to understand your business.</h2>
        <ol className="prob__qs">
          {PROBLEM_QUESTIONS.map((x, i) => (
            <li key={x.q} className="prob__q">
              <svg className="prob__spark" viewBox="0 0 100 36" aria-hidden="true" focusable="false">
                <line x1="2" x2="98" y1="34" y2="34" stroke="#FFFFFF" strokeOpacity=".15" />
                <path d={SPARKS[i]} fill="none" stroke="#45C1AD" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="prob__line" />
                <circle cx="98" cy={SPARKS[i].trim().split(" ").pop()} r="3.2" fill="#B9EADB" className="prob__dot" />
              </svg>
              <h3>{x.q}</h3>
              <p>{x.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
