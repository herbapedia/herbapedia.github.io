# Plan: Integrate data-herbapedia Dataset API

## Context

The `data-herbapedia` repository has been updated with a v2 architecture and TypeScript API (`HerbapediaDataset` class). The goal is to use this API in the herbapedia site instead of direct file access via `import.meta.glob`.

## Current State

### herbapedia (site)
- `useHerbData.js` uses `import.meta.glob` to load JSON-LD files directly
- Manually merges plant data with TCM/Western profiles
- Has its own caching and lookup logic

### data-herbapedia (package)
- `HerbapediaDataset` class provides:
  - `getPlantSpecies(slug)` - Load plant by slug
  - `getPreparationsForPlant(slug)` - Get preparations from plant
  - `getAllProfilesForPreparation(slug)` - Get all system profiles
  - Cross-reference queries (getTCMByNature, getWesternByAction, etc.)
- Uses Node.js `fs` module (not browser-compatible)
- Expects pre-built index at `dist/index.json`

## Problem

The `HerbapediaDataset` class uses Node.js `fs` module which cannot work in browser/Vite environments.

## Solution: Browser-Compatible Dataset Adapter

Create a browser-compatible adapter that:
1. Uses Vite's `import.meta.glob` to load data at build time
2. Exposes the same API as `HerbapediaDataset`
3. Maintains compatibility with the data-herbapedia types

## Implementation Steps

### Step 1: Create Dataset Adapter
- Create `src/api/dataset.ts` - Browser-compatible HerbapediaDataset
- Use `import.meta.glob` to eagerly load all JSON-LD files
- Build internal indexes similar to the Node.js version

### Step 2: Implement Core Methods
- `getPlantSpecies(slug)`
- `getPreparation(slug)`
- `getTCMProfile(slug)`
- `getWesternProfile(slug)`
- `getAllProfilesForPreparation(slug)`

### Step 3: Implement Cross-Reference Methods
- `getTCMByNature(nature)`
- `getTCMByCategory(category)`
- `getWesternByAction(action)`
- Reference data lookups (natures, flavors, meridians, actions, organs)

### Step 4: Refactor useHerbData.js
- Import the dataset adapter
- Use dataset methods instead of direct file access
- Keep the composable interface unchanged for components

### Step 5: Add Type Imports
- Import types from `@herbapedia/data/types` for type safety
- Use proper TypeScript interfaces

## File Changes

### New Files
- `src/api/dataset.ts` - Browser-compatible dataset adapter

### Modified Files
- `src/composables/useHerbData.js` - Use dataset API

## Benefits

1. **API Consistency** - Same API between Node.js scripts and browser
2. **Type Safety** - TypeScript types from data-herbapedia
3. **Maintainability** - Single source of truth for data access patterns
4. **Future-Proof** - Easy to add new medicine systems or query methods

## Testing

1. All existing pages should work without changes
2. Herb detail pages should show same content
3. Category pages should list same herbs
4. Search should return same results
