import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3002
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Creates a separate vendor.js file
          }
        }
      }
    },
    chunkSizeWarningLimit: 600 // Optional: Increases the warning limit
  },
  base: "/"
});
