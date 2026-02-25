<template>
  <div class="formulas-view">
    <!-- Hero Banner -->
    <section class="formulas-hero">
      <div class="formulas-hero__background">
        <div class="formulas-hero__overlay"></div>
      </div>
      <div class="container formulas-hero__content">
        <h1 class="formulas-hero__title">{{ t('formulas.title') }}</h1>
        <p class="formulas-hero__subtitle">
          {{ t('formulas.subtitle') }}
        </p>
      </div>
    </section>

    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <span>{{ t('formulas.title') }}</span>
      </nav>

      <!-- Formulas Grid -->
      <div class="formulas-grid">
        <router-link
          v-for="formula in allFormulas"
          :key="getSlug(formula)"
          :to="localePath(`/formulas/${getSlug(formula)}`)"
          class="formula-card"
        >
          <div class="formula-card__icon">🔬</div>
          <div class="formula-card__content">
            <h3 class="formula-card__name">{{ getFormulaName(formula) }}</h3>
            <p v-if="formula.scientificName" class="formula-card__scientific">
              {{ formula.scientificName }}
            </p>
            <p v-if="getFormulaDescription(formula)" class="formula-card__description">
              {{ truncate(getFormulaDescription(formula), 100) }}
            </p>
            <span v-if="formula.sourceSubType" class="formula-card__badge">
              {{ formula.sourceSubType }}
            </span>
          </div>
          <span class="formula-card__arrow">→</span>
        </router-link>
      </div>

      <div v-if="allFormulas.length === 0" class="formulas-empty">
        <p>{{ t('formulas.noResults') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'

const { t, locale } = useI18n()

// Get all formulas
const allFormulas = computed(() => dataset.getAllFormulas())

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Helper functions
function getSlug(formula) {
  if (!formula?.['@id']) return ''
  const parts = formula['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getFormulaName(formula) {
  if (!formula?.name) return getSlug(formula)
  return formula.name[locale.value] ||
         formula.name['en'] ||
         formula.name['zh-Hant'] ||
         getSlug(formula)
}

function getFormulaDescription(formula) {
  if (!formula?.description) return null
  return formula.description[locale.value] ||
         formula.description['en'] ||
         formula.description['zh-Hant']
}

function truncate(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.formulas-view {
  min-height: calc(100vh - var(--header-height));
}

/* Hero Banner */
.formulas-hero {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: var(--spacing-2xl);
}

.formulas-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.formulas-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.85));
}

.formulas-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--color-text-inverse);
}

.formulas-hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-inverse);
}

.formulas-hero__subtitle {
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

/* Formulas Grid */
.formulas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.formula-card {
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

.formula-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: #6366f1;
}

.formula-card__icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-md);
}

.formula-card__content {
  flex: 1;
  min-width: 0;
}

.formula-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: #6366f1;
  margin: 0 0 var(--spacing-xs);
}

.formula-card__scientific {
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-style: italic;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
}

.formula-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-sm);
  line-height: var(--line-height-relaxed);
}

.formula-card__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: 2px 8px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.formula-card__arrow {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.formula-card:hover .formula-card__arrow {
  opacity: 1;
}

/* Empty state */
.formulas-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 640px) {
  .formulas-hero {
    height: 240px;
  }

  .formulas-hero__title {
    font-size: var(--font-size-3xl);
  }

  .formulas-grid {
    grid-template-columns: 1fr;
  }
}
</style>
