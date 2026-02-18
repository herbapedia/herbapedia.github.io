<template>
  <div class="not-found-view">
    <div class="container container-narrow">
      <GlassCard padding="xl">
        <div class="not-found__content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <router-link to="/" class="not-found__link">
            &larr; Return to Home
          </router-link>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import GlassCard from '@/components/ui/GlassCard.vue'
</script>

<style scoped>
.not-found-view {
  padding: var(--spacing-3xl) 0;
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
}

.not-found__content {
  text-align: center;
}

.not-found__content h1 {
  font-size: 6rem;
  color: var(--color-accent);
  margin-bottom: 0;
  line-height: 1;
}

.not-found__content h2 {
  margin-bottom: var(--spacing-md);
}

.not-found__content p {
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
}

.not-found__link {
  display: inline-block;
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
</style>
