<template>
  <router-link :to="to" class="preparation-card">
    <div class="preparation-card__image-wrapper">
      <img
        v-if="image"
        :src="image"
        :alt="title"
        class="preparation-card__image"
        loading="lazy"
      />
      <div v-else class="preparation-card__placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <!-- System profile badges -->
      <div class="preparation-card__badges">
        <span v-if="hasTCM" class="preparation-card__badge preparation-card__badge--tcm">TCM</span>
        <span v-if="hasWestern" class="preparation-card__badge preparation-card__badge--western">W</span>
        <span v-if="hasAyurveda" class="preparation-card__badge preparation-card__badge--ayurveda">Ayu</span>
      </div>
    </div>
    <div class="preparation-card__content">
      <h3 class="preparation-card__title">{{ title }}</h3>
      <p v-if="commonName" class="preparation-card__common-name">{{ commonName }}</p>
      <p v-if="scientificName" class="preparation-card__scientific">{{ scientificName }}</p>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  to: { type: String, required: true },
  title: { type: String, required: true },
  commonName: { type: String, default: '' },
  scientificName: { type: String, default: '' },
  image: { type: String, default: '' },
  hasTCM: { type: Boolean, default: false },
  hasWestern: { type: Boolean, default: false },
  hasAyurveda: { type: Boolean, default: false }
})
</script>

<style scoped>
.preparation-card {
  display: block;
  text-decoration: none;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Only apply hover effects on devices that support hover (not touch) */
@media (hover: hover) and (pointer: fine) {
  .preparation-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }

  .preparation-card:hover .preparation-card__image {
    transform: scale(1.05);
  }
}

/* Active state for mobile tap feedback */
.preparation-card:active {
  transform: scale(0.98);
}

.preparation-card__image-wrapper {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-background);
}

.preparation-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.preparation-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
}

.preparation-card__placeholder svg {
  width: 48px;
  height: 48px;
}

.preparation-card__badges {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-xs);
}

.preparation-card__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.preparation-card__badge--tcm {
  background: rgba(34, 139, 34, 0.9);
  color: white;
}

.preparation-card__badge--western {
  background: rgba(59, 130, 246, 0.9);
  color: white;
}

.preparation-card__badge--ayurveda {
  background: rgba(249, 115, 22, 0.9);
  color: white;
}

.preparation-card__content {
  padding: var(--spacing-md);
}

.preparation-card__title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs);
}

.preparation-card__common-name {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
}

.preparation-card__scientific {
  font-size: var(--font-size-sm);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
}
</style>
