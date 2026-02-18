/**
 * Main entry point for Herbapedia website
 *
 * Configured for Static Site Generation (SSG) with vite-ssg
 */

import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './styles/main.css'

// ViteSSG setup
export const createApp = ViteSSG(
  App,
  { routes, base: '/' },
  ({ app, router, isClient }) => {
    // Install plugins here if needed
  }
)
