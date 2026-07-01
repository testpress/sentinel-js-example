import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  optimizeDeps: {
    exclude: ['@testpress/sentinel-core', '@testpress/sentinel-ui'],
  },
})
