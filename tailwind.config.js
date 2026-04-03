/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#242F5D", dark: "#1A2248", light: "#2E3B6E" },
        fimex: { red: "#C8142F", "red-dark": "#A8102A", "red-light": "#E8354F" },
        panel: { bg: "#F4F5FA", card: "#FFFFFF", border: "#D8DCE8" },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
