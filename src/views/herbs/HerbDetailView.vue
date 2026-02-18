<template>
  <div class="herb-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/herbs')">{{ t('nav.herbs') }}</router-link>
        <span>/</span>
        <router-link :to="localePath(`/herbs/${herb?.category}`)">{{ categoryTitle }}</router-link>
        <span>/</span>
        <span>{{ herb?.title }}</span>
      </nav>

      <article v-if="herb" class="herb-detail">
        <header class="herb-detail__header">
          <div class="herb-detail__image-wrapper">
            <img
              v-if="herb.resolvedImage"
              :src="herb.resolvedImage"
              :alt="herb.title"
              class="herb-detail__image"
            />
            <div v-else class="herb-detail__placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          <div class="herb-detail__meta">
            <span class="herb-detail__category">{{ categoryTitle }}</span>
            <h1 class="herb-detail__title">{{ herb.title }}</h1>
            <p v-if="herb.scientific_name" class="herb-detail__scientific">
              {{ herb.scientific_name }}
            </p>
          </div>
        </header>

        <div class="herb-detail__content">
          <section v-if="herb.history" class="herb-detail__section">
            <h2>{{ t('sections.history') }}</h2>
            <p>{{ herb.history }}</p>
          </section>

          <section v-if="herb.introduction" class="herb-detail__section">
            <h2>{{ t('sections.introduction') }}</h2>
            <p>{{ herb.introduction }}</p>
          </section>

          <section v-if="herb.botanical_source" class="herb-detail__section">
            <h2>{{ t('sections.botanicalSource') }}</h2>
            <p>{{ herb.botanical_source }}</p>
          </section>

          <section v-if="herb.traditional_usage" class="herb-detail__section">
            <h2>{{ t('sections.traditionalUsage') }}</h2>
            <p>{{ herb.traditional_usage }}</p>
          </section>

          <section v-if="herb.modern_research" class="herb-detail__section">
            <h2>{{ t('sections.modernResearch') }}</h2>
            <p>{{ herb.modern_research }}</p>
          </section>

          <section v-if="herb.functions" class="herb-detail__section">
            <h2>{{ t('sections.functions') }}</h2>
            <p>{{ herb.functions }}</p>
          </section>

          <section v-if="herb.importance" class="herb-detail__section">
            <h2>{{ t('sections.importance') }}</h2>
            <p>{{ herb.importance }}</p>
          </section>

          <section v-if="herb.food_sources" class="herb-detail__section">
            <h2>{{ t('sections.foodSources') }}</h2>
            <p>{{ herb.food_sources }}</p>
          </section>

          <aside class="herb-detail__disclaimer">
            <p>
              <strong>{{ t('disclaimer.title') }}:</strong> {{ t('disclaimer.text') }}
            </p>
          </aside>
        </div>
      </article>

      <div v-else class="herb-detail__not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('common.herbNotFound') }}</p>
        <router-link :to="localePath('/herbs')" class="herb-detail__back-link">
          &larr; {{ t('common.backToHerbs') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/i18n/locales'

const route = useRoute()
const { t, locale } = useI18n()
const slug = computed(() => route.params.slug)

// Category titles based on locale
const getCategoryTitle = (categorySlug) => {
  const titles = {
    'chinese-herbs': t('categories.chineseHerbs'),
    'western-herbs': t('categories.westernHerbs'),
    'vitamins': t('categories.vitamins'),
    'minerals': t('categories.minerals'),
    'nutrients': t('categories.nutrients')
  }
  return titles[categorySlug] || categorySlug
}

const categoryTitle = computed(() => getCategoryTitle(herb.value?.category))

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

const herb = ref(null)

// Function to load herb for a specific locale and slug
function loadHerbForLocale(targetLocale, targetSlug) {
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

  // Find the module matching the slug
  const path = `/src/content/herbs/${targetSlug}/${targetLocale === 'en' ? 'en' : targetLocale}.yaml`
  const module = modules[path]
  const data = module?.default || module || null

  if (data) {
    // Resolve image URL
    const imagePath = `/src/content/herbs/${targetSlug}/images/${targetSlug}.jpg`
    if (imageModules[imagePath]) {
      data.resolvedImage = imageModules[imagePath]
    }
  }

  herb.value = data
}

// Load herb when locale or slug changes
watch([locale, slug], ([newLocale, newSlug]) => {
  if (newSlug) {
    loadHerbForLocale(newLocale, newSlug)
  }
}, { immediate: true })
</script>

<style scoped>
.herb-detail-view {
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

.herb-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.herb-detail__image-wrapper {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-background);
}

.herb-detail__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.herb-detail__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
}

.herb-detail__placeholder svg {
  width: 64px;
  height: 64px;
}

.herb-detail__meta {
  flex: 1;
}

.herb-detail__category {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-md);
}

.herb-detail__title {
  margin-bottom: var(--spacing-sm);
}

.herb-detail__scientific {
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
}

.herb-detail__content {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.herb-detail__section {
  margin-bottom: var(--spacing-xl);
}

.herb-detail__section:last-of-type {
  margin-bottom: 0;
}

.herb-detail__section h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.herb-detail__section p {
  line-height: var(--line-height-relaxed);
}

.herb-detail__disclaimer {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.herb-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

.herb-detail__not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.herb-detail__back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .herb-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .herb-detail__image-wrapper {
    width: 150px;
    height: 150px;
  }
}
</style>
