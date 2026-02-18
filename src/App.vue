<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <router-view />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
