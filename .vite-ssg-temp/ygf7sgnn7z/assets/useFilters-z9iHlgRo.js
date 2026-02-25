import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
function useFilters() {
  const route = useRoute();
  const router = useRouter();
  const filters = reactive({
    search: "",
    system: {
      tcm: false,
      western: false,
      ayurveda: false,
      persian: false,
      mongolian: false,
      modern: false
    },
    tcm: {
      nature: null,
      // 'hot', 'warm', 'neutral', 'cool', 'cold'
      flavor: null,
      // 'pungent', 'sweet', 'sour', 'bitter', 'salty'
      meridian: null,
      // 'lung', 'spleen', 'stomach', etc.
      category: null
      // 'release-exterior', 'warm-interior', etc.
    },
    western: {
      action: null,
      // 'carminative', 'anti-inflammatory', etc.
      organ: null
      // 'digestive', 'nervous', 'circulatory', etc.
    }
  });
  const initialized = ref(false);
  function parseQueryParams() {
    const query = route.query;
    if (query.q) {
      filters.search = String(query.q);
    }
    if (query.system) {
      const systems = String(query.system).split(",");
      filters.system.tcm = systems.includes("tcm");
      filters.system.western = systems.includes("western");
      filters.system.ayurveda = systems.includes("ayurveda");
      filters.system.persian = systems.includes("persian");
      filters.system.mongolian = systems.includes("mongolian");
      filters.system.modern = systems.includes("modern");
    }
    if (query.nature) filters.tcm.nature = String(query.nature);
    if (query.flavor) filters.tcm.flavor = String(query.flavor);
    if (query.meridian) filters.tcm.meridian = String(query.meridian);
    if (query.tcmCategory) filters.tcm.category = String(query.tcmCategory);
    if (query.action) filters.western.action = String(query.action);
    if (query.organ) filters.western.organ = String(query.organ);
  }
  function buildQueryParams() {
    const query = {};
    if (filters.search) {
      query.q = filters.search;
    }
    const systems = [];
    if (filters.system.tcm) systems.push("tcm");
    if (filters.system.western) systems.push("western");
    if (filters.system.ayurveda) systems.push("ayurveda");
    if (filters.system.persian) systems.push("persian");
    if (filters.system.mongolian) systems.push("mongolian");
    if (filters.system.modern) systems.push("modern");
    if (systems.length > 0) {
      query.system = systems.join(",");
    }
    if (filters.tcm.nature) query.nature = filters.tcm.nature;
    if (filters.tcm.flavor) query.flavor = filters.tcm.flavor;
    if (filters.tcm.meridian) query.meridian = filters.tcm.meridian;
    if (filters.tcm.category) query.tcmCategory = filters.tcm.category;
    if (filters.western.action) query.action = filters.western.action;
    if (filters.western.organ) query.organ = filters.western.organ;
    return query;
  }
  function updateUrl() {
    const query = buildQueryParams();
    router.replace({ query });
  }
  function initFromUrl() {
    if (!initialized.value) {
      parseQueryParams();
      initialized.value = true;
    }
  }
  function clearFilters() {
    filters.search = "";
    filters.system.tcm = false;
    filters.system.western = false;
    filters.system.ayurveda = false;
    filters.system.persian = false;
    filters.system.mongolian = false;
    filters.system.modern = false;
    filters.tcm.nature = null;
    filters.tcm.flavor = null;
    filters.tcm.meridian = null;
    filters.tcm.category = null;
    filters.western.action = null;
    filters.western.organ = null;
    updateUrl();
  }
  const hasActiveFilters = computed(() => {
    return !!(filters.search || filters.system.tcm || filters.system.western || filters.system.ayurveda || filters.tcm.nature || filters.tcm.flavor || filters.tcm.meridian || filters.tcm.category || filters.western.action || filters.western.organ);
  });
  function applyFilters(preparations) {
    return preparations.filter((prep) => {
      var _a, _b, _c, _d;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const nameMatch = (_a = getPrepName(prep)) == null ? void 0 : _a.toLowerCase().includes(query);
        const sciMatch = (_b = getScientificName(prep)) == null ? void 0 : _b.toLowerCase().includes(query);
        if (!nameMatch && !sciMatch) return false;
      }
      if (filters.system.tcm && !prep.hasTCMProfile) return false;
      if (filters.system.western && !prep.hasWesternProfile) return false;
      if (filters.system.ayurveda && !prep.hasAyurvedaProfile) return false;
      if (filters.tcm.nature || filters.tcm.flavor || filters.tcm.meridian || filters.tcm.category) {
        const tcmProfile = resolveTCMProfile(prep);
        if (!tcmProfile) return false;
        if (filters.tcm.nature) {
          const natureId = ((_c = tcmProfile.hasNature) == null ? void 0 : _c["@id"]) || tcmProfile.hasNature;
          if (natureId !== `tcm/nature/${filters.tcm.nature}` && natureId !== filters.tcm.nature && !(natureId == null ? void 0 : natureId.includes(filters.tcm.nature))) {
            return false;
          }
        }
        if (filters.tcm.flavor) {
          const flavors = tcmProfile.hasFlavor || [];
          const hasFlavor = flavors.some((f) => {
            const id = f["@id"] || f;
            return id === `tcm/flavor/${filters.tcm.flavor}` || id === filters.tcm.flavor || (id == null ? void 0 : id.includes(filters.tcm.flavor));
          });
          if (!hasFlavor) return false;
        }
        if (filters.tcm.meridian) {
          const meridians = tcmProfile.entersMeridian || [];
          const hasMeridian = meridians.some((m) => {
            const id = m["@id"] || m;
            return id === `tcm/meridian/${filters.tcm.meridian}` || id === filters.tcm.meridian || (id == null ? void 0 : id.includes(filters.tcm.meridian));
          });
          if (!hasMeridian) return false;
        }
        if (filters.tcm.category) {
          const catId = ((_d = tcmProfile.hasCategory) == null ? void 0 : _d["@id"]) || tcmProfile.hasCategory;
          if (catId !== `tcm/category/${filters.tcm.category}` && catId !== filters.tcm.category && !(catId == null ? void 0 : catId.includes(filters.tcm.category))) {
            return false;
          }
        }
      }
      if (filters.western.action || filters.western.organ) {
        const westernProfile = resolveWesternProfile(prep);
        if (!westernProfile) return false;
        if (filters.western.action) {
          const actions = westernProfile.hasAction || [];
          const hasAction = actions.some((a) => {
            const id = a["@id"] || a;
            return id === `western/action/${filters.western.action}` || id === filters.western.action || (id == null ? void 0 : id.includes(filters.western.action));
          });
          if (!hasAction) return false;
        }
        if (filters.western.organ) {
          const organs = westernProfile.hasOrganAffinity || [];
          const hasOrgan = organs.some((o) => {
            const id = o["@id"] || o;
            return id === `western/organ/${filters.western.organ}` || id === filters.western.organ || (id == null ? void 0 : id.includes(filters.western.organ));
          });
          if (!hasOrgan) return false;
        }
      }
      return true;
    });
  }
  watch(
    () => route.query,
    () => {
      if (initialized.value) {
        clearFilters();
        parseQueryParams();
      }
    },
    { deep: true }
  );
  return {
    filters,
    initialized,
    initFromUrl,
    updateUrl,
    clearFilters,
    hasActiveFilters,
    applyFilters
  };
}
function getPrepName(prep) {
  if (!(prep == null ? void 0 : prep.name)) return null;
  if (typeof prep.name === "string") return prep.name;
  if (typeof prep.name === "object") {
    return prep.name.en || prep.name["zh-Hant"] || prep.name["zh-Hans"] || Object.values(prep.name)[0];
  }
  return null;
}
function getScientificName(prep) {
  const slug = extractSlug(prep);
  const plant = dataset.getSourcePlant(slug);
  return (plant == null ? void 0 : plant.scientificName) || null;
}
function extractSlug(prep) {
  if (!(prep == null ? void 0 : prep["@id"])) return null;
  const parts = prep["@id"].split("/");
  return parts[parts.length - 1] || "";
}
function resolveTCMProfile(prep) {
  var _a;
  if (!((_a = prep == null ? void 0 : prep.hasTCMProfile) == null ? void 0 : _a[0])) return null;
  const tcmSlug = extractSlug(prep.hasTCMProfile[0]);
  return dataset.getTCMProfile(tcmSlug);
}
function resolveWesternProfile(prep) {
  var _a;
  if (!((_a = prep == null ? void 0 : prep.hasWesternProfile) == null ? void 0 : _a[0])) return null;
  const westernSlug = extractSlug(prep.hasWesternProfile[0]);
  return dataset.getWesternProfile(westernSlug);
}
function useFilterOptions() {
  const { locale } = useI18n();
  const tcmNatures = computed(() => {
    const natures = dataset.getAllNatures();
    if (!natures || natures.length === 0) return [];
    return natures.map((n) => {
      const id = n["@id"];
      const slug = extractSlugFromId(id);
      return {
        value: slug,
        label: getLocalizedLabel(n, locale.value)
      };
    });
  });
  const tcmFlavors = computed(() => {
    const flavors = dataset.getAllFlavors();
    if (!flavors || flavors.length === 0) return [];
    return flavors.map((f) => {
      const id = f["@id"];
      const slug = extractSlugFromId(id);
      return {
        value: slug,
        label: getLocalizedLabel(f, locale.value)
      };
    });
  });
  const tcmCategories = computed(() => {
    const categories = dataset.getAllCategories();
    if (!categories || categories.length === 0) return [];
    return categories.map((cat) => {
      const id = cat["@id"];
      const slug = extractSlugFromId(id);
      return {
        value: slug,
        label: getLocalizedLabel(cat, locale.value)
      };
    });
  });
  const tcmMeridians = computed(() => {
    const meridians = dataset.getAllMeridians();
    if (!meridians || meridians.length === 0) return [];
    return meridians.map((m) => {
      const id = m["@id"];
      const slug = extractSlugFromId(id);
      return {
        value: slug,
        label: getLocalizedLabel(m, locale.value)
      };
    });
  });
  const westernActions = computed(() => {
    const actions = dataset.getAllActions();
    if (!actions || actions.length === 0) return [];
    return actions.map((a) => {
      const id = a["@id"];
      const slug = extractSlugFromId(id);
      return {
        value: slug,
        label: getLocalizedLabel(a, locale.value)
      };
    });
  });
  const westernOrgans = computed(() => {
    const organs = dataset.getAllOrgans();
    if (!organs || organs.length === 0) return [];
    return organs.map((o) => {
      const id = o["@id"];
      const slug = extractSlugFromId(id);
      return {
        value: slug,
        label: getLocalizedLabel(o, locale.value)
      };
    });
  });
  return {
    tcmNatures,
    tcmFlavors,
    tcmCategories,
    tcmMeridians,
    westernActions,
    westernOrgans
  };
}
function extractSlugFromId(id) {
  if (!id) return "";
  const parts = id.split("/");
  return parts[parts.length - 1] || id;
}
function getLocalizedLabel(item, locale = "en") {
  if (!item) return "";
  if (item.prefLabel) {
    if (typeof item.prefLabel === "string") return item.prefLabel;
    return item.prefLabel[locale] || item.prefLabel["en"] || Object.values(item.prefLabel)[0] || "";
  }
  if (item.name) {
    if (typeof item.name === "string") return item.name;
    return item.name[locale] || item.name["en"] || Object.values(item.name)[0] || "";
  }
  return item["@id"] || "";
}
export {
  useFilters as a,
  useFilterOptions as u
};
