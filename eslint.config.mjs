import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-config-next still ships its "next/core-web-vitals" and
// "next/typescript" presets in the legacy `{ extends: [...] }` shape, not as
// flat-config arrays — importing those modules directly and spreading them
// into a flat config array throws ("is not iterable"). FlatCompat is the
// documented bridge: it resolves the named legacy config through eslint's
// own resolution and converts it into an equivalent flat-config array.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
];

export default eslintConfig;
