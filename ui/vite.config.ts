import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import generouted from "@generouted/react-router/plugin";
// import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [react(), generouted() /**VitePWA()*/],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
      },
    },
  },
});
