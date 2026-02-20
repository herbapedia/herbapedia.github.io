/**
 * Herbapedia JSON-LD Data Composable
 *
 * Provides herbs, categories, and search functionality using the
 * HerbapediaDataset API.
 *
 * This composable wraps the dataset API with Vue reactivity and i18n helpers.
 */

import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'

// Category mapping from TCM category ID to site category
const TCM_CATEGORY_MAP = {
  'tonify-qi': 'chinese-herbs',
  'tonify-blood': 'chinese-herbs',
  'tonify-yin': 'chinese-herbs',
  'tonify-yang': 'chinese-herbs',
  'clear-heat': 'chinese-herbs',
  'drain-damp': 'chinese-herbs',
  'transform-phlegm': 'chinese-herbs',
  'regulate-qi': 'chinese-herbs',
  'invigorate-blood': 'chinese-herbs',
  'calm-spirit': 'chinese-herbs',
  'aromatize': 'chinese-herbs',
  'tonify-qi-and-yin': 'chinese-herbs',
  'digestion': 'chinese-herbs',
  'external': 'chinese-herbs',
  'reduce-swelling': 'chinese-herbs',
  'stop-bleeding': 'chinese-herbs',
}

/**
 * Get localized value from language map
 */
function getLocalizedValue(langMap, locale, fallbackLocale = 'en') {
  if (!langMap) return null
  if (typeof langMap === 'string') return langMap
  if (typeof langMap === 'object') {
    // Try exact match first
    if (langMap[locale]) return langMap[locale]
    // Fallback to other variants
    if (locale.startsWith('zh-H') && langMap['zh-Hant']) return langMap['zh-Hant']
    if (locale.startsWith('zh-') && langMap['zh-Hans']) return langMap['zh-Hans']
    if (locale === 'zh-Hant' && langMap['zh-Hans']) return langMap['zh-Hans']
    if (locale === 'zh-Hans' && langMap['zh-Hant']) return langMap['zh-Hant']
    // Fallback to English
    if (langMap[fallbackLocale]) return langMap[fallbackLocale]
    // Return first value
    const keys = Object.keys(langMap)
    if (keys.length > 0) return langMap[keys[0]]
  }
  return null
}

/**
 * Build merged cache from dataset
 */
