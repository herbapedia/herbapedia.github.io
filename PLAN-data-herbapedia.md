# Herbapedia Data Architecture Plan

## Executive Summary

Transform Herbapedia into the **premier authoritative knowledge base for all medicinal botany** by:

1. Creating a **separate data repository** (`data-herbapedia`) using JSON-LD
2. Supporting **multiple traditional medicine systems** (TCM, Ayurveda, Western, Unani, etc.)
3. Enabling **true semantic linked data** with external knowledge graphs
4. Keeping the current repository as a **site builder** that consumes the data

---

## Key Architectural Principles

### 1. Separation of Plant vs. Medicine

The core insight: **A Plant is NOT the same as a Medicine**

```
Plant (Botanical Entity)
  ├── hasPart → PlantPart (root, rhizome, leaf, etc.)
  │     └── usedAs → Substance
  │           └── hasSystemInterpretation → SystemSpecificProfile
  │                 ├── TCMProfile (meridians, nature, flavor)
  │                 ├── AyurvedicProfile (doshas, rasa, virya)
  │                 └── WesternProfile (actions, affinities)
  └── contains → ChemicalCompound
```

This allows:
- Same plant, different parts with different properties
- Same part, different interpretations by different medicine systems
- Linking to external databases (Wikidata, PubMed, GBIF)
- True semantic relationships

### 2. Multi-Vocabulary Approach

**External Vocabularies (reuse):**

| Prefix | URI | Purpose |
|--------|-----|---------|
| `schema` | https://schema.org/ | SEO, entity types |
| `dc` | http://purl.org/dc/terms/ | Provenance |
| `skos` | http://www.w3.org/2004/02/skos/core | Knowledge organization |
| `wd` / `wdt` | http://www.wikidata.org/ | External identity linking |
| `dwc` | http://rs.tdwg.org/dwc/terms/ | Darwin Core (taxonomy) |

**Custom Vocabularies (create):**

| Prefix | URI | Purpose |
|--------|-----|---------|
| `herbapedia` | https://herbapedia.org/vocab/core | Universal concepts |
| `tcm` | https://herbapedia.org/vocab/tcm | Traditional Chinese Medicine |
| `ayurveda` | https://herbapedia.org/vocab/ayurveda | Ayurvedic medicine |
| `western` | https://herbapedia.org/vocab/western | Western herbalism |

### 3. Layered Ontology

**Layer 1: Universal Botanical Core** (domain-agnostic)
- Taxonomy (Kingdom, Family, Genus, Species)
- Plant parts (root, leaf, flower, seed, bark)
- Chemical constituents
- Pharmacological actions

**Layer 2: Traditional Medicine Systems** (culture-specific)
- TCM: Meridians, Qi, Yin/Yang, Five Elements, nature, flavor
- Ayurveda: Doshas, Rasa, Virya, Vipaka, Guna
- Western Herbalism: Organ affinities, herbal actions
- Unani: Humors, temperament

**Layer 3: Modern Scientific Layer**
- Clinical trials, PubMed references
- Drug interactions
- Standardized extracts and dosages

**Layer 4: Product/Commercial Layer**
- Supplements, formulations
- Regulatory status

---

## Repository Structure

