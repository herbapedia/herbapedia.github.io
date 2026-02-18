<template>
  <div class="layout">
    <TheHeader />
    <main class="layout__main">
      <router-view :key="$route.fullPath" />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

const route = useRoute()
const { locale } = useI18n()

// Sync locale from route meta
watch(
  () => route.meta?.locale,
  (newLocale) => {
    if (newLocale && locale.value !== newLocale) {
      locale.value = newLocale
    }
  },
  { immediate: true }
)

onMounted(() => {
  // Set initial locale from route
  if (route.meta?.locale) {
    locale.value = route.meta.locale
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__main {
  flex: 1;
  background: var(--color-background);
}
</style>
