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
          bg: "#0a0a0a",
          surface: "#111111",
          border: "#222222",
          text: "#e0e0e0",
          muted: "#525252",
          accent: "#22d3ee",
          // Monochrome-neutralized tokens: dots are decorative (aria-hidden).
          // `red` retains a muted reddish tone for error text semantics only.
          red: "#c97070",
          amber: "#3d3d3d",
          green: "#2d2d2d",
          prompt: "#22d3ee",
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
