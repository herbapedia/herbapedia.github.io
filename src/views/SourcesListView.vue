<template>
  <div class="sources-list-view">
    <!-- Hero Banner -->
    <section class="sources-hero" :class="`sources-hero--${sourceType}`">
      <div class="sources-hero__background">
        <div class="sources-hero__overlay"></div>
      </div>
      <div class="container sources-hero__content">
        <span class="sources-hero__icon">{{ sourceIcon }}</span>
        <h1 class="sources-hero__title">{{ sourceLabel }}</h1>
        <p class="sources-hero__subtitle">
          {{ t('sources.browseCount', { count: sources.length }) }}
        </p>
      </div>
    </section>

    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <router-link :to="localePath('/sources')">{{ t('nav.sources') }}</router-link>
        <span>/</span>
        <span>{{ sourceLabel }}</span>
      </nav>

      <!-- Search -->
      <div class="sources-search">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="t('sources.searchPlaceholder')"
          />
        </div>
      </div>

      <!-- Sources Grid -->
      <div v-if="filteredSources.length > 0" class="sources-grid">
        <router-link
          v-for="source in filteredSources"
          :key="getSlug(source)"
          :to="localePath(`/sources/${sourceType}/${getSlug(source)}`)"
          class="source-card"
          :class="`source-card--${sourceType}`"
        >
          <div class="source-card__image-wrapper">
            <img
              v-if="getSourceImage(source)"
              :src="getSourceImage(source)"
              :alt="getSourceName(source)"
              class="source-card__image"
              loading="lazy"
            />
            <div v-else class="source-card__placeholder">
              <span>{{ sourceIcon }}</span>
            </div>
          </div>
          <div class="source-card__content">
            <h3 class="source-card__name">{{ getSourceName(source) }}</h3>
            <p v-if="getScientificInfo(source)" class="source-card__scientific">
              {{ getScientificInfo(source) }}
            </p>
            <p v-if="source.chemicalFormula" class="source-card__formula">
              <code>{{ source.chemicalFormula }}</code>
            </p>
          </div>
          <span class="source-card__arrow">→</span>
        </router-link>
      </div>

      <div v-else class="sources-empty">
        <p>{{ t('sources.noResults') }}</p>
      </div>

      <!-- About Section -->
      <section class="sources-about">
        <h2>{{ t(`sources.${sourceType}About`) }}</h2>
        <p>{{ t(`sources.${sourceType}AboutText`) }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'

const route = useRoute()
const { t, locale } = useI18n()

const searchQuery = ref('')

const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Determine source type from route
const sourceType = computed(() => {
  const path = route.path
  if (path.includes('/sources/zoological')) return 'zoological'
  if (path.includes('/sources/mineral')) return 'mineral'
  if (path.includes('/sources/chemical')) return 'chemical'
  return 'unknown'
})

// Source type display info
const sourceTypeInfo = {
  zoological: {
    icon: '🦐',
    label: t('sources.zoological')
  },
  mineral: {
    icon: '💎',
    label: t('sources.mineral')
  },
  chemical: {
    icon: '⚗️',
    label: t('sources.chemical')
  }
}

const sourceIcon = computed(() => sourceTypeInfo[sourceType.value]?.icon || '📦')
const sourceLabel = computed(() => sourceTypeInfo[sourceType.value]?.label || sourceType.value)

// Load sources based on type
const sources = computed(() => {
  if (sourceType.value === 'zoological') {
    return dataset.getAllZoologicalSources()
  } else if (sourceType.value === 'mineral') {
    return dataset.getAllMineralSources()
  } else if (sourceType.value === 'chemical') {
    return dataset.getAllChemicalSources()
  }
  return []
})

// Filter by search
const filteredSources = computed(() => {
  if (!searchQuery.value) return sources.value

  const query = searchQuery.value.toLowerCase()
  return sources.value.filter(source => {
    const name = getSourceName(source)?.toLowerCase() || ''
    const sci = getScientificInfo(source)?.toLowerCase() || ''
    return name.includes(query) || sci.includes(query)
  })
})

// Helper functions
function getSlug(source) {
  if (!source?.['@id']) return ''
  const parts = source['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getSourceName(source) {
  if (!source?.name) return getSlug(source)
  return source.name[locale.value] ||
         source.name.en ||
         source.name['zh-Hant'] ||
         getSlug(source)
}

function getScientificInfo(source) {
  if (source.animalScientificName) return source.animalScientificName
  return null
}

function formatImagePath(img) {
  if (!img) return null
  return img.startsWith('/@herbapedia') ? img : `/${img}`
}

function getSourceImage(source) {
  return formatImagePath(source?.image)
}
</script>

<style scoped>
.sources-list-view {
  min-height: calc(100vh - var(--header-height));
}

/* Hero */
.sources-hero {
  position: relative;
  padding: var(--spacing-3xl) 0;
  margin-bottom: var(--spacing-xl);
}

.sources-hero__background {
  position: absolute;
  inset: 0;
  background: var(--color-surface);
}

.sources-hero--zoological .sources-hero__background { background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.02) 100%); }
.sources-hero--mineral .sources-hero__background { background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%); }
.sources-hero--chemical .sources-hero__background { background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.02) 100%); }

.sources-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, var(--color-background) 100%);
}

.sources-hero__content {
  position: relative;
  text-align: center;
}

.sources-hero__icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--spacing-md);
}

.sources-hero__title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-sm);
}

.sources-hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
}

/* Breadcrumbs */
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

/* Search */
.sources-search {
  margin-bottom: var(--spacing-xl);
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--color-text-light);
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 48px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  background: var(--color-surface);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Sources Grid */
.sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.source-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--color-text);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
}

.source-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.source-card--zoological:hover { border-color: #f97316; }
.source-card--mineral:hover { border-color: #8b5cf6; }
.source-card--chemical:hover { border-color: #06b6d4; }

.source-card__image-wrapper {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-background);
}

.source-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.source-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
}

.source-card__content {
  flex: 1;
  min-width: 0;
}

.source-card__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-xs);
}

.source-card__scientific {
  font-size: var(--font-size-sm);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
}

.source-card__formula {
  margin: var(--spacing-xs) 0 0;
}

.source-card__formula code {
  font-size: var(--font-size-xs);
  background: var(--color-surface-alt);
  padding: 0.1em 0.3em;
  border-radius: var(--radius-sm);
}

.source-card__arrow {
  color: var(--color-text-light);
  font-size: var(--font-size-lg);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.source-card:hover .source-card__arrow {
  opacity: 1;
}

/* Empty State */
.sources-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}

/* About Section */
.sources-about {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

.sources-about h2 {
  margin-bottom: var(--spacing-md);
}

.sources-about p {
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

/* Responsive */
@media (max-width: 640px) {
  .sources-grid {
    grid-template-columns: 1fr;
  }
}
</style>
