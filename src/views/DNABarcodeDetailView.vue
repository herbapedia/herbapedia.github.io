<template>
  <div class="dna-barcode-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <router-link :to="localePath('/sources/barcodes')">{{ t('dnaBarcodes.title') }}</router-link>
        <span>/</span>
        <span>{{ barcodeName }}</span>
      </nav>

      <article v-if="barcode" class="dna-barcode-detail">
        <!-- Header -->
        <header class="dna-barcode-detail__header">
          <div class="dna-barcode-detail__icon">🧬</div>
          <div class="dna-barcode-detail__meta">
            <span class="dna-barcode-detail__type-badge">{{ t('dnaBarcodes.barcode') }}</span>
            <h1 class="dna-barcode-detail__name">{{ barcodeName }}</h1>
            <p v-if="speciesName" class="dna-barcode-detail__species">
              {{ speciesName }}
            </p>
          </div>
        </header>

        <!-- Confidence -->
        <section v-if="barcode.identificationConfidence" class="dna-barcode-detail__section dna-barcode-detail__confidence">
          <h2 class="section-title">{{ t('dnaBarcodes.identification') }}</h2>
          <div class="confidence-info">
            <div class="confidence-item">
              <span class="confidence-item__label">{{ t('dnaBarcodes.level') }}:</span>
              <span class="confidence-item__value">{{ barcode.identificationConfidence.level }}</span>
            </div>
            <div v-if="barcode.identificationConfidence.confidence" class="confidence-item">
              <span class="confidence-item__label">{{ t('dnaBarcodes.confidence') }}:</span>
              <span class="confidence-item__value">{{ barcode.identificationConfidence.confidence }}%</span>
            </div>
            <div v-if="barcode.identificationConfidence.method" class="confidence-item">
              <span class="confidence-item__label">{{ t('dnaBarcodes.method') }}:</span>
              <span class="confidence-item__value">{{ barcode.identificationConfidence.method }}</span>
            </div>
          </div>
        </section>

        <!-- DNA Sequences -->
        <section v-if="barcode.sequence && barcode.sequence.length > 0" class="dna-barcode-detail__section dna-barcode-detail__sequences">
          <h2 class="section-title">
            <span class="section-title__icon">🧬</span>
            {{ t('dnaBarcodes.sequences') }}
          </h2>

          <div class="sequences-list">
            <div v-for="(seq, index) in barcode.sequence" :key="index" class="sequence-card">
              <div class="sequence-card__header">
                <h3 class="sequence-card__region">{{ seq.region }}</h3>
                <div class="sequence-card__meta">
                  <span v-if="seq.length" class="sequence-meta">{{ seq.length }} bp</span>
                  <span v-if="seq.gcContent" class="sequence-meta">GC: {{ seq.gcContent }}%</span>
                  <span v-if="seq.sequenceQuality" class="sequence-quality">{{ seq.sequenceQuality }}</span>
                </div>
              </div>
              <div v-if="seq.genbankAccession" class="sequence-card__accession">
                <span class="accession-label">GenBank:</span>
                <a :href="`https://www.ncbi.nlm.nih.gov/nuccore/${seq.genbankAccession}`" target="_blank" rel="noopener" class="accession-link">
                  {{ seq.genbankAccession }}
                  <span class="external-arrow">↗</span>
                </a>
              </div>
              <div v-if="seq.sequence" class="sequence-card__sequence">
                <div class="sequence-viewer">
                  <!-- Sequence Legend -->
                  <div class="sequence-legend">
                    <span class="legend-item"><span class="nucleotide-a">A</span> Adenine</span>
                    <span class="legend-item"><span class="nucleotide-t">T</span> Thymine</span>
                    <span class="legend-item"><span class="nucleotide-g">G</span> Guanine</span>
                    <span class="legend-item"><span class="nucleotide-c">C</span> Cytosine</span>
                  </div>
                  <!-- Highlighted Sequence -->
                  <code class="sequence-code sequence-code--highlighted">
                    <span v-html="highlightedSequence(seq.sequence, expandedSequences[index])"></span>
                  </code>
                  <!-- Sequence Controls -->
                  <div class="sequence-controls">
                    <button
                      @click="toggleSequence(index)"
                      class="sequence-control-btn"
                    >
                      {{ expandedSequences[index] ? t('dnaBarcodes.hideFullSequence') : t('dnaBarcodes.viewFullSequence') }}
                    </button>
                    <button
                      @click="copySequence(seq.sequence)"
                      class="sequence-control-btn sequence-control-btn--secondary"
                    >
                      {{ copiedSequence ? t('dnaBarcodes.sequenceCopied') : t('dnaBarcodes.copySequence') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Adulterant Detection -->
        <section v-if="barcode.adulterantDetection?.canDetect?.length" class="dna-barcode-detail__section">
          <h2 class="section-title">{{ t('dnaBarcodes.adulterantDetection') }}</h2>
          <p class="adulterant-note">{{ t('dnaBarcodes.canDetect') }}:</p>
          <ul class="adulterant-list">
            <li v-for="(item, index) in barcode.adulterantDetection.canDetect" :key="index">
              {{ item }}
            </li>
          </ul>
        </section>

        <!-- Vouchered Specimen -->
        <section v-if="barcode.voucheredSpecimen" class="dna-barcode-detail__section">
          <h2 class="section-title">{{ t('dnaBarcodes.voucheredSpecimen') }}</h2>
          <div class="specimen-info">
            <div v-if="barcode.voucheredSpecimen.herbarium" class="specimen-item">
              <span class="specimen-label">{{ t('dnaBarcodes.herbarium') }}:</span>
              <span class="specimen-value">{{ barcode.voucheredSpecimen.herbarium }}</span>
            </div>
            <div v-if="barcode.voucheredSpecimen.collector" class="specimen-item">
              <span class="specimen-label">{{ t('dnaBarcodes.collector') }}:</span>
              <span class="specimen-value">{{ barcode.voucheredSpecimen.collector }}</span>
            </div>
            <div v-if="barcode.voucheredSpecimen.collectionLocation" class="specimen-item">
              <span class="specimen-label">{{ t('dnaBarcodes.location') }}:</span>
              <span class="specimen-value">{{ barcode.voucheredSpecimen.collectionLocation }}</span>
            </div>
          </div>
        </section>

        <!-- Link to Species -->
        <section v-if="species" class="dna-barcode-detail__section">
          <router-link :to="localePath(`/sources/botanical/${getSlug(species)}`)" class="species-link">
            <div class="species-link__content">
              <span class="species-link__label">{{ t('dnaBarcodes.viewSpecies') }}</span>
              <h3 class="species-link__name">{{ species.scientificName }}</h3>
            </div>
            <span class="species-link__arrow">→</span>
          </router-link>
        </section>

        <!-- Disclaimer -->
        <aside class="dna-barcode-detail__disclaimer">
          <p>
            <strong>{{ t('disclaimer.title') }}:</strong> {{ t('dnaBarcodes.disclaimer') }}
          </p>
        </aside>
      </article>

      <div v-else class="dna-barcode-detail__not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('dnaBarcodes.notFound') }}</p>
        <router-link :to="localePath('/sources/barcodes')" class="dna-barcode-detail__back-link">
          &larr; {{ t('dnaBarcodes.backToBarcodes') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { dataset } from '@/api/dataset'

const route = useRoute()
const { t, locale } = useI18n()
const slug = computed(() => route.params.slug)

const barcode = ref(null)
const species = ref(null)
const expandedSequences = reactive({})
const copiedSequence = ref(false)

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Computed properties
const barcodeName = computed(() => {
  if (!barcode.value?.name) return slug.value
  return barcode.value.name[locale.value] ||
         barcode.value.name['en'] ||
         barcode.value.name['zh-Hant'] ||
         slug.value
})

const speciesName = computed(() => {
  if (!species.value) return null
  return species.value.scientificName
})

// Helper functions
function getSlug(entity) {
  if (!entity?.['@id']) return ''
  const parts = entity['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function toggleSequence(index) {
  expandedSequences[index] = !expandedSequences[index]
}

function highlightedSequence(sequence, expanded) {
  if (!sequence) return ''
  const displaySeq = expanded ? sequence : sequence.substring(0, 200)
  const suffix = !expanded && sequence.length > 200 ? '...' : ''

  // Color-code nucleotides
  return displaySeq
    .replace(/A/gi, '<span class="nucleotide-a">A</span>')
    .replace(/T/gi, '<span class="nucleotide-t">T</span>')
    .replace(/G/gi, '<span class="nucleotide-g">G</span>')
    .replace(/C/gi, '<span class="nucleotide-c">C</span>')
    + suffix
}

async function copySequence(sequence) {
  try {
    await navigator.clipboard.writeText(sequence)
    copiedSequence.value = true
    setTimeout(() => {
      copiedSequence.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy sequence:', err)
  }
}

// Watch slug changes and load data
watch(slug, (newSlug) => {
  if (newSlug) {
    barcode.value = dataset.getDNABarcode(newSlug)

    if (barcode.value?.species) {
      const speciesSlug = barcode.value.species['@id'].split('/').pop()
      species.value = dataset.getPlantSpecies(speciesSlug)
    }
  }
}, { immediate: true })
</script>

<style scoped>
.dna-barcode-detail-view {
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
.dna-barcode-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.dna-barcode-detail__icon {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: rgba(13, 148, 136, 0.1);
  border-radius: var(--radius-lg);
}

.dna-barcode-detail__meta {
  flex: 1;
}

.dna-barcode-detail__type-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  padding: 2px 8px;
  background: rgba(13, 148, 136, 0.15);
  color: #0d9488;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.dna-barcode-detail__name {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-sm);
}

.dna-barcode-detail__species {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
}

/* Sections */
.dna-barcode-detail__section {
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
  border-bottom: 2px solid #0d9488;
}

.section-title__icon {
  font-size: var(--font-size-base);
  opacity: 0.7;
}

/* Confidence Info */
.confidence-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.confidence-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.confidence-item__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  text-transform: uppercase;
}

.confidence-item__value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: #0d9488;
}

/* Sequence Cards */
.sequences-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.sequence-card {
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.sequence-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.sequence-card__region {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: #0d9488;
  margin: 0;
  font-family: var(--font-mono);
}

.sequence-card__meta {
  display: flex;
  gap: var(--spacing-sm);
}

.sequence-meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  background: var(--color-surface-alt);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.sequence-quality {
  font-size: var(--font-size-xs);
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.sequence-card__accession {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.accession-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.accession-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.accession-link:hover {
  text-decoration: underline;
}

.external-arrow {
  font-size: var(--font-size-xs);
}

.sequence-card__sequence {
  overflow-x: auto;
}

/* Sequence Viewer */
.sequence-viewer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sequence-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
}

.legend-item {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-item span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xs);
}

.sequence-code--highlighted {
  background: var(--color-surface-alt);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  word-break: break-all;
  line-height: 1.8;
  letter-spacing: 0.5px;
}

.sequence-code--highlighted :deep(.nucleotide-a) {
  color: #22c55e;
  font-weight: var(--font-weight-bold);
}

.sequence-code--highlighted :deep(.nucleotide-t) {
  color: #ef4444;
  font-weight: var(--font-weight-bold);
}

.sequence-code--highlighted :deep(.nucleotide-g) {
  color: #f59e0b;
  font-weight: var(--font-weight-bold);
}

.sequence-code--highlighted :deep(.nucleotide-c) {
  color: #3b82f6;
  font-weight: var(--font-weight-bold);
}

.nucleotide-a {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.nucleotide-t {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.nucleotide-g {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.nucleotide-c {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.sequence-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.sequence-control-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border: 1px solid #0d9488;
  background: transparent;
  color: #0d9488;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sequence-control-btn:hover {
  background: rgba(13, 148, 136, 0.1);
}

.sequence-control-btn--secondary {
  border-color: var(--color-border);
  color: var(--color-text-light);
}

.sequence-control-btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.sequence-code {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text);
  background: var(--color-surface-alt);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  display: block;
  word-break: break-all;
  line-height: 1.6;
}

/* Adulterant Detection */
.adulterant-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-sm);
}

.adulterant-list {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.adulterant-list li {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

/* Specimen Info */
.specimen-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.specimen-item {
  display: flex;
  gap: var(--spacing-sm);
}

.specimen-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  min-width: 100px;
}

.specimen-value {
  font-size: var(--font-size-sm);
  color: var(--color-text);
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
  border-color: #0d9488;
  transform: translateX(4px);
}

.species-link__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  text-transform: uppercase;
}

.species-link__name {
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  font-style: italic;
  font-weight: var(--font-weight-bold);
  color: #0d9488;
  margin: var(--spacing-xs) 0 0;
}

.species-link__arrow {
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
}

/* Disclaimer */
.dna-barcode-detail__disclaimer {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.dna-barcode-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

/* Not Found */
.dna-barcode-detail__not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.dna-barcode-detail__back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .dna-barcode-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .dna-barcode-detail__icon {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }

  .confidence-info {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>
