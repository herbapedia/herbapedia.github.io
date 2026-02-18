<template>
  <div class="language-switcher">
    <select
      :value="currentLocale"
      @change="switchLanguage($event.target.value)"
      class="language-switcher__select"
      :aria-label="t('language.select')"
    >
      <option v-for="locale in supportedLocales" :key="locale" :value="locale">
        {{ LOCALE_NAMES[locale] }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, LOCALE_NAMES, DEFAULT_LOCALE } from '@/i18n/locales'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

const supportedLocales = SUPPORTED_LOCALES

const currentLocale = computed(() => locale.value)

function switchLanguage(newLocale) {
  const currentPath = route.path

  // Remove existing locale prefix from path
  let pathWithoutLocale = currentPath
  for (const loc of SUPPORTED_LOCALES) {
    if (loc !== DEFAULT_LOCALE && currentPath.startsWith(`/${loc}`)) {
      pathWithoutLocale = currentPath.slice(loc.length + 1) || '/'
      break
    }
  }

  // Build new path with new locale
  let newPath
  if (newLocale === DEFAULT_LOCALE) {
    newPath = pathWithoutLocale
  } else {
    newPath = `/${newLocale}${pathWithoutLocale}`
  }

  locale.value = newLocale
  router.push(newPath)
}
</script>

<style scoped>
.language-switcher__select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.language-switcher__select:hover {
  border-color: var(--color-primary);
}

.language-switcher__select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}
</style>
