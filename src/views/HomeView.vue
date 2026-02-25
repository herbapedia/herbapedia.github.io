<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero__background">
        <img
          :src="heroImage"
          alt=""
          class="hero__bg-image"
          @error="handleHeroError"
        />
        <div class="hero__overlay"></div>
      </div>
      <div class="container hero__container">
        <div class="hero__content">
          <h1 class="hero__title">{{ t('home.heroTitle') }}</h1>
          <p class="hero__subtitle">{{ t('home.heroSubtitle') }}</p>
          <p class="hero__description">
            {{ t('home.heroDescription') }}
          </p>
          <router-link :to="localePath('/preparations')" class="hero__cta">
            {{ t('home.exploreHerbs') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Browse by Tradition -->
    <section class="traditions">
      <div class="container">
        <h2 class="traditions__title">{{ t('home.browseByTradition') }}</h2>
        <div class="traditions__grid">
          <GlassCard
            hoverable
            padding="lg"
            class="traditions__card"
          >
            <router-link :to="localePath('/preparations?system=tcm')" class="tradition-card">
              <div class="tradition-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M12 3v18"/>
                  <path d="M3 12h18"/>
                  <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" opacity="0.2"/>
                </svg>
              </div>
              <h3 class="tradition-card__title">{{ t('home.traditionTCM') }}</h3>
              <p class="tradition-card__subtitle">中药</p>
              <p class="tradition-card__count">{{ tcmCount }} {{ t('common.items') }}</p>
            </router-link>
          </GlassCard>

          <GlassCard
            hoverable
            padding="lg"
            class="traditions__card"
          >
            <router-link :to="localePath('/preparations?system=western')" class="tradition-card">
              <div class="tradition-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2c-4 4-6 8-6 12 0 4 2.5 6 6 6s6-2 6-6c0-4-2-8-6-12z"/>
                  <path d="M12 8v8"/>
                  <path d="M9 12h6"/>
                </svg>
              </div>
              <h3 class="tradition-card__title">{{ t('home.traditionWestern') }}</h3>
              <p class="tradition-card__subtitle">Western Herbalism</p>
              <p class="tradition-card__count">{{ westernCount }} {{ t('common.items') }}</p>
            </router-link>
          </GlassCard>

          <GlassCard
            hoverable
            padding="lg"
            class="traditions__card"
          >
            <router-link :to="localePath('/preparations?system=ayurveda')" class="tradition-card">
              <div class="tradition-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7l3-7z"/>
                </svg>
              </div>
              <h3 class="tradition-card__title">{{ t('home.traditionAyurveda') }}</h3>
              <p class="tradition-card__subtitle">आयुर्वेद</p>
              <p class="tradition-card__count">{{ ayurvedaCount }} {{ t('common.items') }}</p>
            </router-link>
          </GlassCard>
        </div>
      </div>
    </section>

    <!-- Browse by Property -->
    <section class="properties">
      <div class="container">
        <h2 class="properties__title">{{ t('home.browseByProperty') }}</h2>

        <!-- TCM Thermal Nature -->
        <div class="property-group">
          <h3 class="property-group__title">{{ t('tcm.nature') }}</h3>
          <div class="property-group__buttons">
            <router-link
              v-for="nature in tcmNatures"
              :key="nature.value"
              :to="localePath(`/preparations?nature=${nature.value}`)"
              class="property-button"
              :class="`property-button--${nature.value}`"
            >
              {{ nature.label }}
            </router-link>
          </div>
        </div>

        <!-- TCM Flavors -->
        <div class="property-group">
          <h3 class="property-group__title">{{ t('tcm.flavor') }}</h3>
          <div class="property-group__buttons">
            <router-link
              v-for="flavor in tcmFlavors"
              :key="flavor.value"
              :to="localePath(`/preparations?flavor=${flavor.value}`)"
              class="property-button property-button--flavor"
            >
              {{ flavor.label }}
            </router-link>
          </div>
        </div>

        <!-- Western Actions (showing first 4) -->
        <div class="property-group">
          <h3 class="property-group__title">{{ t('western.actions') }}</h3>
          <div class="property-group__buttons">
            <router-link
              v-for="action in westernActions.slice(0, 4)"
              :key="action.value"
              :to="localePath(`/preparations?action=${action.value}`)"
              class="property-button property-button--action"
            >
              {{ action.label }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics -->
    <section class="statistics">
      <div class="container">
        <div class="statistics__grid">
          <div class="stat-card">
            <span class="stat-card__number">{{ stats.preparations }}</span>
            <span class="stat-card__label">{{ t('nav.preparations') }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__number">{{ stats.tcmProfiles }}</span>
            <span class="stat-card__label">{{ tcmSystemName }} {{ t('preparations.systemProfiles') }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__number">{{ stats.westernProfiles }}</span>
            <span class="stat-card__label">{{ westernSystemName }} {{ t('preparations.systemProfiles') }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="about">
      <div class="container container-narrow">
        <GlassCard padding="xl">
          <h2>{{ t('home.aboutTitle') }}</h2>
          <p>{{ t('home.aboutP1') }}</p>
          <p>{{ t('home.aboutP2') }}</p>
          <router-link :to="localePath('/about')" class="about__link">{{ t('home.learnMore') }}</router-link>
        </GlassCard>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GlassCard from '@/components/ui/GlassCard.vue'
import { useAllPreparations, useDatasetStats } from '@/composables/useHerbData'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { useFilterOptions } from '@/composables/useFilters'
import { dataset } from '@/api/dataset'

const { t, locale } = useI18n()

// Hero image path - dynamic to avoid static analysis
const heroImage = '/@herbapedia/data/media/images/banners/tcm-banner.jpg'

// Get all preparations for counts
const allPreparations = useAllPreparations()
const stats = useDatasetStats()

// Get filter options
const { tcmNatures, tcmFlavors, westernActions } = useFilterOptions()

// Count preparations by system profile
const tcmCount = computed(() => allPreparations.value.filter(p => p.hasTCMProfile).length)
const westernCount = computed(() => allPreparations.value.filter(p => p.hasWesternProfile).length)
const ayurvedaCount = computed(() => allPreparations.value.filter(p => p.hasAyurvedaProfile).length)

// Get localized system names from dataset
const tcmSystemName = computed(() => {
  const system = dataset.getSystem('tcm')
  if (!system?.name) return 'TCM'
  const name = system.name[locale.value] || system.name['en']
  return name || 'TCM'
})

const westernSystemName = computed(() => {
  const system = dataset.getSystem('western')
  if (!system?.name) return 'Western'
  const name = system.name[locale.value] || system.name['en']
  return name || 'Western'
})

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Handle hero image error - fall back to gradient
function handleHeroError(event) {
  event.target.style.display = 'none'
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  position: relative;
  color: var(--color-text-inverse);
  padding: var(--spacing-3xl) 0;
  overflow: hidden;
}

.hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(45, 98, 99, 0.9), rgba(59, 126, 128, 0.85));
}

.hero__container {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-height: 400px;
}

.hero__content {
  max-width: 600px;
}

.hero__title {
  font-size: var(--font-size-5xl);
  color: var(--color-text-inverse);
  margin-bottom: var(--spacing-sm);
}

.hero__subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-accent);
  margin-bottom: var(--spacing-lg);
}

.hero__description {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  margin-bottom: var(--spacing-xl);
}

.hero__cta {
  display: inline-block;
  background: var(--color-accent);
  color: var(--color-text);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-fast);
}

.hero__cta:hover {
  background: var(--color-accent-light);
  transform: translateY(-2px);
}

/* Traditions Section */
.traditions {
  padding: var(--spacing-3xl) 0;
  background: var(--color-background);
}

.traditions__title {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.traditions__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.tradition-card {
  display: block;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.tradition-card__icon {
  width: 56px;
  height: 56px;
  margin: 0 auto var(--spacing-md);
  color: var(--color-primary);
}

.tradition-card__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.tradition-card__title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-xs);
}

.tradition-card__subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-sm);
}

