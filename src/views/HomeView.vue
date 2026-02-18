<template>
  <div class="home-view">
    <section class="hero">
      <div class="container hero__container">
        <div class="hero__content">
          <h1 class="hero__title">Herbapedia</h1>
          <p class="hero__subtitle">Medicinal Plants Encyclopedia</p>
          <p class="hero__description">
            A comprehensive resource of medicinal plants, herbs, vitamins, minerals, and nutrients
            - bridging traditional wisdom with modern scientific research.
          </p>
          <router-link to="/herbs" class="hero__cta">
            Explore Herbs
          </router-link>
        </div>
      </div>
    </section>

    <section class="categories">
      <div class="container">
        <h2 class="categories__title">Categories</h2>
        <div class="categories__grid">
          <GlassCard
            v-for="category in categories"
            :key="category.slug"
            hoverable
            padding="lg"
            class="categories__card"
          >
            <router-link :to="`/herbs/${category.slug}`" class="category-card">
              <div class="category-card__icon" v-html="category.icon"></div>
              <h3 class="category-card__title">{{ category.title }}</h3>
              <p class="category-card__count">{{ category.count }} items</p>
            </router-link>
          </GlassCard>
        </div>
      </div>
    </section>

    <section class="about">
      <div class="container container-narrow">
        <GlassCard padding="xl">
          <h2>About Herbapedia</h2>
          <p>
            Herbapedia is a comprehensive encyclopedia developed by the International Society
            of Phytomedicine (SIPM) to provide accurate, evidence-based information about
            medicinal plants and natural health supplements.
          </p>
          <p>
            Our database includes traditional Chinese herbs, Western herbal medicines,
            vitamins, minerals, and essential nutrients - combining ancient wisdom with
            modern scientific research.
          </p>
          <router-link to="/about" class="about__link">Learn more about SIPM</router-link>
        </GlassCard>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'

const categories = ref([
  {
    slug: 'chinese-herbs',
    title: 'Chinese Herbs',
    count: 98,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/></svg>'
  },
  {
    slug: 'western-herbs',
    title: 'Western Herbs',
    count: 31,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  },
  {
    slug: 'vitamins',
    title: 'Vitamins',
    count: 13,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3L2 12h3v9h14v-9h3L12 3z"/></svg>'
  },
  {
    slug: 'minerals',
    title: 'Minerals',
    count: 9,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
  },
  {
    slug: 'nutrients',
    title: 'Nutrients',
    count: 28,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
  }
])
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  color: var(--color-text-inverse);
  padding: var(--spacing-3xl) 0;
}

.hero__container {
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

/* Categories Section */
.categories {
  padding: var(--spacing-3xl) 0;
  background: var(--color-background);
}

.categories__title {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  display: block;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.category-card__icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--spacing-md);
  color: var(--color-primary);
}

.category-card__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.category-card__title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
}

.category-card__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
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
