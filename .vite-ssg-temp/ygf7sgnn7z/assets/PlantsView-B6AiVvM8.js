import { computed, ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const heroImage = "/@herbapedia/data/media/images/banners/tcm-banner.jpg";
const _sfc_main = {
  __name: "PlantsView",
  __ssrInlineRender: true,
  props: {
    sourceType: {
      type: String,
      default: "plant",
      validator: (value) => ["plant", "fungi", "algae", "all"].includes(value)
    }
  },
  setup(__props) {
    const props = __props;
    const { t, locale } = useI18n();
    const allSpecies = computed(() => dataset.getSpeciesByType(props.sourceType));
    const speciesWithPreparations = computed(() => {
      switch (props.sourceType) {
        case "fungi":
          return dataset.getFungiWithPreparations();
        case "algae":
          return dataset.getAlgaeWithPreparations();
        default:
          return dataset.getPlantsWithPreparations();
      }
    });
    const pageTitle = computed(() => {
      switch (props.sourceType) {
        case "fungi":
          return t("sources.fungi");
        case "algae":
          return t("sources.algae");
        default:
          return t("plants.title");
      }
    });
    const breadcrumbKey = computed(() => {
      switch (props.sourceType) {
        case "fungi":
          return "sources.fungi";
        case "algae":
          return "sources.algae";
        default:
          return "sources.botanical";
      }
    });
    const basePath = computed(() => {
      switch (props.sourceType) {
        case "fungi":
          return "/sources/fungi";
        case "algae":
          return "/sources/algae";
        default:
          return "/sources/botanical";
      }
    });
    const searchQuery = ref("");
    const filterMode = ref("with-preparations");
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const filteredPlants = computed(() => {
      let species = filterMode.value === "with-preparations" ? speciesWithPreparations.value : allSpecies.value.map((s) => ({ plant: s }));
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        species = species.filter((item) => {
          var _a, _b, _c, _d, _e;
          const plant = item.plant || item;
          const sciMatch = (_a = plant.scientificName) == null ? void 0 : _a.toLowerCase().includes(query);
          const commonMatch = plant.commonName && (((_b = plant.commonName.en) == null ? void 0 : _b.toLowerCase().includes(query)) || ((_c = plant.commonName["zh-Hant"]) == null ? void 0 : _c.includes(searchQuery.value)) || ((_d = plant.commonName["zh-Hans"]) == null ? void 0 : _d.includes(searchQuery.value)));
          const familyMatch = (_e = plant.family) == null ? void 0 : _e.toLowerCase().includes(query);
          return sciMatch || commonMatch || familyMatch;
        });
      }
      return species;
    });
    function getSlug(plant) {
      if (!(plant == null ? void 0 : plant["@id"])) return "";
      const parts = plant["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function formatImagePath(img) {
      if (!img) return null;
      return img.startsWith("/@herbapedia") ? img : `/${img}`;
    }
    function getPlantImage(plant) {
      return formatImagePath(plant == null ? void 0 : plant.image);
    }
    function getCommonName(plant) {
      if (!(plant == null ? void 0 : plant.commonName)) return null;
      return plant.commonName[locale.value] || plant.commonName["en"] || plant.commonName["zh-Hant"];
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "plants-view" }, _attrs))} data-v-0eb1ce80><section class="plants-hero" data-v-0eb1ce80><div class="plants-hero__background" data-v-0eb1ce80><img${ssrRenderAttr("src", heroImage)} alt="" class="plants-hero__bg-image" data-v-0eb1ce80><div class="plants-hero__overlay" data-v-0eb1ce80></div></div><div class="container plants-hero__content" data-v-0eb1ce80><h1 class="plants-hero__title" data-v-0eb1ce80>${ssrInterpolate(pageTitle.value)}</h1><p class="plants-hero__subtitle" data-v-0eb1ce80>${ssrInterpolate(unref(t)("plants.browseCount", { count: allSpecies.value.length }))}</p><div class="plants-hero__search" data-v-0eb1ce80><div class="search-input-wrapper" data-v-0eb1ce80><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-0eb1ce80><circle cx="11" cy="11" r="8" data-v-0eb1ce80></circle><path d="m21 21-4.35-4.35" data-v-0eb1ce80></path></svg><input${ssrRenderAttr("value", searchQuery.value)} type="text" class="search-input"${ssrRenderAttr("placeholder", unref(t)("plants.searchPlaceholder"))} data-v-0eb1ce80>`);
      if (searchQuery.value) {
        _push(`<button class="search-clear" aria-label="Clear search" data-v-0eb1ce80><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-0eb1ce80><path d="M18 6L6 18M6 6l12 12" data-v-0eb1ce80></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section><div class="container" data-v-0eb1ce80><nav class="breadcrumbs" data-v-0eb1ce80>`);
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
      _push(`<span data-v-0eb1ce80>/</span>`);
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
      _push(`<span data-v-0eb1ce80>/</span><span data-v-0eb1ce80>${ssrInterpolate(unref(t)(breadcrumbKey.value))}</span></nav><div class="plants-filter-tabs" data-v-0eb1ce80><button class="${ssrRenderClass([{ "filter-tab--active": filterMode.value === "all" }, "filter-tab"])}" data-v-0eb1ce80>${ssrInterpolate(unref(t)("plants.allPlants"))} (${ssrInterpolate(allSpecies.value.length)}) </button><button class="${ssrRenderClass([{ "filter-tab--active": filterMode.value === "with-preparations" }, "filter-tab"])}" data-v-0eb1ce80>${ssrInterpolate(unref(t)("plants.withPreparations"))} (${ssrInterpolate(speciesWithPreparations.value.length)}) </button></div><div class="plants-results" data-v-0eb1ce80>`);
      if (searchQuery.value) {
        _push(`<span data-v-0eb1ce80>${ssrInterpolate(unref(t)("plants.showingResults", { count: filteredPlants.value.length, query: searchQuery.value }))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="plants-grid" data-v-0eb1ce80><!--[-->`);
      ssrRenderList(filteredPlants.value, (item) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: getSlug(item.plant || item),
          to: localePath(`${basePath.value}/${getSlug(item.plant || item)}`),
          class: "plant-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="plant-card__image-wrapper" data-v-0eb1ce80${_scopeId}>`);
              if (getPlantImage(item.plant || item)) {
                _push2(`<img${ssrRenderAttr("src", getPlantImage(item.plant || item))}${ssrRenderAttr("alt", (item.plant || item).scientificName)} class="plant-card__image" loading="lazy" data-v-0eb1ce80${_scopeId}>`);
              } else {
                _push2(`<div class="plant-card__placeholder" data-v-0eb1ce80${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-0eb1ce80${_scopeId}><path d="M12 2L2 7l10 5 10-5-10-5z" data-v-0eb1ce80${_scopeId}></path><path d="M2 17l10 5 10-5" data-v-0eb1ce80${_scopeId}></path><path d="M2 12l10 5 10-5" data-v-0eb1ce80${_scopeId}></path></svg></div>`);
              }
              if (item.preparationCount) {
                _push2(`<span class="plant-card__badge" data-v-0eb1ce80${_scopeId}>${ssrInterpolate(item.preparationCount)} ${ssrInterpolate(unref(t)("plants.preparations"))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="plant-card__content" data-v-0eb1ce80${_scopeId}><h3 class="plant-card__scientific" data-v-0eb1ce80${_scopeId}>${ssrInterpolate((item.plant || item).scientificName)}</h3>`);
              if (getCommonName(item.plant || item)) {
                _push2(`<p class="plant-card__common" data-v-0eb1ce80${_scopeId}>${ssrInterpolate(getCommonName(item.plant || item))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if ((item.plant || item).family) {
                _push2(`<p class="plant-card__family" data-v-0eb1ce80${_scopeId}>${ssrInterpolate((item.plant || item).family)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "plant-card__image-wrapper" }, [
                  getPlantImage(item.plant || item) ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: getPlantImage(item.plant || item),
                    alt: (item.plant || item).scientificName,
                    class: "plant-card__image",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "plant-card__placeholder"
                  }, [
                    (openBlock(), createBlock("svg", {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.5"
                    }, [
                      createVNode("path", { d: "M12 2L2 7l10 5 10-5-10-5z" }),
                      createVNode("path", { d: "M2 17l10 5 10-5" }),
                      createVNode("path", { d: "M2 12l10 5 10-5" })
                    ]))
                  ])),
                  item.preparationCount ? (openBlock(), createBlock("span", {
                    key: 2,
                    class: "plant-card__badge"
                  }, toDisplayString(item.preparationCount) + " " + toDisplayString(unref(t)("plants.preparations")), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "plant-card__content" }, [
                  createVNode("h3", { class: "plant-card__scientific" }, toDisplayString((item.plant || item).scientificName), 1),
                  getCommonName(item.plant || item) ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "plant-card__common"
                  }, toDisplayString(getCommonName(item.plant || item)), 1)) : createCommentVNode("", true),
                  (item.plant || item).family ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "plant-card__family"
                  }, toDisplayString((item.plant || item).family), 1)) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (filteredPlants.value.length === 0) {
        _push(`<div class="plants-empty" data-v-0eb1ce80><p data-v-0eb1ce80>${ssrInterpolate(unref(t)("plants.noResults"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/PlantsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PlantsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0eb1ce80"]]);
export {
  PlantsView as default
};
