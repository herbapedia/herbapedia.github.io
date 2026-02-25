import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
function getLocalizedValue(langMap, locale, fallbackLocale = "en") {
  if (!langMap) return null;
  if (typeof langMap === "string") return langMap;
  if (typeof langMap === "object") {
    if (langMap[locale]) return langMap[locale];
    if (locale.startsWith("zh-H") && langMap["zh-Hant"]) return langMap["zh-Hant"];
    if (locale.startsWith("zh-") && langMap["zh-Hans"]) return langMap["zh-Hans"];
    if (langMap[fallbackLocale]) return langMap[fallbackLocale];
    const keys = Object.keys(langMap);
    if (keys.length > 0) return langMap[keys[0]];
  }
  return null;
}
function useAllPreparations() {
  return computed(() => dataset.getAllPreparations());
}
function usePreparation(slug) {
  return computed(() => {
    const s = typeof slug === "object" && "value" in slug ? slug.value : slug;
    return dataset.getPreparation(s) || null;
  });
}
function useRelatedPreparations(slug) {
  return computed(() => {
    const s = typeof slug === "object" && "value" in slug ? slug.value : slug;
    return dataset.getRelatedPreparations(s);
  });
}
function useProfilesForPreparation(slug) {
  return computed(() => {
    const s = typeof slug === "object" && "value" in slug ? slug.value : slug;
    return dataset.getProfilesForPreparation(s);
  });
}
function useSourcePlant(prepSlug) {
  return computed(() => {
    const s = typeof prepSlug === "object" && "value" in prepSlug ? prepSlug.value : prepSlug;
    return dataset.getSourcePlant(s);
  });
}
function useTcmReferences() {
  const { locale } = useI18n();
  const meridians = ref(dataset.getAllMeridians());
  const natures = ref(dataset.getAllNatures());
  const flavors = ref(dataset.getAllFlavors());
  const categories = ref(dataset.getAllCategories());
  function getLabel(item) {
    if (!item) return null;
    const labelMap = item.prefLabel || item.name;
    if (!labelMap) return null;
    return getLocalizedValue(labelMap, locale.value);
  }
  function getNatureLabel(natureRef) {
    if (!natureRef) return null;
    const id = typeof natureRef === "object" ? natureRef["@id"] : natureRef;
    const item = dataset.getNature(id);
    const label = item ? getLabel(item) : null;
    return label || id;
  }
  function getFlavorLabels(flavorRefs) {
    if (!flavorRefs || !Array.isArray(flavorRefs)) return [];
    return flavorRefs.map((ref2) => {
      const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
      const item = dataset.getFlavor(id);
      const label = item ? getLabel(item) : null;
      return { id, label: label || id };
    });
  }
  function getMeridianLabels(meridianRefs) {
    if (!meridianRefs || !Array.isArray(meridianRefs)) return [];
    return meridianRefs.map((ref2) => {
      const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
      const item = dataset.getMeridian(id);
      const label = item ? getLabel(item) : null;
      return { id, label: label || id };
    });
  }
  function getCategoryLabel(categoryRef) {
    if (!categoryRef) return null;
    const id = typeof categoryRef === "object" ? categoryRef["@id"] : categoryRef;
    const item = dataset.getCategory(id);
    const label = item ? getLabel(item) : null;
    return label || id;
  }
  return {
    meridians,
    natures,
    flavors,
    categories,
    getNatureLabel,
    getFlavorLabels,
    getMeridianLabels,
    getCategoryLabel
  };
}
function useWesternReferences() {
  const { locale } = useI18n();
  const actions = ref(dataset.getAllActions());
  const organs = ref(dataset.getAllOrgans());
  function getLabel(item) {
    if (!item) return null;
    const labelMap = item.prefLabel || item.name;
    if (!labelMap) return null;
    return getLocalizedValue(labelMap, locale.value);
  }
  function getActionLabels(actionRefs) {
    if (!actionRefs || !Array.isArray(actionRefs)) return [];
    return actionRefs.map((ref2) => {
      const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
      const item = dataset.getAction(id);
      const label = item ? getLabel(item) : null;
      return { id, label: label || id };
    });
  }
  function getOrganLabels(organRefs) {
    if (!organRefs || !Array.isArray(organRefs)) return [];
    return organRefs.map((ref2) => {
      const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
      const item = dataset.getOrgan(id);
      const label = item ? getLabel(item) : null;
      return { id, label: label || id };
    });
  }
  return {
    actions,
    organs,
    getActionLabels,
    getOrganLabels
  };
}
function useChemicalReferences() {
  const { locale } = useI18n();
  function getCompoundLabels(compoundRefs) {
    if (!compoundRefs || !Array.isArray(compoundRefs)) return [];
    return compoundRefs.map((ref2) => {
      const id = typeof ref2 === "object" ? ref2["@id"] : ref2;
      const compound = dataset.getChemical(id);
      let label = id;
      let description = null;
      if (compound) {
        if (compound.name) {
          label = getLocalizedValue(compound.name, locale.value);
        }
        if (compound.description) {
          description = getLocalizedValue(compound.description, locale.value);
        }
      } else {
        const parts = id.split("/");
        label = parts[parts.length - 1] || id;
      }
      return { id, label, description };
    });
  }
  return { getCompoundLabels };
}
function usePreparationLocalizer() {
  const { locale } = useI18n();
  const categoryLabels = {
    "chinese-herbs": { en: "Chinese Herbs", "zh-Hant": "中藥", "zh-Hans": "中药" },
    "western-herbs": { en: "Western Herbs", "zh-Hant": "西方草本", "zh-Hans": "西方草本" },
    "vitamins": { en: "Vitamins", "zh-Hant": "維生素", "zh-Hans": "维生素" },
    "minerals": { en: "Minerals", "zh-Hant": "礦物質", "zh-Hans": "矿物质" },
    "nutrients": { en: "Nutrients", "zh-Hant": "營養素", "zh-Hans": "营养素" },
    "preparations": { en: "All Preparations", "zh-Hant": "所有製劑", "zh-Hans": "所有制剂" }
  };
  return {
    getName: (prep) => {
      if (!prep) return null;
      return getLocalizedValue(prep.name, locale.value);
    },
    getDescription: (prep) => {
      if (!prep) return null;
      return getLocalizedValue(prep.description, locale.value);
    },
    getCommonName: (prep) => {
      if (!prep) return null;
      const plant = dataset.getSourcePlant(extractSlug(prep));
      if (plant == null ? void 0 : plant.commonName) {
        return getLocalizedValue(plant.commonName, locale.value);
      }
      return null;
    },
    getCategoryLabel: (categorySlug) => {
      const labels = categoryLabels[categorySlug];
      if (!labels) return categorySlug;
      return labels[locale.value] || labels["en"] || categorySlug;
    },
    getTCMHistory: (profile) => {
      if (!profile) return null;
      return getLocalizedValue(profile.tcmHistory, locale.value);
    },
    getTCMTraditionalUsage: (profile) => {
      if (!profile) return null;
      return getLocalizedValue(profile.tcmTraditionalUsage, locale.value);
    },
    getTCMModernResearch: (profile) => {
      if (!profile) return null;
      return getLocalizedValue(profile.tcmModernResearch, locale.value);
    },
    getTCMFunctions: (profile) => {
      if (!profile) return null;
      return getLocalizedValue(profile.tcmFunctions, locale.value);
    },
    getWesternHistory: (profile) => {
      if (!profile) return null;
      return getLocalizedValue(profile.westernHistory, locale.value);
    },
    getWesternTraditionalUsage: (profile) => {
      if (!profile) return null;
      return getLocalizedValue(profile.westernTraditionalUsage, locale.value);
    },
    getWesternModernResearch: (profile) => {
      if (!profile) return null;
      return getLocalizedValue(profile.westernModernResearch, locale.value);
    }
  };
}
function extractSlug(prep) {
  if (!(prep == null ? void 0 : prep["@id"])) return null;
  const parts = prep["@id"].split("/");
  return parts[parts.length - 1] || "";
}
function useDatasetStats() {
  return dataset.getCounts();
}
export {
  useDatasetStats as a,
  usePreparationLocalizer as b,
  useSourcePlant as c,
  useTcmReferences as d,
  useWesternReferences as e,
  useChemicalReferences as f,
  useRelatedPreparations as g,
  usePreparation as h,
  useProfilesForPreparation as i,
  useAllPreparations as u
};
