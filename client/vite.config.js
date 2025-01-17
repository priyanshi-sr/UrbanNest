import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
      proxy: {
          //each time we see /api it will add local host 8000 at the beginning
          '/api': {
              target: 'http://localhost:8000',
              secure: false,
          },
      },
  },
  plugins: [react()],
})
