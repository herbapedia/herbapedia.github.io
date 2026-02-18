# Herbapedia

A comprehensive encyclopedia of medicinal plants, herbs, vitamins, minerals, and nutrients - part of the SIPM (International Society of Phytomedicine) ecosystem.

## Overview

Herbapedia provides evidence-based information about:

- **Chinese Herbs** - Traditional Chinese medicinal plants and fungi
- **Western Herbs** - European and North American herbal medicines
- **Vitamins** - Essential vitamins for human health
- **Minerals** - Important dietary minerals and trace elements
- **Nutrients** - Beneficial compounds and supplements

## Architecture

This project is designed to work both as:

1. A **standalone Vue.js application**
2. An integrated section of the main SIPM website

### Tech Stack

- Vue 3 + Composition API
- Vite 6 + vite-ssg (Static Site Generation)
- Vue Router 4
- YAML for content storage
- Glass morphism design system (shared with SIPM)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Content Management

### Directory Structure

```
src/content/herbs/
├── index.yaml           # Index file with all herbs
├── lingzhi-reishi.yaml  # Individual herb entry
├── echinacea.yaml
└── ...

public/images/herbs/
├── lingzhi.jpg          # Herb images
├── echinacea.jpg
└── ...
```

### YAML Schema

Each herb entry follows this schema:

```yaml
id: "unique-id"
slug: "url-friendly-slug"
category: "chinese-herbs|western-herbs|vitamins|minerals|nutrients"
title: "Common Name"
scientific_name: "Latin binomial"  # Optional
image: "/images/herbs/filename.jpg"

description: |
  Main description text.

botanical_source: |
  Official pharmacopoeia definition (for herbs).

modern_research: |
  Scientific research findings.

traditional_use: |
  Traditional/historical usage.

metadata:
  source: "vitaherbapedia.com"
  source_url: "https://..."
  scraped_at: "ISO timestamp"
  language: "en"
```

## Scraping

To scrape content from vitaherbapedia.com:

```bash
# Scrape everything (content + images)
npm run scrape

# Download images only
npm run scrape:images

# Dry run (show what would be scraped)
node scripts/scrape-herbapedia.js --dry-run
```

## Integration with SIPM

To integrate Herbapedia into the main SIPM site:

1. Copy the `src/content/herbs/` directory to SIPM's `src/content/`
2. Copy `public/images/herbs/` to SIPM's `public/images/`
3. Copy the routes from `src/router/index.js` to SIPM's router
4. Copy the views and components to SIPM's source tree
5. Update navigation in SIPM's TheHeader component

## License

Content sourced from vitaherbapedia.com (Vita Green Products Co Ltd).
Website code is proprietary to SIPM.
