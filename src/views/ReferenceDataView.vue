<template>
  <div class="reference-view">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/systems')">{{ t('systems.title') }}</router-link>
        <span>/</span>
        <router-link :to="localePath(`/systems/${system}`)">{{ systemInfo?.name }}</router-link>
        <span>/</span>
        <span>{{ referenceInfo?.name }}</span>
      </nav>

      <div v-if="referenceInfo">
        <header class="reference-hero" :class="`reference-hero--${system}`">
          <span class="reference-hero__icon">{{ systemInfo?.icon }}</span>
          <h1 class="reference-hero__title">{{ referenceInfo.name }}</h1>
          <p class="reference-hero__description">{{ referenceInfo.description }}</p>
        </header>

        <!-- Reference Items -->
        <section class="reference-section">
          <div class="reference-items">
            <router-link
              v-for="item in referenceItems"
              :key="item.id"
              :to="localePath(`/systems/${system}/${refType}/${item.slug}`)"
              class="reference-item"
            >
              <div class="reference-item__header">
                <h3 class="reference-item__label">{{ item.label }}</h3>
                <span class="reference-item__count">
                  {{ item.preparations.length }} {{ t('reference.preparations') }}
                </span>
              </div>

              <!-- Translations -->
              <div v-if="Object.keys(item.translations).length > 0" class="reference-item__translations">
                <span v-for="(value, lang) in item.translations" :key="lang" class="translation-tag">
                  {{ lang }}: {{ value }}
                </span>
              </div>

              <!-- Preparations using this value -->
              <div v-if="item.preparations.length > 0" class="reference-item__preparations">
                <span
                  v-for="prep in item.preparations.slice(0, 5)"
                  :key="getSlug(prep)"
                  class="prep-chip"
                  :class="`prep-chip--${system}`"
                  @click.stop.prevent="goToPrep(prep)"
                >
                  {{ getPrepName(prep) }}
                </span>
                <span v-if="item.preparations.length > 5" class="prep-chip prep-chip--more">
                  +{{ item.preparations.length - 5 }} more
                </span>
              </div>
              <div v-else class="reference-item__empty">
                <p>{{ t('reference.noPreparations') }}</p>
              </div>
            </router-link>
          </div>

          <div v-if="referenceItems.length === 0" class="reference-empty">
            <p>{{ t('reference.noItems') }}</p>
          </div>
        </section>
      </div>

      <div v-else class="reference-not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('reference.notFound') }}</p>
        <router-link :to="localePath('/systems')" class="back-link">
          &larr; {{ t('systems.backToSystems') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { usePreparationLocalizer } from '@/composables/useHerbData'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const system = computed(() => route.params.system)
const refType = computed(() => route.params.refType)

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
  },
  herbal: {
    icon: '💊',
    nameKey: 'herbal.title'
  }
}

const systemInfo = computed(() => {
  const config = systemConfigs[system.value]
  if (!config) return null
  return {
    icon: config.icon,
    name: t(config.nameKey)
  }
})

