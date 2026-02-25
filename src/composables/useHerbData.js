/**
 * Herbapedia Data Composable (v2 Architecture)
 *
 * Preparation-centric data access. HerbalPreparation is the central entity.
 *
 * Navigation:
 *   Preparation → Botanical Source (PlantSpecies)
 *   Preparation → System Profiles (TCM, Western, etc.)
 *   Preparation → Related Preparations
 */

import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'

// ============================================================================
// Localization Helpers
// ============================================================================

function getLocalizedValue(langMap, locale, fallbackLocale = 'en') {
  if (!langMap) return null
  if (typeof langMap === 'string') return langMap
  if (typeof langMap === 'object') {
    if (langMap[locale]) return langMap[locale]
    if (locale.startsWith('zh-H') && langMap['zh-Hant']) return langMap['zh-Hant']
    if (locale.startsWith('zh-') && langMap['zh-Hans']) return langMap['zh-Hans']
    if (langMap[fallbackLocale]) return langMap[fallbackLocale]
    const keys = Object.keys(langMap)
    if (keys.length > 0) return langMap[keys[0]]
  }
  return null
}

// ============================================================================
// Preparation Queries (PRIMARY)
// ============================================================================

export function useAllPreparations() {
  return computed(() => dataset.getAllPreparations())
}

export function usePreparation(slug) {
  return computed(() => {
    const s = typeof slug === 'object' && 'value' in slug ? slug.value : slug
    return dataset.getPreparation(s) || null
  })
}

export function usePreparationsByPlant(plantSlug) {
  return computed(() => {
    const s = typeof plantSlug === 'object' && 'value' in plantSlug ? plantSlug.value : plantSlug
    return dataset.getPreparationsByPlant(s)
  })
}

export function usePreparationsByTCMCategory(category) {
  return computed(() => {
    const c = typeof category === 'object' && 'value' in category ? category.value : category
    return dataset.getPreparationsByTCMCategory(c)
  })
}

export function useRelatedPreparations(slug) {
  return computed(() => {
    const s = typeof slug === 'object' && 'value' in slug ? slug.value : slug
    return dataset.getRelatedPreparations(s)
  })
}

// ============================================================================
// Profile Queries
// ============================================================================

export function useProfilesForPreparation(slug) {
  return computed(() => {
    const s = typeof slug === 'object' && 'value' in slug ? slug.value : slug
    return dataset.getProfilesForPreparation(s)
  })
}

// ============================================================================
// Botanical Queries
// ============================================================================

export function useAllPlants() {
  return computed(() => dataset.getAllPlants())
}

export function usePlant(slug) {
  return computed(() => {
    const s = typeof slug === 'object' && 'value' in slug ? slug.value : slug
    return dataset.getPlantSpecies(s) || null
  })
}

export function useSourcePlant(prepSlug) {
  return computed(() => {
    const s = typeof prepSlug === 'object' && 'value' in prepSlug ? prepSlug.value : prepSlug
    return dataset.getSourcePlant(s)
  })
}

// ============================================================================
// Reference Data Hooks
// ============================================================================

export function useTcmReferences() {
  const { locale } = useI18n()

  const meridians = ref(dataset.getAllMeridians())
  const natures = ref(dataset.getAllNatures())
  const flavors = ref(dataset.getAllFlavors())
  const categories = ref(dataset.getAllCategories())

  function getLabel(item) {
    if (!item) return null
    // Check both prefLabel and name fields
    const labelMap = item.prefLabel || item.name
    if (!labelMap) return null
    return getLocalizedValue(labelMap, locale.value)
  }

  function getNatureLabel(natureRef) {
    if (!natureRef) return null
    const id = typeof natureRef === 'object' ? natureRef['@id'] : natureRef
    const item = dataset.getNature(id)
    const label = item ? getLabel(item) : null
    return label || id
  }

  function getFlavorLabels(flavorRefs) {
    if (!flavorRefs || !Array.isArray(flavorRefs)) return []
    return flavorRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = dataset.getFlavor(id)
      const label = item ? getLabel(item) : null
      return { id, label: label || id }
    })
  }

  function getMeridianLabels(meridianRefs) {
    if (!meridianRefs || !Array.isArray(meridianRefs)) return []
    return meridianRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = dataset.getMeridian(id)
      const label = item ? getLabel(item) : null
      return { id, label: label || id }
    })
  }

  function getCategoryLabel(categoryRef) {
    if (!categoryRef) return null
    const id = typeof categoryRef === 'object' ? categoryRef['@id'] : categoryRef
    const item = dataset.getCategory(id)
    const label = item ? getLabel(item) : null
    return label || id
  }

  return {
    meridians,
    natures,
    flavors,
    categories,
    getNatureLabel,
    getFlavorLabels,
    getMeridianLabels,
    getCategoryLabel
  }
}

