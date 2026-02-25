<template>
  <div class="plant-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <router-link :to="localePath('/sources')">{{ t('nav.sources') }}</router-link>
        <span>/</span>
        <router-link :to="localePath(basePath)">{{ sourceTypeLabel }}</router-link>
        <span>/</span>
        <span>{{ plant?.scientificName || slug }}</span>
      </nav>

      <article v-if="plant" class="plant-detail">
        <!-- Header -->
        <header class="plant-detail__header">
          <div class="plant-detail__image-wrapper">
            <img
              v-if="plantImage && !imageError"
              :src="plantImage"
              :alt="plant.scientificName"
              class="plant-detail__image"
              @error="handleImageError"
            />
            <div v-else class="plant-detail__placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span class="plant-detail__placeholder-text">{{ t('plants.noImage') }}</span>
            </div>
            <!-- Image Attribution -->
            <div v-if="imageAttribution && plantImage && !imageError" class="plant-detail__attribution">
              <span v-if="imageAttribution.spdxId && imageAttribution.spdxId !== 'NONE'" class="attribution-license">
                <a v-if="imageAttribution.spdxUrl" :href="imageAttribution.spdxUrl" target="_blank" rel="noopener noreferrer">
                  {{ imageAttribution.spdxId }}
                </a>
                <span v-else>{{ imageAttribution.spdxId }}</span>
              </span>
              <span class="attribution-source">{{ imageAttribution.copyright }}</span>
            </div>
          </div>

          <div class="plant-detail__meta">
            <span class="plant-detail__type-badge">{{ t('plants.species') }}</span>
            <h1 class="plant-detail__scientific-name">{{ plant.scientificName }}</h1>
            <p v-if="commonName" class="plant-detail__common-name">{{ commonName }}</p>
            <div v-if="plant.family || plant.genus" class="plant-detail__taxonomy">
              <span v-if="plant.family">{{ t('plants.family') }}: {{ plant.family }}</span>
              <span v-if="plant.genus">{{ t('plants.genus') }}: {{ plant.genus }}</span>
            </div>
          </div>
        </header>

        <!-- Preparations from this plant -->
        <section class="plant-detail__section plant-detail__preparations">
          <h2 class="section-title">
            <span class="section-title__icon">→</span>
            {{ t('plants.preparationsFromPlant') }}
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
                <p v-if="prep.form" class="preparation-card-mini__form">{{ getFormLabel(prep) }}</p>
                <div class="preparation-card-mini__badges">
                  <span v-if="prep.hasTCMProfile" class="prep-badge prep-badge--tcm">TCM</span>
                  <span v-if="prep.hasWesternProfile" class="prep-badge prep-badge--western">W</span>
                </div>
              </div>
              <span class="preparation-card-mini__arrow">→</span>
            </router-link>
          </div>

          <div v-else class="preparations-empty">
            <p>{{ t('plants.noPreparations') }}</p>
          </div>
        </section>

        <!-- Botanical Description -->
        <section v-if="description" class="plant-detail__section">
          <h2 class="section-title">{{ t('plants.description') }}</h2>
          <div class="prose">
            <p>{{ description }}</p>
          </div>
        </section>

        <!-- Taxonomic Classification -->
        <section v-if="taxonomyDetails" class="plant-detail__section">
          <h2 class="section-title">{{ t('plants.taxonomy') }}</h2>
          <dl class="taxonomy-list">
            <div v-for="item in taxonomyDetails" :key="item.label" class="taxonomy-item">
              <dt class="taxonomy-item__label">{{ item.label }}</dt>
              <dd class="taxonomy-item__value">{{ item.value }}</dd>
            </div>
          </dl>
        </section>

        <!-- Distribution & Habitat -->
        <section v-if="origin || habitat || geographicalDistribution" class="plant-detail__section">
          <h2 class="section-title">{{ t('plants.distributionAndHabitat') }}</h2>

          <div v-if="origin" class="distribution-item">
            <h3 class="distribution-item__label">{{ t('plants.origin') }}</h3>
            <p class="distribution-item__value">{{ origin }}</p>
          </div>

          <div v-if="habitat" class="distribution-item">
            <h3 class="distribution-item__label">{{ t('plants.habitat') }}</h3>
            <p class="distribution-item__value">{{ habitat }}</p>
          </div>

          <div v-if="geographicalDistribution" class="distribution-item">
            <h3 class="distribution-item__label">{{ t('plants.distribution') }}</h3>
            <p class="distribution-item__value">{{ geographicalDistribution }}</p>
          </div>
        </section>

        <!-- Growth Characteristics -->
        <section v-if="growthCharacteristics || conservationStatusDisplay" class="plant-detail__section">
          <h2 class="section-title">{{ t('plants.characteristics') }}</h2>

          <dl v-if="growthCharacteristics" class="characteristics-list">
            <div v-for="char in growthCharacteristics" :key="char.label" class="characteristic-item">
              <dt class="characteristic-item__label">{{ char.label }}</dt>
              <dd class="characteristic-item__value">{{ char.value }}</dd>
            </div>
          </dl>

          <div v-if="conservationStatusDisplay" class="conservation-status">
            <span class="conservation-status__label">{{ t('plants.conservationStatus') }}:</span>
            <span :class="['conservation-status__badge', conservationStatusDisplay.class]">
              {{ conservationStatusDisplay.label }}
            </span>
          </div>
        </section>

        <!-- Chemical Compounds -->
        <section v-if="chemicalCompoundLabels.length > 0" class="plant-detail__section plant-detail__compounds">
          <h2 class="section-title">
            <span class="section-title__icon">⚗</span>
            {{ t('compounds.title') }}
          </h2>
          <div class="compounds-list">
            <span
              v-for="compound in chemicalCompoundLabels"
              :key="compound.id"
              class="compound-tag"
              :title="compound.description"
            >
              {{ compound.label }}
            </span>
          </div>
        </section>

        <!-- Plant Parts -->
        <section v-if="plantParts.length > 0" class="plant-detail__section plant-detail__parts">
          <h2 class="section-title">
            <span class="section-title__icon">🌿</span>
            {{ t('plants.parts') }}
          </h2>
          <div class="parts-list">
            <span v-for="part in plantParts" :key="part.slug" class="part-tag">
              {{ part.name }}
            </span>
          </div>
        </section>

        <!-- DNA Barcode -->
        <section v-if="hasDNABarcode" class="plant-detail__section plant-detail__dna">
          <h2 class="section-title">
            <span class="section-title__icon">🧬</span>
            {{ t('plants.dnaBarcode') }}
          </h2>
          <div class="dna-barcode-info">
            <div v-if="dnaBarcode.sequence && dnaBarcode.sequence.length > 0" class="dna-sequences">
              <div v-for="seq in dnaBarcode.sequence" :key="seq.region" class="dna-sequence">
                <h4 class="dna-sequence__region">{{ seq.region }}</h4>
                <p v-if="seq.length" class="dna-sequence__meta">
                  <span>Length: {{ seq.length }} bp</span>
                  <span v-if="seq.gcContent">GC: {{ seq.gcContent }}%</span>
                  <span v-if="seq.genbankAccession">GenBank: {{ seq.genbankAccession }}</span>
                </p>
                <p v-if="seq.sequence" class="dna-sequence__quality">
                  <span class="quality-badge" :class="`quality-badge--${seq.sequenceQuality}`">
                    {{ seq.sequenceQuality || 'unknown' }}
                  </span>
                </p>
              </div>
            </div>
            <div v-if="dnaBarcode.identificationConfidence" class="dna-confidence">
              <h4>{{ t('plants.identificationConfidence') }}</h4>
              <p>
                <span>Level: {{ dnaBarcode.identificationConfidence.level }}</span>
                <span v-if="dnaBarcode.identificationConfidence.confidence">
                  Confidence: {{ dnaBarcode.identificationConfidence.confidence }}%
                </span>
                <span v-if="dnaBarcode.identificationConfidence.method">
                  Method: {{ dnaBarcode.identificationConfidence.method }}
                </span>
              </p>
            </div>
            <div v-if="dnaBarcode.adulterantDetection?.canDetect?.length > 0" class="dna-adulterants">
              <h4>{{ t('plants.canDetectAdulterants') }}</h4>
              <ul class="adulterant-list">
                <li v-for="adulterant in dnaBarcode.adulterantDetection.canDetect" :key="adulterant">
                  {{ adulterant }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Chemical Profile -->
        <section v-if="hasChemicalProfile" class="plant-detail__section plant-detail__chemical">
          <h2 class="section-title">
            <span class="section-title__icon">⚗️</span>
            {{ t('plants.chemicalProfile') }}
          </h2>
          <div class="chemical-profile-info">
            <div v-if="chemicalProfile.totalVolatileOil" class="chemical-profile__total">
              <span class="chemical-profile__label">{{ t('plants.totalVolatileOil') }}:</span>
              <span class="chemical-profile__value">
                {{ chemicalProfile.totalVolatileOil.value }} {{ chemicalProfile.totalVolatileOil.unit }}
              </span>
            </div>
            <div v-if="chemicalProfile.analyticalMethod" class="chemical-profile__method">
              <span class="chemical-profile__label">{{ t('plants.analyticalMethod') }}:</span>
              <span class="chemical-profile__value">{{ chemicalProfile.analyticalMethod }}</span>
            </div>
            <div v-if="chemicalProfile.qualityGrade" class="chemical-profile__grade">
              <span class="chemical-profile__label">{{ t('plants.qualityGrade') }}:</span>
              <span class="chemical-profile__value">{{ chemicalProfile.qualityGrade }}</span>
            </div>
            <div v-if="chemicalProfile.hasComponent && chemicalProfile.hasComponent.length > 0" class="chemical-components">
              <h4>{{ t('plants.chemicalComponents') }}</h4>
              <div class="components-grid">
                <div
                  v-for="(comp, idx) in chemicalProfile.hasComponent"
                  :key="idx"
                  class="chemical-component"
                >
                  <div class="chemical-component__header">
                    <span class="chemical-component__compound">{{ getCompoundName(comp.compound) }}</span>
                    <span
                      v-if="comp.relativeAbundance"
                      class="abundance-badge"
                      :class="`abundance-badge--${comp.relativeAbundance}`"
                    >
                      {{ comp.relativeAbundance }}
                    </span>
                  </div>
                  <p v-if="comp.concentrationRange" class="chemical-component__concentration">
                    {{ comp.concentrationRange.min }}-{{ comp.concentrationRange.max }} {{ comp.concentrationRange.unit }}
                  </p>
                  <p v-if="comp.notes" class="chemical-component__notes">{{ comp.notes }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- External Links -->
        <section v-if="hasExternalLinks" class="plant-detail__section plant-detail__links">
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
        <aside class="plant-detail__disclaimer">
          <p>
            <strong>{{ t('disclaimer.title') }}:</strong> {{ t('disclaimer.text') }}
          </p>
        </aside>
      </article>

      <div v-else class="plant-detail__not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('plants.notFound') }}</p>
        <router-link :to="localePath(basePath)" class="plant-detail__back-link">
          &larr; {{ t('plants.backToPlants') }}
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
import { usePreparationLocalizer, useChemicalReferences } from '@/composables/useHerbData'

const route = useRoute()
const { t, locale } = useI18n()
const slug = computed(() => route.params.slug)

const plant = ref(null)
const preparations = ref([])
const plantParts = ref([])
const imageError = ref(false)

// Format image path with Vite prefix
const plantImage = computed(() => {
  const img = plant.value?.image
  if (!img) return null
  return img.startsWith('/@herbapedia') ? img : `/${img}`
})

const localizer = usePreparationLocalizer()
const { getCompoundLabels } = useChemicalReferences()

// Handle image load error
function handleImageError() {
  imageError.value = true
}

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Determine source type based on route path
const sourceType = computed(() => {
  const path = route.path
  if (path.includes('/fungi/')) return 'fungi'
  if (path.includes('/algae/')) return 'algae'
  return 'plant'
})

// Get source type label
const sourceTypeLabel = computed(() => {
  switch (sourceType.value) {
    case 'fungi':
      return t('sources.fungi')
    case 'algae':
      return t('sources.algae')
    default:
      return t('sources.botanical')
  }
})

// Get base path for this source type
const basePath = computed(() => {
  switch (sourceType.value) {
    case 'fungi':
      return '/sources/fungi'
    case 'algae':
      return '/sources/algae'
    default:
      return '/sources/botanical'
  }
})

// Computed properties
const commonName = computed(() => {
  if (!plant.value?.commonName) return null
  return plant.value.commonName[locale.value] ||
         plant.value.commonName['en'] ||
         plant.value.commonName['zh-Hant']
})

const description = computed(() => {
  if (!plant.value?.description) return null
  return plant.value.description[locale.value] ||
         plant.value.description['en'] ||
         plant.value.description['zh-Hant']
})

const habitat = computed(() => {
  if (!plant.value?.habitat) return null
  return plant.value.habitat[locale.value] ||
         plant.value.habitat['en'] ||
         plant.value.habitat['zh-Hant']
})

const origin = computed(() => {
  if (!plant.value?.origin) return null
  return plant.value.origin[locale.value] ||
         plant.value.origin['en'] ||
         plant.value.origin['zh-Hant']
})

const geographicalDistribution = computed(() => {
  if (!plant.value?.geographicalDistribution) return null
  return plant.value.geographicalDistribution[locale.value] ||
         plant.value.geographicalDistribution['en'] ||
         plant.value.geographicalDistribution['zh-Hant']
})

// Taxonomic classification (excluding family/genus which are shown in header)
const taxonomyDetails = computed(() => {
  const tc = plant.value?.taxonomicClassification
  if (!tc) return null

  const details = []
  if (tc.kingdom) details.push({ label: t('plants.kingdom'), value: tc.kingdom })
  if (tc.phylum) details.push({ label: t('plants.phylum'), value: tc.phylum })
  if (tc.class) details.push({ label: t('plants.class'), value: tc['class'] })
  if (tc.order) details.push({ label: t('plants.order'), value: tc.order })
  // Note: family and genus are shown in the header

  return details.length > 0 ? details : null
})

// Growth form and lifecycle display
const growthCharacteristics = computed(() => {
  const chars = []
  if (plant.value?.growthForm) {
    chars.push({ label: t('plants.growthForm'), value: t(`plants.growthForms.${plant.value.growthForm}`) })
  }
  if (plant.value?.lifecycle) {
    chars.push({ label: t('plants.lifecycle'), value: t(`plants.lifecycles.${plant.value.lifecycle}`) })
  }
  return chars.length > 0 ? chars : null
})

// Conservation status
const conservationStatusDisplay = computed(() => {
  const status = plant.value?.conservationStatus
  if (!status) return null

  const statusLabels = {
    'LC': { label: t('plants.conservationStatuses.LC'), class: 'status-lc' },
    'NT': { label: t('plants.conservationStatuses.NT'), class: 'status-nt' },
    'VU': { label: t('plants.conservationStatuses.VU'), class: 'status-vu' },
    'EN': { label: t('plants.conservationStatuses.EN'), class: 'status-en' },
    'CR': { label: t('plants.conservationStatuses.CR'), class: 'status-cr' },
    'EW': { label: t('plants.conservationStatuses.EW'), class: 'status-ew' },
    'EX': { label: t('plants.conservationStatuses.EX'), class: 'status-ex' },
    'DD': { label: t('plants.conservationStatuses.DD'), class: 'status-dd' },
    'NE': { label: t('plants.conservationStatuses.NE'), class: 'status-ne' }
  }

  return statusLabels[status] || { label: status, class: '' }
})

const chemicalCompoundLabels = computed(() => {
  if (!plant.value?.containsChemical) return []
  return getCompoundLabels(plant.value.containsChemical)
})

const externalLinks = computed(() => {
  const links = []

  if (plant.value?.wikidataID) {
    links.push({
      url: `https://www.wikidata.org/entity/${plant.value.wikidataID}`,
      label: t('links.wikidata'),
      icon: '📊'
    })
  }

  if (plant.value?.gbifID) {
    links.push({
      url: `https://www.gbif.org/species/${plant.value.gbifID}`,
      label: t('links.gbif'),
      icon: '🌿'
    })
  }

  if (plant.value?.ncbiTaxonomyID) {
    links.push({
      url: `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${plant.value.ncbiTaxonomyID}`,
      label: t('links.ncbi'),
      icon: '🧬'
    })
  }

  return links
})

const hasExternalLinks = computed(() => externalLinks.value.length > 0)

// DNA Barcode
const dnaBarcode = computed(() => {
  if (!plant.value?.hasDNABarcode) return null
  const barcodeId = plant.value.hasDNABarcode['@id']
  if (!barcodeId) return null
  const barcodeSlug = barcodeId.split('/').pop()
  return dataset.getDNABarcode(barcodeSlug)
})

const hasDNABarcode = computed(() => dnaBarcode.value !== null)

// Chemical Profile
const chemicalProfile = computed(() => {
  if (!plant.value?.hasChemicalProfile) return null
  const profileId = plant.value.hasChemicalProfile['@id']
  if (!profileId) return null
  const profileSlug = profileId.split('/').pop()
  return dataset.getChemicalProfile(profileSlug)
})

const hasChemicalProfile = computed(() => chemicalProfile.value !== null)

// Image attribution
const imageAttribution = computed(() => {
  if (!plant.value?.image) return null
  // Extract slug from image path - typically /@herbapedia/data/media/images/{slug}/main.jpg
  const match = plant.value.image.match(/media\/images\/([^/]+)\//)
  if (!match) return null
  const slug = match[1]
  const metadata = dataset.getImageMetadata(slug)
  return metadata?.attribution || null
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

function getCompoundName(compound) {
  if (!compound?.['@id']) return 'Unknown'
  const compoundId = compound['@id']
  const slug = compoundId.split('/').pop()
  const compoundData = dataset.getChemical(slug)
  if (compoundData?.name) {
    // Handle language map
    const nameMap = compoundData.name
    if (typeof nameMap === 'object') {
      return nameMap[locale.value] || nameMap['en'] || slug
    }
    return nameMap
  }
  // Return slug as fallback, formatted nicely
  return slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || compoundId
}

function getImage(prep) {
  // Image comes from source plant, not from preparation
  const img = plant.value?.image
  if (!img) return null
  return img.startsWith('/@herbapedia') ? img : `/${img}`
}

function getFormLabel(prep) {
  if (!prep?.form) return null
  // form can be a string, an IRI reference object, or a full URL string
  const formId = typeof prep.form === 'object' ? prep.form['@id'] : prep.form
  if (!formId) return null

  const formItem = dataset.getHerbalForm(formId)
  if (formItem) {
    const labelMap = formItem.prefLabel || formItem.name
    if (labelMap) {
      return labelMap[locale.value] || labelMap['en'] || formId
    }
  }
  // Fallback: extract last segment from URL
  return formId.split('/').pop() || formId
}

// Watch slug changes and load data
watch(slug, (newSlug) => {
  if (newSlug) {
    // Reset image error state
    imageError.value = false

    const plantData = dataset.getPlantSpecies(newSlug)
    plant.value = plantData

    if (plantData) {
      // Load preparations derived from this plant
      preparations.value = dataset.getPreparationsByPlant(newSlug)

      // Load plant parts
      if (plantData.hasParts) {
        plantParts.value = plantData.hasParts.map(ref => {
          const partSlug = ref['@id'].split('/').pop()
          const part = dataset.getPlantPart(partSlug)
          return {
            slug: partSlug,
            name: part?.name?.[locale.value] || part?.name?.en || partSlug
          }
        })
      } else {
        plantParts.value = []
      }
    }
  }
}, { immediate: true })
</script>

<style scoped>
.plant-detail-view {
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
.plant-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.plant-detail__image-wrapper {
  flex-shrink: 0;
  width: 180px;
  height: 180px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-background);
  position: relative;
}

.plant-detail__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plant-detail__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-text-light);
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.plant-detail__placeholder svg {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.plant-detail__placeholder-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  opacity: 0.7;
}

/* Image Attribution */
.plant-detail__attribution {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.plant-detail__attribution a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
}

.plant-detail__attribution a:hover {
  color: white;
}

.attribution-license {
  font-weight: var(--font-weight-semibold);
}

.attribution-source {
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plant-detail__meta {
  flex: 1;
}

.plant-detail__type-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  padding: 2px 8px;
  background: rgba(34, 139, 34, 0.15);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.plant-detail__scientific-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-style: italic;
  margin-bottom: var(--spacing-sm);
}

.plant-detail__common-name {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.plant-detail__taxonomy {
  display: flex;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* Sections */
.plant-detail__section {
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
  border-bottom: 2px solid var(--color-accent);
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

.preparations-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-light);
}

/* Compounds */
.compounds-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.compound-tag {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: #7c3aed;
  border-radius: var(--radius-full);
  cursor: default;
}

/* Parts */
.parts-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.part-tag {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
}

/* Taxonomy List */
.taxonomy-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-sm);
  margin: 0;
}

.taxonomy-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.taxonomy-item__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
  margin: 0;
}

.taxonomy-item__value {
  font-size: var(--font-size-sm);
  margin: 0;
}

/* Distribution Section */
.distribution-item {
  margin-bottom: var(--spacing-md);
}

.distribution-item:last-child {
  margin-bottom: 0;
}

.distribution-item__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-xs);
  color: var(--color-text);
}

