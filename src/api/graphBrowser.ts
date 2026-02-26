/**
 * Graph Browser Adapter - Loads Knowledge Graph data for browser use
 *
 * Replaces the old HerbapediaDatasetBrowser with the new Graph API.
 * Architecture: PlantSpecies -> PlantPart -> HerbalPreparation -> System Profiles
 *
 * @example
 * import { dataset } from '@/api/graphBrowser'
 * const prep = dataset.getPreparation('dried-ginger-rhizome')
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
  hasUnaniProfile?: IRIReference[]
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

export interface UnaniProfile extends Entity {
  name?: LanguageMap
  unaniName?: string
  unaniTransliteration?: string
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
  unaniFunctions?: LanguageMap
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

export interface ModernSubstanceProfile extends Entity {
  name?: LanguageMap
  derivedFromSource?: IRIReference
  clinicalEvidence?: LanguageMap
  source?: string
  sourceUrl?: string
  regulatoryCategory?: string[]
  fdaStatus?: string
  substanceClass?: string
  mechanismOfAction?: LanguageMap
  pharmacokinetics?: LanguageMap
  safetyProfile?: LanguageMap
  interactions?: string[]
  contraindications?: LanguageMap
  dosage?: LanguageMap
}

export interface SystemProfiles {
  tcm?: TCMProfile
  western?: WesternHerbalProfile
  ayurveda?: AyurvedaProfile
  unani?: UnaniProfile
  mongolian?: MongolianProfile
  modern?: ModernSubstanceProfile
}

export interface ReferenceItem {
  '@id': string
  '@type'?: string[]
  prefLabel?: LanguageMap
  name?: LanguageMap
  description?: LanguageMap
  pinyin?: string
  code?: string
}

export interface ChemicalCompound extends Entity {
  name?: LanguageMap
  description?: LanguageMap
  molecularFormula?: string
  foundIn?: IRIReference[]
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

export interface MedicalSystem {
  '@id': string
  '@type': string[]
  name: LanguageMap
  alternateName?: LanguageMap
  description?: LanguageMap
  nativeName?: LanguageMap
}

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

export interface SourceMaterial extends Entity {
  name?: LanguageMap
  description?: LanguageMap
  image?: string
  animalName?: LanguageMap
  animalScientificName?: string
  animalPart?: string
  chemicalFormula?: string
  isSynthesized?: boolean
  sourceType?: 'botanical' | 'zoological' | 'mineral' | 'chemical'
}

// ============================================================================
// IRI Extraction Utilities (supports both OLD and NEW patterns)
// ============================================================================

/**
 * Extract slug from IRI, supporting both old and new patterns.
 *
 * OLD: https://www.herbapedia.org/entity/preparation/dried-ginger-rhizome
 * NEW: https://www.herbapedia.org/graph/preparation/dried-ginger-rhizome
 *
 * OLD: https://www.herbapedia.org/system/tcm/nature/hot
 * NEW: https://www.herbapedia.org/graph/vocab/tcm/nature/hot
 */
function extractSlugFromIRI(iri: string): string {
  if (!iri) return ''

  // Skip external IRIs (wikidata, etc.)
  if (!iri.includes('herbapedia.org')) {
    return iri.split('/').pop() || ''
  }

  // NEW graph pattern: .../graph/{type}/{slug}
  const graphMatch = iri.match(/\/graph\/[^/]+\/(.+)$/)
  if (graphMatch) return graphMatch[1]

  // NEW vocab pattern: .../graph/vocab/{system}/{type}/{value}
  const vocabMatch = iri.match(/\/graph\/vocab\/[^/]+\/[^/]+\/(.+)$/)
  if (vocabMatch) return vocabMatch[1]

  // OLD entity pattern: .../entity/{category}/{type}/{slug}
  const entityMatch = iri.match(/\/entity\/[^/]+\/[^/]+\/(.+)$/)
  if (entityMatch) return entityMatch[1]

  // OLD entity simple: .../entity/preparation/{slug}
  const prepMatch = iri.match(/\/entity\/[^/]+\/(.+)$/)
  if (prepMatch) return prepMatch[1]

  // OLD system pattern: .../system/{system}/{type}/{value}
  const systemMatch = iri.match(/\/system\/[^/]+\/[^/]+\/(.+)$/)
  if (systemMatch) return systemMatch[1]

  // Fallback: last segment
  return iri.split('/').pop() || ''
}