export function useWesternReferences() {
  const { locale } = useI18n()

  const actions = ref(dataset.getAllActions())
  const organs = ref(dataset.getAllOrgans())

  function getLabel(item) {
    if (!item) return null
    // Check both prefLabel and name fields
    const labelMap = item.prefLabel || item.name
    if (!labelMap) return null
    return getLocalizedValue(labelMap, locale.value)
  }

  function getActionLabels(actionRefs) {
    if (!actionRefs || !Array.isArray(actionRefs)) return []
    return actionRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = dataset.getAction(id)
      const label = item ? getLabel(item) : null
      return { id, label: label || id }
    })
  }

  function getOrganLabels(organRefs) {
    if (!organRefs || !Array.isArray(organRefs)) return []
    return organRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = dataset.getOrgan(id)
      const label = item ? getLabel(item) : null
      return { id, label: label || id }
    })
  }

  return {
    actions,
    organs,
    getActionLabels,
    getOrganLabels
  }
}

export function useChemicalReferences() {
  const { locale } = useI18n()

  function getCompoundLabels(compoundRefs) {
    if (!compoundRefs || !Array.isArray(compoundRefs)) return []

    return compoundRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const compound = dataset.getChemical(id)

      let label = id
      let description = null

      if (compound) {
        if (compound.name) {
          label = getLocalizedValue(compound.name, locale.value)
        }
        if (compound.description) {
          description = getLocalizedValue(compound.description, locale.value)
        }
      } else {
        const parts = id.split('/')
        label = parts[parts.length - 1] || id
      }

      return { id, label, description }
    })
  }

  return { getCompoundLabels }
}

// ============================================================================
// Localization Helpers for Preparations
// ============================================================================

export function usePreparationLocalizer() {
  const { locale } = useI18n()

  // Category labels for legacy navigation
  const categoryLabels = {
    'chinese-herbs': { en: 'Chinese Herbs', 'zh-Hant': '中藥', 'zh-Hans': '中药' },
    'western-herbs': { en: 'Western Herbs', 'zh-Hant': '西方草本', 'zh-Hans': '西方草本' },
    'vitamins': { en: 'Vitamins', 'zh-Hant': '維生素', 'zh-Hans': '维生素' },
    'minerals': { en: 'Minerals', 'zh-Hant': '礦物質', 'zh-Hans': '矿物质' },
    'nutrients': { en: 'Nutrients', 'zh-Hant': '營養素', 'zh-Hans': '营养素' },
    'preparations': { en: 'All Preparations', 'zh-Hant': '所有製劑', 'zh-Hans': '所有制剂' }
  }

  return {
    getName: (prep) => {
      if (!prep) return null
      return getLocalizedValue(prep.name, locale.value)
    },

    getDescription: (prep) => {
      if (!prep) return null
      return getLocalizedValue(prep.description, locale.value)
    },

    getCommonName: (prep) => {
      if (!prep) return null
      // Common name is on the source plant, need to look it up
      const plant = dataset.getSourcePlant(extractSlug(prep))
      if (plant?.commonName) {
        return getLocalizedValue(plant.commonName, locale.value)
      }
      return null
    },

    getCategoryLabel: (categorySlug) => {
      const labels = categoryLabels[categorySlug]
      if (!labels) return categorySlug
      return labels[locale.value] || labels['en'] || categorySlug
    },

    getTCMHistory: (profile) => {
      if (!profile) return null
      return getLocalizedValue(profile.tcmHistory, locale.value)
    },

    getTCMTraditionalUsage: (profile) => {
      if (!profile) return null
      return getLocalizedValue(profile.tcmTraditionalUsage, locale.value)
    },

    getTCMModernResearch: (profile) => {
      if (!profile) return null
      return getLocalizedValue(profile.tcmModernResearch, locale.value)
    },

    getTCMFunctions: (profile) => {
      if (!profile) return null
      return getLocalizedValue(profile.tcmFunctions, locale.value)
    },

    getWesternHistory: (profile) => {
      if (!profile) return null
      return getLocalizedValue(profile.westernHistory, locale.value)
    },

    getWesternTraditionalUsage: (profile) => {
      if (!profile) return null
      return getLocalizedValue(profile.westernTraditionalUsage, locale.value)
    },

    getWesternModernResearch: (profile) => {
      if (!profile) return null
      return getLocalizedValue(profile.westernModernResearch, locale.value)
    }
  }
}

// Helper to extract slug from preparation
function extractSlug(prep) {
  if (!prep?.['@id']) return null
  const parts = prep['@id'].split('/')
  return parts[parts.length - 1] || ''
}

// ============================================================================
// Statistics
// ============================================================================

export function useDatasetStats() {
  return dataset.getCounts()
}

export function useCategoryStats() {
  const stats = dataset.getCounts()
  return {
    preparations: stats.preparations,
    tcm: stats.tcmProfiles,
    western: stats.westernProfiles
  }
}
