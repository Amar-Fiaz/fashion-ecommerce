/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // Fixed breakpoints from CLAUDE.md Section 8 / docs/DESIGN_SYSTEM.md.
    // These are approved functional requirements, not new design decisions.
    // All other design tokens (colors, typography, spacing, radius,
    // shadows) are intentionally left undefined here - they belong to
    // Phase 2 (Design System), per docs/DESIGN_SYSTEM.md's own status note.
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
    extend: {},
  },
  plugins: [],
};