```
data-herbapedia/
├── README.md
├── package.json              # For type exports
├── tsconfig.json
│
├── schema/
│   ├── context/              # JSON-LD contexts
│   │   ├── core.jsonld       # Base vocabulary
│   │   ├── tcm.jsonld        # TCM extension
│   │   ├── ayurveda.jsonld   # Ayurveda extension
│   │   ├── western.jsonld    # Western herbalism
│   │   └── index.jsonld      # Combined context
│   │
│   ├── vocab/                # Ontology definitions (Turtle/RDF)
│   │   ├── core.ttl
│   │   ├── tcm.ttl
│   │   └── ayurveda.ttl
│   │
│   └── shapes/               # SHACL validation
│       └── plant.shacl.ttl
│
├── entities/
│   ├── plants/               # Botanical entities
│   │   ├── index.json        # Registry
│   │   └── {slug}/
│   │       ├── entity.jsonld  # Core (language-agnostic)
│   │       ├── en.jsonld      # English content
│   │       ├── zh-Hant.jsonld # Traditional Chinese
│   │       └── zh-Hans.jsonld # Simplified Chinese
│   │
│   └── chemicals/            # Chemical compounds
│       └── {slug}.jsonld
│
├── systems/                  # Traditional medicine systems
│   ├── tcm/
│   │   ├── herbs/            # TCM herb profiles
│   │   │   └── {slug}/
│   │   │       ├── profile.jsonld
│   │   │       └── i18n/
│   │   ├── categories.jsonld # Categories (补气, 清热, etc.)
│   │   ├── meridians.jsonld  # Meridian system
│   │   └── natures.jsonld    # 4 natures
│   │
│   ├── ayurveda/
│   │   ├── dravyas/          # Ayurvedic substances
│   │   ├── doshas.jsonld
│   │   ├── rasas.jsonld      # 6 tastes
│   │   └── viryas.jsonld     # Potencies
│   │
│   └── western/
│       ├── herbs/
│       └── actions.jsonld
│
├── media/
│   └── images/
│       └── {plant-slug}/
│           └── main.jpg
│
└── types/                    # TypeScript definitions
    ├── index.ts
    ├── plant.ts
    └── tcm.ts
```

---

## Sample JSON-LD Entities

### Plant Entity (Core)

```json
{
  "@context": "../../schema/context/index.jsonld",
  "@id": "https://herbapedia.org/plant/zingiber-officinale",
  "@type": ["schema:Plant", "herbapedia:MedicinalPlant"],

  "dwc:scientificName": "Zingiber officinale",
  "dwc:family": "Zingiberaceae",

  "schema:name": {
    "en": "Ginger",
    "zh-Hant": "薑",
    "zh-Hans": "姜",
    "hi": "अदरक",
    "sa": "आर्द्रक"
  },

  "herbapedia:hasPart": [
    { "@id": "#rhizome" }
  ],

  "schema:sameAs": [
    "http://www.wikidata.org/entity/Q129639",
    "https://www.gbif.org/species/2752573"
  ],

  "herbapedia:containsChemical": [
    { "@id": "../chemicals/gingerol" }
  ]
}
```

### TCM Herb Profile

```json
{
  "@context": ["../../schema/context/index.jsonld", "../../schema/context/tcm.jsonld"],
  "@id": "https://herbapedia.org/tcm/sheng-jiang",
  "@type": ["tcm:Herb", "schema:DietarySupplement"],

  "tcm:derivedFrom": { "@id": "../plants/zingiber-officinale#rhizome" },
  "tcm:processingMethod": "fresh",

  "schema:name": {
    "en": "Fresh Ginger",
    "zh-Hant": "生薑",
    "pinyin": "Shēng Jiāng"
  },

  "tcm:category": { "@id": "../categories/warm-acrid-release-exterior" },
  "tcm:entersMeridian": [
    { "@id": "../meridians/lung" },
    { "@id": "../meridians/spleen" }
  ],
  "tcm:hasNature": { "@id": "../natures/warm" },
  "tcm:hasFlavor": [{ "@id": "../flavors/acrid" }],

  "tcm:actions": ["release exterior", "warm middle burner"],

  "tcm:contraindications": {
    "en": "Not for yin deficiency with heat signs"
  }
}
```

### Ayurveda Dravya Profile

```json
{
  "@context": ["../../schema/context/index.jsonld", "../../schema/context/ayurveda.jsonld"],
  "@id": "https://herbapedia.org/ayurveda/nagara",
  "@type": ["ayurveda:Dravya", "schema:DietarySupplement"],

  "ayurveda:derivedFrom": { "@id": "../plants/zingiber-officinale#rhizome" },

  "schema:name": {
    "en": "Ginger (dry)",
    "sa": "नागर"
  },

  "ayurveda:hasRasa": [{ "@id": "../rasas/katu" }],
  "ayurveda:hasVirya": { "@id": "../viryas/ushna" },
  "ayurveda:hasVipaka": { "@id": "../vipakas/katu" },
  "ayurveda:hasGuna": [
    { "@id": "../gunas/laghu" },
    { "@id": "../gunas/tikshna" }
  ],
  "ayurveda:balancesDosha": [
    { "@id": "../doshas/vata" },
    { "@id": "../doshas/kapha" }
  ]
}
```

