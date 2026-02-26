# Herbapedia

A comprehensive multilingual encyclopedia of medicinal plants, herbs, vitamins, minerals, and nutrients - part of the SIPM (International Society of Phytomedicine) ecosystem.

## Overview

Herbapedia provides evidence-based information in **three languages**:

- English (default)
- Traditional Chinese (zh-Hant)
- Simplified Chinese (zh-Hans)

Content is organized by **six medical systems**:

- Traditional Chinese Medicine (TCM)
- Western Herbalism
- Ayurveda
- Unani Medicine
- Mongolian Traditional Medicine
- Modern Medicine (Evidence-Based)

## Architecture

### Data Flow

```
data-herbapedia/                    herbapedia-site/
    (Source Data)                       (Vue App)
        │                                    │
        ├── entities/                        │
        │   ├── preparations/                │
        │   ├── botanical/                   │
        │   └── sources/                     │
        │                                    │
        ├── profiles/                        │
        │   ├── tcm/                         │
        │   ├── western/                     │
        │   ├── ayurveda/                    │
        │   ├── unani/                       │
        │   └── mongolian/                   │
        │                                    │
        └── systems/                         │
            └── (reference data)             │
                                             │
                         ┌───────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  Graph Browser Adapter │
            │  (src/api/graphBrowser)│
            │                        │
            │  - import.meta.glob    │
            │  - IRI extraction      │
            │  - Query methods       │
            └────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │     Vue Composables    │
            │  (useHerbData,         │
            │   useFilters)          │
            └────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │       Vue Views        │
            │  (Preparations, Plants,│
            │   Systems, etc.)       │
            └────────────────────────┘
```

### Tech Stack

- Vue 3 + Composition API
- Vite 6 + vite-ssg (Static Site Generation)
- Vue Router 4 with locale prefixes
- vue-i18n for UI translations
- JSON-LD structured data (via `@herbapedia/data` package)
- Glass morphism design system (shared with SIPM)

### Key Components

| Component | Purpose |
|-----------|---------|
| `src/api/graphBrowser.ts` | Data access layer - loads JSON-LD entities |
| `src/composables/useHerbData.js` | Preparation-centric data hooks |
| `src/composables/useFilters.js` | Filter state with URL sync |
| `src/i18n/` | UI translations (en, zh-Hans, zh-Hant) |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Clone with submodules (data-herbapedia)
git clone --recursive https://github.com/herbapedia/herbapedia-site.git

# Or if already cloned
git submodule update --init --recursive

# Install dependencies
pnpm install
```

### Development

```bash
pnpm dev
```

Open http://localhost:5173

### Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Data Architecture

### Entity Types

| Entity | Description | Path |
|--------|-------------|------|
| HerbalPreparation | Processed herbal products | `entities/preparations/*/entity.jsonld` |
| PlantSpecies | Botanical sources | `entities/botanical/species/*/entity.jsonld` |
| TCMProfile | Traditional Chinese Medicine data | `profiles/tcm/*/profile.jsonld` |
| WesternProfile | Western herbalism data | `profiles/western/*/profile.jsonld` |
| AyurvedaProfile | Ayurvedic medicine data | `profiles/ayurveda/*/profile.jsonld` |
| UnaniProfile | Unani medicine data | `profiles/unani/*/profile.jsonld` |
| MongolianProfile | Mongolian medicine data | `profiles/mongolian/*/profile.jsonld` |

### IRI Patterns

All entities use consistent IRI patterns:

```
https://www.herbapedia.org/entity/{type}/{slug}
https://www.herbapedia.org/system/{system}/{type}/{value}
```

Future graph patterns (when Knowledge Graph API is enabled):

```
https://www.herbapedia.org/graph/{type}/{slug}
https://www.herbapedia.org/graph/vocab/{system}/{type}/{value}
```

### Using the Graph Browser Adapter

```typescript
import { dataset } from '@/api/graphBrowser'

// Get a preparation with all its profiles
const prep = dataset.getPreparation('dried-ginger-rhizome')
console.log(prep?.name?.en) // "Dried Ginger Rhizome"

// Get profiles for a preparation
const profiles = dataset.getProfilesForPreparation('dried-ginger-rhizome')
console.log(profiles.tcm?.pinyin) // "Gān Jiāng"

// Get reference data
const nature = dataset.getNature('hot')
console.log(nature?.prefLabel?.en) // "Hot"

// Get statistics
const counts = dataset.getCounts()
console.log(counts.preparations) // Number of preparations
```

## URL Structure

### English (default)

- Home: `/`
- Preparations: `/preparations`
- Preparation detail: `/preparations/dried-ginger-rhizome`
- Sources: `/sources/botanical`
- Source detail: `/sources/botanical/ginger`
- Systems: `/systems/tcm`
- TCM Natures: `/systems/tcm/natures`

### Traditional Chinese (zh-Hant)

- Home: `/zh-Hant`
- Preparations: `/zh-Hant/preparations`
- etc.

### Simplified Chinese (zh-Hans)

- Home: `/zh-Hans`
- Preparations: `/zh-Hans/preparations`
- etc.

## Filter System

The preparations index supports comprehensive filtering:

### TCM Filters

- Nature (hot, warm, neutral, cool, cold)
- Flavor (sweet, sour, bitter, acrid, salty, bland, astringent)
- Meridian (lung, large intestine, stomach, spleen, etc.)
- Category (release exterior, clear heat, etc.)

### Western Filters

- Action (adaptogen, anti-inflammatory, etc.)
- Organ affinity (liver, heart, etc.)

### Ayurveda Filters

- Rasa (taste)
- Guna (quality)
- Virya (potency)
- Vipaka (post-digestive effect)
- Dosha effect (Vata, Pitta, Kapha)

### Unani Filters

- Temperament
- Element

### Mongolian Filters

- Element
- Taste
- Root

Filters sync with URL query parameters for shareable filtered views.

## CI/CD

The project uses GitHub Actions for automated builds and deployment:

1. **Build Job**: Checks out both site and data repos, installs dependencies, builds the site
2. **Deploy Job**: Deploys to GitHub Pages on main branch

See `.github/workflows/deploy.yml` for details.

## Project Structure

```
herbapedia-site/
├── src/
│   ├── api/
│   │   ├── graphBrowser.ts    # Data access layer
│   │   └── dataset.ts         # Re-export for backward compatibility
│   ├── composables/
│   │   ├── useHerbData.js     # Data hooks
│   │   ├── useFilters.js      # Filter state management
│   │   └── useHerb.js         # Legacy YAML support
│   ├── i18n/
│   │   ├── index.js           # i18n setup
│   │   ├── locales.js         # Locale definitions
│   │   └── messages/          # Translation files
│   ├── router/
│   │   └── index.js           # Vue Router config
│   ├── styles/
│   │   └── main.css           # Global styles
│   └── views/
│       ├── HomeView.vue
│       ├── PreparationsView.vue
│       ├── PreparationDetailView.vue
│       ├── PlantsView.vue
│       ├── SystemsView.vue
│       └── ...
├── vite.config.js             # Vite configuration
├── package.json
└── README.md
```

## Related Projects

- **data-herbapedia**: Source data repository containing JSON-LD entities
- **SIPM**: Main website that can integrate Herbapedia content

## License

Content sourced from various botanical and medical references.
Website code is proprietary to SIPM.
