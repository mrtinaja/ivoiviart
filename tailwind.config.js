/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#005e63",
          teal900: "#012c2e",
          clay: "#90442a",
          clay700: "#6e2f1e",
          sand: "#f0eceb",
          lime: "#e6c105",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        script: ["Dancing Script", "cursive"],
      },
      boxShadow: { soft: "0 8px 24px rgba(0,0,0,0.25)" },
    },
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.25rem", md: "1.5rem", lg: "2rem", xl: "2rem", "2xl": "2.5rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" },
    },
  },
  plugins: [],
};
