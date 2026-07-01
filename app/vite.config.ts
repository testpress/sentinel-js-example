import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readdirSync, copyFileSync, existsSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

function sentinelVendorFixPlugin() {
  const hashRe = /-([a-zA-Z0-9_]+)(\.js)$/

  return {
    name: 'sentinel-vendor-fix',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist/assets')
      const vendorDir = resolve(__dirname, 'node_modules/@testpress/sentinel-core/assets')

      if (!existsSync(vendorDir)) return

      const distFiles = readdirSync(distDir)

      for (const vendorFile of readdirSync(vendorDir)) {
        if (!vendorFile.endsWith('.js') || existsSync(resolve(distDir, vendorFile))) continue

        const match = vendorFile.match(hashRe)
        if (!match) continue
        const prefix = vendorFile.slice(0, match.index)

        const hashedFile = distFiles.find(f => f.startsWith(prefix) && f.endsWith('.js'))
        if (hashedFile) {
          copyFileSync(resolve(distDir, hashedFile), resolve(distDir, vendorFile))
        }
      }
    },
  }
}

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [tailwindcss(), sentinelVendorFixPlugin()],
  optimizeDeps: {
    exclude: ['@testpress/sentinel-core', '@testpress/sentinel-ui'],
  },
})
