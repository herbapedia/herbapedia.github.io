<template>
  <div class="plants-view">
    <!-- Hero Banner -->
    <section class="plants-hero">
      <div class="plants-hero__background">
        <img
          :src="heroImage"
          alt=""
          class="plants-hero__bg-image"
          @error="handleImageError"
        />
        <div class="plants-hero__overlay"></div>
      </div>
      <div class="container plants-hero__content">
        <h1 class="plants-hero__title">{{ pageTitle }}</h1>
        <p class="plants-hero__subtitle">
          {{ t('plants.browseCount', { count: allSpecies.length }) }}
        </p>
        <!-- Search Bar -->
        <div class="plants-hero__search">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              :placeholder="t('plants.searchPlaceholder')"
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
        <router-link :to="localePath('/sources')">{{ t('nav.sources') }}</router-link>
        <span>/</span>
        <span>{{ t(breadcrumbKey) }}</span>
      </nav>

      <!-- Filter Tabs -->
      <div class="plants-filter-tabs">
        <button
          class="filter-tab"
          :class="{ 'filter-tab--active': filterMode === 'all' }"
          @click="filterMode = 'all'"
        >
          {{ t('plants.allPlants') }} ({{ allSpecies.length }})
        </button>
        <button
          class="filter-tab"
          :class="{ 'filter-tab--active': filterMode === 'with-preparations' }"
          @click="filterMode = 'with-preparations'"
        >
          {{ t('plants.withPreparations') }} ({{ speciesWithPreparations.length }})
        </button>
      </div>

      <!-- Results info -->
      <div class="plants-results">
        <span v-if="searchQuery">
          {{ t('plants.showingResults', { count: filteredPlants.length, query: searchQuery }) }}
        </span>
      </div>

      <!-- Plants Grid -->
      <div class="plants-grid">
        <router-link
          v-for="item in filteredPlants"
          :key="getSlug(item.plant || item)"
          :to="localePath(`${basePath}/${getSlug(item.plant || item)}`)"
          class="plant-card"
        >
          <div class="plant-card__image-wrapper">
            <img
              v-if="getPlantImage(item.plant || item)"
              :src="getPlantImage(item.plant || item)"
              :alt="(item.plant || item).scientificName"
              class="plant-card__image"
              loading="lazy"
            />
            <div v-else class="plant-card__placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span v-if="item.preparationCount" class="plant-card__badge">
              {{ item.preparationCount }} {{ t('plants.preparations') }}
            </span>
          </div>
          <div class="plant-card__content">
            <h3 class="plant-card__scientific">{{ (item.plant || item).scientificName }}</h3>
            <p v-if="getCommonName(item.plant || item)" class="plant-card__common">
              {{ getCommonName(item.plant || item) }}
            </p>
            <p v-if="(item.plant || item).family" class="plant-card__family">
              {{ (item.plant || item).family }}
            </p>
          </div>
        </router-link>
      </div>

      <div v-if="filteredPlants.length === 0" class="plants-empty">
        <p>{{ t('plants.noResults') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'

const props = defineProps({
  sourceType: {
    type: String,
    default: 'plant',
    validator: (value) => ['plant', 'fungi', 'algae', 'all'].includes(value)
  }
})

const { t, locale } = useI18n()

// Hero image path
const heroImage = '/@herbapedia/data/media/images/banners/tcm-banner.jpg'

// Get species based on source type
const allSpecies = computed(() => dataset.getSpeciesByType(props.sourceType))
const speciesWithPreparations = computed(() => {
  switch (props.sourceType) {
    case 'fungi':
      return dataset.getFungiWithPreparations()
    case 'algae':
      return dataset.getAlgaeWithPreparations()
    default:
      return dataset.getPlantsWithPreparations()
  }
})

// Get title based on source type
const pageTitle = computed(() => {
  switch (props.sourceType) {
    case 'fungi':
      return t('sources.fungi')
    case 'algae':
      return t('sources.algae')
    default:
      return t('plants.title')
  }
})

// Get breadcrumb key based on source type
const breadcrumbKey = computed(() => {
  switch (props.sourceType) {
    case 'fungi':
      return 'sources.fungi'
    case 'algae':
      return 'sources.algae'
    default:
      return 'sources.botanical'
  }
})

// Get route path based on source type
const basePath = computed(() => {
  switch (props.sourceType) {
    case 'fungi':
      return '/sources/fungi'
    case 'algae':
      return '/sources/algae'
    default:
      return '/sources/botanical'
  }
})

// Search and filter state
const searchQuery = ref('')
const filterMode = ref('with-preparations') // Default to showing species with preparations

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Filtered species
const filteredPlants = computed(() => {
  let species = filterMode.value === 'with-preparations'
    ? speciesWithPreparations.value
    : allSpecies.value.map(s => ({ plant: s }))

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    species = species.filter(item => {
      const plant = item.plant || item
      const sciMatch = plant.scientificName?.toLowerCase().includes(query)
      const commonMatch = plant.commonName && (
        plant.commonName.en?.toLowerCase().includes(query) ||
        plant.commonName['zh-Hant']?.includes(searchQuery.value) ||
        plant.commonName['zh-Hans']?.includes(searchQuery.value)
      )
      const familyMatch = plant.family?.toLowerCase().includes(query)
      return sciMatch || commonMatch || familyMatch
    })
  }

  return species
})

// Helper functions
function getSlug(plant) {
  if (!plant?.['@id']) return ''
  const parts = plant['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function formatImagePath(img) {
  if (!img) return null
  return img.startsWith('/@herbapedia') ? img : `/${img}`
}

function getPlantImage(plant) {
  return formatImagePath(plant?.image)
}

function getCommonName(plant) {
  if (!plant?.commonName) return null
  return plant.commonName[locale.value] ||
         plant.commonName['en'] ||
         plant.commonName['zh-Hant']
}

function handleImageError(event) {
  event.target.style.display = 'none'
}
</script>

<style scoped>
.plants-view {
  min-height: calc(100vh - var(--header-height));
}

/* Hero Banner */
.plants-hero {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: var(--spacing-2xl);
}

.plants-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.plants-hero__bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plants-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34, 139, 34, 0.85), rgba(0, 100, 0, 0.75));
}

.plants-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--color-text-inverse);
}

.plants-hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-inverse);
}

.plants-hero__subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto var(--spacing-lg);
}

.plants-hero__search {
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
.plants-filter-tabs {
  display: flex;
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
.plants-results {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* Plants Grid */
.plants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.plant-card {
  display: block;
  text-decoration: none;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) and (pointer: fine) {
  .plant-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }

  .plant-card:hover .plant-card__image {
    transform: scale(1.05);
  }
}

.plant-card:active {
  transform: scale(0.98);
}

.plant-card__image-wrapper {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--color-background);
}

.plant-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.plant-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
}

.plant-card__placeholder svg {
  width: 48px;
  height: 48px;
}

.plant-card__badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
}

.plant-card__content {
  padding: var(--spacing-md);
}

.plant-card__scientific {
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  font-style: italic;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs);
}

.plant-card__common {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
}

.plant-card__family {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin: 0;
}

/* Empty state */
.plants-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 640px) {
  .plants-hero {
    height: 240px;
  }

  .plants-hero__title {
    font-size: var(--font-size-3xl);
  }

  .plants-filter-tabs {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .plants-grid {
    grid-template-columns: 1fr;
  }
}
</style>
