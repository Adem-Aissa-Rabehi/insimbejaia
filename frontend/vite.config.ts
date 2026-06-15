import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy local API requests and uploads to the Express backend (running on port 5000)
      '^/(api|categories|filieres|formations-data|settings|campuses|leads|registrations|messages|track|stats|uploads)': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
