import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/kronos-console/',
  plugins: [react()],
  build: { outDir: 'dist', chunkSizeWarningLimit: 1500 }
})
