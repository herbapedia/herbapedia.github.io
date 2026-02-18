<template>
  <div class="about-view">
    <div class="container container-narrow">
      <GlassCard padding="xl">
        <h1>{{ t('about.title') }}</h1>

        <section class="about-section">
          <h2>{{ t('about.mission.title') }}</h2>
          <p>{{ t('about.mission.text') }}</p>
        </section>

        <section class="about-section">
          <h2>{{ t('about.history.title') }}</h2>
          <p>{{ t('about.history.p1') }}</p>
          <p>{{ t('about.history.p2') }}</p>
          <p>{{ t('about.history.p3') }}</p>
        </section>

        <section class="about-section">
          <h2>{{ t('about.content.title') }}</h2>
          <p>{{ t('about.content.intro') }}</p>
          <ul>
            <li><strong>{{ t('categories.chineseHerbs') }}</strong> - {{ t('about.content.chineseHerbs') }}</li>
            <li><strong>{{ t('categories.westernHerbs') }}</strong> - {{ t('about.content.westernHerbs') }}</li>
            <li><strong>{{ t('categories.vitamins') }}</strong> - {{ t('about.content.vitamins') }}</li>
            <li><strong>{{ t('categories.minerals') }}</strong> - {{ t('about.content.minerals') }}</li>
            <li><strong>{{ t('categories.nutrients') }}</strong> - {{ t('about.content.nutrients') }}</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>{{ t('about.approach.title') }}</h2>
          <p>{{ t('about.approach.text') }}</p>
        </section>

        <section class="about-section">
          <h2>{{ t('disclaimer.title') }}</h2>
          <p>{{ t('disclaimer.text') }}</p>
        </section>

        <section class="about-section">
          <h2>{{ t('about.sipm.title') }}</h2>
          <p>{{ t('about.sipm.text') }}</p>
          <p>
            <a href="https://sipm.org" target="_blank" rel="noopener">
              {{ t('about.sipm.link') }} &rarr;
            </a>
          </p>
        </section>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import GlassCard from '@/components/ui/GlassCard.vue'

const { t } = useI18n()
</script>

<style scoped>
.about-view {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - var(--header-height));
}

.about-section {
  margin-bottom: var(--spacing-xl);
}

.about-section:last-child {
  margin-bottom: 0;
}

.about-section h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
}

.about-section p {
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.about-section p:last-child {
  margin-bottom: 0;
}

.about-section ul {
  list-style: none;
  padding-left: 0;
}

.about-section li {
  margin-bottom: var(--spacing-sm);
  padding-left: var(--spacing-lg);
  position: relative;
}

.about-section li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  border-radius: 50%;
}

.about-section a {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
</style>
