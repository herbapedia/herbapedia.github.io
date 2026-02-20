/**
 * Herbapedia Dataset - Browser Adapter
 *
 * A browser-compatible implementation of the HerbapediaDataset API.
 * Uses Vite's import.meta.glob to load JSON-LD data at build time.
 *
 * This provides the same interface as the Node.js HerbapediaDataset class
 * from @herbapedia/data, but works in browser environments.
 *
 * @example
 * ```typescript
 * import { dataset } from '@/api/dataset'
 *
 * // Get a plant
 * const ginger = dataset.getPlantSpecies('ginger')
 *
 * // Get all profiles for a preparation
 * const profiles = dataset.getAllProfilesForPreparation('dried-ginger-rhizome')
 * console.log(profiles.tcm?.pinyin) // "Gān Jiāng"
 * ```
 */

import type {
  LanguageMap,
  IRIReference,
} from '@herbapedia/data/types'

// ============================================================================
// Type Definitions
// ============================================================================

export interface Entity {
  '@id': string
  '@type': string[]
  '@context'?: string
}

export interface PlantSpecies extends Entity {
  scientificName?: string
  name?: LanguageMap
  commonName?: LanguageMap
  family?: string
  genus?: string
  species?: string
  description?: LanguageMap
  botanicalDescription?: LanguageMap
  geographicalDistribution?: LanguageMap
  image?: string
  hasParts?: IRIReference[]
  containsChemical?: IRIReference[]
  sameAs?: IRIReference[]
  source?: string
}

export interface TCMProfile extends Entity {
  pinyin?: string
  chineseName?: string
  hanzi?: string
  profiles?: IRIReference
  derivedFromPlant?: IRIReference
  hasCategory?: IRIReference
  hasNature?: IRIReference
  hasFlavor?: IRIReference[]
  entersMeridian?: IRIReference[]
  actions?: LanguageMap
  indications?: LanguageMap
  contraindications?: LanguageMap
  dosage?: LanguageMap
  preparation?: LanguageMap
  tcmHistory?: LanguageMap
  tcmTraditionalUsage?: LanguageMap
  tcmModernResearch?: LanguageMap
  tcmFunctions?: LanguageMap
  tcmBotanicalSource?: LanguageMap
  tcmClassicalReference?: LanguageMap
  tcmSafetyConsideration?: LanguageMap
}

export interface WesternHerbalProfile extends Entity {
  name?: LanguageMap
  profiles?: IRIReference
  derivedFromPlant?: IRIReference
  hasAction?: IRIReference[]
  hasOrganAffinity?: IRIReference[]
  westernHistory?: LanguageMap
  westernTraditionalUsage?: LanguageMap
  westernModernResearch?: LanguageMap
  westernConstituents?: LanguageMap
}

export interface SystemProfiles {
  tcm?: TCMProfile
  western?: WesternHerbalProfile
}

export interface ReferenceItem {
  '@id': string
  '@type'?: string[]
  prefLabel?: LanguageMap
  description?: LanguageMap
}

// ============================================================================
// Data Loading (Vite import.meta.glob)
// ============================================================================

