<template>
  <div class="plant-part-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <router-link :to="localePath('/sources/parts')">{{ t('plantParts.title') }}</router-link>
        <span>/</span>
        <span>{{ partName }}</span>
      </nav>

      <article v-if="part" class="plant-part-detail">
        <!-- Header -->
        <header class="plant-part-detail__header">
          <div class="plant-part-detail__icon">{{ getPartIcon() }}</div>
          <div class="plant-part-detail__meta">
            <span class="plant-part-detail__type-badge">{{ t('plantParts.part') }}</span>
            <h1 class="plant-part-detail__name">{{ partName }}</h1>
            <p v-if="speciesName" class="plant-part-detail__species">
              {{ t('plantParts.partOf') }}: {{ speciesName }}
            </p>
          </div>
        </header>

        <!-- Description -->
        <section v-if="description" class="plant-part-detail__section">
          <h2 class="section-title">{{ t('sections.description') }}</h2>
          <div class="prose">
            <p>{{ description }}</p>
          </div>
        </section>

        <!-- Link to Species -->
        <section v-if="species" class="plant-part-detail__section">
          <h2 class="section-title">
            <span class="section-title__icon">🌿</span>
            {{ t('plantParts.species') }}
          </h2>
          <router-link :to="localePath(`/sources/botanical/${getSlug(species)}`)" class="species-link">
            <div class="species-link__content">
              <h3 class="species-link__name">{{ species.scientificName }}</h3>
              <p v-if="getSpeciesCommonName()" class="species-link__common">{{ getSpeciesCommonName() }}</p>
            </div>
            <span class="species-link__arrow">→</span>
          </router-link>
        </section>

        <!-- Preparations using this part -->
        <section v-if="preparations.length > 0" class="plant-part-detail__section plant-part-detail__preparations">
          <h2 class="section-title">
            <span class="section-title__icon">💊</span>
            {{ t('plantParts.preparationsFromPart') }}
            <span class="section-title__count">({{ preparations.length }})</span>
          </h2>

          <div class="preparations-grid">
            <router-link
              v-for="prep in preparations"
              :key="getPrepSlug(prep)"
              :to="localePath(`/preparations/${getPrepSlug(prep)}`)"
              class="preparation-card-mini"
            >
              <div class="preparation-card-mini__image-wrapper">
                <img
                  v-if="getPrepImage(prep)"
                  :src="getPrepImage(prep)"
                  :alt="getPrepName(prep)"
                  class="preparation-card-mini__image"
                />
                <div v-else class="preparation-card-mini__placeholder">
                  <span>💊</span>
                </div>
              </div>
              <div class="preparation-card-mini__content">
                <h4 class="preparation-card-mini__name">{{ getPrepName(prep) }}</h4>
                <p v-if="prep.form" class="preparation-card-mini__form">{{ prep.form }}</p>
                <div class="preparation-card-mini__badges">
                  <span v-if="prep.hasTCMProfile" class="prep-badge prep-badge--tcm">TCM</span>
                  <span v-if="prep.hasWesternProfile" class="prep-badge prep-badge--western">W</span>
                </div>
              </div>
              <span class="preparation-card-mini__arrow">→</span>
            </router-link>
          </div>
        </section>

        <!-- Disclaimer -->
        <aside class="plant-part-detail__disclaimer">
          <p>
            <strong>{{ t('disclaimer.title') }}:</strong> {{ t('disclaimer.text') }}
          </p>
        </aside>
      </article>

      <div v-else class="plant-part-detail__not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('plantParts.notFound') }}</p>
        <router-link :to="localePath('/sources/parts')" class="plant-part-detail__back-link">
          &larr; {{ t('plantParts.backToParts') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { dataset } from '@/api/dataset'
import { useSourcePlant } from '@/composables/useHerbData'

const route = useRoute()
const { t, locale } = useI18n()
const slug = computed(() => route.params.slug)

const part = ref(null)
const species = ref(null)
const preparations = ref([])

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Computed properties
const partName = computed(() => {
  if (!part.value?.name) return slug.value
  return part.value.name[locale.value] ||
         part.value.name['en'] ||
         part.value.name['zh-Hant'] ||
         slug.value
})

const description = computed(() => {
  if (!part.value?.description) return null
  return part.value.description[locale.value] ||
         part.value.description['en'] ||
         part.value.description['zh-Hant']
})

const speciesName = computed(() => {
  if (!species.value) return null
  return species.value.scientificName
})

// Get part icon based on type
function getPartIcon() {
  const partSlug = slug.value.toLowerCase()
  if (partSlug.includes('root')) return '🫚'
  if (partSlug.includes('rhizome')) return '🌿'
  if (partSlug.includes('leaf')) return '🍃'
  if (partSlug.includes('flower')) return '🌸'
  if (partSlug.includes('fruit')) return '🍒'
  if (partSlug.includes('seed')) return '🌱'
  if (partSlug.includes('bulb')) return '🧅'
  if (partSlug.includes('bark')) return '🪵'
  if (partSlug.includes('stem')) return '🎋'
  return '🌿'
}

function getSpeciesCommonName() {
  if (!species.value?.commonName) return null
  return species.value.commonName[locale.value] ||
         species.value.commonName['en'] ||
         species.value.commonName['zh-Hant']
}

// Helper functions
function getSlug(entity) {
  if (!entity?.['@id']) return ''
  const parts = entity['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getPrepSlug(prep) {
  return getSlug(prep)
}

function getPrepName(prep) {
  if (!prep?.name) return getPrepSlug(prep)
  return prep.name[locale.value] ||
         prep.name['en'] ||
         prep.name['zh-Hant'] ||
         getPrepSlug(prep)
}

function getPrepImage(prep) {
  // Image comes from source plant, not from preparation
  const s = getPrepSlug(prep)
  const plant = useSourcePlant(s)
  return plant.value?.image || null
}

// Watch slug changes and load data
watch(slug, (newSlug) => {
  if (newSlug) {
    // Get part data
    part.value = dataset.getPlantPart(newSlug)

    if (part.value?.partOf) {
      // Get linked species
      const speciesSlug = part.value.partOf['@id'].split('/').pop()
      species.value = dataset.getPlantSpecies(speciesSlug)

      // Get preparations derived from this part
      preparations.value = dataset.getPreparationsByPlant(speciesSlug)
    }
  }
}, { immediate: true })
</script>

<style scoped>
.plant-part-detail-view {
  padding: var(--spacing-2xl) 0;
  min-height: calc(--100vh - var(--header-height));
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

/* Header */
.plant-part-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.plant-part-detail__icon {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: rgba(5, 150, 105, 0.1);
  border-radius: var(--radius-lg);
}

.plant-part-detail__meta {
  flex: 1;
}

.plant-part-detail__type-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  padding: 2px 8px;
  background: rgba(5, 150, 105, 0.15);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.plant-part-detail__name {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-sm);
}

.plant-part-detail__species {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
}

/* Sections */
.plant-part-detail__section {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary);
}

.section-title__icon {
  font-size: var(--font-size-base);
  opacity: 0.7;
}

.section-title__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  font-weight: normal;
}

/* Species Link */
.species-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border);
}

.species-link:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.species-link__name {
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  font-style: italic;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs);
}

.species-link__common {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

.species-link__arrow {
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
}

/* Preparations Grid */
.preparations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.preparation-card-mini {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.preparation-card-mini:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.preparation-card-mini__image-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface);
}

.preparation-card-mini__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preparation-card-mini__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
}

.preparation-card-mini__content {
  flex: 1;
  min-width: 0;
}

.preparation-card-mini__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preparation-card-mini__form {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin: 0 0 2px;
}

.preparation-card-mini__badges {
  display: flex;
  gap: 4px;
}

.prep-badge {
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.prep-badge--tcm {
  background: rgba(34, 139, 34, 0.15);
  color: var(--color-primary);
}

.prep-badge--western {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.preparation-card-mini__arrow {
  flex-shrink: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.preparation-card-mini:hover .preparation-card-mini__arrow {
  opacity: 1;
}

/* Disclaimer */
.plant-part-detail__disclaimer {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.plant-part-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

/* Not Found */
.plant-part-detail__not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.plant-part-detail__back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .plant-part-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .plant-part-detail__icon {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }

  .preparations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