function buildMergedCache() {
  const mergedCache = new Map()
  const categoryCache = new Map()

  const plants = dataset.getAllPlants()

  for (const plant of plants) {
    const slug = plant['@id'].replace('plant/', '')

    // Get all profiles for this plant
    const profiles = dataset.getAllProfilesForPlant(slug)
    const tcmProfile = profiles.tcm
    const westernProfile = profiles.western

    // Determine category - TYPE first, then system profiles
    // The hierarchy: Vitamins > Minerals > Nutrients > Herbs (by system)
    let category = 'western-herbs'
    let herbType = 'plant'

    // First, determine the TYPE of entity
    const isVitamin = slug.includes('vitamin-') || slug.startsWith('vitamin-')
    const isMineral = ['calcium', 'copper', 'iodine', 'iron', 'magnesium', 'manganese', 'potassium', 'selenium', 'zinc'].includes(slug)
    const isNutrient = ['choline', 'chondroitin-sulfate', 'glucosamine-sulfate', 'inositol', 'lecithin', 'lysine', 'melatonin', 'methionine', 'capigen', 'ceramides', 'chitosan', 'cysteine-hci', 'glycerin', 'glycine', 'linolenic-acid', 'omega-3', 'omega-6', 'omega-9', 'paba', 'phospholipids', 'squalene'].some(n => slug.includes(n) || slug === n)

    if (isVitamin) {
      category = 'vitamins'
      herbType = 'vitamin'
    } else if (isMineral) {
      category = 'minerals'
      herbType = 'mineral'
    } else if (isNutrient) {
      category = 'nutrients'
      herbType = 'nutrient'
    } else if (tcmProfile) {
      // Herbs with TCM profile → Chinese Herbs
      herbType = 'tcm-herb'
      const categoryRef = tcmProfile.hasCategory
      if (categoryRef && typeof categoryRef === 'object' && categoryRef['@id']) {
        const categoryId = categoryRef['@id'].replace('category/', '')
        category = TCM_CATEGORY_MAP[categoryId] || 'chinese-herbs'
      } else {
        category = 'chinese-herbs'
      }
    } else if (westernProfile) {
      // Herbs with only Western profile → Western Herbs
      herbType = 'western-herb'
      category = 'western-herbs'
    } else {
      // Plants without any system profile → still Western Herbs (default)
      herbType = 'plant'
      category = 'western-herbs'
    }

    // Merge plant and system data
    const merged = {
      slug,
      category,
      type: herbType,

      // Plant data
      name: plant.name || {},
      commonName: plant.commonName || {},
      scientificName: plant.scientificName || null,
      family: plant.family || null,
      genus: plant.genus || null,
      species: plant.species || null,
      botanicalDescription: plant.botanicalDescription || {},
      description: plant.description || {},
      geographicalDistribution: plant.geographicalDistribution || {},
      hasPart: plant.hasParts || [],
      containsChemical: plant.containsChemical || [],
      image: plant.image ? `/@herbapedia/data/${plant.image}` : null,

      // TCM profile data
      tcmSlug: tcmProfile ? (tcmProfile['@id'].replace('tcm/', '')) : null,
      pinyin: tcmProfile?.pinyin || null,
      chineseName: tcmProfile?.chineseName || null,
      hasCategory: tcmProfile?.hasCategory || null,
      hasNature: tcmProfile?.hasNature || null,
      hasFlavor: tcmProfile?.hasFlavor || [],
      entersMeridian: tcmProfile?.entersMeridian || [],
      actions: tcmProfile?.actions || [],
      indications: tcmProfile?.indications || [],
      contraindications: tcmProfile?.contraindications || {},
      dosage: tcmProfile?.dosage || {},
      preparation: tcmProfile?.preparation || {},

      // System-scoped content - TCM
      tcmHistory: tcmProfile?.tcmHistory || {},
      tcmTraditionalUsage: tcmProfile?.tcmTraditionalUsage || {},
      tcmModernResearch: tcmProfile?.tcmModernResearch || {},
      tcmFunctions: tcmProfile?.tcmFunctions || {},
      tcmBotanicalSource: tcmProfile?.tcmBotanicalSource || {},
      tcmClassicalReference: tcmProfile?.tcmClassicalReference || {},
      tcmSafetyConsideration: tcmProfile?.tcmSafetyConsideration || {},

      // System-scoped content - Western
      westernSlug: westernProfile ? (westernProfile['@id'].replace('western/', '')) : null,
      hasAction: westernProfile?.hasAction || [],
      hasOrganAffinity: westernProfile?.hasOrganAffinity || [],
      westernHistory: westernProfile?.westernHistory || {},
      westernTraditionalUsage: westernProfile?.westernTraditionalUsage || {},
      westernModernResearch: westernProfile?.westernModernResearch || {},
      westernConstituents: westernProfile?.westernConstituents || {},

      sameAs: [...(plant.sameAs || [])],
      source: plant.source || null
    }

    mergedCache.set(slug, merged)

    // Build category index
    if (!categoryCache.has(category)) {
      categoryCache.set(category, [])
    }
    categoryCache.get(category).push(merged)
  }

  return { mergedCache, categoryCache }
}

// Build caches on module load
const { mergedCache, categoryCache } = buildMergedCache()

/**
 * Get all herbs
 */
export function useAllHerbs() {
  return computed(() => Array.from(mergedCache.values()))
}

/**
 * Get herbs by category
 */
export function useHerbsByCategory(category) {
  return computed(() => {
    const cat = typeof category === 'object' && 'value' in category ? category.value : category
    return categoryCache.get(cat) || []
  })
}

/**
 * Get a single herb by slug
 */
export function useHerb(slug) {
  return computed(() => mergedCache.get(slug) || null)
}

/**
 * Get category statistics
 */
export function useCategoryStats() {
  const stats = {}
  categoryCache.forEach((herbs, category) => {
    stats[category] = herbs.length
  })
  return stats
}

/**
 * Search herbs by name or scientific name
 */
export function useHerbSearch(query) {
  return computed(() => {
    if (!query.value) return []

    const searchTerm = query.value.toLowerCase()
    return Array.from(mergedCache.values()).filter(herb => {
      const name = getLocalizedValue(herb.name, 'en', 'en') || ''
      const scientificName = herb.scientificName || ''
      const pinyin = herb.pinyin || ''

      return name.toLowerCase().includes(searchTerm) ||
        scientificName.toLowerCase().includes(searchTerm) ||
        pinyin.toLowerCase().includes(searchTerm)
    })
  })
}

