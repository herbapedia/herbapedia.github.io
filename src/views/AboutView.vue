<template>
  <div class="about-view">
    <div class="container container-narrow">
      <GlassCard padding="xl">
        <h1>{{ t('about.title') }}</h1>

        <section class="about-section">
          <h2>{{ t('about.mission.title') }}</h2>
          <p>{{ t('about.mission.text') }}</p>
        </section>

        <section class="about-section">
          <h2>{{ t('about.history.title') }}</h2>
          <p>{{ t('about.history.p1') }}</p>
          <p>{{ t('about.history.p2') }}</p>
          <p>{{ t('about.history.p3') }}</p>
        </section>

        <section class="about-section">
          <h2>{{ t('about.content.title') }}</h2>
          <p>{{ t('about.content.intro') }}</p>
          <ul>
            <li><strong>{{ t('categories.chineseHerbs') }}</strong> - {{ t('about.content.chineseHerbs') }}</li>
            <li><strong>{{ t('categories.westernHerbs') }}</strong> - {{ t('about.content.westernHerbs') }}</li>
            <li><strong>{{ t('categories.vitamins') }}</strong> - {{ t('about.content.vitamins') }}</li>
            <li><strong>{{ t('categories.minerals') }}</strong> - {{ t('about.content.minerals') }}</li>
            <li><strong>{{ t('categories.nutrients') }}</strong> - {{ t('about.content.nutrients') }}</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>{{ t('about.approach.title') }}</h2>
          <p>{{ t('about.approach.text') }}</p>
        </section>

        <!-- Ontology Documentation -->
        <section class="about-section">
          <h2>{{ t('about.ontology.title') }}</h2>
          <p>{{ t('about.ontology.intro') }}</p>

          <h3>{{ t('about.ontology.coreEntity') }}</h3>
          <p>{{ t('about.ontology.coreEntityDesc') }}</p>

          <h3>{{ t('about.ontology.sourceMaterials') }}</h3>
          <p>{{ t('about.ontology.sourceMaterialsDesc') }}</p>
          <ul class="ontology-list">
            <li><code>botany:PlantSpecies</code> - {{ t('about.ontology.sourcePlant') }}</li>
            <li><code>herbapedia:ZoologicalSource</code> - {{ t('about.ontology.sourceAnimal') }}</li>
            <li><code>herbapedia:MineralSource</code> - {{ t('about.ontology.sourceMineral') }}</li>
            <li><code>herbapedia:ChemicalSource</code> - {{ t('about.ontology.sourceChemical') }}</li>
          </ul>

          <h3>{{ t('about.ontology.profiles') }}</h3>
          <p>{{ t('about.ontology.profilesDesc') }}</p>
          <ul class="ontology-list">
            <li><code>tcm:TCMProfile</code> - {{ t('about.ontology.profileTCM') }}</li>
            <li><code>western:WesternHerbalProfile</code> - {{ t('about.ontology.profileWestern') }}</li>
            <li><code>ayurveda:AyurvedaProfile</code> - {{ t('about.ontology.profileAyurveda') }}</li>
            <li><code>persian:PersianProfile</code> - {{ t('about.ontology.profilePersian') }}</li>
            <li><code>mongolian:MongolianProfile</code> - {{ t('about.ontology.profileMongolian') }}</li>
          </ul>

          <h3>{{ t('about.ontology.referenceData') }}</h3>
          <p>{{ t('about.ontology.referenceDataDesc') }}</p>
          <ul class="ontology-list">
            <li><strong>TCM:</strong> <code>tcm:Meridian</code>, <code>tcm:Nature</code>, <code>tcm:Flavor</code>, <code>tcm:Category</code></li>
            <li><strong>Western:</strong> <code>western:Action</code>, <code>western:Organ</code>, <code>western:System</code></li>
            <li><strong>Ayurveda:</strong> <code>ayurveda:Rasa</code>, <code>ayurveda:Guna</code>, <code>ayurveda:Virya</code>, <code>ayurveda:Vipaka</code></li>
            <li><strong>Persian:</strong> <code>persian:Temperament</code>, <code>persian:Element</code></li>
            <li><strong>Mongolian:</strong> <code>mongolian:Element</code>, <code>mongolian:Root</code>, <code>mongolian:Taste</code></li>
          </ul>

          <h3>{{ t('about.ontology.relationships') }}</h3>
          <p>{{ t('about.ontology.relationshipsDesc') }}</p>
          <div class="code-block">
            <pre><code>HerbalPreparation
├── derivedFrom → SourceMaterial (PlantSpecies | ZoologicalSource | ...)
├── hasTCMProfile → TCMProfile
│   ├── hasNature → tcm:Nature
│   ├── hasFlavor → tcm:Flavor[]
│   ├── entersMeridian → tcm:Meridian[]
│   └── hasCategory → tcm:Category
├── hasWesternProfile → WesternHerbalProfile
│   ├── hasAction → western:Action[]
│   └── hasOrganAffinity → western:Organ[]
├── hasAyurvedaProfile → AyurvedaProfile
│   ├── hasRasa → ayurveda:Rasa[]
│   ├── hasGuna → ayurveda:Guna[]
│   ├── hasVirya → ayurveda:Virya
│   └── hasVipaka → ayurveda:Vipaka
├── hasPersianProfile → PersianProfile
│   └── hasTemperament → persian:Temperament
└── hasMongolianProfile → MongolianProfile
    ├── hasElement → mongolian:Element[]
    └── hasTaste → mongolian:Taste[]</code></pre>
          </div>

          <h3>{{ t('about.ontology.i18n') }}</h3>
          <p>{{ t('about.ontology.i18nDesc') }}</p>
          <div class="code-block">
            <pre><code>{
  "@id": "meridian/lung",
  "prefLabel": {
    "en": "Lung Meridian",
    "zh-Hant": "肺經",
    "zh-Hans": "肺经"
  }
}</code></pre>
          </div>

          <h3>{{ t('about.ontology.serialization') }}</h3>
          <p>{{ t('about.ontology.serializationDesc') }}</p>
        </section>

        <section class="about-section">
          <h2>{{ t('disclaimer.title') }}</h2>
          <p>{{ t('disclaimer.text') }}</p>
        </section>

        <section class="about-section">
          <h2>{{ t('about.sipm.title') }}</h2>
          <p>{{ t('about.sipm.text') }}</p>
          <p>
            <a href="https://sipm.org" target="_blank" rel="noopener">
              {{ t('about.sipm.link') }} &rarr;
            </a>
          </p>
        </section>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import GlassCard from '@/components/ui/GlassCard.vue'

const { t } = useI18n()
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

.about-section h3 {
  font-size: var(--font-size-lg);
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  color: var(--color-accent-dark);
}

.about-section p {
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.about-section p:last-child {
  margin-bottom: 0;
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

.ontology-list {
  background: var(--color-surface-alt);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin: var(--spacing-md) 0;
}

.ontology-list li {
  padding-left: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.ontology-list li::before {
  display: none;
}

.ontology-list code {
  background: var(--color-primary);
  color: white;
  padding: 0.1em 0.4em;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
}

.code-block {
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  overflow-x: auto;
  margin: var(--spacing-md) 0;
}

.code-block pre {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.code-block code {
  color: var(--color-text);
}
</style>