// Reference type info
const referenceTypes = {
  // TCM
  natures: {
    name: t('tcm.natures') || 'Thermal Natures',
    description: t('reference.naturesDesc') || 'Classification of herbs by their thermal effect on the body',
    getItems: () => dataset.getAllNatures(),
    getValue: (profile) => {
      if (!profile?.hasNature) return null
      const nature = profile.hasNature['@id'] || profile.hasNature
      return nature
    }
  },
  flavors: {
    name: t('tcm.flavors') || 'Flavors',
    description: t('reference.flavorsDesc') || 'The five flavors and their corresponding organ relationships',
    getItems: () => dataset.getAllFlavors(),
    getValue: (profile) => {
      if (!profile?.hasFlavor) return []
      return profile.hasFlavor.map(f => f['@id'] || f)
    }
  },
  meridians: {
    name: t('tcm.meridians') || 'Meridians',
    description: t('reference.meridiansDesc') || 'The energy channels that herbs are believed to influence',
    getItems: () => dataset.getAllMeridians(),
    getValue: (profile) => {
      if (!profile?.entersMeridian) return []
      return profile.entersMeridian.map(m => m['@id'] || m)
    }
  },
  categories: {
    name: t('tcm.categories') || 'Categories',
    description: t('reference.categoriesDesc') || 'Functional categories of TCM herbs',
    getItems: () => dataset.getAllCategories(),
    getValue: (profile) => {
      if (!profile?.hasCategory) return null
      const cat = profile.hasCategory['@id'] || profile.hasCategory
      return cat
    }
  },
  'tcm-actions': {
    name: t('tcm.actions') || 'TCM Actions',
    description: t('reference.tcmActionsDesc') || 'Therapeutic actions in Traditional Chinese Medicine',
    getItems: () => dataset.getAllTCMActions(),
    getValue: (profile) => {
      if (!profile?.actions) return []
      return profile.actions.map(a => a['@id'] || a)
    }
  },
  // Western
  actions: {
    name: t('western.actions') || 'Actions',
    description: t('reference.actionsDesc') || 'Pharmacological actions of herbal preparations',
    getItems: () => dataset.getAllActions(),
    getValue: (profile) => {
      if (!profile?.hasAction) return []
      return profile.hasAction.map(a => a['@id'] || a)
    }
  },
  organs: {
    name: t('western.organs') || 'Organ Affinities',
    description: t('reference.organsDesc') || 'Body organs and systems that herbs primarily affect',
    getItems: () => dataset.getAllOrgans(),
    getValue: (profile) => {
      if (!profile?.hasOrganAffinity) return []
      return profile.hasOrganAffinity.map(o => o['@id'] || o)
    }
  },
  systems: {
    name: t('western.systems') || 'Body Systems',
    description: t('reference.systemsDesc') || 'Body systems that herbs affect',
    getItems: () => dataset.getAllWesternSystems(),
    getValue: (profile) => {
      if (!profile?.hasSystemAffinity) return []
      return profile.hasSystemAffinity.map(s => s['@id'] || s)
    }
  },
  // Ayurveda
  rasa: {
    name: t('ayurveda.rasas') || 'Tastes (Rasa)',
    description: t('reference.rasaDesc') || 'Six tastes in Ayurveda',
    getItems: () => dataset.getAllRasas(),
    getValue: (profile) => {
      if (!profile?.hasRasa) return []
      return profile.hasRasa.map(r => r['@id'] || r)
    }
  },
  guna: {
    name: t('ayurveda.gunas') || 'Qualities (Guna)',
    description: t('reference.gunaDesc') || 'Twenty qualities of substances',
    getItems: () => dataset.getAllGunas(),
    getValue: (profile) => {
      if (!profile?.hasGuna) return []
      return profile.hasGuna.map(g => g['@id'] || g)
    }
  },
  virya: {
    name: t('ayurveda.viryas') || 'Potency (Virya)',
    description: t('reference.viryaDesc') || 'Heating or cooling potency',
    getItems: () => dataset.getAllViryas(),
    getValue: (profile) => {
      if (!profile?.hasVirya) return null
      const virya = profile.hasVirya['@id'] || profile.hasVirya
      return virya
    }
  },
  vipaka: {
    name: t('ayurveda.vipakas') || 'Post-digestive (Vipaka)',
    description: t('reference.vipakaDesc') || 'Post-digestive effect',
    getItems: () => dataset.getAllVipakas(),
    getValue: (profile) => {
      if (!profile?.hasVipaka) return null
      const vipaka = profile.hasVipaka['@id'] || profile.hasVipaka
      return vipaka
    }
  },
  doshas: {
    name: t('ayurveda.doshas') || 'Doshas',
    description: t('reference.doshasDesc') || 'Three constitutional types in Ayurveda',
    getItems: () => dataset.getAllDoshas(),
    getValue: (profile) => {
      if (!profile?.affectsDosha) return []
      const doshas = []
      if (profile.affectsDosha.vata) doshas.push('vata')
      if (profile.affectsDosha.pitta) doshas.push('pitta')
      if (profile.affectsDosha.kapha) doshas.push('kapha')
      return doshas
    }
  },
  karmas: {
    name: t('ayurveda.karmas') || 'Karmas (Actions)',
    description: t('reference.karmasDesc') || 'Therapeutic actions in Ayurveda',
    getItems: () => dataset.getAllKarmas(),
    getValue: (profile) => {
      if (!profile?.karma) return []
      return profile.karma.map(k => k['@id'] || k)
    }
  },
  mahabhutas: {
    name: t('ayurveda.mahabhutas') || 'Mahabhutas (Elements)',
    description: t('reference.mahabhutasDesc') || 'Five great elements in Ayurveda',
    getItems: () => dataset.getAllMahabhutas(),
    getValue: (profile) => {
      if (!profile?.hasMahabhuta) return []
      return profile.hasMahabhuta.map(m => m['@id'] || m)
    }
  },
  'ayurveda-categories': {
    name: t('ayurveda.categories') || 'Categories',
    description: t('reference.ayurvedaCategoriesDesc') || 'Classification categories for Ayurvedic herbs based on therapeutic actions',
    getItems: () => dataset.getAllAyurvedaCategories(),
    getValue: (profile) => {
      if (!profile?.ayurvedaCategory) return null
      const cat = profile.ayurvedaCategory['@id'] || profile.ayurvedaCategory
      return cat
    }
  },
  prabhavas: {
    name: t('ayurveda.prabhavas') || 'Prabhavas (Special Effects)',
    description: t('reference.prabhavasDesc') || 'Unique special effects of herbs that cannot be predicted from other properties',
    getItems: () => dataset.getAllPrabhavas(),
    getValue: (profile) => {
      if (!profile?.hasPrabhava) return []
      return profile.hasPrabhava.map(p => p['@id'] || p)
    }
  },
  // Persian
  temperaments: {
    name: t('persian.temperaments') || 'Temperaments',
    description: t('reference.temperamentsDesc') || 'Four temperaments in Unani medicine',
    getItems: () => dataset.getAllTemperaments(),
    getValue: (profile) => {
      if (!profile?.hasTemperament) return null
      const temp = profile.hasTemperament['@id'] || profile.hasTemperament
      return temp
    }
  },
  'persian-elements': {
    name: t('persian.elements') || 'Elements',
    description: t('reference.persianElementsDesc') || 'Four elements in Persian medicine',
    getItems: () => dataset.getAllPersianElements(),
    getValue: (profile) => {
      if (!profile?.hasElement) return []
      return profile.hasElement.map(e => e['@id'] || e)
    }
  },
  degrees: {
    name: t('persian.degrees') || 'Degrees',
    description: t('reference.degreesDesc') || 'Intensity degrees in Persian medicine',
    getItems: () => dataset.getAllPersianDegrees(),
    getValue: (profile) => {
      if (!profile?.temperamentDegree) return null
      return profile.temperamentDegree
    }
  },
  // Mongolian
  elements: {
    name: t('mongolian.elements') || 'Elements',
    description: t('reference.elementsDesc') || 'Five elements in Mongolian medicine',
    getItems: () => dataset.getAllMongolianElements(),
    getValue: (profile) => {
      if (!profile?.hasElement) return []
      return profile.hasElement.map(e => e['@id'] || e)
    }
  },
  tastes: {
    name: t('mongolian.tastes') || 'Tastes',
    description: t('reference.tastesDesc') || 'Six tastes in Mongolian medicine',
    getItems: () => dataset.getAllMongolianTastes(),
    getValue: (profile) => {
      if (!profile?.hasTaste) return []
      return profile.hasTaste.map(t => t['@id'] || t)
    }
  },
  roots: {
    name: t('mongolian.roots') || 'Three Roots',
    description: t('reference.rootsDesc') || 'Three root energies in Mongolian medicine',
    getItems: () => dataset.getAllMongolianRoots(),
    getValue: (profile) => {
      if (!profile?.affectsRoots) return []
      const roots = []
      if (profile.affectsRoots.heyi) roots.push('heyi')
      if (profile.affectsRoots.xila) roots.push('xila')
      if (profile.affectsRoots.badagan) roots.push('badagan')
      return roots
    }
  },
  potencies: {
    name: t('mongolian.potencies') || 'Potencies',
    description: t('reference.potenciesDesc') || 'Therapeutic potencies in Mongolian medicine',
    getItems: () => dataset.getAllMongolianPotencies(),
    getValue: (profile) => {
      if (!profile?.hasPotency) return []
      return profile.hasPotency.map(p => p['@id'] || p)
    }
  },
  // Herbal vocabulary (general)
  forms: {
    name: t('herbal.forms') || 'Preparation Forms',
    description: t('reference.formsDesc') || 'Physical forms of herbal preparations',
    getItems: () => dataset.getAllHerbalForms(),
    getValue: (prep) => {
      if (!prep?.form) return null
      return prep.form['@id'] || prep.form
    }
  },
  methods: {
    name: t('herbal.methods') || 'Preparation Methods',
    description: t('reference.methodsDesc') || 'Methods of preparing herbal materials',
    getItems: () => dataset.getAllHerbalMethods(),
    getValue: (prep) => {
      if (!prep?.preparationMethod) return null
      return prep.preparationMethod['@id'] || prep.preparationMethod
    }
  }
}

