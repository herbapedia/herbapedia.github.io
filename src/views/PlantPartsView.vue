<template>
  <div class="plant-parts-view">
    <!-- Hero Banner -->
    <section class="plant-parts-hero">
      <div class="plant-parts-hero__background">
        <div class="plant-parts-hero__overlay"></div>
      </div>
      <div class="container plant-parts-hero__content">
        <h1 class="plant-parts-hero__title">{{ t('plantParts.title') }}</h1>
        <p class="plant-parts-hero__subtitle">
          {{ t('plantParts.browseCount', { count: allParts.length }) }}
        </p>
        <!-- Search Bar -->
        <div class="plant-parts-hero__search">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              :placeholder="t('plantParts.searchPlaceholder')"
            />
            <button
              v-if="searchQuery"
              class="search-clear"
              @click="searchQuery = ''"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <span>{{ t('plantParts.title') }}</span>
      </nav>

      <!-- Filter Tabs -->
      <div class="plant-parts-filter-tabs">
        <button
          class="filter-tab"
          :class="{ 'filter-tab--active': filterMode === 'all' }"
          @click="filterMode = 'all'"
        >
          {{ t('plantParts.allParts') }} ({{ allParts.length }})
        </button>
        <button
          v-for="type in partTypes"
          :key="type"
          class="filter-tab"
          :class="{ 'filter-tab--active': filterMode === type }"
          @click="filterMode = type"
        >
          {{ getPartTypeLabel(type) }} ({{ getPartsByType(type).length }})
        </button>
      </div>

      <!-- Results info -->
      <div class="plant-parts-results">
        <span v-if="searchQuery">
          {{ t('plantParts.showingResults', { count: filteredParts.length, query: searchQuery }) }}
        </span>
      </div>

      <!-- Parts Grid -->
      <div class="plant-parts-grid">
        <router-link
          v-for="part in filteredParts"
          :key="getSlug(part)"
          :to="localePath(`/sources/parts/${getSlug(part)}`)"
          class="plant-part-card"
        >
          <div class="plant-part-card__icon">{{ getPartIcon(part) }}</div>
          <div class="plant-part-card__content">
            <h3 class="plant-part-card__name">{{ getPartName(part) }}</h3>
            <p v-if="getSpeciesName(part)" class="plant-part-card__species">
              {{ getSpeciesName(part) }}
            </p>
            <p v-if="getPartDescription(part)" class="plant-part-card__description">
              {{ truncate(getPartDescription(part), 80) }}
            </p>
          </div>
          <span class="plant-part-card__arrow">→</span>
        </router-link>
      </div>

      <div v-if="filteredParts.length === 0" class="plant-parts-empty">
        <p>{{ t('plantParts.noResults') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'

const { t, locale } = useI18n()

// Get all plant parts
const allParts = computed(() => dataset.getAllPlantParts())

// Search and filter state
const searchQuery = ref('')
const filterMode = ref('all')

// Part types for filtering
const partTypes = ['root', 'rhizome', 'leaf', 'flower', 'fruit', 'seed', 'bulb', 'bark', 'stem']

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Get parts by type
function getPartsByType(type) {
  return allParts.value.filter(part => {
    const slug = getSlug(part).toLowerCase()
    return slug.includes(type.toLowerCase())
  })
}

// Get part type label
function getPartTypeLabel(type) {
  const labels = {
    root: t('plantParts.roots'),
    rhizome: t('plantParts.rhizomes'),
    leaf: t('plantParts.leaves'),
    flower: t('plantParts.flowers'),
    fruit: t('plantParts.fruits'),
    seed: t('plantParts.seeds'),
    bulb: t('plantParts.bulbs'),
    bark: t('plantParts.barks'),
    stem: t('plantParts.stems')
  }
  return labels[type] || type
}

// Get part icon based on type
function getPartIcon(part) {
  const slug = getSlug(part).toLowerCase()
  if (slug.includes('root')) return '🫚'
  if (slug.includes('rhizome')) return '🌿'
  if (slug.includes('leaf')) return '🍃'
  if (slug.includes('flower')) return '🌸'
  if (slug.includes('fruit')) return '🍒'
  if (slug.includes('seed')) return '🌱'
  if (slug.includes('bulb')) return '🧅'
  if (slug.includes('bark')) return '🪵'
  if (slug.includes('stem')) return '🎋'
  return '🌿'
}

// Filtered parts
const filteredParts = computed(() => {
  let parts = filterMode.value === 'all'
    ? allParts.value
    : getPartsByType(filterMode.value)

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    parts = parts.filter(part => {
      const nameMatch = getPartName(part)?.toLowerCase().includes(query)
      const speciesMatch = getSpeciesName(part)?.toLowerCase().includes(query)
      const descMatch = getPartDescription(part)?.toLowerCase().includes(query)
      return nameMatch || speciesMatch || descMatch
    })
  }

  return parts
})

// Helper functions
function getSlug(part) {
  if (!part?.['@id']) return ''
  const parts = part['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getPartName(part) {
  if (!part?.name) return getSlug(part)
  return part.name[locale.value] ||
         part.name['en'] ||
         part.name['zh-Hant'] ||
         getSlug(part)
}

function getPartDescription(part) {
  if (!part?.description) return null
  return part.description[locale.value] ||
         part.description['en'] ||
         part.description['zh-Hant']
}

function getSpeciesName(part) {
  if (!part?.partOf) return null
  const speciesSlug = part.partOf['@id'].split('/').pop()
  const species = dataset.getPlantSpecies(speciesSlug)
  if (!species) return null
  return species.scientificName
}

function truncate(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.plant-parts-view {
  min-height: calc(100vh - var(--header-height));
}

/* Hero Banner */
.plant-parts-hero {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: var(--spacing-2xl);
}

.plant-parts-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.plant-parts-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.9), rgba(16, 185, 129, 0.85));
}

.plant-parts-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--color-text-inverse);
}

.plant-parts-hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-inverse);
}

.plant-parts-hero__subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto var(--spacing-lg);
}

.plant-parts-hero__search {
  max-width: 500px;
  margin: 0 auto;
}

/* Search Input */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: var(--color-text-light);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 44px;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-lg);
}

.search-input::placeholder {
  color: var(--color-text-light);
}

.search-input:focus {
  outline: none;
  box-shadow: var(--shadow-xl), 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.search-clear {
  position: absolute;
  right: 12px;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color var(--transition-fast);
}

.search-clear:hover {
  color: var(--color-text);
}

.search-clear svg {
  width: 18px;
  height: 18px;
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

/* Filter Tabs */
.plant-parts-filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-md);
}

.filter-tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: none;
  border: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}

.filter-tab:hover {
  color: var(--color-text);
}

.filter-tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* Results info */
.plant-parts-results {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* Parts Grid */
.plant-parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.plant-part-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--color-text);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
}

.plant-part-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

.plant-part-card__icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 150, 105, 0.1);
  border-radius: var(--radius-md);
}

.plant-part-card__content {
  flex: 1;
  min-width: 0;
}

.plant-part-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs);
}

.plant-part-card__species {
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-style: italic;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
}

.plant-part-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
  line-height: var(--line-height-relaxed);
}

.plant-part-card__arrow {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.plant-part-card:hover .plant-part-card__arrow {
  opacity: 1;
}

/* Empty state */
.plant-parts-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 640px) {
  .plant-parts-hero {
    height: 240px;
  }

  .plant-parts-hero__title {
    font-size: var(--font-size-3xl);
  }

  .plant-parts-filter-tabs {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .plant-parts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
