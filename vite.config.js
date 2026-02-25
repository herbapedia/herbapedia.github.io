import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import yaml from '@modyfi/vite-plugin-yaml'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

// Find data-herbapedia directory - try both locations
function getDataDir() {
  const localDataDir = path.resolve(__dirname, '../data-herbapedia')
  const ciDataDir = path.resolve(__dirname, './data-herbapedia')
  return fs.existsSync(localDataDir) ? localDataDir : ciDataDir
}

// Plugin to serve media files from data-herbapedia in dev mode
// and copy them in build mode
function mediaPlugin() {
  const dataDir = getDataDir()
  const mediaDir = path.join(dataDir, 'media')

  return {
    name: 'serve-media',

    // In dev mode, serve media files directly
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/@herbapedia/data/')) {
          const filePath = path.join(dataDir, req.url.replace('/@herbapedia/data/', ''))

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            // Set correct content type based on extension
            const ext = path.extname(filePath).toLowerCase()
            const contentTypes = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
              '.ico': 'image/x-icon'
            }
            res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream')
            return fs.createReadStream(filePath).pipe(res)
          }
        }
        next()
      })
    },

    // In build mode, copy media files to dist
    closeBundle() {
      if (process.env.NODE_ENV === 'production' || process.env.VITE_SSG) {
        const mediaDest = path.join(__dirname, 'dist/@herbapedia/data/media')

        if (fs.existsSync(mediaDir)) {
          fs.mkdirSync(mediaDest, { recursive: true })

          function copyDir(src, dest) {
            fs.mkdirSync(dest, { recursive: true })
            const entries = fs.readdirSync(src, { withFileTypes: true })

            for (const entry of entries) {
              const srcPath = path.join(src, entry.name)
              const destPath = path.join(dest, entry.name)

              if (entry.isDirectory()) {
                copyDir(srcPath, destPath)
              } else {
                fs.copyFileSync(srcPath, destPath)
              }
            }
          }

          copyDir(mediaDir, mediaDest)
          console.log('✓ Copied media files to dist/@herbapedia/data/media')
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    yaml(),
    // JSON-LD support: treat .jsonld as JSON modules
    {
      name: 'jsonld-plugin',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('.jsonld')) {
          return {
            code: `export default ${code}`,
            map: null
          }
        }
        return null
      }
    },
    mediaPlugin()
  ],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@herbapedia/data': getDataDir()
    }
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: 'nested',
    crittersOptions: {
      reduceInlineStyles: false
    },
    includedRoutes(paths, routes) {
      // Include all static routes
      const staticRoutes = paths.filter(p => !p.includes(':'))
      const allRoutes = [...staticRoutes]

      const dataDir = getDataDir()

      // =========================================================================
      // PREPARATION-CENTRIC ROUTES (New Architecture)
      // =========================================================================

      // Read preparation entities and generate routes
      const preparationsDir = path.join(dataDir, 'entities/preparations')

      if (fs.existsSync(preparationsDir)) {
        const prepSlugs = fs.readdirSync(preparationsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

        for (const slug of prepSlugs) {
          // Add routes for each locale
          allRoutes.push(`/preparations/${slug}`)
          allRoutes.push(`/zh-Hant/preparations/${slug}`)
          allRoutes.push(`/zh-Hans/preparations/${slug}`)
        }
      }

      // =========================================================================
      // BOTANICAL SOURCE ROUTES (Ontology Browser)
      // =========================================================================

      // Read plant species entities and generate routes
      const plantsDir = path.join(dataDir, 'entities/botanical/species')

      if (fs.existsSync(plantsDir)) {
        const plantSlugs = fs.readdirSync(plantsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

        for (const slug of plantSlugs) {
          // Add routes for each locale (new path: /sources/botanical/:slug)
          allRoutes.push(`/sources/botanical/${slug}`)
          allRoutes.push(`/zh-Hant/sources/botanical/${slug}`)
          allRoutes.push(`/zh-Hans/sources/botanical/${slug}`)
        }
      }

      // =========================================================================
      // ADDITIONAL ROUTES
      // =========================================================================

      // Add locale-specific home, about, basics pages
      allRoutes.push('/zh-Hant')
      allRoutes.push('/zh-Hant/about')
      allRoutes.push('/zh-Hant/basics')
      allRoutes.push('/zh-Hans')
      allRoutes.push('/zh-Hans/about')
      allRoutes.push('/zh-Hans/basics')

      // Add preparations index for each locale
      allRoutes.push('/preparations')
      allRoutes.push('/zh-Hant/preparations')
      allRoutes.push('/zh-Hans/preparations')

      // Add sources index and botanical sub-index for each locale
      allRoutes.push('/sources')
      allRoutes.push('/zh-Hant/sources')
      allRoutes.push('/zh-Hans/sources')
      allRoutes.push('/sources/botanical')
      allRoutes.push('/zh-Hant/sources/botanical')
      allRoutes.push('/zh-Hans/sources/botanical')

      // Add systems index for each locale
      allRoutes.push('/systems')
      allRoutes.push('/zh-Hant/systems')
      allRoutes.push('/zh-Hans/systems')

      return allRoutes
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
