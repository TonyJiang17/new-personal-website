import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          // Modern monochrome + single accent
          bg: "#0b0f14",
          surface: "#0f1620",
          border: "rgba(255, 255, 255, 0.10)",
          text: "#e6edf7",
          muted: "rgba(230, 237, 247, 0.55)",
          accent: "#5eead4",
          // Status colors (kept minimal)
          green: "#34d399",
          amber: "#fbbf24",
          red: "#fb7185",
          prompt: "#5eead4",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Cascadia Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
