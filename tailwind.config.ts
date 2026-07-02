import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aero: {
          bg:       "#0D0D0D",
          surface:  "#141414",
          card:     "#181818",
          border:   "#252525",
          "border-bright": "#3A3A3A",
          cyan:     "#00E5FF",
          "cyan-dim": "rgba(0,229,255,0.12)",
          "cyan-glow": "rgba(0,229,255,0.25)",
          red:      "#FF3B3B",
          "red-dim": "rgba(255,59,59,0.12)",
          green:    "#00FF88",
          "green-dim": "rgba(0,255,136,0.12)",
          amber:    "#FFB800",
          "text-primary":   "#FFFFFF",
          "text-secondary": "#888888",
          "text-muted":     "#444444",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xs": "10px",
      },
      animation: {
        "fade-in":  "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        blink:      "blink 1.2s step-end infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        scan:       "scan 3s linear infinite",
      },
      keyframes: {
        fadeIn:   { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp:  { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        blink:    { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        pulseDot: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        scan:     { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(400%)" } },
      },
      boxShadow: {
        "cyan-glow": "0 0 16px rgba(0,229,255,0.2)",
        "red-glow":  "0 0 16px rgba(255,59,59,0.25)",
        "card":      "0 1px 0 rgba(255,255,255,0.04) inset",
      },
    },
  },
  plugins: [typography],
};

export default config;
