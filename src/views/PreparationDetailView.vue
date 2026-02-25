<template>
  <div class="preparation-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/preparations')">{{ t('nav.preparations') || 'Preparations' }}</router-link>
        <span>/</span>
        <span>{{ prepTitle }}</span>
      </nav>

      <article v-if="preparation" class="preparation-detail">
        <!-- Header -->
        <header class="preparation-detail__header">
          <div class="preparation-detail__image-wrapper">
            <img
              v-if="displayImage"
              :src="displayImage"
              :alt="prepTitle"
              class="preparation-detail__image"
              @error="handleImageError"
            />
            <div v-else class="preparation-detail__placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span class="preparation-detail__placeholder-text">{{ t('plants.noImage') }}</span>
            </div>
            <!-- Image Attribution -->
            <div v-if="imageAttribution && displayImage" class="preparation-detail__attribution">
              <span v-if="imageAttribution.spdxId && imageAttribution.spdxId !== 'NONE'" class="attribution-license">
                <a v-if="imageAttribution.spdxUrl" :href="imageAttribution.spdxUrl" target="_blank" rel="noopener noreferrer">
                  {{ imageAttribution.spdxId }}
                </a>
                <span v-else>{{ imageAttribution.spdxId }}</span>
              </span>
              <span class="attribution-source">{{ imageAttribution.copyright }}</span>
            </div>
          </div>

          <div class="preparation-detail__meta">
            <!-- Profile badges -->
            <div class="preparation-detail__badges">
              <span v-if="profiles?.tcm" class="preparation-detail__badge preparation-detail__badge--tcm">TCM</span>
              <span v-if="profiles?.western" class="preparation-detail__badge preparation-detail__badge--western">Western</span>
              <span v-if="profiles?.ayurveda" class="preparation-detail__badge preparation-detail__badge--ayurveda">Ayurveda</span>
              <span v-if="profiles?.persian" class="preparation-detail__badge preparation-detail__badge--persian">Persian</span>
              <span v-if="profiles?.mongolian" class="preparation-detail__badge preparation-detail__badge--mongolian">Mongolian</span>
            </div>
            <h1 class="preparation-detail__title">{{ prepTitle }}</h1>
            <p v-if="prepCommonName" class="preparation-detail__common-name">{{ prepCommonName }}</p>
            <p v-if="sourcePlant?.scientificName" class="preparation-detail__scientific">
              {{ sourcePlant.scientificName }}
            </p>
            <div v-if="prepForm || prepMethod" class="preparation-detail__form-method">
              <span v-if="prepForm" class="prep-form-badge">{{ prepForm }}</span>
              <span v-if="prepMethod" class="prep-method-badge">{{ prepMethod }}</span>
            </div>
          </div>
        </header>

        <!-- Botanical Source Section -->
        <section v-if="sourcePlant" class="preparation-detail__section preparation-detail__source">
          <h2 class="section-title">
            <span class="section-title__icon">↑</span>
            {{ t('preparations.botanicalSource') }}
          </h2>
          <div class="botanical-source">
            <div class="botanical-source__info">
              <div class="botanical-source__row">
                <span class="botanical-source__label">{{ t('preparations.scientificName') }}</span>
                <router-link
                  :to="localePath(`/sources/botanical/${plantSlug}`)"
                  class="botanical-source__value botanical-source__value--scientific botanical-source__link--inline"
                >
                  {{ sourcePlant.scientificName }}
                </router-link>
              </div>
              <div v-if="sourcePlant.family || sourcePlant.genus" class="botanical-source__row">
                <span class="botanical-source__label">{{ t('preparations.family') }} / {{ t('preparations.genus') }}</span>
                <span class="botanical-source__value">{{ sourcePlant.family }} {{ sourcePlant.genus ? `| ${sourcePlant.genus}` : '' }}</span>
              </div>
            </div>

            <!-- View Plant Link -->
            <div class="botanical-source__plant-link">
              <router-link
                :to="localePath(`/sources/botanical/${plantSlug}`)"
                class="plant-link-card"
              >
                <div class="plant-link-card__icon">🌿</div>
                <div class="plant-link-card__content">
                  <span class="plant-link-card__title">{{ t('preparations.viewPlantProfile') }}</span>
                  <span class="plant-link-card__subtitle">
                    {{ t('preparations.preparationsFromPlant', { count: plantPreparationCount }) }}
                  </span>
                </div>
                <span class="plant-link-card__arrow">→</span>
              </router-link>
            </div>

            <!-- External Links -->
            <div v-if="hasExternalLinks" class="botanical-source__links">
              <a
                v-for="link in externalLinks"
                :key="link.url"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="botanical-source__link"
              >
                <span class="botanical-source__link-icon">{{ link.icon }}</span>
                {{ link.label }}
                <span class="botanical-source__link-arrow">↗</span>
              </a>
            </div>

            <!-- Chemical Compounds -->
            <div v-if="chemicalCompoundLabels.length > 0" class="botanical-source__compounds">
              <h4 class="botanical-source__compounds-title">{{ t('compounds.title') }}</h4>
              <div class="botanical-source__compounds-list">
                <span
                  v-for="compound in chemicalCompoundLabels"
                  :key="compound.id"
                  class="compound-tag"
                  :title="compound.description"
                >
                  {{ compound.label }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- System Profiles Section -->
        <section class="preparation-detail__section preparation-detail__profiles">
          <h2 class="section-title">
            <span class="section-title__icon">↓</span>
            {{ t('preparations.systemProfiles') }}
          </h2>

          <!-- Profile Tabs -->
          <div class="profile-tabs">
            <button
              v-if="profiles?.tcm"
              class="profile-tab"
              :class="{ 'profile-tab--active': activeProfile === 'tcm' }"
              @click="activeProfile = 'tcm'"
            >
              {{ t('preparations.tcm') }}
            </button>
            <button
              v-if="profiles?.western"
              class="profile-tab"
              :class="{ 'profile-tab--active': activeProfile === 'western' }"
              @click="activeProfile = 'western'"
            >
              {{ t('preparations.western') }}
            </button>
            <button
              v-if="profiles?.ayurveda"
              class="profile-tab"
              :class="{ 'profile-tab--active': activeProfile === 'ayurveda' }"
              @click="activeProfile = 'ayurveda'"
            >
              {{ t('preparations.ayurveda') }}
            </button>
            <button
              v-if="profiles?.persian"
              class="profile-tab"
              :class="{ 'profile-tab--active': activeProfile === 'persian' }"
              @click="activeProfile = 'persian'"
            >
              {{ t('preparations.persian') }}
            </button>
            <button
              v-if="profiles?.mongolian"
              class="profile-tab"
              :class="{ 'profile-tab--active': activeProfile === 'mongolian' }"
              @click="activeProfile = 'mongolian'"
            >
              {{ t('preparations.mongolian') }}
            </button>
          </div>

          <!-- TCM Profile Content -->
          <div v-if="activeProfile === 'tcm' && profiles?.tcm" class="profile-content">
            <!-- TCM Properties -->
            <div class="tcm-properties">
              <div v-if="natureLabel" class="tcm-property">
                <span class="tcm-property__label">{{ t('tcm.nature') }}</span>
                <span class="tcm-property__value" :class="natureClass">{{ natureLabel }}</span>
              </div>
              <div v-if="flavorLabels.length > 0" class="tcm-property">
                <span class="tcm-property__label">{{ t('tcm.flavor') }}</span>
                <div class="tcm-property__tags">
                  <span v-for="flavor in flavorLabels" :key="flavor.id" class="tcm-tag tcm-tag--flavor">
                    {{ flavor.label }}
                  </span>
                </div>
              </div>
              <div v-if="meridianLabels.length > 0" class="tcm-property">
                <span class="tcm-property__label">{{ t('tcm.meridian') }}</span>
                <div class="tcm-property__tags">
                  <span v-for="meridian in meridianLabels" :key="meridian.id" class="tcm-tag tcm-tag--meridian">
                    {{ meridian.label }}
                  </span>
                </div>
              </div>
              <div v-if="categoryLabel" class="tcm-property">
                <span class="tcm-property__label">{{ t('tcm.category') }}</span>
                <span class="tcm-property__value">{{ categoryLabel }}</span>
              </div>
              <div v-if="profiles.tcm.pinyin" class="tcm-property">
                <span class="tcm-property__label">{{ t('tcm.pinyin') }}</span>
                <span class="tcm-property__value tcm-property__value--italic">{{ profiles.tcm.pinyin }}</span>
              </div>
            </div>

            <!-- TCM Content Sections -->
            <div v-if="tcmHistory" class="profile-section">
              <h3>{{ t('sections.history') }}</h3>
              <p>{{ tcmHistory }}</p>
            </div>
            <div v-if="tcmTraditionalUsage" class="profile-section">
              <h3>{{ t('sections.traditionalUsage') }}</h3>
              <p style="white-space: pre-line;">{{ tcmTraditionalUsage }}</p>
            </div>
            <div v-if="tcmFunctions" class="profile-section">
              <h3>{{ t('sections.functions') }}</h3>
              <p style="white-space: pre-line;">{{ tcmFunctions }}</p>
            </div>
            <div v-if="profiles.tcm.indications?.length" class="profile-section">
              <h3>{{ t('sections.indications') }}</h3>
              <ul class="profile-list">
                <li v-for="(indication, index) in profiles.tcm.indications" :key="index">{{ indication }}</li>
              </ul>
            </div>
            <div v-if="tcmModernResearch" class="profile-section">
              <h3>{{ t('sections.modernResearch') }}</h3>
              <p style="white-space: pre-line;">{{ tcmModernResearch }}</p>
            </div>
            <div v-if="tcmContraindications" class="profile-section profile-section--warning">
              <h3>{{ t('sections.contraindications') }}</h3>
              <p>{{ tcmContraindications }}</p>
            </div>
            <div v-if="tcmIncompatibilities" class="profile-section profile-section--warning">
              <h3>{{ t('preparations.incompatibilities') }}</h3>
              <p>{{ tcmIncompatibilities }}</p>
            </div>
            <div v-if="tcmDosage" class="profile-section">
              <h3>{{ t('sections.dosage') }}</h3>
              <p>{{ tcmDosage }}</p>
            </div>

            <!-- TCM Classical References -->
            <div v-if="tcmClassicalReferences.length > 0" class="profile-section profile-section--classical">
              <h3>{{ t('sections.classicalReference') }}</h3>
              <div class="classical-references">
                <div v-for="(ref, index) in tcmClassicalReferences" :key="index" class="classical-reference">
                  <div class="classical-reference__header">
                    <span class="classical-reference__text">{{ ref.text }}</span>
                    <span v-if="ref.reference" class="classical-reference__section">{{ ref.reference }}</span>
                  </div>
                  <p v-if="ref.quote" class="classical-reference__quote">{{ ref.quote }}</p>
                </div>
              </div>
            </div>

            <!-- TCM Dosage Effects -->
            <div v-if="tcmDosageEffect" class="profile-section">
              <h3>{{ t('preparations.dosageEffect') }}</h3>
              <div class="dosage-effects">
                <div v-if="tcmDosageEffect.small" class="dosage-effect dosage-effect--small">
                  <span class="dosage-effect__dose">{{ t('preparations.smallDose') }}</span>
                  <span class="dosage-effect__effect">{{ tcmDosageEffect.small.effect }}</span>
                </div>
                <div v-if="tcmDosageEffect.medium" class="dosage-effect dosage-effect--medium">
                  <span class="dosage-effect__dose">{{ t('preparations.mediumDose') }}</span>
                  <span class="dosage-effect__effect">{{ tcmDosageEffect.medium.effect }}</span>
                </div>
                <div v-if="tcmDosageEffect.large" class="dosage-effect dosage-effect--large">
                  <span class="dosage-effect__dose">{{ t('preparations.largeDose') }}</span>
                  <span class="dosage-effect__effect">{{ tcmDosageEffect.large.effect }}</span>
                </div>
              </div>
            </div>

            <!-- TCM Comparison Notes -->
            <div v-if="tcmComparisonNotes" class="profile-section">
              <h3>{{ t('preparations.comparisonNotes') }}</h3>
              <p>{{ tcmComparisonNotes }}</p>
            </div>
          </div>

          <!-- Western Profile Content -->
          <div v-if="activeProfile === 'western' && profiles?.western" class="profile-content">
            <!-- Western Properties -->
            <div class="western-properties">
              <div v-if="actionLabels.length > 0" class="western-property">
                <span class="western-property__label">{{ t('western.actions') }}</span>
                <div class="western-property__tags">
                  <span v-for="action in actionLabels" :key="action.id" class="western-tag western-tag--action">
                    {{ action.label }}
                  </span>
                </div>
              </div>
              <div v-if="organLabels.length > 0" class="western-property">
                <span class="western-property__label">{{ t('western.organAffinities') }}</span>
                <div class="western-property__tags">
                  <span v-for="organ in organLabels" :key="organ.id" class="western-tag western-tag--organ">
                    {{ organ.label }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Western Content Sections -->
            <div v-if="westernHistory" class="profile-section">
              <h3>{{ t('sections.history') }}</h3>
              <p>{{ westernHistory }}</p>
            </div>
            <div v-if="westernTraditionalUsage" class="profile-section">
              <h3>{{ t('sections.traditionalUsage') }}</h3>
              <p style="white-space: pre-line;">{{ westernTraditionalUsage }}</p>
            </div>
            <div v-if="westernModernResearch" class="profile-section">
              <h3>{{ t('sections.modernResearch') }}</h3>
              <p style="white-space: pre-line;">{{ westernModernResearch }}</p>
            </div>
          </div>

          <!-- Ayurveda Profile Content -->
          <div v-if="activeProfile === 'ayurveda' && profiles?.ayurveda" class="profile-content">
            <!-- Ayurveda Properties -->
            <div class="ayurveda-properties">
              <div v-if="profiles.ayurveda.sanskritTransliteration" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.sanskrit') }}</span>
                <span class="ayurveda-property__value ayurveda-property__value--italic">{{ profiles.ayurveda.sanskritTransliteration }}</span>
              </div>
              <div v-if="profiles.ayurveda.hindiName" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.hindiName') }}</span>
                <span class="ayurveda-property__value">{{ profiles.ayurveda.hindiName }}</span>
              </div>
              <div v-if="ayurvedaCategoryLabel" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.category') }}</span>
                <span class="ayurveda-property__value">{{ ayurvedaCategoryLabel }}</span>
              </div>
              <div v-if="rasaLabels.length > 0" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.rasa') }}</span>
                <div class="ayurveda-property__tags">
                  <span v-for="rasa in rasaLabels" :key="rasa.id" class="ayurveda-tag ayurveda-tag--rasa">
                    {{ rasa.label }}
                  </span>
                </div>
              </div>
              <div v-if="gunaLabels.length > 0" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.guna') }}</span>
                <div class="ayurveda-property__tags">
                  <span v-for="guna in gunaLabels" :key="guna.id" class="ayurveda-tag ayurveda-tag--guna">
                    {{ guna.label }}
                  </span>
                </div>
              </div>
              <div v-if="viryaLabel" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.virya') }}</span>
                <span class="ayurveda-property__value" :class="viryaClass">{{ viryaLabel }}</span>
              </div>
              <div v-if="vipakaLabel" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.vipaka') }}</span>
                <span class="ayurveda-property__value">{{ vipakaLabel }}</span>
              </div>
              <div v-if="profiles.ayurveda.affectsDosha" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.dosha') }}</span>
                <div class="dosha-effects">
                  <span v-if="profiles.ayurveda.affectsDosha.vata" class="dosha-tag dosha-tag--vata">
                    Vata {{ profiles.ayurveda.affectsDosha.vata.effect === 'decreases' ? '↓' : '↑' }}
                  </span>
                  <span v-if="profiles.ayurveda.affectsDosha.pitta" class="dosha-tag dosha-tag--pitta">
                    Pitta {{ profiles.ayurveda.affectsDosha.pitta.effect === 'decreases' ? '↓' : '↑' }}
                  </span>
                  <span v-if="profiles.ayurveda.affectsDosha.kapha" class="dosha-tag dosha-tag--kapha">
                    Kapha {{ profiles.ayurveda.affectsDosha.kapha.effect === 'decreases' ? '↓' : '↑' }}
                  </span>
                </div>
              </div>
              <div v-if="profiles.ayurveda.karma?.length" class="ayurveda-property">
                <span class="ayurveda-property__label">{{ t('ayurveda.karma') }}</span>
                <div class="ayurveda-property__tags">
                  <span v-for="(k, index) in profiles.ayurveda.karma.slice(0, 5)" :key="index" class="ayurveda-tag ayurveda-tag--karma">
                    {{ k }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Ayurveda Content Sections -->
            <div v-if="ayurvedaTraditionalUsage" class="profile-section">
              <h3>{{ t('sections.traditionalUsage') }}</h3>
              <p style="white-space: pre-line;">{{ ayurvedaTraditionalUsage }}</p>
            </div>
            <div v-if="profiles.ayurveda.indications?.length" class="profile-section">
              <h3>{{ t('sections.indications') }}</h3>
              <ul class="profile-list">
                <li v-for="(indication, index) in profiles.ayurveda.indications" :key="index">{{ indication }}</li>
              </ul>
            </div>

            <!-- Ayurveda Classical References -->
            <div v-if="ayurvedaClassicalReferences.length > 0" class="profile-section profile-section--classical">
              <h3>{{ t('sections.classicalReference') }}</h3>
              <div class="classical-references">
                <div v-for="(ref, index) in ayurvedaClassicalReferences" :key="index" class="classical-reference">
                  <div class="classical-reference__header">
                    <span class="classical-reference__text">{{ ref.text }}</span>
                    <span v-if="ref.reference" class="classical-reference__section">{{ ref.reference }}</span>
                  </div>
                  <p v-if="ref.quote" class="classical-reference__quote">{{ ref.quote }}</p>
                </div>
              </div>
            </div>

            <!-- Ayurveda Anupana (Vehicle/Carrier) -->
            <div v-if="ayurvedaAnupana.length > 0" class="profile-section">
              <h3>{{ t('ayurveda.anupana') }}</h3>
              <div class="ayurveda-anupana">
                <span v-for="(item, index) in ayurvedaAnupana" :key="index" class="anupana-tag">
                  {{ item }}
                </span>
              </div>
              <p class="profile-section__hint">{{ t('ayurveda.anupanaDesc') }}</p>
            </div>

            <!-- Ayurveda Sevana Kala (Timing of Administration) -->
            <div v-if="ayurvedaSevanaKala" class="profile-section">
              <h3>{{ t('ayurveda.sevanaKala') }}</h3>
              <div class="sevana-kala">
                <span class="sevana-kala__value">{{ ayurvedaSevanaKalaLabel }}</span>
              </div>
              <p v-if="ayurvedaSevanaKalaDesc" class="profile-section__hint">{{ ayurvedaSevanaKalaDesc }}</p>
            </div>

            <!-- Ayurveda Formulations -->
            <div v-if="ayurvedaFormulations.length > 0" class="profile-section">
              <h3>{{ t('ayurveda.formulations') }}</h3>
              <div class="formulations-list">
                <div v-for="(formula, index) in ayurvedaFormulations" :key="index" class="formulation-card">
                  <h4 class="formulation-card__name">{{ formula.name }}</h4>
                  <p v-if="formula.description" class="formulation-card__desc">{{ formula.description }}</p>
                  <div v-if="formula.ingredients?.length" class="formulation-card__ingredients">
                    <span class="formulation-card__label">{{ t('formulas.ingredients') }}:</span>
                    <span v-for="(ing, i) in formula.ingredients" :key="i" class="formulation-tag">{{ ing }}</span>
                  </div>
                  <p v-if="formula.use" class="formulation-card__use">{{ t('ayurveda.formulationUse') }}: {{ formula.use }}</p>
                </div>
              </div>
            </div>

            <div v-if="ayurvedaModernResearch" class="profile-section">
              <h3>{{ t('sections.modernResearch') }}</h3>
              <p style="white-space: pre-line;">{{ ayurvedaModernResearch }}</p>
            </div>
            <div v-if="ayurvedaContraindications" class="profile-section profile-section--warning">
              <h3>{{ t('sections.contraindications') }}</h3>
              <p>{{ ayurvedaContraindications }}</p>
            </div>
            <div v-if="ayurvedaDosage" class="profile-section">
              <h3>{{ t('sections.dosage') }}</h3>
              <p>{{ ayurvedaDosage }}</p>
            </div>
          </div>

          <!-- Persian Profile Content -->
          <div v-if="activeProfile === 'persian' && profiles?.persian" class="profile-content">
            <!-- Persian Properties -->
            <div class="persian-properties">
              <div v-if="profiles.persian.persianTransliteration" class="persian-property">
                <span class="persian-property__label">{{ t('persian.name') }}</span>
                <span class="persian-property__value">{{ profiles.persian.persianName }} ({{ profiles.persian.persianTransliteration }})</span>
              </div>
              <div v-if="profiles.persian.arabicName" class="persian-property">
                <span class="persian-property__label">{{ t('persian.arabicName') }}</span>
                <span class="persian-property__value" dir="rtl">{{ profiles.persian.arabicName }}</span>
              </div>
              <div v-if="temperamentLabel" class="persian-property">
                <span class="persian-property__label">{{ t('persian.temperament') }}</span>
                <span class="persian-property__value" :class="temperamentClass">
                  {{ temperamentLabel }}<template v-if="profiles.persian.temperamentDegree"> ({{ profiles.persian.temperamentDegree }}°)</template>
                </span>
              </div>
              <div v-if="persianElementLabels.length > 0" class="persian-property">
                <span class="persian-property__label">{{ t('persian.elements') }}</span>
                <div class="persian-property__tags">
                  <span v-for="elem in persianElementLabels" :key="elem.id" class="persian-tag persian-tag--element">
                    {{ elem.label }}
                  </span>
                </div>
              </div>
              <div v-if="profiles.persian.actions?.length" class="persian-property">
                <span class="persian-property__label">{{ t('persian.actions') }}</span>
                <div class="persian-property__tags">
                  <span v-for="(action, index) in profiles.persian.actions.slice(0, 5)" :key="index" class="persian-tag persian-tag--action">
                    {{ action }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Persian Content Sections -->
            <div v-if="persianFunctions" class="profile-section">
              <h3>{{ t('sections.functions') }}</h3>
              <p>{{ persianFunctions }}</p>
            </div>
            <div v-if="profiles.persian.indications?.length" class="profile-section">
              <h3>{{ t('sections.indications') }}</h3>
              <ul class="profile-list">
                <li v-for="(indication, index) in profiles.persian.indications" :key="index">{{ indication }}</li>
              </ul>
            </div>

            <!-- Persian Affected Organs -->
            <div v-if="persianAffectedOrgans.length > 0" class="profile-section">
              <h3>{{ t('persian.affectedOrgans') }}</h3>
              <div class="organ-tags">
                <span v-for="(organ, index) in persianAffectedOrgans" :key="index" class="organ-tag">
                  {{ organ }}
                </span>
              </div>
            </div>

            <!-- Persian Mizaj Constituents -->
            <div v-if="persianMizajConstituents.length > 0" class="profile-section">
              <h3>{{ t('persian.mizajConstituents') }}</h3>
              <div class="mizaj-list">
                <div v-for="(constituent, index) in persianMizajConstituents" :key="index" class="mizaj-item">
                  <span class="mizaj-item__substance">{{ constituent.substance }}</span>
                  <span v-if="constituent.temperament" class="mizaj-item__temp">{{ constituent.temperament }}</span>
                </div>
              </div>
            </div>

            <!-- Persian Corrective (Musleh) -->
            <div v-if="persianCorrective.length > 0" class="profile-section">
              <h3>{{ t('persian.corrective') }}</h3>
              <p class="profile-section__hint">{{ t('persian.correctiveDesc') }}</p>
              <div class="corrective-tags">
                <span v-for="(item, index) in persianCorrective" :key="index" class="corrective-tag">
                  {{ item }}
                </span>
              </div>
            </div>

            <!-- Persian Substitute (Badal) -->
            <div v-if="persianSubstitute.length > 0" class="profile-section">
              <h3>{{ t('persian.substitute') }}</h3>
              <p class="profile-section__hint">{{ t('persian.substituteDesc') }}</p>
              <div class="substitute-tags">
                <span v-for="(item, index) in persianSubstitute" :key="index" class="substitute-tag">
                  {{ item }}
                </span>
              </div>
            </div>

            <!-- Persian Dosage Forms -->
            <div v-if="persianDosageForms.length > 0" class="profile-section">
              <h3>{{ t('persian.dosageForm') }}</h3>
              <div class="dosage-forms">
                <span v-for="(form, index) in persianDosageForms" :key="index" class="dosage-form-tag">
                  {{ form }}
                </span>
              </div>
            </div>

            <!-- Persian Adverse Effects -->
            <div v-if="persianAdverseEffects" class="profile-section profile-section--warning">
              <h3>{{ t('persian.adverseEffects') }}</h3>
              <p>{{ persianAdverseEffects }}</p>
            </div>

            <!-- Persian Classical References -->
            <div v-if="persianClassicalReferences.length > 0" class="profile-section profile-section--classical">
              <h3>{{ t('sections.classicalReference') }}</h3>
              <div class="classical-references">
                <div v-for="(ref, index) in persianClassicalReferences" :key="index" class="classical-reference">
                  <div class="classical-reference__header">
                    <span class="classical-reference__text">{{ ref.text }}</span>
                    <span v-if="ref.author" class="classical-reference__section">{{ ref.author }}</span>
                  </div>
                  <p v-if="ref.quote" class="classical-reference__quote">{{ ref.quote }}</p>
                </div>
              </div>
            </div>

            <!-- Persian Nomadic Usage -->
            <div v-if="persianNomadicUsage" class="profile-section">
              <h3>{{ t('persian.nomadicUsage') }}</h3>
              <p>{{ persianNomadicUsage }}</p>
            </div>

            <div v-if="persianModernResearch" class="profile-section">
              <h3>{{ t('sections.modernResearch') }}</h3>
              <p>{{ persianModernResearch }}</p>
            </div>
            <div v-if="persianContraindications" class="profile-section profile-section--warning">
              <h3>{{ t('sections.contraindications') }}</h3>
              <p>{{ persianContraindications }}</p>
            </div>
            <div v-if="persianDosage" class="profile-section">
              <h3>{{ t('sections.dosage') }}</h3>
              <p>{{ persianDosage }}</p>
            </div>
          </div>

          <!-- Mongolian Profile Content -->
          <div v-if="activeProfile === 'mongolian' && profiles?.mongolian" class="profile-content">
            <!-- Mongolian Properties -->
            <div class="mongolian-properties">
              <div v-if="profiles.mongolian.mongolianName" class="mongolian-property">
                <span class="mongolian-property__label">{{ t('mongolian.name') }}</span>
                <span class="mongolian-property__value">{{ profiles.mongolian.mongolianName }}</span>
                <span v-if="profiles.mongolian.tibetanName" class="mongolian-property__tibetan">{{ profiles.mongolian.tibetanName }}</span>
              </div>
              <div v-if="mongolianElementLabels.length > 0" class="mongolian-property">
                <span class="mongolian-property__label">{{ t('mongolian.elements') }}</span>
                <div class="mongolian-property__tags">
                  <span v-for="elem in mongolianElementLabels" :key="elem.id" class="mongolian-tag mongolian-tag--element">
                    {{ elem.label }}
                  </span>
                </div>
              </div>
              <div v-if="profiles.mongolian.affectsRoots" class="mongolian-property">
                <span class="mongolian-property__label">{{ t('mongolian.roots') }}</span>
                <div class="roots-effects">
                  <span v-if="profiles.mongolian.affectsRoots.heyi" class="roots-tag roots-tag--heyi">
                    Heyi {{ profiles.mongolian.affectsRoots.heyi.effect === 'decreases' ? '↓' : '↑' }}
                  </span>
                  <span v-if="profiles.mongolian.affectsRoots.xila" class="roots-tag roots-tag--xila">
                    Xila {{ profiles.mongolian.affectsRoots.xila.effect === 'decreases' ? '↓' : '↑' }}
                  </span>
                  <span v-if="profiles.mongolian.affectsRoots.badagan" class="roots-tag roots-tag--badagan">
                    Badagan {{ profiles.mongolian.affectsRoots.badagan.effect === 'decreases' ? '↓' : '↑' }}
                  </span>
                </div>
              </div>
              <div v-if="mongolianTasteLabels.length > 0" class="mongolian-property">
                <span class="mongolian-property__label">{{ t('mongolian.tastes') }}</span>
                <div class="mongolian-property__tags">
                  <span v-for="taste in mongolianTasteLabels" :key="taste.id" class="mongolian-tag mongolian-tag--taste">
                    {{ taste.label }}
                  </span>
                </div>
              </div>
              <div v-if="profiles.mongolian.hasPotency?.length" class="mongolian-property">
                <span class="mongolian-property__label">{{ t('mongolian.potency') }}</span>
                <div class="mongolian-property__tags">
                  <span v-for="p in profiles.mongolian.hasPotency.slice(0, 4)" :key="p['@id']" class="mongolian-tag mongolian-tag--potency">
                    {{ extractLabel(p['@id']) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Mongolian Content Sections -->
            <div v-if="mongolianFunctions" class="profile-section">
              <h3>{{ t('sections.functions') }}</h3>
              <p>{{ mongolianFunctions }}</p>
            </div>
            <div v-if="profiles.mongolian.indications?.length" class="profile-section">
              <h3>{{ t('sections.indications') }}</h3>
              <ul class="profile-list">
                <li v-for="(indication, index) in profiles.mongolian.indications" :key="index">{{ indication }}</li>
              </ul>
            </div>

            <!-- Mongolian Therapeutic Class -->
            <div v-if="mongolianTherapeuticClass" class="profile-section">
              <h3>{{ t('mongolian.therapeuticClass') }}</h3>
              <p>{{ mongolianTherapeuticClass }}</p>
            </div>

            <!-- Mongolian Preparation Methods -->
            <div v-if="mongolianPreparationMethods.length > 0" class="profile-section">
              <h3>{{ t('mongolian.preparationMethods') }}</h3>
              <div class="prep-methods">
                <span v-for="(method, index) in mongolianPreparationMethods" :key="index" class="prep-method-tag">
                  {{ method }}
                </span>
              </div>
            </div>

            <!-- Mongolian Classical References -->
            <div v-if="mongolianClassicalReferences.length > 0" class="profile-section profile-section--classical">
              <h3>{{ t('sections.classicalReference') }}</h3>
              <div class="classical-references">
                <div v-for="(ref, index) in mongolianClassicalReferences" :key="index" class="classical-reference">
                  <div class="classical-reference__header">
                    <span class="classical-reference__text">{{ ref.text }}</span>
                    <span v-if="ref.reference" class="classical-reference__section">{{ ref.reference }}</span>
                  </div>
                  <p v-if="ref.quote" class="classical-reference__quote">{{ ref.quote }}</p>
                </div>
              </div>
            </div>

            <!-- Mongolian Formulations -->
            <div v-if="mongolianFormulations.length > 0" class="profile-section">
              <h3>{{ t('mongolian.formulations') }}</h3>
              <div class="formulations-list">
                <div v-for="(formula, index) in mongolianFormulations" :key="index" class="formulation-card">
                  <h4 class="formulation-card__name">{{ formula.name }}</h4>
                  <p v-if="formula.description" class="formulation-card__desc">{{ formula.description }}</p>
                  <div v-if="formula.ingredients?.length" class="formulation-card__ingredients">
                    <span class="formulation-card__label">{{ t('formulas.ingredients') }}:</span>
                    <span v-for="(ing, i) in formula.ingredients" :key="i" class="formulation-tag">{{ ing }}</span>
                  </div>
                  <p v-if="formula.use" class="formulation-card__use">{{ t('mongolian.formulationUse') }}: {{ formula.use }}</p>
                </div>
              </div>
            </div>

            <!-- Mongolian Nomadic Usage -->
            <div v-if="mongolianNomadicUsage" class="profile-section">
              <h3>{{ t('mongolian.nomadicUsage') }}</h3>
              <p>{{ mongolianNomadicUsage }}</p>
            </div>

            <div v-if="mongolianModernResearch" class="profile-section">
              <h3>{{ t('sections.modernResearch') }}</h3>
              <p>{{ mongolianModernResearch }}</p>
            </div>
            <div v-if="mongolianContraindications" class="profile-section profile-section--warning">
              <h3>{{ t('sections.contraindications') }}</h3>
              <p>{{ mongolianContraindications }}</p>
            </div>
            <div v-if="mongolianDosage" class="profile-section">
              <h3>{{ t('sections.dosage') }}</h3>
              <p>{{ mongolianDosage }}</p>
            </div>
          </div>
        </section>

        <!-- Preparation Information -->
        <section v-if="preparationDetails || preparationAppearance || storageRequirements || shelfLife" class="preparation-detail__section preparation-detail__prep-info">
          <h2 class="section-title">
            <span class="section-title__icon">📋</span>
            {{ t('preparations.preparationInfo') }}
          </h2>
          <div class="prep-info-grid">
            <div v-if="preparationDetails" class="prep-info-item prep-info-item--full">
              <span class="prep-info-item__label">{{ t('preparations.preparationDetails') }}</span>
              <span class="prep-info-item__value">{{ preparationDetails }}</span>
            </div>
            <div v-if="preparationAppearance" class="prep-info-item">
              <span class="prep-info-item__label">{{ t('preparations.appearance') }}</span>
              <span class="prep-info-item__value">{{ preparationAppearance }}</span>
            </div>
            <div v-if="storageRequirements" class="prep-info-item">
              <span class="prep-info-item__label">{{ t('preparations.storageRequirements') }}</span>
              <span class="prep-info-item__value">{{ storageRequirements }}</span>
            </div>
            <div v-if="shelfLife" class="prep-info-item">
              <span class="prep-info-item__label">{{ t('preparations.shelfLife') }}</span>
              <span class="prep-info-item__value">{{ shelfLife }}</span>
            </div>
          </div>
        </section>

        <!-- Common Usage -->
        <section v-if="hasCommonUsage" class="preparation-detail__section preparation-detail__usage">
          <h2 class="section-title">
            <span class="section-title__icon">🍽</span>
            {{ t('preparations.commonUsage') }}
          </h2>
          <div class="usage-grid">
            <div v-if="commonUsageCulinary" class="usage-item">
              <span class="usage-item__icon">🍴</span>
              <div class="usage-item__content">
                <span class="usage-item__label">{{ t('preparations.culinaryUse') }}</span>
                <span class="usage-item__value">{{ commonUsageCulinary }}</span>
              </div>
            </div>
            <div v-if="commonUsageAromatherapy" class="usage-item">
              <span class="usage-item__icon">💨</span>
              <div class="usage-item__content">
                <span class="usage-item__label">{{ t('preparations.aromatherapyUse') }}</span>
                <span class="usage-item__value">{{ commonUsageAromatherapy }}</span>
              </div>
            </div>
            <div v-if="commonUsageCosmetic" class="usage-item">
              <span class="usage-item__icon">💄</span>
              <div class="usage-item__content">
                <span class="usage-item__label">{{ t('preparations.cosmeticUse') }}</span>
                <span class="usage-item__value">{{ commonUsageCosmetic }}</span>
              </div>
            </div>
            <div v-if="commonUsageIndustrial" class="usage-item">
              <span class="usage-item__icon">🏭</span>
              <div class="usage-item__content">
                <span class="usage-item__label">{{ t('preparations.industrialUse') }}</span>
                <span class="usage-item__value">{{ commonUsageIndustrial }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Related Preparations -->
        <section v-if="relatedPreparations.length > 0" class="preparation-detail__section preparation-detail__related">
          <h2 class="section-title">
            <span class="section-title__icon">↔</span>
            {{ t('preparations.relatedPreparations') }}
          </h2>
          <div class="related-preparations">
            <router-link
              v-for="prep in relatedPreparations.slice(0, 4)"
              :key="getSlug(prep)"
              :to="localePath(`/preparations/${getSlug(prep)}`)"
              class="related-preparation-card"
            >
              <div class="related-preparation-card__image-wrapper">
                <img
                  v-if="getImage(prep)"
                  :src="getImage(prep)"
                  :alt="getPrepName(prep)"
                  class="related-preparation-card__image"
                />
                <div v-else class="related-preparation-card__placeholder">
                  <span>🌿</span>
                </div>
              </div>
              <div class="related-preparation-card__content">
                <h4 class="related-preparation-card__name">{{ getPrepName(prep) }}</h4>
                <p v-if="getScientificName(prep)" class="related-preparation-card__scientific">
                  {{ getScientificName(prep) }}
                </p>
              </div>
              <span class="related-preparation-card__arrow">→</span>
            </router-link>
          </div>
        </section>

        <!-- Preparation-Level Safety -->
        <section v-if="hasSafetyInfo || safetyWarnings.length" class="preparation-detail__section preparation-detail__safety">
          <h2 class="section-title">
            <span class="section-title__icon">⚠</span>
            {{ t('safety.title') }}
          </h2>
          <div class="safety-info">
            <div v-if="preparation.safetyInfo?.allergens?.length" class="safety-item">
              <span class="safety-item__label">{{ t('preparations.allergens') }}</span>
              <span class="safety-item__value">{{ preparation.safetyInfo.allergens.join(', ') }}</span>
            </div>
            <div v-if="preparation.safetyInfo?.pregnancySafety" class="safety-item">
              <span class="safety-item__label">{{ t('preparations.pregnancySafety') }}</span>
              <span class="safety-item__value">{{ getLocalizedSafety(preparation.safetyInfo.pregnancySafety) }}</span>
            </div>
            <div v-if="preparation.safetyInfo?.drugInteractions?.length" class="safety-item">
              <span class="safety-item__label">{{ t('preparations.drugInteractions') }}</span>
              <span class="safety-item__value">{{ preparation.safetyInfo.drugInteractions.join(', ') }}</span>
            </div>
          </div>
          <!-- Safety Warnings -->
          <div v-if="safetyWarnings.length" class="safety-warnings">
            <h3 class="safety-warnings__title">{{ t('preparations.warnings') }}</h3>
            <ul class="safety-warnings__list">
              <li v-for="(warning, index) in safetyWarnings" :key="index" class="safety-warnings__item">
                <span class="safety-warnings__icon">⚠</span>
                <span>{{ warning }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Disclaimer -->
        <aside class="preparation-detail__disclaimer">
          <p>
            <strong>{{ t('disclaimer.title') }}:</strong> {{ t('disclaimer.text') }}
          </p>
        </aside>
      </article>

      <div v-else class="preparation-detail__not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('preparations.notFound') }}</p>
        <router-link :to="localePath('/preparations')" class="preparation-detail__back-link">
          &larr; {{ t('preparations.backToPreparations') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { dataset } from '@/api/dataset'
import {
  usePreparation,
  useSourcePlant,
  useProfilesForPreparation,
  useRelatedPreparations,
  usePreparationLocalizer,
  useTcmReferences,
  useWesternReferences,
  useChemicalReferences
} from '@/composables/useHerbData'

const route = useRoute()
const { t, locale } = useI18n()
const slug = computed(() => route.params.slug)

const preparation = ref(null)
const sourcePlant = ref(null)
const profiles = ref(null)
const activeProfile = ref('tcm')

// Get localizers and references
const localizer = usePreparationLocalizer()
const { getNatureLabel, getFlavorLabels, getMeridianLabels, getCategoryLabel } = useTcmReferences()
const { getActionLabels, getOrganLabels } = useWesternReferences()
const { getCompoundLabels } = useChemicalReferences()

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Computed properties for display
const prepTitle = computed(() => {
  if (!preparation.value) return null
  return localizer.getName(preparation.value) || getSlug(preparation.value)
})

const prepCommonName = computed(() => {
  if (!sourcePlant.value?.commonName) return null
  return sourcePlant.value.commonName[locale.value] ||
         sourcePlant.value.commonName['en'] ||
         sourcePlant.value.commonName['zh-Hant']
})

// Form and preparation method display
const prepForm = computed(() => {
  const form = preparation.value?.form
  if (!form) return null
  const formId = typeof form === 'object' ? form['@id'] : form
  if (!formId) return null
  const formItem = dataset.getHerbalForm(formId)
  if (formItem) {
    const labelMap = formItem.prefLabel || formItem.name
    if (labelMap) {
      return labelMap[locale.value] || labelMap['en'] || formId
    }
  }
  return formId.split('/').pop() || formId
})

const prepMethod = computed(() => {
  const method = preparation.value?.preparationMethod
  if (!method) return null
  const methodId = typeof method === 'object' ? method['@id'] : method
  if (!methodId) return null
  const methodItem = dataset.getHerbalMethod(methodId)
  if (methodItem) {
    const labelMap = methodItem.prefLabel || methodItem.name
    if (labelMap) {
      return labelMap[locale.value] || labelMap['en'] || methodId
    }
  }
  return methodId.split('/').pop() || methodId
})

const prepImage = computed(() => {
  // Image comes from source plant, not from preparation
  return sourcePlant.value?.image || null
})

// Image error handling - fall back to plant image if prep image fails to load
const imageError = ref(false)
const displayImage = computed(() => {
  if (imageError.value && sourcePlant.value?.image) {
    return sourcePlant.value.image
  }
  return prepImage.value
})

// Image attribution
const imageAttribution = computed(() => {
  const imagePath = prepImage.value
  if (!imagePath) return null
  // Extract slug from image path - typically /@herbapedia/data/media/images/{slug}/main.jpg
  const match = imagePath.match(/media\/images\/([^/]+)\//)
  if (!match) return null
  const slug = match[1]
  const metadata = dataset.getImageMetadata(slug)
  return metadata?.attribution || null
})

function handleImageError() {
  // If prep image fails, try plant image
  if (preparation.value?.image && sourcePlant.value?.image) {
    imageError.value = true
  }
}

// Reset image error when preparation changes
watch(slug, () => {
  imageError.value = false
})

// Plant slug for navigation
const plantSlug = computed(() => {
  if (!sourcePlant.value?.['@id']) return ''
  const parts = sourcePlant.value['@id'].split('/')
  return parts[parts.length - 1] || ''
})

// Count of preparations from this plant
const plantPreparationCount = computed(() => {
  if (!plantSlug.value) return 0
  return dataset.getPreparationCountForPlant(plantSlug.value)
})

// Chemical compounds
const chemicalCompoundLabels = computed(() => {
  if (!sourcePlant.value?.containsChemical) return []
  return getCompoundLabels(sourcePlant.value.containsChemical)
})

// External links
const externalLinks = computed(() => {
  const links = []

  if (sourcePlant.value?.wikidataID) {
    links.push({
      url: `https://www.wikidata.org/entity/${sourcePlant.value.wikidataID}`,
      label: t('links.wikidata'),
      icon: '📊'
    })
  }

  if (sourcePlant.value?.gbifID) {
    links.push({
      url: `https://www.gbif.org/species/${sourcePlant.value.gbifID}`,
      label: t('links.gbif'),
      icon: '🌿'
    })
  }

  return links
})

const hasExternalLinks = computed(() => externalLinks.value.length > 0)

// TCM Profile computed
const natureLabel = computed(() => getNatureLabel(profiles.value?.tcm?.hasNature))
const flavorLabels = computed(() => getFlavorLabels(profiles.value?.tcm?.hasFlavor))
const meridianLabels = computed(() => getMeridianLabels(profiles.value?.tcm?.entersMeridian))
const categoryLabel = computed(() => getCategoryLabel(profiles.value?.tcm?.hasCategory))

const tcmHistory = computed(() => localizer.getTCMHistory(profiles.value?.tcm))
const tcmTraditionalUsage = computed(() => localizer.getTCMTraditionalUsage(profiles.value?.tcm))
const tcmFunctions = computed(() => localizer.getTCMFunctions(profiles.value?.tcm))
const tcmModernResearch = computed(() => localizer.getTCMModernResearch(profiles.value?.tcm))

const tcmContraindications = computed(() => {
  const c = profiles.value?.tcm?.contraindications
  if (!c) return null
  if (typeof c === 'string') return c
  return c[locale.value] || c['en'] || c['zh-Hant']
})

const tcmIncompatibilities = computed(() => {
  const i = profiles.value?.tcm?.incompatibilities
  if (!i) return null
  if (typeof i === 'string') return i
  return i[locale.value] || i['en'] || i['zh-Hant']
})

const tcmDosage = computed(() => {
  const d = profiles.value?.tcm?.dosage
  if (!d) return null
  if (typeof d === 'string') return d
  return d[locale.value] || d['en'] || d['zh-Hant']
})

// TCM Classical References
const tcmClassicalReferences = computed(() => {
  return profiles.value?.tcm?.classicalReferences || []
})

// TCM Dosage Effects
const tcmDosageEffect = computed(() => profiles.value?.tcm?.dosageEffect)

// TCM Comparison Notes
const tcmComparisonNotes = computed(() => {
  const c = profiles.value?.tcm?.comparisonNotes
  if (!c) return null
  if (typeof c === 'string') return c
  return c[locale.value] || c['en'] || c['zh-Hant']
})

// Preparation-level fields (from entity, not profile)
const preparationDetails = computed(() => {
  const d = preparation.value?.preparationDetails
  if (!d) return null
  if (typeof d === 'string') return d
  return d[locale.value] || d['en'] || d['zh-Hant']
})

const preparationAppearance = computed(() => {
  const a = preparation.value?.appearance
  if (!a) return null
  if (typeof a === 'string') return a
  return a[locale.value] || a['en'] || a['zh-Hant']
})

const storageRequirements = computed(() => {
  const s = preparation.value?.storageRequirements
  if (!s) return null
  if (typeof s === 'string') return s
  return s[locale.value] || s['en'] || s['zh-Hant']
})

const shelfLife = computed(() => preparation.value?.shelfLife)

// Common Usage
const commonUsageCulinary = computed(() => {
  const c = preparation.value?.commonUsage?.culinary
  if (!c) return null
  if (typeof c === 'string') return c
  return c[locale.value] || c['en'] || c['zh-Hant']
})

const commonUsageAromatherapy = computed(() => {
  const a = preparation.value?.commonUsage?.aromatherapy
  if (!a) return null
  if (typeof a === 'string') return a
  return a[locale.value] || a['en'] || a['zh-Hant']
})

const commonUsageCosmetic = computed(() => {
  const c = preparation.value?.commonUsage?.cosmetic
  if (!c) return null
  if (typeof c === 'string') return c
  return c[locale.value] || c['en'] || c['zh-Hant']
})

const commonUsageIndustrial = computed(() => {
  const i = preparation.value?.commonUsage?.industrial
  if (!i) return null
  if (typeof i === 'string') return i
  return i[locale.value] || i['en'] || i['zh-Hant']
})

const hasCommonUsage = computed(() =>
  commonUsageCulinary.value ||
  commonUsageAromatherapy.value ||
  commonUsageCosmetic.value ||
  commonUsageIndustrial.value
)

// Safety Warnings (separate from contraindications)
const safetyWarnings = computed(() => {
  const warnings = preparation.value?.safetyInfo?.warnings || []
  if (!warnings.length) return []
  return warnings.map(w => {
    if (typeof w === 'string') return w
    return w[locale.value] || w['en'] || w['zh-Hant'] || Object.values(w)[0]
  })
})

// Nature class for styling
const natureClass = computed(() => {
  if (!profiles.value?.tcm?.hasNature) return ''
  const id = typeof profiles.value.tcm.hasNature === 'object'
    ? profiles.value.tcm.hasNature['@id']
    : profiles.value.tcm.hasNature
  if (typeof id === 'string') {
    if (id.includes('hot')) return 'tcm-nature--hot'
    if (id.includes('warm')) return 'tcm-nature--warm'
    if (id.includes('neutral')) return 'tcm-nature--neutral'
    if (id.includes('cool')) return 'tcm-nature--cool'
    if (id.includes('cold')) return 'tcm-nature--cold'
  }
  return ''
})

// Western Profile computed
const actionLabels = computed(() => getActionLabels(profiles.value?.western?.hasAction))
const organLabels = computed(() => getOrganLabels(profiles.value?.western?.hasOrganAffinity))

const westernHistory = computed(() => localizer.getWesternHistory(profiles.value?.western))
const westernTraditionalUsage = computed(() => localizer.getWesternTraditionalUsage(profiles.value?.western))
const westernModernResearch = computed(() => localizer.getWesternModernResearch(profiles.value?.western))

// ============================================================================
// Ayurveda Profile computed
// ============================================================================

// Helper to get localized value from language map
function getLocalizedLangMap(langMap) {
  if (!langMap) return null
  if (typeof langMap === 'string') return langMap
  return langMap[locale.value] || langMap['en'] || Object.values(langMap)[0]
}

// Helper to get label from reference item (checks both prefLabel and name)
function getRefItemLabel(item) {
  if (!item) return null
  const labelMap = item.prefLabel || item.name
  return getLocalizedLangMap(labelMap)
}

// Helper to extract label from IRI
function extractLabel(iri) {
  if (!iri) return ''
  const parts = iri.split('/')
  return parts[parts.length - 1] || iri
}

// Ayurveda Rasa (taste)
const rasaLabels = computed(() => {
  if (!profiles.value?.ayurveda?.hasRasa) return []
  return profiles.value.ayurveda.hasRasa.map(ref => {
    const id = typeof ref === 'object' ? ref['@id'] : ref
    const item = dataset.getRasa(id)
    return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) }
  })
})

// Ayurveda Guna (qualities)
const gunaLabels = computed(() => {
  if (!profiles.value?.ayurveda?.hasGuna) return []
  return profiles.value.ayurveda.hasGuna.map(ref => {
    const id = typeof ref === 'object' ? ref['@id'] : ref
    const item = dataset.getGuna(id)
    return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) }
  })
})

// Ayurveda Virya (potency)
const viryaLabel = computed(() => {
  if (!profiles.value?.ayurveda?.hasVirya) return null
  const id = typeof profiles.value.ayurveda.hasVirya === 'object'
    ? profiles.value.ayurveda.hasVirya['@id']
    : profiles.value.ayurveda.hasVirya
  const item = dataset.getVirya(id)
  return item ? getRefItemLabel(item) : extractLabel(id)
})

const viryaClass = computed(() => {
  if (!profiles.value?.ayurveda?.hasVirya) return ''
  const id = typeof profiles.value.ayurveda.hasVirya === 'object'
    ? profiles.value.ayurveda.hasVirya['@id']
    : profiles.value.ayurveda.hasVirya
  if (typeof id === 'string') {
    if (id.includes('heating')) return 'ayurveda-virya--heating'
    if (id.includes('cooling')) return 'ayurveda-virya--cooling'
  }
  return ''
})

// Ayurveda Vipaka (post-digestive taste)
const vipakaLabel = computed(() => {
  if (!profiles.value?.ayurveda?.hasVipaka) return null
  const id = typeof profiles.value.ayurveda.hasVipaka === 'object'
    ? profiles.value.ayurveda.hasVipaka['@id']
    : profiles.value.ayurveda.hasVipaka
  const item = dataset.getVipaka(id)
  return item ? getRefItemLabel(item) : extractLabel(id)
})

// Ayurveda content sections
const ayurvedaTraditionalUsage = computed(() => getLocalizedLangMap(profiles.value?.ayurveda?.ayurvedaTraditionalUsage))
const ayurvedaModernResearch = computed(() => getLocalizedLangMap(profiles.value?.ayurveda?.ayurvedaModernResearch))
const ayurvedaContraindications = computed(() => getLocalizedLangMap(profiles.value?.ayurveda?.contraindications))
const ayurvedaDosage = computed(() => getLocalizedLangMap(profiles.value?.ayurveda?.dosage))

// Ayurveda Category
const ayurvedaCategoryLabel = computed(() => {
  if (!profiles.value?.ayurveda?.ayurvedaCategory) return null
  const id = typeof profiles.value.ayurveda.ayurvedaCategory === 'object'
    ? profiles.value.ayurveda.ayurvedaCategory['@id']
    : profiles.value.ayurveda.ayurvedaCategory
  const item = dataset.getAyurvedaCategory(id)
  return item ? getRefItemLabel(item) : extractLabel(id)
})

// Ayurveda Classical References
const ayurvedaClassicalReferences = computed(() => {
  return profiles.value?.ayurveda?.classicalReferences || []
})

// Ayurveda Anupana (Vehicle/Carrier)
const ayurvedaAnupana = computed(() => {
  return profiles.value?.ayurveda?.anupana || []
})

// Ayurveda Sevana Kala (Timing of Administration)
const ayurvedaSevanaKala = computed(() => {
  return profiles.value?.ayurveda?.sevanaKala || null
})

const ayurvedaSevanaKalaLabel = computed(() => {
  if (!ayurvedaSevanaKala.value) return null
  // Map common values to display labels
  const kalaMap = {
    'pratah': 'Morning (Pratah Kala)',
    'madhyahna': 'Midday (Madhyahna Kala)',
    'sayam': 'Evening (Sayam Kala)',
    'ratrau': 'Night (Ratrau Kala)',
    'bhaktad': 'After Food (Bhaktad)',
    'abhyantara': 'Between Meals (Abhyantara)'
  }
  return kalaMap[ayurvedaSevanaKala.value] || ayurvedaSevanaKala.value
})

const ayurvedaSevanaKalaDesc = computed(() => {
  if (!ayurvedaSevanaKala.value) return null
  const descMap = {
    'pratah': 'Best taken in the morning for digestive and energizing effects',
    'madhyahna': 'Best taken at midday when digestive fire is strongest',
    'sayam': 'Best taken in the evening for calming and restorative effects',
    'ratrau': 'Best taken at night for sleep and rejuvenation',
    'bhaktad': 'Best taken after meals for digestive support',
    'abhyantara': 'Best taken between meals for optimal absorption'
  }
  return descMap[ayurvedaSevanaKala.value] || null
})

// Ayurveda Formulations
const ayurvedaFormulations = computed(() => {
  return profiles.value?.ayurveda?.formulations || []
})

// ============================================================================
// Persian Profile computed
// ============================================================================

// Persian Temperament
const temperamentLabel = computed(() => {
  if (!profiles.value?.persian?.hasTemperament) return null
  const id = typeof profiles.value.persian.hasTemperament === 'object'
    ? profiles.value.persian.hasTemperament['@id']
    : profiles.value.persian.hasTemperament
  const item = dataset.getTemperament(id)
  return item ? getRefItemLabel(item) : extractLabel(id)
})

const temperamentClass = computed(() => {
  if (!profiles.value?.persian?.hasTemperament) return ''
  const id = typeof profiles.value.persian.hasTemperament === 'object'
    ? profiles.value.persian.hasTemperament['@id']
    : profiles.value.persian.hasTemperament
  if (typeof id === 'string') {
    if (id.includes('hot-dry')) return 'persian-temperament--hot-dry'
    if (id.includes('hot-wet')) return 'persian-temperament--hot-wet'
    if (id.includes('cold-dry')) return 'persian-temperament--cold-dry'
    if (id.includes('cold-wet')) return 'persian-temperament--cold-wet'
  }
  return ''
})

// Persian Elements
const persianElementLabels = computed(() => {
  if (!profiles.value?.persian?.hasElement) return []
  return profiles.value.persian.hasElement.map(ref => {
    const id = typeof ref === 'object' ? ref['@id'] : ref
    const item = dataset.getPersianElement(id)
    return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) }
  })
})

// Persian content sections
const persianFunctions = computed(() => getLocalizedLangMap(profiles.value?.persian?.persianFunctions))
const persianModernResearch = computed(() => getLocalizedLangMap(profiles.value?.persian?.modernResearch))
const persianContraindications = computed(() => getLocalizedLangMap(profiles.value?.persian?.contraindications))
const persianDosage = computed(() => getLocalizedLangMap(profiles.value?.persian?.dosage))

// Persian Arabic Name
const persianArabicName = computed(() => profiles.value?.persian?.arabicName || null)

// Persian Affected Organs
const persianAffectedOrgans = computed(() => profiles.value?.persian?.affectedOrgans || [])

// Persian Mizaj Constituents
const persianMizajConstituents = computed(() => {
  const constituents = profiles.value?.persian?.mizajConstituents || []
  return constituents.map(c => ({
    substance: c.substance,
    temperament: c.temperament ? `${c.temperament.hot || ''}/${c.temperament.cold || ''} ${c.temperament.dry || ''}/${c.temperament.wet || ''}`.trim() : null
  }))
})

// Persian Corrective (Musleh)
const persianCorrective = computed(() => profiles.value?.persian?.corrective || [])

// Persian Substitute (Badal)
const persianSubstitute = computed(() => profiles.value?.persian?.substitute || [])

// Persian Dosage Forms
const persianDosageForms = computed(() => profiles.value?.persian?.dosageForm || [])

// Persian Adverse Effects
const persianAdverseEffects = computed(() => {
  const effects = profiles.value?.persian?.adverseEffects
  if (!effects) return null
  if (typeof effects === 'string') return effects
  return getLocalizedLangMap(effects)
})

// Persian Classical References
const persianClassicalReferences = computed(() => profiles.value?.persian?.classicalReferences || [])

// Persian Nomadic Usage
const persianNomadicUsage = computed(() => {
  const usage = profiles.value?.persian?.nomadicUsage
  if (!usage) return null
  if (typeof usage === 'string') return usage
  return getLocalizedLangMap(usage)
})

// ============================================================================
// Mongolian Profile computed
// ============================================================================

// Mongolian Elements
const mongolianElementLabels = computed(() => {
  if (!profiles.value?.mongolian?.hasElement) return []
  return profiles.value.mongolian.hasElement.map(ref => {
    const id = typeof ref === 'object' ? ref['@id'] : ref
    const item = dataset.getMongolianElement(id)
    return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) }
  })
})

// Mongolian Tastes
const mongolianTasteLabels = computed(() => {
  if (!profiles.value?.mongolian?.hasTaste) return []
  return profiles.value.mongolian.hasTaste.map(ref => {
    const id = typeof ref === 'object' ? ref['@id'] : ref
    const item = dataset.getMongolianTaste(id)
    return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) }
  })
})

// Mongolian content sections
const mongolianFunctions = computed(() => getLocalizedLangMap(profiles.value?.mongolian?.mongolianFunctions))
const mongolianModernResearch = computed(() => getLocalizedLangMap(profiles.value?.mongolian?.modernResearch))
const mongolianContraindications = computed(() => getLocalizedLangMap(profiles.value?.mongolian?.contraIndications))
const mongolianDosage = computed(() => getLocalizedLangMap(profiles.value?.mongolian?.dosage))

// Mongolian Tibetan Wylie
const mongolianTibetanWylie = computed(() => profiles.value?.mongolian?.tibetanWylie || null)

// Mongolian Therapeutic Class
const mongolianTherapeuticClass = computed(() => {
  const therapeuticClass = profiles.value?.mongolian?.therapeuticClass
  if (!therapeuticClass) return null
  if (typeof therapeuticClass === 'string') return therapeuticClass
  return getLocalizedLangMap(therapeuticClass)
})

// Mongolian Preparation Methods
const mongolianPreparationMethods = computed(() => profiles.value?.mongolian?.preparationMethod || [])

// Mongolian Classical References
const mongolianClassicalReferences = computed(() => profiles.value?.mongolian?.classicalReferences || [])

// Mongolian Formulations
const mongolianFormulations = computed(() => profiles.value?.mongolian?.formulations || [])

// Mongolian Nomadic Usage
const mongolianNomadicUsage = computed(() => {
  const usage = profiles.value?.mongolian?.nomadicUsage
  if (!usage) return null
  if (typeof usage === 'string') return usage
  return getLocalizedLangMap(usage)
})

// Related preparations
const relatedPreparationsData = computed(() => {
  if (!slug.value) return []
  return useRelatedPreparations(slug.value).value
})
const relatedPreparations = relatedPreparationsData

// Safety info
const hasSafetyInfo = computed(() => {
  return preparation.value?.safetyInfo &&
    (preparation.value.safetyInfo.allergens?.length ||
     preparation.value.safetyInfo.pregnancySafety ||
     preparation.value.safetyInfo.drugInteractions?.length)
})

function getLocalizedSafety(langMap) {
  if (!langMap) return null
  if (typeof langMap === 'string') return langMap
  return langMap[locale.value] || langMap['en'] || Object.values(langMap)[0]
}

// Helper functions
function getSlug(prep) {
  if (!prep?.['@id']) return ''
  const parts = prep['@id'].split('/')
  return parts[parts.length - 1] || ''
}

function getPrepName(prep) {
  return localizer.getName(prep) || getSlug(prep)
}

function getScientificName(prep) {
  const s = getSlug(prep)
  const plant = useSourcePlant(s)
  return plant.value?.scientificName || null
}

function formatImagePath(img) {
  if (!img) return null
  return img.startsWith('/@herbapedia') ? img : `/${img}`
}

function getImage(prep) {
  const s = getSlug(prep)
  const plant = useSourcePlant(s)
  return formatImagePath(plant.value?.image)
}

// Watch slug changes and load data
watch(slug, (newSlug) => {
  if (newSlug) {
    const prepData = usePreparation(newSlug)
    preparation.value = prepData.value

    if (preparation.value) {
      // Load source plant
      const plantData = useSourcePlant(newSlug)
      sourcePlant.value = plantData.value

      // Load profiles
      const profileData = useProfilesForPreparation(newSlug)
      profiles.value = profileData.value

      // Set initial active profile (priority: TCM > Western > Ayurveda > Persian > Mongolian)
      if (profileData.value?.tcm) {
        activeProfile.value = 'tcm'
      } else if (profileData.value?.western) {
        activeProfile.value = 'western'
      } else if (profileData.value?.ayurveda) {
        activeProfile.value = 'ayurveda'
      } else if (profileData.value?.persian) {
        activeProfile.value = 'persian'
      } else if (profileData.value?.mongolian) {
        activeProfile.value = 'mongolian'
      }
    }
  }
}, { immediate: true })
</script>

<style scoped>
.preparation-detail-view {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - var(--header-height));
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
}

