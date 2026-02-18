<template>
  <footer class="footer">
    <div class="container footer__container">
      <div class="footer__info">
        <p class="footer__copyright">
          &copy; {{ currentYear }} International Society of Phytomedicine (SIPM)
        </p>
        <p class="footer__disclaimer">
          Content is for informational purposes only. Always seek professional medical advice.
        </p>
      </div>
      <nav class="footer__nav">
        <router-link to="/about" class="footer__link">About</router-link>
        <a href="https://sipm.org" class="footer__link" target="_blank" rel="noopener">SIPM</a>
      </nav>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--color-primary-dark);
  color: var(--color-text-inverse);
  padding: var(--spacing-2xl) 0;
  margin-top: auto;
}

.footer__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.footer__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.footer__copyright {
  font-size: var(--font-size-sm);
  margin: 0;
}

.footer__disclaimer {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse);
  opacity: 0.7;
  margin: 0;
}

.footer__nav {
  display: flex;
  gap: var(--spacing-lg);
}

.footer__link {
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  transition: opacity var(--transition-fast);
}

.footer__link:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .footer__container {
    flex-direction: column;
    text-align: center;
  }
}
</style>
