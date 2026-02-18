#!/usr/bin/env node

/**
 * Herbapedia Scraper v2
 * Extracts herb data from vitaherbapedia.com with multilingual support
 *
 * Usage:
 *   node scripts/scrape-herbapedia.js                    # Scrape English (default)
 *   node scripts/scrape-herbapedia.js --lang zh-HK       # Scrape Traditional Chinese
 *   node scripts/scrape-herbapedia.js --lang zh-CN       # Scrape Simplified Chinese
 *   node scripts/scrape-herbapedia.js --all-languages    # Scrape all languages
 *   node scripts/scrape-herbapedia.js --dry-run          # Show what would be scraped
 *   node scripts/scrape-herbapedia.js --skip-images      # Skip image downloads
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT_DIR, 'src/content/herbs')
const IMAGES_DIR = path.join(ROOT_DIR, 'public/images/herbs')

// Configuration
const CONFIG = {
  baseUrl: 'https://www.vitaherbapedia.com',
  languages: {
    'en': { code: 'en', suffix: '', path: 'en', fileSuffix: '' },
    'zh-HK': { code: 'zh-HK', suffix: '', path: 'zh', fileSuffix: '.zh-HK' },
    'zh-CN': { code: 'zh-CN', suffix: '-cn', path: 'cn', fileSuffix: '.zh-CN' }
  },
  categories: {
    'chinese-herbs': { en: 'chiherbs-en', 'zh-HK': 'chiherbs', 'zh-CN': 'chiherbs-cn' },
    'western-herbs': { en: 'westherbs-en', 'zh-HK': 'westherbs', 'zh-CN': 'westherbs-cn' },
    'vitamins': { en: 'vitamins-en', 'zh-HK': 'vitamins', 'zh-CN': 'vitamins-cn' },
    'minerals': { en: 'minerals-en', 'zh-HK': 'minerals', 'zh-CN': 'minerals-cn' },
    'nutrients': { en: 'nutrients-en', 'zh-HK': 'nutrients', 'zh-CN': 'nutrients-cn' }
  },
  delay: 500
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function safeFilename(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HerbapediaBot/1.0; +https://sipm.org)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.text()
  } catch (error) {
    console.error(`  Error fetching ${url}:`, error.message)
    return null
  }
}

async function downloadImage(url, outputPath) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const buffer = await response.arrayBuffer()
    fs.writeFileSync(outputPath, Buffer.from(buffer))
    console.log(`  Downloaded: ${path.basename(outputPath)}`)
    return true
  } catch (error) {
    console.error(`  Failed to download ${url}:`, error.message)
    return false
  }
}

function extractHerbUrls(html, baseUrl) {
  const urls = []
  const linkPattern = /href="([^"]*\/shop\/[^"]+)"/g
  let match
  while ((match = linkPattern.exec(html)) !== null) {
    const url = match[1]
    if (url.includes('/shop/') && !urls.includes(url)) {
      const absoluteUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
      urls.push(absoluteUrl)
    }
  }
  return urls
}

function parseHerbPage(html, url) {
  const data = {
    url,
    title: '',
    scientificName: '',
    description: '',
    botanicalSource: '',
    modernResearch: '',
    traditionalUse: '',
    functions: '',
    importance: '',
    foodSources: [],
    imageUrl: null,
    imageLocal: null,
    category: ''
  }

  // Extract title from og:title
  const ogTitleMatch = html.match(/property="og:title"\s+content="([^"]+)"/)
  if (ogTitleMatch) {
    data.title = ogTitleMatch[1].replace(/\s*-\s*維特草本百科$/, '').replace(/\s*-\s* Vita Herbapedia$/, '').trim()
  }

  if (!data.title) {
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/)
    if (h1Match) data.title = h1Match[1].trim()
  }

  // Extract scientific name
  const sciMatch = html.match(/<h4[^>]*><em>([^<]+)<\/em><\/h4>/)
  if (sciMatch) data.scientificName = sciMatch[1].trim()

  if (!data.scientificName) {
    const sciMatch2 = html.match(/<em>([A-Z][a-z]+\s+[a-z]+[^<]*)<\/em>/)
    if (sciMatch2) data.scientificName = sciMatch2[1].trim()
  }

  // Extract image URL
  const ogImageMatch = html.match(/property="og:image"\s+content="([^"]+)"/)
  if (ogImageMatch) data.imageUrl = ogImageMatch[1]

  // Extract category
  if (url.includes('chiherbs')) data.category = 'chinese-herbs'
  else if (url.includes('westherbs')) data.category = 'western-herbs'
  else if (url.includes('vitamins')) data.category = 'vitamins'
  else if (url.includes('minerals')) data.category = 'minerals'
  else if (url.includes('nutrients')) data.category = 'nutrients'

  // Extract content
  let content = ''
  const wooMatch = html.match(/<div[^>]*class="[^"]*woocommerce-Tabs-panel[^"]*"[^>]*>([\s\S]+?)<\/div>\s*<\/div>/i)
  if (wooMatch) content = wooMatch[1]

  if (!content) {
    const entryMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]+?)<\/div>\s*(?:<\/article|<footer|<div class=")/i)
    if (entryMatch) content = entryMatch[1]
  }

  if (!content) {
    const pMatch = html.match(/<p>([\s\S]+?)<\/p>/gi)
    if (pMatch) content = pMatch.join(' ')
  }

  if (content) {
    content = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<img[^>]*>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()

    // Split into paragraphs for analysis
    const paragraphs = content.split(/\.\s+/).filter(p => p.length > 20)

    // Identify botanical source (contains "family" or Latin patterns)
    const botanicalPara = paragraphs.find(p =>
      /family\s+[A-Z][a-z]+/i.test(p) ||
      /sporophore|rhizome|perennial|fungus/i.test(p)
    )
    if (botanicalPara) {
      data.botanicalSource = botanicalPara.trim() + '.'
    }

    // Identify modern research (contains "studies", "research", "shown")
    const researchParas = paragraphs.filter(p =>
      /studies|research|shown|evidence|clinical|trials/i.test(p)
    )
    if (researchParas.length > 0) {
      data.modernResearch = researchParas.slice(0, 2).join('. ').trim() + '.'
    }

    // Identify traditional use (contains "traditional", "ancient", "used for")
    const traditionalParas = paragraphs.filter(p =>
      /traditional|ancient|used for|has been used|folk/i.test(p) &&
      !p.includes('studies')
    )
    if (traditionalParas.length > 0) {
      data.traditionalUse = traditionalParas.slice(0, 2).join('. ').trim() + '.'
    }

    // Main description (first substantial paragraph)
    const descParas = paragraphs.filter(p =>
      p.length > 50 &&
      !p.match(/^Image\s+\d+/) &&
      !p.includes('Disclaimer')
    )
    if (descParas.length > 0) {
      data.description = descParas.slice(0, 3).join('. ').trim()
      if (data.description.length > 1000) {
        data.description = data.description.substring(0, 1000) + '...'
      }
    }

    // Extract food sources for vitamins/minerals
    if (data.category === 'vitamins' || data.category === 'minerals') {
      const foundInMatch = content.match(/found in ([^.]+\.)/i)
      if (foundInMatch) {
        data.foodSources = foundInMatch[1]
          .split(/,|\s+and\s+/)
          .map(s => s.trim())
          .filter(s => s.length > 2 && s.length < 50)
      }

      // Functions
      const functionMatch = content.match(/(?:primary )?function[^.]*is[^.]+\./i)
      if (functionMatch) {
        data.functions = functionMatch[0].trim()
      }

      // Importance
      const importantMatch = content.match(/(?:important|essential|without)[^.]+(?:osteoporosis|deficiency)[^.]+\./i)
      if (importantMatch) {
        data.importance = importantMatch[0].trim()
      }
    }
  }

  return data
}

function generateYaml(data, language = 'en') {
  const lines = [
    `# ${data.title}`,
    `# Source: ${data.url}`,
    `# Language: ${language}`,
    '',
    `id: "${safeFilename(data.title)}"`,
    `slug: "${safeFilename(data.title)}"`,
    `category: "${data.category}"`,
    `title: "${data.title.replace(/"/g, '\\"')}"`,
  ]

  if (data.scientificName) {
    lines.push(`scientific_name: "${data.scientificName.replace(/"/g, '\\"')}"`)
  }

  if (data.imageLocal) {
    lines.push(`image: "/images/herbs/${data.imageLocal}"`)
  } else if (data.imageUrl) {
    lines.push(`image_original: "${data.imageUrl}"`)
  }

  lines.push('')

  if (data.description) {
    lines.push('description: |')
    lines.push(`  ${data.description.replace(/\n/g, '\n  ')}`)
    lines.push('')
  }

  if (data.botanicalSource) {
    lines.push('botanical_source: |')
    lines.push(`  ${data.botanicalSource.replace(/\n/g, '\n  ')}`)
    lines.push('')
  }

  if (data.modernResearch) {
    lines.push('modern_research: |')
    lines.push(`  ${data.modernResearch.replace(/\n/g, '\n  ')}`)
    lines.push('')
  }

  if (data.traditionalUse) {
    lines.push('traditional_use: |')
    lines.push(`  ${data.traditionalUse.replace(/\n/g, '\n  ')}`)
    lines.push('')
  }

  if (data.functions) {
    lines.push('functions: |')
    lines.push(`  ${data.functions.replace(/\n/g, '\n  ')}`)
    lines.push('')
  }

  if (data.importance) {
    lines.push('importance: |')
    lines.push(`  ${data.importance.replace(/\n/g, '\n  ')}`)
    lines.push('')
  }

  if (data.foodSources && data.foodSources.length > 0) {
    lines.push('food_sources:')
    data.foodSources.forEach(source => {
      lines.push(`  - ${source}`)
    })
    lines.push('')
  }

  lines.push('metadata:')
  lines.push('  source: "vitaherbapedia.com"')
  lines.push(`  source_url: "${data.url}"`)
  lines.push(`  scraped_at: "${new Date().toISOString()}"`)
  lines.push(`  language: "${language}"`)

  return lines.join('\n')
}

async function scrapeLanguage(langCode, options = {}) {
  const { dryRun = false, skipImages = false } = options
  const langConfig = CONFIG.languages[langCode]
  const allHerbs = new Map()

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Scraping language: ${langCode}`)
  console.log(`${'='.repeat(50)}\n`)

  for (const [categorySlug, categoryPaths] of Object.entries(CONFIG.categories)) {
    const categoryPath = categoryPaths[langCode]
    const categoryUrl = `${CONFIG.baseUrl}/${langConfig.path}/product-category/${categoryPath}/`

    console.log(`\nCategory: ${categorySlug}`)
    console.log(`  URL: ${categoryUrl}`)

    if (dryRun) {
      console.log('  [DRY RUN] Would scrape this category')
      continue
    }

    const firstPageHtml = await fetchPage(categoryUrl)
    if (!firstPageHtml) {
      console.log('  Failed to fetch category page')
      continue
    }

    let herbUrls = extractHerbUrls(firstPageHtml, CONFIG.baseUrl)
    const pageCountMatch = firstPageHtml.match(/Showing \d+(?:–|–|-|&ndash;)\d+ of (\d+) results/)
    const totalItems = pageCountMatch ? parseInt(pageCountMatch[1]) : herbUrls.length

    console.log(`  Found ${totalItems} items`)

    let pageNum = 2
    const maxPages = 15
    while (herbUrls.length < totalItems && pageNum <= maxPages) {
      const pageUrl = `${CONFIG.baseUrl}/${langConfig.path}/product-category/${categoryPath}/page/${pageNum}/`
      console.log(`  Fetching page ${pageNum}...`)
      const pageHtml = await fetchPage(pageUrl)
      if (!pageHtml) break

      const pageUrls = extractHerbUrls(pageHtml, CONFIG.baseUrl)
      if (pageUrls.length === 0) break

      herbUrls = [...new Set([...herbUrls, ...pageUrls])]
      pageNum++
      await sleep(CONFIG.delay)
    }

    console.log(`  Total URLs collected: ${herbUrls.length}`)

    for (const herbUrl of herbUrls) {
      console.log(`\n  Scraping: ${herbUrl}`)

      const herbHtml = await fetchPage(herbUrl)
      if (!herbHtml) continue

      const herbData = parseHerbPage(herbHtml, herbUrl)

      if (!herbData.title) {
        console.log('    Skipping - no title found')
        continue
      }

      const slug = safeFilename(herbData.title)
      console.log(`    Title: ${herbData.title}`)
      console.log(`    Slug: ${slug}`)

      // Download image (only for primary language or if not exists)
      if (herbData.imageUrl && !skipImages && langCode === 'en') {
        const ext = path.extname(new URL(herbData.imageUrl).pathname) || '.jpg'
        const imageFilename = `${slug}${ext}`
        const imagePath = path.join(IMAGES_DIR, imageFilename)
        await downloadImage(herbData.imageUrl, imagePath)
        herbData.imageLocal = imageFilename
      }

      allHerbs.set(slug, herbData)

      // Generate and save YAML
      const yamlContent = generateYaml(herbData, langCode)
      const fileSuffix = langConfig.fileSuffix
      const yamlPath = path.join(CONTENT_DIR, `${slug}${fileSuffix}.yaml`)
      fs.writeFileSync(yamlPath, yamlContent)
      console.log(`    Saved: ${yamlPath}`)

      await sleep(CONFIG.delay)
    }
  }

  return allHerbs
}

async function scrapeHerbapedia(options = {}) {
  const { dryRun = false, skipImages = false, allLanguages = false, language = 'en' } = options

  console.log('Herbapedia Scraper v2')
  console.log('====================')

  ensureDir(CONTENT_DIR)
  ensureDir(IMAGES_DIR)

  const languagesToScrape = allLanguages
    ? Object.keys(CONFIG.languages)
    : [language]

  let totalHerbs = 0

  for (const lang of languagesToScrape) {
    const herbs = await scrapeLanguage(lang, { dryRun, skipImages })
    totalHerbs += herbs.size
  }

  // Generate/update index
  if (!dryRun) {
    console.log('\n\nGenerating index...')
    const yamlFiles = fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.yaml') && !f.includes('.zh-') && f !== 'index.yaml')

    const indexData = {
      total: yamlFiles.length,
      categories: {},
      herbs: []
    }

    for (const file of yamlFiles) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')
      const categoryMatch = content.match(/^category:\s*"([^"]+)"/m)
      const titleMatch = content.match(/^title:\s*"([^"]+)"/m)
      const sciMatch = content.match(/^scientific_name:\s*"([^"]+)"/m)

      if (categoryMatch) {
        const cat = categoryMatch[1]
        indexData.categories[cat] = (indexData.categories[cat] || 0) + 1

        indexData.herbs.push({
          slug: file.replace('.yaml', ''),
          title: titleMatch ? titleMatch[1] : '',
          category: cat,
          scientific_name: sciMatch ? sciMatch[1] : null
        })
      }
    }

    const indexPath = path.join(CONTENT_DIR, 'index.yaml')
    const indexYaml = `# Herbapedia Index\n# Auto-generated at ${new Date().toISOString()}\n\ntotal: ${indexData.total}\n\ncategories:\n${Object.entries(indexData.categories).map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n`
    fs.writeFileSync(indexPath, indexYaml)
    console.log(`Saved index with ${indexData.total} herbs`)
  }

  console.log('\n\nScraping complete!')
  console.log(`Total entries: ${totalHerbs}`)
}

// Parse arguments
const args = process.argv.slice(2)
const options = {
  dryRun: args.includes('--dry-run'),
  skipImages: args.includes('--skip-images'),
  allLanguages: args.includes('--all-languages'),
  language: 'en'
}

const langIndex = args.indexOf('--lang')
if (langIndex !== -1 && args[langIndex + 1]) {
  options.language = args[langIndex + 1]
}

scrapeHerbapedia(options).catch(console.error)
