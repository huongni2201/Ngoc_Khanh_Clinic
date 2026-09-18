import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/entities/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        clinic: {
          blue: "#2563eb",
          "blue-hover": "#1d4ed8",
          "blue-subtle": "#eff6ff",
          navy: "#0b1329",
          "navy-card": "#132145",
          success: "#047857",
          "success-subtle": "#ecfdf5",
          warn: "#b45309",
          "warn-subtle": "#fffbeb",
          danger: "#dc2626",
          "danger-subtle": "#fef2f2",
          purple: "#7c3aed",
          "purple-subtle": "#f5f3ff",
          muted: "#64748b",
          border: "#e2e8f0",
          surface: "#ffffff",
          "surface-subtle": "#f8fafc",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        clinic: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.06)",
        "clinic-lg": "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
