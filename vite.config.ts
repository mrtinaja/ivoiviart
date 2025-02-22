import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import tailwindConfig from "./tailwind.config";
import history from "connect-history-api-fallback";

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3000, // Puerto del frontend
    open: true, // Abre automáticamente el navegador
    middlewareMode: false,
  },
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig), autoprefixer],
    },
  },
  preview: {
    // Si usas `vite preview`, puedes aplicar el middleware aquí
    port: 5000,
    open: true,
  },
});
