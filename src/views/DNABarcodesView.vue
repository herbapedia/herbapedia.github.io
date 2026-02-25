<template>
  <div class="dna-barcodes-view">
    <!-- Hero Banner -->
    <section class="dna-barcodes-hero">
      <div class="dna-barcodes-hero__background">
        <div class="dna-barcodes-hero__overlay"></div>
      </div>
      <div class="container dna-barcodes-hero__content">
        <h1 class="dna-barcodes-hero__title">{{ t('dnaBarcodes.title') }}</h1>
        <p class="dna-barcodes-hero__subtitle">
          {{ t('dnaBarcodes.subtitle') }}
        </p>
      </div>
    </section>

    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <span>{{ t('dnaBarcodes.title') }}</span>
      </nav>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-box">
          <span class="search-box__icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('dnaBarcodes.searchPlaceholder')"
            class="search-box__input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="search-box__clear">
            ✕
          </button>
        </div>
        <div v-if="searchQuery && filteredBarcodes.length > 0" class="search-results-count">
          {{ t('dnaBarcodes.showingResults', { count: filteredBarcodes.length, query: searchQuery }) }}
        </div>
      </div>

      <!-- Barcodes Grid -->
      <div class="dna-barcodes-grid">
        <router-link
          v-for="barcode in filteredBarcodes"
          :key="getSlug(barcode)"
          :to="localePath(`/sources/barcodes/${getSlug(barcode)}`)"
          class="dna-barcode-card"
        >
          <div class="dna-barcode-card__icon">🧬</div>
          <div class="dna-barcode-card__content">
            <h3 class="dna-barcode-card__name">{{ getBarcodeName(barcode) }}</h3>
            <p v-if="getSpeciesName(barcode)" class="dna-barcode-card__species">
              {{ getSpeciesName(barcode) }}
            </p>
            <div class="dna-barcode-card__regions">
              <span v-for="region in getRegions(barcode)" :key="region" class="region-badge">
                {{ region }}
              </span>
            </div>
          </div>
          <span class="dna-barcode-card__arrow">→</span>
        </router-link>
      </div>

      <div v-if="filteredBarcodes.length === 0 && searchQuery" class="dna-barcodes-empty">
        <p>{{ t('dnaBarcodes.noResults') }}</p>
      </div>
      <div v-if="filteredBarcodes.length === 0 && !searchQuery" class="dna-barcodes-empty">
        <p>{{ t('dnaBarcodes.noResults') }}</p>
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

// Search state
const searchQuery = ref('')

// Get all DNA barcodes
const allBarcodes = computed(() => dataset.getAllDNABarcodes())

// Filtered barcodes based on search
const filteredBarcodes = computed(() => {
  if (!searchQuery.value.trim()) {
    return allBarcodes.value
  }
  const query = searchQuery.value.toLowerCase()
  return allBarcodes.value.filter(barcode => {
    const name = getBarcodeName(barcode).toLowerCase()
    const species = getSpeciesName(barcode)?.toLowerCase() || ''
    const regions = getRegions(barcode).join(' ').toLowerCase()
    return name.includes(query) || species.includes(query) || regions.includes(query)
  })
})

function clearSearch() {
  searchQuery.value = ''
}

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Helper functions
function getSlug(barcode) {
  if (!barcode?.['@id']) return ''
  const parts = barcode['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getBarcodeName(barcode) {
  if (!barcode?.name) return getSlug(barcode)
  return barcode.name[locale.value] ||
         barcode.name['en'] ||
         barcode.name['zh-Hant'] ||
         getSlug(barcode)
}

function getSpeciesName(barcode) {
  if (!barcode?.species) return null
  const speciesSlug = barcode.species['@id'].split('/').pop()
  const species = dataset.getPlantSpecies(speciesSlug)
  if (!species) return null
  return species.scientificName
}

function getRegions(barcode) {
  if (!barcode?.sequence) return []
  return barcode.sequence.map(s => s.region).filter(Boolean)
}
</script>

<style scoped>
.dna-barcodes-view {
  min-height: calc(100vh - var(--header-height));
}

/* Hero Banner */
.dna-barcodes-hero {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: var(--spacing-2xl);
}

.dna-barcodes-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
}

.dna-barcodes-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.9), rgba(20, 184, 166, 0.85));
}

.dna-barcodes-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--color-text-inverse);
}

.dna-barcodes-hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-inverse);
}

.dna-barcodes-hero__subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto;
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

/* Search Section */
.search-section {
  margin-bottom: var(--spacing-xl);
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: border-color var(--transition-fast);
}

.search-box:focus-within {
  border-color: #0d9488;
}

.search-box__icon {
  font-size: var(--font-size-lg);
  opacity: 0.5;
}

.search-box__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--font-size-base);
  color: var(--color-text);
  outline: none;
}

.search-box__input::placeholder {
  color: var(--color-text-light);
}

.search-box__clear {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  padding: var(--spacing-xs);
  font-size: var(--font-size-sm);
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.search-box__clear:hover {
  opacity: 1;
}

.search-results-count {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* Barcodes Grid */
.dna-barcodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.dna-barcode-card {
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
  position: relative;
}

.dna-barcode-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: #0d9488;
}

.dna-barcode-card__icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 148, 136, 0.1);
  border-radius: var(--radius-md);
}

.dna-barcode-card__content {
  flex: 1;
  min-width: 0;
}

.dna-barcode-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: #0d9488;
  margin: 0 0 var(--spacing-xs);
}

.dna-barcode-card__species {
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-style: italic;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm);
}

.dna-barcode-card__regions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.region-badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: 2px 8px;
  background: rgba(13, 148, 136, 0.1);
  color: #0d9488;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
}

.dna-barcode-card__arrow {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.dna-barcode-card:hover .dna-barcode-card__arrow {
  opacity: 1;
}

/* Empty state */
.dna-barcodes-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 640px) {
  .dna-barcodes-hero {
    height: 240px;
  }

  .dna-barcodes-hero__title {
    font-size: var(--font-size-3xl);
  }

  .dna-barcodes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
