<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <TheHeader />
    <main id="main-content">
      <router-view />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
