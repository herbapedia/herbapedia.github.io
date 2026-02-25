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

import { ref, reactive, computed, watch } from 'vue'
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

  // Reactive filter state
  const filters = reactive({
    search: '',
    system: {
      tcm: false,
      western: false,
      ayurveda: false
    },
    tcm: {
      nature: null,      // 'hot', 'warm', 'neutral', 'cool', 'cold'
      flavor: null,      // 'pungent', 'sweet', 'sour', 'bitter', 'salty'
      meridian: null,    // 'lung', 'spleen', 'stomach', etc.
      category: null     // 'release-exterior', 'warm-interior', etc.
    },
    western: {
      action: null,      // 'carminative', 'anti-inflammatory', etc.
      organ: null        // 'digestive', 'nervous', 'circulatory', etc.
    }
  })

  // Track if we've initialized from URL
  const initialized = ref(false)

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
    }

    // TCM filters
    if (query.nature) filters.tcm.nature = String(query.nature)
    if (query.flavor) filters.tcm.flavor = String(query.flavor)
    if (query.meridian) filters.tcm.meridian = String(query.meridian)
    if (query.tcmCategory) filters.tcm.category = String(query.tcmCategory)

    // Western filters
    if (query.action) filters.western.action = String(query.action)
    if (query.organ) filters.western.organ = String(query.organ)
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

    return query
  }

  /**
   * Update URL with current filters
   */
  function updateUrl() {
    const query = buildQueryParams()
    router.replace({ query })
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
    filters.tcm.nature = null
    filters.tcm.flavor = null
    filters.tcm.meridian = null
    filters.tcm.category = null
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
    return preparations.filter(prep => {
      // Search filter - match against name and scientific name
      if (filters.search) {
        const query = filters.search.toLowerCase()
        const nameMatch = getPrepName(prep)?.toLowerCase().includes(query)
        const sciMatch = getScientificName(prep)?.toLowerCase().includes(query)
        if (!nameMatch && !sciMatch) return false
      }

      // System profile filters
      if (filters.system.tcm && !prep.hasTCMProfile) return false
      if (filters.system.western && !prep.hasWesternProfile) return false
      if (filters.system.ayurveda && !prep.hasAyurvedaProfile) return false

      // TCM property filters
      if (filters.tcm.nature || filters.tcm.flavor || filters.tcm.meridian || filters.tcm.category) {
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

      // Western property filters
      if (filters.western.action || filters.western.organ) {
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
      if (initialized.value) {
        // Reset and re-parse
        clearFilters()
        parseQueryParams()
      }
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

  // TCM options
  const tcmNatures = [
    { value: 'hot', label: 'Hot' },
    { value: 'warm', label: 'Warm' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'cool', label: 'Cool' },
    { value: 'cold', label: 'Cold' }
  ]

  const tcmFlavors = [
    { value: 'pungent', label: 'Pungent' },
    { value: 'sweet', label: 'Sweet' },
    { value: 'sour', label: 'Sour' },
    { value: 'bitter', label: 'Bitter' },
    { value: 'salty', label: 'Salty' }
  ]

  // Get TCM categories from dataset
  const tcmCategories = computed(() => {
    const categories = dataset.getAllCategories()
    return categories.map(cat => ({
      value: extractSlugFromId(cat['@id']),
      label: getLocalizedLabel(cat, locale.value)
    }))
  })

  // Get TCM meridians from dataset
  const tcmMeridians = computed(() => {
    const meridians = dataset.getAllMeridians()
    return meridians.map(m => ({
      value: extractSlugFromId(m['@id']),
      label: getLocalizedLabel(m, locale.value)
    }))
  })

  // Get Western actions from dataset
  const westernActions = computed(() => {
    const actions = dataset.getAllActions()
    return actions.map(a => ({
      value: extractSlugFromId(a['@id']),
      label: getLocalizedLabel(a, locale.value)
    }))
  })

  // Get Western organs from dataset
  const westernOrgans = computed(() => {
    const organs = dataset.getAllOrgans()
    return organs.map(o => ({
      value: extractSlugFromId(o['@id']),
      label: getLocalizedLabel(o, locale.value)
    }))
  })

  return {
    tcmNatures,
    tcmFlavors,
    tcmCategories,
    tcmMeridians,
    westernActions,
    westernOrgans
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
