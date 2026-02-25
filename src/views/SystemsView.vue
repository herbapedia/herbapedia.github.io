<template>
  <div class="systems-view">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/')">{{ t('nav.home') }}</router-link>
        <span>/</span>
        <span>{{ t('systems.title') }}</span>
      </nav>

      <header class="systems-hero">
        <h1 class="systems-hero__title">{{ t('systems.title') }}</h1>
        <p class="systems-hero__subtitle">{{ t('systems.subtitle') }}</p>
      </header>

      <div class="systems-grid">
        <router-link
          v-for="system in systems"
          :key="system.id"
          :to="localePath(`/systems/${system.id}`)"
          class="system-card"
          :class="`system-card--${system.id}`"
        >
          <div class="system-card__header">
            <span class="system-card__icon">{{ system.icon }}</span>
            <div class="system-card__titles">
              <h2 class="system-card__name">{{ system.name }}</h2>
              <p class="system-card__native">{{ system.nativeName }}</p>
            </div>
          </div>
          <p class="system-card__description">{{ system.description }}</p>
          <div class="system-card__stats">
            <div class="system-card__stat">
              <span class="system-card__stat-value">{{ system.profileCount }}</span>
              <span class="system-card__stat-label">{{ t('systems.profiles') }}</span>
            </div>
            <div class="system-card__stat">
              <span class="system-card__stat-value">{{ system.referenceCount }}</span>
              <span class="system-card__stat-label">{{ t('systems.referenceData') }}</span>
            </div>
          </div>
          <span class="system-card__arrow">→</span>
        </router-link>
      </div>

      <!-- Herbal Vocabulary Section -->
      <section class="vocabulary-section">
        <h2 class="vocabulary-section__title">{{ t('herbal.title') }}</h2>
        <p class="vocabulary-section__subtitle">{{ t('herbal.subtitle') }}</p>
        <div class="vocabulary-grid">
          <router-link
            :to="localePath('/systems/herbal/forms')"
            class="vocabulary-card vocabulary-card--forms"
          >
            <span class="vocabulary-card__icon">💊</span>
            <h3 class="vocabulary-card__name">{{ t('herbal.forms') }}</h3>
            <p class="vocabulary-card__count">{{ formsCount }} {{ t('systems.items') }}</p>
            <p class="vocabulary-card__desc">{{ t('reference.formsDesc') }}</p>
          </router-link>
          <router-link
            :to="localePath('/systems/herbal/methods')"
            class="vocabulary-card vocabulary-card--methods"
          >
            <span class="vocabulary-card__icon">⚗️</span>
            <h3 class="vocabulary-card__name">{{ t('herbal.methods') }}</h3>
            <p class="vocabulary-card__count">{{ methodsCount }} {{ t('systems.items') }}</p>
            <p class="vocabulary-card__desc">{{ t('reference.methodsDesc') }}</p>
          </router-link>
        </div>
      </section>

      <section class="systems-about">
        <h2>{{ t('systems.aboutTitle') }}</h2>
        <p>{{ t('systems.aboutText') }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

const stats = dataset.getSystemStats()

const formsCount = dataset.getAllHerbalForms().length
const methodsCount = dataset.getAllHerbalMethods().length

const systems = computed(() => [
  {
    id: 'tcm',
    icon: '☯️',
    name: t('systems.tcm.name'),
    nativeName: '中医 / 中醫',
    description: t('systems.tcm.description'),
    profileCount: stats.tcm,
    referenceCount: 44 // 5 natures + 5 flavors + 12 meridians + 22 categories
  },
  {
    id: 'western',
    icon: '🌿',
    name: t('systems.western.name'),
    nativeName: 'Western Herbalism',
    description: t('systems.western.description'),
    profileCount: stats.western,
    referenceCount: 40 // 25 actions + 15 organs
  },
  {
    id: 'ayurveda',
    icon: '🪷',
    name: t('systems.ayurveda.name'),
    nativeName: 'आयुर्वेद / Ayurveda',
    description: t('systems.ayurveda.description'),
    profileCount: stats.ayurveda,
    referenceCount: 31 // 6 rasa + 20 guna + 2 virya + 3 vipaka
  },
  {
    id: 'persian',
    icon: '🌙',
    name: t('systems.persian.name'),
    nativeName: 'طب یونانی / Unani',
    description: t('systems.persian.description'),
    profileCount: stats.persian,
    referenceCount: 8 // 4 temperaments + 4 elements
  },
  {
    id: 'mongolian',
    icon: '🏔️',
    name: t('systems.mongolian.name'),
    nativeName: 'Монгол эмнэлэг / Tibetan',
    description: t('systems.mongolian.description'),
    profileCount: stats.mongolian,
    referenceCount: 11 // 5 elements + 6 tastes
  }
])
</script>

<style scoped>
.systems-view {
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

.systems-hero {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.systems-hero__title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
}

.systems-hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto;
}

.systems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.system-card {
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

.system-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.system-card--tcm:hover { border-color: #22c55e; }
.system-card--western:hover { border-color: #3b82f6; }
.system-card--ayurveda:hover { border-color: #f97316; }
.system-card--persian:hover { border-color: #8b5cf6; }
.system-card--mongolian:hover { border-color: #06b6d4; }

.system-card__header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.system-card__icon {
  font-size: var(--font-size-2xl);
  line-height: 1;
}

.system-card__titles {
  flex: 1;
}

.system-card__name {
  font-size: var(--font-size-xl);
  margin: 0 0 var(--spacing-xs);
}

.system-card__native {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

.system-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.system-card__stats {
  display: flex;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.system-card__stat {
  display: flex;
  flex-direction: column;
}

.system-card__stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.system-card__stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.system-card__arrow {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.system-card:hover .system-card__arrow {
  opacity: 1;
}

.systems-about {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

.systems-about h2 {
  margin-bottom: var(--spacing-md);
}

.systems-about p {
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

/* Vocabulary Section */
.vocabulary-section {
  margin-bottom: var(--spacing-2xl);
}

.vocabulary-section__title {
  font-size: var(--font-size-2xl);
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.vocabulary-section__subtitle {
  text-align: center;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
}

.vocabulary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.vocabulary-card {
  display: block;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-decoration: none;
  color: var(--color-text);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
}

.vocabulary-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.vocabulary-card--forms:hover { border-color: #10b981; }
.vocabulary-card--methods:hover { border-color: #8b5cf6; }

.vocabulary-card__icon {
  font-size: var(--font-size-2xl);
  display: block;
  margin-bottom: var(--spacing-sm);
}

.vocabulary-card__name {
  font-size: var(--font-size-xl);
  margin: 0 0 var(--spacing-xs);
}

.vocabulary-card__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-sm);
}

.vocabulary-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
  margin: 0;
}
</style>
