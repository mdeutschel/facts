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
          if (id.includes('node_modules/@mui/')) return 'mui'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-router-dom')) {
            return 'vendor'
          }
          return undefined
        },
      },
    },
  },
})
