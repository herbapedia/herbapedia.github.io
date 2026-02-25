import { createHead } from "@unhead/vue/server";
import { defineComponent, ref, onMounted, createSSRApp, useSSRContext, resolveComponent, mergeProps } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { createI18n } from "vue-i18n";
const ClientOnly = defineComponent({
  setup(props, { slots }) {
    const mounted = ref(false);
    onMounted(() => mounted.value = true);
    return () => {
      if (!mounted.value)
        return slots.placeholder && slots.placeholder({});
      return slots.default && slots.default({});
    };
  }
});
function ViteSSG(App2, routerOptions, fn, options) {
  const {
    transformState,
    registerComponents = true,
    useHead = true,
    rootContainer = "#app"
  } = {};
  async function createApp$1(routePath) {
    const app = createSSRApp(App2);
    let head;
    if (useHead) {
      app.use(head = createHead());
    }
    const router = createRouter({
      history: createMemoryHistory(routerOptions.base),
      ...routerOptions
    });
    const { routes: routes2 } = routerOptions;
    if (registerComponents)
      app.component("ClientOnly", ClientOnly);
    const appRenderCallbacks = [];
    const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app,
      head,
      isClient: false,
      router,
      routes: routes2,
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      initialState: {},
      transformState,
      routePath
    };
    await (fn == null ? void 0 : fn(context));
    app.use(router);
    let entryRoutePath;
    let isFirstRoute = true;
    router.beforeEach((to, from, next) => {
      if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
        isFirstRoute = false;
        entryRoutePath = to.path;
        to.meta.state = context.initialState;
      }
      next();
    });
    {
      const route = context.routePath ?? "/";
      router.push(route);
      await router.isReady();
      context.initialState = router.currentRoute.value.meta.state || {};
    }
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  return createApp$1;
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_router_view = resolveComponent("router-view");
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "app" }, _attrs))}><a href="#main-content" class="skip-link">Skip to main content</a>`);
  _push(ssrRenderComponent(_component_router_view, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
const SUPPORTED_LOCALES = ["en", "zh-Hant", "zh-Hans"];
const DEFAULT_LOCALE = "en";
const LOCALE_NAMES = {
  "en": "English",
  "zh-Hant": "繁體中文",
  "zh-Hans": "简体中文"
};
function createLocalizedRoutes() {
  const baseRoutes = [
    {
      path: "",
      name: "home",
      component: () => import("./assets/HomeView-DFGWcI2o.js")
    },
    // Preparation-centric routes (ONLY routes for browsing)
    {
      path: "preparations",
      name: "preparations",
      component: () => import("./assets/PreparationsView-ndowylkW.js")
    },
    {
      path: "preparations/:slug",
      name: "preparation-detail",
      component: () => import("./assets/PreparationDetailView-B7rTk139.js"),
      props: true
    },
    // Source materials routes (ontology browser)
    {
      path: "sources",
      name: "sources",
      component: () => import("./assets/SourcesView-Cv4Yf6eT.js")
    },
    {
      path: "sources/botanical",
      name: "botanical-sources",
      component: () => import("./assets/PlantsView-B6AiVvM8.js"),
      props: { sourceType: "plant" }
    },
    {
      path: "sources/botanical/:slug",
      name: "botanical-source-detail",
      component: () => import("./assets/PlantDetailView-BKGGNLfi.js"),
      props: true
    },
    {
      path: "sources/fungi",
      name: "fungi-sources",
      component: () => import("./assets/PlantsView-B6AiVvM8.js"),
      props: { sourceType: "fungi" }
    },
    {
      path: "sources/fungi/:slug",
      name: "fungi-source-detail",
      component: () => import("./assets/PlantDetailView-BKGGNLfi.js"),
      props: true
    },
    {
      path: "sources/algae",
      name: "algae-sources",
      component: () => import("./assets/PlantsView-B6AiVvM8.js"),
      props: { sourceType: "algae" }
    },
    {
      path: "sources/algae/:slug",
      name: "algae-source-detail",
      component: () => import("./assets/PlantDetailView-BKGGNLfi.js"),
      props: true
    },
    {
      path: "sources/zoological",
      name: "zoological-sources",
      component: () => import("./assets/SourcesListView-BxLTWLgH.js")
    },
    {
      path: "sources/zoological/:slug",
      name: "zoological-source-detail",
      component: () => import("./assets/SourceDetailView-B_H1AgaJ.js"),
      props: true
    },
    {
      path: "sources/mineral",
      name: "mineral-sources",
      component: () => import("./assets/SourcesListView-BxLTWLgH.js")
    },
    {
      path: "sources/mineral/:slug",
      name: "mineral-source-detail",
      component: () => import("./assets/SourceDetailView-B_H1AgaJ.js"),
      props: true
    },
    {
      path: "sources/chemical",
      name: "chemical-sources",
      component: () => import("./assets/SourcesListView-BxLTWLgH.js")
    },
    {
      path: "sources/chemical/:slug",
      name: "chemical-source-detail",
      component: () => import("./assets/SourceDetailView-B_H1AgaJ.js"),
      props: true
    },
    // Systems routes (medicine system browser)
    {
      path: "systems",
      name: "systems",
      component: () => import("./assets/SystemsView-DbGwcjDF.js")
    },
    {
      path: "systems/:system",
      name: "system-detail",
      component: () => import("./assets/SystemDetailView-CCH9qnrw.js"),
      props: true
    },
    {
      path: "systems/:system/:refType",
      name: "system-reference",
      component: () => import("./assets/ReferenceDataView-DwcTpHdn.js"),
      props: true
    },
    {
      path: "systems/:system/:refType/:slug",
      name: "reference-detail",
      component: () => import("./assets/ReferenceValueDetailView-o4jPbOoX.js"),
      props: true
    },
    // Chemical compounds routes
    {
      path: "compounds",
      name: "compounds",
      component: () => import("./assets/ChemicalCompoundsView-8VwwFiuq.js")
    },
    {
      path: "compounds/:slug",
      name: "compound-detail",
      component: () => import("./assets/ChemicalCompoundDetailView-7YPAg7b3.js"),
      props: true
    },
    // Plant parts routes
    {
      path: "sources/parts",
      name: "plant-parts",
      component: () => import("./assets/PlantPartsView-LTwjKMDz.js")
    },
    {
      path: "sources/parts/:slug",
      name: "plant-part-detail",
      component: () => import("./assets/PlantPartDetailView-BSSBGSSI.js"),
      props: true
    },
    // DNA barcodes routes
    {
      path: "sources/barcodes",
      name: "dna-barcodes",
      component: () => import("./assets/DNABarcodesView-Cs4mvvhz.js")
    },
    {
      path: "sources/barcodes/:slug",
      name: "dna-barcode-detail",
      component: () => import("./assets/DNABarcodeDetailView-Dvdtw1ZU.js"),
      props: true
    },
    // Formulas routes
    {
      path: "formulas",
      name: "formulas",
      component: () => import("./assets/FormulasView-BUQ0pF_a.js")
    },
    {
      path: "formulas/:slug",
      name: "formula-detail",
      component: () => import("./assets/FormulaDetailView-I3BtAL--.js"),
      props: true
    },
    // About and Basics
    {
      path: "about",
      name: "about",
      component: () => import("./assets/AboutView-Mv_kK_0p.js")
    },
    {
      path: "basics",
      name: "basics",
      component: () => import("./assets/BasicsView-CaVfErsv.js")
    }
  ];
  const routes2 = [];
  routes2.push({
    path: "/",
    component: () => import("./assets/LayoutView-Cq00CWih.js"),
    children: baseRoutes.map((route) => ({
      ...route,
      name: route.name ? `en-${route.name}` : route.name,
      meta: { locale: DEFAULT_LOCALE }
    }))
  });
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    routes2.push({
      path: `/${locale}`,
      component: () => import("./assets/LayoutView-Cq00CWih.js"),
      children: baseRoutes.map((route) => ({
        ...route,
        name: `${locale}-${route.name}`,
        meta: { locale }
      }))
    });
  }
  routes2.push({
    path: "/en",
    redirect: "/"
  });
  routes2.push({
    path: "/en/:pathMatch(.*)*",
    redirect: (to) => {
      return "/" + to.params.pathMatch.join("/");
    }
  });
  routes2.push({
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("./assets/NotFoundView-BAlU_B3i.js")
  });
  return routes2;
}
const routes = createLocalizedRoutes();
const en = {
  // Navigation
  nav: {
    home: "Home",
    preparations: "Preparations",
    sources: "Sources",
    plants: "Plants",
    systems: "Systems",
    compounds: "Compounds",
    herbs: "Herbs",
    basics: "Basics",
    about: "About",
    standards: "Standards",
    sipmHome: "SIPM Home"
  },
  // Home page
  home: {
    heroTitle: "Herbapedia",
    heroSubtitle: "Medicinal Plants Encyclopedia",
    heroDescription: "A comprehensive resource of medicinal plants, herbs, vitamins, minerals, and nutrients - bridging traditional wisdom with modern scientific research.",
    exploreHerbs: "Explore Preparations",
    browseBySystem: "Browse by System",
    browseByProperty: "Browse by Property",
    categoriesTitle: "Browse by Tradition",
    aboutTitle: "About Herbapedia",
    aboutP1: "Herbapedia is a comprehensive encyclopedia developed by the International Society of Phytomedicine (SIPM) to provide accurate, evidence-based information about medicinal plants and natural health supplements.",
    aboutP2: "Our database includes traditional Chinese herbs, Western herbal medicines, vitamins, minerals, and essential nutrients - combining ancient wisdom with modern scientific research.",
    learnMore: "Learn more about SIPM",
    traditionTCM: "Traditional Chinese Medicine",
    traditionWestern: "Western Herbalism",
    traditionAyurveda: "Ayurveda",
    traditionModern: "Modern Medicine",
    browsePreparations: "Browse Preparations"
  },
  // Categories
  categories: {
    title: "Categories",
    chineseHerbs: "Chinese Herbs",
    westernHerbs: "Western Herbs",
    vitamins: "Vitamins",
    minerals: "Minerals",
    nutrients: "Nutrients"
  },
  // Preparations
  preparations: {
    browseCount: "Browse {count} medicinal preparations",
    searchPlaceholder: "Search preparations by name or scientific name...",
    filters: "Filters",
    systemProfiles: "System Profiles",
    tcmProperties: "TCM Properties",
    westernProperties: "Western Properties",
    clearAll: "Clear All",
    all: "All",
    applyFilters: "Apply Filters",
    showingResults: "Showing {count} of {total} preparations",
    noResults: "No preparations match your filters. Try adjusting your search.",
    botanicalSource: "Botanical Source",
    zoologicalSource: "Zoological Source",
    mineralSource: "Mineral Source",
    chemicalSource: "Chemical Source",
    sourceMaterial: "Source Material",
    scientificName: "Scientific Name",
    family: "Family",
    genus: "Genus",
    relatedPreparations: "Related Preparations",
    allergens: "Allergens",
    pregnancySafety: "Pregnancy Safety",
    drugInteractions: "Drug Interactions",
    notFound: "The requested preparation could not be found in our database.",
    backToPreparations: "Back to Preparations",
    tcm: "TCM",
    western: "Western",
    ayurveda: "Ayurveda",
    persian: "Persian",
    mongolian: "Mongolian",
    ayurvedaComingSoon: "Ayurveda profile coming soon.",
    natureHot: "Hot",
    natureWarm: "Warm",
    natureNeutral: "Neutral",
    natureCool: "Cool",
    natureCold: "Cold",
    viewPlantProfile: "View Plant Profile",
    preparationsFromPlant: "{count} preparations from this plant",
    // Preparation Information
    preparationInfo: "Preparation Information",
    preparationDetails: "Preparation Details",
    appearance: "Appearance",
    storageRequirements: "Storage Requirements",
    shelfLife: "Shelf Life",
    // Common Usage
    commonUsage: "Common Usage",
    culinaryUse: "Culinary Use",
    aromatherapyUse: "Aromatherapy Use",
    cosmeticUse: "Cosmetic Use",
    industrialUse: "Industrial Use",
    // Safety
    warnings: "Warnings",
    // TCM Profile
    classicalReference: "Classical References",
    quote: "Quote",
    dosageEffect: "Dosage Effects",
    smallDose: "Small Dose",
    mediumDose: "Medium Dose",
    largeDose: "Large Dose",
    comparisonNotes: "Comparison Notes",
    incompatibilities: "Incompatibilities",
    // Form and Preparation
    form: "Form",
    preparationMethod: "Preparation Method"
  },
  // Plants
  plants: {
    title: "Plants",
    browseCount: "Browse {count} plant species",
    searchPlaceholder: "Search plants by name or scientific name...",
    allPlants: "All Plants",
    withPreparations: "With Preparations",
    showingResults: 'Found {count} results for "{query}"',
    noResults: "No plants found matching your search.",
    species: "Species",
    family: "Family",
    genus: "Genus",
    parts: "Plant Parts",
    description: "Botanical Description",
    preparationsFromPlant: "Preparations from this Plant",
    noPreparations: "No preparations have been derived from this plant yet.",
    notFound: "The requested plant could not be found in our database.",
    backToPlants: "Back to Plants",
    preparations: "preparations",
    noImage: "No image yet",
    // DNA Barcode
    dnaBarcode: "DNA Barcode",
    identificationConfidence: "Identification Confidence",
    canDetectAdulterants: "Can Detect Adulterants",
    // Chemical Profile
    chemicalProfile: "Chemical Profile",
    totalVolatileOil: "Total Volatile Oil",
    analyticalMethod: "Analytical Method",
    qualityGrade: "Quality Grade",
    chemicalComponents: "Chemical Components",
    // Taxonomy
    taxonomy: "Taxonomic Classification",
    kingdom: "Kingdom",
    phylum: "Phylum",
    class: "Class",
    order: "Order",
    // Distribution
    distributionAndHabitat: "Distribution & Habitat",
    origin: "Origin",
    habitat: "Habitat",
    distribution: "Geographical Distribution",
    // Characteristics
    characteristics: "Plant Characteristics",
    growthForm: "Growth Form",
    lifecycle: "Lifecycle",
    growthForms: {
      herb: "Herb",
      shrub: "Shrub",
      tree: "Tree",
      vine: "Vine",
      climber: "Climber",
      epiphyte: "Epiphyte",
      aquatic: "Aquatic"
    },
    lifecycles: {
      annual: "Annual",
      biennial: "Biennial",
      perennial: "Perennial"
    },
    // Conservation
    conservationStatus: "Conservation Status",
    conservationStatuses: {
      LC: "Least Concern",
      NT: "Near Threatened",
      VU: "Vulnerable",
      EN: "Endangered",
      CR: "Critically Endangered",
      EW: "Extinct in the Wild",
      EX: "Extinct",
      DD: "Data Deficient",
      NE: "Not Evaluated"
    }
  },
  // Herb detail sections
  sections: {
    history: "History",
    introduction: "Introduction",
    botanicalSource: "Botanical Source",
    traditionalUsage: "Traditional Usage",
    modernResearch: "Modern Research",
    functions: "Functions",
    importance: "Importance",
    foodSources: "Food Sources",
    description: "Description",
    indications: "Indications",
    contraindications: "Contraindications",
    dosage: "Dosage",
    classicalReference: "Classical Reference",
    safetyConsideration: "Safety Consideration"
  },
  // TCM properties
  tcm: {
    properties: "TCM Properties",
    nature: "Nature (Temperature)",
    flavor: "Flavor",
    meridian: "Meridians",
    category: "Category",
    pinyin: "Pinyin",
    actions: "TCM Actions",
    natures: "Thermal Natures",
    flavors: "Flavors",
    meridians: "Meridians",
    categories: "Categories"
  },
  // Western properties
  western: {
    properties: "Western Herbalism",
    actions: "Actions",
    organAffinities: "Organ Affinities",
    organs: "Organ Affinities",
    systems: "Body Systems",
    scientificName: "Scientific Name",
    history: "History",
    traditionalUsage: "Traditional Usage",
    modernResearch: "Modern Research"
  },
  // Ayurveda properties
  ayurveda: {
    properties: "Ayurveda",
    sanskrit: "Sanskrit",
    hindiName: "Hindi Name",
    rasa: "Rasa (Taste)",
    guna: "Guna (Qualities)",
    virya: "Virya (Potency)",
    vipaka: "Vipaka (Post-Digestive)",
    dosha: "Dosha Effects",
    doshas: "Doshas",
    karma: "Karma (Actions)",
    karmas: "Karmas (Actions)",
    mahabhutas: "Mahabhutas (Elements)",
    rasas: "Tastes (Rasa)",
    gunas: "Qualities (Guna)",
    viryas: "Potency (Virya)",
    vipakas: "Post-digestive (Vipaka)",
    categories: "Categories",
    prabhavas: "Prabhavas (Special Effects)",
    category: "Ayurvedic Category",
    anupana: "Anupana (Vehicle)",
    anupanaDesc: "Substances used as carriers to enhance absorption and therapeutic effect",
    sevanaKala: "Sevana Kala (Time of Administration)",
    sevanaKalaDesc: "Optimal timing for taking this preparation",
    formulations: "Classic Formulations",
    formulationUse: "Use"
  },
  // Persian (Unani) properties
  persian: {
    properties: "Persian Medicine (Unani)",
    name: "Persian Name",
    arabicName: "Arabic Name",
    temperament: "Temperament (Mizaj)",
    temperaments: "Temperaments",
    elements: "Elements",
    degrees: "Degrees",
    actions: "Actions",
    affectedOrgans: "Affected Organs",
    mizajConstituents: "Mizaj Constituents",
    corrective: "Corrective (Musleh)",
    correctiveDesc: "Substances that correct adverse effects",
    substitute: "Substitute (Badal)",
    substituteDesc: "Alternative substances when primary is unavailable",
    dosageForm: "Dosage Forms",
    adverseEffects: "Adverse Effects",
    classicalReferences: "Classical References",
    nomadicUsage: "Nomadic Usage"
  },
  // Mongolian Traditional Medicine properties
  mongolian: {
    properties: "Mongolian Traditional Medicine",
    name: "Mongolian Name",
    tibetanWylie: "Tibetan (Wylie)",
    elements: "Elements",
    roots: "Three Roots",
    tastes: "Tastes",
    potency: "Potency",
    potencies: "Potencies",
    therapeuticClass: "Therapeutic Class",
    preparationMethods: "Preparation Methods",
    formulations: "Classic Formulations",
    formulationUse: "Use",
    classicalReferences: "Classical References",
    nomadicUsage: "Nomadic Usage"
  },
  // Herbal vocabulary (general)
  herbal: {
    title: "Herbal Vocabulary",
    subtitle: "Standard forms and processing methods for herbal preparations",
    forms: "Preparation Forms",
    methods: "Preparation Methods"
  },
  // Systems
  systems: {
    title: "Medicine Systems",
    subtitle: "Explore traditional medicine systems from around the world",
    profiles: "profiles",
    preparations: "Preparations",
    substances: "Substances",
    referenceData: "Reference Data",
    items: "items",
    viewAll: "View all",
    preparationsWithProfile: "Preparations with this Profile",
    noPreparations: "No preparations with this profile yet",
    andMore: "and {count} more",
    aboutSystem: "About {system}",
    aboutTitle: "About Traditional Medicine Systems",
    aboutText: "Traditional medicine systems have developed over thousands of years across different cultures. Each system has its own unique framework for understanding health, disease, and treatment. Herbapedia documents preparations according to five major systems: Traditional Chinese Medicine, Western Herbalism, Ayurveda, Persian/Unani Medicine, and Mongolian Traditional Medicine.",
    tcm: {
      name: "Traditional Chinese Medicine",
      description: "One of the oldest continuous medical traditions, based on concepts of yin/yang, qi, and the five elements. Herbs are classified by their nature, flavor, and meridian entry."
    },
    western: {
      name: "Western Herbalism",
      description: "European and Mediterranean herbal traditions emphasizing evidence-based practice, organ system affinities, and holistic approach to health."
    },
    ayurveda: {
      name: "Ayurveda",
      description: "Ancient Indian system based on balancing three doshas (Vata, Pitta, Kapha). Herbs are classified by rasa (taste), virya (potency), and vipaka (post-digestive effect)."
    },
    persian: {
      name: "Persian/Unani Medicine",
      description: "Greek-Arabic medical tradition emphasizing temperament (mizaj) and the balance of four humors. Widely practiced in South Asia and the Middle East."
    },
    mongolian: {
      name: "Mongolian Traditional Medicine",
      description: "Traditional healing system influenced by Tibetan medicine, focusing on the three root energies (heyi, xila, badagan) and the balance of elements."
    },
    modern: {
      name: "Modern Medicine",
      description: "Contemporary nutritional and pharmaceutical substances including vitamins, minerals, amino acids, and other bioactive compounds supported by modern scientific research.",
      substances: "Substances"
    }
  },
  // Sources
  sources: {
    title: "Source Materials",
    subtitle: "Explore the origins of medicinal preparations - plants, animals, minerals, and chemicals",
    entities: "entities",
    searchPlaceholder: "Search sources by name...",
    browseCount: "Browse {count} source materials",
    aboutTitle: "About Source Materials",
    aboutText: "Medicinal preparations are derived from various source materials. Botanical sources (plants, fungi, algae) form the largest category, but animal-derived substances (like chitosan from crustacean shells), mineral compounds (like zinc and calcium), and synthesized chemicals (like vitamins) are also important sources for therapeutic preparations.",
    botanical: "Botanical Sources",
    botanicalDesc: "Medicinal plants. The primary source of traditional herbal medicines.",
    fungi: "Fungi Sources",
    fungiDesc: "Medicinal mushrooms and fungi, such as Reishi (Lingzhi), Cordyceps, and Turkey Tail.",
    algae: "Algae Sources",
    algaeDesc: "Medicinal algae and cyanobacteria, such as Spirulina and Chlorella.",
    zoological: "Zoological Sources",
    zoologicalDesc: "Animal-derived substances such as chitosan from crustacean shells, fish oils, and other animal extracts.",
    mineral: "Mineral Sources",
    mineralDesc: "Naturally occurring minerals and their compounds including zinc, calcium, magnesium, and other essential elements.",
    mineralAbout: "About Mineral Sources",
    mineralAboutText: "Mineral sources include naturally occurring elements and compounds used in traditional and modern medicine. These include essential minerals like zinc, calcium, magnesium, and trace elements that play vital roles in human health.",
    chemical: "Chemical Sources",
    chemicalDesc: "Synthesized or isolated compounds including vitamins, amino acids, and other bioactive molecules.",
    // Source detail page
    preparationsFromSource: "Preparations from this Source",
    noPreparations: "No preparations from this source yet",
    description: "Description",
    animalOrigin: "Animal Origin",
    animalName: "Animal Name",
    animalScientificName: "Scientific Name",
    animalPart: "Animal Part",
    chemicalProperties: "Chemical Properties",
    chemicalFormula: "Chemical Formula",
    synthesis: "Synthesis",
    synthesized: "Synthesized",
    natural: "Natural",
    sourceNotFound: "Source not found",
    backToSources: "Back to Sources"
  },
  // Chemical compounds
  compounds: {
    title: "Chemical Compounds",
    subtitle: "Active chemical compounds found in medicinal plants",
    browseCount: "Browse {count} chemical compounds",
    searchPlaceholder: "Search compounds by name or formula...",
    showingResults: 'Found {count} results for "{query}"',
    noResults: "No compounds found matching your search.",
    compound: "Compound",
    note: "These active compounds contribute to the herb's therapeutic properties. Research is ongoing to fully understand their mechanisms of action.",
    foundIn: "Found in Plants",
    noPlants: "No plants containing this compound have been documented yet.",
    notFound: "The requested compound could not be found in our database.",
    backToCompounds: "Back to Compounds",
    identifiers: "Identifiers",
    molecularFormula: "Molecular Formula",
    molecularWeight: "Molecular Weight",
    casNumber: "CAS Number",
    chebiID: "ChEBI ID",
    pubchemCID: "PubChem CID",
    inchiKey: "InChI Key",
    inchi: "InChI",
    smiles: "SMILES",
    compoundClass: "Compound Class",
    pharmacology: "Pharmacology",
    iupacName: "IUPAC Name",
    synonyms: "Synonyms",
    bioavailability: "Bioavailability",
    safetyData: "Safety Data",
    ld50: "LD50",
    toxicity: "Toxicity",
    warnings: "Warnings"
  },
  // Plant Parts
  plantParts: {
    title: "Plant Parts",
    subtitle: "Specific parts of medicinal plants used in herbal preparations",
    browseCount: "Browse {count} plant parts",
    searchPlaceholder: "Search plant parts...",
    allParts: "All Parts",
    showingResults: 'Found {count} results for "{query}"',
    noResults: "No plant parts found matching your search.",
    part: "Plant Part",
    partOf: "Part of",
    species: "Source Species",
    preparationsFromPart: "Preparations using this part",
    notFound: "The requested plant part could not be found.",
    backToParts: "Back to Plant Parts",
    roots: "Roots",
    rhizomes: "Rhizomes",
    leaves: "Leaves",
    flowers: "Flowers",
    fruits: "Fruits",
    seeds: "Seeds",
    bulbs: "Bulbs",
    barks: "Barks",
    stems: "Stems"
  },
  // DNA Barcodes
  dnaBarcodes: {
    title: "DNA Barcodes",
    subtitle: "DNA sequence data for species identification and authentication",
    searchPlaceholder: "Search barcodes by name, species, or region...",
    showingResults: 'Found {count} results for "{query}"',
    barcode: "DNA Barcode",
    identification: "Identification",
    level: "Identification Level",
    confidence: "Confidence",
    method: "Method",
    sequences: "DNA Sequences",
    viewFullSequence: "View Full Sequence",
    hideFullSequence: "Hide Full Sequence",
    copySequence: "Copy Sequence",
    sequenceCopied: "Sequence copied!",
    adulterantDetection: "Adulterant Detection",
    canDetect: "This barcode can detect the following adulterants",
    voucheredSpecimen: "Vouchered Specimen",
    herbarium: "Herbarium",
    collector: "Collector",
    location: "Collection Location",
    viewSpecies: "View Source Species",
    disclaimer: "DNA barcoding is used for species identification and quality control. Results should be interpreted by qualified professionals.",
    notFound: "The requested DNA barcode could not be found.",
    backToBarcodes: "Back to DNA Barcodes",
    noResults: "No DNA barcodes available."
  },
  // Formulas
  formulas: {
    title: "Proprietary Formulas",
    subtitle: "Proprietary blend formulas and compositions",
    formula: "Formula",
    ingredients: "Ingredients",
    ingredientsNote: "This formula contains the following ingredients:",
    notFound: "The requested formula could not be found.",
    backToFormulas: "Back to Formulas",
    noResults: "No formulas available."
  },
  // Related herbs
  relatedHerbs: {
    title: "Related Herbs",
    sharedCompounds: "{count} shared compound | {count} shared compounds",
    sameCategory: "Same category",
    similarActions: "Similar actions"
  },
  // Safety alerts
  safety: {
    title: "Safety Information",
    disclaimer: "This information is for educational purposes only. Always consult a qualified healthcare provider before using any herbal remedy."
  },
  // External links
  links: {
    title: "External Links",
    wikidata: "Wikidata",
    gbif: "GBIF",
    ncbi: "NCBI Taxonomy",
    wikipedia: "Wikipedia"
  },
  // Disclaimer
  disclaimer: {
    title: "Disclaimer",
    text: "The content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Please always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
  },
  // Common
  common: {
    items: "items",
    notFound: "Not Found",
    herbNotFound: "The requested herb could not be found in our database.",
    backToHerbs: "Back to Preparations",
    noHerbsFound: "No preparations found.",
    browseCollection: "Browse our collection of medicinal plants, herbs, vitamins, minerals, and nutrients"
  },
  // Language
  language: {
    select: "Language"
  },
  // About page
  about: {
    title: "About Herbapedia",
    mission: {
      title: "Mission",
      text: "Herbapedia is a comprehensive encyclopedia developed by the International Society of Phytomedicine (SIPM) to provide accurate, evidence-based information about medicinal plants and natural health supplements."
    },
    history: {
      title: "History",
      p1: "Herbapedia was first created in the year 2000 by Vita Green Health Products Ltd and designed by the late Hillman Curtis, when there was no publicly-accessible, medically-curated and accurate set of scientific, herbal knowledge for the public.",
      p2: "In addition to the over 100 herbal ingredients documented, a key feature of the Herbapedia was its high-quality vector images, entirely drawn from scratch to illustrate to the reader how particular herbal medicine plants look like.",
      p3: "The Herbapedia was developed and funded by Vita Green and hosted for public consumption since then. As a founding member of the SIPM, Vita Green has given permission to the SIPM to reproduce and expand the data set for open use, and the SIPM is grateful to continue the baton of the Herbapedia."
    },
    content: {
      title: "Our Content",
      intro: "Our database covers five main categories:",
      chineseHerbs: "Traditional Chinese medicinal plants and fungi",
      westernHerbs: "European and North American herbal medicines",
      vitamins: "Essential vitamins for human health",
      minerals: "Important dietary minerals and trace elements",
      nutrients: "Beneficial compounds and supplements"
    },
    approach: {
      title: "Approach",
      text: "We bridge traditional wisdom with modern scientific research. Each entry combines historical and traditional uses with contemporary scientific findings, providing a balanced perspective on natural health remedies."
    },
    sipm: {
      title: "About SIPM",
      text: "The International Society of Phytomedicine (SIPM) is dedicated to advancing the scientific understanding and responsible use of medicinal plants worldwide.",
      link: "Visit SIPM website"
    },
    ontology: {
      title: "Ontology Architecture",
      intro: "Herbapedia uses a preparation-centric ontology where HerbalPreparation is the central entity. This document describes the data model for developers and data architects.",
      coreEntity: "Core Entity: HerbalPreparation",
      coreEntityDesc: "The HerbalPreparation entity represents a processed medicinal material ready for therapeutic use. It serves as the pivot connecting source materials (plants, animals, minerals) to system-specific therapeutic profiles (TCM, Western, Ayurveda, etc.).",
      sourceMaterials: "Source Materials",
      sourceMaterialsDesc: "Preparations are derived from four types of source materials:",
      sourcePlant: "Botanical sources - medicinal plants, fungi, algae",
      sourceAnimal: "Animal sources - chitosan (crustacean shells), cod liver oil, etc.",
      sourceMineral: "Mineral sources - zinc, calcium, magnesium compounds",
      sourceChemical: "Chemical sources - synthesized vitamins, isolated compounds",
      profiles: "Medicine System Profiles",
      profilesDesc: "Each preparation may have one or more system profiles describing its therapeutic properties according to different traditional medicine systems:",
      profileTCM: "Traditional Chinese Medicine profile with nature, flavor, meridians, category",
      profileWestern: "Western Herbalism profile with actions, organ affinities",
      profileAyurveda: "Ayurveda profile with rasa, guna, virya, vipaka, dosha effects",
      profilePersian: "Persian/Unani profile with temperament (mizaj) and elements",
      profileMongolian: "Mongolian Traditional Medicine profile with elements, roots, tastes",
      referenceData: "Reference Data",
      referenceDataDesc: "Each medicine system defines its own taxonomy of reference terms with multilingual labels (prefLabel):",
      relationships: "Entity Relationships",
      relationshipsDesc: "The ontology uses RDF-style relationships to connect entities:",
      i18n: "Internationalization (i18n)",
      i18nDesc: "All ontology terms use SKOS prefLabel for multilingual support. Labels are stored in the data repository (data-herbapedia), not in the application code:",
      serialization: "Serialization Format",
      serializationDesc: "All data is stored as JSON-LD with proper {'@'}context for semantic interoperability. The {'@'}context files define prefixes for tcm:, ayurveda:, western:, persian:, mongolian:, and botany: vocabularies."
    }
  },
  // Basics page
  basics: {
    title: "Basics of Medicinal Plants",
    subtitle: "Understanding the science and tradition of phytomedicine",
    medicinalPlants: {
      title: "What are Medicinal Plants?",
      p1: "Medicinal plants, also called medicinal herbs, have been discovered and used in traditional medicine practices since prehistoric times. Plants synthesize hundreds of chemical compounds for various functions, including defense against insects, fungi, diseases, and herbivorous mammals.",
      p2: "Herbaceous plants are vascular plants that have no persistent woody stems above ground. They may be annuals, biennials, or perennials. Unlike woody plants (trees and shrubs), herbaceous plants have soft, green stems that die back to the ground at the end of the growing season.",
      p3: "The study of medicinal plants is called medicinal botany or pharmacognosy. This field encompasses the identification, collection, preservation, and therapeutic application of plants used in medicine. Modern pharmacognosy integrates traditional knowledge with contemporary scientific methods."
    },
    importance: {
      title: "The Importance of Medicinal Plants",
      p1: "All major food crops worldwide are herbaceous plants—their fruits, seeds, roots, and leaves form the foundation of human nutrition. Beyond nutrition, herbaceous plants produce much of the world's oxygen through photosynthesis and play a critical role in preventing soil erosion through their root systems.",
      p2: "In modern medicine, approximately 25% of prescription drugs are derived from medicinal plants or contain plant-derived compounds. The World Health Organization estimates that 80% of the world's population relies on traditional medicine, primarily plant-based remedies, for their primary healthcare needs.",
      p3: "Medicinal plants provide three main types of benefits: health benefits to consumers, financial benefits to harvesters and distributors, and societal benefits including job opportunities and improved public health. The global market for medicinal and aromatic plants exceeds $68 billion annually."
    },
    history: {
      title: "History of Herbal Medicine",
      p1: 'The earliest historical records of medicinal plants date to the Sumerian civilization (c. 3000 BC), where hundreds of plants including opium were documented on clay tablets. The Egyptian Ebers Papyrus (c. 1550 BC) describes over 850 plant medicines. The Greek physician Dioscorides documented over 1,000 recipes using 600 medicinal plants in "De materia medica" (c. 60 AD), which remained the authoritative reference for over 1,500 years.',
      p2: 'Traditional Chinese Medicine (TCM) documented plant medicines in the "Shennong Ben Cao Jing" and expanded during the Tang Dynasty. Ayurvedic medicine in India has used hundreds of herbs and spices for millennia, documented in texts such as the Atharva Veda and Sushruta Samhita. During the Islamic Golden Age, scholars translated and expanded upon Greek texts, developing sophisticated pharmacopoeias.',
      p3: "The 19th century marked a turning point when chemical analysis enabled the isolation of active compounds. Alkaloids such as morphine (1806), quinine, and later cardiac glycosides were purified, establishing the foundation for modern pharmacology. Today, drug discovery continues to draw on ethnobotanical knowledge to identify new therapeutic compounds."
    },
    phytochemicals: {
      title: "Active Compounds in Medicinal Plants",
      intro: "Plants produce chemical compounds called phytochemicals that provide evolutionary advantages. These compounds form the scientific basis for the therapeutic use of medicinal plants. The four major classes of pharmacologically active plant compounds are:",
      alkaloids: {
        title: "Alkaloids",
        desc: "Bitter-tasting nitrogen-containing compounds that often have potent pharmacological effects. Many alkaloids act on the nervous system or have analgesic properties.",
        examples: "Examples: morphine (poppy), caffeine (coffee), quinine (cinchona), berberine (goldenseal)"
      },
      glycosides: {
        title: "Glycosides",
        desc: "Compounds where a sugar molecule is bound to a non-carbohydrate active component. Cardiac glycosides support heart function, while anthraquinone glycosides have laxative effects.",
        examples: "Examples: digoxin (foxglove), sennosides (senna), salicin (willow bark)"
      },
      polyphenols: {
        title: "Polyphenols",
        desc: "Diverse group of compounds with antioxidant and anti-inflammatory properties. Includes flavonoids, tannins, and phytoestrogens that can modulate various physiological processes.",
        examples: "Examples: curcumin (turmeric), catechins (green tea), resveratrol (grapes), flavonoids (many plants)"
      },
      terpenes: {
        title: "Terpenes & Terpenoids",
        desc: "Aromatic compounds found in essential oils. Many have antimicrobial, anti-inflammatory, or calming properties. Widely used in aromatherapy and as flavoring agents.",
        examples: "Examples: thymol (thyme), menthol (mint), limonene (citrus), ginsenosides (ginseng)"
      }
    },
    systems: {
      title: "Major Traditional Medicine Systems",
      intro: "Several traditional medicine systems have developed comprehensive frameworks for understanding and applying medicinal plants. These systems have academic recognition and are practiced alongside conventional medicine in many countries:",
      tcm: {
        title: "Traditional Chinese Medicine (TCM)",
        desc: "Originating in China over 2,500 years ago, TCM uses concepts of Qi (vital energy), Yin-Yang balance, and the Five Elements. Herbs are classified by their nature (temperature), flavor, and meridian affinity. TCM includes acupuncture, moxibustion, and herbal formulas."
      },
      ayurveda: {
        title: "Ayurveda",
        desc: "The ancient Indian system of medicine dating back 5,000 years. Based on balancing three doshas (Vata, Pitta, Kapha), Ayurveda uses herbs classified by taste (rasa), potency (virya), and post-digestive effect (vipaka). Turmeric, ashwagandha, and triphala are key remedies."
      },
      jamu: {
        title: "Jamu",
        desc: "Indonesia's traditional herbal medicine system, recognized by UNESCO as intangible cultural heritage. Jamu uses fresh roots, bark, and leaves prepared as decoctions. Key ingredients include ginger, turmeric, tamarind, and temulawak (Javanese ginger)."
      },
      western: {
        title: "Western Herbalism",
        desc: "Rooted in European and Greco-Roman traditions, Western herbalism emphasizes the use of native plants and evidence-based phytotherapy. Practitioners use whole plant extracts and focus on organ systems. Key herbs include echinacea, St. John's wort, and valerian."
      },
      unani: {
        title: "Unani Medicine",
        desc: "Originating from Greco-Arabic medicine and developed in the Islamic world, Unani is based on the four humors theory. It emphasizes the balance of humors (blood, phlegm, yellow bile, black bile) and uses herbs, diet, and regimental therapy."
      }
    },
    sipm: {
      title: "The SIPM Mission",
      mission: "The International Society of Phytomedicine (SIPM) is dedicated to advancing the scientific understanding and responsible application of medicinal plants worldwide. Our mission bridges traditional knowledge with modern science.",
      goal1: "Advance scientific research on the pharmacological effects of medicinal plants on human physiology",
      goal2: "Promote standardization and quality control in herbal medicine production and regulation",
      goal3: "Support drug discovery through ethnobotanical research and phytochemical analysis",
      goal4: "Foster collaboration between traditional medicine practitioners and modern healthcare systems"
    }
  },
  // Reference data
  reference: {
    preparations: "preparations",
    noPreparations: "No preparations use this value",
    noItems: "No reference items found",
    notFound: "Reference data not found",
    backToList: "Back to list",
    usingPreparations: "Preparations using this value",
    // TCM
    naturesDesc: "Classification of herbs by their thermal effect on the body",
    flavorsDesc: "The five flavors and their corresponding organ relationships",
    meridiansDesc: "The energy channels that herbs are believed to influence",
    categoriesDesc: "Functional categories of TCM herbs",
    tcmActionsDesc: "Therapeutic actions in Traditional Chinese Medicine",
    // Western
    actionsDesc: "Pharmacological actions of herbal preparations",
    organsDesc: "Body organs and systems that herbs primarily affect",
    systemsDesc: "Body systems that herbs affect",
    // Ayurveda
    rasaDesc: "Six tastes in Ayurveda",
    gunaDesc: "Twenty qualities of substances",
    viryaDesc: "Heating or cooling potency",
    vipakaDesc: "Post-digestive effect",
    doshasDesc: "Three constitutional types in Ayurveda",
    karmasDesc: "Therapeutic actions in Ayurveda",
    mahabhutasDesc: "Five great elements in Ayurveda",
    ayurvedaCategoriesDesc: "Classification categories for Ayurvedic herbs based on therapeutic actions",
    prabhavasDesc: "Unique special effects of herbs that cannot be predicted from other properties",
    // Persian
    temperamentsDesc: "Four temperaments in Unani medicine",
    persianElementsDesc: "Four elements in Persian medicine",
    degreesDesc: "Intensity degrees in Persian medicine",
    // Mongolian
    elementsDesc: "Five elements in Mongolian medicine",
    tastesDesc: "Six tastes in Mongolian medicine",
    rootsDesc: "Three root energies in Mongolian medicine",
    potenciesDesc: "Therapeutic potencies in Mongolian medicine",
    // Herbal vocabulary
    formsDesc: "Physical forms of herbal preparations such as powder, capsule, tincture, etc.",
    methodsDesc: "Processing methods for preparing herbal materials such as drying, steaming, roasting, etc."
  }
};
const zhHant = {
  // Navigation
  nav: {
    home: "首頁",
    preparations: "製劑",
    sources: "來源",
    plants: "植物",
    systems: "醫學體系",
    compounds: "化合物",
    herbs: "草藥",
    basics: "基礎知識",
    about: "關於",
    standards: "標準",
    sipmHome: "SIPM 主頁"
  },
  // Home page
  home: {
    heroTitle: "Herbapedia",
    heroSubtitle: "藥用植物百科全書",
    heroDescription: "全面的藥用植物、草藥、維他命、礦物質及營養素資源——結合傳統智慧與現代科學研究。",
    exploreHerbs: "探索製劑",
    browseBySystem: "按醫學體系瀏覽",
    browseByProperty: "按特性瀏覽",
    categoriesTitle: "按傳統醫學瀏覽",
    aboutTitle: "關於 Herbapedia",
    aboutP1: "Herbapedia 是由國際植物醫學學會（SIPM）開發的綜合百科全書，旨在提供準確、循證的藥用植物和天然健康補充品資訊。",
    aboutP2: "我們的資料庫涵蓋傳統中藥、西方草藥、維他命、礦物質和必需營養素——結合古老智慧與現代科學研究。",
    learnMore: "了解更多關於 SIPM",
    traditionTCM: "傳統中醫",
    traditionWestern: "西方草藥",
    traditionAyurveda: "阿育吠陀",
    traditionModern: "現代醫學",
    browsePreparations: "瀏覽製劑"
  },
  // Categories
  categories: {
    title: "分類",
    chineseHerbs: "中藥",
    westernHerbs: "西草藥",
    vitamins: "維他命",
    minerals: "礦物質",
    nutrients: "營養素"
  },
  // Preparations
  preparations: {
    browseCount: "瀏覽 {count} 種藥用製劑",
    searchPlaceholder: "按名稱或學名搜尋製劑...",
    filters: "篩選",
    systemProfiles: "系統歸類",
    tcmProperties: "中醫特性",
    westernProperties: "西方特性",
    clearAll: "清除全部",
    all: "全部",
    applyFilters: "應用篩選",
    showingResults: "顯示 {count} / {total} 種製劑",
    noResults: "沒有符合篩選條件的製劑。請嘗試調整搜尋條件。",
    botanicalSource: "植物來源",
    zoologicalSource: "動物來源",
    mineralSource: "礦物來源",
    chemicalSource: "化學來源",
    sourceMaterial: "來源物料",
    scientificName: "學名",
    family: "科",
    genus: "屬",
    relatedPreparations: "相關製劑",
    allergens: "致敏原",
    pregnancySafety: "孕期安全",
    drugInteractions: "藥物相互作用",
    notFound: "數據庫中找不到請求的製劑。",
    backToPreparations: "返回製劑",
    tcm: "中醫",
    western: "西方",
    ayurveda: "阿育吠陀",
    persian: "波斯",
    mongolian: "蒙古",
    modern: "現代",
    ayurvedaComingSoon: "阿育吠陀資料即將推出。",
    natureHot: "熱",
    natureWarm: "溫",
    natureNeutral: "平",
    natureCool: "涼",
    natureCold: "寒",
    viewPlantProfile: "查看植物檔案",
    preparationsFromPlant: "此植物有 {count} 種製劑",
    // Preparation Information
    preparationInfo: "製劑資訊",
    preparationDetails: "製備詳情",
    appearance: "外觀特徵",
    storageRequirements: "儲存要求",
    shelfLife: "保存期限",
    // Common Usage
    commonUsage: "常見用途",
    culinaryUse: "烹飪用途",
    aromatherapyUse: "芳香療法",
    cosmeticUse: "美容用途",
    industrialUse: "工業用途",
    // Safety
    warnings: "警告",
    // TCM Profile
    classicalReference: "典籍記載",
    quote: "原文",
    dosageEffect: "劑量效應",
    smallDose: "小劑量",
    mediumDose: "中劑量",
    largeDose: "大劑量",
    comparisonNotes: "對比說明",
    incompatibilities: "配伍禁忌",
    // Form and Preparation
    form: "劑型",
    preparationMethod: "製備方法"
  },
  // Plants
  plants: {
    title: "植物",
    browseCount: "瀏覽 {count} 種植物",
    searchPlaceholder: "按名稱或學名搜尋植物...",
    allPlants: "全部植物",
    withPreparations: "有製劑",
    showingResults: '找到 {count} 個結果 "{query}"',
    noResults: "沒有找到符合搜尋條件的植物。",
    species: "物種",
    family: "科",
    genus: "屬",
    parts: "植物部位",
    description: "植物描述",
    preparationsFromPlant: "由此植物製備的製劑",
    noPreparations: "暫時沒有由此植物製備的製劑。",
    notFound: "數據庫中找不到請求的植物。",
    backToPlants: "返回植物",
    preparations: "種製劑",
    noImage: "暫無圖片",
    // DNA Barcode
    dnaBarcode: "DNA條碼",
    identificationConfidence: "鑑定置信度",
    canDetectAdulterants: "可檢測摻假物",
    // Chemical Profile
    chemicalProfile: "化學成分",
    totalVolatileOil: "總揮發油",
    analyticalMethod: "分析方法",
    qualityGrade: "質量等級",
    chemicalComponents: "化學成分",
    // Taxonomy
    taxonomy: "分類學",
    kingdom: "界",
    phylum: "門",
    class: "綱",
    order: "目",
    // Distribution
    distributionAndHabitat: "分佈與生境",
    origin: "原產地",
    habitat: "生境",
    distribution: "地理分佈",
    // Characteristics
    characteristics: "植物特性",
    growthForm: "生長型",
    lifecycle: "生命週期",
    growthForms: {
      herb: "草本",
      shrub: "灌木",
      tree: "喬木",
      vine: "藤本",
      climber: "攀援植物",
      epiphyte: "附生植物",
      aquatic: "水生植物"
    },
    lifecycles: {
      annual: "一年生",
      biennial: "二年生",
      perennial: "多年生"
    },
    // Conservation
    conservationStatus: "保護狀況",
    conservationStatuses: {
      LC: "無危",
      NT: "近危",
      VU: "易危",
      EN: "瀕危",
      CR: "極危",
      EW: "野外滅絕",
      EX: "滅絕",
      DD: "數據缺乏",
      NE: "未評估"
    }
  },
  // Herb detail sections
  sections: {
    history: "歷史",
    introduction: "簡介",
    botanicalSource: "植物來源",
    traditionalUsage: "傳統用途",
    modernResearch: "現代研究",
    functions: "功效",
    importance: "重要性",
    foodSources: "食物來源",
    description: "描述",
    indications: "適應症",
    contraindications: "禁忌",
    dosage: "劑量",
    classicalReference: "典籍記載",
    safetyConsideration: "注意事項"
  },
  // TCM properties
  tcm: {
    properties: "中藥特性",
    nature: "藥性",
    flavor: "味道",
    meridian: "歸經",
    category: "分類",
    pinyin: "拼音",
    actions: "作用",
    natures: "藥性",
    flavors: "五味",
    meridians: "歸經",
    categories: "分類"
  },
  // Western properties
  western: {
    properties: "西方草本",
    actions: "作用",
    organAffinities: "歸經",
    organs: "歸經",
    systems: "身體系統",
    scientificName: "學名",
    history: "歷史",
    traditionalUsage: "傳統用途",
    modernResearch: "現代研究"
  },
  // Ayurveda properties
  ayurveda: {
    properties: "阿育吠陀",
    sanskrit: "梵文",
    hindiName: "印地語名稱",
    rasa: "味 (Rasa)",
    guna: "性質 (Guna)",
    virya: "效能 (Virya)",
    vipaka: "後味 (Vipaka)",
    dosha: "三能影響",
    doshas: "三能",
    karma: "作用 (Karma)",
    karmas: "作用",
    mahabhutas: "五大元素",
    rasas: "味 (Rasa)",
    gunas: "性質 (Guna)",
    viryas: "效能 (Virya)",
    vipakas: "後味 (Vipaka)",
    categories: "分類",
    prabhavas: "特異作用 (Prabhava)",
    category: "阿育吠陀分類",
    anupana: "佐藥 (Anupana)",
    anupanaDesc: "作為載體以增強吸收和療效的物質",
    sevanaKala: "服用時機 (Sevana Kala)",
    sevanaKalaDesc: "服用此製劑的最佳時間",
    formulations: "經典配方",
    formulationUse: "用途"
  },
  // Persian (Unani) properties
  persian: {
    properties: "波斯醫學 (尤納尼)",
    name: "波斯名稱",
    temperament: "體質 (Mizaj)",
    temperaments: "體質",
    elements: "元素",
    degrees: "程度",
    actions: "作用",
    affectedOrgans: "作用器官",
    mizajConstituents: "體質成分",
    corrective: "矯正藥 (Musleh)",
    correctiveDesc: "糾正不良影響的物質",
    substitute: "替代藥 (Badal)",
    substituteDesc: "原藥不可用時的替代品",
    dosageForm: "劑型",
    adverseEffects: "不良反應",
    classicalReferences: "古典文獻",
    nomadicUsage: "游牧用法"
  },
  // Mongolian Traditional Medicine properties
  mongolian: {
    properties: "蒙古傳統醫學",
    name: "蒙古名稱",
    tibetanWylie: "藏文 (威利轉寫)",
    elements: "元素",
    roots: "三根",
    tastes: "味道",
    potency: "效能",
    potencies: "效能",
    therapeuticClass: "治療分類",
    preparationMethods: "製備方法",
    formulations: "經典配方",
    formulationUse: "用途",
    classicalReferences: "古典文獻",
    nomadicUsage: "游牧用法"
  },
  // Herbal vocabulary (general)
  herbal: {
    title: "草藥劑型",
    subtitle: "草藥製劑的標準形式和加工方法",
    forms: "製劑形式",
    methods: "製備方法"
  },
  // Systems
  systems: {
    title: "醫學體系",
    subtitle: "探索世界各地的傳統醫學體系",
    profiles: "個檔案",
    preparations: "製劑",
    substances: "物質",
    referenceData: "項參考",
    aboutTitle: "關於傳統醫學體系",
    aboutText: "傳統醫學體系在不同文化中發展了數千年。每個體系都有其獨特的健康、疾病和治療理解框架。Herbapedia根據五大主要體系記錄製劑：傳統中醫、西方草藥學、阿育吠陀、波斯/尤納尼醫學和蒙古傳統醫學。",
    tcm: {
      name: "傳統中醫",
      description: "最古老的連續醫學傳統之一，基於陰陽、氣和五行概念。草藥按其性質、味道和歸經分類。"
    },
    western: {
      name: "西方草藥學",
      description: "歐洲和地中海草藥傳統，強調循證實踐、器官系統親和力和整體健康方法。"
    },
    ayurveda: {
      name: "阿育吠陀",
      description: "古印度醫學體系，基於平衡三大體質（Vata、Pitta、Kapha）。草藥按味、效能和消化後作用分類。"
    },
    persian: {
      name: "波斯/尤納尼醫學",
      description: "希臘阿拉伯醫學傳統，強調體質和四體液平衡。廣泛實踐於南亞和中東。"
    },
    mongolian: {
      name: "蒙古傳統醫學",
      description: "受藏醫影響的傳統治療體系，關注三根能量和元素平衡。"
    },
    modern: {
      name: "現代醫學",
      description: "當代營養和藥物物質，包括維生素、礦物質、氨基酸及其他經現代科學研究支持的生物活性化合物。",
      substances: "物質"
    },
    // New keys
    preparationsWithProfile: "使用此檔案的製劑",
    noPreparations: "尚無使用此檔案的製劑",
    andMore: "還有 {count} 個",
    aboutSystem: "關於{system}",
    items: "項",
    viewAll: "查看全部"
  },
  // Sources
  sources: {
    title: "來源物料",
    subtitle: "探索藥用製劑的來源 - 植物、動物、礦物和化學物質",
    entities: "個實體",
    searchPlaceholder: "按名稱搜尋來源物料...",
    browseCount: "瀏覽 {count} 個來源物料",
    aboutTitle: "關於來源物料",
    aboutText: "藥用製劑源自各種來源物料。植物來源（植物、真菌、藻類）構成最大的類別，但動物來源物質（如來自甲殼類外殼的甲殼素）、礦物化合物（如鋅和鈣）以及合成化學物質（如維生素）也是治療製劑的重要來源。",
    botanical: "植物來源",
    botanicalDesc: "藥用植物。傳統草藥的主要來源。",
    fungi: "真菌來源",
    fungiDesc: "藥用蘑菇和真菌，如靈芝、冬蟲夏草和雲芝。",
    algae: "藻類來源",
    algaeDesc: "藥用藻類和藍藻，如螺旋藻和小球藻。",
    zoological: "動物來源",
    zoologicalDesc: "動物來源物質，如來自甲殼類外殼的甲殼素、魚油和其他動物提取物。",
    mineral: "礦物來源",
    mineralDesc: "天然存在的礦物及其化合物，包括鋅、鈣、鎂和其他必需元素。",
    mineralAbout: "關於礦物來源",
    mineralAboutText: "礦物來源包括用於傳統和現代醫學的天然元素和化合物。這些包括鋅、鈣、鎂等必需礦物質，以及對人體健康至關重要的微量元素。",
    chemical: "化學來源",
    chemicalDesc: "合成或分離的化合物，包括維生素、氨基酸和其他生物活性分子。",
    // Source detail page
    preparationsFromSource: "由此來源製備的製劑",
    description: "描述",
    animalOrigin: "動物來源",
    animalName: "動物名稱",
    animalScientificName: "學名",
    animalPart: "動物部位",
    chemicalProperties: "化學特性",
    chemicalFormula: "化學式",
    synthesis: "合成狀態",
    synthesized: "人工合成",
    natural: "天然來源",
    sourceNotFound: "數據庫中找不到請求的來源物料。",
    backToSources: "返回來源物料"
  },
  // Chemical compounds
  compounds: {
    title: "化學成分",
    subtitle: "藥用植物中發現的活性化合物",
    browseCount: "瀏覽 {count} 種化學成分",
    searchPlaceholder: "按名稱或分子式搜尋...",
    showingResults: '找到 {count} 個結果 "{query}"',
    noResults: "沒有找到符合搜尋條件的化合物。",
    compound: "化合物",
    note: "這些活性化合物有助於草藥的治療特性。目前仍在研究中以充分了解其作用機制。",
    foundIn: "存在於植物",
    noPlants: "尚無含有此化合物的植物記錄。",
    notFound: "數據庫中找不到請求的化合物。",
    backToCompounds: "返回化合物列表",
    identifiers: "化學標識符",
    molecularFormula: "分子式",
    molecularWeight: "分子量",
    casNumber: "CAS 號",
    chebiID: "ChEBI ID",
    pubchemCID: "PubChem CID",
    inchiKey: "InChI Key",
    inchi: "InChI",
    smiles: "SMILES",
    compoundClass: "化合物類別",
    pharmacology: "藥理作用",
    iupacName: "IUPAC 名稱",
    synonyms: "別名",
    bioavailability: "生物利用度",
    safetyData: "安全數據",
    ld50: "半數致死量",
    toxicity: "毒性",
    warnings: "警告"
  },
  // Plant Parts
  plantParts: {
    title: "植物部位",
    subtitle: "用於草藥製劑的藥用植物特定部位",
    browseCount: "瀏覽 {count} 個植物部位",
    searchPlaceholder: "搜尋植物部位...",
    allParts: "所有部位",
    showingResults: '找到 {count} 個結果 "{query}"',
    noResults: "沒有找到符合搜尋條件的植物部位。",
    part: "植物部位",
    partOf: "來自",
    species: "來源物種",
    preparationsFromPart: "使用此部位的製劑",
    notFound: "找不到請求的植物部位。",
    backToParts: "返回植物部位",
    roots: "根",
    rhizomes: "根莖",
    leaves: "葉",
    flowers: "花",
    fruits: "果實",
    seeds: "種子",
    bulbs: "鱗莖",
    barks: "樹皮",
    stems: "莖"
  },
  // DNA Barcodes
  dnaBarcodes: {
    title: "DNA條碼",
    subtitle: "用於物種鑑定和鑑定的DNA序列數據",
    searchPlaceholder: "按名稱、物種或區域搜尋條碼...",
    showingResults: '找到 {count} 個結果 "{query}"',
    barcode: "DNA條碼",
    identification: "鑑定",
    level: "鑑定級別",
    confidence: "置信度",
    method: "方法",
    sequences: "DNA序列",
    viewFullSequence: "查看完整序列",
    hideFullSequence: "隱藏完整序列",
    copySequence: "複製序列",
    sequenceCopied: "序列已複製！",
    adulterantDetection: "摻假檢測",
    canDetect: "此條碼可檢測以下摻假物",
    voucheredSpecimen: "憑證標本",
    herbarium: "植物館",
    collector: "採集者",
    location: "採集地點",
    viewSpecies: "查看源物種",
    disclaimer: "DNA條碼用於物種鑑定和質量控制。結果應由專業人員解釋。",
    notFound: "找不到請求的DNA條碼。",
    backToBarcodes: "返回DNA條碼",
    noResults: "沒有可用的DNA條碼。"
  },
  // Formulas
  formulas: {
    title: "專利配方",
    subtitle: "專利混合配方和成分",
    formula: "配方",
    ingredients: "成分",
    ingredientsNote: "此配方包含以下成分：",
    notFound: "找不到請求的配方。",
    backToFormulas: "返回配方",
    noResults: "沒有可用的配方。"
  },
  // Related herbs
  relatedHerbs: {
    title: "相關草藥",
    sharedCompounds: "{count}個共同成分",
    sameCategory: "同類別",
    similarActions: "相似作用"
  },
  // Safety alerts
  safety: {
    title: "安全資訊",
    disclaimer: "此資訊僅供教育用途。使用任何草藥療法前，請務必諮詢合資格的醫療保健提供者。"
  },
  // External links
  links: {
    title: "外部連結",
    wikidata: "維基數據",
    gbif: "全球生物多樣性信息機構",
    ncbi: "NCBI 分類",
    wikipedia: "維基百科"
  },
  // Disclaimer
  disclaimer: {
    title: "免責聲明",
    text: "本網站內容無意替代專業醫療建議、診斷或治療。如有任何關於醫療狀況的問題，請務必諮詢您的醫生或其他合資格的醫療保健提供者。"
  },
  // Common
  common: {
    items: "項",
    notFound: "找不到",
    herbNotFound: "數據庫中找不到請求的製劑。",
    backToHerbs: "返回製劑",
    noHerbsFound: "沒有找到製劑。",
    browseCollection: "瀏覽我們的藥用植物、草藥、維他命、礦物質和營養素收藏"
  },
  // Language
  language: {
    select: "語言"
  },
  // About page
  about: {
    title: "關於草藥百科",
    mission: {
      title: "使命",
      text: "草藥百科是由國際植物醫學學會（SIPM）開發的綜合百科全書，旨在提供有關藥用植物和天然保健品的準確、循證信息。"
    },
    history: {
      title: "歷史",
      p1: "草藥百科最初由維特健靈健康產品有限公司於2000年創建，由已故的Hillman Curtis設計，當時市面上並沒有公開可獲取、經醫學策劃且準確的科學草藥知識庫供公眾參考。",
      p2: "除了記錄超過100種草藥成分外，草藥百科的一大特色是其高品質的矢量插圖，全部從零開始繪製，向讀者展示各種草藥植物的外觀。",
      p3: "草藥百科由維特健靈開發及資助，並自始公開供大眾查閱。作為SIPM的創始成員，維特健靈已授權SIPM複製和擴展該數據集以供開放使用，SIPM深感榮幸能承接草藥百科的使命。"
    },
    content: {
      title: "我們的內容",
      intro: "我們的數據庫涵蓋五大類別：",
      chineseHerbs: "傳統中藥植物和真菌",
      westernHerbs: "歐洲和北美草藥",
      vitamins: "人體健康必需的維他命",
      minerals: "重要的膳食礦物質和微量元素",
      nutrients: "有益的化合物和補充劑"
    },
    approach: {
      title: "理念",
      text: "我們將傳統智慧與現代科學研究相結合。每個條目都融合了歷史和傳統用途與當代科學發現，為天然健康療法提供平衡的觀點。"
    },
    sipm: {
      title: "關於SIPM",
      text: "國際植物醫學學會（SIPM）致力於推進全球對藥用植物的科學理解和負責任使用。",
      link: "訪問SIPM網站"
    },
    ontology: {
      title: "本體架構",
      intro: "Herbapedia 採用以製劑為中心的本體結構，HerbalPreparation（藥用製劑）為核心實體。本文檔為開發者和數據架構師描述數據模型。",
      coreEntity: "核心實體：HerbalPreparation（藥用製劑）",
      coreEntityDesc: "HerbalPreparation 實體代表已加工、可供治療使用的藥用材料。它作為樞紐，連接來源物料（植物、動物、礦物）與各醫學體系的治療檔案（中醫、西方草藥、阿育吠陀等）。",
      sourceMaterials: "來源物料",
      sourceMaterialsDesc: "製劑可源自四種類型的來源物料：",
      sourcePlant: "植物來源 - 藥用植物、真菌、藻類",
      sourceAnimal: "動物來源 - 甲殼素（甲殼類外殼）、鱈魚肝油等",
      sourceMineral: "礦物來源 - 鋅、鈣、鎂化合物",
      sourceChemical: "化學來源 - 合成維生素、分離化合物",
      profiles: "醫學體系檔案",
      profilesDesc: "每個製劑可有一個或多個體系檔案，根據不同傳統醫學體系描述其治療特性：",
      profileTCM: "傳統中醫檔案 - 藥性、五味、歸經、分類",
      profileWestern: "西方草藥檔案 - 藥理作用、器官親和力",
      profileAyurveda: "阿育吠陀檔案 - 味、性質、效能、消化後作用、三能影響",
      profilePersian: "波斯/尤納尼檔案 - 體質和元素",
      profileMongolian: "蒙古傳統醫學檔案 - 元素、三根、味道",
      referenceData: "參考數據",
      referenceDataDesc: "每個醫學體系定義自己的參考術語分類法，帶有多語言標籤：",
      relationships: "實體關係",
      relationshipsDesc: "本體使用 RDF 風格的關係連接實體：",
      i18n: "國際化（i18n）",
      i18nDesc: "所有本體術語使用 SKOS prefLabel 進行多語言支援。標籤存儲在數據庫，而非應用程式碼中：",
      serialization: "序列化格式",
      serializationDesc: "所有數據以 JSON-LD 格式存儲，具有適當的 {'@'}context 以實現語義互操作性。{'@'}context 文件定義 tcm:、ayurveda:、western:、persian:、mongolian: 和 botany: 詞彙的前綴。"
    }
  },
  // Basics page
  basics: {
    title: "藥用植物基礎知識",
    subtitle: "了解植物醫學的科學與傳統",
    medicinalPlants: {
      title: "什麼是藥用植物？",
      p1: "藥用植物又稱草藥，自史前時代起就在傳統醫學實踐中被發現和使用。植物合成數百種化合物用於各種功能，包括防禦昆蟲、真菌、疾病和草食性哺乳動物。",
      p2: "草本植物是沒有持久木質莖的維管植物，可分為一年生、二年生或多年生。與木本植物（樹木和灌木）不同，草本植物的莖柔軟多汁，在生長季節結束時會枯萎凋落。與之相對應的是木本植物，人們通常將草本植物稱作「草」，而將木本植物稱為「樹」。",
      p3: "研究藥用植物的學科稱為藥用植物學或生藥學。該領域涵蓋用於醫學的植物的鑑定、採集、保存和治療應用。現代生藥學將傳統知識與當代科學方法相結合。"
    },
    importance: {
      title: "藥用植物的重要性",
      p1: "人類所有主要的糧食作物全部都是草本植物——它們的果實、種子、根和葉構成了人類營養的基礎。除了營養價值外，草本植物通過光合作用產生大量氧氣，並通過其根系在防止水土流失方面發揮關鍵作用。",
      p2: "在現代醫學中，約25%的處方藥來源於藥用植物或含有植物源性化合物。世界衛生組織估計，全球80%的人口依賴傳統醫學（主要是植物性療法）作為主要醫療保健來源。",
      p3: "藥用植物提供三種主要效益：為消費者帶來健康效益，為採集者和分銷商帶來經濟效益，以及包括就業機會和改善公共健康在內的社會效益。全球藥用和芳香植物市場每年超過680億美元。"
    },
    history: {
      title: "草藥醫學的歷史",
      p1: "藥用植物的最早歷史記錄可追溯至蘇美爾文明（約公元前3000年），數百種植物包括鴉片被記錄在泥板上。埃及的埃伯斯紙草文稿（約公元前1550年）描述了850多種植物藥物。希臘醫生迪奧斯克里德斯在《藥物論》（約公元60年）中記錄了使用600種藥用植物的1000多個配方，該書在1500多年間一直是權威參考。",
      p2: "傳統中醫（TCM）在《神農本草經》中記載了植物藥物，並在唐代得到擴展。印度的阿育吠陀醫學數千年來使用數百種草藥和香料，記載於《阿達婆吠陀》和《妙聞本集》等文獻中。在伊斯蘭黃金時代，學者翻譯並擴展了希臘文獻，發展出複雜的藥典。",
      p3: "19世紀是一個轉折點，化學分析使活性化合物的分離成為可能。生物鹼如嗎啡（1806年）、奎寧以及後來的強心苷被純化，奠定了現代藥理學的基礎。如今，藥物發現繼續借鑑民族植物學知識來識別新的治療化合物。"
    },
    phytochemicals: {
      title: "藥用植物的活性成分",
      intro: "植物產生稱為植物化學物的化合物，提供進化優勢。這些化合物構成了藥用植物治療用途的科學基礎。四大類具有藥理活性的植物化合物是：",
      alkaloids: {
        title: "生物鹼",
        desc: "味苦的含氮化合物，通常具有強效的藥理作用。許多生物鹼作用於神經系統或具有鎮痛特性。",
        examples: "例子：嗎啡（罌粟）、咖啡因（咖啡）、奎寧（金雞納）、小檗鹼（黃連）"
      },
      glycosides: {
        title: "苷類",
        desc: "糖分子與非碳水化合物活性成分結合的化合物。強心苷支持心臟功能，而蒽醌苷具有瀉下作用。",
        examples: "例子：地高辛（洋地黃）、番瀉苷（番瀉葉）、水楊苷（柳樹皮）"
      },
      polyphenols: {
        title: "多酚類",
        desc: "具有抗氧化和抗炎特性的多樣化化合物群。包括類黃酮、單寧和植物雌激素，可調節各種生理過程。",
        examples: "例子：薑黃素（薑黃）、兒茶素（綠茶）、白藜蘆醇（葡萄）、類黃酮（多種植物）"
      },
      terpenes: {
        title: "萜烯與萜類",
        desc: "存在於精油中的芳香化合物。許多具有抗菌、抗炎或鎮靜特性。廣泛用於芳香療法和作為調味劑。",
        examples: "例子：百里香酚（百里香）、薄荷醇（薄荷）、檸檬烯（柑橘）、人參皂苷（人參）"
      }
    },
    systems: {
      title: "主要傳統醫學體系",
      intro: "幾個傳統醫學體系已發展出理解和應用藥用植物的綜合框架。這些體系獲得學術認可，在許多國家與常規醫學並行實踐：",
      tcm: {
        title: "傳統中醫（TCM）",
        desc: "起源於2500多年前的中國，中醫使用氣（生命能量）、陰陽平衡和五行的概念。草藥按其性質（溫度）、味道和歸經分類。中醫包括針灸、艾灸和草藥方劑。"
      },
      ayurveda: {
        title: "阿育吠陀",
        desc: "可追溯至5000年前的古印度醫學體系。基於平衡三大體質（Vata、Pitta、Kapha），阿育吠陀使用按味道、效能和消化後作用分類的草藥。薑黃、南非醉茄和三果寶是主要療法。"
      },
      jamu: {
        title: "佳慕（Jamu）",
        desc: "印尼的傳統草藥醫學體系，被聯合國教科文組織認定為非物質文化遺產。佳慕使用新鮮的根、樹皮和葉子製成煎劑。主要成分包括生薑、薑黃、羅望子和爪哇薑黃。"
      },
      western: {
        title: "西方草藥學",
        desc: "源於歐洲和希臘羅馬傳統，西方草藥學強調使用本土植物和循證植物療法。從業者使用全植物提取物，關注器官系統。主要草藥包括紫錐菊、聖約翰草和纈草。"
      },
      unani: {
        title: "尤納尼醫學",
        desc: "源於希臘阿拉伯醫學，在伊斯蘭世界發展，尤納尼基於四體液學說。強調體液（血液、粘液、黃膽汁、黑膽汁）的平衡，使用草藥、飲食和療法。"
      }
    },
    sipm: {
      title: "SIPM的使命",
      mission: "國際植物醫學學會（SIPM）致力於推進全球對藥用植物的科學理解和負責任應用。我們的使命將傳統知識與現代科學相結合。",
      goal1: "推進藥用植物對人體生理藥理作用的科學研究",
      goal2: "促進草藥醫學生產和監管的標準化和質量控制",
      goal3: "通過民族植物學研究和植物化學分析支持藥物發現",
      goal4: "促進傳統醫學從業者與現代醫療系統之間的合作"
    }
  },
  // Reference data
  reference: {
    preparations: "個製劑",
    noPreparations: "沒有製劑使用此數值",
    noItems: "沒有找到參考項目",
    notFound: "找不到參考數據",
    backToList: "返回列表",
    usingPreparations: "使用此數值的製劑",
    // TCM
    naturesDesc: "按藥物對身體的熱效應分類",
    flavorsDesc: "五味及其相應的臟腑關係",
    meridiansDesc: "草藥被認為影響的能量通道",
    categoriesDesc: "中藥的功能分類",
    tcmActionsDesc: "傳統中醫的治療作用",
    // Western
    actionsDesc: "草藥的藥理作用",
    organsDesc: "草藥主要影響的臟器和系統",
    systemsDesc: "草藥影響的身體系統",
    // Ayurveda
    rasaDesc: "阿育吠陀的六味",
    gunaDesc: "物質的二十種屬性",
    viryaDesc: "熱或冷的效能",
    vipakaDesc: "消化後作用",
    doshasDesc: "阿育吠陀的三種體質類型",
    karmasDesc: "阿育吠陀的治療作用",
    mahabhutasDesc: "阿育吠陀的五大元素",
    ayurvedaCategoriesDesc: "阿育吠陀草藥按治療作用的分類",
    prabhavasDesc: "無法從其他屬性預測的草藥特異作用",
    // Persian
    temperamentsDesc: "尤納尼醫學中的四種體質",
    persianElementsDesc: "波斯醫學中的四元素",
    degreesDesc: "波斯醫學中的強度等級",
    // Mongolian
    elementsDesc: "蒙古醫學中的五元素",
    tastesDesc: "蒙古醫學中的六味",
    rootsDesc: "蒙古醫學中的三根能量",
    potenciesDesc: "蒙古醫學中的治療效能",
    // Herbal vocabulary
    formsDesc: "草藥製劑的物理形式，如粉末、膠囊、酊劑等",
    methodsDesc: "草藥材料的加工方法，如乾燥、蒸製、炒製等"
  }
};
const zhHans = {
  // Navigation
  nav: {
    home: "首页",
    preparations: "制剂",
    sources: "来源",
    plants: "植物",
    systems: "医学体系",
    compounds: "化合物",
    herbs: "草药",
    basics: "基础知识",
    about: "关于",
    standards: "标准",
    sipmHome: "SIPM 主页"
  },
  // Home page
  home: {
    heroTitle: "Herbapedia",
    heroSubtitle: "药用植物百科全书",
    heroDescription: "全面的药用植物、草药、维生素、矿物质及营养素资源——结合传统智慧与现代科学研究。",
    exploreHerbs: "探索制剂",
    browseBySystem: "按医学体系浏览",
    browseByProperty: "按特性浏览",
    categoriesTitle: "按传统医学浏览",
    aboutTitle: "关于 Herbapedia",
    aboutP1: "Herbapedia 是由国际植物医学学会（SIPM）开发的综合百科全书，旨在提供准确、循证的药用植物和天然健康补充品信息。",
    aboutP2: "我们的数据库涵盖传统中药、西方草药、维生素、矿物质和必需营养素——结合古老智慧与现代科学研究。",
    learnMore: "了解更多关于 SIPM",
    traditionTCM: "传统中医",
    traditionWestern: "西方草药",
    traditionAyurveda: "阿育吠陀",
    traditionModern: "现代医学",
    browsePreparations: "浏览制剂"
  },
  // Categories
  categories: {
    title: "分类",
    chineseHerbs: "中药",
    westernHerbs: "西草药",
    vitamins: "维生素",
    minerals: "矿物质",
    nutrients: "营养素"
  },
  // Preparations
  preparations: {
    browseCount: "浏览 {count} 种药用制剂",
    searchPlaceholder: "按名称或学名搜寻制剂...",
    filters: "筛选",
    systemProfiles: "系统归类",
    tcmProperties: "中医特性",
    westernProperties: "西方特性",
    clearAll: "清除全部",
    all: "全部",
    applyFilters: "应用筛选",
    showingResults: "显示 {count} / {total} 种制剂",
    noResults: "没有符合筛选条件的制剂。请尝试调整搜寻条件。",
    botanicalSource: "植物来源",
    zoologicalSource: "动物来源",
    mineralSource: "矿物来源",
    chemicalSource: "化学来源",
    sourceMaterial: "来源物料",
    scientificName: "学名",
    family: "科",
    genus: "属",
    relatedPreparations: "相关制剂",
    allergens: "致敏原",
    pregnancySafety: "孕期安全",
    drugInteractions: "药物相互作用",
    notFound: "数据库中找不到请求的制剂。",
    backToPreparations: "返回制剂",
    tcm: "中医",
    western: "西方",
    ayurveda: "阿育吠陀",
    persian: "波斯",
    mongolian: "蒙古",
    modern: "现代",
    ayurvedaComingSoon: "阿育吠陀资料即将推出。",
    natureHot: "热",
    natureWarm: "温",
    natureNeutral: "平",
    natureCool: "凉",
    natureCold: "寒",
    viewPlantProfile: "查看植物档案",
    preparationsFromPlant: "此植物有 {count} 种制剂",
    // Preparation Information
    preparationInfo: "制剂信息",
    preparationDetails: "制备详情",
    appearance: "外观特征",
    storageRequirements: "储存要求",
    shelfLife: "保质期",
    // Common Usage
    commonUsage: "常见用途",
    culinaryUse: "烹饪用途",
    aromatherapyUse: "芳香疗法",
    cosmeticUse: "美容用途",
    industrialUse: "工业用途",
    // Safety
    warnings: "警告",
    // TCM Profile
    classicalReference: "典籍记载",
    quote: "原文",
    dosageEffect: "剂量效应",
    smallDose: "小剂量",
    mediumDose: "中剂量",
    largeDose: "大剂量",
    comparisonNotes: "对比说明",
    incompatibilities: "配伍禁忌",
    // Form and Preparation
    form: "剂型",
    preparationMethod: "制备方法"
  },
  // Plants
  plants: {
    title: "植物",
    browseCount: "浏览 {count} 种植物",
    searchPlaceholder: "按名称或学名搜寻植物...",
    allPlants: "全部植物",
    withPreparations: "有制剂",
    showingResults: '找到 {count} 个结果 "{query}"',
    noResults: "没有找到符合搜寻条件的植物。",
    species: "物种",
    family: "科",
    genus: "属",
    parts: "植物部位",
    description: "植物描述",
    preparationsFromPlant: "由此植物制备的制剂",
    noPreparations: "暂时没有由此植物制备的制剂。",
    notFound: "数据库中找不到请求的植物。",
    backToPlants: "返回植物",
    preparations: "种制剂",
    noImage: "暂无图片",
    // DNA Barcode
    dnaBarcode: "DNA条形码",
    identificationConfidence: "鉴定置信度",
    canDetectAdulterants: "可检测掺假物",
    // Chemical Profile
    chemicalProfile: "化学成分",
    totalVolatileOil: "总挥发油",
    analyticalMethod: "分析方法",
    qualityGrade: "质量等级",
    chemicalComponents: "化学成分",
    // Taxonomy
    taxonomy: "分类学",
    kingdom: "界",
    phylum: "门",
    class: "纲",
    order: "目",
    // Distribution
    distributionAndHabitat: "分布与生境",
    origin: "原产地",
    habitat: "生境",
    distribution: "地理分布",
    // Characteristics
    characteristics: "植物特性",
    growthForm: "生长型",
    lifecycle: "生命周期",
    growthForms: {
      herb: "草本",
      shrub: "灌木",
      tree: "乔木",
      vine: "藤本",
      climber: "攀援植物",
      epiphyte: "附生植物",
      aquatic: "水生植物"
    },
    lifecycles: {
      annual: "一年生",
      biennial: "二年生",
      perennial: "多年生"
    },
    // Conservation
    conservationStatus: "保护状况",
    conservationStatuses: {
      LC: "无危",
      NT: "近危",
      VU: "易危",
      EN: "濒危",
      CR: "极危",
      EW: "野外灭绝",
      EX: "灭绝",
      DD: "数据缺乏",
      NE: "未评估"
    }
  },
  // Herb detail sections
  sections: {
    history: "历史",
    introduction: "简介",
    botanicalSource: "植物来源",
    traditionalUsage: "传统用途",
    modernResearch: "现代研究",
    functions: "功效",
    importance: "重要性",
    foodSources: "食物来源",
    description: "描述",
    indications: "适应症",
    contraindications: "禁忌",
    dosage: "剂量",
    classicalReference: "典籍记载",
    safetyConsideration: "注意事项"
  },
  // TCM properties
  tcm: {
    properties: "中药特性",
    nature: "药性",
    flavor: "味道",
    meridian: "归经",
    category: "分类",
    pinyin: "拼音",
    actions: "作用",
    natures: "药性",
    flavors: "五味",
    meridians: "归经",
    categories: "分类"
  },
  // Western properties
  western: {
    properties: "西方草药",
    actions: "作用",
    organAffinities: "归经",
    organs: "归经",
    systems: "身体系统",
    scientificName: "学名",
    history: "历史",
    traditionalUsage: "传统用途",
    modernResearch: "现代研究"
  },
  // Ayurveda properties
  ayurveda: {
    properties: "阿育吠陀",
    sanskrit: "梵文",
    hindiName: "印地语名称",
    rasa: "味 (Rasa)",
    guna: "性质 (Guna)",
    virya: "效能 (Virya)",
    vipaka: "后味 (Vipaka)",
    dosha: "三能影响",
    doshas: "三能",
    karma: "作用 (Karma)",
    karmas: "作用",
    mahabhutas: "五大元素",
    rasas: "味 (Rasa)",
    gunas: "性质 (Guna)",
    viryas: "效能 (Virya)",
    vipakas: "后味 (Vipaka)",
    categories: "分类",
    prabhavas: "特异作用 (Prabhava)",
    category: "阿育吠陀分类",
    anupana: "佐药 (Anupana)",
    anupanaDesc: "作为载体以增强吸收和疗效的物质",
    sevanaKala: "服用时机 (Sevana Kala)",
    sevanaKalaDesc: "服用此制剂的最佳时间",
    formulations: "经典配方",
    formulationUse: "用途"
  },
  // Persian (Unani) properties
  persian: {
    properties: "波斯医学 (尤纳尼)",
    name: "波斯名称",
    arabicName: "阿拉伯名称",
    temperament: "体质 (Mizaj)",
    temperaments: "体质",
    elements: "元素",
    degrees: "程度",
    actions: "作用",
    affectedOrgans: "作用器官",
    mizajConstituents: "体质成分",
    corrective: "矫正药 (Musleh)",
    correctiveDesc: "纠正不良影响的物质",
    substitute: "替代药 (Badal)",
    substituteDesc: "原药不可用时的替代品",
    dosageForm: "剂型",
    adverseEffects: "不良反应",
    classicalReferences: "古典文献",
    nomadicUsage: "游牧用法"
  },
  // Mongolian Traditional Medicine properties
  mongolian: {
    properties: "蒙古传统医学",
    name: "蒙古名称",
    tibetanWylie: "藏文 (威利转写)",
    elements: "元素",
    roots: "三根",
    tastes: "味道",
    potency: "效能",
    potencies: "效能",
    therapeuticClass: "治疗分类",
    preparationMethods: "制备方法",
    formulations: "经典配方",
    formulationUse: "用途",
    classicalReferences: "古典文献",
    nomadicUsage: "游牧用法"
  },
  // Herbal vocabulary (general)
  herbal: {
    title: "草药剂型",
    subtitle: "草药制剂的标准形式和加工方法",
    forms: "制剂形式",
    methods: "制备方法"
  },
  // Systems
  systems: {
    title: "医学体系",
    subtitle: "探索世界各地的传统医学体系",
    profiles: "个档案",
    preparations: "制剂",
    substances: "物质",
    referenceData: "项参考",
    aboutTitle: "关于传统医学体系",
    aboutText: "传统医学体系在不同文化中发展了数千年。每个体系都有其独特的健康、疾病和治疗理解框架。Herbapedia根据五大主要体系记录制剂：传统中医、西方草药学、阿育吠陀、波斯/尤纳尼医学和蒙古传统医学。",
    tcm: {
      name: "传统中医",
      description: "最古老的连续医学传统之一，基于阴阳、气和五行概念。草药按其性质、味道和归经分类。"
    },
    western: {
      name: "西方草药学",
      description: "欧洲和地中海草药传统，强调循证实践、器官系统亲和力和整体健康方法。"
    },
    ayurveda: {
      name: "阿育吠陀",
      description: "古印度医学体系，基于平衡三大体质（Vata、Pitta、Kapha）。草药按味（rasa）、效能和消化后作用分类。"
    },
    persian: {
      name: "波斯/尤纳尼医学",
      description: "希腊阿拉伯医学传统，强调体质和四体液平衡。广泛实践于南亚和中东。"
    },
    mongolian: {
      name: "蒙古传统医学",
      description: "受藏医影响的传统治疗体系，关注三根能量和元素平衡。"
    },
    modern: {
      name: "现代医学",
      description: "当代营养和药物物质，包括维生素、矿物质、氨基酸及其他经现代科学研究支持的生物活性化合物。",
      substances: "物质"
    },
    // New keys
    preparationsWithProfile: "使用此档案的制剂",
    noPreparations: "尚无使用此档案的制剂",
    andMore: "还有 {count} 个",
    aboutSystem: "关于{system}",
    items: "项",
    viewAll: "查看全部"
  },
  // Sources
  sources: {
    title: "来源物料",
    subtitle: "探索药用制剂的来源 - 植物、动物、矿物和化学物质",
    entities: "个实体",
    searchPlaceholder: "按名称搜索来源物料...",
    browseCount: "浏览 {count} 个来源物料",
    aboutTitle: "关于来源物料",
    aboutText: "药用制剂源自各种来源物料。植物来源（植物、真菌、藻类）构成最大的类别，但动物来源物质（如来自甲壳类外壳的甲壳素）、矿物化合物（如锌和钙）以及合成化学物质（如维生素）也是治疗制剂的重要来源。",
    botanical: "植物来源",
    botanicalDesc: "药用植物。传统草药的主要来源。",
    fungi: "真菌来源",
    fungiDesc: "药用蘑菇和真菌，如灵芝、冬虫夏草和云芝。",
    algae: "藻类来源",
    algaeDesc: "药用藻类和蓝藻，如螺旋藻和小球藻。",
    zoological: "动物来源",
    zoologicalDesc: "动物来源物质，如来自甲壳类外壳的甲壳素、鱼油和其他动物提取物。",
    mineral: "矿物来源",
    mineralDesc: "天然存在的矿物及其化合物，包括锌、钙、镁和其他必需元素。",
    mineralAbout: "关于矿物来源",
    mineralAboutText: "矿物来源包括用于传统和现代医学的天然元素和化合物。这些包括锌、钙、镁等必需矿物质，以及对人体健康至关重要的微量元素。",
    chemical: "化学来源",
    chemicalDesc: "合成或分离的化合物，包括维生素、氨基酸和其他生物活性分子。",
    // Source detail page
    preparationsFromSource: "由此来源制备的制剂",
    description: "描述",
    animalOrigin: "动物来源",
    animalName: "动物名称",
    animalScientificName: "学名",
    animalPart: "动物部位",
    chemicalProperties: "化学特性",
    chemicalFormula: "化学式",
    synthesis: "合成状态",
    synthesized: "人工合成",
    natural: "天然来源",
    sourceNotFound: "数据库中找不到请求的来源物料。",
    backToSources: "返回来源物料"
  },
  // Chemical compounds
  compounds: {
    title: "化学成分",
    subtitle: "药用植物中发现的活性化合物",
    browseCount: "浏览 {count} 种化学成分",
    searchPlaceholder: "按名称或分子式搜索...",
    showingResults: '找到 {count} 个结果 "{query}"',
    noResults: "没有找到符合搜索条件的化合物。",
    compound: "化合物",
    note: "这些活性化合物有助于草药的治疗特性。目前仍在研究中以充分了解其作用机制。",
    foundIn: "存在于植物",
    noPlants: "尚无含有此化合物的植物记录。",
    notFound: "数据库中找不到请求的化合物。",
    backToCompounds: "返回化合物列表",
    identifiers: "化学标识符",
    molecularFormula: "分子式",
    molecularWeight: "分子量",
    casNumber: "CAS 号",
    chebiID: "ChEBI ID",
    pubchemCID: "PubChem CID",
    inchiKey: "InChI Key",
    inchi: "InChI",
    smiles: "SMILES",
    compoundClass: "化合物类别",
    pharmacology: "药理作用",
    iupacName: "IUPAC 名称",
    synonyms: "别名",
    bioavailability: "生物利用度",
    safetyData: "安全数据",
    ld50: "半数致死量",
    toxicity: "毒性",
    warnings: "警告"
  },
  // Plant Parts
  plantParts: {
    title: "植物部位",
    subtitle: "用于草药制剂的药用植物特定部位",
    browseCount: "浏览 {count} 个植物部位",
    searchPlaceholder: "搜索植物部位...",
    allParts: "所有部位",
    showingResults: '找到 {count} 个结果 "{query}"',
    noResults: "没有找到符合搜索条件的植物部位。",
    part: "植物部位",
    partOf: "来自",
    species: "来源物种",
    preparationsFromPart: "使用此部位的制剂",
    notFound: "找不到请求的植物部位。",
    backToParts: "返回植物部位",
    roots: "根",
    rhizomes: "根茎",
    leaves: "叶",
    flowers: "花",
    fruits: "果实",
    seeds: "种子",
    bulbs: "鳞茎",
    barks: "树皮",
    stems: "茎"
  },
  // DNA Barcodes
  dnaBarcodes: {
    title: "DNA条形码",
    subtitle: "用于物种鉴定和鉴定的DNA序列数据",
    searchPlaceholder: "按名称、物种或区域搜索条形码...",
    showingResults: '找到 {count} 个结果 "{query}"',
    barcode: "DNA条形码",
    identification: "鉴定",
    level: "鉴定级别",
    confidence: "置信度",
    method: "方法",
    sequences: "DNA序列",
    viewFullSequence: "查看完整序列",
    hideFullSequence: "隐藏完整序列",
    copySequence: "复制序列",
    sequenceCopied: "序列已复制！",
    adulterantDetection: "掺假检测",
    canDetect: "此条形码可检测以下掺假物",
    voucheredSpecimen: "凭证标本",
    herbarium: "植物馆",
    collector: "采集者",
    location: "采集地点",
    viewSpecies: "查看源物种",
    disclaimer: "DNA条形码用于物种鉴定和质量控制。结果应由专业人员解释。",
    notFound: "找不到请求的DNA条形码。",
    backToBarcodes: "返回DNA条形码",
    noResults: "没有可用的DNA条形码。"
  },
  // Formulas
  formulas: {
    title: "专利配方",
    subtitle: "专利混合配方和成分",
    formula: "配方",
    ingredients: "成分",
    ingredientsNote: "此配方包含以下成分：",
    notFound: "找不到请求的配方。",
    backToFormulas: "返回配方",
    noResults: "没有可用的配方。"
  },
  // Related herbs
  relatedHerbs: {
    title: "相关草药",
    sharedCompounds: "{count}个共同成分",
    sameCategory: "同类别",
    similarActions: "相似作用"
  },
  // Safety alerts
  safety: {
    title: "安全资讯",
    disclaimer: "此资讯仅供教育用途。使用任何草药疗法前，请务必咨询合资格的医疗保健提供者。"
  },
  // External links
  links: {
    title: "外部链接",
    wikidata: "维基数据",
    gbif: "全球生物多样性信息机构",
    ncbi: "NCBI 分类",
    wikipedia: "维基百科"
  },
  // Disclaimer
  disclaimer: {
    title: "免责声明",
    text: "本网站内容无意替代专业医疗建议、诊断或治疗。如有任何关于医疗状况的问题，请务必咨询您的医生或其他合资格的医疗保健提供者。"
  },
  // Common
  common: {
    items: "项",
    notFound: "找不到",
    herbNotFound: "数据库中找不到请求的制剂。",
    backToHerbs: "返回制剂",
    noHerbsFound: "没有找到制剂。",
    browseCollection: "浏览我们的药用植物、草药、维生素、矿物质和营养素收藏"
  },
  // Language
  language: {
    select: "语言"
  },
  // About page
  about: {
    title: "关于草药百科",
    mission: {
      title: "使命",
      text: "草药百科是由国际植物医学学会（SIPM）开发的综合百科全书，旨在提供有关药用植物和天然保健品的准确、循证信息。"
    },
    history: {
      title: "历史",
      p1: "草药百科最初由维特健灵健康产品有限公司于2000年创建，由已故的Hillman Curtis设计，当时市面上并没有公开可获取、经医学策划且准确的科学草药知识库供公众参考。",
      p2: "除了记录超过100种草药成分外，草药百科的一大特色是其高品质的矢量插图，全部从零开始绘制，向读者展示各种草药植物的外观。",
      p3: "草药百科由维特健灵开发及资助，并自始公开供大众查阅。作为SIPM的创始成员，维特健灵已授权SIPM复制和扩展该数据集以供开放使用，SIPM深感荣幸能承接草药百科的使命。"
    },
    content: {
      title: "我们的内容",
      intro: "我们的数据库涵盖五大类别：",
      chineseHerbs: "传统中药植物和真菌",
      westernHerbs: "欧洲和北美草药",
      vitamins: "人体健康必需的维生素",
      minerals: "重要的膳食矿物质和微量元素",
      nutrients: "有益的化合物和补充剂"
    },
    approach: {
      title: "理念",
      text: "我们将传统智慧与现代科学研究相结合。每个条目都融合了历史和传统用途与当代科学发现，为天然健康疗法提供平衡的观点。"
    },
    sipm: {
      title: "关于SIPM",
      text: "国际植物医学学会（SIPM）致力于推进全球对药用植物的科学理解和负责任使用。",
      link: "访问SIPM网站"
    },
    ontology: {
      title: "本体架构",
      intro: "Herbapedia 采用以制剂为中心的本体结构，HerbalPreparation（药用制剂）为核心实体。本文档为开发者和数据架构师描述数据模型。",
      coreEntity: "核心实体：HerbalPreparation（药用制剂）",
      coreEntityDesc: "HerbalPreparation 实体代表已加工、可供治疗使用的药用材料。它作为枢纽，连接来源物料（植物、动物、矿物）与各医学体系的治疗档案（中医、西方草药、阿育吠陀等）。",
      sourceMaterials: "来源物料",
      sourceMaterialsDesc: "制剂可源自四种类型的来源物料：",
      sourcePlant: "植物来源 - 药用植物、真菌、藻类",
      sourceAnimal: "动物来源 - 甲壳素（甲壳类外壳）、鳕鱼肝油等",
      sourceMineral: "矿物来源 - 锌、钙、镁化合物",
      sourceChemical: "化学来源 - 合成维生素、分离化合物",
      profiles: "医学体系档案",
      profilesDesc: "每个制剂可有一个或多个体系档案，根据不同传统医学体系描述其治疗特性：",
      profileTCM: "传统中医档案 - 药性、五味、归经、分类",
      profileWestern: "西方草药档案 - 药理作用、器官亲和力",
      profileAyurveda: "阿育吠陀档案 - 味、性质、效能、消化后作用、三能影响",
      profilePersian: "波斯/尤纳尼档案 - 体质和元素",
      profileMongolian: "蒙古传统医学档案 - 元素、三根、味道",
      referenceData: "参考数据",
      referenceDataDesc: "每个医学体系定义自己的参考术语分类法，带有多语言标签：",
      relationships: "实体关系",
      relationshipsDesc: "本体使用 RDF 风格的关系连接实体：",
      i18n: "国际化（i18n）",
      i18nDesc: "所有本体术语使用 SKOS prefLabel 进行多语言支持。标签存储在数据库，而非应用程序代码中：",
      serialization: "序列化格式",
      serializationDesc: "所有数据以 JSON-LD 格式存储，具有适当的 {'@'}context 以实现语义互操作性。{'@'}context 文件定义 tcm:、ayurveda:、western:、persian:、mongolian: 和 botany: 词汇的前缀。"
    }
  },
  // Basics page
  basics: {
    title: "药用植物基础知识",
    subtitle: "了解植物医学的科学与传统",
    medicinalPlants: {
      title: "什么是药用植物？",
      p1: "药用植物又称草药，自史前时代起就在传统医学实践中被发现和使用。植物合成数百种化合物用于各种功能，包括防御昆虫、真菌、疾病和草食性哺乳动物。",
      p2: '草本植物是没有持久木质茎的维管植物，可分为一年生、二年生或多年生。与木本植物（树木和灌木）不同，草本植物的茎柔软多汁，在生长季节结束时会枯萎凋落。与之相对应的是木本植物，人们通常将草本植物称作"草"，而将木本植物称为"树"。',
      p3: "研究药用植物的学科称为药用植物学或生药学。该领域涵盖用于医学的植物的鉴定、采集、保存和治疗应用。现代生药学将传统知识与当代科学方法相结合。"
    },
    importance: {
      title: "药用植物的重要性",
      p1: "人类所有主要的粮食作物全部都是草本植物——它们的果实、种子、根和叶构成了人类营养的基础。除了营养价值外，草本植物通过光合作用产生大量氧气，并通过其根系在防止水土流失方面发挥关键作用。",
      p2: "在现代医学中，约25%的处方药来源于药用植物或含有植物源性化合物。世界卫生组织估计，全球80%的人口依赖传统医学（主要是植物性疗法）作为主要医疗保健来源。",
      p3: "药用植物提供三种主要效益：为消费者带来健康效益，为采集者和分销商带来经济效益，以及包括就业机会和改善公共健康在内的社会效益。全球药用和芳香植物市场每年超过680亿美元。"
    },
    history: {
      title: "草药医学的历史",
      p1: "药用植物的最早历史记录可追溯至苏美尔文明（约公元前3000年），数百种植物包括鸦片被记录在泥板上。埃及的埃伯斯纸草文稿（约公元前1550年）描述了850多种植物药物。希腊医生迪奥斯科里德斯在《药物论》（约公元60年）中记录了使用600种药用植物的1000多个配方，该书在1500多年间一直是权威参考。",
      p2: "传统中医（TCM）在《神农本草经》中记载了植物药物，并在唐代得到扩展。印度的阿育吠陀医学数千年来使用数百种草药和香料，记载于《阿达婆吠陀》和《妙闻本集》等文献中。在伊斯兰黄金时代，学者翻译并扩展了希腊文献，发展出复杂的药典。",
      p3: "19世纪是一个转折点，化学分析使活性化合物的分离成为可能。生物碱如吗啡（1806年）、奎宁以及后来的强心苷被纯化，奠定了现代药理学的基础。如今，药物发现继续借鉴民族植物学知识来识别新的治疗化合物。"
    },
    phytochemicals: {
      title: "药用植物的活性成分",
      intro: "植物产生称为植物化学物的化合物，提供进化优势。这些化合物构成了药用植物治疗用途的科学基础。四大类具有药理活性的植物化合物是：",
      alkaloids: {
        title: "生物碱",
        desc: "味苦的含氮化合物，通常具有强效的药理作用。许多生物碱作用于神经系统或具有镇痛特性。",
        examples: "例子：吗啡（罂粟）、咖啡因（咖啡）、奎宁（金鸡纳）、小檗碱（黄连）"
      },
      glycosides: {
        title: "苷类",
        desc: "糖分子与非碳水化合物活性成分结合的化合物。强心苷支持心脏功能，而蒽醌苷具有泻下作用。",
        examples: "例子：地高辛（洋地黄）、番泻苷（番泻叶）、水杨苷（柳树皮）"
      },
      polyphenols: {
        title: "多酚类",
        desc: "具有抗氧化和抗炎特性的多样化化合物群。包括类黄酮、单宁和植物雌激素，可调节各种生理过程。",
        examples: "例子：姜黄素（姜黄）、儿茶素（绿茶）、白藜芦醇（葡萄）、类黄酮（多种植物）"
      },
      terpenes: {
        title: "萜烯与萜类",
        desc: "存在于精油中的芳香化合物。许多具有抗菌、抗炎或镇静特性。广泛用于芳香疗法和作为调味剂。",
        examples: "例子：百里香酚（百里香）、薄荷醇（薄荷）、柠檬烯（柑橘）、人参皂苷（人参）"
      }
    },
    systems: {
      title: "主要传统医学体系",
      intro: "几个传统医学体系已发展出理解和应用药用植物的综合框架。这些体系获得学术认可，在许多国家与常规医学并行实践：",
      tcm: {
        title: "传统中医（TCM）",
        desc: "起源于2500多年前的中国，中医使用气（生命能量）、阴阳平衡和五行的概念。草药按其性质（温度）、味道和归经分类。中医包括针灸、艾灸和草药方剂。"
      },
      ayurveda: {
        title: "阿育吠陀",
        desc: "可追溯至5000年前的古印度医学体系。基于平衡三大体质（Vata、Pitta、Kapha），阿育吠陀使用按味道（rasa）、效能（virya）和消化后作用（vipaka）分类的草药。姜黄、南非醉茄和三果宝是主要疗法。"
      },
      jamu: {
        title: "佳慕（Jamu）",
        desc: "印尼的传统草药医学体系，被联合国教科文组织认定为非物质文化遗产。佳慕使用新鲜的根、树皮和叶子制成煎剂。主要成分包括生姜、姜黄、罗望子和爪哇姜黄。"
      },
      western: {
        title: "西方草药学",
        desc: "源于欧洲和希腊罗马传统，西方草药学强调使用本土植物和循证植物疗法。从业者使用全植物提取物，关注器官系统。主要草药包括紫锥菊、圣约翰草和缬草。"
      },
      unani: {
        title: "尤纳尼医学",
        desc: "源于希腊阿拉伯医学，在伊斯兰世界发展，尤纳尼基于四体液学说。强调体液（血液、粘液、黄胆汁、黑胆汁）的平衡，使用草药、饮食和疗法。"
      }
    },
    sipm: {
      title: "SIPM的使命",
      mission: "国际植物医学学会（SIPM）致力于推进全球对药用植物的科学理解和负责任应用。我们的使命将传统知识与现代科学相结合。",
      goal1: "推进药用植物对人体生理药理作用的科学研究",
      goal2: "促进草药医学生产和监管的标准化和质量控制",
      goal3: "通过民族植物学研究和植物化学分析支持药物发现",
      goal4: "促进传统医学从业者与现代医疗系统之间的合作"
    }
  },
  // Reference data
  reference: {
    preparations: "个制剂",
    noPreparations: "没有制剂使用此数值",
    noItems: "没有找到参考项目",
    notFound: "找不到参考数据",
    backToList: "返回列表",
    usingPreparations: "使用此数值的制剂",
    // TCM
    naturesDesc: "按药物对身体的热效应分类",
    flavorsDesc: "五味及其相应的脏腑关系",
    meridiansDesc: "草药被认为影响的能量通道",
    categoriesDesc: "中药的功能分类",
    tcmActionsDesc: "传统中医的治疗作用",
    // Western
    actionsDesc: "草药的药理作用",
    organsDesc: "草药主要影响的脏器和系统",
    systemsDesc: "草药影响的身体系统",
    // Ayurveda
    rasaDesc: "阿育吠陀的六味",
    gunaDesc: "物质的二十种属性",
    viryaDesc: "热或冷的效能",
    vipakaDesc: "消化后作用",
    doshasDesc: "阿育吠陀的三种体质类型",
    karmasDesc: "阿育吠陀的治疗作用",
    mahabhutasDesc: "阿育吠陀的五大元素",
    ayurvedaCategoriesDesc: "阿育吠陀草药按治疗作用的分类",
    prabhavasDesc: "无法从其他属性预测的草药特异作用",
    // Persian
    temperamentsDesc: "尤纳尼医学中的四种体质",
    persianElementsDesc: "波斯医学中的四元素",
    degreesDesc: "波斯医学中的强度等级",
    // Mongolian
    elementsDesc: "蒙古医学中的五元素",
    tastesDesc: "蒙古医学中的六味",
    rootsDesc: "蒙古医学中的三根能量",
    potenciesDesc: "蒙古医学中的治疗效能",
    // Herbal vocabulary
    formsDesc: "草药制剂的物理形式，如粉末、胶囊、酊剂等",
    methodsDesc: "草药材料的加工方法，如干燥、蒸制、炒制等"
  }
};
const messages = {
  "en": en,
  "zh-Hant": zhHant,
  "zh-Hans": zhHans
};
const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: "en",
  messages,
  supportedLocales: SUPPORTED_LOCALES
});
const createApp = ViteSSG(
  App,
  { routes, base: "/" },
  ({ app, router, isClient }) => {
    app.use(i18n);
    if (isClient) {
      router.beforeEach((to, from, next) => {
        var _a;
        const locale = ((_a = to.meta) == null ? void 0 : _a.locale) || "en";
        if (i18n.global.locale.value !== locale) {
          i18n.global.locale.value = locale;
        }
        next();
      });
    }
  }
);
export {
  DEFAULT_LOCALE as D,
  LOCALE_NAMES as L,
  SUPPORTED_LOCALES as S,
  _export_sfc as _,
  createApp
};
