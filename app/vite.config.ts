import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [tailwindcss()],
  optimizeDeps: {
    exclude: ['@testpress/sentinel-core', '@testpress/sentinel-ui'],
  },
})