/**
 * Category labels (localized)
 */
export const categoryLabels = {
  'chinese-herbs': { en: 'Chinese Herbs', 'zh-Hant': '中藥', 'zh-Hans': '中药' },
  'western-herbs': { en: 'Western Herbs', 'zh-Hant': '西方草本', 'zh-Hans': '西方草本' },
  'vitamins': { en: 'Vitamins', 'zh-Hant': '維生素', 'zh-Hans': '维生素' },
  'minerals': { en: 'Minerals', 'zh-Hant': '礦物質', 'zh-Hans': '矿物质' },
  'nutrients': { en: 'Nutrients', 'zh-Hant': '營養素', 'zh-Hans': '营养素' }
}

/**
 * Get all categories with counts
 */
export function useCategories() {
  return computed(() => Object.entries(categoryLabels).map(([slug, title]) => ({
    slug,
    title,
    count: categoryCache.get(slug)?.length || 0
  })))
}

/**
 * Get localized name for a herb
 */
export function useLocalizedHerbName() {
  const { locale } = useI18n()

  return computed(() => (herb) => {
    if (!herb) return null
    return getLocalizedValue(herb.name, locale.value) ||
           getLocalizedValue(herb.name, 'en') ||
           herb.slug
  })
}

/**
 * Composable for localized herb display
 */
export function useHerbLocalizer() {
  const { locale } = useI18n()

  return {
    getName: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.name, locale.value)
    },

    getCommonName: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.commonName, locale.value)
    },

    getDescription: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.description, locale.value)
    },

    getTcmHistory: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.tcmHistory, locale.value)
    },

    getTcmTraditionalUsage: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.tcmTraditionalUsage, locale.value)
    },

    getTcmModernResearch: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.tcmModernResearch, locale.value)
    },

    getTcmFunctions: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.tcmFunctions, locale.value)
    },

    getWesternHistory: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.westernHistory, locale.value)
    },

    getWesternTraditionalUsage: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.westernTraditionalUsage, locale.value)
    },

    getWesternModernResearch: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.westernModernResearch, locale.value)
    },

    getCategoryLabel: (categorySlug) => {
      return getLocalizedValue(categoryLabels[categorySlug], locale.value)
    }
  }
}

/**
 * Get TCM reference data with lookup helpers
 */
export function useTcmReferences() {
  const { locale } = useI18n()

  const meridians = ref(dataset.getAllMeridians())
  const natures = ref(dataset.getAllNatures())
  const flavors = ref(dataset.getAllFlavors())
  const categories = ref(dataset.getAllCategories())

  function getLabel(item) {
    if (!item || !item.prefLabel) return null
    return getLocalizedValue(item.prefLabel, locale.value)
  }

  function getNatureLabel(natureRef) {
    if (!natureRef) return null
    const id = typeof natureRef === 'object' ? natureRef['@id'] : natureRef
    const item = dataset.getNature(id)
    return item ? getLabel(item) : id
  }

  function getFlavorLabels(flavorRefs) {
    if (!flavorRefs || !Array.isArray(flavorRefs)) return []
    return flavorRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = dataset.getFlavor(id)
      return item ? { id, label: getLabel(item) } : { id, label: id }
    })
  }

  function getMeridianLabels(meridianRefs) {
    if (!meridianRefs || !Array.isArray(meridianRefs)) return []
    return meridianRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = dataset.getMeridian(id)
      return item ? { id, label: getLabel(item) } : { id, label: id }
    })
  }

  function getCategoryLabel(categoryRef) {
    if (!categoryRef) return null
    const id = typeof categoryRef === 'object' ? categoryRef['@id'] : categoryRef
    const item = dataset.getCategory(id)
    return item ? getLabel(item) : id
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

/**
 * Get Western herbalism reference data with lookup helpers
 */
export function useWesternReferences() {
  const { locale } = useI18n()

  const actions = ref(dataset.getAllActions())
  const organs = ref(dataset.getAllOrgans())

  function getLabel(item) {
    if (!item || !item.prefLabel) return null
    return getLocalizedValue(item.prefLabel, locale.value)
  }

  function getActionLabels(actionRefs) {
    if (!actionRefs || !Array.isArray(actionRefs)) return []
    return actionRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = dataset.getAction(id)
      return item ? { id, label: getLabel(item) } : { id, label: id }
    })
  }

  function getOrganLabels(organRefs) {
    if (!organRefs || !Array.isArray(organRefs)) return []
    return organRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = dataset.getOrgan(id)
      return item ? { id, label: getLabel(item) } : { id, label: id }
    })
  }

  return {
    actions,
    organs,
    getActionLabels,
    getOrganLabels
  }
}

