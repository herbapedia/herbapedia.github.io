<template>
  <div class="glass-card" :class="cardClasses">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hoverable: {
    type: Boolean,
    default: false
  },
  padding: {
    type: String,
    default: 'xl',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined'].includes(value)
  }
})

const cardClasses = computed(() => [
  `glass-card--padding-${props.padding}`,
  `glass-card--${props.variant}`,
  { 'glass-card--hoverable': props.hoverable }
])
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass);
  transition: all var(--transition-normal);
}

.glass-card--padding-none { padding: 0; }
.glass-card--padding-sm { padding: var(--spacing-sm); }
.glass-card--padding-md { padding: var(--spacing-md); }
.glass-card--padding-lg { padding: var(--spacing-lg); }
.glass-card--padding-xl { padding: var(--spacing-xl); }

.glass-card--elevated {
  box-shadow: var(--shadow-xl);
}

.glass-card--outlined {
  background: transparent;
  box-shadow: none;
}

.glass-card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
