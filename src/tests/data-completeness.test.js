/**
 * Data Completeness Tests
 *
 * These tests validate that herb data is complete and properly migrated.
 * They ensure we don't lose content like history, traditional usage, etc.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import { fileURLToPath } from 'url'

// Paths - resolve relative to this test file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const srcDir = path.dirname(__dirname) // src/
const projectRoot = path.dirname(srcDir) // herbapedia/
const dataDir = path.resolve(projectRoot, '../data-herbapedia')
const oldContentDir = path.join(projectRoot, 'src/content/herbs')

// Helper to parse YAML
function parseYaml(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return yaml.parse(content)
  } catch {
    return null
  }
}

// Helper to parse JSON-LD
function parseJsonLd(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

describe('Data Completeness', () => {
  describe('Western Herb Profiles', () => {
    const westernDir = path.join(dataDir, 'systems/western/herbs')

    it('should have western profiles for all western herbs with old YAML content', () => {
      if (!fs.existsSync(oldContentDir)) {
        console.log('Skipping: old content directory not found')
        return
      }

      const herbsWithYamlContent = fs.readdirSync(oldContentDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(slug => {
          const enPath = path.join(oldContentDir, slug, 'en.yaml')
          if (!fs.existsSync(enPath)) return false

          const data = parseYaml(enPath)
          if (!data) return false

          // Check if it has western herb content (not TCM)
          const hasContent = data.history || data.traditional_usage || data.introduction
          const isTcm = fs.existsSync(path.join(dataDir, 'systems/tcm/herbs', slug))

          return hasContent && !isTcm
        })

      // Check that each has a western profile
      const missingProfiles = []
      for (const slug of herbsWithYamlContent) {
        const profilePath = path.join(westernDir, slug, 'profile.jsonld')
        if (!fs.existsSync(profilePath)) {
          missingProfiles.push(slug)
        }
      }

      expect(missingProfiles).toEqual([])
    })

    it('should have history content migrated for western herbs', () => {
      if (!fs.existsSync(westernDir)) return

      const profiles = fs.readdirSync(westernDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      const missingHistory = []
      for (const slug of profiles) {
        const profilePath = path.join(westernDir, slug, 'profile.jsonld')
        const profile = parseJsonLd(profilePath)

        if (!profile) continue

        // Check if old YAML had history but profile doesn't
        const oldYamlPath = path.join(oldContentDir, slug, 'en.yaml')
        if (fs.existsSync(oldYamlPath)) {
          const oldData = parseYaml(oldYamlPath)
          if (oldData?.history && !profile.westernHistory) {
            missingHistory.push(slug)
          }
        }
      }

      expect(missingHistory).toEqual([])
    })

    it('should have traditional usage content migrated for western herbs', () => {
      if (!fs.existsSync(westernDir)) return

      const profiles = fs.readdirSync(westernDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      const missingUsage = []
      for (const slug of profiles) {
        const profilePath = path.join(westernDir, slug, 'profile.jsonld')
        const profile = parseJsonLd(profilePath)

        if (!profile) continue

        // Check if old YAML had traditional_usage but profile doesn't
        const oldYamlPath = path.join(oldContentDir, slug, 'en.yaml')
        if (fs.existsSync(oldYamlPath)) {
          const oldData = parseYaml(oldYamlPath)
          if (oldData?.traditional_usage && !profile.westernTraditionalUsage) {
            missingUsage.push(slug)
          }
        }
      }

      expect(missingUsage).toEqual([])
    })
  })

  describe('TCM Herb Profiles', () => {
    const tcmDir = path.join(dataDir, 'systems/tcm/herbs')

    it('should have TCM profiles for herbs with TCM category in old YAML', () => {
      if (!fs.existsSync(oldContentDir)) {
        console.log('Skipping: old content directory not found')
        return
      }

      const tcmHerbs = fs.readdirSync(oldContentDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(slug => {
          const enPath = path.join(oldContentDir, slug, 'en.yaml')
          if (!fs.existsSync(enPath)) return false

          const data = parseYaml(enPath)
          return data?.category === 'chinese-herbs'
        })

      // Check that each has a TCM profile
      const missingProfiles = []
      for (const slug of tcmHerbs) {
        const profilePath = path.join(tcmDir, slug, 'profile.jsonld')
        if (!fs.existsSync(profilePath)) {
          missingProfiles.push(slug)
        }
      }

      expect(missingProfiles).toEqual([])
    })
  })

  describe('Plant Entities', () => {
    const plantsDir = path.join(dataDir, 'entities/plants')

    it('should have plant entities for all herbs', () => {
      if (!fs.existsSync(oldContentDir)) {
        console.log('Skipping: old content directory not found')
        return
      }

      const herbs = fs.readdirSync(oldContentDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      const missingEntities = []
      for (const slug of herbs) {
        const entityPath = path.join(plantsDir, slug, 'entity.jsonld')
        if (!fs.existsSync(entityPath)) {
          missingEntities.push(slug)
        }
      }

      expect(missingEntities).toEqual([])
    })

    it('should have multilingual names for plant entities', () => {
      if (!fs.existsSync(plantsDir)) return

      const plants = fs.readdirSync(plantsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      const missingNames = []
      for (const slug of plants) {
        const entityPath = path.join(plantsDir, slug, 'entity.jsonld')
        const entity = parseJsonLd(entityPath)

        if (!entity) continue

        // Should have at least English name
        if (!entity.name?.en) {
          missingNames.push(slug)
        }
      }

      expect(missingNames).toEqual([])
    })
  })

  describe('Content Rendering', () => {
    it('should have non-empty content fields for key herbs', () => {
      // Test a few key herbs to ensure content is not empty
      const testHerbs = [
        { slug: 'aloe-vera', type: 'western', expectFields: ['westernHistory', 'westernTraditionalUsage'] },
        { slug: 'ginger', type: 'tcm', expectFields: ['tcmHistory', 'tcmTraditionalUsage'] },
      ]

      for (const herb of testHerbs) {
        let profilePath
        if (herb.type === 'western') {
          profilePath = path.join(dataDir, 'systems/western/herbs', herb.slug, 'profile.jsonld')
        } else {
          profilePath = path.join(dataDir, 'systems/tcm/herbs', herb.slug, 'profile.jsonld')
        }

        if (!fs.existsSync(profilePath)) {
          console.log(`Skipping ${herb.slug}: profile not found`)
          continue
        }

        const profile = parseJsonLd(profilePath)
        expect(profile).not.toBeNull()

        for (const field of herb.expectFields) {
          const value = profile[field]
          expect(value).toBeDefined()
          if (typeof value === 'object') {
            expect(value.en?.trim().length).toBeGreaterThan(10)
          } else if (typeof value === 'string') {
            expect(value.trim().length).toBeGreaterThan(10)
          }
        }
      }
    })
  })
})
