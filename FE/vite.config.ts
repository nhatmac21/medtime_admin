import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for better hot reload
      fastRefresh: true,
      // Exclude node_modules from being processed
      exclude: /node_modules/,
    })
  ],
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd'],
  },
})
