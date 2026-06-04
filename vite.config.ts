import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep React and the router in a single long-lived vendor chunk —
          // they are needed on every route and rarely change. MUI is left to
          // Rollup's automatic splitting so route-specific components land in
          // their lazy route chunks instead of one eagerly loaded bundle.
          if (id.includes('node_modules/react') || id.includes('node_modules/react-router-dom')) {
            return 'vendor'
          }
          return undefined
        },
      },
    },
  },
})
