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
      animation: {
        "marquee-slow": "marquee 8s linear infinite",
        "marquee-normal": "marquee 10s linear infinite",
        "marquee-fast": "marquee 13s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  variants: {
    animation: ["responsive"], // This enables responsive variants for the animation utility
  },
  plugins: [require("tailwindcss-animated")],
}
export default config