// Import all JSON-LD files using Vite glob (eagerly loaded)
// V2 Architecture: Load from new locations
const plantModules = import.meta.glob('@herbapedia/data/entities/botanical/species/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: PlantSpecies }>

const tcmModules = import.meta.glob('@herbapedia/data/profiles/tcm/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: TCMProfile }>

const westernModules = import.meta.glob('@herbapedia/data/profiles/western/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: WesternHerbalProfile }>

// Reference data
const meridianModules = import.meta.glob('@herbapedia/data/systems/tcm/meridians.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const natureModules = import.meta.glob('@herbapedia/data/systems/tcm/natures.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const flavorModules = import.meta.glob('@herbapedia/data/systems/tcm/flavors.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const categoryModules = import.meta.glob('@herbapedia/data/systems/tcm/categories.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const westernActionModules = import.meta.glob('@herbapedia/data/systems/western/actions.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const westernOrganModules = import.meta.glob('@herbapedia/data/systems/western/organs.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// ============================================================================
// Utility Functions
// ============================================================================

function extractSlugFromIRI(iri: string): string {
  const parts = iri.split('/')
  return parts[parts.length - 1] || ''
}

function getModuleData<T>(modules: Record<string, { default: T }>): Map<string, T> {
  const map = new Map<string, T>()
  for (const [path, module] of Object.entries(modules)) {
    const data = module?.default
    if (data && (data as any)['@id']) {
      const slug = extractSlugFromIRI((data as any)['@id'])
      map.set(slug, data)
    }
  }
  return map
}

function getGraphData(modules: Record<string, { default: { '@graph': ReferenceItem[] } }>): Map<string, ReferenceItem> {
  const map = new Map<string, ReferenceItem>()
  for (const module of Object.values(modules)) {
    const data = module?.default
    if (data && data['@graph']) {
      for (const item of data['@graph']) {
        if (item['@id']) {
          map.set(item['@id'], item)
        }
      }
    }
  }
  return map
}

// ============================================================================
// HerbapediaDatasetBrowser Class
// ============================================================================

class HerbapediaDatasetBrowser {
  private plantsCache: Map<string, PlantSpecies>
  private tcmCache: Map<string, TCMProfile>
  private westernCache: Map<string, WesternHerbalProfile>

  // Reference data
  private meridianMap: Map<string, ReferenceItem>
  private natureMap: Map<string, ReferenceItem>
  private flavorMap: Map<string, ReferenceItem>
  private categoryMap: Map<string, ReferenceItem>
  private actionMap: Map<string, ReferenceItem>
  private organMap: Map<string, ReferenceItem>

  // Indexes for cross-reference queries
  private tcmByNature: Map<string, string[]> = new Map()
  private tcmByCategory: Map<string, string[]> = new Map()
  private tcmByMeridian: Map<string, string[]> = new Map()
  private westernByAction: Map<string, string[]> = new Map()
  private westernByOrgan: Map<string, string[]> = new Map()

  constructor() {
    // Load all data
    this.plantsCache = getModuleData(plantModules)
    this.tcmCache = getModuleData(tcmModules)
    this.westernCache = getModuleData(westernModules)

    // Load reference data
    this.meridianMap = getGraphData(meridianModules)
    this.natureMap = getGraphData(natureModules)
    this.flavorMap = getGraphData(flavorModules)
    this.categoryMap = getGraphData(categoryModules)
    this.actionMap = getGraphData(westernActionModules)
    this.organMap = getGraphData(westernOrganModules)

    // Build indexes
    this.buildIndexes()
  }

  private buildIndexes(): void {
    // Build TCM indexes
    for (const [slug, profile] of this.tcmCache) {
      // Index by nature
      if (profile.hasNature) {
        const natureId = typeof profile.hasNature === 'object'
          ? profile.hasNature['@id']
          : profile.hasNature
        const natureSlug = extractSlugFromIRI(natureId)
        if (!this.tcmByNature.has(natureSlug)) {
          this.tcmByNature.set(natureSlug, [])
        }
        this.tcmByNature.get(natureSlug)!.push(slug)
      }

      // Index by category
      if (profile.hasCategory) {
        const categoryId = typeof profile.hasCategory === 'object'
          ? profile.hasCategory['@id']
          : profile.hasCategory
        const categorySlug = extractSlugFromIRI(categoryId)
        if (!this.tcmByCategory.has(categorySlug)) {
          this.tcmByCategory.set(categorySlug, [])
        }
        this.tcmByCategory.get(categorySlug)!.push(slug)
      }

      // Index by meridian
      if (profile.entersMeridian) {
        for (const meridianRef of profile.entersMeridian) {
          const meridianId = typeof meridianRef === 'object'
            ? meridianRef['@id']
            : meridianRef
          const meridianSlug = extractSlugFromIRI(meridianId)
          if (!this.tcmByMeridian.has(meridianSlug)) {
            this.tcmByMeridian.set(meridianSlug, [])
          }
          this.tcmByMeridian.get(meridianSlug)!.push(slug)
        }
      }
    }

    // Build Western indexes
    for (const [slug, profile] of this.westernCache) {
      // Index by action
      if (profile.hasAction) {
        for (const actionRef of profile.hasAction) {
          const actionId = typeof actionRef === 'object'
            ? actionRef['@id']
            : actionRef
          const actionSlug = extractSlugFromIRI(actionId)
          if (!this.westernByAction.has(actionSlug)) {
            this.westernByAction.set(actionSlug, [])
          }
          this.westernByAction.get(actionSlug)!.push(slug)
        }
      }

      // Index by organ affinity
      if (profile.hasOrganAffinity) {
        for (const organRef of profile.hasOrganAffinity) {
          const organId = typeof organRef === 'object'
            ? organRef['@id']
            : organRef
          const organSlug = extractSlugFromIRI(organId)
          if (!this.westernByOrgan.has(organSlug)) {
            this.westernByOrgan.set(organSlug, [])
          }
          this.westernByOrgan.get(organSlug)!.push(slug)
        }
      }
    }
  }

  // ===========================================================================
  // Botanical Queries
  // ===========================================================================

  getPlantSpecies(slug: string): PlantSpecies | null {
    return this.plantsCache.get(slug) || null
  }

  getAllPlants(): PlantSpecies[] {
    return Array.from(this.plantsCache.values())
  }

  findByScientificName(name: string): PlantSpecies | null {
    const normalizedName = name.toLowerCase()
    for (const plant of this.plantsCache.values()) {
      if (plant.scientificName?.toLowerCase() === normalizedName) {
        return plant
      }
    }
    return null
  }

  // ===========================================================================
  // Profile Queries
  // ===========================================================================

  getTCMProfile(slug: string): TCMProfile | null {
    return this.tcmCache.get(slug) || null
  }

  getWesternProfile(slug: string): WesternHerbalProfile | null {
    return this.westernCache.get(slug) || null
  }

  /**
   * Get all system profiles for a plant slug.
   * Looks up TCM and Western profiles that derive from this plant.
   */
  getAllProfilesForPlant(plantSlug: string): SystemProfiles {
    const result: SystemProfiles = {}

    // Find TCM profile for this plant
    for (const profile of this.tcmCache.values()) {
      if (profile.derivedFromPlant?.['@id']) {
        const refSlug = extractSlugFromIRI(profile.derivedFromPlant['@id'])
          .replace('#root', '')
          .replace('#leaf', '')
        if (refSlug === plantSlug) {
          result.tcm = profile
          break
        }
      }
    }

    // Find Western profile for this plant
    const westernProfile = this.westernCache.get(plantSlug)
    if (westernProfile) {
      result.western = westernProfile
    }

    return result
  }

  // ===========================================================================
  // Cross-Reference Queries
  // ===========================================================================

  getTCMByNature(nature: string): TCMProfile[] {
    const slugs = this.tcmByNature.get(nature) || []
    return slugs.map(slug => this.getTCMProfile(slug)).filter((p): p is TCMProfile => p !== null)
  }

  getTCMByCategory(category: string): TCMProfile[] {
    const slugs = this.tcmByCategory.get(category) || []
    return slugs.map(slug => this.getTCMProfile(slug)).filter((p): p is TCMProfile => p !== null)
  }

  getTCMByMeridian(meridian: string): TCMProfile[] {
    const slugs = this.tcmByMeridian.get(meridian) || []
    return slugs.map(slug => this.getTCMProfile(slug)).filter((p): p is TCMProfile => p !== null)
  }

  getWesternByAction(action: string): WesternHerbalProfile[] {
    const slugs = this.westernByAction.get(action) || []
    return slugs.map(slug => this.getWesternProfile(slug)).filter((p): p is WesternHerbalProfile => p !== null)
  }

  getWesternByOrgan(organ: string): WesternHerbalProfile[] {
    const slugs = this.westernByOrgan.get(organ) || []
    return slugs.map(slug => this.getWesternProfile(slug)).filter((p): p is WesternHerbalProfile => p !== null)
  }

  // ===========================================================================
  // Reference Data
  // ===========================================================================

  private normalizeRefId(id: string, prefix: string): string {
    // Strip prefix if present (e.g., "tcm/nature/hot" -> "nature/hot")
    if (id.startsWith(prefix + '/')) {
      return id.substring(prefix.length + 1)
    }
    return id
  }

  getMeridian(id: string): ReferenceItem | null {
    const normalizedId = this.normalizeRefId(id, 'tcm')
    return this.meridianMap.get(normalizedId) || this.meridianMap.get(id) || null
  }

  getNature(id: string): ReferenceItem | null {
    const normalizedId = this.normalizeRefId(id, 'tcm')
    return this.natureMap.get(normalizedId) || this.natureMap.get(id) || null
  }

  getFlavor(id: string): ReferenceItem | null {
    const normalizedId = this.normalizeRefId(id, 'tcm')
    return this.flavorMap.get(normalizedId) || this.flavorMap.get(id) || null
  }

  getCategory(id: string): ReferenceItem | null {
    const normalizedId = this.normalizeRefId(id, 'tcm')
    return this.categoryMap.get(normalizedId) || this.categoryMap.get(id) || null
  }

  getAction(id: string): ReferenceItem | null {
    const normalizedId = this.normalizeRefId(id, 'western')
    return this.actionMap.get(normalizedId) || this.actionMap.get(id) || null
  }

  getOrgan(id: string): ReferenceItem | null {
    const normalizedId = this.normalizeRefId(id, 'western')
    return this.organMap.get(normalizedId) || this.organMap.get(id) || null
  }

  getAllNatures(): ReferenceItem[] {
    return Array.from(this.natureMap.values())
  }

  getAllFlavors(): ReferenceItem[] {
    return Array.from(this.flavorMap.values())
  }

  getAllMeridians(): ReferenceItem[] {
    return Array.from(this.meridianMap.values())
  }

  getAllCategories(): ReferenceItem[] {
    return Array.from(this.categoryMap.values())
  }

  getAllActions(): ReferenceItem[] {
    return Array.from(this.actionMap.values())
  }

  getAllOrgans(): ReferenceItem[] {
    return Array.from(this.organMap.values())
  }

  // ===========================================================================
  // Statistics
  // ===========================================================================

  getCounts() {
    return {
      plants: this.plantsCache.size,
      tcmProfiles: this.tcmCache.size,
      westernProfiles: this.westernCache.size,
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const dataset = new HerbapediaDatasetBrowser()

export default dataset
