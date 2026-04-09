import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    allowedHosts: ['.trycloudflare.com', 'pipeline.cwprop.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const cfEmail = req.headers['cf-access-authenticated-user-email']
            if (cfEmail) {
              proxyReq.setHeader('Cf-Access-Authenticated-User-Email', cfEmail)
            }
          })
        }
      }
    }
  }
})
