/**
 * Filters Composable for Preparations Index
 *
 * Manages filter state, URL query param sync, and filter application logic.
 *
 * Filter State:
 * - search: string for text search
 * - system: which system profiles to include (tcm, western, ayurveda)
 * - tcm: TCM-specific filters (nature, flavor, meridian, category)
 * - western: Western-specific filters (action, organ)
 */

import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'

// ============================================================================
// Filter State
// ============================================================================

/**
 * Create filter state for preparations
 */
export function useFilters() {
  const route = useRoute()
  const router = useRouter()

  // Reactive filter state - supports all 6 systems
  const filters = reactive({
    search: '',
    system: {
      tcm: false,
      western: false,
      ayurveda: false,
      unani: false,
      mongolian: false,
      modern: false
    },
    // TCM properties
    tcm: {
      nature: null,
      flavor: null,
      meridian: null,
      category: null
    },
    // Western properties
    western: {
      action: null,
      organ: null
    },
    // Ayurveda properties
    ayurveda: {
      rasa: null,
      guna: null,
      virya: null,
      vipaka: null,
      dosha: null,
      karma: null
    },
    // Unani properties
    unani: {
      temperament: null,
      element: null
    },
    // Mongolian properties
    mongolian: {
      element: null,
      taste: null,
      root: null
    }
  })

  // Track if we've initialized from URL
  const initialized = ref(false)

  // Track if we're currently updating the URL (to prevent watch loop)
  const isUpdatingUrl = ref(false)

  // ============================================================================
  // URL Query Param Sync
  // ============================================================================

  /**
   * Parse URL query params into filter state
   */
  function parseQueryParams() {
    const query = route.query

    // Search
    if (query.q) {
      filters.search = String(query.q)
    }

    // System filters (can be comma-separated or multiple params)
    if (query.system) {
      const systems = String(query.system).split(',')
      filters.system.tcm = systems.includes('tcm')
      filters.system.western = systems.includes('western')
      filters.system.ayurveda = systems.includes('ayurveda')
      filters.system.unani = systems.includes('unani')
      filters.system.mongolian = systems.includes('mongolian')
      filters.system.modern = systems.includes('modern')
    }

    // TCM filters
    if (query.nature) filters.tcm.nature = String(query.nature)
    if (query.flavor) filters.tcm.flavor = String(query.flavor)
    if (query.meridian) filters.tcm.meridian = String(query.meridian)
    if (query.tcmCategory) filters.tcm.category = String(query.tcmCategory)

    // Western filters
    if (query.action) filters.western.action = String(query.action)
    if (query.organ) filters.western.organ = String(query.organ)

    // Ayurveda filters
    if (query.rasa) filters.ayurveda.rasa = String(query.rasa)
    if (query.guna) filters.ayurveda.guna = String(query.guna)
    if (query.virya) filters.ayurveda.virya = String(query.virya)
    if (query.vipaka) filters.ayurveda.vipaka = String(query.vipaka)
    if (query.dosha) filters.ayurveda.dosha = String(query.dosha)
    if (query.karma) filters.ayurveda.karma = String(query.karma)

    // Unani filters
    if (query.temperament) filters.unani.temperament = String(query.temperament)
    if (query.unaniElement) filters.unani.element = String(query.unaniElement)

    // Mongolian filters
    if (query.mongolianElement) filters.mongolian.element = String(query.mongolianElement)
    if (query.mongolianTaste) filters.mongolian.taste = String(query.mongolianTaste)
    if (query.mongolianRoot) filters.mongolian.root = String(query.mongolianRoot)
  }

  /**
   * Build URL query params from filter state
   */
  function buildQueryParams() {
    const query = {}

    // Search
    if (filters.search) {
      query.q = filters.search
    }

    // System filters
    const systems = []
    if (filters.system.tcm) systems.push('tcm')
    if (filters.system.western) systems.push('western')
    if (filters.system.ayurveda) systems.push('ayurveda')
    if (filters.system.unani) systems.push('unani')
    if (filters.system.mongolian) systems.push('mongolian')
    if (filters.system.modern) systems.push('modern')
    if (systems.length > 0) {
      query.system = systems.join(',')
    }

    // TCM filters
    if (filters.tcm.nature) query.nature = filters.tcm.nature
    if (filters.tcm.flavor) query.flavor = filters.tcm.flavor
    if (filters.tcm.meridian) query.meridian = filters.tcm.meridian
    if (filters.tcm.category) query.tcmCategory = filters.tcm.category

    // Western filters
    if (filters.western.action) query.action = filters.western.action
    if (filters.western.organ) query.organ = filters.western.organ

    // Ayurveda filters
    if (filters.ayurveda.rasa) query.rasa = filters.ayurveda.rasa
    if (filters.ayurveda.guna) query.guna = filters.ayurveda.guna
    if (filters.ayurveda.virya) query.virya = filters.ayurveda.virya
    if (filters.ayurveda.vipaka) query.vipaka = filters.ayurveda.vipaka
    if (filters.ayurveda.dosha) query.dosha = filters.ayurveda.dosha
    if (filters.ayurveda.karma) query.karma = filters.ayurveda.karma

    // Unani filters
    if (filters.unani.temperament) query.temperament = filters.unani.temperament
    if (filters.unani.element) query.unaniElement = filters.unani.element

    // Mongolian filters
    if (filters.mongolian.element) query.mongolianElement = filters.mongolian.element
    if (filters.mongolian.taste) query.mongolianTaste = filters.mongolian.taste
    if (filters.mongolian.root) query.mongolianRoot = filters.mongolian.root

    return query
  }

  /**
   * Update URL with current filters
   */
  function updateUrl() {
    isUpdatingUrl.value = true
    const query = buildQueryParams()
    router.replace({ query })
    // Reset flag after the navigation is complete
    nextTick(() => {
      isUpdatingUrl.value = false
    })
  }

  /**
   * Initialize filters from URL on mount
   */
  function initFromUrl() {
    if (!initialized.value) {
      parseQueryParams()
      initialized.value = true
    }
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    filters.search = ''
    filters.system.tcm = false
    filters.system.western = false
    filters.system.ayurveda = false
    filters.system.unani = false
    filters.system.mongolian = false
    filters.system.modern = false
    // TCM
    filters.tcm.nature = null
    filters.tcm.flavor = null
    filters.tcm.meridian = null
    filters.tcm.category = null
    // Western
    filters.western.action = null
    filters.western.organ = null
    updateUrl()
  }

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = computed(() => {
    return !!(
      filters.search ||
      filters.system.tcm ||
      filters.system.western ||
      filters.system.ayurveda ||
      filters.system.unani ||
      filters.system.mongolian ||
      filters.system.modern ||
      filters.tcm.nature ||
      filters.tcm.flavor ||
      filters.tcm.meridian ||
      filters.tcm.category ||
      filters.western.action ||
      filters.western.organ
    )
  })

  // ============================================================================
  // Filter Application
  // ============================================================================

  /**
   * Apply filters to preparations list
   */
  function applyFilters(preparations) {
    // Check if any system filter is active
    const hasSystemFilter = filters.system.tcm || filters.system.western ||
                            filters.system.ayurveda || filters.system.unani ||
                            filters.system.mongolian || filters.system.modern

    return preparations.filter(prep => {
      // Search filter - match against name and scientific name
      if (filters.search) {
        const query = filters.search.toLowerCase()
        const nameMatch = getPrepName(prep)?.toLowerCase().includes(query)
        const sciMatch = getScientificName(prep)?.toLowerCase().includes(query)
        if (!nameMatch && !sciMatch) return false
      }

      // System profile filters - only filter if at least one system is selected
      if (hasSystemFilter) {
        const matchesAnySystem =
          (filters.system.tcm && prep.hasTCMProfile) ||
          (filters.system.western && prep.hasWesternProfile) ||
          (filters.system.ayurveda && prep.hasAyurvedaProfile) ||
          (filters.system.unani && prep.hasUnaniProfile) ||
          (filters.system.mongolian && prep.hasMongolianProfile) ||
          (filters.system.modern && prep.hasModernProfile)

        if (!matchesAnySystem) return false
      }

      // TCM property filters - only apply if TCM system is selected
      if (filters.system.tcm && (filters.tcm.nature || filters.tcm.flavor || filters.tcm.meridian || filters.tcm.category)) {
        const tcmProfile = resolveTCMProfile(prep)
        if (!tcmProfile) return false

        if (filters.tcm.nature) {
          const natureId = tcmProfile.hasNature?.['@id'] || tcmProfile.hasNature
          if (natureId !== `tcm/nature/${filters.tcm.nature}` &&
              natureId !== filters.tcm.nature &&
              !natureId?.includes(filters.tcm.nature)) {
            return false
          }
        }
        if (filters.tcm.flavor) {
          const flavors = tcmProfile.hasFlavor || []
          const hasFlavor = flavors.some(f => {
            const id = f['@id'] || f
            return id === `tcm/flavor/${filters.tcm.flavor}` ||
                   id === filters.tcm.flavor ||
                   id?.includes(filters.tcm.flavor)
          })
          if (!hasFlavor) return false
        }
        if (filters.tcm.meridian) {
          const meridians = tcmProfile.entersMeridian || []
          const hasMeridian = meridians.some(m => {
            const id = m['@id'] || m
            return id === `tcm/meridian/${filters.tcm.meridian}` ||
                   id === filters.tcm.meridian ||
                   id?.includes(filters.tcm.meridian)
          })
          if (!hasMeridian) return false
        }
        if (filters.tcm.category) {
          const catId = tcmProfile.hasCategory?.['@id'] || tcmProfile.hasCategory
          if (catId !== `tcm/category/${filters.tcm.category}` &&
              catId !== filters.tcm.category &&
              !catId?.includes(filters.tcm.category)) {
            return false
          }
        }
      }

      // Western property filters - only apply if Western system is selected
      if (filters.system.western && (filters.western.action || filters.western.organ)) {
        const westernProfile = resolveWesternProfile(prep)
        if (!westernProfile) return false

        if (filters.western.action) {
          const actions = westernProfile.hasAction || []
          const hasAction = actions.some(a => {
            const id = a['@id'] || a
            return id === `western/action/${filters.western.action}` ||
                   id === filters.western.action ||
                   id?.includes(filters.western.action)
          })
          if (!hasAction) return false
        }
        if (filters.western.organ) {
          const organs = westernProfile.hasOrganAffinity || []
          const hasOrgan = organs.some(o => {
            const id = o['@id'] || o
            return id === `western/organ/${filters.western.organ}` ||
                   id === filters.western.organ ||
                   id?.includes(filters.western.organ)
          })
          if (!hasOrgan) return false
        }
      }

      return true
    })
  }

  // ============================================================================
  // Watch for URL changes
  // ============================================================================

  // Watch route query params for changes (e.g., browser back button)
  watch(
    () => route.query,
    () => {
      // Skip if this is our own URL update
      if (isUpdatingUrl.value) return
      // Skip if not initialized yet
      if (!initialized.value) return

      // Reset and re-parse (for browser back/forward navigation)
      clearFilters()
      parseQueryParams()
    },
    { deep: true }
  )

  return {
    filters,
    initialized,
    initFromUrl,
    updateUrl,
    clearFilters,
    hasActiveFilters,
    applyFilters
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function getPrepName(prep) {
  if (!prep?.name) return null
  if (typeof prep.name === 'string') return prep.name
  if (typeof prep.name === 'object') {
    return prep.name.en || prep.name['zh-Hant'] || prep.name['zh-Hans'] || Object.values(prep.name)[0]
  }
  return null
}

function getScientificName(prep) {
  const slug = extractSlug(prep)
  const plant = dataset.getSourcePlant(slug)
  return plant?.scientificName || null
}

function extractSlug(prep) {
  if (!prep?.['@id']) return null
  const parts = prep['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function resolveTCMProfile(prep) {
  if (!prep?.hasTCMProfile?.[0]) return null
  const tcmSlug = extractSlug(prep.hasTCMProfile[0])
  return dataset.getTCMProfile(tcmSlug)
}

function resolveWesternProfile(prep) {
  if (!prep?.hasWesternProfile?.[0]) return null
  const westernSlug = extractSlug(prep.hasWesternProfile[0])
  return dataset.getWesternProfile(westernSlug)
}

// ============================================================================
// Filter Options (for dropdowns)
// ============================================================================

export function useFilterOptions() {
  const { locale } = useI18n()

  // Get TCM Thermal Natures from dataset
  const tcmNatures = computed(() => {
    const natures = dataset.getAllNatures()
    if (!natures || natures.length === 0) return []
    return natures.map(n => {
      const id = n['@id']
      const slug = extractSlugFromId(id)
      return {
        value: slug,
        label: getLocalizedLabel(n, locale.value)
      }
    })
  })

  // Get TCM Flavors from dataset
  const tcmFlavors = computed(() => {
    const flavors = dataset.getAllFlavors()
    if (!flavors || flavors.length === 0) return []
    return flavors.map(f => {
      const id = f['@id']
      const slug = extractSlugFromId(id)
      return {
        value: slug,
        label: getLocalizedLabel(f, locale.value)
      }
    })
  })

  // Get TCM categories from dataset
  const tcmCategories = computed(() => {
    const categories = dataset.getAllCategories()
    if (!categories || categories.length === 0) return []
    return categories.map(cat => {
      const id = cat['@id']
      const slug = extractSlugFromId(id)
      return {
        value: slug,
        label: getLocalizedLabel(cat, locale.value)
      }
    })
  })

  // Get TCM meridians from dataset
  const tcmMeridians = computed(() => {
    const meridians = dataset.getAllMeridians()
    if (!meridians || meridians.length === 0) return []
    return meridians.map(m => {
      const id = m['@id']
      const slug = extractSlugFromId(id)
      return {
        value: slug,
        label: getLocalizedLabel(m, locale.value)
      }
    })
  })

  // Get Western actions from dataset
  const westernActions = computed(() => {
    const actions = dataset.getAllActions()
    if (!actions || actions.length === 0) return []
    return actions.map(a => {
      const id = a['@id']
      const slug = extractSlugFromId(id)
      return {
        value: slug,
        label: getLocalizedLabel(a, locale.value)
      }
    })
  })

  // Get Western organs from dataset
  const westernOrgans = computed(() => {
    const organs = dataset.getAllOrgans()
    if (!organs || organs.length === 0) return []
    return organs.map(o => {
      const id = o['@id']
      const slug = extractSlugFromId(id)
      return {
        value: slug,
        label: getLocalizedLabel(o, locale.value)
      }
    })
  })

  // Ayurveda filter options
  const ayurvedaRasas = computed(() => {
    const items = dataset.getAllRasas()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  const ayurvedaGunas = computed(() => {
    const items = dataset.getAllGunas()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  const ayurvedaViryas = computed(() => {
    const items = dataset.getAllViryas()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  const ayurvedaVipakas = computed(() => {
    const items = dataset.getAllVipakas()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  const ayurvedaDoshas = computed(() => {
    const items = dataset.getAllDoshas()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  const ayurvedaKarmas = computed(() => {
    const items = dataset.getAllKarmas()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  // Unani filter options
  const unaniTemperaments = computed(() => {
    const items = dataset.getAllTemperaments()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  const unaniElements = computed(() => {
    const items = dataset.getAllUnaniElements()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  // Mongolian filter options
  const mongolianElements = computed(() => {
    const items = dataset.getAllMongolianElements()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  const mongolianTastes = computed(() => {
    const items = dataset.getAllMongolianTastes()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  const mongolianRoots = computed(() => {
    const items = dataset.getAllMongolianRoots()
    if (!items || items.length === 0) return []
    return items.map(item => ({
      value: extractSlugFromId(item['@id']),
      label: getLocalizedLabel(item, locale.value)
    }))
  })

  return {
    // TCM
    tcmNatures,
    tcmFlavors,
    tcmCategories,
    tcmMeridians,
    // Western
    westernActions,
    westernOrgans,
    // Ayurveda
    ayurvedaRasas,
    ayurvedaGunas,
    ayurvedaViryas,
    ayurvedaVipakas,
    ayurvedaDoshas,
    ayurvedaKarmas,
    // Unani
    unaniTemperaments,
    unaniElements,
    // Mongolian
    mongolianElements,
    mongolianTastes,
    mongolianRoots
  }
}

function extractSlugFromId(id) {
  if (!id) return ''
  const parts = id.split('/')
  return parts[parts.length - 1] || id
}

function getLocalizedLabel(item, locale = 'en') {
  if (!item) return ''
  // Check prefLabel first
  if (item.prefLabel) {
    if (typeof item.prefLabel === 'string') return item.prefLabel
    return item.prefLabel[locale] || item.prefLabel['en'] || Object.values(item.prefLabel)[0] || ''
  }
  // Check name (used in reference data)
  if (item.name) {
    if (typeof item.name === 'string') return item.name
    return item.name[locale] || item.name['en'] || Object.values(item.name)[0] || ''
  }
  // Fallback to ID
  return item['@id'] || ''
}
