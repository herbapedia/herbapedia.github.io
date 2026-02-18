<template>
  <div class="about-view">
    <div class="container container-narrow">
      <GlassCard padding="xl">
        <h1>About Herbapedia</h1>

        <section class="about-section">
          <h2>Mission</h2>
          <p>
            Herbapedia is a comprehensive encyclopedia developed by the International Society
            of Phytomedicine (SIPM) to provide accurate, evidence-based information about
            medicinal plants and natural health supplements.
          </p>
        </section>

        <section class="about-section">
          <h2>Our Content</h2>
          <p>
            Our database covers five main categories:
          </p>
          <ul>
            <li><strong>Chinese Herbs</strong> - Traditional Chinese medicinal plants and fungi</li>
            <li><strong>Western Herbs</strong> - European and North American herbal medicines</li>
            <li><strong>Vitamins</strong> - Essential vitamins for human health</li>
            <li><strong>Minerals</strong> - Important dietary minerals and trace elements</li>
            <li><strong>Nutrients</strong> - Beneficial compounds and supplements</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>Approach</h2>
          <p>
            We bridge traditional wisdom with modern scientific research. Each entry combines
            historical and traditional uses with contemporary scientific findings, providing
            a balanced perspective on natural health remedies.
          </p>
        </section>

        <section class="about-section">
          <h2>Disclaimer</h2>
          <p>
            The content provided in Herbapedia is for informational purposes only and is not
            intended to be a substitute for professional medical advice, diagnosis, or treatment.
            Always seek the advice of your physician or other qualified health provider with
            any questions you may have regarding a medical condition.
          </p>
        </section>

        <section class="about-section">
          <h2>About SIPM</h2>
          <p>
            The International Society of Phytomedicine (SIPM) is dedicated to advancing the
            scientific understanding and responsible use of medicinal plants worldwide.
          </p>
          <p>
            <a href="https://sipm.org" target="_blank" rel="noopener">
              Visit SIPM website &rarr;
            </a>
          </p>
        </section>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import GlassCard from '@/components/ui/GlassCard.vue'
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