.distribution-item__value {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0;
  line-height: var(--line-height-relaxed);
}

/* Characteristics Section */
.characteristics-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin: 0 0 var(--spacing-md);
}

.characteristic-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.characteristic-item__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

.characteristic-item__value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-sm);
}

/* Conservation Status */
.conservation-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.conservation-status__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.conservation-status__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.conservation-status__badge.status-lc { background: #d4edda; color: #155724; }
.conservation-status__badge.status-nt { background: #fff3cd; color: #856404; }
.conservation-status__badge.status-vu { background: #ffe0b2; color: #e65100; }
.conservation-status__badge.status-en { background: #ffccbc; color: #bf360c; }
.conservation-status__badge.status-cr { background: #ffcdd2; color: #b71c1c; }
.conservation-status__badge.status-ew { background: #f8bbd0; color: #880e4f; }
.conservation-status__badge.status-ex { background: #212121; color: #ffffff; }
.conservation-status__badge.status-dd { background: #e0e0e0; color: #424242; }
.conservation-status__badge.status-ne { background: #eceff1; color: #546e7a; }

/* External Links */
.external-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.external-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.external-link:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.external-link__arrow {
  opacity: 0.5;
}

/* Disclaimer */
.plant-detail__disclaimer {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.plant-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

/* Not Found */
.plant-detail__not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.plant-detail__back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .plant-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .plant-detail__image-wrapper {
    width: 150px;
    height: 150px;
  }

  .plant-detail__taxonomy {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .preparations-grid {
    grid-template-columns: 1fr;
  }
}

/* DNA Barcode */
.plant-detail__dna {
  background: linear-gradient(135deg, rgba(103, 58, 183, 0.08), rgba(156, 39, 176, 0.05));
  border: 1px solid rgba(103, 58, 183, 0.15);
}

.dna-barcode-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.dna-sequences {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.dna-sequence {
  background: rgba(255, 255, 255, 0.6);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 3px solid #673AB7;
}

.dna-sequence__region {
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: #673AB7;
  margin-bottom: var(--spacing-xs);
}

.dna-sequence__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.dna-sequence__quality {
  margin-top: var(--spacing-xs);
}

.quality-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.quality-badge--high {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
}

.quality-badge--medium {
  background: rgba(255, 152, 0, 0.15);
  color: #FF9800;
}

.quality-badge--low {
  background: rgba(244, 67, 54, 0.15);
  color: #F44336;
}

.dna-confidence,
.dna-adulterants {
  background: rgba(255, 255, 255, 0.6);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.dna-confidence h4,
.dna-adulterants h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.dna-confidence p {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.adulterant-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.adulterant-list li {
  padding: var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.adulterant-list li:last-child {
  border-bottom: none;
}

/* Chemical Profile */
.plant-detail__chemical {
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.08), rgba(76, 175, 80, 0.05));
  border: 1px solid rgba(0, 150, 136, 0.15);
}

.chemical-profile-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.chemical-profile__total,
.chemical-profile__method,
.chemical-profile__grade {
  background: rgba(255, 255, 255, 0.6);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  display: flex;
  gap: var(--spacing-sm);
}

.chemical-profile__label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.chemical-profile__value {
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.chemical-components h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.chemical-component {
  background: rgba(255, 255, 255, 0.6);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 3px solid #009688;
}

.chemical-component__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.chemical-component__compound {
  font-weight: var(--font-weight-semibold);
  color: #009688;
  font-size: var(--font-size-sm);
}

.chemical-component__concentration {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin: var(--spacing-xs) 0;
}

.chemical-component__notes {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-style: italic;
  margin-top: var(--spacing-xs);
}

.abundance-badge {
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.abundance-badge--major {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
}

.abundance-badge--minor {
  background: rgba(255, 152, 0, 0.15);
  color: #FF9800;
}

.abundance-badge--trace {
  background: rgba(158, 158, 158, 0.15);
  color: #9E9E9E;
}
</style>
