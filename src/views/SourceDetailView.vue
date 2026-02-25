<template>
  <div class="source-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <router-link :to="localePath('/sources')">{{ t('nav.sources') }}</router-link>
        <span>/</span>
        <router-link :to="localePath(`/sources/${sourceType}`)">{{ sourceTypeLabel }}</router-link>
        <span>/</span>
        <span>{{ sourceName }}</span>
      </nav>

      <article v-if="source" class="source-detail">
        <!-- Header -->
        <header class="source-detail__header" :class="`source-detail__header--${sourceType}`">
          <div class="source-detail__image-wrapper">
            <img
              v-if="source.image"
              :src="source.image"
              :alt="sourceName"
              class="source-detail__image"
            />
            <div v-else class="source-detail__placeholder">
              <span>{{ sourceIcon }}</span>
            </div>
          </div>

          <div class="source-detail__meta">
            <span class="source-detail__type-badge" :class="`type-badge--${sourceType}`">
              {{ sourceTypeBadge }}
            </span>
            <h1 class="source-detail__name">{{ sourceName }}</h1>
            <p v-if="sourceScientificName" class="source-detail__scientific">
              {{ sourceScientificName }}
            </p>
            <p v-if="source.animalPart" class="source-detail__part">
              {{ t('sources.animalPart') }}: {{ source.animalPart }}
            </p>
            <p v-if="source.chemicalFormula" class="source-detail__formula">
              {{ source.chemicalFormula }}
            </p>
          </div>
        </header>

        <!-- Preparations from this source -->
        <section class="source-detail__section source-detail__preparations">
          <h2 class="section-title">
            <span class="section-title__icon">→</span>
            {{ t('sources.preparationsFromSource') }}
            <span class="section-title__count">({{ preparations.length }})</span>
          </h2>

          <div v-if="preparations.length > 0" class="preparations-grid">
            <router-link
              v-for="prep in preparations"
              :key="getSlug(prep)"
              :to="localePath(`/preparations/${getSlug(prep)}`)"
              class="preparation-card-mini"
            >
              <div class="preparation-card-mini__image-wrapper">
                <img
                  v-if="getImage(prep)"
                  :src="getImage(prep)"
                  :alt="getPrepName(prep)"
                  class="preparation-card-mini__image"
                />
                <div v-else class="preparation-card-mini__placeholder">
                  <span>🌿</span>
                </div>
              </div>
              <div class="preparation-card-mini__content">
                <h4 class="preparation-card-mini__name">{{ getPrepName(prep) }}</h4>
                <p v-if="getFormLabel(prep)" class="preparation-card-mini__form">{{ getFormLabel(prep) }}</p>
                <div class="preparation-card-mini__badges">
                  <span v-if="prep.hasTCMProfile" class="prep-badge prep-badge--tcm">TCM</span>
                  <span v-if="prep.hasWesternProfile" class="prep-badge prep-badge--western">W</span>
                  <span v-if="prep.hasAyurvedaProfile" class="prep-badge prep-badge--ayurveda">Ayu</span>
                </div>
              </div>
              <span class="preparation-card-mini__arrow">→</span>
            </router-link>
          </div>

          <div v-else class="preparations-empty">
            <p>{{ t('sources.noPreparations') }}</p>
          </div>
        </section>

        <!-- Description -->
        <section v-if="description" class="source-detail__section">
          <h2 class="section-title">{{ t('sources.description') }}</h2>
          <div class="prose">
            <p>{{ description }}</p>
          </div>
        </section>

        <!-- Source-specific properties -->
        <section v-if="sourceType === 'zoological' && source.animalName" class="source-detail__section">
          <h2 class="section-title">{{ t('sources.animalOrigin') }}</h2>
          <dl class="properties-list">
            <dt>{{ t('sources.animalName') }}</dt>
            <dd>{{ getAnimalName() }}</dd>
            <dt v-if="source.animalScientificName">{{ t('sources.animalScientificName') }}</dt>
            <dd v-if="source.animalScientificName">{{ source.animalScientificName }}</dd>
          </dl>
        </section>

        <section v-if="sourceType === 'chemical' && (source.chemicalFormula || source.isSynthesized)" class="source-detail__section">
          <h2 class="section-title">{{ t('sources.chemicalProperties') }}</h2>
          <dl class="properties-list">
            <dt v-if="source.chemicalFormula">{{ t('sources.chemicalFormula') }}</dt>
            <dd v-if="source.chemicalFormula"><code>{{ source.chemicalFormula }}</code></dd>
            <dt v-if="source.isSynthesized !== undefined">{{ t('sources.synthesis') }}</dt>
            <dd v-if="source.isSynthesized !== undefined">
              {{ source.isSynthesized ? t('sources.synthesized') : t('sources.natural') }}
            </dd>
          </dl>
        </section>

        <!-- External Links -->
        <section v-if="hasExternalLinks" class="source-detail__section source-detail__links">
          <h2 class="section-title">{{ t('links.title') }}</h2>
          <div class="external-links">
            <a
              v-for="link in externalLinks"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="external-link"
            >
              <span class="external-link__icon">{{ link.icon }}</span>
              {{ link.label }}
              <span class="external-link__arrow">↗</span>
            </a>
          </div>
        </section>

        <!-- Disclaimer -->
        <aside class="source-detail__disclaimer">
          <p>
            <strong>{{ t('disclaimer.title') }}:</strong> {{ t('disclaimer.text') }}
          </p>
        </aside>
      </article>

      <div v-else class="source-not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('sources.sourceNotFound') }}</p>
        <router-link :to="localePath('/sources')" class="back-link">
          &larr; {{ t('sources.backToSources') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { usePreparationLocalizer, useSourcePlant } from '@/composables/useHerbData'

const route = useRoute()
const { t, locale } = useI18n()

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Determine source type from route
const sourceType = computed(() => {
  const path = route.path
  if (path.includes('/sources/zoological/')) return 'zoological'
  if (path.includes('/sources/mineral/')) return 'mineral'
  if (path.includes('/sources/chemical/')) return 'chemical'
  return 'unknown'
})

// Source type display info
const sourceTypeInfo = {
  zoological: {
    icon: '🦐',
    label: t('sources.zoological'),
    badge: 'ZoologicalSource'
  },
  mineral: {
    icon: '💎',
    label: t('sources.mineral'),
    badge: 'MineralSource'
  },
  chemical: {
    icon: '⚗️',
    label: t('sources.chemical'),
    badge: 'ChemicalSource'
  }
}

const sourceIcon = computed(() => sourceTypeInfo[sourceType.value]?.icon || '📦')
const sourceTypeLabel = computed(() => sourceTypeInfo[sourceType.value]?.label || sourceType.value)
const sourceTypeBadge = computed(() => sourceTypeInfo[sourceType.value]?.badge || sourceType.value)

// Load source based on type
const source = ref(null)

watch([() => props.slug, sourceType], ([slug, type]) => {
  if (slug && type) {
    if (type === 'zoological') {
      source.value = dataset.getZoologicalSource(slug)
    } else if (type === 'mineral') {
      source.value = dataset.getMineralSource(slug)
    } else if (type === 'chemical') {
      source.value = dataset.getChemicalSource(slug)
    }
  }
}, { immediate: true })

// Source name
const sourceName = computed(() => {
  if (!source.value?.name) return props.slug
  return source.value.name[locale.value] ||
         source.value.name.en ||
         source.value.name['zh-Hant'] ||
         props.slug
})

const sourceScientificName = computed(() => {
  if (sourceType.value === 'zoological') {
    return source.value?.animalScientificName || null
  }
  return null // minerals and chemicals use formula instead
})

const description = computed(() => {
  if (!source.value?.description) return null
  return source.value.description[locale.value] ||
         source.value.description.en ||
         source.value.description['zh-Hant'] ||
         null
})

function getAnimalName() {
  if (!source.value?.animalName) return null
  return source.value.animalName[locale.value] ||
         source.value.animalName.en ||
         source.value.animalName['zh-Hant'] ||
         null
}

// Preparations from this source
const preparations = computed(() => {
  if (!source.value) return []
  // Find preparations that derive from this source
  const allPreps = dataset.getAllPreparations()
  const sourceId = source.value['@id']

  return allPreps.filter(prep => {
    if (!prep.derivedFrom) return false
    return prep.derivedFrom.some(ref => {
      // Match by @id or by slug
      const refId = ref['@id'] || ref
      return refId === sourceId || refId.includes(props.slug)
    })
  })
})

// External links
const externalLinks = computed(() => {
  const links = []

  if (source.value?.gbifID) {
    links.push({
      url: `https://www.gbif.org/species/${source.value.gbifID}`,
      label: t('links.gbif'),
      icon: '🌍'
    })
  }

  if (source.value?.wikidataID) {
    links.push({
      url: `https://www.wikidata.org/entity/${source.value.wikidataID}`,
      label: t('links.wikidata'),
      icon: '📊'
    })
  }

  return links
})

const hasExternalLinks = computed(() => externalLinks.value.length > 0)

// Helper functions
function getSlug(prep) {
  if (!prep?.['@id']) return ''
  const parts = prep['@id'].split('/')
  return parts[parts.length - 1] || ''
}

const localizer = usePreparationLocalizer()

function getPrepName(prep) {
  return localizer.getName(prep) || getSlug(prep)
}

function getImage(prep) {
  // Image comes from source plant, not from preparation
  const slug = getSlug(prep)
  const plant = useSourcePlant(slug)
  const img = plant.value?.image
  if (!img) return null
  return img.startsWith('/@herbapedia') ? img : `/${img}`
}

function getFormLabel(prep) {
  if (!prep?.form) return null
  const formId = prep.form['@id'] || prep.form
  if (!formId) return null
  // Extract form name from @id
  const slug = formId.split('/').pop()
  // Get form from dataset
  const form = dataset.getHerbalForm(slug)
  if (form?.name) {
    return form.name[locale.value] || form.name.en || slug
  }
  // Fallback to formatted slug
  return slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
</script>

<style scoped>
.source-detail-view {
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

/* Header */
.source-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-xl);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-border);
}

.source-detail__header--zoological { border-left-color: #f97316; }
.source-detail__header--mineral { border-left-color: #8b5cf6; }
.source-detail__header--chemical { border-left-color: #06b6d4; }

.source-detail__image-wrapper {
  flex-shrink: 0;
  width: 180px;
  height: 180px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-background);
}

.source-detail__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.source-detail__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.source-detail__meta {
  flex: 1;
}

.source-detail__type-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-sm);
  background: var(--color-surface-alt);
}

.type-badge--zoological { background: rgba(249, 115, 22, 0.15); color: #c2410c; }
.type-badge--mineral { background: rgba(139, 92, 246, 0.15); color: #6b21a8; }
.type-badge--chemical { background: rgba(6, 182, 212, 0.15); color: #0e7490; }

.source-detail__name {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xs);
}

.source-detail__scientific {
  font-style: italic;
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-xs);
}

.source-detail__part,
.source-detail__formula {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: var(--spacing-xs) 0 0;
}

.source-detail__formula code {
  background: var(--color-surface-alt);
  padding: 0.1em 0.3em;
  border-radius: var(--radius-sm);
}

/* Sections */
.source-detail__section {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.section-title__icon {
  font-size: var(--font-size-base);
}

.section-title__count {
  font-weight: var(--font-weight-normal);
  color: var(--color-text-light);
}

/* Preparations Grid */
.preparations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
  transform: translateX(4px);
}

.preparation-card-mini__image-wrapper {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
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
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preparation-card-mini__form {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin: 0;
}

.preparation-card-mini__badges {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.prep-badge {
  font-size: 0.65rem;
  padding: 0.1em 0.4em;
  border-radius: var(--radius-full);
}

.prep-badge--tcm { background: rgba(34, 197, 94, 0.2); color: #166534; }
.prep-badge--western { background: rgba(59, 130, 246, 0.2); color: #1e40af; }
.prep-badge--ayurveda { background: rgba(249, 115, 22, 0.2); color: #c2410c; }

.preparation-card-mini__arrow {
  color: var(--color-text-light);
  font-size: var(--font-size-lg);
}

.preparations-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-light);
}

/* Properties List */
.properties-list {
  display: grid;
  gap: var(--spacing-sm);
}

.properties-list dt {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.properties-list dd {
  margin: 0 0 var(--spacing-sm);
}

/* External Links */
.external-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.external-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.external-link:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.external-link__icon {
  font-size: var(--font-size-lg);
}

.external-link__arrow {
  opacity: 0.5;
}

/* Disclaimer */
.source-detail__disclaimer {
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.source-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

/* Not Found */
.source-not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .source-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .source-detail__image-wrapper {
    width: 150px;
    height: 150px;
  }

  .preparations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