/**
 * Get Chemical Compounds reference data with lookup helpers
 */
export function useChemicalReferences() {
  const { locale } = useI18n()

  // Load compound reference data from dataset
  // The dataset.ts doesn't expose getCompoundLabels, so we need to implement it here
  // by iterating through plants to find compounds

  function getLocalizedLabel(item) {
    if (!item || !item.prefLabel) return null
    return getLocalizedValue(item.prefLabel, locale.value)
  }

  function getCompoundLabels(compoundRefs) {
    if (!compoundRefs || !Array.isArray(compoundRefs)) return []

    // Build a map of compound IDs to their data from plants
    const compoundMap = new Map()
    const plants = dataset.getAllPlants()

    for (const plant of plants) {
      if (plant.containsChemical) {
        for (const ref of plant.containsChemical) {
          const id = typeof ref === 'object' ? ref['@id'] : ref
          if (!compoundMap.has(id)) {
            compoundMap.set(id, ref)
          }
        }
      }
    }

    return compoundRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const originalRef = compoundMap.get(id)
      // Extract label from the ref object if it has prefLabel
      let label = id
      let description = null

      if (originalRef && typeof originalRef === 'object') {
        if (originalRef.prefLabel) {
          label = getLocalizedLabel(originalRef)
        }
        if (originalRef.description) {
          description = getLocalizedValue(originalRef.description, locale.value)
        }
      }

      return { id, label, description }
    })
  }

  return {
    getCompoundLabels
  }
}

/**
 * Find related herbs based on shared compounds, TCM category, or western actions
 */
export function useRelatedHerbs(currentHerb, limit = 5) {
  const { locale } = useI18n()

  return computed(() => {
    if (!currentHerb) return []

    const relatedHerbs = []
    const currentSlug = currentHerb.slug

    // Get current herb's compound IDs
    const currentCompoundIds = new Set(
      (currentHerb.containsChemical || []).map(c =>
        typeof c === 'object' ? c['@id'] : c
      )
    )

    // Get current herb's TCM category
    const currentCategory = currentHerb.hasCategory
      ? (typeof currentHerb.hasCategory === 'object'
          ? currentHerb.hasCategory['@id']
          : currentHerb.hasCategory)
      : null

    // Get current herb's western action IDs
    const currentActionIds = new Set(
      (currentHerb.hasAction || []).map(a =>
        typeof a === 'object' ? a['@id'] : a
      )
    )

    // Score each herb
    for (const [slug, herb] of mergedCache) {
      if (slug === currentSlug) continue

      let score = 0
      let matchReasons = []

      // Check shared compounds
      const herbCompoundIds = (herb.containsChemical || []).map(c =>
        typeof c === 'object' ? c['@id'] : c
      )
      const sharedCompounds = herbCompoundIds.filter(id => currentCompoundIds.has(id))
      if (sharedCompounds.length > 0) {
        score += sharedCompounds.length * 3
        matchReasons.push({ type: 'compounds', count: sharedCompounds.length })
      }

      // Check TCM category match
      if (currentCategory && herb.hasCategory) {
        const herbCategory = typeof herb.hasCategory === 'object'
          ? herb.hasCategory['@id']
          : herb.hasCategory
        if (herbCategory === currentCategory) {
          score += 2
          matchReasons.push({ type: 'category' })
        }
      }

      // Check shared western actions
      const herbActionIds = (herb.hasAction || []).map(a =>
        typeof a === 'object' ? a['@id'] : a
      )
      const sharedActions = herbActionIds.filter(id => currentActionIds.has(id))
      if (sharedActions.length > 0) {
        score += sharedActions.length
        matchReasons.push({ type: 'actions', count: sharedActions.length })
      }

      if (score > 0) {
        relatedHerbs.push({
          herb,
          score,
          matchReasons
        })
      }
    }

    // Sort by score (highest first), then by name
    relatedHerbs.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const nameA = getLocalizedValue(a.herb.name, locale.value) || a.herb.slug
      const nameB = getLocalizedValue(b.herb.name, locale.value) || b.herb.slug
      return nameA.localeCompare(nameB)
    })

    return relatedHerbs.slice(0, limit)
  })
}
