/**
 * Herbapedia Dataset - Browser Adapter (v2 Architecture)
 *
 * Preparation-centric data access. HerbalPreparation is the central entity
 * that links botanical sources to system profiles (TCM, Western, Ayurveda, Persian, Mongolian)
 *
 * Architecture:
 *   PlantSpecies → PlantPart → HerbalPreparation → System Profiles
 *
 * @example
 * ```typescript
 * import { dataset } from '@/api/dataset'
 *
 * // Get a preparation with all its profiles
 * const prep = dataset.getPreparation('dried-ginger-rhizome')
 * console.log(prep?.hasTCMProfile) // TCM profile reference
 *
 * // Get resolved profiles
 * const profiles = dataset.getProfilesForPreparation('dried-ginger-rhizome')
 * console.log(profiles.tcm?.pinyin) // "Gān Jiāng"
 * console.log(profiles.ayurveda?.sanskritTransliteration) // "Nāgara"
 * ```
 */

import type { LanguageMap, IRIReference } from '@herbapedia/data/types'

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
  description?: LanguageMap
  botanicalDescription?: LanguageMap
  image?: string
  hasParts?: IRIReference[]
  containsChemical?: IRIReference[]
  hasDNABarcode?: IRIReference
  hasChemicalProfile?: IRIReference
  // External identifiers
  gbifID?: string
  wikidataID?: string
  ncbiTaxonomyID?: string
}

export interface PlantPart extends Entity {
  name?: LanguageMap
  partOf?: IRIReference
  description?: LanguageMap
}

export interface HerbalPreparation extends Entity {
  name?: LanguageMap
  description?: LanguageMap
  derivedFrom?: IRIReference[]
  preparationMethod?: IRIReference | string
  form?: IRIReference | string
  image?: string
  hasTCMProfile?: IRIReference[]
  hasWesternProfile?: IRIReference[]
  hasAyurvedaProfile?: IRIReference[]
  hasPersianProfile?: IRIReference[]
  hasMongolianProfile?: IRIReference[]
  relatedPreparations?: IRIReference[]
  safetyInfo?: {
    allergens?: string[]
    pregnancySafety?: LanguageMap
    generalContraindications?: LanguageMap
    drugInteractions?: string[]
    warnings?: LanguageMap[]
  }
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
  tcmFunctions?: LanguageMap
  tcmTraditionalUsage?: LanguageMap
  tcmModernResearch?: LanguageMap
  tcmHistory?: LanguageMap
  indications?: string[]
  contraindications?: LanguageMap
  dosage?: LanguageMap
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

export interface AyurvedaProfile extends Entity {
  name?: LanguageMap
  sanskritName?: string
  sanskritTransliteration?: string
  hindiName?: string
  profiles?: IRIReference
  derivedFromPlant?: IRIReference
  hasRasa?: IRIReference[]
  hasGuna?: IRIReference[]
  hasVirya?: IRIReference
  hasVipaka?: IRIReference
  affectsDosha?: {
    vata?: { effect: string; notes?: string }
    pitta?: { effect: string; notes?: string }
    kapha?: { effect: string; notes?: string }
  }
  ayurvedaCategory?: IRIReference
  karma?: string[]
  ayurvedaTraditionalUsage?: LanguageMap
  ayurvedaModernResearch?: LanguageMap
  classicalReferences?: Array<{
    text: string
    reference: string
    quote: string
  }>
  indications?: string[]
  contraindications?: LanguageMap
}

export interface PersianProfile extends Entity {
  name?: LanguageMap
  persianName?: string
  persianTransliteration?: string
  arabicName?: string
  profiles?: IRIReference
  derivedFromPlant?: IRIReference
  hasTemperament?: IRIReference
  temperamentDegree?: number
  hasElement?: IRIReference[]
  mizajConstituents?: Array<{
    substance: string
    temperament: IRIReference
    proportion: string
  }>
  actions?: string[]
  persianFunctions?: LanguageMap
  indications?: string[]
  affectedOrgans?: string[]
  contraindications?: LanguageMap
}

export interface MongolianProfile extends Entity {
  name?: LanguageMap
  mongolianName?: string
  tibetanName?: string
  tibetanWylie?: string
  profiles?: IRIReference
  derivedFromPlant?: IRIReference
  hasElement?: IRIReference[]
  affectsRoots?: {
    heyi?: { effect: string }
    xila?: { effect: string }
    badagan?: { effect: string }
  }
  hasTaste?: IRIReference[]
  hasPotency?: IRIReference[]
  therapeuticClass?: string
  mongolianFunctions?: LanguageMap
  indications?: string[]
  contraIndications?: LanguageMap
}

export interface SystemProfiles {
  tcm?: TCMProfile
  western?: WesternHerbalProfile
  ayurveda?: AyurvedaProfile
  persian?: PersianProfile
  mongolian?: MongolianProfile
}

export interface ReferenceItem {
  '@id': string
  '@type'?: string[]
  prefLabel?: LanguageMap
  name?: LanguageMap  // Some data uses 'name' instead of 'prefLabel'
  description?: LanguageMap
  pinyin?: string
  code?: string
}

export interface ChemicalCompound extends Entity {
  name?: LanguageMap
  description?: LanguageMap
  molecularFormula?: string
  foundIn?: IRIReference[]
  // External identifiers
  chebiID?: string
  pubChemID?: string
  inchi?: string
  inchiKey?: string
}

export interface ChemicalProfile extends Entity {
  name?: LanguageMap
  profileOf?: IRIReference
  components?: Array<{
    compound: IRIReference
    concentration?: string
    unit?: string
    relativeAbundance?: string
  }>
  analyticalMethod?: string
  qualityGrade?: string
  citations?: Array<{
    doi?: string
    title?: string
    year?: number
    journal?: string
  }>
}

export interface DNABarcode extends Entity {
  name?: LanguageMap
  species?: IRIReference
  sequence?: Array<{
    region: string
    sequence?: string
    length?: number
    gcContent?: number
    genbankAccession?: string
    sequenceQuality?: string
  }>
  identificationConfidence?: {
    level?: string
    confidence?: number
    method?: string
  }
  adulterantDetection?: {
    canDetect?: string[]
  }
  voucheredSpecimen?: {
    herbarium?: string
    collector?: string
    collectionLocation?: string
  }
}

export interface Formula extends Entity {
  name?: LanguageMap
  scientificName?: string
  description?: LanguageMap
  sourceType?: string
  sourceSubType?: string
  ingredients?: IRIReference[]
  image?: string
}

// System metadata (medical systems definitions)
export interface MedicalSystem {
  '@id': string
  '@type': string[]
  name: LanguageMap
  alternateName?: LanguageMap
  description?: LanguageMap
  nativeName?: LanguageMap
}