.breadcrumbs a {
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

/* Header */
.preparation-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.preparation-detail__image-wrapper {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-background);
  position: relative;
}

.preparation-detail__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image Attribution */
.preparation-detail__attribution {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.preparation-detail__attribution a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
}

.preparation-detail__attribution a:hover {
  color: white;
}

.preparation-detail__attribution .attribution-license {
  font-weight: var(--font-weight-semibold);
}

.preparation-detail__attribution .attribution-source {
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preparation-detail__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-text-light);
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.preparation-detail__placeholder svg {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.preparation-detail__placeholder-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  opacity: 0.7;
}

.preparation-detail__meta {
  flex: 1;
}

.preparation-detail__badges {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.preparation-detail__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.preparation-detail__badge--tcm {
  background: rgba(34, 139, 34, 0.15);
  color: var(--color-primary);
}

.preparation-detail__badge--western {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.preparation-detail__badge--ayurveda {
  background: rgba(249, 115, 22, 0.15);
  color: #ea580c;
}

.preparation-detail__badge--persian {
  background: rgba(139, 69, 19, 0.15);
  color: #8b4513;
}

.preparation-detail__badge--mongolian {
  background: rgba(75, 0, 130, 0.15);
  color: #4b0082;
}

.preparation-detail__title {
  margin-bottom: var(--spacing-sm);
}

.preparation-detail__common-name {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-xs);
}

.preparation-detail__scientific {
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
}

/* Form and Method badges */
.preparation-detail__form-method {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.prep-form-badge,
.prep-method-badge {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-light);
}

.prep-form-badge {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #2563eb;
}

/* Sections */
.preparation-detail__section {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.section-title__icon {
  font-size: var(--font-size-base);
  opacity: 0.7;
}

/* Botanical Source */
.botanical-source__row {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.botanical-source__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  min-width: 120px;
}

.botanical-source__value {
  font-size: var(--font-size-sm);
}

.botanical-source__value--scientific {
  font-style: italic;
}

.botanical-source__link--inline {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.botanical-source__link--inline:hover {
  text-decoration: underline;
}

.botanical-source__plant-link {
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.plant-link-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, rgba(34, 139, 34, 0.08) 0%, rgba(34, 139, 34, 0.03) 100%);
  border: 1px solid rgba(34, 139, 34, 0.2);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.plant-link-card:hover {
  background: linear-gradient(135deg, rgba(34, 139, 34, 0.12) 0%, rgba(34, 139, 34, 0.06) 100%);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.plant-link-card__icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
}

.plant-link-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.plant-link-card__title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.plant-link-card__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.plant-link-card__arrow {
  flex-shrink: 0;
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  opacity: 0.5;
  transition: opacity var(--transition-fast);
}

.plant-link-card:hover .plant-link-card__arrow {
  opacity: 1;
}

.botanical-source__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.botanical-source__link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.botanical-source__link:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.botanical-source__link-arrow {
  opacity: 0.5;
}

.botanical-source__compounds {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.botanical-source__compounds-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-sm);
}

.botanical-source__compounds-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.compound-tag {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: #7c3aed;
  border-radius: var(--radius-full);
}

/* Profile Tabs */
.profile-tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.profile-tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: none;
  border: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}

.profile-tab:hover {
  color: var(--color-text);
}

.profile-tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* TCM Properties */
.tcm-properties {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.tcm-property {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tcm-property__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.tcm-property__value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.tcm-property__value--italic {
  font-style: italic;
  font-weight: normal;
}

.tcm-property__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tcm-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.tcm-tag--flavor {
  background: #fef3c7;
  color: #92400e;
}

.tcm-tag--meridian {
  background: #dbeafe;
  color: #1e40af;
}

.tcm-nature--hot { color: #dc2626; }
.tcm-nature--warm { color: #ea580c; }
.tcm-nature--neutral { color: var(--color-text); }
.tcm-nature--cool { color: #0891b2; }
.tcm-nature--cold { color: #2563eb; }

/* Western Properties */
.western-properties {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.western-property {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.western-property__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.western-property__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.western-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.western-tag--action {
  background: #dcfce7;
  color: #166534;
}

.western-tag--organ {
  background: #f3e8ff;
  color: #7c3aed;
}

/* Ayurveda Properties */
.ayurveda-properties {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.ayurveda-property {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.ayurveda-property__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.ayurveda-property__value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.ayurveda-property__value--italic {
  font-style: italic;
  font-weight: normal;
}

.ayurveda-property__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.ayurveda-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.ayurveda-tag--rasa {
  background: #ffedd5;
  color: #c2410c;
}

.ayurveda-tag--guna {
  background: #ecfccb;
  color: #4d7c0f;
}

.ayurveda-tag--karma {
  background: #fef3c7;
  color: #92400e;
  font-size: var(--font-size-xs);
}

.ayurveda-virya--heating { color: #dc2626; }
.ayurveda-virya--cooling { color: #0891b2; }

/* Ayurveda Anupana (Vehicle) */
.ayurveda-anupana {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.anupana-tag {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%);
  color: #9a3412;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Sevana Kala (Timing) */
.sevana-kala {
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%);
  border-radius: var(--radius-md);
  border-left: 3px solid #65a30d;
}

.sevana-kala__value {
  font-weight: var(--font-weight-semibold);
  color: #3f6212;
}

/* Formulations */
.formulations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.formulation-card {
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-md);
  border-left: 3px solid #ea580c;
}

.formulation-card__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: #c2410c;
  margin: 0 0 var(--spacing-xs);
}

.formulation-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-sm);
}

.formulation-card__ingredients {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.formulation-card__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.formulation-tag {
  display: inline-block;
  padding: 2px 8px;
  background: #ffedd5;
  color: #9a3412;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
}

.formulation-card__use {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0;
  font-style: italic;
}

.profile-section__hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-style: italic;
  margin-top: var(--spacing-sm);
}

.dosha-effects {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.dosha-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.dosha-tag--vata {
  background: #e0f2fe;
  color: #0369a1;
}

.dosha-tag--pitta {
  background: #fee2e2;
  color: #b91c1c;
}

.dosha-tag--kapha {
  background: #d1fae5;
  color: #047857;
}

/* Persian Properties */
.persian-properties {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.persian-property {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.persian-property__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.persian-property__value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.persian-property__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.persian-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.persian-tag--element {
  background: #fef3c7;
  color: #92400e;
}

.persian-tag--action {
  background: #ede9fe;
  color: #6b21a8;
  font-size: var(--font-size-xs);
}

.persian-temperament--hot-dry { color: #dc2626; }
.persian-temperament--hot-wet { color: #ea580c; }
.persian-temperament--cold-dry { color: #0891b2; }
.persian-temperament--cold-wet { color: #1d4ed8; }

/* Persian Organ Tags */
.organ-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.organ-tag {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: #7c3aed;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Mizaj Constituents */
.mizaj-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.mizaj-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-sm);
  border-left: 3px solid #8b4513;
}

.mizaj-item__substance {
  font-weight: var(--font-weight-medium);
}

.mizaj-item__temp {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* Corrective Tags */
.corrective-tags,
.substitute-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.corrective-tag {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #047857;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.substitute-tag {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Dosage Forms */
.dosage-forms {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.dosage-form-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid rgba(139, 69, 19, 0.3);
  color: #8b4513;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

/* Mongolian Properties */
.mongolian-properties {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.mongolian-property {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.mongolian-property__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.mongolian-property__value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.mongolian-property__tibetan {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-left: var(--spacing-sm);
}

.mongolian-property__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.mongolian-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.mongolian-tag--element {
  background: #fae8ff;
  color: #86198f;
}

.mongolian-tag--taste {
  background: #ccfbf1;
  color: #0f766e;
}

.mongolian-tag--potency {
  background: #fef3c7;
  color: #92400e;
  font-size: var(--font-size-xs);
}

.roots-effects {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.roots-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.roots-tag--heyi {
  background: #e0f2fe;
  color: #0369a1;
}

.roots-tag--xila {
  background: #fee2e2;
  color: #b91c1c;
}

.roots-tag--badagan {
  background: #d1fae5;
  color: #047857;
}

/* Profile Sections */
.profile-section {
  margin-bottom: var(--spacing-xl);
}

.profile-section:last-of-type {
  margin-bottom: 0;
}

.profile-section h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.profile-section p {
  line-height: var(--line-height-relaxed);
}

.profile-section--warning {
  background: #fef3c7;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid #f59e0b;
}

.profile-section--warning h3 {
  border-bottom-color: #f59e0b;
}

.profile-section--classical {
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.05) 0%, rgba(139, 69, 19, 0.02) 100%);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid #8b4513;
}

.profile-section--classical h3 {
  border-bottom-color: #8b4513;
  color: #8b4513;
}

.profile-list {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.profile-list li {
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-relaxed);
}

.profile-placeholder {
  color: var(--color-text-light);
  font-style: italic;
  text-align: center;
  padding: var(--spacing-2xl);
}

/* Classical References */
.classical-references {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.classical-reference {
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-sm);
}

.classical-reference__header {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.classical-reference__text {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.classical-reference__section {
  font-size: var(--font-size-sm);
  color: #8b4513;
  background: rgba(139, 69, 19, 0.1);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.classical-reference__quote {
  margin: var(--spacing-sm) 0 0;
  font-style: italic;
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  padding-left: var(--spacing-md);
  border-left: 2px solid rgba(139, 69, 19, 0.3);
}

/* Dosage Effects */
.dosage-effects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.dosage-effect {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--color-background);
}

.dosage-effect--small {
  border-left: 3px solid #0891b2;
}

.dosage-effect--medium {
  border-left: 3px solid #f59e0b;
}

.dosage-effect--large {
  border-left: 3px solid #dc2626;
}

.dosage-effect__dose {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xs);
}

.dosage-effect__effect {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

/* Preparation Information Grid */
.prep-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.prep-info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
}

.prep-info-item--full {
  grid-column: 1 / -1;
}

.prep-info-item__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.prep-info-item__value {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

/* Common Usage Grid */
.usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.usage-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-md);
}

.usage-item__icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.usage-item__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.usage-item__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.usage-item__value {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

/* Safety Warnings */
.safety-warnings {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.safety-warnings__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: #dc2626;
  margin-bottom: var(--spacing-sm);
}

.safety-warnings__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.safety-warnings__item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: #fef2f2;
  border-radius: var(--radius-sm);
  border-left: 3px solid #dc2626;
  font-size: var(--font-size-sm);
}

.safety-warnings__icon {
  flex-shrink: 0;
  color: #dc2626;
}

/* Related Preparations */
.related-preparations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.related-preparation-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.related-preparation-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.related-preparation-card__image-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface);
}

.related-preparation-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-preparation-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
}

.related-preparation-card__content {
  flex: 1;
  min-width: 0;
}

.related-preparation-card__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-preparation-card__scientific {
  font-size: var(--font-size-xs);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-preparation-card__arrow {
  flex-shrink: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.related-preparation-card:hover .related-preparation-card__arrow {
  opacity: 1;
}

/* Safety Info */
.safety-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.safety-item {
  display: flex;
  gap: var(--spacing-md);
}

.safety-item__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  min-width: 150px;
}

.safety-item__value {
  font-size: var(--font-size-sm);
}

/* Disclaimer */
.preparation-detail__disclaimer {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.preparation-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

/* Not Found */
.preparation-detail__not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.preparation-detail__back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .preparation-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .preparation-detail__image-wrapper {
    width: 150px;
    height: 150px;
  }

  .preparation-detail__badges {
    justify-content: center;
  }

  .tcm-properties,
  .western-properties {
    grid-template-columns: 1fr;
  }

  .profile-tabs {
    flex-wrap: wrap;
  }

  .related-preparations {
    grid-template-columns: 1fr;
  }
}
</style>
