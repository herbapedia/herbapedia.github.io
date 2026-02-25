<template>
  <div class="compound-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <router-link :to="localePath('/compounds')">{{ t('compounds.title') }}</router-link>
        <span>/</span>
        <span>{{ compoundName }}</span>
      </nav>

      <article v-if="compound" class="compound-detail">
        <!-- Header -->
        <header class="compound-detail__header">
          <div class="compound-detail__icon">⚗️</div>
          <div class="compound-detail__meta">
            <span class="compound-detail__type-badge">{{ t('compounds.compound') }}</span>
            <h1 class="compound-detail__name">{{ compoundName }}</h1>
            <p v-if="compound.molecularFormula" class="compound-detail__formula">
              {{ compound.molecularFormula }}
            </p>
          </div>
        </header>

        <!-- Description -->
        <section v-if="description" class="compound-detail__section">
          <h2 class="section-title">{{ t('sections.description') }}</h2>
          <div class="prose">
            <p>{{ description }}</p>
          </div>
        </section>

        <!-- Chemical Identifiers -->
        <section class="compound-detail__section compound-detail__identifiers">
          <h2 class="section-title">{{ t('compounds.identifiers') }}</h2>
          <div class="identifiers-grid">
            <div v-if="compound.iupacName" class="identifier-item identifier-item--full">
              <span class="identifier-item__label">{{ t('compounds.iupacName') }}</span>
              <span class="identifier-item__value identifier-item__value--small">{{ compound.iupacName }}</span>
            </div>
            <div v-if="compound.molecularFormula" class="identifier-item">
              <span class="identifier-item__label">{{ t('compounds.molecularFormula') }}</span>
              <span class="identifier-item__value identifier-item__value--mono">{{ compound.molecularFormula }}</span>
            </div>
            <div v-if="compound.molecularWeight" class="identifier-item">
              <span class="identifier-item__label">{{ t('compounds.molecularWeight') }}</span>
              <span class="identifier-item__value">{{ compound.molecularWeight }} g/mol</span>
            </div>
            <div v-if="compound.casNumber" class="identifier-item">
              <span class="identifier-item__label">{{ t('compounds.casNumber') }}</span>
              <span class="identifier-item__value identifier-item__value--mono">{{ compound.casNumber }}</span>
            </div>
            <div v-if="compound.chebiID" class="identifier-item">
              <span class="identifier-item__label">{{ t('compounds.chebiID') }}</span>
              <a :href="`https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${compound.chebiID}`"
                 target="_blank" rel="noopener" class="identifier-item__link">
                {{ compound.chebiID }} ↗
              </a>
            </div>
            <div v-if="compound.pubchemCID" class="identifier-item">
              <span class="identifier-item__label">{{ t('compounds.pubchemCID') }}</span>
              <a :href="`https://pubchem.ncbi.nlm.nih.gov/compound/${compound.pubchemCID}`"
                 target="_blank" rel="noopener" class="identifier-item__link">
                CID: {{ compound.pubchemCID }} ↗
              </a>
            </div>
            <div v-if="compound.inchiKey" class="identifier-item">
              <span class="identifier-item__label">{{ t('compounds.inchiKey') }}</span>
              <span class="identifier-item__value identifier-item__value--mono identifier-item__value--small">{{ compound.inchiKey }}</span>
            </div>
          </div>

          <!-- InChI (collapsible due to length) -->
          <div v-if="compound.inchi" class="identifier-item identifier-item--full">
            <span class="identifier-item__label">{{ t('compounds.inchi') }}</span>
            <div class="identifier-item__long-value">
              <code class="identifier-item__code">{{ compound.inchi }}</code>
            </div>
          </div>

          <!-- SMILES (collapsible due to length) -->
          <div v-if="compound.smiles" class="identifier-item identifier-item--full">
            <span class="identifier-item__label">{{ t('compounds.smiles') }}</span>
            <div class="identifier-item__long-value">
              <code class="identifier-item__code">{{ compound.smiles }}</code>
            </div>
          </div>
        </section>

        <!-- Compound Class -->
        <section v-if="compound.compoundClass || compound.commonName" class="compound-detail__section">
          <h2 v-if="compound.compoundClass" class="section-title">{{ t('compounds.compoundClass') }}</h2>
          <div v-if="compound.compoundClass" class="class-tags">
            <span v-for="(cls, idx) in compoundClassList" :key="idx" class="class-tag">{{ cls }}</span>
          </div>
          <h2 v-if="compound.commonName?.length" class="section-title section-title--secondary">{{ t('compounds.synonyms') }}</h2>
          <div v-if="compound.commonName?.length" class="synonym-tags">
            <span v-for="(syn, idx) in compound.commonName" :key="idx" class="synonym-tag">{{ syn }}</span>
          </div>
        </section>

        <!-- Pharmacology -->
        <section v-if="compound.pharmacology?.length" class="compound-detail__section">
          <h2 class="section-title">{{ t('compounds.pharmacology') }}</h2>
          <ul class="pharmacology-list">
            <li v-for="(item, idx) in compound.pharmacology" :key="idx">{{ item }}</li>
          </ul>
        </section>

        <!-- Bioavailability -->
        <section v-if="bioavailability" class="compound-detail__section compound-detail__bioavailability">
          <h2 class="section-title">{{ t('compounds.bioavailability') }}</h2>
          <p class="bioavailability-text">{{ bioavailability }}</p>
        </section>

        <!-- Safety Data -->
        <section v-if="hasSafetyData" class="compound-detail__section compound-detail__safety">
          <h2 class="section-title">{{ t('compounds.safetyData') }}</h2>
          <div class="safety-grid">
            <div v-if="compound.safetyData?.ld50" class="safety-item">
              <span class="safety-item__label">{{ t('compounds.ld50') }}</span>
              <span class="safety-item__value">{{ compound.safetyData.ld50 }}</span>
            </div>
            <div v-if="compound.safetyData?.toxicity" class="safety-item">
              <span class="safety-item__label">{{ t('compounds.toxicity') }}</span>
              <span class="safety-item__value">{{ compound.safetyData.toxicity }}</span>
            </div>
          </div>
          <ul v-if="compound.safetyData?.warnings?.length" class="warnings-list">
            <li v-for="(warning, idx) in compound.safetyData.warnings" :key="idx">
              <span class="warning-icon">⚠️</span> {{ warning }}
            </li>
          </ul>
        </section>

        <!-- Plants containing this compound -->
        <section class="compound-detail__section compound-detail__plants">
          <h2 class="section-title">
            <span class="section-title__icon">🌿</span>
            {{ t('compounds.foundIn') }}
            <span class="section-title__count">({{ plants.length }})</span>
          </h2>

          <div v-if="plants.length > 0" class="plants-grid">
            <router-link
              v-for="plant in plants"
              :key="getSlug(plant)"
              :to="localePath(`/sources/botanical/${getSlug(plant)}`)"
              class="plant-card-mini"
            >
              <div class="plant-card-mini__image-wrapper">
                <img
                  v-if="plant.image"
                  :src="plant.image"
                  :alt="plant.scientificName"
                  class="plant-card-mini__image"
                />
                <div v-else class="plant-card-mini__placeholder">
                  <span>🌿</span>
                </div>
              </div>
              <div class="plant-card-mini__content">
                <h4 class="plant-card-mini__name">{{ plant.scientificName }}</h4>
                <p v-if="getCommonName(plant)" class="plant-card-mini__common">
                  {{ getCommonName(plant) }}
                </p>
              </div>
              <span class="plant-card-mini__arrow">→</span>
            </router-link>
          </div>

          <div v-else class="plants-empty">
            <p>{{ t('compounds.noPlants') }}</p>
          </div>
        </section>

        <!-- Disclaimer -->
        <aside class="compound-detail__disclaimer">
          <p>
            <strong>{{ t('disclaimer.title') }}:</strong> {{ t('disclaimer.text') }}
          </p>
        </aside>
      </article>

      <div v-else class="compound-detail__not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('compounds.notFound') }}</p>
        <router-link :to="localePath('/compounds')" class="compound-detail__back-link">
          &larr; {{ t('compounds.backToCompounds') }}
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

