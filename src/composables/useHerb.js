import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Import all herb YAML files using Vite glob
const herbsModules = import.meta.glob('/src/content/herbs/*.yaml', { eager: true })

// Parse and cache herbs data
const herbsCache = new Map()
const categoryCache = new Map()

// Process modules on load
Object.entries(herbsModules).forEach(([path, module]) => {
  if (path.endsWith('index.yaml')) return

  const data = module?.default || module
  if (data && data.slug) {
    herbsCache.set(data.slug, data)

    // Build category index
    if (data.category) {
      if (!categoryCache.has(data.category)) {
        categoryCache.set(data.category, [])
      }
      categoryCache.get(data.category).push(data)
    }
  }
})

/**
 * Get all herbs
 */
export function useAllHerbs() {
  return Array.from(herbsCache.values())
}

/**
 * Get herbs by category
 */
export function useHerbsByCategory(category) {
  return computed(() => categoryCache.get(category) || [])
}

/**
 * Get a single herb by slug
 */
export function useHerb(slug) {
  const route = useRoute()
  const herbSlug = slug || computed(() => route.params.slug)

  return computed(() => herbsCache.get(herbSlug.value) || null)
}

/**
 * Get category statistics
 */
export function useCategoryStats() {
  const stats = {}

  categoryCache.forEach((herbs, category) => {
    stats[category] = herbs.length
  })

  return stats
}

/**
 * Search herbs by title or scientific name
 */
export function useHerbSearch(query) {
  return computed(() => {
    if (!query.value) return []

    const searchTerm = query.value.toLowerCase()
    return Array.from(herbsCache.values()).filter(herb =>
      herb.title?.toLowerCase().includes(searchTerm) ||
      herb.scientific_name?.toLowerCase().includes(searchTerm)
    )
  })
}

/**
 * Category labels
 */
export const categoryLabels = {
  'chinese-herbs': 'Chinese Herbs',
  'western-herbs': 'Western Herbs',
  'vitamins': 'Vitamins',
  'minerals': 'Minerals',
  'nutrients': 'Nutrients'
}

/**
 * Get all categories with counts
 */
export function useCategories() {
  return Object.entries(categoryLabels).map(([slug, title]) => ({
    slug,
    title,
    count: categoryCache.get(slug)?.length || 0
  }))
}
