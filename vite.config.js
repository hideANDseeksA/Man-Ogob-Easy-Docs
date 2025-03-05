import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/",  // ✅ Ensures correct path on Vercel
  build: {
    outDir: "dist", // ✅ Vercel serves from "dist"
  }
})
