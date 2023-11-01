import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";

require("sharp");

export default defineConfig({
  plugins: [react()],

  test: {
    setupFiles: ["dotenv/config", "sharp"],
    environment: "jsdom",
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
