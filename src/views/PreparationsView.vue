<template>
  <div class="preparations-view">
    <!-- Hero Banner -->
    <section class="preparations-hero">
      <div class="preparations-hero__background">
        <img
          :src="heroImage"
          alt=""
          class="preparations-hero__bg-image"
          @error="handleImageError"
        />
        <div class="preparations-hero__overlay"></div>
      </div>
      <div class="container preparations-hero__content">
        <h1 class="preparations-hero__title">{{ t('nav.preparations') || 'Preparations' }}</h1>
        <p class="preparations-hero__subtitle">
          {{ t('preparations.browseCount', { count: allPreparations.length }) }}
        </p>
        <!-- Search Bar -->
        <div class="preparations-hero__search">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref="searchInput"
              v-model="filters.search"
              type="text"
              class="search-input"
              :placeholder="t('preparations.searchPlaceholder')"
              @input="handleSearch"
            />
            <button
              v-if="filters.search"
              class="search-clear"
              @click="clearSearch"
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
      <div class="preparations-layout">
        <!-- Filter Sidebar -->
        <aside class="filter-sidebar" :class="{ 'filter-sidebar--open': mobileFiltersOpen }">
          <div class="filter-sidebar__header">
            <h3 class="filter-sidebar__title">{{ t('preparations.filters') }}</h3>
            <button
              v-if="hasActiveFilters"
              class="filter-sidebar__clear"
              @click="handleClearFilters"
            >
              {{ t('preparations.clearAll') }}
            </button>
          </div>

          <!-- System Profile Filter -->
          <div class="filter-group">
            <h4 class="filter-group__title">{{ t('preparations.systemProfiles') }}</h4>
            <label class="filter-checkbox">
              <input type="checkbox" v-model="filters.system.tcm" @change="handleFilterChange" />
              <span class="filter-checkbox__label">TCM ({{ tcmCount }})</span>
            </label>
            <label class="filter-checkbox">
              <input type="checkbox" v-model="filters.system.western" @change="handleFilterChange" />
              <span class="filter-checkbox__label">Western ({{ westernCount }})</span>
            </label>
            <label class="filter-checkbox">
              <input type="checkbox" v-model="filters.system.ayurveda" @change="handleFilterChange" />
              <span class="filter-checkbox__label">Ayurveda ({{ ayurvedaCount }})</span>
            </label>
          </div>

          <!-- TCM Filters -->
          <div class="filter-group">
            <h4 class="filter-group__title">{{ t('preparations.tcmProperties') }}</h4>

            <div class="filter-select">
              <label>{{ t('tcm.nature') }}</label>
              <select v-model="filters.tcm.nature" @change="handleFilterChange">
                <option :value="null">{{ t('preparations.all') }}</option>
                <option v-for="nature in tcmNatures" :key="nature.value" :value="nature.value">
                  {{ nature.label }}
                </option>
              </select>
            </div>

            <div class="filter-select">
              <label>{{ t('tcm.flavor') }}</label>
              <select v-model="filters.tcm.flavor" @change="handleFilterChange">
                <option :value="null">{{ t('preparations.all') }}</option>
                <option v-for="flavor in tcmFlavors" :key="flavor.value" :value="flavor.value">
                  {{ flavor.label }}
                </option>
              </select>
            </div>

            <div class="filter-select">
              <label>{{ t('tcm.meridian') }}</label>
              <select v-model="filters.tcm.meridian" @change="handleFilterChange">
                <option :value="null">{{ t('preparations.all') }}</option>
                <option v-for="meridian in tcmMeridians" :key="meridian.value" :value="meridian.value">
                  {{ meridian.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Western Filters -->
          <div class="filter-group">
            <h4 class="filter-group__title">{{ t('preparations.westernProperties') }}</h4>

            <div class="filter-select">
              <label>{{ t('western.actions') }}</label>
              <select v-model="filters.western.action" @change="handleFilterChange">
                <option :value="null">{{ t('preparations.all') }}</option>
                <option v-for="action in westernActions" :key="action.value" :value="action.value">
                  {{ action.label }}
                </option>
              </select>
            </div>

            <div class="filter-select">
              <label>{{ t('western.organAffinities') }}</label>
              <select v-model="filters.western.organ" @change="handleFilterChange">
                <option :value="null">{{ t('preparations.all') }}</option>
                <option v-for="organ in westernOrgans" :key="organ.value" :value="organ.value">
                  {{ organ.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Mobile close button -->
          <button class="filter-sidebar__close" @click="mobileFiltersOpen = false">
            {{ t('preparations.applyFilters') }}
          </button>
        </aside>

        <!-- Mobile filter toggle -->
        <button class="mobile-filter-toggle" @click="mobileFiltersOpen = !mobileFiltersOpen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 21v-7m0-4V3m0 0l4 4M4 3L0 7m20 18v-7m0-4V3m0 0l4 4m-4-4l-4 4"/>
          </svg>
          {{ t('preparations.filters') }}
          <span v-if="activeFilterCount" class="mobile-filter-toggle__count">{{ activeFilterCount }}</span>
        </button>

        <!-- Preparations Grid -->
        <main class="preparations-main">
          <div class="preparations-results">
            <span v-if="filteredPreparations.length !== allPreparations.length">
              {{ t('preparations.showingResults', { count: filteredPreparations.length, total: allPreparations.length }) }}
            </span>
          </div>

          <div class="preparations-grid">
            <PreparationCard
              v-for="prep in filteredPreparations"
              :key="getSlug(prep)"
              :to="localePath(`/preparations/${getSlug(prep)}`)"
              :title="getPrepName(prep)"
              :common-name="getCommonName(prep)"
              :scientific-name="getScientificName(prep)"
              :image="getImage(prep)"
              :has-t-c-m="!!prep.hasTCMProfile"
              :has-western="!!prep.hasWesternProfile"
              :has-ayurveda="!!prep.hasAyurvedaProfile"
            />
          </div>

          <div v-if="filteredPreparations.length === 0" class="preparations-empty">
            <p>{{ t('preparations.noResults') }}</p>
            <button v-if="hasActiveFilters" class="preparations-empty__clear" @click="handleClearFilters">
              {{ t('preparations.clearAll') }}
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PreparationCard from '@/components/ui/PreparationCard.vue'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { useAllPreparations, useSourcePlant, usePreparationLocalizer } from '@/composables/useHerbData'
import { useFilters, useFilterOptions } from '@/composables/useFilters'

const { t, locale } = useI18n()
const route = useRoute()

// Hero image path
const heroImage = '/@herbapedia/data/media/images/banners/tcm-banner.jpg'

// Get all preparations
const allPreparations = useAllPreparations()
const localizer = usePreparationLocalizer()

// Filter system
const { filters, initFromUrl, updateUrl, clearFilters, hasActiveFilters, applyFilters } = useFilters()
const { tcmNatures, tcmFlavors, tcmMeridians, westernActions, westernOrgans } = useFilterOptions()

// Mobile filter sidebar state
const mobileFiltersOpen = ref(false)

// Initialize filters from URL on mount
onMounted(() => {
  initFromUrl()
})

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Counts for system profile badges
const tcmCount = computed(() => allPreparations.value.filter(p => p.hasTCMProfile).length)
const westernCount = computed(() => allPreparations.value.filter(p => p.hasWesternProfile).length)
const ayurvedaCount = computed(() => allPreparations.value.filter(p => p.hasAyurvedaProfile).length)

// Active filter count
const activeFilterCount = computed(() => {
  let count = 0
  if (filters.system.tcm) count++
  if (filters.system.western) count++
  if (filters.system.ayurveda) count++
  if (filters.tcm.nature) count++
  if (filters.tcm.flavor) count++
  if (filters.tcm.meridian) count++
  if (filters.tcm.category) count++
  if (filters.western.action) count++
  if (filters.western.organ) count++
  return count
})

// Filtered preparations
const filteredPreparations = computed(() => {
  return applyFilters(allPreparations.value)
})

// Helper functions
function getSlug(prep) {
  if (!prep?.['@id']) return ''
  const parts = prep['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getPrepName(prep) {
  return localizer.getName(prep) || getSlug(prep)
}

function getCommonName(prep) {
  const slug = getSlug(prep)
  const plant = useSourcePlant(slug)
  return plant.value?.commonName?.[locale.value] || plant.value?.commonName?.en || null
}

function formatImagePath(img) {
  if (!img) return null
  return img.startsWith('/@herbapedia') ? img : `/${img}`
}

function getScientificName(prep) {
  const slug = getSlug(prep)
  const plant = useSourcePlant(slug)
  return plant.value?.scientificName || null
}

function getImage(prep) {
  const slug = getSlug(prep)
  const plant = useSourcePlant(slug)
  return formatImagePath(plant.value?.image)
}

// Event handlers
function handleSearch() {
  updateUrl()
}

function clearSearch() {
  filters.search = ''
  updateUrl()
}

function handleFilterChange() {
  updateUrl()
}

function handleClearFilters() {
  clearFilters()
}

function handleImageError(event) {
  event.target.style.display = 'none'
}
</script>

<style scoped>
.preparations-view {
  min-height: calc(100vh - var(--header-height));
}

/* Hero Banner */
.preparations-hero {
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: var(--spacing-2xl);
}

.preparations-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.preparations-hero__bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preparations-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34, 139, 34, 0.85), rgba(0, 100, 0, 0.75));
}

.preparations-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--color-text-inverse);
}