const route = useRoute()
const { t, locale } = useI18n()
const slug = computed(() => route.params.slug)

const compound = ref(null)
const plants = ref([])

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Computed properties
const compoundName = computed(() => {
  if (!compound.value?.name) return slug.value
  return compound.value.name[locale.value] ||
         compound.value.name['en'] ||
         compound.value.name['zh-Hant'] ||
         slug.value
})

const description = computed(() => {
  if (!compound.value?.description) return null
  return compound.value.description[locale.value] ||
         compound.value.description['en'] ||
         compound.value.description['zh-Hant']
})

const compoundClassList = computed(() => {
  if (!compound.value?.compoundClass) return []
  return compound.value.compoundClass.split(';').map(s => s.trim())
})

const bioavailability = computed(() => {
  if (!compound.value?.bioavailability) return null
  return compound.value.bioavailability[locale.value] ||
         compound.value.bioavailability['en'] ||
         compound.value.bioavailability['zh-Hant']
})

const hasSafetyData = computed(() => {
  const sd = compound.value?.safetyData
  return sd && (sd.ld50 || sd.toxicity || (sd.warnings && sd.warnings.length > 0))
})

// Helper functions
function getSlug(entity) {
  if (!entity?.['@id']) return ''
  const parts = entity['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getCommonName(plant) {
  if (!plant?.commonName) return null
  return plant.commonName[locale.value] ||
         plant.commonName['en'] ||
         plant.commonName['zh-Hant']
}

// Watch slug changes and load data
watch(slug, (newSlug) => {
  if (newSlug) {
    const compoundData = dataset.getChemical(newSlug)
    compound.value = compoundData

    if (compoundData) {
      // Load plants containing this compound
      plants.value = dataset.getPlantsContainingCompound(newSlug)
    }
  }
}, { immediate: true })
</script>

<style scoped>
.compound-detail-view {
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
.compound-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.compound-detail__icon {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-radius: var(--radius-lg);
}

.compound-detail__meta {
  flex: 1;
}

.compound-detail__type-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  padding: 2px 8px;
  background: rgba(124, 58, 237, 0.15);
  color: #7c3aed;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.compound-detail__name {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-sm);
}

.compound-detail__formula {
  font-family: var(--font-mono);
  font-size: var(--font-size-lg);
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  display: inline-block;
  margin: 0;
}

/* Sections */
.compound-detail__section {
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
  border-bottom: 2px solid #7c3aed;
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

/* Plants Grid */
.plants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.plant-card-mini {
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

.plant-card-mini:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.plant-card-mini__image-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface);
}

.plant-card-mini__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plant-card-mini__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
}

