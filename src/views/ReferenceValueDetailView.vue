<template>
  <div class="reference-detail-view">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/systems')">{{ t('systems.title') }}</router-link>
        <span>/</span>
        <router-link :to="localePath(`/systems/${system}`)">{{ systemInfo?.name }}</router-link>
        <span>/</span>
        <router-link :to="localePath(`/systems/${system}/${refType}`)">{{ referenceInfo?.name }}</router-link>
        <span>/</span>
        <span>{{ itemLabel }}</span>
      </nav>

      <div v-if="isValidSystem && isValidRefType && referenceItem">
        <header class="reference-hero" :class="`reference-hero--${system}`">
          <span class="reference-hero__icon">{{ systemInfo?.icon }}</span>
          <h1 class="reference-hero__title">{{ itemLabel }}</h1>

          <!-- Translations -->
          <div v-if="otherTranslations.length > 0" class="reference-hero__translations">
            <span v-for="trans in otherTranslations" :key="trans.lang" class="translation-tag">
              {{ trans.lang }}: {{ trans.value }}
            </span>
          </div>

          <p v-if="itemDescription" class="reference-hero__description">{{ itemDescription }}</p>
        </header>

        <!-- Preparations using this value -->
        <section class="preparations-section">
          <h2 class="section-title">{{ t('reference.usingPreparations') }}</h2>

          <div v-if="preparations.length > 0" class="preparations-grid">
            <router-link
              v-for="prep in preparations"
              :key="extractLabel(prep['@id'])"
              :to="localePath(`/preparations/${extractLabel(prep['@id'])}`)"
              class="preparation-card"
              :class="`preparation-card--${system}`"
            >
              <div class="preparation-card__content">
                <h3 class="preparation-card__name">{{ getPrepName(prep) }}</h3>
                <p v-if="getPrepDescription(prep)" class="preparation-card__desc">
                  {{ truncate(getPrepDescription(prep), 100) }}
                </p>
              </div>
            </router-link>
          </div>

          <div v-else class="empty-state">
            <p>{{ t('reference.noPreparations') }}</p>
          </div>
        </section>
      </div>

      <div v-else class="reference-not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('reference.notFound') }}</p>
        <router-link :to="localePath(`/systems/${system}/${refType}`)" class="back-link">
          &larr; {{ t('reference.backToList') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { usePreparationLocalizer } from '@/composables/useHerbData'

const props = defineProps({
  system: { type: String, required: true },
  refType: { type: String, required: true },
  slug: { type: String, required: true }
})

const { t, locale } = useI18n()

// Validate system and refType
const isValidSystem = computed(() => !!systemConfigs[props.system])
const isValidRefType = computed(() => !!referenceTypeConfigs[props.refType])

const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// System info
const systemConfigs = {
  tcm: {
    icon: '☯️',
    nameKey: 'systems.tcm.name'
  },
  western: {
    icon: '🌿',
    nameKey: 'systems.western.name'
  },
  ayurveda: {
    icon: '🪷',
    nameKey: 'systems.ayurveda.name'
  },
  persian: {
    icon: '🌙',
    nameKey: 'systems.persian.name'
  },
  mongolian: {
    icon: '🏔️',
    nameKey: 'systems.mongolian.name'
  }
}

const systemInfo = computed(() => {
  const config = systemConfigs[props.system]
  if (!config) return null
  return {
    icon: config.icon,
    name: t(config.nameKey)
  }
})

// Reference type info - maps refType to dataset getter
const referenceTypeConfigs = {
  // TCM
  natures: {
    getItem: (slug) => findReferenceItem(dataset.getAllNatures(), slug)
  },
  flavors: {
    getItem: (slug) => findReferenceItem(dataset.getAllFlavors(), slug)
  },
  meridians: {
    getItem: (slug) => findReferenceItem(dataset.getAllMeridians(), slug)
  },
  categories: {
    getItem: (slug) => findReferenceItem(dataset.getAllCategories(), slug)
  },
  // Western
  actions: {
    getItem: (slug) => findReferenceItem(dataset.getAllActions(), slug)
  },
  organs: {
    getItem: (slug) => findReferenceItem(dataset.getAllOrgans(), slug)
  },
  // Ayurveda
  rasa: {
    getItem: (slug) => findReferenceItem(dataset.getAllRasas(), slug)
  },
  guna: {
    getItem: (slug) => findReferenceItem(dataset.getAllGunas(), slug)
  },
  virya: {
    getItem: (slug) => findReferenceItem(dataset.getAllViryas(), slug)
  },
  vipaka: {
    getItem: (slug) => findReferenceItem(dataset.getAllVipakas(), slug)
  },
  // Persian
  temperaments: {
    getItem: (slug) => findReferenceItem(dataset.getAllTemperaments(), slug)
  },
  // Mongolian
  elements: {
    getItem: (slug) => findReferenceItem(dataset.getAllMongolianElements(), slug)
  },
  tastes: {
    getItem: (slug) => findReferenceItem(dataset.getAllMongolianTastes(), slug)
  }
}

// Helper to find reference item by slug - handles full URIs in @id
function findReferenceItem(items, slug) {
  return items.find(item => {
    const id = item['@id'] || ''
    // Match if slug appears at the end of the URI or equals the ID
    return id.endsWith(`/${slug}`) || id === slug
  }) || null
}

const referenceInfo = computed(() => {
  const config = referenceTypeConfigs[props.refType]
  if (!config) return null

  // Get reference type name from translation
  const names = {
    natures: t('tcm.natures'),
    flavors: t('tcm.flavors'),
    meridians: t('tcm.meridians'),
    categories: t('tcm.categories'),
    actions: t('western.actions'),
    organs: t('western.organs'),
    rasa: t('ayurveda.rasas'),
    guna: t('ayurveda.gunas'),
    virya: t('ayurveda.viryas'),
    vipaka: t('ayurveda.vipakas'),
    temperaments: t('persian.temperaments'),
    elements: t('mongolian.elements'),
    tastes: t('mongolian.tastes')
  }

  return { name: names[props.refType] || props.refType }
})

// Get the reference item by slug
const referenceItem = computed(() => {
  const config = referenceTypeConfigs[props.refType]
  if (!config) return null
  return config.getItem(props.slug)
})

// Get label with locale fallback
const itemLabel = computed(() => {
  if (!referenceItem.value) return ''
  const prefLabel = referenceItem.value.prefLabel
  if (!prefLabel) return extractLabel(referenceItem.value['@id'])

  return prefLabel[locale.value] || prefLabel.en || extractLabel(referenceItem.value['@id'])
})

// Get description with locale fallback
const itemDescription = computed(() => {
  if (!referenceItem.value) return ''
  const desc = referenceItem.value.description
  if (!desc) return ''

  return desc[locale.value] || desc.en || ''
})

// Get other translations (not current locale)
const otherTranslations = computed(() => {
  if (!referenceItem.value?.prefLabel) return []

  return Object.entries(referenceItem.value.prefLabel)
    .filter(([lang]) => lang !== locale.value && lang !== 'en')
    .map(([lang, value]) => ({ lang, value }))
})

function extractLabel(iri) {
  if (!iri) return ''
  const parts = iri.split('/')
  return parts[parts.length - 1] || iri
}

// Find preparations that use this reference value
const preparations = computed(() => {
  if (!referenceItem.value) return []

  const itemId = referenceItem.value['@id']
  const itemSlug = props.slug

  // Get profile cache based on system
  let profileCache
  if (props.system === 'tcm') profileCache = dataset.tcmCache
  else if (props.system === 'western') profileCache = dataset.westernCache
  else if (props.system === 'ayurveda') profileCache = dataset.ayurvedaCache
  else if (props.system === 'persian') profileCache = dataset.persianCache
  else if (props.system === 'mongolian') profileCache = dataset.mongolianCache

  if (!profileCache) return []

  // Map refType to profile getter
  const refTypeGetters = {
    natures: (p) => p.hasNature ? [p.hasNature['@id'] || p.hasNature] : [],
    flavors: (p) => p.hasFlavor?.map(f => f['@id'] || f) || [],
    meridians: (p) => p.entersMeridian?.map(m => m['@id'] || m) || [],
    categories: (p) => p.hasCategory ? [p.hasCategory['@id'] || p.hasCategory] : [],
    actions: (p) => p.hasAction?.map(a => a['@id'] || a) || [],
    organs: (p) => p.hasOrganAffinity?.map(o => o['@id'] || o) || [],
    rasa: (p) => p.hasRasa?.map(r => r['@id'] || r) || [],
    guna: (p) => p.hasGuna?.map(g => g['@id'] || g) || [],
    virya: (p) => p.hasVirya ? [p.hasVirya['@id'] || p.hasVirya] : [],
    vipaka: (p) => p.hasVipaka ? [p.hasVipaka['@id'] || p.hasVipaka] : [],
    temperaments: (p) => p.hasTemperament ? [p.hasTemperament['@id'] || p.hasTemperament] : [],
    elements: (p) => p.hasElement?.map(e => e['@id'] || e) || [],
    tastes: (p) => p.hasTaste?.map(t => t['@id'] || t) || []
  }

  const getter = refTypeGetters[props.refType]
  if (!getter) return []

  const result = []
  const allPreps = dataset.getAllPreparations()

  allPreps.forEach(prep => {
    // Get the right profile reference based on system
    let profileRef
    if (props.system === 'tcm') profileRef = prep.hasTCMProfile
    else if (props.system === 'western') profileRef = prep.hasWesternProfile
    else if (props.system === 'ayurveda') profileRef = prep.hasAyurvedaProfile
    else if (props.system === 'persian') profileRef = prep.hasPersianProfile
    else if (props.system === 'mongolian') profileRef = prep.hasMongolianProfile

    if (!profileRef) return

    const profileRefs = Array.isArray(profileRef) ? profileRef : [profileRef]

    for (const ref of profileRefs) {
      const profileId = ref['@id'] || ref
      const profileSlug = profileId.split('/').pop()

      const profile = profileCache.get(profileSlug)
      if (!profile) continue

      const values = getter(profile)
      if (!values || values.length === 0) continue

      // Check if any value matches our item
      const matches = values.some(v =>
        v === itemId ||
        v?.includes(itemSlug) ||
        extractLabel(v) === itemSlug
      )

      if (matches) {
        result.push(prep)
        break
      }
    }
  })

  return result
})

const localizer = usePreparationLocalizer()

function getPrepName(prep) {
  return localizer.getName(prep) || extractLabel(prep?.['@id'])
}

function getPrepDescription(prep) {
  if (!prep?.description) return ''
  return prep.description[locale.value] || prep.description.en || ''
}

function truncate(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
</script>

<style scoped>
.reference-detail-view {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - var(--header-height));
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
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

/* Hero */
.reference-hero {
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-2xl);
}

.reference-hero--tcm { background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.02) 100%); }
.reference-hero--western { background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%); }
.reference-hero--ayurveda { background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.02) 100%); }
.reference-hero--persian { background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%); }
.reference-hero--mongolian { background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.02) 100%); }

.reference-hero__icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--spacing-md);
}

.reference-hero__title {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
}

.reference-hero__translations {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.translation-tag {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface-alt);
  border-radius: var(--radius-sm);
  color: var(--color-text-light);
}

.reference-hero__description {
  max-width: 500px;
  margin: 0 auto;
  color: var(--color-text-light);
}

/* Preparations Section */
.preparations-section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
}

.preparations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.preparation-card {
  display: block;
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border);
}

.preparation-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.preparation-card--tcm { border-left: 3px solid #22c55e; }
.preparation-card--western { border-left: 3px solid #3b82f6; }
.preparation-card--ayurveda { border-left: 3px solid #f97316; }
.preparation-card--persian { border-left: 3px solid #8b5cf6; }
.preparation-card--mongolian { border-left: 3px solid #06b6d4; }

.preparation-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-sm);
}

.preparation-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-light);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}

/* Not Found */
.reference-not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}
</style>