.tradition-card__count {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin: 0;
}

/* Properties Section */
.properties {
  padding: var(--spacing-3xl) 0;
  background: var(--color-surface);
}

.properties__title {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.property-group {
  margin-bottom: var(--spacing-xl);
}

.property-group:last-of-type {
  margin-bottom: 0;
}

.property-group__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.property-group__buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
}

.property-button {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.property-button:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.property-button--hot { border-color: #dc2626; color: #dc2626; }
.property-button--hot:hover { background: #dc2626; border-color: #dc2626; color: white; }

.property-button--warm { border-color: #ea580c; color: #ea580c; }
.property-button--warm:hover { background: #ea580c; border-color: #ea580c; color: white; }

.property-button--neutral { border-color: var(--color-text); }
.property-button--neutral:hover { background: var(--color-text); color: white; }

.property-button--cool { border-color: #0891b2; color: #0891b2; }
.property-button--cool:hover { background: #0891b2; border-color: #0891b2; color: white; }

.property-button--cold { border-color: #2563eb; color: #2563eb; }
.property-button--cold:hover { background: #2563eb; border-color: #2563eb; color: white; }

.property-button--flavor { border-color: #92400e; color: #92400e; }
.property-button--flavor:hover { background: #fef3c7; border-color: #92400e; }

.property-button--action { border-color: #166534; color: #166534; }
.property-button--action:hover { background: #dcfce7; border-color: #166534; }

/* Statistics Section */
.statistics {
  padding: var(--spacing-2xl) 0;
  background: var(--color-background);
}

.statistics__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-card__number {
  display: block;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.stat-card__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* About Section */
.about {
  padding: var(--spacing-3xl) 0;
  background: linear-gradient(180deg, var(--color-background), var(--color-surface));
}

.about h2 {
  margin-bottom: var(--spacing-lg);
}

.about p {
  margin-bottom: var(--spacing-md);
}

.about__link {
  display: inline-block;
  margin-top: var(--spacing-md);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
</style>
