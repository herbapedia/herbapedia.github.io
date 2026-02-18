export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/herbs',
    name: 'herbs',
    component: () => import('@/views/herbs/HerbsView.vue')
  },
  {
    path: '/herbs/:category',
    name: 'herbs-category',
    component: () => import('@/views/herbs/CategoryView.vue'),
    props: true
  },
  {
    path: '/herbs/:category/:slug',
    name: 'herb-detail',
    component: () => import('@/views/herbs/HerbDetailView.vue'),
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

export default routes
