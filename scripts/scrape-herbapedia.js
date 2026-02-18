#!/usr/bin/env node

/**
 * Herbapedia Scraper v4
 * Fixed multilingual scraping with proper content matching
 *
 * Strategy:
 * 1. Scrape English first to establish slug -> directory mapping
 * 2. For Chinese pages, find the correct directory by matching og:image
 * 3. Store all languages in the same herb directory
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT_DIR, 'src/content/herbs')

const CONFIG = {
  baseUrl: 'https://www.vitaherbapedia.com',
  delay: 200,
  languages: {
    'en': { path: 'en', categorySuffix: '-en' },
    'zh-HK': { path: 'zh', categorySuffix: '' },
    'zh-CN': { path: 'cn', categorySuffix: '-cn' }
  },
  categories: {
    'chinese-herbs': 'chiherbs',
    'western-herbs': 'westherbs',
    'vitamins': 'vitamins',
    'minerals': 'minerals',
    'nutrients': 'nutrients'
  }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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
    return true
  } catch (error) {
    console.error(`    Failed to download ${url}:`, error.message)
    return false
  }
}

function cleanText(text) {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSlugFromImageUrl(imageUrl) {
  if (!imageUrl) return null
  try {
    const urlObj = new URL(imageUrl)
    const filename = path.basename(urlObj.pathname)
    // Remove extension and any trailing numbers like -1, -2
    const name = filename.replace(/\.[^.]+$/, '').replace(/-\d+$/, '')
    return name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  } catch {
    return null
  }
}

// Extract slug from URL path (for English pages)
function extractSlugFromUrl(url) {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(p => p)
    // Get the last part of the URL path
    const lastPart = pathParts[pathParts.length - 1]
    // Remove trailing slash and clean up
    return lastPart
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  } catch {
    return null
  }
}

function extractHerbUrls(html, baseUrl) {
  const urls = []
  const linkPattern = /href="([^"]*\/shop\/[^"]+)"/g
  let match
  while ((match = linkPattern.exec(html)) !== null) {
    let url = match[1]
    if (url.includes('/shop/') && !urls.includes(url)) {
      if (!url.startsWith('http')) {
        url = baseUrl + url
      }
      urls.push(url)
    }
  }
  return urls
}

function extractContentSections(html) {
  const sections = {}

  // Match desc_containter divs
  const containerPattern = /<div class="desc_containter[^"]*"[^>]*>[\s\S]*?<div class="inner">([^<]+)<\/div>[\s\S]*?<div class="desc_content_container[^"]*">([\s\S]*?)<\/div>\s*<\/div>/gi

  let match
  while ((match = containerPattern.exec(html)) !== null) {
    const title = cleanText(match[1])
    const content = cleanText(match[2])

    // Map to standardized keys
    const titleLower = title.toLowerCase()
    let key = titleLower

    // English mappings
    if (titleLower.includes('history')) key = 'history'
    else if (titleLower.includes('introduction') || titleLower.includes('簡介') || titleLower.includes('简介')) key = 'introduction'
    else if (titleLower.includes('traditional') || titleLower.includes('傳統') || titleLower.includes('传统') || titleLower.includes('用法')) key = 'traditional_usage'
    else if (titleLower.includes('modern') || titleLower.includes('研究')) key = 'modern_research'
    else if (titleLower.includes('botanical') || titleLower.includes('來源') || titleLower.includes('来源')) key = 'botanical_source'
    else if (titleLower.includes('function') || titleLower.includes('功能') || titleLower.includes('功效')) key = 'functions'
    else if (titleLower.includes('food source') || titleLower.includes('食物來源') || titleLower.includes('食物来源')) key = 'food_sources'
    else if (titleLower.includes('importance') || titleLower.includes('重要性')) key = 'importance'
    else if (titleLower.includes('precaution') || titleLower.includes('注意')) key = 'precautions'
    else if (titleLower.includes('dosage') || titleLower.includes('劑量') || titleLower.includes('剂量')) key = 'dosage'
    else if (titleLower.includes('現代') || titleLower.includes('现代')) key = 'modern_usage'

    if (content && content.length > 10) {
      sections[key] = content
    }
  }

  return sections
}

function parseHerbPage(html, url, language = 'en') {
  const data = {
    url,
    title: '',
    scientificName: '',
    imageUrl: null,
    slug: null,
    category: '',
    sections: {}
  }

  // Extract title from og:title
  const ogTitleMatch = html.match(/property="og:title"\s+content="([^"]+)"/)
  if (ogTitleMatch) {
    data.title = ogTitleMatch[1]
      .replace(/\s*-\s*維特草本百科$/, '')
      .replace(/\s*-\s* Vita Herbapedia$/, '')
      .replace(/\s*-\s*维特草本百科$/, '')
      .trim()
  }

  if (!data.title) {
    const titleMatch = html.match(/<h1[^>]*class="product_title[^"]*"[^>]*>\s*([^<]+)/)
    if (titleMatch) data.title = cleanText(titleMatch[1])
  }

  // Extract scientific name
  const sciMatch = html.match(/<h4[^>]*class="product_academic_title"[^>]*><i>([^<]+)<\/i><\/h4>/)
  if (sciMatch) {
    data.scientificName = cleanText(sciMatch[1])
  }

  if (!data.scientificName) {
    const sciMatch2 = html.match(/<h4[^>]*><em>([^<]+)<\/em><\/h4>/)
    if (sciMatch2) data.scientificName = cleanText(sciMatch2[1])
  }

  // Extract image URL
  const ogImageMatch = html.match(/property="og:image"\s+content="([^"]+)"/)
  if (ogImageMatch) {
    data.imageUrl = ogImageMatch[1]
  }

  // Extract slug based on language
  // For English: use URL path
  // For Chinese: use image filename to match English
  if (language === 'en') {
    data.slug = extractSlugFromUrl(url)
  } else {
    data.slug = extractSlugFromImageUrl(data.imageUrl)
  }

  // Determine category from URL
  for (const [cat, catPath] of Object.entries(CONFIG.categories)) {
    if (url.includes(catPath)) {
      data.category = cat
      break
    }
  }

  // Extract content sections
  data.sections = extractContentSections(html)

  return data
}

function generateYaml(data, language, slug) {
  const lines = [
    `# ${data.title}`,
    `# Source: ${data.url}`,
    `# Language: ${language}`,
    '',
    `id: "${slug}"`,
    `slug: "${slug}"`,
    `category: "${data.category}"`,
    `title: "${data.title.replace(/"/g, '\\"')}"`,
  ]

  if (data.scientificName) {
    lines.push(`scientific_name: "${data.scientificName.replace(/"/g, '\\"')}"`)
  }

  lines.push(`image: "images/${slug}.jpg"`)
  lines.push('')

  // Section order
  const sectionOrder = ['history', 'introduction', 'botanical_source', 'traditional_usage',
                       'modern_usage', 'modern_research', 'functions', 'importance',
                       'food_sources', 'precautions', 'dosage']

  for (const section of sectionOrder) {
    if (data.sections[section]) {
      lines.push(`${section}: |`)
      lines.push(`  ${data.sections[section].replace(/\n/g, '\n  ')}`)
      lines.push('')
    }
  }

  // Other sections
  for (const [key, value] of Object.entries(data.sections)) {
    if (!sectionOrder.includes(key)) {
      lines.push(`${key}: |`)
      lines.push(`  ${value.replace(/\n/g, '\n  ')}`)
      lines.push('')
    }
  }

  lines.push('metadata:')
  lines.push('  source: "vitaherbapedia.com"')
  lines.push(`  source_url: "${data.url}"`)
  lines.push(`  scraped_at: "${new Date().toISOString()}"`)
  lines.push(`  language: "${language}"`)

  return lines.join('\n')
}

function getCategoryPath(category, language) {
  const catPath = CONFIG.categories[category]
  const langConfig = CONFIG.languages[language]
  if (language === 'en') {
    return catPath + langConfig.categorySuffix
  }
  return catPath + langConfig.categorySuffix
}

async function getCategoryUrls(category, language) {
  const langConfig = CONFIG.languages[language]
  const catPath = getCategoryPath(category, language)
  const categoryUrl = `${CONFIG.baseUrl}/${langConfig.path}/product-category/${catPath}/`

  console.log(`  Category URL: ${categoryUrl}`)

  const firstPageHtml = await fetchPage(categoryUrl)
  if (!firstPageHtml) {
    console.log('  Failed to fetch category page')
    return []
  }

  let urls = extractHerbUrls(firstPageHtml, CONFIG.baseUrl)

  // Get total items from pagination
  let totalItems = urls.length

  // Try different pagination formats
  let pageCountMatch = firstPageHtml.match(/Showing\s+\d+(?:–|–|-|&ndash;)\s*\d+\s+of\s+(\d+)/i)
  if (!pageCountMatch) {
    pageCountMatch = firstPageHtml.match(/顯示\s+(\d+)\s+筆結果/)
  }
  if (!pageCountMatch) {
    pageCountMatch = firstPageHtml.match(/显示\s+(\d+)\s+条/)
  }

  if (pageCountMatch) {
    totalItems = parseInt(pageCountMatch[1])
  }

  console.log(`  Found ${totalItems} items (first page: ${urls.length})`)

  // Fetch additional pages
  let pageNum = 2
  while (urls.length < totalItems && pageNum <= 20) {
    const pageUrl = `${CONFIG.baseUrl}/${langConfig.path}/product-category/${catPath}/page/${pageNum}/`
    const pageHtml = await fetchPage(pageUrl)
    if (!pageHtml) break

    const pageUrls = extractHerbUrls(pageHtml, CONFIG.baseUrl)
    if (pageUrls.length === 0) break

    urls = [...new Set([...urls, ...pageUrls])]
    pageNum++
    await sleep(CONFIG.delay)
  }

  console.log(`  Total URLs: ${urls.length}`)
  return urls
}

async function scrapeEnglish() {
  console.log('\n' + '='.repeat(50))
  console.log('PHASE 1: Scraping English (baseline)')
  console.log('='.repeat(50))

  const slugToDir = new Map() // Maps slug -> directory path
  const dirToSlug = new Map() // Maps directory path -> slug

  for (const category of Object.keys(CONFIG.categories)) {
    console.log(`\nCategory: ${category}`)

    const urls = await getCategoryUrls(category, 'en')

    for (const url of urls) {
      console.log(`\n  Scraping: ${url}`)
      const html = await fetchPage(url)
      if (!html) continue

      const data = parseHerbPage(html, url, 'en')
      if (!data.title || !data.slug) {
        console.log('    Skipping - no title or slug')
        continue
      }

      const slug = data.slug
      console.log(`    Title: ${data.title}`)
      console.log(`    Slug: ${slug}`)
      console.log(`    Sections: ${Object.keys(data.sections).join(', ') || 'none'}`)

      // Create directory
      const herbDir = path.join(CONTENT_DIR, slug)
      ensureDir(herbDir)
      ensureDir(path.join(herbDir, 'images'))

      // Download image
      if (data.imageUrl) {
        const ext = path.extname(new URL(data.imageUrl).pathname) || '.jpg'
        const imagePath = path.join(herbDir, 'images', `${slug}${ext}`)
        if (!fs.existsSync(imagePath)) {
          console.log(`    Downloading image...`)
          await downloadImage(data.imageUrl, imagePath)
        }
      }

      // Save YAML
      const yamlContent = generateYaml(data, 'en', slug)
      fs.writeFileSync(path.join(herbDir, 'en.yaml'), yamlContent)

      slugToDir.set(slug, herbDir)
      dirToSlug.set(herbDir, slug)

      await sleep(CONFIG.delay)
    }
  }

  return slugToDir
}

async function scrapeChinese(language, slugToDir) {
  const langName = language === 'zh-HK' ? 'Traditional Chinese' : 'Simplified Chinese'
  console.log('\n' + '='.repeat(50))
  console.log(`PHASE: Scraping ${langName}`)
  console.log('='.repeat(50))

  const langConfig = CONFIG.languages[language]
  let matched = 0
  let unmatched = 0

  for (const category of Object.keys(CONFIG.categories)) {
    console.log(`\nCategory: ${category}`)

    const urls = await getCategoryUrls(category, language)

    for (const url of urls) {
      console.log(`\n  Scraping: ${url}`)
      const html = await fetchPage(url)
      if (!html) continue

      const data = parseHerbPage(html, url, language)
      if (!data.title || !data.slug) {
        console.log('    Skipping - no title or slug')
        continue
      }

      console.log(`    Title: ${data.title}`)
      console.log(`    Slug: ${data.slug}`)
      console.log(`    Sections: ${Object.keys(data.sections).join(', ') || 'none'}`)

      // Find the herb directory using the slug from og:image
      const herbDir = slugToDir.get(data.slug)

      if (herbDir) {
        console.log(`    Matched to existing directory: ${path.basename(herbDir)}`)
        matched++

        // Save Chinese YAML
        const yamlContent = generateYaml(data, language, data.slug)
        fs.writeFileSync(path.join(herbDir, `${language}.yaml`), yamlContent)
        console.log(`    Saved: ${language}.yaml`)
      } else {
        console.log(`    WARNING: No matching English directory found for slug: ${data.slug}`)
        unmatched++

        // Create new directory for unmatched herbs
        const newDir = path.join(CONTENT_DIR, data.slug)
        ensureDir(newDir)
        ensureDir(path.join(newDir, 'images'))

        // Still save the content
        const yamlContent = generateYaml(data, language, data.slug)
        fs.writeFileSync(path.join(newDir, `${language}.yaml`), yamlContent)

        // Add to mapping for other Chinese variants
        slugToDir.set(data.slug, newDir)
      }

      await sleep(CONFIG.delay)
    }
  }

  console.log(`\n  Matched: ${matched}, Unmatched: ${unmatched}`)
}

async function main() {
  console.log('Herbapedia Scraper v4')
  console.log('====================')
  console.log('Fixed multilingual scraping')

  // Clear existing content
  if (fs.existsSync(CONTENT_DIR)) {
    console.log('\nClearing existing content...')
    const dirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)

    for (const dir of dirs) {
      const dirPath = path.join(CONTENT_DIR, dir)
      fs.rmSync(dirPath, { recursive: true })
    }
    console.log(`Removed ${dirs.length} directories`)
  }

  ensureDir(CONTENT_DIR)

  // Phase 1: Scrape English to establish baseline
  const slugToDir = await scrapeEnglish()

  console.log(`\n\nEnglish herbs scraped: ${slugToDir.size}`)

  // Phase 2: Scrape Chinese variants
  await scrapeChinese('zh-HK', slugToDir)
  await scrapeChinese('zh-CN', slugToDir)

  // Generate index
  console.log('\n\nGenerating index...')
  const herbDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  const categories = {}
  for (const slug of herbDirs) {
    const enPath = path.join(CONTENT_DIR, slug, 'en.yaml')
    if (fs.existsSync(enPath)) {
      const content = fs.readFileSync(enPath, 'utf8')
      const catMatch = content.match(/^category:\s*"([^"]+)"/m)
      if (catMatch) {
        categories[catMatch[1]] = (categories[catMatch[1]] || 0) + 1
      }
    }
  }

  const indexPath = path.join(CONTENT_DIR, 'index.yaml')
  const indexYaml = `# Herbapedia Index\n# Auto-generated at ${new Date().toISOString()}\n\ntotal: ${herbDirs.length}\n\ncategories:\n${Object.entries(categories).map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n`
  fs.writeFileSync(indexPath, indexYaml)

  console.log('\n\nScraping complete!')
  console.log(`Total herb directories: ${herbDirs.length}`)
  console.log('Categories:', categories)
}

main().catch(console.error)
