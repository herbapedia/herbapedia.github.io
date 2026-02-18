# Herbapedia YAML Data Schema

This document defines the YAML schema for herbapedia entries.

## Schema Overview

Each herb entry is stored as a YAML file in `src/content/herbs/`. The filename should be the URL-safe slug (lowercase, hyphens for spaces).

## Complete Schema

```yaml
# Required metadata header
# ------------------------
# Title for reference (not parsed)
# Source URL (not parsed)
# Language code (not parsed)

# Core identification
# -------------------
id: string              # Unique identifier (URL-safe slug)
slug: string            # URL path segment (same as filename without .yaml)
category: enum          # One of: chinese-herbs, western-herbs, vitamins, minerals, nutrients
title: string           # Display name (required)

# Optional identification
scientific_name: string # Latin binomial nomenclature (for herbs)

# Media
# -----
image: string           # Local path: /images/herbs/filename.jpg
image_original: string  # Original source URL (if image not downloaded)

# Content sections
# ----------------
description: |          # Main description (multiline)
  Text content here...

botanical_source: |     # Official pharmacopoeia definition (for herbs)
  Text content here...

modern_research: |      # Scientific studies and findings
  Text content here...

traditional_use: |      # Historical/traditional usage
  Text content here...

functions: |            # Body functions supported (for vitamins/minerals)
  Text content here...

importance: |           # Why it's important (for vitamins/minerals)
  Text content here...

# Structured data
# ---------------
food_sources:           # List of food sources (for vitamins/minerals)
  - Item 1
  - Item 2

# Metadata
# --------
metadata:
  source: string        # Source website
  source_url: string    # Original page URL
  scraped_at: string    # ISO 8601 timestamp
  language: string      # Language code: en, zh-HK, zh-CN
```

## Category-Specific Fields

### Chinese Herbs & Western Herbs

```yaml
id: "lingzhi-reishi"
slug: "lingzhi-reishi"
category: "chinese-herbs"
title: "Lingzhi (Reishi)"
scientific_name: "Ganoderma lucidum"
image: "/images/herbs/lingzhi-reishi.jpg"

description: |
  Historical and background information about the herb.

botanical_source: |
  Official pharmacopoeia or botanical definition.

modern_research: |
  Scientific studies and clinical findings.

traditional_use: |
  Traditional Chinese medicine or Western herbal usage.

metadata:
  source: "vitaherbapedia.com"
  source_url: "https://www.vitaherbapedia.com/en/shop/chiherbs-en/lingzhi-reishi/"
  scraped_at: "2026-02-18T00:00:00.000Z"
  language: "en"
```

### Vitamins

```yaml
id: "vitamin-a"
slug: "vitamin-a"
category: "vitamins"
title: "Vitamin A"
image: "/images/herbs/vitamin-a.jpg"

description: |
  General description of the vitamin.

functions: |
  What the vitamin does in the body.

importance: |
  Why adequate intake is important.

food_sources:
  - Carrots
  - Sweet potatoes
  - Spinach

metadata:
  source: "vitaherbapedia.com"
  source_url: "https://www.vitaherbapedia.com/en/shop/vitamins-en/vitamin-a/"
  scraped_at: "2026-02-18T00:00:00.000Z"
  language: "en"
```

### Minerals

```yaml
id: "calcium"
slug: "calcium"
category: "minerals"
title: "Calcium"
image: "/images/herbs/calcium.jpg"

description: |
  General description of the mineral.

functions: |
  What the mineral does in the body.

importance: |
  Why adequate intake is important, deficiency risks.

food_sources:
  - Dairy products
  - Leafy greens
  - Fortified foods

metadata:
  source: "vitaherbapedia.com"
  source_url: "https://www.vitaherbapedia.com/en/shop/minerals-en/calcium/"
  scraped_at: "2026-02-18T00:00:00.000Z"
  language: "en"
```

### Nutrients

```yaml
id: "omega-3"
slug: "omega-3"
category: "nutrients"
title: "Omega 3"
image: "/images/herbs/omega-3.jpg"

description: |
  General description of the nutrient.

functions: |
  What the nutrient does in the body.

metadata:
  source: "vitaherbapedia.com"
  source_url: "https://www.vitaherbapedia.com/en/shop/nutrients-en/omega-3/"
  scraped_at: "2026-02-18T00:00:00.000Z"
  language: "en"
```

## Multilingual Support

For multilingual content, create separate files with language suffix:

```
src/content/herbs/
├── lingzhi-reishi.yaml       # English (default)
├── lingzhi-reishi.zh-HK.yaml # Traditional Chinese
└── lingzhi-reishi.zh-CN.yaml # Simplified Chinese
```

The `metadata.language` field should match the file suffix.

## Index File

The `index.yaml` file provides a summary:

```yaml
# Herbapedia Index
# Auto-generated

total: 179

categories:
  chinese-herbs: 98
  western-herbs: 31
  vitamins: 13
  minerals: 9
  nutrients: 28

herbs:
  - slug: lingzhi-reishi
    title: "Lingzhi (Reishi)"
    category: chinese-herbs
    scientific_name: "Ganoderma lucidum"
  # ... more entries
```

## Validation Rules

1. **Required fields**: `id`, `slug`, `category`, `title`
2. **Category must be one of**: `chinese-herbs`, `western-herbs`, `vitamins`, `minerals`, `nutrients`
3. **Slug must match filename**: If file is `lingzhi.yaml`, slug must be `lingzhi`
4. **Image path format**: Must start with `/images/herbs/`
5. **Multiline fields**: Use `|` for YAML literal block scalar

## File Naming Convention

- Lowercase letters only
- Hyphens for word separation
- No special characters
- Match the `slug` field exactly

Examples:
- `lingzhi-reishi.yaml`
- `vitamin-b12.yaml`
- `omega-3.yaml`
