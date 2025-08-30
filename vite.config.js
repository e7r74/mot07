import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base: process.env.VITE_GEMINI_API_KEY || '/mot07',
  server: {
    proxy: {
      '/gemini': {
        // Измените путь на /gemini
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gemini/, ''),
      },
    },
  },
})
