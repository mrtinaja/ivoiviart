import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Fuente por defecto de toda la app
        sans: ["Manrope", "system-ui", "ui-sans-serif", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        // Opcional: para logo o títulos sueltos
        script: ["Dancing Script", "cursive"],
      },
    },
  },
  plugins: [],
} satisfies Config;