const referenceInfo = computed(() => referenceTypes[refType.value])

// Get reference items and find preparations
const referenceItems = computed(() => {
  if (!referenceInfo.value) return []

  const items = referenceInfo.value.getItems()
  const allPreps = dataset.getAllPreparations()

  return items.map(item => {
    const itemId = item['@id']
    const slug = itemId.split('/').pop()
    const label = item.prefLabel?.[locale.value] ||
                  item.prefLabel?.en ||
                  extractLabel(itemId)

    // Get translations
    const translations = {}
    if (item.prefLabel) {
      Object.entries(item.prefLabel).forEach(([lang, value]) => {
        if (lang !== locale.value && lang !== 'en') {
          translations[lang] = value
        }
      })
    }

    // Find preparations that use this value
    const preparations = []

    // Handle herbal system (forms/methods are directly on preparations)
    if (system.value === 'herbal') {
      allPreps.forEach(prep => {
        const value = referenceInfo.value.getValue(prep)
        if (!value) return

        const values = Array.isArray(value) ? value : [value]
        if (values.some(v => v === itemId || v?.includes(itemId.split('/').pop()))) {
          preparations.push(prep)
        }
      })
      return { id: itemId, slug, label, translations, preparations }
    }

    // Get profile cache based on system
    let profileCache
    if (system.value === 'tcm') profileCache = dataset.tcmCache
    else if (system.value === 'western') profileCache = dataset.westernCache
    else if (system.value === 'ayurveda') profileCache = dataset.ayurvedaCache
    else if (system.value === 'persian') profileCache = dataset.persianCache
    else if (system.value === 'mongolian') profileCache = dataset.mongolianCache

    if (!profileCache) return { id: itemId, slug, label, translations, preparations: [] }

    // Find preparations that have this profile value
    allPreps.forEach(prep => {
      let profileRef
      if (system.value === 'tcm') profileRef = prep.hasTCMProfile
      else if (system.value === 'western') profileRef = prep.hasWesternProfile
      else if (system.value === 'ayurveda') profileRef = prep.hasAyurvedaProfile
      else if (system.value === 'persian') profileRef = prep.hasPersianProfile
      else if (system.value === 'mongolian') profileRef = prep.hasMongolianProfile

      if (!profileRef) return

      const profileRefs = Array.isArray(profileRef) ? profileRef : [profileRef]
      for (const ref of profileRefs) {
        const profileId = ref['@id'] || ref
        const profileSlug = profileId.split('/').pop()

        const profile = profileCache.get(profileSlug)
        if (!profile) continue

        const value = referenceInfo.value.getValue(profile)
        if (!value) continue

        const values = Array.isArray(value) ? value : [value]
        if (values.some(v => v === itemId || v?.includes(itemId.split('/').pop()))) {
          preparations.push(prep)
          break
        }
      }
    })

    return { id: itemId, slug, label, translations, preparations }
  })
})

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

