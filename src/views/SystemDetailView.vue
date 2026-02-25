<template>
  <div class="system-detail-view">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/systems')">{{ t('systems.title') }}</router-link>
        <span>/</span>
        <span>{{ systemInfo?.name }}</span>
      </nav>

      <div v-if="systemInfo">
        <header class="system-hero" :class="`system-hero--${system}`">
          <span class="system-hero__icon">{{ systemInfo.icon }}</span>
          <h1 class="system-hero__title">{{ systemInfo.name }}</h1>
          <p class="system-hero__native">{{ systemInfo.nativeName }}</p>
          <p class="system-hero__description">{{ systemInfo.description }}</p>
        </header>

        <!-- Statistics -->
        <section class="system-stats">
          <div class="system-stat">
            <span class="system-stat__value">{{ profileCount }}</span>
            <span class="system-stat__label">{{ t('systems.preparations') }}</span>
          </div>
          <div class="system-stat">
            <span class="system-stat__value">{{ referenceDataCount }}</span>
            <span class="system-stat__label">{{ t('systems.referenceData') }}</span>
          </div>
        </section>

        <!-- Reference Data Categories -->
        <section class="system-section">
          <h2 class="section-title">
            {{ t('systems.referenceData') }}
            <router-link
              v-if="referenceCategories.length > 0"
              :to="localePath(`/systems/${system}/natures`)"
              class="section-title__link"
            >
              {{ t('systems.viewAll') }} →
            </router-link>
          </h2>
          <div class="reference-categories">
            <router-link
              v-for="category in referenceCategories"
              :key="category.id"
              :to="localePath(`/systems/${system}/${category.id}`)"
              class="reference-category"
            >
              <h3 class="reference-category__name">{{ category.name }}</h3>
              <p class="reference-category__count">{{ category.items.length }} {{ t('systems.items') }}</p>
              <div class="reference-category__items">
                <span
                  v-for="item in category.items.slice(0, 6)"
                  :key="item.id"
                  class="reference-tag"
                  :class="`reference-tag--${system}`"
                >
                  {{ item.label }}
                </span>
                <span v-if="category.items.length > 6" class="reference-tag reference-tag--more">
                  +{{ category.items.length - 6 }} more
                </span>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Preparations with this profile -->
        <section class="system-section">
          <h2 class="section-title">{{ t('systems.preparationsWithProfile') }}</h2>
          <div v-if="preparations.length > 0" class="preparations-grid">
            <router-link
              v-for="prep in preparations.slice(0, 12)"
              :key="getSlug(prep)"
              :to="localePath(`/preparations/${getSlug(prep)}`)"
              class="preparation-card"
            >
              <div class="preparation-card__image-wrapper">
                <img
                  v-if="getImage(prep)"
                  :src="getImage(prep)"
                  :alt="getPrepName(prep)"
                  class="preparation-card__image"
                />
                <div v-else class="preparation-card__placeholder">
                  <span>🌿</span>
                </div>
              </div>
              <div class="preparation-card__content">
                <h4 class="preparation-card__name">{{ getPrepName(prep) }}</h4>
                <p v-if="getScientificName(prep)" class="preparation-card__scientific">
                  {{ getScientificName(prep) }}
                </p>
              </div>
            </router-link>
          </div>
          <div v-else class="preparations-empty">
            <p>{{ t('systems.noPreparations') }}</p>
          </div>
          <div v-if="preparations.length > 12" class="preparations-more">
            <p>{{ t('systems.andMore', { count: preparations.length - 12 }) }}</p>
          </div>
        </section>

        <!-- About this system -->
        <section class="system-section system-section--about">
          <h2 class="section-title">{{ t('systems.aboutSystem') }}</h2>
          <p>{{ systemInfo.aboutText }}</p>
        </section>
      </div>

      <div v-else class="system-not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('systems.systemNotFound') }}</p>
        <router-link :to="localePath('/systems')" class="back-link">
          &larr; {{ t('systems.backToSystems') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { usePreparationLocalizer, useSourcePlant } from '@/composables/useHerbData'

const route = useRoute()
const { t, locale } = useI18n()
const system = computed(() => route.params.system)

const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// System information
const systemConfigs = {
  tcm: {
    icon: '☯️',
    name: 'Traditional Chinese Medicine',
    nativeName: '中医 / 中醫',
    description: 'Ancient medical system based on balance of Qi, Yin-Yang, and Five Elements theory',
    aboutText: 'Traditional Chinese Medicine (TCM) is a comprehensive medical system that has been practiced for over 2,500 years. It emphasizes the balance of vital energy (Qi) and the harmony between Yin and Yang forces. TCM classifies medicinal preparations by their thermal nature, flavors, and the meridians they affect.'
  },
  western: {
    icon: '🌿',
    name: 'Western Herbalism',
    nativeName: 'Western Herbal Medicine',
    description: 'European and North American herbal traditions based on pharmacological actions',
    aboutText: 'Western Herbalism encompasses the medicinal traditions of Europe and North America. It focuses on the pharmacological actions of herbs and their effects on specific body systems and organs. This system emphasizes scientific understanding of plant constituents and their therapeutic applications.'
  },
  ayurveda: {
    icon: '🪷',
    name: 'Ayurveda',
    nativeName: 'आयुर्वेद / Ayurveda',
    description: 'Ancient Indian medical system based on three doshas: Vata, Pitta, Kapha',
    aboutText: 'Ayurveda is a 5,000-year-old system of natural healing from India. It is based on the concept of three doshas (Vata, Pitta, Kapha) that govern physiological activity. Ayurvedic medicine classifies herbs by their taste (rasa), qualities (guna), potency (virya), and post-digestive effect (vipaka).'
  },
  persian: {
    icon: '🌙',
    name: 'Persian Medicine',
    nativeName: 'طب یونانی / Unani Medicine',
    description: 'Greco-Arabic medical tradition based on four humors and temperaments',
    aboutText: 'Persian Medicine (also known as Unani Medicine) originated from ancient Greek medicine and was developed by Arab and Persian physicians. It is based on the theory of four humors and four temperaments (Hot, Cold, Wet, Dry). Treatments aim to restore balance through diet, lifestyle, and herbal remedies.'
  },
  mongolian: {
    icon: '🏔️',
    name: 'Mongolian Traditional Medicine',
    nativeName: 'Монгол эмнэлэг / Traditional Tibetan Medicine',
    description: 'Central Asian medical system integrating Tibetan and Mongolian traditions',
    aboutText: 'Mongolian Traditional Medicine is a syncretic system combining Tibetan Buddhist medicine with indigenous Mongolian practices. It is based on the theory of three roots (Heyi, Xila, Badagan) similar to the Ayurvedic doshas. The system uses five elements and six tastes to classify medicinal substances.'
  }
}

const systemInfo = computed(() => systemConfigs[system.value])

// Profile count
const stats = dataset.getSystemStats()
const profileCount = computed(() => stats[system.value] || 0)

// Reference data for each system
const referenceCategories = computed(() => {
  const categories = []

  if (system.value === 'tcm') {
    categories.push({
      id: 'natures',
      name: t('tcm.natures') || 'Thermal Natures',
      items: dataset.getAllNatures().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    categories.push({
      id: 'flavors',
      name: t('tcm.flavors') || 'Flavors',
      items: dataset.getAllFlavors().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    categories.push({
      id: 'meridians',
      name: t('tcm.meridians') || 'Meridians',
      items: dataset.getAllMeridians().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    categories.push({
      id: 'categories',
      name: t('tcm.categories') || 'Categories',
      items: dataset.getAllCategories().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    // Add TCM Actions
    const tcmActions = dataset.getAllTCMActions()
    if (tcmActions.length > 0) {
      categories.push({
        id: 'tcm-actions',
        name: t('tcm.actions') || 'TCM Actions',
        items: tcmActions.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
  } else if (system.value === 'western') {
    categories.push({
      id: 'actions',
      name: t('western.actions') || 'Actions',
      items: dataset.getAllActions().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    categories.push({
      id: 'organs',
      name: t('western.organs') || 'Organ Affinities',
      items: dataset.getAllOrgans().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    // Add Western Systems
    const westernSystems = dataset.getAllWesternSystems()
    if (westernSystems.length > 0) {
      categories.push({
        id: 'systems',
        name: t('western.systems') || 'Body Systems',
        items: westernSystems.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
  } else if (system.value === 'ayurveda') {
    categories.push({
      id: 'rasa',
      name: t('ayurveda.rasas') || 'Tastes (Rasa)',
      items: dataset.getAllRasas().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    categories.push({
      id: 'guna',
      name: t('ayurveda.gunas') || 'Qualities (Guna)',
      items: dataset.getAllGunas().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    categories.push({
      id: 'virya',
      name: t('ayurveda.viryas') || 'Potency (Virya)',
      items: dataset.getAllViryas().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    categories.push({
      id: 'vipaka',
      name: t('ayurveda.vipakas') || 'Post-digestive (Vipaka)',
      items: dataset.getAllVipakas().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    // Add Doshas
    const doshas = dataset.getAllDoshas()
    if (doshas.length > 0) {
      categories.push({
        id: 'doshas',
        name: t('ayurveda.doshas') || 'Doshas',
        items: doshas.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
    // Add Karmas
    const karmas = dataset.getAllKarmas()
    if (karmas.length > 0) {
      categories.push({
        id: 'karmas',
        name: t('ayurveda.karmas') || 'Karmas (Actions)',
        items: karmas.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
    // Add Mahabhutas
    const mahabhutas = dataset.getAllMahabhutas()
    if (mahabhutas.length > 0) {
      categories.push({
        id: 'mahabhutas',
        name: t('ayurveda.mahabhutas') || 'Mahabhutas (Elements)',
        items: mahabhutas.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
    // Add Ayurveda Categories
    const ayurvedaCategories = dataset.getAllAyurvedaCategories()
    if (ayurvedaCategories.length > 0) {
      categories.push({
        id: 'ayurveda-categories',
        name: t('ayurveda.categories') || 'Categories',
        items: ayurvedaCategories.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
    // Add Prabhavas
    const prabhavas = dataset.getAllPrabhavas()
    if (prabhavas.length > 0) {
      categories.push({
        id: 'prabhavas',
        name: t('ayurveda.prabhavas') || 'Prabhavas (Special Effects)',
        items: prabhavas.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
  } else if (system.value === 'persian') {
    categories.push({
      id: 'temperaments',
      name: t('persian.temperaments') || 'Temperaments',
      items: dataset.getAllTemperaments().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    // Add Persian Elements
    const persianElements = dataset.getAllPersianElements()
    if (persianElements.length > 0) {
      categories.push({
        id: 'persian-elements',
        name: t('persian.elements') || 'Elements',
        items: persianElements.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
    // Add Persian Degrees
    const persianDegrees = dataset.getAllPersianDegrees()
    if (persianDegrees.length > 0) {
      categories.push({
        id: 'degrees',
        name: t('persian.degrees') || 'Degrees',
        items: persianDegrees.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
  } else if (system.value === 'mongolian') {
    categories.push({
      id: 'elements',
      name: t('mongolian.elements') || 'Elements',
      items: dataset.getAllMongolianElements().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    categories.push({
      id: 'tastes',
      name: t('mongolian.tastes') || 'Tastes',
      items: dataset.getAllMongolianTastes().map(item => ({
        id: item['@id'],
        label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
      }))
    })
    // Add Mongolian Roots
    const mongolianRoots = dataset.getAllMongolianRoots()
    if (mongolianRoots.length > 0) {
      categories.push({
        id: 'roots',
        name: t('mongolian.roots') || 'Three Roots',
        items: mongolianRoots.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
    // Add Mongolian Potencies
    const mongolianPotencies = dataset.getAllMongolianPotencies()
    if (mongolianPotencies.length > 0) {
      categories.push({
        id: 'potencies',
        name: t('mongolian.potencies') || 'Potencies',
        items: mongolianPotencies.map(item => ({
          id: item['@id'],
          label: item.prefLabel?.[locale.value] || item.prefLabel?.en || extractLabel(item['@id'])
        }))
      })
    }
  }

  return categories
})

const referenceDataCount = computed(() => {
  return referenceCategories.value.reduce((sum, cat) => sum + cat.items.length, 0)
})

// Preparations with this profile
const preparations = computed(() => {
  const allPreps = dataset.getAllPreparations()

  if (system.value === 'tcm') {
    return allPreps.filter(p => p.hasTCMProfile)
  } else if (system.value === 'western') {
    return allPreps.filter(p => p.hasWesternProfile)
  } else if (system.value === 'ayurveda') {
    return allPreps.filter(p => p.hasAyurvedaProfile)
  } else if (system.value === 'persian') {
    return allPreps.filter(p => p.hasPersianProfile)
  } else if (system.value === 'mongolian') {
    return allPreps.filter(p => p.hasMongolianProfile)
  }
  return []
})

// Helper functions
function extractLabel(iri) {
  if (!iri) return ''
  const parts = iri.split('/')
  return parts[parts.length - 1] || iri
}

function getSlug(prep) {
  if (!prep?.['@id']) return ''
  const parts = prep['@id'].split('/')
  return parts[parts.length - 1] || ''
}

const localizer = usePreparationLocalizer()

function getPrepName(prep) {
  return localizer.getName(prep) || getSlug(prep)
}

function getScientificName(prep) {
  const s = getSlug(prep)
  const plant = useSourcePlant(s)
  return plant.value?.scientificName || null
}

function getImage(prep) {
  const s = getSlug(prep)
  const plant = useSourcePlant(s)
  return plant.value?.image || null
}
</script>

<style scoped>
.system-detail-view {
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

/* Hero */
.system-hero {
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-2xl);
}

.system-hero--tcm { background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.02) 100%); }
.system-hero--western { background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%); }
.system-hero--ayurveda { background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.02) 100%); }
.system-hero--persian { background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%); }
.system-hero--mongolian { background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.02) 100%); }

.system-hero__icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--spacing-md);
}

.system-hero__title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-xs);
}

.system-hero__native {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
}

.system-hero__description {
  max-width: 600px;
  margin: 0 auto;
  color: var(--color-text);
}

/* Stats */
.system-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}

.system-stat {
  text-align: center;
}

.system-stat__value {
  display: block;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.system-stat__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* Sections */
.system-section {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.section-title__link {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-primary);
  text-decoration: none;
}

.section-title__link:hover {
  text-decoration: underline;
}

/* Reference Categories */
.reference-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.reference-category {
  display: block;
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.reference-category:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.reference-category__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-xs);
}

.reference-category__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-sm);
}

.reference-category__items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.reference-tag {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  background: var(--color-surface-alt);
}

.reference-tag--tcm { background: rgba(34, 197, 94, 0.15); color: #166534; }
.reference-tag--western { background: rgba(59, 130, 246, 0.15); color: #1e40af; }
.reference-tag--ayurveda { background: rgba(249, 115, 22, 0.15); color: #c2410c; }
.reference-tag--persian { background: rgba(139, 92, 246, 0.15); color: #6b21a8; }
.reference-tag--mongolian { background: rgba(6, 182, 212, 0.15); color: #0e7490; }
.reference-tag--more { background: var(--color-border); color: var(--color-text-light); }

/* Preparations Grid */
.preparations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.preparation-card {
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  overflow: hidden;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.preparation-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.preparation-card__image-wrapper {
  height: 120px;
  overflow: hidden;
  background: var(--color-surface);
}

.preparation-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preparation-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
}

.preparation-card__content {
  padding: var(--spacing-sm);
}

.preparation-card__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-xs);
}

.preparation-card__scientific {
  font-size: var(--font-size-xs);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
}

.preparations-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-light);
}

.preparations-more {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-light);
}

/* About Section */
.system-section--about p {
  line-height: var(--line-height-relaxed);
  color: var(--color-text-light);
}

/* Not Found */
.system-not-found {
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
  .system-stats {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .reference-categories {
    grid-template-columns: 1fr;
  }

  .preparations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
