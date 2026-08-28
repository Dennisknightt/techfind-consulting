import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";

const outDir = fileURLToPath(new URL("../public/os-icons/", import.meta.url));
mkdirSync(outDir, { recursive: true });

function markSvg(size, { padding = 0, rounded = true } = {}) {
  const r = rounded ? size * 0.22 : 0;
  const inset = padding;
  const boltScale = (size - inset * 2) / size;
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6D28D9"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <g transform="translate(${size / 2} ${size / 2}) scale(${boltScale}) translate(${-size / 2} ${-size / 2})">
    <path d="M ${size * 0.56} ${size * 0.16}
             L ${size * 0.34} ${size * 0.56}
             L ${size * 0.47} ${size * 0.56}
             L ${size * 0.42} ${size * 0.84}
             L ${size * 0.68} ${size * 0.42}
             L ${size * 0.53} ${size * 0.42}
             Z"
          fill="#FFFFFF"/>
  </g>
</svg>`;
}

const targets = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-256.png", size: 256 },
  { name: "icon-384.png", size: 384 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const t of targets) {
  await sharp(Buffer.from(markSvg(t.size)))
    .png()
    .toFile(outDir + t.name);
  console.log("wrote", t.name);
}

// Maskable icon needs extra safe-area padding (Android crops to a circle)
await sharp(Buffer.from(markSvg(512, { padding: 90, rounded: false })))
  .png()
  .toFile(outDir + "icon-512-maskable.png");
console.log("wrote icon-512-maskable.png");

// Favicon-ish small icon for the OS root layout
await sharp(Buffer.from(markSvg(32)))
  .png()
  .toFile(outDir + "icon-32.png");
console.log("wrote icon-32.png");