function goToPrep(prep) {
  router.push(localePath(`/preparations/${getSlug(prep)}`))
}
</script>

<style scoped>
.reference-view {
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
  margin-bottom: var(--spacing-sm);
}

.reference-hero__description {
  max-width: 500px;
  margin: 0 auto;
  color: var(--color-text-light);
}

/* Reference Items */
.reference-section {
  margin-bottom: var(--spacing-2xl);
}

.reference-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.reference-item {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
}

.reference-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.reference-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.reference-item__label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.reference-item__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  background: var(--color-surface-alt);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
}

/* Translations */
.reference-item__translations {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.translation-tag {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface-alt);
  border-radius: var(--radius-sm);
  color: var(--color-text-light);
}

/* Preparations */
.reference-item__preparations {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.prep-chip {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  text-decoration: none;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.prep-chip--tcm { background: rgba(34, 197, 94, 0.15); color: #166534; }
.prep-chip--western { background: rgba(59, 130, 246, 0.15); color: #1e40af; }
.prep-chip--ayurveda { background: rgba(249, 115, 22, 0.15); color: #c2410c; }
.prep-chip--persian { background: rgba(139, 92, 246, 0.15); color: #6b21a8; }
.prep-chip--mongolian { background: rgba(6, 182, 212, 0.15); color: #0e7490; }
.prep-chip--more { background: var(--color-surface-alt); color: var(--color-text-light); cursor: default; }

.prep-chip:not(.prep-chip--more):hover {
  transform: scale(1.05);
}

.reference-item__empty {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  font-style: italic;
}

/* Empty State */
.reference-empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
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