.preparations-hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-inverse);
}

.preparations-hero__subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto var(--spacing-lg);
}

.preparations-hero__search {
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

/* Layout */
.preparations-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

/* Filter Sidebar */
.filter-sidebar {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-lg));
  max-height: calc(100vh - var(--header-height) - var(--spacing-2xl));
  overflow-y: auto;
  border: 1px solid var(--color-border);
}

.filter-sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.filter-sidebar__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.filter-sidebar__clear {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.filter-sidebar__clear:hover {
  text-decoration: underline;
}

.filter-group {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.filter-group:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-group__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-sm);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  cursor: pointer;
}

.filter-checkbox__label {
  font-size: var(--font-size-sm);
}

.filter-select {
  margin-bottom: var(--spacing-sm);
}

.filter-select label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xs);
}

.filter-select select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-background);
  color: var(--color-text);
}

.filter-sidebar__close {
  display: none;
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  margin-top: var(--spacing-lg);
}

/* Mobile Filter Toggle */
.mobile-filter-toggle {
  display: none;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  margin-bottom: var(--spacing-md);
}

.mobile-filter-toggle svg {
  width: 18px;
  height: 18px;
}

.mobile-filter-toggle__count {
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

/* Preparations Main */
.preparations-main {
  min-height: 400px;
}

.preparations-results {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.preparations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.preparations-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}

.preparations-empty__clear {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .preparations-hero {
    height: 280px;
  }

  .preparations-hero__title {
    font-size: var(--font-size-3xl);
  }

  .preparations-layout {
    grid-template-columns: 1fr;
  }

  .mobile-filter-toggle {
    display: flex;
  }

  .filter-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    max-height: none;
    border-radius: 0;
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
  }

  .filter-sidebar--open {
    transform: translateX(0);
  }

  .filter-sidebar__close {
    display: block;
  }
}
</style>
