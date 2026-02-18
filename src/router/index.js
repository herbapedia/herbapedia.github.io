import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'

// Helper to generate routes with locale support
function createLocalizedRoutes() {
  const baseRoutes = [
    {
      path: '',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: 'herbs',
      name: 'herbs',
      component: () => import('@/views/herbs/HerbsView.vue')
    },
    {
      path: 'herbs/:category',
      name: 'herbs-category',
      component: () => import('@/views/herbs/CategoryView.vue'),
      props: true
    },
    {
      path: 'herbs/:category/:slug',
      name: 'herb-detail',
      component: () => import('@/views/herbs/HerbDetailView.vue'),
      props: true
    },
    {
      path: 'about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    }
  ]

  const routes = []

  // Default locale (English) routes without prefix
  routes.push({
    path: '/',
    component: () => import('@/views/LayoutView.vue'),
    children: baseRoutes.map(route => ({
      ...route,
      name: route.name ? `en-${route.name}` : route.name,
      meta: { locale: DEFAULT_LOCALE }
    }))
  })

  // Routes for other locales with prefix
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === DEFAULT_LOCALE) continue

    routes.push({
      path: `/${locale}`,
      component: () => import('@/views/LayoutView.vue'),
      children: baseRoutes.map(route => ({
        ...route,
        name: `${locale}-${route.name}`,
        meta: { locale }
      }))
    })
  }

  // Redirect root locale paths to proper routes
  routes.push({
    path: '/en',
    redirect: '/'
  })
  routes.push({
    path: '/en/:pathMatch(.*)*',
    redirect: to => {
      return '/' + to.params.pathMatch.join('/')
    }
  })

  // 404 catch-all
  routes.push({
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  })

  return routes
}

export const routes = createLocalizedRoutes()

export default routes
