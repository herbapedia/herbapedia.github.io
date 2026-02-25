<template>
  <div class="formula-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <router-link :to="localePath('/formulas')">{{ t('formulas.title') }}</router-link>
        <span>/</span>
        <span>{{ formulaName }}</span>
      </nav>

      <article v-if="formula" class="formula-detail">
        <!-- Header -->
        <header class="formula-detail__header">
          <div class="formula-detail__icon">🔬</div>
          <div class="formula-detail__meta">
            <span class="formula-detail__type-badge">{{ t('formulas.formula') }}</span>
            <h1 class="formula-detail__name">{{ formulaName }}</h1>
            <p v-if="formula.scientificName" class="formula-detail__scientific">
              {{ formula.scientificName }}
            </p>
            <span v-if="formula.sourceSubType" class="formula-detail__subtype">
              {{ formula.sourceSubType }}
            </span>
          </div>
        </header>

        <!-- Description -->
        <section v-if="description" class="formula-detail__section">
          <h2 class="section-title">{{ t('sections.description') }}</h2>
          <div class="prose">
            <p>{{ description }}</p>
          </div>
        </section>

        <!-- Ingredients Breakdown -->
        <section v-if="formula.ingredients && formula.ingredients.length > 0" class="formula-detail__section formula-detail__ingredients">
          <h2 class="section-title">
            <span class="section-title__icon">🌿</span>
            {{ t('formulas.ingredients') }}
          </h2>
          <p class="ingredients-note">{{ t('formulas.ingredientsNote') }}</p>
          <div class="ingredients-list">
            <div
              v-for="(ingredient, index) in ingredientPreparations"
              :key="index"
              class="ingredient-card"
            >
              <div class="ingredient-card__icon">🍃</div>
              <div class="ingredient-card__content">
                <h3 class="ingredient-card__name">{{ getIngredientName(ingredient.preparation) }}</h3>
                <p v-if="ingredient.preparation?.scientificName" class="ingredient-card__scientific">
                  {{ ingredient.preparation.scientificName }}
                </p>
                <router-link
                  :to="localePath(`/preparations/${ingredient.slug}`)"
                  class="ingredient-card__link"
                >
                  {{ t('preparations.viewPlantProfile') }} →
                </router-link>
              </div>
            </div>
          </div>
        </section>

        <!-- Disclaimer -->
        <aside class="formula-detail__disclaimer">
          <p>
            <strong>{{ t('disclaimer.title') }}:</strong> {{ t('disclaimer.text') }}
          </p>
        </aside>
      </article>

      <div v-else class="formula-detail__not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('formulas.notFound') }}</p>
        <router-link :to="localePath('/formulas')" class="formula-detail__back-link">
          &larr; {{ t('formulas.backToFormulas') }}
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

const formula = ref(null)

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Computed properties
const formulaName = computed(() => {
  if (!formula.value?.name) return slug.value
  return formula.value.name[locale.value] ||
         formula.value.name['en'] ||
         formula.value.name['zh-Hant'] ||
         slug.value
})

const description = computed(() => {
  if (!formula.value?.description) return null
  return formula.value.description[locale.value] ||
         formula.value.description['en'] ||
         formula.value.description['zh-Hant']
})

// Process ingredients to get preparation details
const ingredientPreparations = computed(() => {
  if (!formula.value?.ingredients) return []

  return formula.value.ingredients
    .map(ingredient => {
      const slug = ingredient['@id']?.split('/').pop() || ''
      const preparation = dataset.getPreparation(slug)
      return { slug, preparation }
    })
    .filter(item => item.preparation)
})

// Helper to get ingredient name
function getIngredientName(preparation) {
  if (!preparation?.name) return 'Unknown'
  return preparation.name[locale.value] ||
         preparation.name['en'] ||
         preparation.name['zh-Hant'] ||
         'Unknown'
}

// Watch slug changes and load data
watch(slug, (newSlug) => {
  if (newSlug) {
    formula.value = dataset.getFormula(newSlug)
  }
}, { immediate: true })
</script>

<style scoped>
.formula-detail-view {
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
.formula-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.formula-detail__icon {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-lg);
}

.formula-detail__meta {
  flex: 1;
}

.formula-detail__type-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  padding: 2px 8px;
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.formula-detail__name {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-sm);
}

.formula-detail__scientific {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-sm);
}

.formula-detail__subtype {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: 2px 8px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

/* Sections */
.formula-detail__section {
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
  border-bottom: 2px solid #6366f1;
}

.section-title__icon {
  font-size: var(--font-size-base);
  opacity: 0.7;
}

/* Ingredients Section */
.formula-detail__ingredients {
  border-left: 4px solid #6366f1;
}

.ingredients-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-lg);
}

.ingredients-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.ingredient-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.ingredient-card:hover {
  border-color: #6366f1;
  transform: translateY(-2px);
}

.ingredient-card__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-lg);
}

.ingredient-card__content {
  flex: 1;
  min-width: 0;
}

.ingredient-card__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: #6366f1;
  margin: 0 0 var(--spacing-xs);
}

.ingredient-card__scientific {
  font-family: var(--font-serif);
  font-size: var(--font-size-xs);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-xs);
}

.ingredient-card__link {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.ingredient-card__link:hover {
  color: #6366f1;
}

/* Disclaimer */
.formula-detail__disclaimer {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.formula-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

/* Not Found */
.formula-detail__not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.formula-detail__back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .formula-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .formula-detail__icon {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }
}
</style>
