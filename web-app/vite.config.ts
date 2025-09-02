import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    // Include JSX runtime for better error handling
    jsxRuntime: 'automatic'
  })],
  server: {
    // Auto-open browser and better error overlay
    open: '/index.html',
    port: 5173,
    strictPort: false, // Find another port if 5173 is busy
    hmr: {
      overlay: true, // Show errors as overlay instead of crashing
    },
    // Watch for file changes more aggressively
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  build: {
    // Better source maps for debugging
    sourcemap: true,
    // Don't fail build on warnings
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
        warn(warning)
      }
    }
  },
  // Better error handling during development
  define: {
    __DEV__: JSON.stringify(true)
  }
})
