/** Nairobi consultation vignette: low city silhouette, acacia, two advisors at a table. */
export function WhyArt() {
  return (
    <svg
      className="why-art"
      viewBox="0 0 600 560"
      role="img"
      aria-label="Illustration: a founder and an HMG consultant reviewing a financial document at a table, with an acacia tree and the Nairobi skyline behind them at sunrise"
    >
      <defs>
        <clipPath id="wa-clip"><rect width="600" height="560" rx="28" /></clipPath>
        <linearGradient id="wa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#062E4F" />
          <stop offset="1" stopColor="#0B4468" />
        </linearGradient>
      </defs>
      <g clipPath="url(#wa-clip)">
        <rect width="600" height="560" fill="url(#wa-sky)" />
        <g className="wa-sun">
        <circle cx="400" cy="250" r="92" className="f-mint" />
        <circle cx="400" cy="250" r="122" fill="none" stroke="#B9EADB" strokeOpacity=".4" strokeDasharray="2 8" />
        </g>
        {/* skyline */}
        <g fill="#092B46">
          <rect x="0" y="290" width="70" height="120" />
          <rect x="78" y="250" width="54" height="160" />
          <rect x="140" y="300" width="80" height="110" />
          {/* cylindrical tower with cone crown */}
          <rect x="236" y="220" width="36" height="190" />
          <path d="M232 222l22-44 22 44Z" />
          <rect x="290" y="280" width="64" height="130" />
          <rect x="470" y="270" width="60" height="140" />
          <rect x="536" y="310" width="70" height="100" />
        </g>
        <g fill="#45C1AD" fillOpacity=".5">
          {[0, 1, 2, 3].map((i) => <rect key={i} x="246" y={240 + i * 30} width="16" height="6" rx="2" />)}
          {[0, 1, 2].map((i) => <rect key={`b${i}`} x="92" y={266 + i * 34} width="26" height="6" rx="2" />)}
        </g>
        {/* acacia */}
        <g className="f-ink">
          <path d="M498 420c-4-60 2-96 8-126 2 18 0 40 6 62 4-20 14-38 30-52-14 20-16 50-12 116Z" />
          <ellipse cx="514" cy="278" rx="92" ry="20" />
          <ellipse cx="440" cy="296" rx="50" ry="12" />
          <ellipse cx="572" cy="300" rx="44" ry="11" />
        </g>
        <rect x="0" y="405" width="600" height="155" className="f-teal" fillOpacity=".18" />
        <rect x="0" y="405" width="600" height="2" className="f-teal" />

        {/* figures (faceless, geometric) */}
        <g>
          <circle cx="210" cy="340" r="30" fill="#6B4630" />
          <path d="M150 470c0-56 26-96 60-96s60 40 60 96Z" fill="#FBFAF7" />
          <path d="M210 374l-16 36 16 14 16-14Z" fill="#45C1AD" />
        </g>
        <g>
          <circle cx="388" cy="346" r="28" fill="#8A5A3C" />
          <path d="M330 470c0-52 26-90 58-90s58 38 58 90Z" fill="#45C1AD" />
          <path d="M360 384c6 18 50 18 56 0" fill="none" stroke="#062E4F" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* table */}
        <rect x="90" y="450" width="430" height="110" className="f-cream" />
        <rect x="90" y="450" width="430" height="6" fill="#092B46" fillOpacity=".15" />
        <g className="why-doc">
          <rect x="228" y="456" width="150" height="84" rx="6" className="f-warm" transform="rotate(-2 303 498)" />
          <rect x="246" y="472" width="60" height="7" rx="3.5" className="f-navy" transform="rotate(-2 303 498)" />
          {[0, 1, 2].map((i) => <rect key={i} x="246" y={488 + i * 13} width={100 - i * 14} height="5" rx="2.5" fill="#092B46" fillOpacity=".25" transform="rotate(-2 303 498)" />)}
          <path d="M330 478 L344 470 L356 476 L368 462" fill="none" className="s-teal" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-2 303 498)" />
        </g>
        <g>
          <rect x="440" y="468" width="30" height="34" rx="6" className="f-navy" />
          <path d="M470 476h8a8 8 0 0 1 0 16h-8" fill="none" className="s-navy" strokeWidth="4" />
        </g>
      </g>
    </svg>
  );
}
