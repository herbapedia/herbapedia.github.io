import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'

// Helper to generate routes with locale support
function createLocalizedRoutes() {
  const baseRoutes = [
    {
      path: '',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    // Preparation-centric routes (ONLY routes for browsing)
    {
      path: 'preparations',
      name: 'preparations',
      component: () => import('@/views/PreparationsView.vue')
    },
    {
      path: 'preparations/:slug',
      name: 'preparation-detail',
      component: () => import('@/views/PreparationDetailView.vue'),
      props: true
    },
    // Source materials routes (ontology browser)
    {
      path: 'sources',
      name: 'sources',
      component: () => import('@/views/SourcesView.vue')
    },
    {
      path: 'sources/botanical',
      name: 'botanical-sources',
      component: () => import('@/views/PlantsView.vue'),
      props: { sourceType: 'plant' }
    },
    {
      path: 'sources/botanical/:slug',
      name: 'botanical-source-detail',
      component: () => import('@/views/PlantDetailView.vue'),
      props: true
    },
    {
      path: 'sources/fungi',
      name: 'fungi-sources',
      component: () => import('@/views/PlantsView.vue'),
      props: { sourceType: 'fungi' }
    },
    {
      path: 'sources/fungi/:slug',
      name: 'fungi-source-detail',
      component: () => import('@/views/PlantDetailView.vue'),
      props: true
    },
    {
      path: 'sources/algae',
      name: 'algae-sources',
      component: () => import('@/views/PlantsView.vue'),
      props: { sourceType: 'algae' }
    },
    {
      path: 'sources/algae/:slug',
      name: 'algae-source-detail',
      component: () => import('@/views/PlantDetailView.vue'),
      props: true
    },
    {
      path: 'sources/zoological',
      name: 'zoological-sources',
      component: () => import('@/views/SourcesListView.vue')
    },
    {
      path: 'sources/zoological/:slug',
      name: 'zoological-source-detail',
      component: () => import('@/views/SourceDetailView.vue'),
      props: true
    },
    {
      path: 'sources/mineral',
      name: 'mineral-sources',
      component: () => import('@/views/SourcesListView.vue')
    },
    {
      path: 'sources/mineral/:slug',
      name: 'mineral-source-detail',
      component: () => import('@/views/SourceDetailView.vue'),
      props: true
    },
    {
      path: 'sources/chemical',
      name: 'chemical-sources',
      component: () => import('@/views/SourcesListView.vue')
    },
    {
      path: 'sources/chemical/:slug',
      name: 'chemical-source-detail',
      component: () => import('@/views/SourceDetailView.vue'),
      props: true
    },
    // Systems routes (medicine system browser)
    {
      path: 'systems',
      name: 'systems',
      component: () => import('@/views/SystemsView.vue')
    },
    {
      path: 'systems/:system',
      name: 'system-detail',
      component: () => import('@/views/SystemDetailView.vue'),
      props: true
    },
    {
      path: 'systems/:system/:refType',
      name: 'system-reference',
      component: () => import('@/views/ReferenceDataView.vue'),
      props: true
    },
    {
      path: 'systems/:system/:refType/:slug',
      name: 'reference-detail',
      component: () => import('@/views/ReferenceValueDetailView.vue'),
      props: true
    },
    // Chemical compounds routes
    {
      path: 'compounds',
      name: 'compounds',
      component: () => import('@/views/ChemicalCompoundsView.vue')
    },
    {
      path: 'compounds/:slug',
      name: 'compound-detail',
      component: () => import('@/views/ChemicalCompoundDetailView.vue'),
      props: true
    },
    // Plant parts routes
    {
      path: 'sources/parts',
      name: 'plant-parts',
      component: () => import('@/views/PlantPartsView.vue')
    },
    {
      path: 'sources/parts/:slug',
      name: 'plant-part-detail',
      component: () => import('@/views/PlantPartDetailView.vue'),
      props: true
    },
    // DNA barcodes routes
    {
      path: 'sources/barcodes',
      name: 'dna-barcodes',
      component: () => import('@/views/DNABarcodesView.vue')
    },
    {
      path: 'sources/barcodes/:slug',
      name: 'dna-barcode-detail',
      component: () => import('@/views/DNABarcodeDetailView.vue'),
      props: true
    },
    // Formulas routes
    {
      path: 'formulas',
      name: 'formulas',
      component: () => import('@/views/FormulasView.vue')
    },
    {
      path: 'formulas/:slug',
      name: 'formula-detail',
      component: () => import('@/views/FormulaDetailView.vue'),
      props: true
    },
    // About and Basics
    {
      path: 'about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: 'basics',
      name: 'basics',
      component: () => import('@/views/BasicsView.vue')
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
