import { computed, ref, watch, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { b as usePreparationLocalizer, f as useChemicalReferences } from "./useHerbData-DQ9hcdFH.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "PlantDetailView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const slug = computed(() => route.params.slug);
    const plant = ref(null);
    const preparations = ref([]);
    const plantParts = ref([]);
    const imageError = ref(false);
    const plantImage = computed(() => {
      var _a;
      const img = (_a = plant.value) == null ? void 0 : _a.image;
      if (!img) return null;
      return img.startsWith("/@herbapedia") ? img : `/${img}`;
    });
    const localizer = usePreparationLocalizer();
    const { getCompoundLabels } = useChemicalReferences();
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const sourceType = computed(() => {
      const path = route.path;
      if (path.includes("/fungi/")) return "fungi";
      if (path.includes("/algae/")) return "algae";
      return "plant";
    });
    const sourceTypeLabel = computed(() => {
      switch (sourceType.value) {
        case "fungi":
          return t("sources.fungi");
        case "algae":
          return t("sources.algae");
        default:
          return t("sources.botanical");
      }
    });
    const basePath = computed(() => {
      switch (sourceType.value) {
        case "fungi":
          return "/sources/fungi";
        case "algae":
          return "/sources/algae";
        default:
          return "/sources/botanical";
      }
    });
    const commonName = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.commonName)) return null;
      return plant.value.commonName[locale.value] || plant.value.commonName["en"] || plant.value.commonName["zh-Hant"];
    });
    const description = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.description)) return null;
      return plant.value.description[locale.value] || plant.value.description["en"] || plant.value.description["zh-Hant"];
    });
    const habitat = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.habitat)) return null;
      return plant.value.habitat[locale.value] || plant.value.habitat["en"] || plant.value.habitat["zh-Hant"];
    });
    const origin = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.origin)) return null;
      return plant.value.origin[locale.value] || plant.value.origin["en"] || plant.value.origin["zh-Hant"];
    });
    const geographicalDistribution = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.geographicalDistribution)) return null;
      return plant.value.geographicalDistribution[locale.value] || plant.value.geographicalDistribution["en"] || plant.value.geographicalDistribution["zh-Hant"];
    });
    const taxonomyDetails = computed(() => {
      var _a;
      const tc = (_a = plant.value) == null ? void 0 : _a.taxonomicClassification;
      if (!tc) return null;
      const details = [];
      if (tc.kingdom) details.push({ label: t("plants.kingdom"), value: tc.kingdom });
      if (tc.phylum) details.push({ label: t("plants.phylum"), value: tc.phylum });
      if (tc.class) details.push({ label: t("plants.class"), value: tc["class"] });
      if (tc.order) details.push({ label: t("plants.order"), value: tc.order });
      return details.length > 0 ? details : null;
    });
    const growthCharacteristics = computed(() => {
      var _a, _b;
      const chars = [];
      if ((_a = plant.value) == null ? void 0 : _a.growthForm) {
        chars.push({ label: t("plants.growthForm"), value: t(`plants.growthForms.${plant.value.growthForm}`) });
      }
      if ((_b = plant.value) == null ? void 0 : _b.lifecycle) {
        chars.push({ label: t("plants.lifecycle"), value: t(`plants.lifecycles.${plant.value.lifecycle}`) });
      }
      return chars.length > 0 ? chars : null;
    });
    const conservationStatusDisplay = computed(() => {
      var _a;
      const status = (_a = plant.value) == null ? void 0 : _a.conservationStatus;
      if (!status) return null;
      const statusLabels = {
        "LC": { label: t("plants.conservationStatuses.LC"), class: "status-lc" },
        "NT": { label: t("plants.conservationStatuses.NT"), class: "status-nt" },
        "VU": { label: t("plants.conservationStatuses.VU"), class: "status-vu" },
        "EN": { label: t("plants.conservationStatuses.EN"), class: "status-en" },
        "CR": { label: t("plants.conservationStatuses.CR"), class: "status-cr" },
        "EW": { label: t("plants.conservationStatuses.EW"), class: "status-ew" },
        "EX": { label: t("plants.conservationStatuses.EX"), class: "status-ex" },
        "DD": { label: t("plants.conservationStatuses.DD"), class: "status-dd" },
        "NE": { label: t("plants.conservationStatuses.NE"), class: "status-ne" }
      };
      return statusLabels[status] || { label: status, class: "" };
    });
    const chemicalCompoundLabels = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.containsChemical)) return [];
      return getCompoundLabels(plant.value.containsChemical);
    });
    const externalLinks = computed(() => {
      var _a, _b, _c;
      const links = [];
      if ((_a = plant.value) == null ? void 0 : _a.wikidataID) {
        links.push({
          url: `https://www.wikidata.org/entity/${plant.value.wikidataID}`,
          label: t("links.wikidata"),
          icon: "📊"
        });
      }
      if ((_b = plant.value) == null ? void 0 : _b.gbifID) {
        links.push({
          url: `https://www.gbif.org/species/${plant.value.gbifID}`,
          label: t("links.gbif"),
          icon: "🌿"
        });
      }
      if ((_c = plant.value) == null ? void 0 : _c.ncbiTaxonomyID) {
        links.push({
          url: `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${plant.value.ncbiTaxonomyID}`,
          label: t("links.ncbi"),
          icon: "🧬"
        });
      }
      return links;
    });
    const hasExternalLinks = computed(() => externalLinks.value.length > 0);
    const dnaBarcode = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.hasDNABarcode)) return null;
      const barcodeId = plant.value.hasDNABarcode["@id"];
      if (!barcodeId) return null;
      const barcodeSlug = barcodeId.split("/").pop();
      return dataset.getDNABarcode(barcodeSlug);
    });
    const hasDNABarcode = computed(() => dnaBarcode.value !== null);
    const chemicalProfile = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.hasChemicalProfile)) return null;
      const profileId = plant.value.hasChemicalProfile["@id"];
      if (!profileId) return null;
      const profileSlug = profileId.split("/").pop();
      return dataset.getChemicalProfile(profileSlug);
    });
    const hasChemicalProfile = computed(() => chemicalProfile.value !== null);
    const imageAttribution = computed(() => {
      var _a;
      if (!((_a = plant.value) == null ? void 0 : _a.image)) return null;
      const match = plant.value.image.match(/media\/images\/([^/]+)\//);
      if (!match) return null;
      const slug2 = match[1];
      const metadata = dataset.getImageMetadata(slug2);
      return (metadata == null ? void 0 : metadata.attribution) || null;
    });
    function getSlug(prep) {
      if (!(prep == null ? void 0 : prep["@id"])) return "";
      const parts = prep["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getPrepName(prep) {
      return localizer.getName(prep) || getSlug(prep);
    }
    function getCompoundName(compound) {
      if (!(compound == null ? void 0 : compound["@id"])) return "Unknown";
      const compoundId = compound["@id"];
      const slug2 = compoundId.split("/").pop();
      const compoundData = dataset.getChemical(slug2);
      if (compoundData == null ? void 0 : compoundData.name) {
        const nameMap = compoundData.name;
        if (typeof nameMap === "object") {
          return nameMap[locale.value] || nameMap["en"] || slug2;
        }
        return nameMap;
      }
      return (slug2 == null ? void 0 : slug2.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())) || compoundId;
    }
    function getImage(prep) {
      var _a;
      const img = (_a = plant.value) == null ? void 0 : _a.image;
      if (!img) return null;
      return img.startsWith("/@herbapedia") ? img : `/${img}`;
    }
    function getFormLabel(prep) {
      if (!(prep == null ? void 0 : prep.form)) return null;
      const formId = typeof prep.form === "object" ? prep.form["@id"] : prep.form;
      if (!formId) return null;
      const formItem = dataset.getHerbalForm(formId);
      if (formItem) {
        const labelMap = formItem.prefLabel || formItem.name;
        if (labelMap) {
          return labelMap[locale.value] || labelMap["en"] || formId;
        }
      }
      return formId.split("/").pop() || formId;
    }
    watch(slug, (newSlug) => {
      if (newSlug) {
        imageError.value = false;
        const plantData = dataset.getPlantSpecies(newSlug);
        plant.value = plantData;
        if (plantData) {
          preparations.value = dataset.getPreparationsByPlant(newSlug);
          if (plantData.hasParts) {
            plantParts.value = plantData.hasParts.map((ref2) => {
              var _a, _b;
              const partSlug = ref2["@id"].split("/").pop();
              const part = dataset.getPlantPart(partSlug);
              return {
                slug: partSlug,
                name: ((_a = part == null ? void 0 : part.name) == null ? void 0 : _a[locale.value]) || ((_b = part == null ? void 0 : part.name) == null ? void 0 : _b.en) || partSlug
              };
            });
          } else {
            plantParts.value = [];
          }
        }
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "plant-detail-view" }, _attrs))} data-v-40d89c02><div class="container container-narrow" data-v-40d89c02><nav class="breadcrumbs" data-v-40d89c02>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.home"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.home")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-40d89c02>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/sources")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.sources"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.sources")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-40d89c02>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath(basePath.value)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(sourceTypeLabel.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(sourceTypeLabel.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-40d89c02>/</span><span data-v-40d89c02>${ssrInterpolate(((_a = plant.value) == null ? void 0 : _a.scientificName) || slug.value)}</span></nav>`);
      if (plant.value) {
        _push(`<article class="plant-detail" data-v-40d89c02><header class="plant-detail__header" data-v-40d89c02><div class="plant-detail__image-wrapper" data-v-40d89c02>`);
        if (plantImage.value && !imageError.value) {
          _push(`<img${ssrRenderAttr("src", plantImage.value)}${ssrRenderAttr("alt", plant.value.scientificName)} class="plant-detail__image" data-v-40d89c02>`);
        } else {
          _push(`<div class="plant-detail__placeholder" data-v-40d89c02><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-40d89c02><path d="M12 2L2 7l10 5 10-5-10-5z" data-v-40d89c02></path><path d="M2 17l10 5 10-5" data-v-40d89c02></path><path d="M2 12l10 5 10-5" data-v-40d89c02></path></svg><span class="plant-detail__placeholder-text" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.noImage"))}</span></div>`);
        }
        if (imageAttribution.value && plantImage.value && !imageError.value) {
          _push(`<div class="plant-detail__attribution" data-v-40d89c02>`);
          if (imageAttribution.value.spdxId && imageAttribution.value.spdxId !== "NONE") {
            _push(`<span class="attribution-license" data-v-40d89c02>`);
            if (imageAttribution.value.spdxUrl) {
              _push(`<a${ssrRenderAttr("href", imageAttribution.value.spdxUrl)} target="_blank" rel="noopener noreferrer" data-v-40d89c02>${ssrInterpolate(imageAttribution.value.spdxId)}</a>`);
            } else {
              _push(`<span data-v-40d89c02>${ssrInterpolate(imageAttribution.value.spdxId)}</span>`);
            }
            _push(`</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="attribution-source" data-v-40d89c02>${ssrInterpolate(imageAttribution.value.copyright)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="plant-detail__meta" data-v-40d89c02><span class="plant-detail__type-badge" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.species"))}</span><h1 class="plant-detail__scientific-name" data-v-40d89c02>${ssrInterpolate(plant.value.scientificName)}</h1>`);
        if (commonName.value) {
          _push(`<p class="plant-detail__common-name" data-v-40d89c02>${ssrInterpolate(commonName.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (plant.value.family || plant.value.genus) {
          _push(`<div class="plant-detail__taxonomy" data-v-40d89c02>`);
          if (plant.value.family) {
            _push(`<span data-v-40d89c02>${ssrInterpolate(unref(t)("plants.family"))}: ${ssrInterpolate(plant.value.family)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (plant.value.genus) {
            _push(`<span data-v-40d89c02>${ssrInterpolate(unref(t)("plants.genus"))}: ${ssrInterpolate(plant.value.genus)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header><section class="plant-detail__section plant-detail__preparations" data-v-40d89c02><h2 class="section-title" data-v-40d89c02><span class="section-title__icon" data-v-40d89c02>→</span> ${ssrInterpolate(unref(t)("plants.preparationsFromPlant"))} <span class="section-title__count" data-v-40d89c02>(${ssrInterpolate(preparations.value.length)})</span></h2>`);
        if (preparations.value.length > 0) {
          _push(`<div class="preparations-grid" data-v-40d89c02><!--[-->`);
          ssrRenderList(preparations.value, (prep) => {
            _push(ssrRenderComponent(_component_router_link, {
              key: getSlug(prep),
              to: localePath(`/preparations/${getSlug(prep)}`),
              class: "preparation-card-mini"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="preparation-card-mini__image-wrapper" data-v-40d89c02${_scopeId}>`);
                  if (getImage()) {
                    _push2(`<img${ssrRenderAttr("src", getImage())}${ssrRenderAttr("alt", getPrepName(prep))} class="preparation-card-mini__image" data-v-40d89c02${_scopeId}>`);
                  } else {
                    _push2(`<div class="preparation-card-mini__placeholder" data-v-40d89c02${_scopeId}><span data-v-40d89c02${_scopeId}>🌿</span></div>`);
                  }
                  _push2(`</div><div class="preparation-card-mini__content" data-v-40d89c02${_scopeId}><h4 class="preparation-card-mini__name" data-v-40d89c02${_scopeId}>${ssrInterpolate(getPrepName(prep))}</h4>`);
                  if (prep.form) {
                    _push2(`<p class="preparation-card-mini__form" data-v-40d89c02${_scopeId}>${ssrInterpolate(getFormLabel(prep))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="preparation-card-mini__badges" data-v-40d89c02${_scopeId}>`);
                  if (prep.hasTCMProfile) {
                    _push2(`<span class="prep-badge prep-badge--tcm" data-v-40d89c02${_scopeId}>TCM</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (prep.hasWesternProfile) {
                    _push2(`<span class="prep-badge prep-badge--western" data-v-40d89c02${_scopeId}>W</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div><span class="preparation-card-mini__arrow" data-v-40d89c02${_scopeId}>→</span>`);
                } else {
                  return [
                    createVNode("div", { class: "preparation-card-mini__image-wrapper" }, [
                      getImage() ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: getImage(),
                        alt: getPrepName(prep),
                        class: "preparation-card-mini__image"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "preparation-card-mini__placeholder"
                      }, [
                        createVNode("span", null, "🌿")
                      ]))
                    ]),
                    createVNode("div", { class: "preparation-card-mini__content" }, [
                      createVNode("h4", { class: "preparation-card-mini__name" }, toDisplayString(getPrepName(prep)), 1),
                      prep.form ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "preparation-card-mini__form"
                      }, toDisplayString(getFormLabel(prep)), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "preparation-card-mini__badges" }, [
                        prep.hasTCMProfile ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "prep-badge prep-badge--tcm"
                        }, "TCM")) : createCommentVNode("", true),
                        prep.hasWesternProfile ? (openBlock(), createBlock("span", {
                          key: 1,
                          class: "prep-badge prep-badge--western"
                        }, "W")) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("span", { class: "preparation-card-mini__arrow" }, "→")
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="preparations-empty" data-v-40d89c02><p data-v-40d89c02>${ssrInterpolate(unref(t)("plants.noPreparations"))}</p></div>`);
        }
        _push(`</section>`);
        if (description.value) {
          _push(`<section class="plant-detail__section" data-v-40d89c02><h2 class="section-title" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.description"))}</h2><div class="prose" data-v-40d89c02><p data-v-40d89c02>${ssrInterpolate(description.value)}</p></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (taxonomyDetails.value) {
          _push(`<section class="plant-detail__section" data-v-40d89c02><h2 class="section-title" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.taxonomy"))}</h2><dl class="taxonomy-list" data-v-40d89c02><!--[-->`);
          ssrRenderList(taxonomyDetails.value, (item) => {
            _push(`<div class="taxonomy-item" data-v-40d89c02><dt class="taxonomy-item__label" data-v-40d89c02>${ssrInterpolate(item.label)}</dt><dd class="taxonomy-item__value" data-v-40d89c02>${ssrInterpolate(item.value)}</dd></div>`);
          });
          _push(`<!--]--></dl></section>`);
        } else {
          _push(`<!---->`);
        }
        if (origin.value || habitat.value || geographicalDistribution.value) {
          _push(`<section class="plant-detail__section" data-v-40d89c02><h2 class="section-title" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.distributionAndHabitat"))}</h2>`);
          if (origin.value) {
            _push(`<div class="distribution-item" data-v-40d89c02><h3 class="distribution-item__label" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.origin"))}</h3><p class="distribution-item__value" data-v-40d89c02>${ssrInterpolate(origin.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (habitat.value) {
            _push(`<div class="distribution-item" data-v-40d89c02><h3 class="distribution-item__label" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.habitat"))}</h3><p class="distribution-item__value" data-v-40d89c02>${ssrInterpolate(habitat.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (geographicalDistribution.value) {
            _push(`<div class="distribution-item" data-v-40d89c02><h3 class="distribution-item__label" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.distribution"))}</h3><p class="distribution-item__value" data-v-40d89c02>${ssrInterpolate(geographicalDistribution.value)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        if (growthCharacteristics.value || conservationStatusDisplay.value) {
          _push(`<section class="plant-detail__section" data-v-40d89c02><h2 class="section-title" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.characteristics"))}</h2>`);
          if (growthCharacteristics.value) {
            _push(`<dl class="characteristics-list" data-v-40d89c02><!--[-->`);
            ssrRenderList(growthCharacteristics.value, (char) => {
              _push(`<div class="characteristic-item" data-v-40d89c02><dt class="characteristic-item__label" data-v-40d89c02>${ssrInterpolate(char.label)}</dt><dd class="characteristic-item__value" data-v-40d89c02>${ssrInterpolate(char.value)}</dd></div>`);
            });
            _push(`<!--]--></dl>`);
          } else {
            _push(`<!---->`);
          }
          if (conservationStatusDisplay.value) {
            _push(`<div class="conservation-status" data-v-40d89c02><span class="conservation-status__label" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.conservationStatus"))}:</span><span class="${ssrRenderClass(["conservation-status__badge", conservationStatusDisplay.value.class])}" data-v-40d89c02>${ssrInterpolate(conservationStatusDisplay.value.label)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        if (chemicalCompoundLabels.value.length > 0) {
          _push(`<section class="plant-detail__section plant-detail__compounds" data-v-40d89c02><h2 class="section-title" data-v-40d89c02><span class="section-title__icon" data-v-40d89c02>⚗</span> ${ssrInterpolate(unref(t)("compounds.title"))}</h2><div class="compounds-list" data-v-40d89c02><!--[-->`);
          ssrRenderList(chemicalCompoundLabels.value, (compound) => {
            _push(`<span class="compound-tag"${ssrRenderAttr("title", compound.description)} data-v-40d89c02>${ssrInterpolate(compound.label)}</span>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (plantParts.value.length > 0) {
          _push(`<section class="plant-detail__section plant-detail__parts" data-v-40d89c02><h2 class="section-title" data-v-40d89c02><span class="section-title__icon" data-v-40d89c02>🌿</span> ${ssrInterpolate(unref(t)("plants.parts"))}</h2><div class="parts-list" data-v-40d89c02><!--[-->`);
          ssrRenderList(plantParts.value, (part) => {
            _push(`<span class="part-tag" data-v-40d89c02>${ssrInterpolate(part.name)}</span>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (hasDNABarcode.value) {
          _push(`<section class="plant-detail__section plant-detail__dna" data-v-40d89c02><h2 class="section-title" data-v-40d89c02><span class="section-title__icon" data-v-40d89c02>🧬</span> ${ssrInterpolate(unref(t)("plants.dnaBarcode"))}</h2><div class="dna-barcode-info" data-v-40d89c02>`);
          if (dnaBarcode.value.sequence && dnaBarcode.value.sequence.length > 0) {
            _push(`<div class="dna-sequences" data-v-40d89c02><!--[-->`);
            ssrRenderList(dnaBarcode.value.sequence, (seq) => {
              _push(`<div class="dna-sequence" data-v-40d89c02><h4 class="dna-sequence__region" data-v-40d89c02>${ssrInterpolate(seq.region)}</h4>`);
              if (seq.length) {
                _push(`<p class="dna-sequence__meta" data-v-40d89c02><span data-v-40d89c02>Length: ${ssrInterpolate(seq.length)} bp</span>`);
                if (seq.gcContent) {
                  _push(`<span data-v-40d89c02>GC: ${ssrInterpolate(seq.gcContent)}%</span>`);
                } else {
                  _push(`<!---->`);
                }
                if (seq.genbankAccession) {
                  _push(`<span data-v-40d89c02>GenBank: ${ssrInterpolate(seq.genbankAccession)}</span>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</p>`);
              } else {
                _push(`<!---->`);
              }
              if (seq.sequence) {
                _push(`<p class="dna-sequence__quality" data-v-40d89c02><span class="${ssrRenderClass([`quality-badge--${seq.sequenceQuality}`, "quality-badge"])}" data-v-40d89c02>${ssrInterpolate(seq.sequenceQuality || "unknown")}</span></p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if (dnaBarcode.value.identificationConfidence) {
            _push(`<div class="dna-confidence" data-v-40d89c02><h4 data-v-40d89c02>${ssrInterpolate(unref(t)("plants.identificationConfidence"))}</h4><p data-v-40d89c02><span data-v-40d89c02>Level: ${ssrInterpolate(dnaBarcode.value.identificationConfidence.level)}</span>`);
            if (dnaBarcode.value.identificationConfidence.confidence) {
              _push(`<span data-v-40d89c02> Confidence: ${ssrInterpolate(dnaBarcode.value.identificationConfidence.confidence)}% </span>`);
            } else {
              _push(`<!---->`);
            }
            if (dnaBarcode.value.identificationConfidence.method) {
              _push(`<span data-v-40d89c02> Method: ${ssrInterpolate(dnaBarcode.value.identificationConfidence.method)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (((_c = (_b = dnaBarcode.value.adulterantDetection) == null ? void 0 : _b.canDetect) == null ? void 0 : _c.length) > 0) {
            _push(`<div class="dna-adulterants" data-v-40d89c02><h4 data-v-40d89c02>${ssrInterpolate(unref(t)("plants.canDetectAdulterants"))}</h4><ul class="adulterant-list" data-v-40d89c02><!--[-->`);
            ssrRenderList(dnaBarcode.value.adulterantDetection.canDetect, (adulterant) => {
              _push(`<li data-v-40d89c02>${ssrInterpolate(adulterant)}</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (hasChemicalProfile.value) {
          _push(`<section class="plant-detail__section plant-detail__chemical" data-v-40d89c02><h2 class="section-title" data-v-40d89c02><span class="section-title__icon" data-v-40d89c02>⚗️</span> ${ssrInterpolate(unref(t)("plants.chemicalProfile"))}</h2><div class="chemical-profile-info" data-v-40d89c02>`);
          if (chemicalProfile.value.totalVolatileOil) {
            _push(`<div class="chemical-profile__total" data-v-40d89c02><span class="chemical-profile__label" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.totalVolatileOil"))}:</span><span class="chemical-profile__value" data-v-40d89c02>${ssrInterpolate(chemicalProfile.value.totalVolatileOil.value)} ${ssrInterpolate(chemicalProfile.value.totalVolatileOil.unit)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (chemicalProfile.value.analyticalMethod) {
            _push(`<div class="chemical-profile__method" data-v-40d89c02><span class="chemical-profile__label" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.analyticalMethod"))}:</span><span class="chemical-profile__value" data-v-40d89c02>${ssrInterpolate(chemicalProfile.value.analyticalMethod)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (chemicalProfile.value.qualityGrade) {
            _push(`<div class="chemical-profile__grade" data-v-40d89c02><span class="chemical-profile__label" data-v-40d89c02>${ssrInterpolate(unref(t)("plants.qualityGrade"))}:</span><span class="chemical-profile__value" data-v-40d89c02>${ssrInterpolate(chemicalProfile.value.qualityGrade)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (chemicalProfile.value.hasComponent && chemicalProfile.value.hasComponent.length > 0) {
            _push(`<div class="chemical-components" data-v-40d89c02><h4 data-v-40d89c02>${ssrInterpolate(unref(t)("plants.chemicalComponents"))}</h4><div class="components-grid" data-v-40d89c02><!--[-->`);
            ssrRenderList(chemicalProfile.value.hasComponent, (comp, idx) => {
              _push(`<div class="chemical-component" data-v-40d89c02><div class="chemical-component__header" data-v-40d89c02><span class="chemical-component__compound" data-v-40d89c02>${ssrInterpolate(getCompoundName(comp.compound))}</span>`);
              if (comp.relativeAbundance) {
                _push(`<span class="${ssrRenderClass([`abundance-badge--${comp.relativeAbundance}`, "abundance-badge"])}" data-v-40d89c02>${ssrInterpolate(comp.relativeAbundance)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              if (comp.concentrationRange) {
                _push(`<p class="chemical-component__concentration" data-v-40d89c02>${ssrInterpolate(comp.concentrationRange.min)}-${ssrInterpolate(comp.concentrationRange.max)} ${ssrInterpolate(comp.concentrationRange.unit)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (comp.notes) {
                _push(`<p class="chemical-component__notes" data-v-40d89c02>${ssrInterpolate(comp.notes)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (hasExternalLinks.value) {
          _push(`<section class="plant-detail__section plant-detail__links" data-v-40d89c02><h2 class="section-title" data-v-40d89c02>${ssrInterpolate(unref(t)("links.title"))}</h2><div class="external-links" data-v-40d89c02><!--[-->`);
          ssrRenderList(externalLinks.value, (link) => {
            _push(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener noreferrer" class="external-link" data-v-40d89c02><span class="external-link__icon" data-v-40d89c02>${ssrInterpolate(link.icon)}</span> ${ssrInterpolate(link.label)} <span class="external-link__arrow" data-v-40d89c02>↗</span></a>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<aside class="plant-detail__disclaimer" data-v-40d89c02><p data-v-40d89c02><strong data-v-40d89c02>${ssrInterpolate(unref(t)("disclaimer.title"))}:</strong> ${ssrInterpolate(unref(t)("disclaimer.text"))}</p></aside></article>`);
      } else {
        _push(`<div class="plant-detail__not-found" data-v-40d89c02><h1 data-v-40d89c02>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-40d89c02>${ssrInterpolate(unref(t)("plants.notFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath(basePath.value),
          class: "plant-detail__back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("plants.backToPlants"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("plants.backToPlants")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/PlantDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PlantDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-40d89c02"]]);
export {
  PlantDetailView as default
};
