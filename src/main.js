/**
 * Main entry point for Herbapedia website
 *
 * Configured for Static Site Generation (SSG) with vite-ssg
 * Supports multilingual content: en, zh-HK, zh-CN
 */

import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import i18n from './i18n'
import './styles/main.css'

// ViteSSG setup
export const createApp = ViteSSG(
  App,
  { routes, base: '/herbapedia/' },
  ({ app, router, isClient }) => {
    // Install i18n plugin
    app.use(i18n)

    // Handle locale on client-side navigation
    if (isClient) {
      router.beforeEach((to, from, next) => {
        const locale = to.meta?.locale || 'en'
        if (i18n.global.locale.value !== locale) {
          i18n.global.locale.value = locale
        }
        next()
      })
    }
  }
)
