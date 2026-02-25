import { computed, ref, watch, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { b as usePreparationLocalizer, d as useTcmReferences, e as useWesternReferences, f as useChemicalReferences, g as useRelatedPreparations, h as usePreparation, c as useSourcePlant, i as useProfilesForPreparation } from "./useHerbData-DQ9hcdFH.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "PreparationDetailView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const slug = computed(() => route.params.slug);
    const preparation = ref(null);
    const sourcePlant = ref(null);
    const profiles = ref(null);
    const activeProfile = ref("tcm");
    const localizer = usePreparationLocalizer();
    const { getNatureLabel, getFlavorLabels, getMeridianLabels, getCategoryLabel } = useTcmReferences();
    const { getActionLabels, getOrganLabels } = useWesternReferences();
    const { getCompoundLabels } = useChemicalReferences();
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const prepTitle = computed(() => {
      if (!preparation.value) return null;
      return localizer.getName(preparation.value) || getSlug(preparation.value);
    });
    const prepCommonName = computed(() => {
      var _a;
      if (!((_a = sourcePlant.value) == null ? void 0 : _a.commonName)) return null;
      return sourcePlant.value.commonName[locale.value] || sourcePlant.value.commonName["en"] || sourcePlant.value.commonName["zh-Hant"];
    });
    const prepForm = computed(() => {
      var _a;
      const form = (_a = preparation.value) == null ? void 0 : _a.form;
      if (!form) return null;
      const formId = typeof form === "object" ? form["@id"] : form;
      if (!formId) return null;
      const formItem = dataset.getHerbalForm(formId);
      if (formItem) {
        const labelMap = formItem.prefLabel || formItem.name;
        if (labelMap) {
          return labelMap[locale.value] || labelMap["en"] || formId;
        }
      }
      return formId.split("/").pop() || formId;
    });
    const prepMethod = computed(() => {
      var _a;
      const method = (_a = preparation.value) == null ? void 0 : _a.preparationMethod;
      if (!method) return null;
      const methodId = typeof method === "object" ? method["@id"] : method;
      if (!methodId) return null;
      const methodItem = dataset.getHerbalMethod(methodId);
      if (methodItem) {
        const labelMap = methodItem.prefLabel || methodItem.name;
        if (labelMap) {
          return labelMap[locale.value] || labelMap["en"] || methodId;
        }
      }
      return methodId.split("/").pop() || methodId;
    });
    const prepImage = computed(() => {
      var _a;
      return ((_a = sourcePlant.value) == null ? void 0 : _a.image) || null;
    });
    const imageError = ref(false);
    const displayImage = computed(() => {
      var _a;
      if (imageError.value && ((_a = sourcePlant.value) == null ? void 0 : _a.image)) {
        return sourcePlant.value.image;
      }
      return prepImage.value;
    });
    const imageAttribution = computed(() => {
      const imagePath = prepImage.value;
      if (!imagePath) return null;
      const match = imagePath.match(/media\/images\/([^/]+)\//);
      if (!match) return null;
      const slug2 = match[1];
      const metadata = dataset.getImageMetadata(slug2);
      return (metadata == null ? void 0 : metadata.attribution) || null;
    });
    watch(slug, () => {
      imageError.value = false;
    });
    const plantSlug = computed(() => {
      var _a;
      if (!((_a = sourcePlant.value) == null ? void 0 : _a["@id"])) return "";
      const parts = sourcePlant.value["@id"].split("/");
      return parts[parts.length - 1] || "";
    });
    const plantPreparationCount = computed(() => {
      if (!plantSlug.value) return 0;
      return dataset.getPreparationCountForPlant(plantSlug.value);
    });
    const chemicalCompoundLabels = computed(() => {
      var _a;
      if (!((_a = sourcePlant.value) == null ? void 0 : _a.containsChemical)) return [];
      return getCompoundLabels(sourcePlant.value.containsChemical);
    });
    const externalLinks = computed(() => {
      var _a, _b;
      const links = [];
      if ((_a = sourcePlant.value) == null ? void 0 : _a.wikidataID) {
        links.push({
          url: `https://www.wikidata.org/entity/${sourcePlant.value.wikidataID}`,
          label: t("links.wikidata"),
          icon: "📊"
        });
      }
      if ((_b = sourcePlant.value) == null ? void 0 : _b.gbifID) {
        links.push({
          url: `https://www.gbif.org/species/${sourcePlant.value.gbifID}`,
          label: t("links.gbif"),
          icon: "🌿"
        });
      }
      return links;
    });
    const hasExternalLinks = computed(() => externalLinks.value.length > 0);
    const natureLabel = computed(() => {
      var _a, _b;
      return getNatureLabel((_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.hasNature);
    });
    const flavorLabels = computed(() => {
      var _a, _b;
      return getFlavorLabels((_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.hasFlavor);
    });
    const meridianLabels = computed(() => {
      var _a, _b;
      return getMeridianLabels((_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.entersMeridian);
    });
    const categoryLabel = computed(() => {
      var _a, _b;
      return getCategoryLabel((_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.hasCategory);
    });
    const tcmHistory = computed(() => {
      var _a;
      return localizer.getTCMHistory((_a = profiles.value) == null ? void 0 : _a.tcm);
    });
    const tcmTraditionalUsage = computed(() => {
      var _a;
      return localizer.getTCMTraditionalUsage((_a = profiles.value) == null ? void 0 : _a.tcm);
    });
    const tcmFunctions = computed(() => {
      var _a;
      return localizer.getTCMFunctions((_a = profiles.value) == null ? void 0 : _a.tcm);
    });
    const tcmModernResearch = computed(() => {
      var _a;
      return localizer.getTCMModernResearch((_a = profiles.value) == null ? void 0 : _a.tcm);
    });
    const tcmContraindications = computed(() => {
      var _a, _b;
      const c = (_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.contraindications;
      if (!c) return null;
      if (typeof c === "string") return c;
      return c[locale.value] || c["en"] || c["zh-Hant"];
    });
    const tcmIncompatibilities = computed(() => {
      var _a, _b;
      const i = (_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.incompatibilities;
      if (!i) return null;
      if (typeof i === "string") return i;
      return i[locale.value] || i["en"] || i["zh-Hant"];
    });
    const tcmDosage = computed(() => {
      var _a, _b;
      const d = (_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.dosage;
      if (!d) return null;
      if (typeof d === "string") return d;
      return d[locale.value] || d["en"] || d["zh-Hant"];
    });
    const tcmClassicalReferences = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.classicalReferences) || [];
    });
    const tcmDosageEffect = computed(() => {
      var _a, _b;
      return (_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.dosageEffect;
    });
    const tcmComparisonNotes = computed(() => {
      var _a, _b;
      const c = (_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.comparisonNotes;
      if (!c) return null;
      if (typeof c === "string") return c;
      return c[locale.value] || c["en"] || c["zh-Hant"];
    });
    const preparationDetails = computed(() => {
      var _a;
      const d = (_a = preparation.value) == null ? void 0 : _a.preparationDetails;
      if (!d) return null;
      if (typeof d === "string") return d;
      return d[locale.value] || d["en"] || d["zh-Hant"];
    });
    const preparationAppearance = computed(() => {
      var _a;
      const a = (_a = preparation.value) == null ? void 0 : _a.appearance;
      if (!a) return null;
      if (typeof a === "string") return a;
      return a[locale.value] || a["en"] || a["zh-Hant"];
    });
    const storageRequirements = computed(() => {
      var _a;
      const s = (_a = preparation.value) == null ? void 0 : _a.storageRequirements;
      if (!s) return null;
      if (typeof s === "string") return s;
      return s[locale.value] || s["en"] || s["zh-Hant"];
    });
    const shelfLife = computed(() => {
      var _a;
      return (_a = preparation.value) == null ? void 0 : _a.shelfLife;
    });
    const commonUsageCulinary = computed(() => {
      var _a, _b;
      const c = (_b = (_a = preparation.value) == null ? void 0 : _a.commonUsage) == null ? void 0 : _b.culinary;
      if (!c) return null;
      if (typeof c === "string") return c;
      return c[locale.value] || c["en"] || c["zh-Hant"];
    });
    const commonUsageAromatherapy = computed(() => {
      var _a, _b;
      const a = (_b = (_a = preparation.value) == null ? void 0 : _a.commonUsage) == null ? void 0 : _b.aromatherapy;
      if (!a) return null;
      if (typeof a === "string") return a;
      return a[locale.value] || a["en"] || a["zh-Hant"];
    });
    const commonUsageCosmetic = computed(() => {
      var _a, _b;
      const c = (_b = (_a = preparation.value) == null ? void 0 : _a.commonUsage) == null ? void 0 : _b.cosmetic;
      if (!c) return null;
      if (typeof c === "string") return c;
      return c[locale.value] || c["en"] || c["zh-Hant"];
    });
    const commonUsageIndustrial = computed(() => {
      var _a, _b;
      const i = (_b = (_a = preparation.value) == null ? void 0 : _a.commonUsage) == null ? void 0 : _b.industrial;
      if (!i) return null;
      if (typeof i === "string") return i;
      return i[locale.value] || i["en"] || i["zh-Hant"];
    });
    const hasCommonUsage = computed(
      () => commonUsageCulinary.value || commonUsageAromatherapy.value || commonUsageCosmetic.value || commonUsageIndustrial.value
    );
    const safetyWarnings = computed(() => {
      var _a, _b;
      const warnings = ((_b = (_a = preparation.value) == null ? void 0 : _a.safetyInfo) == null ? void 0 : _b.warnings) || [];
      if (!warnings.length) return [];
      return warnings.map((w) => {
        if (typeof w === "string") return w;
        return w[locale.value] || w["en"] || w["zh-Hant"] || Object.values(w)[0];
      });
    });
    const natureClass = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.tcm) == null ? void 0 : _b.hasNature)) return "";
      const id = typeof profiles.value.tcm.hasNature === "object" ? profiles.value.tcm.hasNature["@id"] : profiles.value.tcm.hasNature;
      if (typeof id === "string") {
        if (id.includes("hot")) return "tcm-nature--hot";
        if (id.includes("warm")) return "tcm-nature--warm";
        if (id.includes("neutral")) return "tcm-nature--neutral";
        if (id.includes("cool")) return "tcm-nature--cool";
        if (id.includes("cold")) return "tcm-nature--cold";
      }
      return "";
    });
    const actionLabels = computed(() => {
      var _a, _b;
      return getActionLabels((_b = (_a = profiles.value) == null ? void 0 : _a.western) == null ? void 0 : _b.hasAction);
    });
    const organLabels = computed(() => {
      var _a, _b;
      return getOrganLabels((_b = (_a = profiles.value) == null ? void 0 : _a.western) == null ? void 0 : _b.hasOrganAffinity);
    });
    const westernHistory = computed(() => {
      var _a;
      return localizer.getWesternHistory((_a = profiles.value) == null ? void 0 : _a.western);
    });
    const westernTraditionalUsage = computed(() => {
      var _a;
      return localizer.getWesternTraditionalUsage((_a = profiles.value) == null ? void 0 : _a.western);
    });
    const westernModernResearch = computed(() => {
      var _a;
      return localizer.getWesternModernResearch((_a = profiles.value) == null ? void 0 : _a.western);
    });
    function getLocalizedLangMap(langMap) {
      if (!langMap) return null;
      if (typeof langMap === "string") return langMap;
      return langMap[locale.value] || langMap["en"] || Object.values(langMap)[0];
    }
    function getRefItemLabel(item) {
      if (!item) return null;
      const labelMap = item.prefLabel || item.name;
      return getLocalizedLangMap(labelMap);
    }
    function extractLabel(iri) {
      if (!iri) return "";
      const parts = iri.split("/");
      return parts[parts.length - 1] || iri;
    }
    const rasaLabels = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.hasRasa)) return [];
      return profiles.value.ayurveda.hasRasa.map((ref2) => {
        const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
        const item = dataset.getRasa(id);
        return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) };
      });
    });
    const gunaLabels = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.hasGuna)) return [];
      return profiles.value.ayurveda.hasGuna.map((ref2) => {
        const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
        const item = dataset.getGuna(id);
        return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) };
      });
    });
    const viryaLabel = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.hasVirya)) return null;
      const id = typeof profiles.value.ayurveda.hasVirya === "object" ? profiles.value.ayurveda.hasVirya["@id"] : profiles.value.ayurveda.hasVirya;
      const item = dataset.getVirya(id);
      return item ? getRefItemLabel(item) : extractLabel(id);
    });
    const viryaClass = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.hasVirya)) return "";
      const id = typeof profiles.value.ayurveda.hasVirya === "object" ? profiles.value.ayurveda.hasVirya["@id"] : profiles.value.ayurveda.hasVirya;
      if (typeof id === "string") {
        if (id.includes("heating")) return "ayurveda-virya--heating";
        if (id.includes("cooling")) return "ayurveda-virya--cooling";
      }
      return "";
    });
    const vipakaLabel = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.hasVipaka)) return null;
      const id = typeof profiles.value.ayurveda.hasVipaka === "object" ? profiles.value.ayurveda.hasVipaka["@id"] : profiles.value.ayurveda.hasVipaka;
      const item = dataset.getVipaka(id);
      return item ? getRefItemLabel(item) : extractLabel(id);
    });
    const ayurvedaTraditionalUsage = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.ayurvedaTraditionalUsage);
    });
    const ayurvedaModernResearch = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.ayurvedaModernResearch);
    });
    const ayurvedaContraindications = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.contraindications);
    });
    const ayurvedaDosage = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.dosage);
    });
    const ayurvedaCategoryLabel = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.ayurvedaCategory)) return null;
      const id = typeof profiles.value.ayurveda.ayurvedaCategory === "object" ? profiles.value.ayurveda.ayurvedaCategory["@id"] : profiles.value.ayurveda.ayurvedaCategory;
      const item = dataset.getAyurvedaCategory(id);
      return item ? getRefItemLabel(item) : extractLabel(id);
    });
    const ayurvedaClassicalReferences = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.classicalReferences) || [];
    });
    const ayurvedaAnupana = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.anupana) || [];
    });
    const ayurvedaSevanaKala = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.sevanaKala) || null;
    });
    const ayurvedaSevanaKalaLabel = computed(() => {
      if (!ayurvedaSevanaKala.value) return null;
      const kalaMap = {
        "pratah": "Morning (Pratah Kala)",
        "madhyahna": "Midday (Madhyahna Kala)",
        "sayam": "Evening (Sayam Kala)",
        "ratrau": "Night (Ratrau Kala)",
        "bhaktad": "After Food (Bhaktad)",
        "abhyantara": "Between Meals (Abhyantara)"
      };
      return kalaMap[ayurvedaSevanaKala.value] || ayurvedaSevanaKala.value;
    });
    const ayurvedaSevanaKalaDesc = computed(() => {
      if (!ayurvedaSevanaKala.value) return null;
      const descMap = {
        "pratah": "Best taken in the morning for digestive and energizing effects",
        "madhyahna": "Best taken at midday when digestive fire is strongest",
        "sayam": "Best taken in the evening for calming and restorative effects",
        "ratrau": "Best taken at night for sleep and rejuvenation",
        "bhaktad": "Best taken after meals for digestive support",
        "abhyantara": "Best taken between meals for optimal absorption"
      };
      return descMap[ayurvedaSevanaKala.value] || null;
    });
    const ayurvedaFormulations = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.ayurveda) == null ? void 0 : _b.formulations) || [];
    });
    const temperamentLabel = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.hasTemperament)) return null;
      const id = typeof profiles.value.persian.hasTemperament === "object" ? profiles.value.persian.hasTemperament["@id"] : profiles.value.persian.hasTemperament;
      const item = dataset.getTemperament(id);
      return item ? getRefItemLabel(item) : extractLabel(id);
    });
    const temperamentClass = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.hasTemperament)) return "";
      const id = typeof profiles.value.persian.hasTemperament === "object" ? profiles.value.persian.hasTemperament["@id"] : profiles.value.persian.hasTemperament;
      if (typeof id === "string") {
        if (id.includes("hot-dry")) return "persian-temperament--hot-dry";
        if (id.includes("hot-wet")) return "persian-temperament--hot-wet";
        if (id.includes("cold-dry")) return "persian-temperament--cold-dry";
        if (id.includes("cold-wet")) return "persian-temperament--cold-wet";
      }
      return "";
    });
    const persianElementLabels = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.hasElement)) return [];
      return profiles.value.persian.hasElement.map((ref2) => {
        const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
        const item = dataset.getPersianElement(id);
        return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) };
      });
    });
    const persianFunctions = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.persianFunctions);
    });
    const persianModernResearch = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.modernResearch);
    });
    const persianContraindications = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.contraindications);
    });
    const persianDosage = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.dosage);
    });
    computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.arabicName) || null;
    });
    const persianAffectedOrgans = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.affectedOrgans) || [];
    });
    const persianMizajConstituents = computed(() => {
      var _a, _b;
      const constituents = ((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.mizajConstituents) || [];
      return constituents.map((c) => ({
        substance: c.substance,
        temperament: c.temperament ? `${c.temperament.hot || ""}/${c.temperament.cold || ""} ${c.temperament.dry || ""}/${c.temperament.wet || ""}`.trim() : null
      }));
    });
    const persianCorrective = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.corrective) || [];
    });
    const persianSubstitute = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.substitute) || [];
    });
    const persianDosageForms = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.dosageForm) || [];
    });
    const persianAdverseEffects = computed(() => {
      var _a, _b;
      const effects = (_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.adverseEffects;
      if (!effects) return null;
      if (typeof effects === "string") return effects;
      return getLocalizedLangMap(effects);
    });
    const persianClassicalReferences = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.classicalReferences) || [];
    });
    const persianNomadicUsage = computed(() => {
      var _a, _b;
      const usage = (_b = (_a = profiles.value) == null ? void 0 : _a.persian) == null ? void 0 : _b.nomadicUsage;
      if (!usage) return null;
      if (typeof usage === "string") return usage;
      return getLocalizedLangMap(usage);
    });
    const mongolianElementLabels = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.hasElement)) return [];
      return profiles.value.mongolian.hasElement.map((ref2) => {
        const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
        const item = dataset.getMongolianElement(id);
        return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) };
      });
    });
    const mongolianTasteLabels = computed(() => {
      var _a, _b;
      if (!((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.hasTaste)) return [];
      return profiles.value.mongolian.hasTaste.map((ref2) => {
        const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
        const item = dataset.getMongolianTaste(id);
        return item ? { id, label: getRefItemLabel(item) || extractLabel(id) } : { id, label: extractLabel(id) };
      });
    });
    const mongolianFunctions = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.mongolianFunctions);
    });
    const mongolianModernResearch = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.modernResearch);
    });
    const mongolianContraindications = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.contraIndications);
    });
    const mongolianDosage = computed(() => {
      var _a, _b;
      return getLocalizedLangMap((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.dosage);
    });
    computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.tibetanWylie) || null;
    });
    const mongolianTherapeuticClass = computed(() => {
      var _a, _b;
      const therapeuticClass = (_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.therapeuticClass;
      if (!therapeuticClass) return null;
      if (typeof therapeuticClass === "string") return therapeuticClass;
      return getLocalizedLangMap(therapeuticClass);
    });
    const mongolianPreparationMethods = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.preparationMethod) || [];
    });
    const mongolianClassicalReferences = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.classicalReferences) || [];
    });
    const mongolianFormulations = computed(() => {
      var _a, _b;
      return ((_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.formulations) || [];
    });
    const mongolianNomadicUsage = computed(() => {
      var _a, _b;
      const usage = (_b = (_a = profiles.value) == null ? void 0 : _a.mongolian) == null ? void 0 : _b.nomadicUsage;
      if (!usage) return null;
      if (typeof usage === "string") return usage;
      return getLocalizedLangMap(usage);
    });
    const relatedPreparationsData = computed(() => {
      if (!slug.value) return [];
      return useRelatedPreparations(slug.value).value;
    });
    const relatedPreparations = relatedPreparationsData;
    const hasSafetyInfo = computed(() => {
      var _a, _b, _c;
      return ((_a = preparation.value) == null ? void 0 : _a.safetyInfo) && (((_b = preparation.value.safetyInfo.allergens) == null ? void 0 : _b.length) || preparation.value.safetyInfo.pregnancySafety || ((_c = preparation.value.safetyInfo.drugInteractions) == null ? void 0 : _c.length));
    });
    function getLocalizedSafety(langMap) {
      if (!langMap) return null;
      if (typeof langMap === "string") return langMap;
      return langMap[locale.value] || langMap["en"] || Object.values(langMap)[0];
    }
    function getSlug(prep) {
      if (!(prep == null ? void 0 : prep["@id"])) return "";
      const parts = prep["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getPrepName(prep) {
      return localizer.getName(prep) || getSlug(prep);
    }
    function getScientificName(prep) {
      var _a;
      const s = getSlug(prep);
      const plant = useSourcePlant(s);
      return ((_a = plant.value) == null ? void 0 : _a.scientificName) || null;
    }
    function formatImagePath(img) {
      if (!img) return null;
      return img.startsWith("/@herbapedia") ? img : `/${img}`;
    }
    function getImage(prep) {
      var _a;
      const s = getSlug(prep);
      const plant = useSourcePlant(s);
      return formatImagePath((_a = plant.value) == null ? void 0 : _a.image);
    }
    watch(slug, (newSlug) => {
      var _a, _b, _c, _d, _e;
      if (newSlug) {
        const prepData = usePreparation(newSlug);
        preparation.value = prepData.value;
        if (preparation.value) {
          const plantData = useSourcePlant(newSlug);
          sourcePlant.value = plantData.value;
          const profileData = useProfilesForPreparation(newSlug);
          profiles.value = profileData.value;
          if ((_a = profileData.value) == null ? void 0 : _a.tcm) {
            activeProfile.value = "tcm";
          } else if ((_b = profileData.value) == null ? void 0 : _b.western) {
            activeProfile.value = "western";
          } else if ((_c = profileData.value) == null ? void 0 : _c.ayurveda) {
            activeProfile.value = "ayurveda";
          } else if ((_d = profileData.value) == null ? void 0 : _d.persian) {
            activeProfile.value = "persian";
          } else if ((_e = profileData.value) == null ? void 0 : _e.mongolian) {
            activeProfile.value = "mongolian";
          }
        }
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "preparation-detail-view" }, _attrs))} data-v-ceeade78><div class="container container-narrow" data-v-ceeade78><nav class="breadcrumbs" data-v-ceeade78>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/preparations")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.preparations") || "Preparations")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.preparations") || "Preparations"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-ceeade78>/</span><span data-v-ceeade78>${ssrInterpolate(prepTitle.value)}</span></nav>`);
      if (preparation.value) {
        _push(`<article class="preparation-detail" data-v-ceeade78><header class="preparation-detail__header" data-v-ceeade78><div class="preparation-detail__image-wrapper" data-v-ceeade78>`);
        if (displayImage.value) {
          _push(`<img${ssrRenderAttr("src", displayImage.value)}${ssrRenderAttr("alt", prepTitle.value)} class="preparation-detail__image" data-v-ceeade78>`);
        } else {
          _push(`<div class="preparation-detail__placeholder" data-v-ceeade78><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-ceeade78><path d="M12 2L2 7l10 5 10-5-10-5z" data-v-ceeade78></path><path d="M2 17l10 5 10-5" data-v-ceeade78></path><path d="M2 12l10 5 10-5" data-v-ceeade78></path></svg><span class="preparation-detail__placeholder-text" data-v-ceeade78>${ssrInterpolate(unref(t)("plants.noImage"))}</span></div>`);
        }
        if (imageAttribution.value && displayImage.value) {
          _push(`<div class="preparation-detail__attribution" data-v-ceeade78>`);
          if (imageAttribution.value.spdxId && imageAttribution.value.spdxId !== "NONE") {
            _push(`<span class="attribution-license" data-v-ceeade78>`);
            if (imageAttribution.value.spdxUrl) {
              _push(`<a${ssrRenderAttr("href", imageAttribution.value.spdxUrl)} target="_blank" rel="noopener noreferrer" data-v-ceeade78>${ssrInterpolate(imageAttribution.value.spdxId)}</a>`);
            } else {
              _push(`<span data-v-ceeade78>${ssrInterpolate(imageAttribution.value.spdxId)}</span>`);
            }
            _push(`</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="attribution-source" data-v-ceeade78>${ssrInterpolate(imageAttribution.value.copyright)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="preparation-detail__meta" data-v-ceeade78><div class="preparation-detail__badges" data-v-ceeade78>`);
        if ((_a = profiles.value) == null ? void 0 : _a.tcm) {
          _push(`<span class="preparation-detail__badge preparation-detail__badge--tcm" data-v-ceeade78>TCM</span>`);
        } else {
          _push(`<!---->`);
        }
        if ((_b = profiles.value) == null ? void 0 : _b.western) {
          _push(`<span class="preparation-detail__badge preparation-detail__badge--western" data-v-ceeade78>Western</span>`);
        } else {
          _push(`<!---->`);
        }
        if ((_c = profiles.value) == null ? void 0 : _c.ayurveda) {
          _push(`<span class="preparation-detail__badge preparation-detail__badge--ayurveda" data-v-ceeade78>Ayurveda</span>`);
        } else {
          _push(`<!---->`);
        }
        if ((_d = profiles.value) == null ? void 0 : _d.persian) {
          _push(`<span class="preparation-detail__badge preparation-detail__badge--persian" data-v-ceeade78>Persian</span>`);
        } else {
          _push(`<!---->`);
        }
        if ((_e = profiles.value) == null ? void 0 : _e.mongolian) {
          _push(`<span class="preparation-detail__badge preparation-detail__badge--mongolian" data-v-ceeade78>Mongolian</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="preparation-detail__title" data-v-ceeade78>${ssrInterpolate(prepTitle.value)}</h1>`);
        if (prepCommonName.value) {
          _push(`<p class="preparation-detail__common-name" data-v-ceeade78>${ssrInterpolate(prepCommonName.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if ((_f = sourcePlant.value) == null ? void 0 : _f.scientificName) {
          _push(`<p class="preparation-detail__scientific" data-v-ceeade78>${ssrInterpolate(sourcePlant.value.scientificName)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (prepForm.value || prepMethod.value) {
          _push(`<div class="preparation-detail__form-method" data-v-ceeade78>`);
          if (prepForm.value) {
            _push(`<span class="prep-form-badge" data-v-ceeade78>${ssrInterpolate(prepForm.value)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (prepMethod.value) {
            _push(`<span class="prep-method-badge" data-v-ceeade78>${ssrInterpolate(prepMethod.value)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (sourcePlant.value) {
          _push(`<section class="preparation-detail__section preparation-detail__source" data-v-ceeade78><h2 class="section-title" data-v-ceeade78><span class="section-title__icon" data-v-ceeade78>↑</span> ${ssrInterpolate(unref(t)("preparations.botanicalSource"))}</h2><div class="botanical-source" data-v-ceeade78><div class="botanical-source__info" data-v-ceeade78><div class="botanical-source__row" data-v-ceeade78><span class="botanical-source__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.scientificName"))}</span>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: localePath(`/sources/botanical/${plantSlug.value}`),
            class: "botanical-source__value botanical-source__value--scientific botanical-source__link--inline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(sourcePlant.value.scientificName)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(sourcePlant.value.scientificName), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          if (sourcePlant.value.family || sourcePlant.value.genus) {
            _push(`<div class="botanical-source__row" data-v-ceeade78><span class="botanical-source__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.family"))} / ${ssrInterpolate(unref(t)("preparations.genus"))}</span><span class="botanical-source__value" data-v-ceeade78>${ssrInterpolate(sourcePlant.value.family)} ${ssrInterpolate(sourcePlant.value.genus ? `| ${sourcePlant.value.genus}` : "")}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="botanical-source__plant-link" data-v-ceeade78>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: localePath(`/sources/botanical/${plantSlug.value}`),
            class: "plant-link-card"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="plant-link-card__icon" data-v-ceeade78${_scopeId}>🌿</div><div class="plant-link-card__content" data-v-ceeade78${_scopeId}><span class="plant-link-card__title" data-v-ceeade78${_scopeId}>${ssrInterpolate(unref(t)("preparations.viewPlantProfile"))}</span><span class="plant-link-card__subtitle" data-v-ceeade78${_scopeId}>${ssrInterpolate(unref(t)("preparations.preparationsFromPlant", { count: plantPreparationCount.value }))}</span></div><span class="plant-link-card__arrow" data-v-ceeade78${_scopeId}>→</span>`);
              } else {
                return [
                  createVNode("div", { class: "plant-link-card__icon" }, "🌿"),
                  createVNode("div", { class: "plant-link-card__content" }, [
                    createVNode("span", { class: "plant-link-card__title" }, toDisplayString(unref(t)("preparations.viewPlantProfile")), 1),
                    createVNode("span", { class: "plant-link-card__subtitle" }, toDisplayString(unref(t)("preparations.preparationsFromPlant", { count: plantPreparationCount.value })), 1)
                  ]),
                  createVNode("span", { class: "plant-link-card__arrow" }, "→")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          if (hasExternalLinks.value) {
            _push(`<div class="botanical-source__links" data-v-ceeade78><!--[-->`);
            ssrRenderList(externalLinks.value, (link) => {
              _push(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener noreferrer" class="botanical-source__link" data-v-ceeade78><span class="botanical-source__link-icon" data-v-ceeade78>${ssrInterpolate(link.icon)}</span> ${ssrInterpolate(link.label)} <span class="botanical-source__link-arrow" data-v-ceeade78>↗</span></a>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if (chemicalCompoundLabels.value.length > 0) {
            _push(`<div class="botanical-source__compounds" data-v-ceeade78><h4 class="botanical-source__compounds-title" data-v-ceeade78>${ssrInterpolate(unref(t)("compounds.title"))}</h4><div class="botanical-source__compounds-list" data-v-ceeade78><!--[-->`);
            ssrRenderList(chemicalCompoundLabels.value, (compound) => {
              _push(`<span class="compound-tag"${ssrRenderAttr("title", compound.description)} data-v-ceeade78>${ssrInterpolate(compound.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="preparation-detail__section preparation-detail__profiles" data-v-ceeade78><h2 class="section-title" data-v-ceeade78><span class="section-title__icon" data-v-ceeade78>↓</span> ${ssrInterpolate(unref(t)("preparations.systemProfiles"))}</h2><div class="profile-tabs" data-v-ceeade78>`);
        if ((_g = profiles.value) == null ? void 0 : _g.tcm) {
          _push(`<button class="${ssrRenderClass([{ "profile-tab--active": activeProfile.value === "tcm" }, "profile-tab"])}" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.tcm"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        if ((_h = profiles.value) == null ? void 0 : _h.western) {
          _push(`<button class="${ssrRenderClass([{ "profile-tab--active": activeProfile.value === "western" }, "profile-tab"])}" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.western"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        if ((_i = profiles.value) == null ? void 0 : _i.ayurveda) {
          _push(`<button class="${ssrRenderClass([{ "profile-tab--active": activeProfile.value === "ayurveda" }, "profile-tab"])}" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.ayurveda"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        if ((_j = profiles.value) == null ? void 0 : _j.persian) {
          _push(`<button class="${ssrRenderClass([{ "profile-tab--active": activeProfile.value === "persian" }, "profile-tab"])}" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.persian"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        if ((_k = profiles.value) == null ? void 0 : _k.mongolian) {
          _push(`<button class="${ssrRenderClass([{ "profile-tab--active": activeProfile.value === "mongolian" }, "profile-tab"])}" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.mongolian"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (activeProfile.value === "tcm" && ((_l = profiles.value) == null ? void 0 : _l.tcm)) {
          _push(`<div class="profile-content" data-v-ceeade78><div class="tcm-properties" data-v-ceeade78>`);
          if (natureLabel.value) {
            _push(`<div class="tcm-property" data-v-ceeade78><span class="tcm-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("tcm.nature"))}</span><span class="${ssrRenderClass([natureClass.value, "tcm-property__value"])}" data-v-ceeade78>${ssrInterpolate(natureLabel.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (flavorLabels.value.length > 0) {
            _push(`<div class="tcm-property" data-v-ceeade78><span class="tcm-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("tcm.flavor"))}</span><div class="tcm-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(flavorLabels.value, (flavor) => {
              _push(`<span class="tcm-tag tcm-tag--flavor" data-v-ceeade78>${ssrInterpolate(flavor.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (meridianLabels.value.length > 0) {
            _push(`<div class="tcm-property" data-v-ceeade78><span class="tcm-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("tcm.meridian"))}</span><div class="tcm-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(meridianLabels.value, (meridian) => {
              _push(`<span class="tcm-tag tcm-tag--meridian" data-v-ceeade78>${ssrInterpolate(meridian.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryLabel.value) {
            _push(`<div class="tcm-property" data-v-ceeade78><span class="tcm-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("tcm.category"))}</span><span class="tcm-property__value" data-v-ceeade78>${ssrInterpolate(categoryLabel.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (profiles.value.tcm.pinyin) {
            _push(`<div class="tcm-property" data-v-ceeade78><span class="tcm-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("tcm.pinyin"))}</span><span class="tcm-property__value tcm-property__value--italic" data-v-ceeade78>${ssrInterpolate(profiles.value.tcm.pinyin)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (tcmHistory.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.history"))}</h3><p data-v-ceeade78>${ssrInterpolate(tcmHistory.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmTraditionalUsage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.traditionalUsage"))}</h3><p style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-ceeade78>${ssrInterpolate(tcmTraditionalUsage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmFunctions.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.functions"))}</h3><p style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-ceeade78>${ssrInterpolate(tcmFunctions.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_m = profiles.value.tcm.indications) == null ? void 0 : _m.length) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.indications"))}</h3><ul class="profile-list" data-v-ceeade78><!--[-->`);
            ssrRenderList(profiles.value.tcm.indications, (indication, index) => {
              _push(`<li data-v-ceeade78>${ssrInterpolate(indication)}</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmModernResearch.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.modernResearch"))}</h3><p style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-ceeade78>${ssrInterpolate(tcmModernResearch.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmContraindications.value) {
            _push(`<div class="profile-section profile-section--warning" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.contraindications"))}</h3><p data-v-ceeade78>${ssrInterpolate(tcmContraindications.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmIncompatibilities.value) {
            _push(`<div class="profile-section profile-section--warning" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.incompatibilities"))}</h3><p data-v-ceeade78>${ssrInterpolate(tcmIncompatibilities.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmDosage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.dosage"))}</h3><p data-v-ceeade78>${ssrInterpolate(tcmDosage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmClassicalReferences.value.length > 0) {
            _push(`<div class="profile-section profile-section--classical" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.classicalReference"))}</h3><div class="classical-references" data-v-ceeade78><!--[-->`);
            ssrRenderList(tcmClassicalReferences.value, (ref2, index) => {
              _push(`<div class="classical-reference" data-v-ceeade78><div class="classical-reference__header" data-v-ceeade78><span class="classical-reference__text" data-v-ceeade78>${ssrInterpolate(ref2.text)}</span>`);
              if (ref2.reference) {
                _push(`<span class="classical-reference__section" data-v-ceeade78>${ssrInterpolate(ref2.reference)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              if (ref2.quote) {
                _push(`<p class="classical-reference__quote" data-v-ceeade78>${ssrInterpolate(ref2.quote)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmDosageEffect.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.dosageEffect"))}</h3><div class="dosage-effects" data-v-ceeade78>`);
            if (tcmDosageEffect.value.small) {
              _push(`<div class="dosage-effect dosage-effect--small" data-v-ceeade78><span class="dosage-effect__dose" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.smallDose"))}</span><span class="dosage-effect__effect" data-v-ceeade78>${ssrInterpolate(tcmDosageEffect.value.small.effect)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (tcmDosageEffect.value.medium) {
              _push(`<div class="dosage-effect dosage-effect--medium" data-v-ceeade78><span class="dosage-effect__dose" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.mediumDose"))}</span><span class="dosage-effect__effect" data-v-ceeade78>${ssrInterpolate(tcmDosageEffect.value.medium.effect)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (tcmDosageEffect.value.large) {
              _push(`<div class="dosage-effect dosage-effect--large" data-v-ceeade78><span class="dosage-effect__dose" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.largeDose"))}</span><span class="dosage-effect__effect" data-v-ceeade78>${ssrInterpolate(tcmDosageEffect.value.large.effect)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (tcmComparisonNotes.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.comparisonNotes"))}</h3><p data-v-ceeade78>${ssrInterpolate(tcmComparisonNotes.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeProfile.value === "western" && ((_n = profiles.value) == null ? void 0 : _n.western)) {
          _push(`<div class="profile-content" data-v-ceeade78><div class="western-properties" data-v-ceeade78>`);
          if (actionLabels.value.length > 0) {
            _push(`<div class="western-property" data-v-ceeade78><span class="western-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("western.actions"))}</span><div class="western-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(actionLabels.value, (action) => {
              _push(`<span class="western-tag western-tag--action" data-v-ceeade78>${ssrInterpolate(action.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (organLabels.value.length > 0) {
            _push(`<div class="western-property" data-v-ceeade78><span class="western-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("western.organAffinities"))}</span><div class="western-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(organLabels.value, (organ) => {
              _push(`<span class="western-tag western-tag--organ" data-v-ceeade78>${ssrInterpolate(organ.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (westernHistory.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.history"))}</h3><p data-v-ceeade78>${ssrInterpolate(westernHistory.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (westernTraditionalUsage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.traditionalUsage"))}</h3><p style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-ceeade78>${ssrInterpolate(westernTraditionalUsage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (westernModernResearch.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.modernResearch"))}</h3><p style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-ceeade78>${ssrInterpolate(westernModernResearch.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeProfile.value === "ayurveda" && ((_o = profiles.value) == null ? void 0 : _o.ayurveda)) {
          _push(`<div class="profile-content" data-v-ceeade78><div class="ayurveda-properties" data-v-ceeade78>`);
          if (profiles.value.ayurveda.sanskritTransliteration) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.sanskrit"))}</span><span class="ayurveda-property__value ayurveda-property__value--italic" data-v-ceeade78>${ssrInterpolate(profiles.value.ayurveda.sanskritTransliteration)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (profiles.value.ayurveda.hindiName) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.hindiName"))}</span><span class="ayurveda-property__value" data-v-ceeade78>${ssrInterpolate(profiles.value.ayurveda.hindiName)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (ayurvedaCategoryLabel.value) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.category"))}</span><span class="ayurveda-property__value" data-v-ceeade78>${ssrInterpolate(ayurvedaCategoryLabel.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (rasaLabels.value.length > 0) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.rasa"))}</span><div class="ayurveda-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(rasaLabels.value, (rasa) => {
              _push(`<span class="ayurveda-tag ayurveda-tag--rasa" data-v-ceeade78>${ssrInterpolate(rasa.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (gunaLabels.value.length > 0) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.guna"))}</span><div class="ayurveda-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(gunaLabels.value, (guna) => {
              _push(`<span class="ayurveda-tag ayurveda-tag--guna" data-v-ceeade78>${ssrInterpolate(guna.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (viryaLabel.value) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.virya"))}</span><span class="${ssrRenderClass([viryaClass.value, "ayurveda-property__value"])}" data-v-ceeade78>${ssrInterpolate(viryaLabel.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (vipakaLabel.value) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.vipaka"))}</span><span class="ayurveda-property__value" data-v-ceeade78>${ssrInterpolate(vipakaLabel.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (profiles.value.ayurveda.affectsDosha) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.dosha"))}</span><div class="dosha-effects" data-v-ceeade78>`);
            if (profiles.value.ayurveda.affectsDosha.vata) {
              _push(`<span class="dosha-tag dosha-tag--vata" data-v-ceeade78> Vata ${ssrInterpolate(profiles.value.ayurveda.affectsDosha.vata.effect === "decreases" ? "↓" : "↑")}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (profiles.value.ayurveda.affectsDosha.pitta) {
              _push(`<span class="dosha-tag dosha-tag--pitta" data-v-ceeade78> Pitta ${ssrInterpolate(profiles.value.ayurveda.affectsDosha.pitta.effect === "decreases" ? "↓" : "↑")}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (profiles.value.ayurveda.affectsDosha.kapha) {
              _push(`<span class="dosha-tag dosha-tag--kapha" data-v-ceeade78> Kapha ${ssrInterpolate(profiles.value.ayurveda.affectsDosha.kapha.effect === "decreases" ? "↓" : "↑")}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_p = profiles.value.ayurveda.karma) == null ? void 0 : _p.length) {
            _push(`<div class="ayurveda-property" data-v-ceeade78><span class="ayurveda-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.karma"))}</span><div class="ayurveda-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(profiles.value.ayurveda.karma.slice(0, 5), (k, index) => {
              _push(`<span class="ayurveda-tag ayurveda-tag--karma" data-v-ceeade78>${ssrInterpolate(k)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (ayurvedaTraditionalUsage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.traditionalUsage"))}</h3><p style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-ceeade78>${ssrInterpolate(ayurvedaTraditionalUsage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_q = profiles.value.ayurveda.indications) == null ? void 0 : _q.length) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.indications"))}</h3><ul class="profile-list" data-v-ceeade78><!--[-->`);
            ssrRenderList(profiles.value.ayurveda.indications, (indication, index) => {
              _push(`<li data-v-ceeade78>${ssrInterpolate(indication)}</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          if (ayurvedaClassicalReferences.value.length > 0) {
            _push(`<div class="profile-section profile-section--classical" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.classicalReference"))}</h3><div class="classical-references" data-v-ceeade78><!--[-->`);
            ssrRenderList(ayurvedaClassicalReferences.value, (ref2, index) => {
              _push(`<div class="classical-reference" data-v-ceeade78><div class="classical-reference__header" data-v-ceeade78><span class="classical-reference__text" data-v-ceeade78>${ssrInterpolate(ref2.text)}</span>`);
              if (ref2.reference) {
                _push(`<span class="classical-reference__section" data-v-ceeade78>${ssrInterpolate(ref2.reference)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              if (ref2.quote) {
                _push(`<p class="classical-reference__quote" data-v-ceeade78>${ssrInterpolate(ref2.quote)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (ayurvedaAnupana.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.anupana"))}</h3><div class="ayurveda-anupana" data-v-ceeade78><!--[-->`);
            ssrRenderList(ayurvedaAnupana.value, (item, index) => {
              _push(`<span class="anupana-tag" data-v-ceeade78>${ssrInterpolate(item)}</span>`);
            });
            _push(`<!--]--></div><p class="profile-section__hint" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.anupanaDesc"))}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (ayurvedaSevanaKala.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.sevanaKala"))}</h3><div class="sevana-kala" data-v-ceeade78><span class="sevana-kala__value" data-v-ceeade78>${ssrInterpolate(ayurvedaSevanaKalaLabel.value)}</span></div>`);
            if (ayurvedaSevanaKalaDesc.value) {
              _push(`<p class="profile-section__hint" data-v-ceeade78>${ssrInterpolate(ayurvedaSevanaKalaDesc.value)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (ayurvedaFormulations.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.formulations"))}</h3><div class="formulations-list" data-v-ceeade78><!--[-->`);
            ssrRenderList(ayurvedaFormulations.value, (formula, index) => {
              var _a2;
              _push(`<div class="formulation-card" data-v-ceeade78><h4 class="formulation-card__name" data-v-ceeade78>${ssrInterpolate(formula.name)}</h4>`);
              if (formula.description) {
                _push(`<p class="formulation-card__desc" data-v-ceeade78>${ssrInterpolate(formula.description)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if ((_a2 = formula.ingredients) == null ? void 0 : _a2.length) {
                _push(`<div class="formulation-card__ingredients" data-v-ceeade78><span class="formulation-card__label" data-v-ceeade78>${ssrInterpolate(unref(t)("formulas.ingredients"))}:</span><!--[-->`);
                ssrRenderList(formula.ingredients, (ing, i) => {
                  _push(`<span class="formulation-tag" data-v-ceeade78>${ssrInterpolate(ing)}</span>`);
                });
                _push(`<!--]--></div>`);
              } else {
                _push(`<!---->`);
              }
              if (formula.use) {
                _push(`<p class="formulation-card__use" data-v-ceeade78>${ssrInterpolate(unref(t)("ayurveda.formulationUse"))}: ${ssrInterpolate(formula.use)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (ayurvedaModernResearch.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.modernResearch"))}</h3><p style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-ceeade78>${ssrInterpolate(ayurvedaModernResearch.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (ayurvedaContraindications.value) {
            _push(`<div class="profile-section profile-section--warning" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.contraindications"))}</h3><p data-v-ceeade78>${ssrInterpolate(ayurvedaContraindications.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (ayurvedaDosage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.dosage"))}</h3><p data-v-ceeade78>${ssrInterpolate(ayurvedaDosage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeProfile.value === "persian" && ((_r = profiles.value) == null ? void 0 : _r.persian)) {
          _push(`<div class="profile-content" data-v-ceeade78><div class="persian-properties" data-v-ceeade78>`);
          if (profiles.value.persian.persianTransliteration) {
            _push(`<div class="persian-property" data-v-ceeade78><span class="persian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("persian.name"))}</span><span class="persian-property__value" data-v-ceeade78>${ssrInterpolate(profiles.value.persian.persianName)} (${ssrInterpolate(profiles.value.persian.persianTransliteration)})</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (profiles.value.persian.arabicName) {
            _push(`<div class="persian-property" data-v-ceeade78><span class="persian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("persian.arabicName"))}</span><span class="persian-property__value" dir="rtl" data-v-ceeade78>${ssrInterpolate(profiles.value.persian.arabicName)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (temperamentLabel.value) {
            _push(`<div class="persian-property" data-v-ceeade78><span class="persian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("persian.temperament"))}</span><span class="${ssrRenderClass([temperamentClass.value, "persian-property__value"])}" data-v-ceeade78>${ssrInterpolate(temperamentLabel.value)}`);
            if (profiles.value.persian.temperamentDegree) {
              _push(`<!--[--> (${ssrInterpolate(profiles.value.persian.temperamentDegree)}°)<!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianElementLabels.value.length > 0) {
            _push(`<div class="persian-property" data-v-ceeade78><span class="persian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("persian.elements"))}</span><div class="persian-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(persianElementLabels.value, (elem) => {
              _push(`<span class="persian-tag persian-tag--element" data-v-ceeade78>${ssrInterpolate(elem.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_s = profiles.value.persian.actions) == null ? void 0 : _s.length) {
            _push(`<div class="persian-property" data-v-ceeade78><span class="persian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("persian.actions"))}</span><div class="persian-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(profiles.value.persian.actions.slice(0, 5), (action, index) => {
              _push(`<span class="persian-tag persian-tag--action" data-v-ceeade78>${ssrInterpolate(action)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (persianFunctions.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.functions"))}</h3><p data-v-ceeade78>${ssrInterpolate(persianFunctions.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_t = profiles.value.persian.indications) == null ? void 0 : _t.length) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.indications"))}</h3><ul class="profile-list" data-v-ceeade78><!--[-->`);
            ssrRenderList(profiles.value.persian.indications, (indication, index) => {
              _push(`<li data-v-ceeade78>${ssrInterpolate(indication)}</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianAffectedOrgans.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("persian.affectedOrgans"))}</h3><div class="organ-tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(persianAffectedOrgans.value, (organ, index) => {
              _push(`<span class="organ-tag" data-v-ceeade78>${ssrInterpolate(organ)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianMizajConstituents.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("persian.mizajConstituents"))}</h3><div class="mizaj-list" data-v-ceeade78><!--[-->`);
            ssrRenderList(persianMizajConstituents.value, (constituent, index) => {
              _push(`<div class="mizaj-item" data-v-ceeade78><span class="mizaj-item__substance" data-v-ceeade78>${ssrInterpolate(constituent.substance)}</span>`);
              if (constituent.temperament) {
                _push(`<span class="mizaj-item__temp" data-v-ceeade78>${ssrInterpolate(constituent.temperament)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianCorrective.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("persian.corrective"))}</h3><p class="profile-section__hint" data-v-ceeade78>${ssrInterpolate(unref(t)("persian.correctiveDesc"))}</p><div class="corrective-tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(persianCorrective.value, (item, index) => {
              _push(`<span class="corrective-tag" data-v-ceeade78>${ssrInterpolate(item)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianSubstitute.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("persian.substitute"))}</h3><p class="profile-section__hint" data-v-ceeade78>${ssrInterpolate(unref(t)("persian.substituteDesc"))}</p><div class="substitute-tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(persianSubstitute.value, (item, index) => {
              _push(`<span class="substitute-tag" data-v-ceeade78>${ssrInterpolate(item)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianDosageForms.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("persian.dosageForm"))}</h3><div class="dosage-forms" data-v-ceeade78><!--[-->`);
            ssrRenderList(persianDosageForms.value, (form, index) => {
              _push(`<span class="dosage-form-tag" data-v-ceeade78>${ssrInterpolate(form)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianAdverseEffects.value) {
            _push(`<div class="profile-section profile-section--warning" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("persian.adverseEffects"))}</h3><p data-v-ceeade78>${ssrInterpolate(persianAdverseEffects.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianClassicalReferences.value.length > 0) {
            _push(`<div class="profile-section profile-section--classical" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.classicalReference"))}</h3><div class="classical-references" data-v-ceeade78><!--[-->`);
            ssrRenderList(persianClassicalReferences.value, (ref2, index) => {
              _push(`<div class="classical-reference" data-v-ceeade78><div class="classical-reference__header" data-v-ceeade78><span class="classical-reference__text" data-v-ceeade78>${ssrInterpolate(ref2.text)}</span>`);
              if (ref2.author) {
                _push(`<span class="classical-reference__section" data-v-ceeade78>${ssrInterpolate(ref2.author)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              if (ref2.quote) {
                _push(`<p class="classical-reference__quote" data-v-ceeade78>${ssrInterpolate(ref2.quote)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianNomadicUsage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("persian.nomadicUsage"))}</h3><p data-v-ceeade78>${ssrInterpolate(persianNomadicUsage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianModernResearch.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.modernResearch"))}</h3><p data-v-ceeade78>${ssrInterpolate(persianModernResearch.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianContraindications.value) {
            _push(`<div class="profile-section profile-section--warning" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.contraindications"))}</h3><p data-v-ceeade78>${ssrInterpolate(persianContraindications.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (persianDosage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.dosage"))}</h3><p data-v-ceeade78>${ssrInterpolate(persianDosage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeProfile.value === "mongolian" && ((_u = profiles.value) == null ? void 0 : _u.mongolian)) {
          _push(`<div class="profile-content" data-v-ceeade78><div class="mongolian-properties" data-v-ceeade78>`);
          if (profiles.value.mongolian.mongolianName) {
            _push(`<div class="mongolian-property" data-v-ceeade78><span class="mongolian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.name"))}</span><span class="mongolian-property__value" data-v-ceeade78>${ssrInterpolate(profiles.value.mongolian.mongolianName)}</span>`);
            if (profiles.value.mongolian.tibetanName) {
              _push(`<span class="mongolian-property__tibetan" data-v-ceeade78>${ssrInterpolate(profiles.value.mongolian.tibetanName)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianElementLabels.value.length > 0) {
            _push(`<div class="mongolian-property" data-v-ceeade78><span class="mongolian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.elements"))}</span><div class="mongolian-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(mongolianElementLabels.value, (elem) => {
              _push(`<span class="mongolian-tag mongolian-tag--element" data-v-ceeade78>${ssrInterpolate(elem.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (profiles.value.mongolian.affectsRoots) {
            _push(`<div class="mongolian-property" data-v-ceeade78><span class="mongolian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.roots"))}</span><div class="roots-effects" data-v-ceeade78>`);
            if (profiles.value.mongolian.affectsRoots.heyi) {
              _push(`<span class="roots-tag roots-tag--heyi" data-v-ceeade78> Heyi ${ssrInterpolate(profiles.value.mongolian.affectsRoots.heyi.effect === "decreases" ? "↓" : "↑")}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (profiles.value.mongolian.affectsRoots.xila) {
              _push(`<span class="roots-tag roots-tag--xila" data-v-ceeade78> Xila ${ssrInterpolate(profiles.value.mongolian.affectsRoots.xila.effect === "decreases" ? "↓" : "↑")}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (profiles.value.mongolian.affectsRoots.badagan) {
              _push(`<span class="roots-tag roots-tag--badagan" data-v-ceeade78> Badagan ${ssrInterpolate(profiles.value.mongolian.affectsRoots.badagan.effect === "decreases" ? "↓" : "↑")}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianTasteLabels.value.length > 0) {
            _push(`<div class="mongolian-property" data-v-ceeade78><span class="mongolian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.tastes"))}</span><div class="mongolian-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(mongolianTasteLabels.value, (taste) => {
              _push(`<span class="mongolian-tag mongolian-tag--taste" data-v-ceeade78>${ssrInterpolate(taste.label)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_v = profiles.value.mongolian.hasPotency) == null ? void 0 : _v.length) {
            _push(`<div class="mongolian-property" data-v-ceeade78><span class="mongolian-property__label" data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.potency"))}</span><div class="mongolian-property__tags" data-v-ceeade78><!--[-->`);
            ssrRenderList(profiles.value.mongolian.hasPotency.slice(0, 4), (p) => {
              _push(`<span class="mongolian-tag mongolian-tag--potency" data-v-ceeade78>${ssrInterpolate(extractLabel(p["@id"]))}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (mongolianFunctions.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.functions"))}</h3><p data-v-ceeade78>${ssrInterpolate(mongolianFunctions.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_w = profiles.value.mongolian.indications) == null ? void 0 : _w.length) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.indications"))}</h3><ul class="profile-list" data-v-ceeade78><!--[-->`);
            ssrRenderList(profiles.value.mongolian.indications, (indication, index) => {
              _push(`<li data-v-ceeade78>${ssrInterpolate(indication)}</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianTherapeuticClass.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.therapeuticClass"))}</h3><p data-v-ceeade78>${ssrInterpolate(mongolianTherapeuticClass.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianPreparationMethods.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.preparationMethods"))}</h3><div class="prep-methods" data-v-ceeade78><!--[-->`);
            ssrRenderList(mongolianPreparationMethods.value, (method, index) => {
              _push(`<span class="prep-method-tag" data-v-ceeade78>${ssrInterpolate(method)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianClassicalReferences.value.length > 0) {
            _push(`<div class="profile-section profile-section--classical" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.classicalReference"))}</h3><div class="classical-references" data-v-ceeade78><!--[-->`);
            ssrRenderList(mongolianClassicalReferences.value, (ref2, index) => {
              _push(`<div class="classical-reference" data-v-ceeade78><div class="classical-reference__header" data-v-ceeade78><span class="classical-reference__text" data-v-ceeade78>${ssrInterpolate(ref2.text)}</span>`);
              if (ref2.reference) {
                _push(`<span class="classical-reference__section" data-v-ceeade78>${ssrInterpolate(ref2.reference)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              if (ref2.quote) {
                _push(`<p class="classical-reference__quote" data-v-ceeade78>${ssrInterpolate(ref2.quote)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianFormulations.value.length > 0) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.formulations"))}</h3><div class="formulations-list" data-v-ceeade78><!--[-->`);
            ssrRenderList(mongolianFormulations.value, (formula, index) => {
              var _a2;
              _push(`<div class="formulation-card" data-v-ceeade78><h4 class="formulation-card__name" data-v-ceeade78>${ssrInterpolate(formula.name)}</h4>`);
              if (formula.description) {
                _push(`<p class="formulation-card__desc" data-v-ceeade78>${ssrInterpolate(formula.description)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if ((_a2 = formula.ingredients) == null ? void 0 : _a2.length) {
                _push(`<div class="formulation-card__ingredients" data-v-ceeade78><span class="formulation-card__label" data-v-ceeade78>${ssrInterpolate(unref(t)("formulas.ingredients"))}:</span><!--[-->`);
                ssrRenderList(formula.ingredients, (ing, i) => {
                  _push(`<span class="formulation-tag" data-v-ceeade78>${ssrInterpolate(ing)}</span>`);
                });
                _push(`<!--]--></div>`);
              } else {
                _push(`<!---->`);
              }
              if (formula.use) {
                _push(`<p class="formulation-card__use" data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.formulationUse"))}: ${ssrInterpolate(formula.use)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianNomadicUsage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("mongolian.nomadicUsage"))}</h3><p data-v-ceeade78>${ssrInterpolate(mongolianNomadicUsage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianModernResearch.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.modernResearch"))}</h3><p data-v-ceeade78>${ssrInterpolate(mongolianModernResearch.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianContraindications.value) {
            _push(`<div class="profile-section profile-section--warning" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.contraindications"))}</h3><p data-v-ceeade78>${ssrInterpolate(mongolianContraindications.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (mongolianDosage.value) {
            _push(`<div class="profile-section" data-v-ceeade78><h3 data-v-ceeade78>${ssrInterpolate(unref(t)("sections.dosage"))}</h3><p data-v-ceeade78>${ssrInterpolate(mongolianDosage.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
        if (preparationDetails.value || preparationAppearance.value || storageRequirements.value || shelfLife.value) {
          _push(`<section class="preparation-detail__section preparation-detail__prep-info" data-v-ceeade78><h2 class="section-title" data-v-ceeade78><span class="section-title__icon" data-v-ceeade78>📋</span> ${ssrInterpolate(unref(t)("preparations.preparationInfo"))}</h2><div class="prep-info-grid" data-v-ceeade78>`);
          if (preparationDetails.value) {
            _push(`<div class="prep-info-item prep-info-item--full" data-v-ceeade78><span class="prep-info-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.preparationDetails"))}</span><span class="prep-info-item__value" data-v-ceeade78>${ssrInterpolate(preparationDetails.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (preparationAppearance.value) {
            _push(`<div class="prep-info-item" data-v-ceeade78><span class="prep-info-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.appearance"))}</span><span class="prep-info-item__value" data-v-ceeade78>${ssrInterpolate(preparationAppearance.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (storageRequirements.value) {
            _push(`<div class="prep-info-item" data-v-ceeade78><span class="prep-info-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.storageRequirements"))}</span><span class="prep-info-item__value" data-v-ceeade78>${ssrInterpolate(storageRequirements.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (shelfLife.value) {
            _push(`<div class="prep-info-item" data-v-ceeade78><span class="prep-info-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.shelfLife"))}</span><span class="prep-info-item__value" data-v-ceeade78>${ssrInterpolate(shelfLife.value)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (hasCommonUsage.value) {
          _push(`<section class="preparation-detail__section preparation-detail__usage" data-v-ceeade78><h2 class="section-title" data-v-ceeade78><span class="section-title__icon" data-v-ceeade78>🍽</span> ${ssrInterpolate(unref(t)("preparations.commonUsage"))}</h2><div class="usage-grid" data-v-ceeade78>`);
          if (commonUsageCulinary.value) {
            _push(`<div class="usage-item" data-v-ceeade78><span class="usage-item__icon" data-v-ceeade78>🍴</span><div class="usage-item__content" data-v-ceeade78><span class="usage-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.culinaryUse"))}</span><span class="usage-item__value" data-v-ceeade78>${ssrInterpolate(commonUsageCulinary.value)}</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (commonUsageAromatherapy.value) {
            _push(`<div class="usage-item" data-v-ceeade78><span class="usage-item__icon" data-v-ceeade78>💨</span><div class="usage-item__content" data-v-ceeade78><span class="usage-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.aromatherapyUse"))}</span><span class="usage-item__value" data-v-ceeade78>${ssrInterpolate(commonUsageAromatherapy.value)}</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (commonUsageCosmetic.value) {
            _push(`<div class="usage-item" data-v-ceeade78><span class="usage-item__icon" data-v-ceeade78>💄</span><div class="usage-item__content" data-v-ceeade78><span class="usage-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.cosmeticUse"))}</span><span class="usage-item__value" data-v-ceeade78>${ssrInterpolate(commonUsageCosmetic.value)}</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (commonUsageIndustrial.value) {
            _push(`<div class="usage-item" data-v-ceeade78><span class="usage-item__icon" data-v-ceeade78>🏭</span><div class="usage-item__content" data-v-ceeade78><span class="usage-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.industrialUse"))}</span><span class="usage-item__value" data-v-ceeade78>${ssrInterpolate(commonUsageIndustrial.value)}</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(relatedPreparations).length > 0) {
          _push(`<section class="preparation-detail__section preparation-detail__related" data-v-ceeade78><h2 class="section-title" data-v-ceeade78><span class="section-title__icon" data-v-ceeade78>↔</span> ${ssrInterpolate(unref(t)("preparations.relatedPreparations"))}</h2><div class="related-preparations" data-v-ceeade78><!--[-->`);
          ssrRenderList(unref(relatedPreparations).slice(0, 4), (prep) => {
            _push(ssrRenderComponent(_component_router_link, {
              key: getSlug(prep),
              to: localePath(`/preparations/${getSlug(prep)}`),
              class: "related-preparation-card"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="related-preparation-card__image-wrapper" data-v-ceeade78${_scopeId}>`);
                  if (getImage(prep)) {
                    _push2(`<img${ssrRenderAttr("src", getImage(prep))}${ssrRenderAttr("alt", getPrepName(prep))} class="related-preparation-card__image" data-v-ceeade78${_scopeId}>`);
                  } else {
                    _push2(`<div class="related-preparation-card__placeholder" data-v-ceeade78${_scopeId}><span data-v-ceeade78${_scopeId}>🌿</span></div>`);
                  }
                  _push2(`</div><div class="related-preparation-card__content" data-v-ceeade78${_scopeId}><h4 class="related-preparation-card__name" data-v-ceeade78${_scopeId}>${ssrInterpolate(getPrepName(prep))}</h4>`);
                  if (getScientificName(prep)) {
                    _push2(`<p class="related-preparation-card__scientific" data-v-ceeade78${_scopeId}>${ssrInterpolate(getScientificName(prep))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><span class="related-preparation-card__arrow" data-v-ceeade78${_scopeId}>→</span>`);
                } else {
                  return [
                    createVNode("div", { class: "related-preparation-card__image-wrapper" }, [
                      getImage(prep) ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: getImage(prep),
                        alt: getPrepName(prep),
                        class: "related-preparation-card__image"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "related-preparation-card__placeholder"
                      }, [
                        createVNode("span", null, "🌿")
                      ]))
                    ]),
                    createVNode("div", { class: "related-preparation-card__content" }, [
                      createVNode("h4", { class: "related-preparation-card__name" }, toDisplayString(getPrepName(prep)), 1),
                      getScientificName(prep) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "related-preparation-card__scientific"
                      }, toDisplayString(getScientificName(prep)), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("span", { class: "related-preparation-card__arrow" }, "→")
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (hasSafetyInfo.value || safetyWarnings.value.length) {
          _push(`<section class="preparation-detail__section preparation-detail__safety" data-v-ceeade78><h2 class="section-title" data-v-ceeade78><span class="section-title__icon" data-v-ceeade78>⚠</span> ${ssrInterpolate(unref(t)("safety.title"))}</h2><div class="safety-info" data-v-ceeade78>`);
          if ((_y = (_x = preparation.value.safetyInfo) == null ? void 0 : _x.allergens) == null ? void 0 : _y.length) {
            _push(`<div class="safety-item" data-v-ceeade78><span class="safety-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.allergens"))}</span><span class="safety-item__value" data-v-ceeade78>${ssrInterpolate(preparation.value.safetyInfo.allergens.join(", "))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_z = preparation.value.safetyInfo) == null ? void 0 : _z.pregnancySafety) {
            _push(`<div class="safety-item" data-v-ceeade78><span class="safety-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.pregnancySafety"))}</span><span class="safety-item__value" data-v-ceeade78>${ssrInterpolate(getLocalizedSafety(preparation.value.safetyInfo.pregnancySafety))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_B = (_A = preparation.value.safetyInfo) == null ? void 0 : _A.drugInteractions) == null ? void 0 : _B.length) {
            _push(`<div class="safety-item" data-v-ceeade78><span class="safety-item__label" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.drugInteractions"))}</span><span class="safety-item__value" data-v-ceeade78>${ssrInterpolate(preparation.value.safetyInfo.drugInteractions.join(", "))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (safetyWarnings.value.length) {
            _push(`<div class="safety-warnings" data-v-ceeade78><h3 class="safety-warnings__title" data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.warnings"))}</h3><ul class="safety-warnings__list" data-v-ceeade78><!--[-->`);
            ssrRenderList(safetyWarnings.value, (warning, index) => {
              _push(`<li class="safety-warnings__item" data-v-ceeade78><span class="safety-warnings__icon" data-v-ceeade78>⚠</span><span data-v-ceeade78>${ssrInterpolate(warning)}</span></li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<aside class="preparation-detail__disclaimer" data-v-ceeade78><p data-v-ceeade78><strong data-v-ceeade78>${ssrInterpolate(unref(t)("disclaimer.title"))}:</strong> ${ssrInterpolate(unref(t)("disclaimer.text"))}</p></aside></article>`);
      } else {
        _push(`<div class="preparation-detail__not-found" data-v-ceeade78><h1 data-v-ceeade78>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-ceeade78>${ssrInterpolate(unref(t)("preparations.notFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath("/preparations"),
          class: "preparation-detail__back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("preparations.backToPreparations"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("preparations.backToPreparations")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/PreparationDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PreparationDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ceeade78"]]);
export {
  PreparationDetailView as default
};
