<template>
  <div class="category-view">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/herbs')">{{ t('nav.herbs') }}</router-link>
        <span>/</span>
        <span>{{ categoryTitle }}</span>
      </nav>

      <header class="category-view__header">
        <h1>{{ categoryTitle }}</h1>
        <p class="category-view__count">{{ filteredHerbs.length }} {{ t('common.items') }}</p>
      </header>

      <div class="category-view__grid">
        <HerbCard
          v-for="herb in filteredHerbs"
          :key="herb.slug"
          :to="localePath(`/herbs/${herb.category}/${herb.slug}`)"
          :title="herb.title"
          :scientific-name="herb.scientific_name"
          :image="herb.resolvedImage"
          :category="herb.category"
        />
      </div>

      <div v-if="filteredHerbs.length === 0" class="category-view__empty">
        <p>{{ t('common.noHerbsFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import HerbCard from '@/components/ui/HerbCard.vue'
import { DEFAULT_LOCALE } from '@/i18n/locales'

const route = useRoute()
const { t, locale } = useI18n()
const category = computed(() => route.params.category)

// Category titles based on locale
const categoryTitle = computed(() => {
  const titles = {
    'chinese-herbs': t('categories.chineseHerbs'),
    'western-herbs': t('categories.westernHerbs'),
    'vitamins': t('categories.vitamins'),
    'minerals': t('categories.minerals'),
    'nutrients': t('categories.nutrients')
  }
  return titles[category.value] || category.value
})

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

const allHerbs = ref([])

// Function to load herbs for a specific locale
function loadHerbsForLocale(targetLocale) {
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

  allHerbs.value = Object.entries(modules)
    .map(([path, module]) => {
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
        return data
      }
      return null
    })
    .filter(data => data !== null)
}

// Load herbs when locale changes
watch(locale, (newLocale) => {
  loadHerbsForLocale(newLocale)
}, { immediate: true })

const filteredHerbs = computed(() =>
  allHerbs.value.filter(herb => herb.category === category.value)
)
</script>

<style scoped>
.category-view {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - var(--header-height));
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
}

.breadcrumbs a {
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.category-view__header {
  margin-bottom: var(--spacing-2xl);
}

.category-view__count {
  color: var(--color-text-light);
}

.category-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.category-view__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}
</style>
