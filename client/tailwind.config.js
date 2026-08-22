/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // Fixed breakpoints from CLAUDE.md Section 8 / docs/DESIGN_SYSTEM.md.
    screens: {
      xs: "360px",
      "xs-l": "390px",
      "xs-xl": "430px",
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      xl: "1440px",
      "2xl": "1920px",
    },
    extend: {
      colors: {
        // Monochrome base
        white: "#FFFFFF",
        neutral: {
          50: "#F7F7F7",
          200: "#E5E5E5",
          500: "#8A8A8A",
          800: "#2B2B2B",
        },
        black: "#141414",

        // Single accent color, used sparingly (CTAs, highlights)
        accent: {
          DEFAULT: "#B8935A",
          dark: "#8F6E3E",
        },

        // Semantic colors (minimal set - expanded only if a real
        // feature needs one, e.g. warning/info in a later phase)
        success: "#2E7D32",
        error: "#C0392B",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px
        lg: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
        xl: ["1.5rem", { lineHeight: "2rem" }], // 24px
        "2xl": ["2rem", { lineHeight: "2.5rem" }], // 32px
        "3xl": ["2.5rem", { lineHeight: "3rem" }], // 40px
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.06)",
        md: "0 4px 8px rgba(0, 0, 0, 0.08)",
        lg: "0 12px 24px rgba(0, 0, 0, 0.10)",
      },
    },
  },
  plugins: [],
};