/**
 * Extract vocabulary value from IRI.
 *
 * OLD: https://www.herbapedia.org/system/tcm/nature/hot -> "hot"
 * NEW: https://www.herbapedia.org/graph/vocab/tcm/nature/hot -> "hot"
 */
function extractVocabValue(iri: string): string {
  if (!iri) return ''
  return iri.split('/').pop() || ''
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

// System profiles - ALL 6 SYSTEMS
const tcmModules = import.meta.glob('@herbapedia/data/profiles/tcm/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: TCMProfile }>

const westernModules = import.meta.glob('@herbapedia/data/profiles/western/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: WesternHerbalProfile }>

const ayurvedaModules = import.meta.glob('@herbapedia/data/profiles/ayurveda/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: AyurvedaProfile }>

const unaniModules = import.meta.glob('@herbapedia/data/profiles/unani/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: UnaniProfile }>

const mongolianModules = import.meta.glob('@herbapedia/data/profiles/mongolian/*/profile.jsonld', {
  eager: true
}) as Record<string, { default: MongolianProfile }>

const modernModules = import.meta.glob('@herbapedia/data/systems/modern/substances/*/profiles.jsonld', {
  eager: true
}) as Record<string, { default: ModernSubstanceProfile }>

// Reference data - TCM
const meridianModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/meridians.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const natureModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/natures.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const flavorModules = import.meta.glob('@herbapedia/data/systems/tcm/flavors.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const categoryModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/categories.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Western
const westernActionModules = import.meta.glob('@herbapedia/data/systems/western/reference/actions.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const westernOrganModules = import.meta.glob('@herbapedia/data/systems/western/reference/organs.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Ayurveda
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

// Reference data - Unani
const temperamentModules = import.meta.glob('@herbapedia/data/systems/unani/reference/temperaments.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const unaniElementModules = import.meta.glob('@herbapedia/data/systems/unani/reference/elements.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

const unaniDegreeModules = import.meta.glob('@herbapedia/data/systems/unani/reference/degrees.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Mongolian
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

// Reference data - TCM actions
const tcmActionModules = import.meta.glob('@herbapedia/data/systems/tcm/reference/actions.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Reference data - Western systems
const westernSystemModules = import.meta.glob('@herbapedia/data/systems/western/reference/systems.jsonld', {
  eager: true
}) as Record<string, { default: { '@graph': ReferenceItem[] } }>

// Herbal vocabulary
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

// Image metadata
const imageMetadataModules = import.meta.glob('@herbapedia/data/media/images/*/main.json', {
  eager: true
}) as Record<string, { default: ImageMetadata }>

// ============================================================================
// Utility Functions
// ============================================================================

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
      if (data['@graph']) {
        for (const item of data['@graph']) {
          if (item['@id']) {
            map.set(item['@id'], item)
          }
        }
      }
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
// Graph Browser Adapter
// ============================================================================

class GraphBrowserAdapter {
  // Primary entities
  private preparationsCache: Map<string, HerbalPreparation>
  private plantsCache: Map<string, PlantSpecies>
  private plantPartsCache: Map<string, PlantPart>

  // System profile caches
  private tcmCache: Map<string, TCMProfile>
  private westernCache: Map<string, WesternHerbalProfile>
  private ayurvedaCache: Map<string, AyurvedaProfile>
  private unaniCache: Map<string, UnaniProfile>
  private mongolianCache: Map<string, MongolianProfile>
  private modernCache: Map<string, ModernSubstanceProfile>

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

  // Reference data - Unani
  private temperamentMap: Map<string, ReferenceItem>
  private unaniElementMap: Map<string, ReferenceItem>
  private unaniDegreeMap: Map<string, ReferenceItem>

  // Reference data - Mongolian
  private mongolianElementMap: Map<string, ReferenceItem>
  private mongolianTasteMap: Map<string, ReferenceItem>
  private mongolianRootMap: Map<string, ReferenceItem>
  private mongolianPotencyMap: Map<string, ReferenceItem>

  // Other reference data
  private tcmActionMap: Map<string, ReferenceItem>
  private westernSystemMap: Map<string, ReferenceItem>
  private herbalFormMap: Map<string, ReferenceItem>
  private herbalMethodMap: Map<string, ReferenceItem>

  // Other entities
  private chemicalMap: Map<string, ChemicalCompound>
  private chemicalProfileCache: Map<string, ChemicalProfile>
  private dnaBarcodeCache: Map<string, DNABarcode>
  private formulaCache: Map<string, Formula>

  // Source materials
  private zoologicalSourcesCache: Map<string, SourceMaterial>
  private mineralSourcesCache: Map<string, SourceMaterial>
  private chemicalSourcesCache: Map<string, SourceMaterial>

  // Image metadata
  private imageMetadataCache: Map<string, ImageMetadata>

  // Indexes
  private preparationsByPlant: Map<string, string[]> = new Map()
  private preparationsByTCMCategory: Map<string, string[]> = new Map()
  private preparationsByNature: Map<string, string[]> = new Map()
  private preparationsByAction: Map<string, string[]> = new Map()

  constructor() {
    // Load primary entities
    this.preparationsCache = getModuleData(preparationModules)
    this.plantsCache = getModuleData(plantModules)
    this.plantPartsCache = getModuleData(plantPartModules)

    // Load system profiles
    this.tcmCache = getModuleData(tcmModules)
    this.westernCache = getModuleData(westernModules)
    this.ayurvedaCache = getModuleData(ayurvedaModules)
    this.unaniCache = getModuleData(unaniModules)
    this.mongolianCache = getModuleData(mongolianModules)
    this.modernCache = getModuleData(modernModules)

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

    // Load Unani reference data
    this.temperamentMap = getGraphData(temperamentModules)
    this.unaniElementMap = getGraphData(unaniElementModules)
    this.unaniDegreeMap = getGraphData(unaniDegreeModules)

    // Load Mongolian reference data
    this.mongolianElementMap = getGraphData(mongolianElementModules)
    this.mongolianTasteMap = getGraphData(mongolianTasteModules)
    this.mongolianRootMap = getGraphData(mongolianRootModules)
    this.mongolianPotencyMap = getGraphData(mongolianPotencyModules)

    // Load other reference data
    this.tcmActionMap = getGraphData(tcmActionModules)
    this.westernSystemMap = getGraphData(westernSystemModules)
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

    // Build indexes
    this.buildIndexes()
  }

  private loadImageMetadata(): Map<string, ImageMetadata> {
    const map = new Map<string, ImageMetadata>()
    for (const [path, module] of Object.entries(imageMetadataModules)) {
      const data = module?.default
      if (data) {
        const match = path.match(/media\/images\/([^/]+)\/main\.json$/)
        if (match) {
          map.set(match[1], data)
        }
      }
    }
    return map
  }

  private buildIndexes(): void {
    for (const [slug, prep] of this.preparationsCache) {
      if (prep.derivedFrom) {
        for (const ref of prep.derivedFrom) {
          const sourceSlug = extractSlugFromIRI(ref['@id'])
          if (!this.preparationsByPlant.has(sourceSlug)) {
            this.preparationsByPlant.set(sourceSlug, [])
          }
          this.preparationsByPlant.get(sourceSlug)!.push(slug)
        }
      }

      if (prep.hasTCMProfile) {
        const tcmSlug = extractSlugFromIRI(prep.hasTCMProfile[0]['@id'])
        const tcmProfile = this.tcmCache.get(tcmSlug)
        if (tcmProfile) {
          if (tcmProfile.hasCategory) {
            const catSlug = extractSlugFromIRI(tcmProfile.hasCategory['@id'])
            if (!this.preparationsByTCMCategory.has(catSlug)) {
              this.preparationsByTCMCategory.set(catSlug, [])
            }
            this.preparationsByTCMCategory.get(catSlug)!.push(slug)
          }
          if (tcmProfile.hasNature) {
            const natureSlug = extractSlugFromIRI(tcmProfile.hasNature['@id'])
            if (!this.preparationsByNature.has(natureSlug)) {
              this.preparationsByNature.set(natureSlug, [])
            }
            this.preparationsByNature.get(natureSlug)!.push(slug)
          }
        }
      }

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

  private getRefItem(
    map: Map<string, ReferenceItem>,
    id: string,
    urlPrefixes: string[]
  ): ReferenceItem | null {
    if (map.has(id)) return map.get(id) || null

    for (const prefix of urlPrefixes) {
      const fullUrl = `${prefix}${id}`
      if (map.has(fullUrl)) return map.get(fullUrl) || null
    }

    if (id.startsWith('https://www.herbapedia.org/')) {
      const slug = extractVocabValue(id)
      if (map.has(slug)) return map.get(slug) || null
      for (const prefix of urlPrefixes) {
        const fullUrl = `${prefix}${slug}`
        if (map.has(fullUrl)) return map.get(fullUrl) || null
      }
    }

    return null
  }

  // ===========================================================================
  // Preparation Queries (PRIMARY)
  // ===========================================================================

  getImageWithFallback(slug: string): { image: string; isFallback: boolean; fallbackSource?: string } {
    const prep = this.preparationsCache.get(slug)
    if (!prep) return { image: '', isFallback: false }

    if (prep.image) {
      const imagePath = prep.image.startsWith('/@herbapedia') ? prep.image : `/@herbapedia/data/${prep.image}`
      return { image: imagePath, isFallback: false }
    }

    if (prep.derivedFrom?.[0]) {
      const sourceSlug = extractSlugFromIRI(prep.derivedFrom[0]['@id'])

      const plant = this.plantsCache.get(sourceSlug)
      if (plant?.image) {
        const imagePath = plant.image.startsWith('/@herbapedia') ? plant.image : `/@herbapedia/data/${plant.image}`
        return { image: imagePath, isFallback: true, fallbackSource: prep.derivedFrom[0]['@id'] }
      }

      const zoo = this.zoologicalSourcesCache.get(sourceSlug)
      if (zoo?.image) {
        const imagePath = zoo.image.startsWith('/@herbapedia') ? zoo.image : `/@herbapedia/data/${zoo.image}`
        return { image: imagePath, isFallback: true, fallbackSource: prep.derivedFrom[0]['@id'] }
      }

      const mineral = this.mineralSourcesCache.get(sourceSlug)
      if (mineral?.image) {
        const imagePath = mineral.image.startsWith('/@herbapedia') ? mineral.image : `/@herbapedia/data/${mineral.image}`
        return { image: imagePath, isFallback: true, fallbackSource: prep.derivedFrom[0]['@id'] }
      }

      const chemical = this.chemicalSourcesCache.get(sourceSlug)
      if (chemical?.image) {
        const imagePath = chemical.image.startsWith('/@herbapedia') ? chemical.image : `/@herbapedia/data/${chemical.image}`
        return { image: imagePath, isFallback: true, fallbackSource: prep.derivedFrom[0]['@id'] }
      }
    }

    return { image: '', isFallback: false }
  }

  getPreparation(slug: string): HerbalPreparation | null {
    const prep = this.preparationsCache.get(slug)
    if (!prep) return null

    const imageResult = this.getImageWithFallback(slug)
    prep.image = imageResult.image

    return prep
  }

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
  // Profile Resolution
  // ===========================================================================

  getProfilesForPreparation(slug: string): SystemProfiles {
    const result: SystemProfiles = {}
    const prep = this.getPreparation(slug)
    if (!prep) return result

    if (prep.hasTCMProfile?.[0]) {
      const tcmSlug = extractSlugFromIRI(prep.hasTCMProfile[0]['@id'])
      result.tcm = this.tcmCache.get(tcmSlug) || undefined
    }

    if (prep.hasWesternProfile?.[0]) {
      const westernSlug = extractSlugFromIRI(prep.hasWesternProfile[0]['@id'])
      result.western = this.westernCache.get(westernSlug) || undefined
    }

    if (prep.hasAyurvedaProfile?.[0]) {
      const ayurvedaSlug = extractSlugFromIRI(prep.hasAyurvedaProfile[0]['@id'])
      result.ayurveda = this.ayurvedaCache.get(ayurvedaSlug) || undefined
    }

    if (prep.hasUnaniProfile?.[0]) {
      const unaniSlug = extractSlugFromIRI(prep.hasUnaniProfile[0]['@id'])
      result.unani = this.unaniCache.get(unaniSlug) || undefined
    }

    if (prep.hasMongolianProfile?.[0]) {
      const mongolianSlug = extractSlugFromIRI(prep.hasMongolianProfile[0]['@id'])
      result.mongolian = this.mongolianCache.get(mongolianSlug) || undefined
    }

    return result
  }

  getTCMProfile(slug: string): TCMProfile | null {
    return this.tcmCache.get(slug) || null
  }

  getWesternProfile(slug: string): WesternHerbalProfile | null {
    return this.westernCache.get(slug) || null
  }

  getAyurvedaProfile(slug: string): AyurvedaProfile | null {
    return this.ayurvedaCache.get(slug) || null
  }

  getUnaniProfile(slug: string): UnaniProfile | null {
    return this.unaniCache.get(slug) || null
  }

  getMongolianProfile(slug: string): MongolianProfile | null {
    return this.mongolianCache.get(slug) || null
  }

  getModernProfile(slug: string): ModernSubstanceProfile | undefined {
    return this.modernCache.get(slug)
  }

  getAllTCMProfiles(): Map<string, TCMProfile> { return this.tcmCache }
  getAllWesternProfiles(): Map<string, WesternHerbalProfile> { return this.westernCache }
  getAllAyurvedaProfiles(): Map<string, AyurvedaProfile> { return this.ayurvedaCache }
  getAllUnaniProfiles(): Map<string, UnaniProfile> { return this.unaniCache }
  getAllMongolianProfiles(): Map<string, MongolianProfile> { return this.mongolianCache }
  getAllModernProfiles(): Map<string, ModernSubstanceProfile> { return this.modernCache }

  // ===========================================================================
  // Botanical Queries
  // ===========================================================================

  getPlantSpecies(slug: string): PlantSpecies | null {
    const plant = this.plantsCache.get(slug)
    if (!plant) return null

    if (plant.image && !plant.image.startsWith('/@herbapedia')) {
      plant.image = `/@herbapedia/data/${plant.image}`
    }

    return plant
  }

  getAllPlants(): PlantSpecies[] {
    return Array.from(this.plantsCache.keys())
      .map(slug => this.getPlantSpecies(slug))
      .filter((p): p is PlantSpecies => p !== null && this.isPlantType(p, 'plant'))
  }

  getAllFungi(): PlantSpecies[] {
    return Array.from(this.plantsCache.keys())
      .map(slug => this.getPlantSpecies(slug))
      .filter((p): p is PlantSpecies => p !== null && this.isPlantType(p, 'fungi'))
  }

  getAllAlgae(): PlantSpecies[] {
    return Array.from(this.plantsCache.keys())
      .map(slug => this.getPlantSpecies(slug))
      .filter((p): p is PlantSpecies => p !== null && this.isPlantType(p, 'algae'))
  }

  getAllBotanical(): PlantSpecies[] {
    return Array.from(this.plantsCache.keys())
      .map(slug => this.getPlantSpecies(slug))
      .filter((p): p is PlantSpecies => p !== null)
  }

  getSpeciesByType(sourceType: 'plant' | 'fungi' | 'algae' | 'all'): PlantSpecies[] {
    switch (sourceType) {
      case 'plant': return this.getAllPlants()
      case 'fungi': return this.getAllFungi()
      case 'algae': return this.getAllAlgae()
      default: return this.getAllBotanical()
    }
  }

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

  // ===========================================================================
  // Source Materials (Non-Botanical)
  // ===========================================================================

  getAllZoologicalSources(): SourceMaterial[] {
    return Array.from(this.zoologicalSourcesCache.values())
  }

  getZoologicalSource(slug: string): SourceMaterial | null {
    return this.zoologicalSourcesCache.get(slug) || null
  }

  getAllMineralSources(): SourceMaterial[] {
    return Array.from(this.mineralSourcesCache.values())
  }

  getMineralSource(slug: string): SourceMaterial | null {
    return this.mineralSourcesCache.get(slug) || null
  }

  getAllChemicalSources(): SourceMaterial[] {
    return Array.from(this.chemicalSourcesCache.values())
  }

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
    const slug = extractVocabValue(id)
    return this.chemicalMap.get(slug) || this.chemicalMap.get(id) || null
  }

  getAllChemicals(): ChemicalCompound[] {
    return Array.from(this.chemicalMap.values())
  }

  // ===========================================================================
  // Reference Data - TCM
  // ===========================================================================

  getMeridian(id: string): ReferenceItem | null {
    return this.getRefItem(this.meridianMap, id, [
      'https://www.herbapedia.org/system/tcm/meridian/',
      'https://www.herbapedia.org/graph/vocab/tcm/meridian/'
    ])
  }

  getNature(id: string): ReferenceItem | null {
    return this.getRefItem(this.natureMap, id, [
      'https://www.herbapedia.org/system/tcm/nature/',
      'https://www.herbapedia.org/graph/vocab/tcm/nature/'
    ])
  }

  getFlavor(id: string): ReferenceItem | null {
    return this.getRefItem(this.flavorMap, id, [
      'https://www.herbapedia.org/system/tcm/flavor/',
      'https://www.herbapedia.org/graph/vocab/tcm/flavor/'
    ])
  }

  getCategory(id: string): ReferenceItem | null {
    return this.getRefItem(this.categoryMap, id, [
      'https://www.herbapedia.org/system/tcm/category/',
      'https://www.herbapedia.org/graph/vocab/tcm/category/'
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
      'https://www.herbapedia.org/system/western/action/',
      'https://www.herbapedia.org/graph/vocab/western/action/'
    ])
  }

  getOrgan(id: string): ReferenceItem | null {
    return this.getRefItem(this.organMap, id, [
      'https://www.herbapedia.org/system/western/organ/',
      'https://www.herbapedia.org/graph/vocab/western/organ/'
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

  // ===========================================================================
  // Reference Data - Unani
  // ===========================================================================

  getTemperament(id: string): ReferenceItem | null {
    return this.getRefItem(this.temperamentMap, id, [
      'https://www.herbapedia.org/system/unani/temperament/'
    ])
  }

  getUnaniElement(id: string): ReferenceItem | null {
    return this.getRefItem(this.unaniElementMap, id, [
      'https://www.herbapedia.org/system/unani/element/'
    ])
  }

  getAllTemperaments(): ReferenceItem[] { return Array.from(this.temperamentMap.values()) }
  getAllUnaniElements(): ReferenceItem[] { return Array.from(this.unaniElementMap.values()) }

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

  getAllMongolianElements(): ReferenceItem[] { return Array.from(this.mongolianElementMap.values()) }
  getAllMongolianTastes(): ReferenceItem[] { return Array.from(this.mongolianTasteMap.values()) }

  // ===========================================================================
  // System Metadata
  // ===========================================================================

  private systemMetadataCache: Map<string, MedicalSystem> = new Map([
    ['tcm', {
      '@id': 'https://www.herbapedia.org/system/tcm',
      '@type': ['MedicalSystem'],
      name: { 'en': 'Traditional Chinese Medicine', 'zh-Hans': '传统中医', 'zh-Hant': '傳統中醫' },
      alternateName: { 'en': 'TCM', 'zh-Hans': '中药', 'zh-Hant': '中藥' }
    }],
    ['western', {
      '@id': 'https://www.herbapedia.org/system/western',
      '@type': ['MedicalSystem'],
      name: { 'en': 'Western Herbalism', 'zh-Hans': '西方草药学', 'zh-Hant': '西方草藥學' },
      alternateName: { 'en': 'Western' }
    }],
    ['ayurveda', {
      '@id': 'https://www.herbapedia.org/system/ayurveda',
      '@type': ['MedicalSystem'],
      name: { 'en': 'Ayurveda', 'zh-Hans': '阿育吠陀', 'zh-Hant': '阿育吠陀' }
    }],
    ['unani', {
      '@id': 'https://www.herbapedia.org/system/unani',
      '@type': ['MedicalSystem'],
      name: { 'en': 'Unani/Unani Medicine', 'zh-Hans': '波斯/尤纳尼医学', 'zh-Hant': '波斯/尤納尼醫學' }
    }],
    ['mongolian', {
      '@id': 'https://www.herbapedia.org/system/mongolian',
      '@type': ['MedicalSystem'],
      name: { 'en': 'Mongolian Traditional Medicine', 'zh-Hans': '蒙古传统医学', 'zh-Hant': '蒙古傳統醫學' }
    }],
    ['modern', {
      '@id': 'https://www.herbapedia.org/system/modern',
      '@type': ['MedicalSystem'],
      name: { 'en': 'Modern Medicine', 'zh-Hans': '现代医学', 'zh-Hant': '現代醫學' },
      alternateName: { 'en': 'Evidence-Based Nutrition & Pharmacology' }
    }]
  ])

  getSystem(slug: string): MedicalSystem | null {
    return this.systemMetadataCache.get(slug) || null
  }

  getAllSystems(): MedicalSystem[] {
    return Array.from(this.systemMetadataCache.values())
  }

  // ===========================================================================
  // Image Metadata
  // ===========================================================================

  getImageMetadata(slug: string): ImageMetadata | null {
    return this.imageMetadataCache.get(slug) || null
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
        const profileOfId = typeof p.profileOf === 'object' ? p.profileOf['@id'] : p.profileOf
        return extractSlugFromIRI(profileOfId) === partSlug
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
  // Additional Plant Queries
  // ===========================================================================

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

  getPlantsContainingCompound(compoundSlug: string): PlantSpecies[] {
    const compound = this.getChemical(compoundSlug)
    if (!compound?.foundIn) return []
    return compound.foundIn
      .map(ref => this.getPlantSpecies(extractSlugFromIRI(ref['@id'])))
      .filter((p): p is PlantSpecies => p !== null)
  }

  // ===========================================================================
  // Additional Reference Data - Ayurveda
  // ===========================================================================

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
  // Additional Reference Data - Unani
  // ===========================================================================

  getUnaniDegree(id: string): ReferenceItem | null {
    return this.getRefItem(this.unaniDegreeMap, id, [
      'https://www.herbapedia.org/system/unani/degree/'
    ])
  }

  getAllUnaniDegrees(): ReferenceItem[] { return Array.from(this.unaniDegreeMap.values()) }

  // ===========================================================================
  // Additional Reference Data - Mongolian
  // ===========================================================================

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

  getAllMongolianRoots(): ReferenceItem[] { return Array.from(this.mongolianRootMap.values()) }
  getAllMongolianPotencies(): ReferenceItem[] { return Array.from(this.mongolianPotencyMap.values()) }

  // ===========================================================================
  // Additional Reference Data - TCM
  // ===========================================================================

  getTCMAction(id: string): ReferenceItem | null {
    return this.getRefItem(this.tcmActionMap, id, [
      'https://www.herbapedia.org/system/tcm/action/'
    ])
  }

  getAllTCMActions(): ReferenceItem[] { return Array.from(this.tcmActionMap.values()) }

  // ===========================================================================
  // Additional Reference Data - Western
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
      unaniProfiles: this.unaniCache.size,
      mongolianProfiles: this.mongolianCache.size,
      chemicalCompounds: this.chemicalMap.size,
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
      unani: this.unaniCache.size,
      mongolian: this.mongolianCache.size,
      modern: this.modernCache.size,
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const dataset = new GraphBrowserAdapter()
export default dataset
