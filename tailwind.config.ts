import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink))",
        paper: "rgb(var(--paper))",
        sand: "rgb(var(--sand))",
        accent: "rgb(var(--accent))",
        "accent-dark": "rgb(var(--accent-dark))",
        mist: "rgb(var(--mist))"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(12, 24, 34, 0.12)",
        float: "0 8px 24px rgba(12, 24, 34, 0.14)"
      },
      fontFamily: {
        sans: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
