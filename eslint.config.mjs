import next from "eslint-config-next/core-web-vitals";

/**
 * eslint-config-next 16 ships a native flat config array, so there is no
 * FlatCompat shim here. `core-web-vitals` already includes `next` and
 * `next/typescript`.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...next,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // React Three Fiber's JSX elements carry three.js props that this rule
      // does not know about.
      "react/no-unknown-property": "off",
    },
  },
];

export default config;
