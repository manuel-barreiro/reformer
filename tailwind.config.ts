import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        inputBg: "#D9D9D9",
        pearlVariant: "#E9E7D9",
        pearlVariant2: "#F0EEE3",
        pearlVariant3: "#D6D4C6",
        tableContent: "#878686",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "marquee-slow": "marquee 8s linear infinite",
        "marquee-normal": "marquee 12s linear infinite",
        "marquee-fast": "marquee 15s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  variants: {
    animation: ["responsive"], // This enables responsive variants for the animation utility
  },
  plugins: [require("tailwindcss-animated")],
  safelist: ["overflow-y-auto"],
} satisfies Config

export default config
