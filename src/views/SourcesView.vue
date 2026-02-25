<template>
  <div class="sources-view">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <span>{{ t('sources.title') }}</span>
      </nav>

      <header class="sources-hero">
        <h1 class="sources-hero__title">{{ t('sources.title') }}</h1>
        <p class="sources-hero__subtitle">{{ t('sources.subtitle') }}</p>
      </header>

      <div class="sources-grid">
        <router-link
          v-for="source in sourceTypes"
          :key="source.id"
          :to="localePath(source.path)"
          class="source-card"
          :class="`source-card--${source.id}`"
        >
          <div class="source-card__header">
            <span class="source-card__icon">{{ source.icon }}</span>
            <div class="source-card__titles">
              <h2 class="source-card__name">{{ source.name }}</h2>
              <p class="source-card__type">{{ source.typeLabel }}</p>
            </div>
          </div>
          <p class="source-card__description">{{ source.description }}</p>
          <div class="source-card__stats">
            <div class="source-card__stat">
              <span class="source-card__stat-value">{{ source.count }}</span>
              <span class="source-card__stat-label">{{ t('sources.entities') }}</span>
            </div>
          </div>
          <span class="source-card__arrow">→</span>
        </router-link>
      </div>

      <section class="sources-about">
        <h2>{{ t('sources.aboutTitle') }}</h2>
        <p>{{ t('sources.aboutText') }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { dataset } from '@/api/dataset'
import { DEFAULT_LOCALE } from '@/i18n/locales'

const { t, locale } = useI18n()

const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Get stats from dataset
const counts = dataset.getCounts()

const sourceTypes = [
  {
    id: 'botanical',
    icon: '🌿',
    name: t('sources.botanical'),
    typeLabel: 'PlantSpecies',
    description: t('sources.botanicalDesc'),
    path: '/sources/botanical',
    count: counts.plants
  },
  {
    id: 'fungi',
    icon: '🍄',
    name: t('sources.fungi'),
    typeLabel: 'FungalSpecies',
    description: t('sources.fungiDesc'),
    path: '/sources/fungi',
    count: counts.fungi
  },
  {
    id: 'algae',
    icon: '🟢',
    name: t('sources.algae'),
    typeLabel: 'AlgalSpecies',
    description: t('sources.algaeDesc'),
    path: '/sources/algae',
    count: counts.algae
  },
  {
    id: 'zoological',
    icon: '🦐',
    name: t('sources.zoological'),
    typeLabel: 'ZoologicalSource',
    description: t('sources.zoologicalDesc'),
    path: '/sources/zoological',
    count: counts.zoologicalSources
  },
  {
    id: 'mineral',
    icon: '💎',
    name: t('sources.mineral'),
    typeLabel: 'MineralSource',
    description: t('sources.mineralDesc'),
    path: '/sources/mineral',
    count: counts.mineralSources
  },
  {
    id: 'chemical',
    icon: '⚗️',
    name: t('sources.chemical'),
    typeLabel: 'ChemicalSource',
    description: t('sources.chemicalDesc'),
    path: '/sources/chemical',
    count: counts.chemicalSources
  }
]
</script>

<style scoped>
.sources-view {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - var(--header-height));
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
}

.breadcrumbs a {
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.sources-hero {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.sources-hero__title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
}

.sources-hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto;
}

.sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.source-card {
  display: block;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-decoration: none;
  color: var(--color-text);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  position: relative;
  border: 2px solid transparent;
}

.source-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.source-card--botanical:hover { border-color: #22c55e; }
.source-card--fungi:hover { border-color: #a855f7; }
.source-card--algae:hover { border-color: #14b8a6; }
.source-card--zoological:hover { border-color: #f97316; }
.source-card--mineral:hover { border-color: #8b5cf6; }
.source-card--chemical:hover { border-color: #06b6d4; }

.source-card__header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.source-card__icon {
  font-size: var(--font-size-2xl);
  line-height: 1;
}

.source-card__titles {
  flex: 1;
}

.source-card__name {
  font-size: var(--font-size-xl);
  margin: 0 0 var(--spacing-xs);
}

.source-card__type {
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--color-text-light);
  margin: 0;
  background: var(--color-surface-alt);
  display: inline-block;
  padding: 0.1em 0.4em;
  border-radius: var(--radius-sm);
}

.source-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.source-card__stats {
  display: flex;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.source-card__stat {
  display: flex;
  flex-direction: column;
}

.source-card__stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.source-card__stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.source-card__arrow {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.source-card:hover .source-card__arrow {
  opacity: 1;
}

.sources-about {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

.sources-about h2 {
  margin-bottom: var(--spacing-md);
}

.sources-about p {
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}
</style>