---

## Site Builder Integration

The herbapedia site will consume data-herbapedia via **pnpm workspace**:

```
herbapedia/
├── packages/
│   ├── data/           # data-herbapedia (symlink or workspace)
│   └── site/           # current herbapedia site
└── pnpm-workspace.yaml
```

**Benefits:**
- Type safety: Shared TypeScript types
- Atomic changes: Update data + display code together
- CI/CD efficiency: Single pipeline
- Developer experience: Single clone

---

## Migration Strategy

### From YAML to JSON-LD

1. **Create entity.jsonld** - Extract language-agnostic data:
   - `id`, `slug`, `category`, `scientific_name`
   - Link to Wikidata entity

2. **Create TCM profile** - Extract TCM-specific data:
   - Meridians, nature, flavor (normalized to IRIs)
   - Category (mapped to TCM classification system)

3. **Create i18n files** - Extract localized content:
   - `title`, `history`, `traditional_usage`, etc.

4. **Validate** - SHACL shape validation

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

| Task | Description |
|------|-------------|
| Create repository | `data-herbapedia` structure |
| Core context | `schema/context/core.jsonld` |
| TCM context | `schema/context/tcm.jsonld` |
| TypeScript types | `types/` directory |
| SHACL shapes | Validation rules |

### Phase 2: TCM Migration (Week 3-4)

| Task | Description |
|------|-------------|
| Migration script | `scripts/migrate-yaml-to-jsonld.ts` |
| Migrate plants | 179 herbs → plant entities |
| Migrate profiles | Create TCM herb profiles |
| Wikidata linking | Add `schema:sameAs` to Wikidata |
| Validation | SHACL validation pipeline |

### Phase 3: Ayurveda Foundation (Week 5-6)

| Task | Description |
|------|-------------|
| Ayurveda context | `schema/context/ayurveda.jsonld` |
| Core concepts | Doshas, Rasas, Viryas |
| First herbs | Add 10 Ayurvedic herbs |
| Cross-system links | Same plant, different systems |

### Phase 4: Site Integration (Week 7-8)

| Task | Description |
|------|-------------|
| Update site | Consume data-herbapedia |
| JSON-LD parser | Vite plugin for .jsonld |
| SEO injection | Structured data for herbs |
| Navigation | Relationship traversal |

### Phase 5: Expansion (Ongoing)

- Western herbalism system
- Unani medicine system
- Chemical constituent database
- Clinical trial references
- Community contribution workflow

---

## Success Criteria

1. **Data Integrity**: All 179 herbs migrated without data loss
2. **Linked Data**: Each herb has Wikidata linkage
3. **SEO**: Pass Google Rich Results Test for DietarySupplement
4. **Extensibility**: Ayurveda herbs can be added with full semantic properties
5. **Cross-System Queries**: "Show warming herbs across all systems"

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Data Format | JSON-LD 1.1 |
| Ontology | RDF/Turtle, SHACL |
| Validation | SHACL Shapes |
| Type Safety | TypeScript |
| Site Builder | Vue 3 + Vite |
| Package Management | pnpm workspaces |
| SEO | Schema.org structured data |

---

## References

- [JSON-LD 1.1 Specification](https://www.w3.org/TR/json-ld11/)
- [Schema.org DietarySupplement](https://schema.org/DietarySupplement)
- [Darwin Core](https://dwc.tdwg.org/)
- [SHACL](https://www.w3.org/TR/shacl/)
- [Ayurvedic Pharmacopoeia](https://www.ayush.gov.in/)
- [Chinese Pharmacopoeia](https://www.chp.org.cn/)