 // Image metadata (from media/images/*/main.json)
export interface ImageMetadata {
  fileName: string
  species?: string
  commonName?: string
  attribution: {
    copyright: string
    creator?: string
    license: string
    licenseUrl?: string | null
    source: string
    sourceUrl?: string | null
    spdxId: string
    spdxUrl?: string | null
    note?: string
  }
  downloaded: string
  width?: number
  height?: number
  caption?: string
}

// Source materials (non-botanical sources)
export interface SourceMaterial extends Entity {
  name?: LanguageMap
  description?: LanguageMap
  image?: string
  // Zoological-specific
  animalName?: LanguageMap
  animalScientificName?: string
  animalPart?: string
  // Mineral-specific
  chemicalFormula?: string
  // Chemical-specific
  isSynthesized?: boolean
  sourceType?: 'botanical' | 'zoological' | 'mineral' | 'chemical'
}

// ============================================================================
// Data Loading (Vite import.meta.glob)
// ============================================================================

// Preparations - CENTRAL ENTITIES
const preparationModules = import.meta.glob('@herbapedia/data/entities/preparations/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: HerbalPreparation }>

// Botanical entities
const plantModules = import.meta.glob('@herbapedia/data/entities/botanical/species/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: PlantSpecies }>

const plantPartModules = import.meta.glob('@herbapedia/data/entities/botanical/parts/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: PlantPart }>

// System profiles - ALL 5 SYSTEMS
const tcmModules = import.meta.glob('@herbapedia/data/profiles/tcm/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: TCMProfile }>

const westernModules = import.meta.glob('@herbapedia/data/profiles/western/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: WesternHerbalProfile }>

const ayurvedaModules = import.meta.glob('@herbapedia/data/profiles/ayurveda/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: AyurvedaProfile }>

const persianModules = import.meta.glob('@herbapedia/data/profiles/persian/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: PersianProfile }>

const mongolianModules = import.meta.glob('@herbapedia/data/profiles/mongolian/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: MongolianProfile }>

// Reference data - TCM (reference subdirectory for all)
const meridianModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/meridians.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const natureModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/natures.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const flavorModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/flavors.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const categoryModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/categories.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Western (reference subdirectory for all)
const westernActionModules = import.meta.glob('@herbapedia/data/systems/western/reference/actions.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const westernOrganModules = import.meta.glob('@herbapedia/data/systems/western/reference/organs.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Ayurveda (root level files)
const rasaModules = import.meta.glob('@herbapedia/data/systems/ayurveda/rasas.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const gunaModules = import.meta.glob('@herbapedia/data/systems/ayurveda/gunas.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const viryaModules = import.meta.glob('@herbapedia/data/systems/ayurveda/viryas.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const vipakaModules = import.meta.glob('@herbapedia/data/systems/ayurveda/vipakas.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const doshaModules = import.meta.glob('@herbapedia/data/systems/ayurveda/doshas.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Ayurveda (reference subdirectory)
const karmaModules = import.meta.glob('@herbapedia/data/systems/ayurveda/reference/karmas.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const mahabhutaModules = import.meta.glob('@herbapedia/data/systems/ayurveda/reference/mahabhutas.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const ayurvedaCategoryModules = import.meta.glob('@herbapedia/data/systems/ayurveda/reference/categories.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const prabhavaModules = import.meta.glob('@herbapedia/data/systems/ayurveda/reference/prabhavas.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Persian (reference subdirectory)
const temperamentModules = import.meta.glob('@herbapedia/data/systems/persian/reference/temperaments.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const persianElementModules = import.meta.glob('@herbapedia/data/systems/persian/reference/elements.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const persianDegreeModules = import.meta.glob('@herbapedia/data/systems/persian/reference/degrees.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Mongolian (reference subdirectory)
const mongolianElementModules = import.meta.glob('@herbapedia/data/systems/mongolian/reference/elements.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const mongolianTasteModules = import.meta.glob('@herbapedia/data/systems/mongolian/reference/tastes.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const mongolianRootModules = import.meta.glob('@herbapedia/data/systems/mongolian/reference/roots.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const mongolianPotencyModules = import.meta.glob('@herbapedia/data/systems/mongolian/reference/potencies.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - TCM actions (reference subdirectory)
const tcmActionModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/actions.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Western systems (reference subdirectory)
const westernSystemModules = import.meta.glob('@herbapedia/data/systems/western/reference/systems.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Herbal vocabulary (forms and methods)
const herbalFormModules = import.meta.glob('@herbapedia/data/schema/vocab/herbal/forms.jsonld', {
  eager: true
}) as Record<string, { default: { members: ReferenceItem[] } }>

const herbalMethodModules = import.meta.glob('@herbapedia/data/schema/vocab/herbal/methods.jsonld', {
  eager: true
}) as Record<string, { default: { members: ReferenceItem[] } }>

// Chemical compounds
const chemicalModules = import.meta.glob('@herbapedia/data/entities/botanical/chemicals/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: ChemicalCompound }>

// Source materials (non-botanical)
const zoologicalSourceModules = import.meta.glob('@herbapedia/data/entities/sources/zoological/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: SourceMaterial }>

const mineralSourceModules = import.meta.glob('@herbapedia/data/entities/sources/mineral/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: SourceMaterial }>

const chemicalSourceModules = import.meta.glob('@herbapedia/data/entities/sources/chemical/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: SourceMaterial }>

// Chemical profiles
const chemicalProfileModules = import.meta.glob('@herbapedia/data/entities/botanical/profiles/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: ChemicalProfile }>

// DNA barcodes
const dnaBarcodeModules = import.meta.glob('@herbapedia/data/entities/botanical/barcodes/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: DNABarcode }>

// Formulas
const formulaModules = import.meta.glob('@herbapedia/data/entities/formulas/*/entity.jsonld', {
  eager: true
}) as Record<string, { default: Formula }>

// Image metadata (main.json files in media/images)
const imageMetadataModules = import.meta.glob('@herbapedia/data/media/images/*/main.json', {
  eager: true
}) as Record<string, { default: ImageMetadata }>

// ============================================================================
// Utility Functions
// ============================================================================

function extractSlugFromIRI(iri: string): string {
  const parts = iri.split('/')
  return parts[parts.length - 1] || ''
}

function getModuleData<T>(modules: Record<string, { default: T }>): Map<string, T> {
  const map = new Map<string, T>()
  for (const [, module] of Object.entries(modules)) {
    const data = module?.default
    if (data && (data as any)['@id']) {
      const slug = extractSlugFromIRI((data as any)['@id'])
      map.set(slug, data)
    }
  }
  return map
}

function getGraphData(modules: Record<string, { default: { '@graph'?: ReferenceItem[]; members?: ReferenceItem[] } }>): Map<string, ReferenceItem> {
  const map = new Map<string, ReferenceItem>()
  for (const module of Object.values(modules)) {
    const data = module?.default
    if (data) {
      // Handle @graph array
      if (data['@graph']) {
        for (const item of data['@graph']) {
          if (item['@id']) {
            map.set(item['@id'], item)
          }
        }
      }
      // Handle members array
      if (data.members) {
        for (const item of data.members) {
          if (item['@id']) {
            map.set(item['@id'], item)
          }
        }
      }
    }
  }
  return map
}

function getMembersData(modules: Record<string, { default: { members: ReferenceItem[] } }>): Map<string, ReferenceItem> {
  const map = new Map<string, ReferenceItem>()
  for (const module of Object.values(modules)) {
    const data = module?.default
    if (data && data.members) {
      for (const item of data.members) {
        if (item['@id']) {
          map.set(item['@id'], item)
        }
      }
    }
  }
  return map
}

// ============================================================================
// HerbapediaDataset Class
// ============================================================================

class HerbapediaDatasetBrowser {
  // Primary entities
  private preparationsCache: Map<string, HerbalPreparation>
  private plantsCache: Map<string, PlantSpecies>
  private plantPartsCache: Map<string, PlantPart>

  // System profile caches - ALL 5 SYSTEMS
  private tcmCache: Map<string, TCMProfile>
  private westernCache: Map<string, WesternHerbalProfile>
  private ayurvedaCache: Map<string, AyurvedaProfile>
  private persianCache: Map<string, PersianProfile>
  private mongolianCache: Map<string, MongolianProfile>

  // Reference data - TCM
  private meridianMap: Map<string, ReferenceItem>
  private natureMap: Map<string, ReferenceItem>
  private flavorMap: Map<string, ReferenceItem>
  private categoryMap: Map<string, ReferenceItem>

  // Reference data - Western
  private actionMap: Map<string, ReferenceItem>
  private organMap: Map<string, ReferenceItem>

  // Reference data - Ayurveda
  private rasaMap: Map<string, ReferenceItem>
  private gunaMap: Map<string, ReferenceItem>
  private viryaMap: Map<string, ReferenceItem>
  private vipakaMap: Map<string, ReferenceItem>
  private doshaMap: Map<string, ReferenceItem>
  private karmaMap: Map<string, ReferenceItem>
  private mahabhutaMap: Map<string, ReferenceItem>
  private ayurvedaCategoryMap: Map<string, ReferenceItem>
  private prabhavaMap: Map<string, ReferenceItem>

  // Reference data - Persian
  private temperamentMap: Map<string, ReferenceItem>
  private persianElementMap: Map<string, ReferenceItem>
  private persianDegreeMap: Map<string, ReferenceItem>

  // Reference data - Mongolian
  private mongolianElementMap: Map<string, ReferenceItem>
  private mongolianTasteMap: Map<string, ReferenceItem>
  private mongolianRootMap: Map<string, ReferenceItem>
  private mongolianPotencyMap: Map<string, ReferenceItem>

  // Reference data - TCM
  private tcmActionMap: Map<string, ReferenceItem>

  // Reference data - Western
  private westernSystemMap: Map<string, ReferenceItem>

  // Herbal vocabulary
  private herbalFormMap: Map<string, ReferenceItem>
  private herbalMethodMap: Map<string, ReferenceItem>

  // Other entities
  private chemicalMap: Map<string, ChemicalCompound>
  private chemicalProfileCache: Map<string, ChemicalProfile>
  private dnaBarcodeCache: Map<string, DNABarcode>
  private formulaCache: Map<string, Formula>

  // System metadata
  private systemMetadataCache: Map<string, MedicalSystem>

  // Source materials (non-botanical)
  private zoologicalSourcesCache: Map<string, SourceMaterial>
  private mineralSourcesCache: Map<string, SourceMaterial>
  private chemicalSourcesCache: Map<string, SourceMaterial>

  // Image metadata
  private imageMetadataCache: Map<string, ImageMetadata>

  // Indexes for navigation
  private preparationsByPlant: Map<string, string[]> = new Map()
  private preparationsByTCMCategory: Map<string, string[]> = new Map()
  private preparationsByNature: Map<string, string[]> = new Map()
  private preparationsByAction: Map<string, string[]> = new Map()

  constructor() {
    // Load primary entities
    this.preparationsCache = getModuleData(preparationModules)
    this.plantsCache = getModuleData(plantModules)
    this.plantPartsCache = getModuleData(plantPartModules)

    // Load system profiles - ALL 5 SYSTEMS
    this.tcmCache = getModuleData(tcmModules)
    this.westernCache = getModuleData(westernModules)
    this.ayurvedaCache = getModuleData(ayurvedaModules)
    this.persianCache = getModuleData(persianModules)
    this.mongolianCache = getModuleData(mongolianModules)

    // Load TCM reference data
    this.meridianMap = getGraphData(meridianModules)
    this.natureMap = getGraphData(natureModules)
    this.flavorMap = getGraphData(flavorModules)
    this.categoryMap = getGraphData(categoryModules)

    // Load Western reference data
    this.actionMap = getGraphData(westernActionModules)
    this.organMap = getGraphData(westernOrganModules)

    // Load Ayurveda reference data
    this.rasaMap = getGraphData(rasaModules)
    this.gunaMap = getGraphData(gunaModules)
    this.viryaMap = getGraphData(viryaModules)
    this.vipakaMap = getGraphData(vipakaModules)
    this.doshaMap = getGraphData(doshaModules)
    this.karmaMap = getGraphData(karmaModules)
    this.mahabhutaMap = getGraphData(mahabhutaModules)
    this.ayurvedaCategoryMap = getGraphData(ayurvedaCategoryModules)
    this.prabhavaMap = getGraphData(prabhavaModules)

    // Load Persian reference data
    this.temperamentMap = getGraphData(temperamentModules)
    this.persianElementMap = getGraphData(persianElementModules)
    this.persianDegreeMap = getGraphData(persianDegreeModules)

    // Load Mongolian reference data
    this.mongolianElementMap = getGraphData(mongolianElementModules)
    this.mongolianTasteMap = getGraphData(mongolianTasteModules)
    this.mongolianRootMap = getGraphData(mongolianRootModules)
    this.mongolianPotencyMap = getGraphData(mongolianPotencyModules)

    // Load TCM actions reference data
    this.tcmActionMap = getGraphData(tcmActionModules)

    // Load Western systems reference data
    this.westernSystemMap = getGraphData(westernSystemModules)

    // Load herbal vocabulary
    this.herbalFormMap = getMembersData(herbalFormModules)
    this.herbalMethodMap = getMembersData(herbalMethodModules)

    // Load other entities
    this.chemicalMap = getModuleData(chemicalModules)
    this.chemicalProfileCache = getModuleData(chemicalProfileModules)
    this.dnaBarcodeCache = getModuleData(dnaBarcodeModules)
    this.formulaCache = getModuleData(formulaModules)

    // Load source materials
    this.zoologicalSourcesCache = getModuleData(zoologicalSourceModules)
    this.mineralSourcesCache = getModuleData(mineralSourceModules)
    this.chemicalSourcesCache = getModuleData(chemicalSourceModules)

    // Load image metadata
    this.imageMetadataCache = this.loadImageMetadata()

    // Build navigation indexes
    this.buildIndexes()
  }

  private loadImageMetadata(): Map<string, ImageMetadata> {
    const map = new Map<string, ImageMetadata>()
    for (const [path, module] of Object.entries(imageMetadataModules)) {
      const data = module?.default
      if (data) {
        // Extract slug from path like '.../media/images/curcuma-longa/main.json'
        const match = path.match(/media\/images\/([^/]+)\/main\.json$/)
        if (match) {
          const slug = match[1]
          map.set(slug, data)
        }
      }
    }
    return map
  }

  private buildIndexes(): void {
    for (const [slug, prep] of this.preparationsCache) {
      // Index by botanical source
      if (prep.derivedFrom) {
        for (const ref of prep.derivedFrom) {
          const sourceSlug = extractSlugFromIRI(ref['@id'])
          if (!this.preparationsByPlant.has(sourceSlug)) {
            this.preparationsByPlant.set(sourceSlug, [])
          }
          this.preparationsByPlant.get(sourceSlug)!.push(slug)
        }
      }

      // Index by TCM profile properties
      if (prep.hasTCMProfile) {
        const tcmSlug = extractSlugFromIRI(prep.hasTCMProfile[0]['@id'])
        const tcmProfile = this.tcmCache.get(tcmSlug)
        if (tcmProfile) {
          // By category
          if (tcmProfile.hasCategory) {
            const catSlug = extractSlugFromIRI(tcmProfile.hasCategory['@id'])
            if (!this.preparationsByTCMCategory.has(catSlug)) {
              this.preparationsByTCMCategory.set(catSlug, [])
            }
            this.preparationsByTCMCategory.get(catSlug)!.push(slug)
          }
          // By nature
          if (tcmProfile.hasNature) {
            const natureSlug = extractSlugFromIRI(tcmProfile.hasNature['@id'])
            if (!this.preparationsByNature.has(natureSlug)) {
              this.preparationsByNature.set(natureSlug, [])
            }
            this.preparationsByNature.get(natureSlug)!.push(slug)
          }
        }
      }

      // Index by Western action
      if (prep.hasWesternProfile) {
        const westernSlug = extractSlugFromIRI(prep.hasWesternProfile[0]['@id'])
        const westernProfile = this.westernCache.get(westernSlug)
        if (westernProfile?.hasAction) {
          for (const actionRef of westernProfile.hasAction) {
            const actionSlug = extractSlugFromIRI(actionRef['@id'])
            if (!this.preparationsByAction.has(actionSlug)) {
              this.preparationsByAction.set(actionSlug, [])
            }
            this.preparationsByAction.get(actionSlug)!.push(slug)
          }
        }
      }
    }
  }

  private normalizeRefId(id: string, prefix: string): string {
    // Handle full URLs by extracting the last segment
    if (id.startsWith('https://www.herbapedia.org/')) {
      const parts = id.split('/')
      return parts[parts.length - 1] || id
    }
    // Handle short prefixes like "tcm/" or "western/"
    if (id.startsWith(prefix + '/')) {
      return id.substring(prefix.length + 1)
    }
    return id
  }

  /**
   * Get a reference item from a map, trying multiple ID formats:
   * 1. Full URL: https://www.herbapedia.org/system/tcm/nature/hot
   * 2. System path: tcm/nature/hot
   * 3. Partial path: nature/hot
   * 4. Slug only: hot
   */
  private getRefItem(
    map: Map<string, ReferenceItem>,
    id: string,
    urlPrefixes: string[]
  ): ReferenceItem | null {
    // Try exact match first
    if (map.has(id)) {
      return map.get(id) || null
    }

    // Try with URL prefixes
    for (const prefix of urlPrefixes) {
      const fullUrl = `${prefix}${id}`
      if (map.has(fullUrl)) {
        return map.get(fullUrl) || null
      }
    }

    // If id is a full URL, try extracting the last segment
    if (id.startsWith('https://www.herbapedia.org/')) {
      const slug = id.split('/').pop() || ''
      // Try the slug directly
      if (map.has(slug)) {
        return map.get(slug) || null
      }
      // Try URL prefixes with the slug
      for (const prefix of urlPrefixes) {
        const fullUrl = `${prefix}${slug}`
        if (map.has(fullUrl)) {
          return map.get(fullUrl) || null
        }
      }
    }

    return null
  }

  // ===========================================================================
  // Preparation Queries (PRIMARY)
  // ===========================================================================

  /**
   * Get a preparation by slug.
   * Image paths are resolved to /@herbapedia/data/{path}
   */
  getPreparation(slug: string): HerbalPreparation | null {
    const prep = this.preparationsCache.get(slug)
    if (!prep) return null

    // Resolve image path to served location
    if (prep.image && !prep.image.startsWith('/@herbapedia')) {
      prep.image = `/@herbapedia/data/${prep.image}`
    }

    return prep
  }

  /**
   * Get all preparations with resolved image paths.
   */
  getAllPreparations(): HerbalPreparation[] {
    return Array.from(this.preparationsCache.keys())
      .map(slug => this.getPreparation(slug))
      .filter((p): p is HerbalPreparation => p !== null)
  }

  getPreparationsByPlant(plantSlug: string): HerbalPreparation[] {
    const slugs = this.preparationsByPlant.get(plantSlug) || []
    return slugs.map(s => this.getPreparation(s)).filter((p): p is HerbalPreparation => p !== null)
  }

  getPreparationsByTCMCategory(category: string): HerbalPreparation[] {
    const slugs = this.preparationsByTCMCategory.get(category) || []
    return slugs.map(s => this.getPreparation(s)).filter((p): p is HerbalPreparation => p !== null)
  }

  getPreparationsByNature(nature: string): HerbalPreparation[] {
    const slugs = this.preparationsByNature.get(nature) || []
    return slugs.map(s => this.getPreparation(s)).filter((p): p is HerbalPreparation => p !== null)
  }

  getPreparationsByAction(action: string): HerbalPreparation[] {
    const slugs = this.preparationsByAction.get(action) || []
    return slugs.map(s => this.getPreparation(s)).filter((p): p is HerbalPreparation => p !== null)
  }

  getRelatedPreparations(slug: string): HerbalPreparation[] {
    const prep = this.getPreparation(slug)
    if (!prep?.relatedPreparations) return []
    return prep.relatedPreparations
      .map(ref => this.getPreparation(extractSlugFromIRI(ref['@id'])))
      .filter((p): p is HerbalPreparation => p !== null)
  }

  // ===========================================================================
  // Profile Resolution - ALL 5 SYSTEMS
  // ===========================================================================

  getProfilesForPreparation(slug: string): SystemProfiles {
    const result: SystemProfiles = {}
    const prep = this.getPreparation(slug)
    if (!prep) return result

    // TCM
    if (prep.hasTCMProfile?.[0]) {
      const tcmSlug = extractSlugFromIRI(prep.hasTCMProfile[0]['@id'])
      result.tcm = this.tcmCache.get(tcmSlug) || undefined
    }

    // Western
    if (prep.hasWesternProfile?.[0]) {
      const westernSlug = extractSlugFromIRI(prep.hasWesternProfile[0]['@id'])
      result.western = this.westernCache.get(westernSlug) || undefined
    }

    // Ayurveda
    if (prep.hasAyurvedaProfile?.[0]) {
      const ayurvedaSlug = extractSlugFromIRI(prep.hasAyurvedaProfile[0]['@id'])
      result.ayurveda = this.ayurvedaCache.get(ayurvedaSlug) || undefined
    }

    // Persian
    if (prep.hasPersianProfile?.[0]) {
      const persianSlug = extractSlugFromIRI(prep.hasPersianProfile[0]['@id'])
      result.persian = this.persianCache.get(persianSlug) || undefined
    }

    // Mongolian
    if (prep.hasMongolianProfile?.[0]) {
      const mongolianSlug = extractSlugFromIRI(prep.hasMongolianProfile[0]['@id'])
      result.mongolian = this.mongolianCache.get(mongolianSlug) || undefined
    }

    return result
  }

  // Individual profile getters
  getTCMProfile(slug: string): TCMProfile | null {
    return this.tcmCache.get(slug) || null
  }

  getWesternProfile(slug: string): WesternHerbalProfile | null {
    return this.westernCache.get(slug) || null
  }

  getAyurvedaProfile(slug: string): AyurvedaProfile | null {
    return this.ayurvedaCache.get(slug) || null
  }

  getPersianProfile(slug: string): PersianProfile | null {
    return this.persianCache.get(slug) || null
  }

  getMongolianProfile(slug: string): MongolianProfile | null {
    return this.mongolianCache.get(slug) || null
  }

  // ===========================================================================
  // Botanical Queries
  // ===========================================================================

  /**
   * Get a plant species by slug.
   * Image paths are resolved to /@herbapedia/data/{path}
   */
  getPlantSpecies(slug: string): PlantSpecies | null {
    const plant = this.plantsCache.get(slug)
    if (!plant) return null

    // Resolve image path to served location
    if (plant.image && !plant.image.startsWith('/@herbapedia')) {
      plant.image = `/@herbapedia/data/${plant.image}`
    }

    return plant
  }

  /**
   * Get all plants (PlantSpecies type only) with resolved image paths.
   */
  getAllPlants(): PlantSpecies[] {
    return Array.from(this.plantsCache.keys())
      .map(slug => this.getPlantSpecies(slug))
      .filter((p): p is PlantSpecies => p !== null && this.isPlantType(p, 'plant'))
  }

  /**
   * Get all fungi (FungalSpecies type) with resolved image paths.
   */
  getAllFungi(): PlantSpecies[] {
    return Array.from(this.plantsCache.keys())
      .map(slug => this.getPlantSpecies(slug))
      .filter((p): p is PlantSpecies => p !== null && this.isPlantType(p, 'fungi'))
  }

  /**
   * Get all algae (AlgalSpecies type) with resolved image paths.
   */
  getAllAlgae(): PlantSpecies[] {
    return Array.from(this.plantsCache.keys())
      .map(slug => this.getPlantSpecies(slug))
      .filter((p): p is PlantSpecies => p !== null && this.isPlantType(p, 'algae'))
  }

  /**
   * Get all botanical species (plants, fungi, algae) with resolved image paths.
   */
  getAllBotanical(): PlantSpecies[] {
    return Array.from(this.plantsCache.keys())
      .map(slug => this.getPlantSpecies(slug))
      .filter((p): p is PlantSpecies => p !== null)
  }

  /**
   * Get species by source type ('plant', 'fungi', 'algae', or 'all' for all botanical).
   */
  getSpeciesByType(sourceType: 'plant' | 'fungi' | 'algae' | 'all'): PlantSpecies[] {
    switch (sourceType) {
      case 'plant':
        return this.getAllPlants()
      case 'fungi':
        return this.getAllFungi()
      case 'algae':
        return this.getAllAlgae()
      case 'all':
      default:
        return this.getAllBotanical()
    }
  }

  /**
   * Check if a species is of a specific type based on @type.
   */
  private isPlantType(species: PlantSpecies, type: 'plant' | 'fungi' | 'algae'): boolean {
    const types = Array.isArray(species['@type']) ? species['@type'] : [species['@type']]
    const typeStr = types.join(' ').toLowerCase()

    switch (type) {
      case 'plant':
        return typeStr.includes('plantspecies') ||
               (typeStr.includes('botany') && !typeStr.includes('fungal') && !typeStr.includes('algal'))
      case 'fungi':
        return typeStr.includes('fungal') || typeStr.includes('fungi') || typeStr.includes('mycology')
      case 'algae':
        return typeStr.includes('algal') || typeStr.includes('algae') || typeStr.includes('phycology')
      default:
        return false
    }
  }

  getPlantsWithPreparations(): { plant: PlantSpecies; preparationCount: number }[] {
    const result: { plant: PlantSpecies; preparationCount: number }[] = []
    for (const [plantSlug, prepSlugs] of this.preparationsByPlant) {
      const plant = this.getPlantSpecies(plantSlug)
      if (plant && prepSlugs.length > 0 && this.isPlantType(plant, 'plant')) {
        result.push({ plant, preparationCount: prepSlugs.length })
      }
    }
    return result.sort((a, b) => b.preparationCount - a.preparationCount)
  }

  getFungiWithPreparations(): { plant: PlantSpecies; preparationCount: number }[] {
    const result: { plant: PlantSpecies; preparationCount: number }[] = []
    for (const [plantSlug, prepSlugs] of this.preparationsByPlant) {
      const plant = this.getPlantSpecies(plantSlug)
      if (plant && prepSlugs.length > 0 && this.isPlantType(plant, 'fungi')) {
        result.push({ plant, preparationCount: prepSlugs.length })
      }
    }
    return result.sort((a, b) => b.preparationCount - a.preparationCount)
  }

  getAlgaeWithPreparations(): { plant: PlantSpecies; preparationCount: number }[] {
    const result: { plant: PlantSpecies; preparationCount: number }[] = []
    for (const [plantSlug, prepSlugs] of this.preparationsByPlant) {
      const plant = this.getPlantSpecies(plantSlug)
      if (plant && prepSlugs.length > 0 && this.isPlantType(plant, 'algae')) {
        result.push({ plant, preparationCount: prepSlugs.length })
      }
    }
    return result.sort((a, b) => b.preparationCount - a.preparationCount)
  }

  getPreparationCountForPlant(plantSlug: string): number {
    return this.preparationsByPlant.get(plantSlug)?.length || 0
  }

  searchPlants(query: string): PlantSpecies[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllPlants().filter(plant => {
      const sciMatch = plant.scientificName?.toLowerCase().includes(lowerQuery)
      const commonMatch = plant.commonName && (
        plant.commonName.en?.toLowerCase().includes(lowerQuery) ||
        plant.commonName['zh-Hant']?.includes(query) ||
        plant.commonName['zh-Hans']?.includes(query)
      )
      return sciMatch || commonMatch
    })
  }

  // ============================================================================
  // Source Materials (Non-Botanical)
  // ============================================================================

  /**
   * Get all zoological sources
   */
  getAllZoologicalSources(): SourceMaterial[] {
    return Array.from(this.zoologicalSourcesCache.values())
  }

  /**
   * Get a zoological source by slug
   */
  getZoologicalSource(slug: string): SourceMaterial | null {
    return this.zoologicalSourcesCache.get(slug) || null
  }

  /**
   * Get all mineral sources
   */
  getAllMineralSources(): SourceMaterial[] {
    return Array.from(this.mineralSourcesCache.values())
  }

  /**
   * Get a mineral source by slug
   */
  getMineralSource(slug: string): SourceMaterial | null {
    return this.mineralSourcesCache.get(slug) || null
  }

  /**
   * Get all chemical sources
   */
  getAllChemicalSources(): SourceMaterial[] {
    return Array.from(this.chemicalSourcesCache.values())
  }

  /**
   * Get a chemical source by slug
   */
  getChemicalSource(slug: string): SourceMaterial | null {
    return this.chemicalSourcesCache.get(slug) || null
  }

  getPlantPart(slug: string): PlantPart | null {
    return this.plantPartsCache.get(slug) || null
  }

  getSourcePlant(prepSlug: string): PlantSpecies | null {
    const prep = this.getPreparation(prepSlug)
    if (!prep?.derivedFrom?.[0]) return null
    const sourceSlug = extractSlugFromIRI(prep.derivedFrom[0]['@id'])
    return this.getPlantSpecies(sourceSlug)
  }

  // ===========================================================================
  // Chemical Compound Queries
  // ===========================================================================

  getChemical(id: string): ChemicalCompound | null {
    const normalizedId = this.normalizeRefId(id, 'botanical')
    return this.chemicalMap.get(normalizedId) || this.chemicalMap.get(id) || null
  }

  getAllChemicals(): ChemicalCompound[] {
    return Array.from(this.chemicalMap.values())
  }

  getPlantsContainingCompound(compoundSlug: string): PlantSpecies[] {
    const compound = this.getChemical(compoundSlug)
    if (!compound?.foundIn) return []
    return compound.foundIn
      .map(ref => this.getPlantSpecies(extractSlugFromIRI(ref['@id'])))
      .filter((p): p is PlantSpecies => p !== null)
  }

  // ===========================================================================
  // Plant Part Queries
  // ===========================================================================

  getAllPlantParts(): PlantPart[] {
    return Array.from(this.plantPartsCache.values())
  }

  getPlantPartsBySpecies(speciesSlug: string): PlantPart[] {
    return Array.from(this.plantPartsCache.values())
      .filter(part => {
        if (!part.partOf) return false
        return extractSlugFromIRI(part.partOf['@id']) === speciesSlug
      })
  }

  getPlantPartsByType(partType: string): PlantPart[] {
    return Array.from(this.plantPartsCache.values())
      .filter(part => {
        // Check if partType exists in @type or a partType field
        const types = Array.isArray(part['@type']) ? part['@type'] : [part['@type']]
        return types.some(t => t.toLowerCase().includes(partType.toLowerCase()))
      })
  }

  // ===========================================================================
  // Chemical Profile Queries
  // ===========================================================================

  getChemicalProfile(slug: string): ChemicalProfile | null {
    return this.chemicalProfileCache.get(slug) || null
  }

  getAllChemicalProfiles(): ChemicalProfile[] {
    return Array.from(this.chemicalProfileCache.values())
  }

  getChemicalProfileByPart(partSlug: string): ChemicalProfile | null {
    const profile = Array.from(this.chemicalProfileCache.values())
      .find(p => {
        if (!p.profileOf) return false
        return extractSlugFromIRI(p.profileOf['@id']) === partSlug
      })
    return profile || null
  }

  // ===========================================================================
  // DNA Barcode Queries
  // ===========================================================================

  getDNABarcode(slug: string): DNABarcode | null {
    return this.dnaBarcodeCache.get(slug) || null
  }

  getAllDNABarcodes(): DNABarcode[] {
    return Array.from(this.dnaBarcodeCache.values())
  }

  getDNABarcodeBySpecies(speciesSlug: string): DNABarcode | null {
    const barcode = Array.from(this.dnaBarcodeCache.values())
      .find(b => {
        if (!b.species) return false
        return extractSlugFromIRI(b.species['@id']) === speciesSlug
      })
    return barcode || null
  }

  // ===========================================================================
  // Formula Queries
  // ===========================================================================

  getFormula(slug: string): Formula | null {
    return this.formulaCache.get(slug) || null
  }

  getAllFormulas(): Formula[] {
    return Array.from(this.formulaCache.values())
  }

  // ===========================================================================
  // System Metadata Queries
  // ===========================================================================

  // Static system metadata (loaded from @graph in systems.jsonld)
  private systemMetadataCache: Map<string, MedicalSystem> = new Map([
    ['tcm', {
      '@id': 'https://www.herbapedia.org/system/tcm',
      '@type': ['MedicalSystem'],
      name: {
        'en': 'Traditional Chinese Medicine',
        'zh-Hans': '传统中医',
        'zh-Hant': '傳統中醫'
      },
      alternateName: {
        'en': 'TCM',
        'zh-Hans': '中药',
        'zh-Hant': '中藥'
      }
    }],
    ['western', {
      '@id': 'https://www.herbapedia.org/system/western',
      '@type': ['MedicalSystem'],
      name: {
        'en': 'Western Herbalism',
        'zh-Hans': '西方草药学',
        'zh-Hant': '西方草藥學'
      },
      alternateName: {
        'en': 'Western'
      }
    }],
    ['ayurveda', {
      '@id': 'https://www.herbapedia.org/system/ayurveda',
      '@type': ['MedicalSystem'],
      name: {
        'en': 'Ayurveda',
        'zh-Hans': '阿育吠陀',
        'zh-Hant': '阿育吠陀'
      }
    }],
    ['persian', {
      '@id': 'https://www.herbapedia.org/system/persian',
      '@type': ['MedicalSystem'],
      name: {
        'en': 'Persian/Unani Medicine',
        'zh-Hans': '波斯/尤纳尼医学',
        'zh-Hant': '波斯/尤納尼醫學'
      }
    }],
    ['mongolian', {
      '@id': 'https://www.herbapedia.org/system/mongolian',
      '@type': ['MedicalSystem'],
      name: {
        'en': 'Mongolian Traditional Medicine',
        'zh-Hans': '蒙古传统医学',
        'zh-Hant': '蒙古傳統醫學'
      }
    }]
  ])

  getSystem(slug: string): MedicalSystem | null {
    return this.systemMetadataCache.get(slug) || null
  }

  getAllSystems(): MedicalSystem[] {
    return Array.from(this.systemMetadataCache.values())
  }

  // ===========================================================================
  // Image Metadata Queries
  // ===========================================================================

  getImageMetadata(slug: string): ImageMetadata | null {
    return this.imageMetadataCache.get(slug) || null
  }

  // ===========================================================================
  // Reference Data - TCM
  // ===========================================================================

  getMeridian(id: string): ReferenceItem | null {
    return this.getRefItem(this.meridianMap, id, [
      'https://www.herbapedia.org/system/tcm/meridian/'
    ])
  }

  getNature(id: string): ReferenceItem | null {
    return this.getRefItem(this.natureMap, id, [
      'https://www.herbapedia.org/system/tcm/nature/'
    ])
  }

  getFlavor(id: string): ReferenceItem | null {
    return this.getRefItem(this.flavorMap, id, [
      'https://www.herbapedia.org/system/tcm/flavor/'
    ])
  }

  getCategory(id: string): ReferenceItem | null {
    return this.getRefItem(this.categoryMap, id, [
      'https://www.herbapedia.org/system/tcm/category/'
    ])
  }

  getAllNatures(): ReferenceItem[] { return Array.from(this.natureMap.values()) }
  getAllFlavors(): ReferenceItem[] { return Array.from(this.flavorMap.values()) }
  getAllMeridians(): ReferenceItem[] { return Array.from(this.meridianMap.values()) }
  getAllCategories(): ReferenceItem[] { return Array.from(this.categoryMap.values()) }

  // ===========================================================================
  // Reference Data - Western
  // ===========================================================================

  getAction(id: string): ReferenceItem | null {
    return this.getRefItem(this.actionMap, id, [
      'https://www.herbapedia.org/system/western/action/'
    ])
  }

  getOrgan(id: string): ReferenceItem | null {
    return this.getRefItem(this.organMap, id, [
      'https://www.herbapedia.org/system/western/organ/'
    ])
  }

  getAllActions(): ReferenceItem[] { return Array.from(this.actionMap.values()) }
  getAllOrgans(): ReferenceItem[] { return Array.from(this.organMap.values()) }

  // ===========================================================================
  // Reference Data - Ayurveda
  // ===========================================================================

  getRasa(id: string): ReferenceItem | null {
    return this.getRefItem(this.rasaMap, id, [
      'https://www.herbapedia.org/system/ayurveda/rasa/'
    ])
  }

  getGuna(id: string): ReferenceItem | null {
    return this.getRefItem(this.gunaMap, id, [
      'https://www.herbapedia.org/system/ayurveda/guna/'
    ])
  }

  getVirya(id: string): ReferenceItem | null {
    return this.getRefItem(this.viryaMap, id, [
      'https://www.herbapedia.org/system/ayurveda/virya/'
    ])
  }

  getVipaka(id: string): ReferenceItem | null {
    return this.getRefItem(this.vipakaMap, id, [
      'https://www.herbapedia.org/system/ayurveda/vipaka/'
    ])
  }

  getDosha(id: string): ReferenceItem | null {
    return this.getRefItem(this.doshaMap, id, [
      'https://www.herbapedia.org/system/ayurveda/dosha/'
    ])
  }

  getKarma(id: string): ReferenceItem | null {
    return this.getRefItem(this.karmaMap, id, [
      'https://www.herbapedia.org/system/ayurveda/karma/'
    ])
  }

  getMahabhuta(id: string): ReferenceItem | null {
    return this.getRefItem(this.mahabhutaMap, id, [
      'https://www.herbapedia.org/system/ayurveda/mahabhuta/'
    ])
  }

  getAllRasas(): ReferenceItem[] { return Array.from(this.rasaMap.values()) }
  getAllGunas(): ReferenceItem[] { return Array.from(this.gunaMap.values()) }
  getAllViryas(): ReferenceItem[] { return Array.from(this.viryaMap.values()) }
  getAllVipakas(): ReferenceItem[] { return Array.from(this.vipakaMap.values()) }
  getAllDoshas(): ReferenceItem[] { return Array.from(this.doshaMap.values()) }
  getAllKarmas(): ReferenceItem[] { return Array.from(this.karmaMap.values()) }
  getAllMahabhutas(): ReferenceItem[] { return Array.from(this.mahabhutaMap.values()) }

  getAyurvedaCategory(id: string): ReferenceItem | null {
    return this.getRefItem(this.ayurvedaCategoryMap, id, [
      'https://www.herbapedia.org/system/ayurveda/category/'
    ])
  }

  getPrabhava(id: string): ReferenceItem | null {
    return this.getRefItem(this.prabhavaMap, id, [
      'https://www.herbapedia.org/system/ayurveda/prabhava/'
    ])
  }

  getAllAyurvedaCategories(): ReferenceItem[] { return Array.from(this.ayurvedaCategoryMap.values()) }
  getAllPrabhavas(): ReferenceItem[] { return Array.from(this.prabhavaMap.values()) }

  // ===========================================================================
  // Reference Data - Persian
  // ===========================================================================

  getTemperament(id: string): ReferenceItem | null {
    return this.getRefItem(this.temperamentMap, id, [
      'https://www.herbapedia.org/system/persian/temperament/'
    ])
  }

  getPersianElement(id: string): ReferenceItem | null {
    return this.getRefItem(this.persianElementMap, id, [
      'https://www.herbapedia.org/system/persian/element/'
    ])
  }

  getPersianDegree(id: string): ReferenceItem | null {
    return this.getRefItem(this.persianDegreeMap, id, [
      'https://www.herbapedia.org/system/persian/degree/'
    ])
  }

  getAllTemperaments(): ReferenceItem[] { return Array.from(this.temperamentMap.values()) }
  getAllPersianElements(): ReferenceItem[] { return Array.from(this.persianElementMap.values()) }
  getAllPersianDegrees(): ReferenceItem[] { return Array.from(this.persianDegreeMap.values()) }

  // ===========================================================================
  // Reference Data - Mongolian
  // ===========================================================================

  getMongolianElement(id: string): ReferenceItem | null {
    return this.getRefItem(this.mongolianElementMap, id, [
      'https://www.herbapedia.org/system/mongolian/element/'
    ])
  }

  getMongolianTaste(id: string): ReferenceItem | null {
    return this.getRefItem(this.mongolianTasteMap, id, [
      'https://www.herbapedia.org/system/mongolian/taste/'
    ])
  }

  getMongolianRoot(id: string): ReferenceItem | null {
    return this.getRefItem(this.mongolianRootMap, id, [
      'https://www.herbapedia.org/system/mongolian/root/'
    ])
  }

  getMongolianPotency(id: string): ReferenceItem | null {
    return this.getRefItem(this.mongolianPotencyMap, id, [
      'https://www.herbapedia.org/system/mongolian/potency/'
    ])
  }

  getAllMongolianElements(): ReferenceItem[] { return Array.from(this.mongolianElementMap.values()) }
  getAllMongolianTastes(): ReferenceItem[] { return Array.from(this.mongolianTasteMap.values()) }
  getAllMongolianRoots(): ReferenceItem[] { return Array.from(this.mongolianRootMap.values()) }
  getAllMongolianPotencies(): ReferenceItem[] { return Array.from(this.mongolianPotencyMap.values()) }

  // ===========================================================================
  // Reference Data - TCM
  // ===========================================================================

  getTCMAction(id: string): ReferenceItem | null {
    return this.getRefItem(this.tcmActionMap, id, [
      'https://www.herbapedia.org/system/tcm/action/'
    ])
  }

  getAllTCMActions(): ReferenceItem[] { return Array.from(this.tcmActionMap.values()) }

  // ===========================================================================
  // Reference Data - Western
  // ===========================================================================

  getWesternSystem(id: string): ReferenceItem | null {
    return this.getRefItem(this.westernSystemMap, id, [
      'https://www.herbapedia.org/system/western/system/'
    ])
  }

  getAllWesternSystems(): ReferenceItem[] { return Array.from(this.westernSystemMap.values()) }

  // ===========================================================================
  // Herbal Vocabulary
  // ===========================================================================

  getHerbalForm(id: string): ReferenceItem | null {
    return this.getRefItem(this.herbalFormMap, id, [
      'https://www.herbapedia.org/vocab/herbal/form/'
    ])
  }

  getHerbalMethod(id: string): ReferenceItem | null {
    return this.getRefItem(this.herbalMethodMap, id, [
      'https://www.herbapedia.org/vocab/herbal/method/'
    ])
  }

  getAllHerbalForms(): ReferenceItem[] { return Array.from(this.herbalFormMap.values()) }
  getAllHerbalMethods(): ReferenceItem[] { return Array.from(this.herbalMethodMap.values()) }

  // ===========================================================================
  // Statistics
  // ===========================================================================

  getCounts() {
    return {
      preparations: this.preparationsCache.size,
      botanical: this.plantsCache.size,
      plants: this.getAllPlants().length,
      fungi: this.getAllFungi().length,
      algae: this.getAllAlgae().length,
      plantParts: this.plantPartsCache.size,
      chemicalProfiles: this.chemicalProfileCache.size,
      dnaBarcodes: this.dnaBarcodeCache.size,
      formulas: this.formulaCache.size,
      tcmProfiles: this.tcmCache.size,
      westernProfiles: this.westernCache.size,
      ayurvedaProfiles: this.ayurvedaCache.size,
      persianProfiles: this.persianCache.size,
      mongolianProfiles: this.mongolianCache.size,
      chemicalCompounds: this.chemicalMap.size,
      // Source materials
      zoologicalSources: this.zoologicalSourcesCache.size,
      mineralSources: this.mineralSourcesCache.size,
      chemicalSources: this.chemicalSourcesCache.size,
    }
  }

  getSystemStats() {
    return {
      tcm: this.tcmCache.size,
      western: this.westernCache.size,
      ayurveda: this.ayurvedaCache.size,
      persian: this.persianCache.size,
      mongolian: this.mongolianCache.size,
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const dataset = new HerbapediaDatasetBrowser()
export default dataset
