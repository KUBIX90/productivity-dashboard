import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/productivity-dashboard/",
  plugins: [
    svelte(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,csv}"],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Productivity Dashboard",
        short_name: "ProdDash",
        description: "Track and analyze daily productivity metrics",
        theme_color: "#4f46e5",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/productivity-dashboard/",
        start_url: "/productivity-dashboard/",
        icons: [
          {
            src: "/productivity-dashboard/assets/icons/icon-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/productivity-dashboard/assets/icons/icon-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
