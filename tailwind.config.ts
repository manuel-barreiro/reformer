import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        marcellus: "var(--font-marcellus)",
        dm_sans: "var(--font-dm_sans)",
        dm_mono: "var(--font-dm_mono)",
      },
      colors: {
        grey_pebble: "#414141",
        pearl: "#f2f0e5",
        midnight: "#231f20",
        rust: "#893f24",
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
}
export default config
