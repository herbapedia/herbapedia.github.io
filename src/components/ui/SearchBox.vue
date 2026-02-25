<template>
  <div class="search-container" ref="searchContainer">
    <div class="search-input-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        aria-label="Search preparations"
        autocomplete="off"
      />
      <button
        v-if="searchQuery"
        class="search-clear"
        @click="clearSearch"
        aria-label="Clear search"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="showDropdown && filteredResults.length > 0"
        class="search-dropdown"
        :style="dropdownStyle"
        ref="dropdown"
      >
        <ul class="search-results" role="listbox">
          <li
            v-for="(result, index) in filteredResults"
            :key="result.slug"
            class="search-result-item"
            :class="{ 'search-result-item--active': index === activeIndex }"
            @click="selectResult(result)"
            @mouseenter="activeIndex = index"
            role="option"
            :aria-selected="index === activeIndex"
          >
            <img
              v-if="result.image"
              :src="result.image"
              :alt="result.title"
              class="search-result-image"
            />
            <div class="search-result-content">
              <span class="search-result-title" v-html="highlightMatch(result.title)"></span>
              <span v-if="result.scientificName" class="search-result-scientific">
                {{ result.scientificName }}
              </span>
              <div class="search-result-badges">
                <span v-if="result.hasTCM" class="search-result-badge search-result-badge--tcm">TCM</span>
                <span v-if="result.hasWestern" class="search-result-badge search-result-badge--western">W</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { useAllPreparations, useSourcePlant, usePreparationLocalizer } from '@/composables/useHerbData'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search preparations...'
  }
})

const emit = defineEmits(['search', 'select'])

const { locale } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const showDropdown = ref(false)
const activeIndex = ref(-1)
const searchContainer = ref(null)
const searchInput = ref(null)
const dropdown = ref(null)
const dropdownStyle = ref({})

// Get all preparations
const allPreparations = useAllPreparations()
const localizer = usePreparationLocalizer()

// Build search index from preparations
const searchIndex = computed(() => {
  return allPreparations.value.map(prep => {
    const slug = extractSlug(prep)
    const plant = useSourcePlant(slug)

    return {
      slug,
      title: localizer.getName(prep) || slug,
      scientificName: plant.value?.scientificName || '',
      image: prep.image || plant.value?.image || null,
      hasTCM: !!prep.hasTCMProfile,
      hasWestern: !!prep.hasWesternProfile,
      hasAyurveda: !!prep.hasAyurvedaProfile,
      searchText: `${localizer.getName(prep) || ''} ${plant.value?.scientificName || ''} ${slug.replace(/-/g, ' ')}`.toLowerCase()
    }
  })
})

// Filter results
const filteredResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase().trim()
  const terms = query.split(/\s+/)

  return searchIndex.value
    .filter(item => {
      const text = item.searchText
      return terms.every(term => text.includes(term))
    })
    .slice(0, 10) // Limit to 10 results
})

// Helper to extract slug
function extractSlug(prep) {
  if (!prep?.['@id']) return ''
  const parts = prep['@id'].split('/')
  return parts[parts.length - 1] || ''
}

// Highlight matching text
function highlightMatch(text) {
  if (!searchQuery.value.trim()) return text

  const query = searchQuery.value.trim()
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Helper for localized paths
function localePath(path) {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Handle input
function handleInput() {
  activeIndex.value = -1
  showDropdown.value = searchQuery.value.trim().length > 0
  emit('search', searchQuery.value)
  updateDropdownPosition()
}

// Handle keyboard navigation
function handleKeydown(event) {
  if (!showDropdown.value || filteredResults.value.length === 0) {
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, filteredResults.value.length - 1)
      scrollToActive()
      break
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
      scrollToActive()
      break
    case 'Enter':
      event.preventDefault()
      if (activeIndex.value >= 0) {
        selectResult(filteredResults.value[activeIndex.value])
      }
      break
    case 'Escape':
      closeDropdown()
      break
  }
}

// Scroll to active item
function scrollToActive() {
  nextTick(() => {
    if (!dropdown.value) return
    const activeItem = dropdown.value.querySelector('.search-result-item--active')
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' })
    }
  })
}

// Handle focus
function handleFocus() {
  if (searchQuery.value.trim()) {
    showDropdown.value = true
    updateDropdownPosition()
  }
}

// Update dropdown position
function updateDropdownPosition() {
  if (!searchContainer.value) return

  const rect = searchContainer.value.getBoundingClientRect()
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 1000
  }
}

// Select result
function selectResult(result) {
  searchQuery.value = result.title
  showDropdown.value = false
  activeIndex.value = -1
  emit('select', result)

  // Navigate to preparation page
  const path = localePath(`/preparations/${result.slug}`)
  router.push(path)
}

// Clear search
function clearSearch() {
  searchQuery.value = ''
  showDropdown.value = false
  activeIndex.value = -1
  searchInput.value?.focus()
}

// Close dropdown
function closeDropdown() {
  showDropdown.value = false
  activeIndex.value = -1
}

// Handle click outside
function handleClickOutside(event) {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    closeDropdown()
  }
}

// Handle scroll
function handleScroll() {
  if (showDropdown.value) {
    updateDropdownPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', updateDropdownPosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: var(--color-text-light);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.search-input::placeholder {
  color: var(--color-text-light);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 34, 139, 34), 0.15);
}

.search-clear {
  position: absolute;
  right: 8px;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color var(--transition-fast);
}

.search-clear:hover {
  color: var(--color-text);
}

.search-clear svg {
  width: 16px;
  height: 16px;
}

.search-dropdown {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 400px;
  overflow-y: auto;
}

.search-results {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  transition: background var(--transition-fast);
  border-bottom: 1px solid var(--color-border);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover,
.search-result-item--active {
  background: var(--color-background);
}

.search-result-image {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  object-fit: cover;
  flex-shrink: 0;
  background: var(--color-background);
}

.search-result-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-result-title {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-result-title :deep(mark) {
  background: rgba(var(--color-accent-rgb, 218, 165, 32), 0.3);
  color: inherit;
  padding: 0 2px;
  border-radius: 2px;
}

.search-result-scientific {
  font-size: var(--font-size-sm);
  font-style: italic;
  color: var(--color-text-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-result-badges {
  display: flex;
  gap: 4px;
}

.search-result-badge {
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.search-result-badge--tcm {
  background: rgba(34, 139, 34, 0.15);
  color: var(--color-primary);
}

.search-result-badge--western {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}
</style>
