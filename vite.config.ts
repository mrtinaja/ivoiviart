import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import tailwindConfig from "./tailwind.config";

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  server: {
  port: 3000,
  open: true,
  host: true,
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/api/, ""),
    },
  },
},
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig), autoprefixer],
    },
  },
  preview: {
    port: 5000,
    open: true,
  },
});
