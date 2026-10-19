import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, forward /api to the local backend so the app can always call
    // its own origin, the same way it does on Vercel.
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
})
