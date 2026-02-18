import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import yaml from '@modyfi/vite-plugin-yaml'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    yaml()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      reduceInlineStyles: false
    },
    includedRoutes(paths, routes) {
      // Include all static routes
      const staticRoutes = paths.filter(p => !p.includes(':'))

      // Add dynamic herb routes by reading content
      const herbRoutes = []

      // Categories
      const categories = ['chinese-herbs', 'western-herbs', 'vitamins', 'minerals', 'nutrients']
      categories.forEach(cat => {
        herbRoutes.push(`/herbs/${cat}`)
      })

      // Individual herbs - will be populated from content
      // This runs at build time, so we read from the content directory
      const fs = require('fs')
      const path = require('path')
      const herbsDir = path.resolve(__dirname, 'src/content/herbs')

      if (fs.existsSync(herbsDir)) {
        const files = fs.readdirSync(herbsDir).filter(f => f.endsWith('.yaml') && f !== 'index.yaml')
        files.forEach(file => {
          const slug = file.replace('.yaml', '')
          // We need to determine the category from the YAML content
          // For now, add routes for all categories with this slug
          categories.forEach(cat => {
            herbRoutes.push(`/herbs/${cat}/${slug}`)
          })
        })
      }

      return [...staticRoutes, ...herbRoutes]
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