.plant-card-mini__content {
  flex: 1;
  min-width: 0;
}

.plant-card-mini__name {
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-style: italic;
  font-weight: var(--font-weight-medium);
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plant-card-mini__common {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plant-card-mini__arrow {
  flex-shrink: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.plant-card-mini:hover .plant-card-mini__arrow {
  opacity: 1;
}

.plants-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-light);
}

/* Identifiers Section */
.identifiers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.identifier-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.identifier-item--full {
  grid-column: 1 / -1;
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.identifier-item__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.identifier-item__value {
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.identifier-item__value--mono {
  font-family: var(--font-mono);
}

.identifier-item__value--small {
  font-size: var(--font-size-xs);
  word-break: break-all;
}

.identifier-item__link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
}

.identifier-item__link:hover {
  text-decoration: underline;
}

.identifier-item__long-value {
  max-width: 100%;
  overflow-x: auto;
}

.identifier-item__code {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  background: var(--color-background);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  word-break: break-all;
  line-height: 1.5;
}

/* Class Tags */
.class-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.class-tag {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  border-radius: var(--radius-full);
}

.section-title--secondary {
  margin-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-lg);
}

/* Synonyms */
.synonym-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.synonym-tag {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
}

/* Bioavailability */
.bioavailability-text {
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
  margin: 0;
}

/* Safety */
.safety-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.safety-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.safety-item__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.safety-item__value {
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.warnings-list {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.warnings-list li {
  margin-bottom: var(--spacing-sm);
  line-height: var(--line-height-relaxed);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
}

.warning-icon {
  flex-shrink: 0;
}

/* Pharmacology List */
.pharmacology-list {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.pharmacology-list li {
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-relaxed);
}

/* Disclaimer */
.compound-detail__disclaimer {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.compound-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

/* Not Found */
.compound-detail__not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.compound-detail__back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .compound-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .compound-detail__icon {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }

  .plants-grid {
    grid-template-columns: 1fr;
  }
}
</style>
