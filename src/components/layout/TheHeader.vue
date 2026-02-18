<template>
  <header class="header">
    <div class="container header__container">
      <a href="/" class="header__logo">
        <span class="header__logo-text">Herbapedia</span>
        <span class="header__logo-tagline">SIPM</span>
      </a>

      <nav class="header__nav" :class="{ 'header__nav--open': mobileMenuOpen }">
        <router-link to="/" class="header__link" @click="closeMobileMenu">Home</router-link>
        <router-link to="/herbs" class="header__link" @click="closeMobileMenu">Herbs</router-link>
        <router-link to="/about" class="header__link" @click="closeMobileMenu">About</router-link>
      </nav>

      <button class="header__menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(var(--blur-amount));
  -webkit-backdrop-filter: blur(var(--blur-amount));
  border-bottom: 1px solid var(--color-border);
  height: var(--header-height);
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header__logo {
  display: flex;
  flex-direction: column;
  text-decoration: none;
}

.header__logo-text {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.header__logo-tagline {
  font-size: var(--font-size-xs);
  color: var(--color-accent-dark);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.header__nav {
  display: flex;
  gap: var(--spacing-xl);
}

.header__link {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  transition: color var(--transition-fast);
  padding: var(--spacing-sm) 0;
  border-bottom: 2px solid transparent;
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-accent);
}

.header__menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  cursor: pointer;
}

.header__menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  transition: all var(--transition-fast);
}

@media (max-width: 768px) {
  .header__menu-toggle {
    display: flex;
  }

  .header__nav {
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-surface);
    padding: var(--spacing-lg);
    gap: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
  }

  .header__nav--open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}
</style>
