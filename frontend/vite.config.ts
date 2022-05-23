import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        short_name: "ShirtERP",
        name: "ShirtERP",
        icons: [
          {
            src: "favicon.ico",
            sizes: "16x16",
            type: "image/x-icon",
          },
          {
            src: "/shirterp-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/shirterp-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/shirterp-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        display: "standalone",
        theme_color: "#1f1f1f",
        background_color: "#000000",
      },
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "shirterp-192x192.png",
        "shirterp-384x384.png",
        "shirterp-512x512.png",
      ],
    }),
  ],
  build: { outDir: "../backend/public" },
})
