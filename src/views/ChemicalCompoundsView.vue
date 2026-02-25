<template>
  <div class="compounds-view">
    <!-- Hero Banner -->
    <section class="compounds-hero">
      <div class="compounds-hero__background">
        <div class="compounds-hero__overlay"></div>
      </div>
      <div class="container compounds-hero__content">
        <h1 class="compounds-hero__title">{{ t('compounds.title') }}</h1>
        <p class="compounds-hero__subtitle">
          {{ t('compounds.browseCount', { count: allCompounds.length }) }}
        </p>
        <!-- Search Bar -->
        <div class="compounds-hero__search">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              :placeholder="t('compounds.searchPlaceholder')"
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
        <span>{{ t('compounds.title') }}</span>
      </nav>

      <!-- Results info -->
      <div class="compounds-results">
        <span v-if="searchQuery">
          {{ t('compounds.showingResults', { count: filteredCompounds.length, query: searchQuery }) }}
        </span>
      </div>

      <!-- Compounds Grid -->
      <div class="compounds-grid">
        <router-link
          v-for="compound in filteredCompounds"
          :key="getSlug(compound)"
          :to="localePath(`/compounds/${getSlug(compound)}`)"
          class="compound-card"
        >
          <div class="compound-card__icon">⚗️</div>
          <div class="compound-card__content">
            <h3 class="compound-card__name">{{ getCompoundName(compound) }}</h3>
            <p v-if="compound.molecularFormula" class="compound-card__formula">
              {{ compound.molecularFormula }}
            </p>
            <p v-if="getCompoundDescription(compound)" class="compound-card__description">
              {{ truncate(getCompoundDescription(compound), 100) }}
            </p>
          </div>
          <span class="compound-card__arrow">→</span>
        </router-link>
      </div>

      <div v-if="filteredCompounds.length === 0" class="compounds-empty">
        <p>{{ t('compounds.noResults') }}</p>
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

// Get all chemical compounds
const allCompounds = computed(() => dataset.getAllChemicals())

// Search state
const searchQuery = ref('')

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Filtered compounds
const filteredCompounds = computed(() => {
  if (!searchQuery.value) {
    return allCompounds.value
  }

  const query = searchQuery.value.toLowerCase()
  return allCompounds.value.filter(compound => {
    const nameMatch = getCompoundName(compound)?.toLowerCase().includes(query)
    const formulaMatch = compound.molecularFormula?.toLowerCase().includes(query)
    const descMatch = getCompoundDescription(compound)?.toLowerCase().includes(query)
    return nameMatch || formulaMatch || descMatch
  })
})

// Helper functions
function getSlug(compound) {
  if (!compound?.['@id']) return ''
  const parts = compound['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getCompoundName(compound) {
  if (!compound?.name) return getSlug(compound)
  return compound.name[locale.value] ||
         compound.name['en'] ||
         compound.name['zh-Hant'] ||
         getSlug(compound)
}

function getCompoundDescription(compound) {
  if (!compound?.description) return null
  return compound.description[locale.value] ||
         compound.description['en'] ||
         compound.description['zh-Hant']
}

function truncate(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.compounds-view {
  min-height: calc(100vh - var(--header-height));
}

/* Hero Banner */
.compounds-hero {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: var(--spacing-2xl);
}

.compounds-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
}

.compounds-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.9), rgba(168, 85, 247, 0.85));
}

.compounds-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--color-text-inverse);
}

.compounds-hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-inverse);
}

.compounds-hero__subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto var(--spacing-lg);
}

.compounds-hero__search {
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

/* Results info */
.compounds-results {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* Compounds Grid */
.compounds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.compound-card {
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

.compound-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: #7c3aed;
}

.compound-card__icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-radius: var(--radius-md);
}

.compound-card__content {
  flex: 1;
  min-width: 0;
}

.compound-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs);
}

.compound-card__formula {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  display: inline-block;
  margin: 0 0 var(--spacing-sm);
}

.compound-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
  line-height: var(--line-height-relaxed);
}

.compound-card__arrow {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.compound-card:hover .compound-card__arrow {
  opacity: 1;
}

/* Empty state */
.compounds-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 640px) {
  .compounds-hero {
    height: 240px;
  }

  .compounds-hero__title {
    font-size: var(--font-size-3xl);
  }

  .compounds-grid {
    grid-template-columns: 1fr;
  }
}
</style>
