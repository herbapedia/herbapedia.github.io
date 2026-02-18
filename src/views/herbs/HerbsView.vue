<template>
  <div class="herbs-view">
    <div class="container">
      <header class="herbs-view__header">
        <h1>Herbapedia</h1>
        <p class="herbs-view__subtitle">
          {{ t('common.browseCollection') }}
        </p>
      </header>

      <div class="herbs-view__categories">
        <router-link
          v-for="cat in categories"
          :key="cat.slug"
          :to="localePath(`/herbs/${cat.slug}`)"
          class="category-chip"
          :class="{ 'category-chip--active': false }"
        >
          {{ cat.title }} ({{ cat.count }})
        </router-link>
      </div>

      <div class="herbs-view__grid">
        <HerbCard
          v-for="herb in herbs"
          :key="herb.slug"
          :to="localePath(`/herbs/${herb.category}/${herb.slug}`)"
          :title="herb.title"
          :english-title="herb.english_title"
          :scientific-name="herb.scientific_name"
          :image="herb.resolvedImage"
          :category="herb.category"
        />
      </div>

      <div v-if="herbs.length === 0" class="herbs-view__empty">
        <p>{{ t('common.noHerbsFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import HerbCard from '@/components/ui/HerbCard.vue'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/locales'

const { t, locale } = useI18n()
const route = useRoute()

// Category titles based on locale
const getCategoryTitle = (slug) => {
  const titles = {
    'chinese-herbs': t('categories.chineseHerbs'),
    'western-herbs': t('categories.westernHerbs'),
    'vitamins': t('categories.vitamins'),
    'minerals': t('categories.minerals'),
    'nutrients': t('categories.nutrients')
  }
  return titles[slug] || slug
}

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Import images (same for all locales)
const imageModules = import.meta.glob('/src/content/herbs/*/images/*.jpg', { eager: true, as: 'url' })

// Import herb modules for all locales
const herbsModulesEn = import.meta.glob('/src/content/herbs/*/en.yaml', { eager: true })
const herbsModulesZhHK = import.meta.glob('/src/content/herbs/*/zh-HK.yaml', { eager: true })
const herbsModulesZhCN = import.meta.glob('/src/content/herbs/*/zh-CN.yaml', { eager: true })

const herbs = ref([])
const categories = ref([
  { slug: 'chinese-herbs', title: getCategoryTitle('chinese-herbs'), count: 0 },
  { slug: 'western-herbs', title: getCategoryTitle('western-herbs'), count: 0 },
  { slug: 'vitamins', title: getCategoryTitle('vitamins'), count: 0 },
  { slug: 'minerals', title: getCategoryTitle('minerals'), count: 0 },
  { slug: 'nutrients', title: getCategoryTitle('nutrients'), count: 0 }
])

// Function to load herbs for a specific locale
function loadHerbsForLocale(targetLocale) {
  // Select the appropriate modules based on locale
  let modules
  switch (targetLocale) {
    case 'zh-HK':
      modules = herbsModulesZhHK
      break
    case 'zh-CN':
      modules = herbsModulesZhCN
      break
    default:
      modules = herbsModulesEn
  }

  const newHerbs = []
  const counts = {
    'chinese-herbs': 0,
    'western-herbs': 0,
    'vitamins': 0,
    'minerals': 0,
    'nutrients': 0
  }

  Object.entries(modules).forEach(([path, module]) => {
    const data = module?.default || module
    if (data && data.title) {
      // Extract slug from path
      const slugMatch = path.match(/\/([^/]+)\/(?:en|zh-HK|zh-CN)\.yaml$/)
      if (slugMatch) {
        data.slug = data.slug || slugMatch[1]

        // Resolve image URL
        const imagePath = `/src/content/herbs/${data.slug}/images/${data.slug}.jpg`
        if (imageModules[imagePath]) {
          data.resolvedImage = imageModules[imagePath]
        }
      }

      newHerbs.push(data)

      // Update category count
      if (counts[data.category] !== undefined) {
        counts[data.category]++
      }
    }
  })

  herbs.value = newHerbs

  // Update category counts and titles
  categories.value = categories.value.map(cat => ({
    ...cat,
    title: getCategoryTitle(cat.slug),
    count: counts[cat.slug] || 0
  }))
}

// Load herbs when locale changes
watch(locale, (newLocale) => {
  loadHerbsForLocale(newLocale)
}, { immediate: true })
</script>

<style scoped>
.herbs-view {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - var(--header-height));
}

.herbs-view__header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.herbs-view__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto;
}

.herbs-view__categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
}

.category-chip {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.category-chip:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.category-chip--active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.herbs-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.herbs-view__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}
</style>
