import { computed, ref, watch, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { c as useSourcePlant } from "./useHerbData-DQ9hcdFH.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "PlantPartDetailView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const slug = computed(() => route.params.slug);
    const part = ref(null);
    const species = ref(null);
    const preparations = ref([]);
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const partName = computed(() => {
      var _a;
      if (!((_a = part.value) == null ? void 0 : _a.name)) return slug.value;
      return part.value.name[locale.value] || part.value.name["en"] || part.value.name["zh-Hant"] || slug.value;
    });
    const description = computed(() => {
      var _a;
      if (!((_a = part.value) == null ? void 0 : _a.description)) return null;
      return part.value.description[locale.value] || part.value.description["en"] || part.value.description["zh-Hant"];
    });
    const speciesName = computed(() => {
      if (!species.value) return null;
      return species.value.scientificName;
    });
    function getPartIcon() {
      const partSlug = slug.value.toLowerCase();
      if (partSlug.includes("root")) return "🫚";
      if (partSlug.includes("rhizome")) return "🌿";
      if (partSlug.includes("leaf")) return "🍃";
      if (partSlug.includes("flower")) return "🌸";
      if (partSlug.includes("fruit")) return "🍒";
      if (partSlug.includes("seed")) return "🌱";
      if (partSlug.includes("bulb")) return "🧅";
      if (partSlug.includes("bark")) return "🪵";
      if (partSlug.includes("stem")) return "🎋";
      return "🌿";
    }
    function getSpeciesCommonName() {
      var _a;
      if (!((_a = species.value) == null ? void 0 : _a.commonName)) return null;
      return species.value.commonName[locale.value] || species.value.commonName["en"] || species.value.commonName["zh-Hant"];
    }
    function getSlug(entity) {
      if (!(entity == null ? void 0 : entity["@id"])) return "";
      const parts = entity["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getPrepSlug(prep) {
      return getSlug(prep);
    }
    function getPrepName(prep) {
      if (!(prep == null ? void 0 : prep.name)) return getPrepSlug(prep);
      return prep.name[locale.value] || prep.name["en"] || prep.name["zh-Hant"] || getPrepSlug(prep);
    }
    function getPrepImage(prep) {
      var _a;
      const s = getPrepSlug(prep);
      const plant = useSourcePlant(s);
      return ((_a = plant.value) == null ? void 0 : _a.image) || null;
    }
    watch(slug, (newSlug) => {
      var _a;
      if (newSlug) {
        part.value = dataset.getPlantPart(newSlug);
        if ((_a = part.value) == null ? void 0 : _a.partOf) {
          const speciesSlug = part.value.partOf["@id"].split("/").pop();
          species.value = dataset.getPlantSpecies(speciesSlug);
          preparations.value = dataset.getPreparationsByPlant(speciesSlug);
        }
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "plant-part-detail-view" }, _attrs))} data-v-3ad33098><div class="container container-narrow" data-v-3ad33098><nav class="breadcrumbs" data-v-3ad33098>`);
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
      _push(`<span data-v-3ad33098>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/sources/parts")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("plantParts.title"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("plantParts.title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-3ad33098>/</span><span data-v-3ad33098>${ssrInterpolate(partName.value)}</span></nav>`);
      if (part.value) {
        _push(`<article class="plant-part-detail" data-v-3ad33098><header class="plant-part-detail__header" data-v-3ad33098><div class="plant-part-detail__icon" data-v-3ad33098>${ssrInterpolate(getPartIcon())}</div><div class="plant-part-detail__meta" data-v-3ad33098><span class="plant-part-detail__type-badge" data-v-3ad33098>${ssrInterpolate(unref(t)("plantParts.part"))}</span><h1 class="plant-part-detail__name" data-v-3ad33098>${ssrInterpolate(partName.value)}</h1>`);
        if (speciesName.value) {
          _push(`<p class="plant-part-detail__species" data-v-3ad33098>${ssrInterpolate(unref(t)("plantParts.partOf"))}: ${ssrInterpolate(speciesName.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (description.value) {
          _push(`<section class="plant-part-detail__section" data-v-3ad33098><h2 class="section-title" data-v-3ad33098>${ssrInterpolate(unref(t)("sections.description"))}</h2><div class="prose" data-v-3ad33098><p data-v-3ad33098>${ssrInterpolate(description.value)}</p></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (species.value) {
          _push(`<section class="plant-part-detail__section" data-v-3ad33098><h2 class="section-title" data-v-3ad33098><span class="section-title__icon" data-v-3ad33098>🌿</span> ${ssrInterpolate(unref(t)("plantParts.species"))}</h2>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: localePath(`/sources/botanical/${getSlug(species.value)}`),
            class: "species-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="species-link__content" data-v-3ad33098${_scopeId}><h3 class="species-link__name" data-v-3ad33098${_scopeId}>${ssrInterpolate(species.value.scientificName)}</h3>`);
                if (getSpeciesCommonName()) {
                  _push2(`<p class="species-link__common" data-v-3ad33098${_scopeId}>${ssrInterpolate(getSpeciesCommonName())}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><span class="species-link__arrow" data-v-3ad33098${_scopeId}>→</span>`);
              } else {
                return [
                  createVNode("div", { class: "species-link__content" }, [
                    createVNode("h3", { class: "species-link__name" }, toDisplayString(species.value.scientificName), 1),
                    getSpeciesCommonName() ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "species-link__common"
                    }, toDisplayString(getSpeciesCommonName()), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("span", { class: "species-link__arrow" }, "→")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        if (preparations.value.length > 0) {
          _push(`<section class="plant-part-detail__section plant-part-detail__preparations" data-v-3ad33098><h2 class="section-title" data-v-3ad33098><span class="section-title__icon" data-v-3ad33098>💊</span> ${ssrInterpolate(unref(t)("plantParts.preparationsFromPart"))} <span class="section-title__count" data-v-3ad33098>(${ssrInterpolate(preparations.value.length)})</span></h2><div class="preparations-grid" data-v-3ad33098><!--[-->`);
          ssrRenderList(preparations.value, (prep) => {
            _push(ssrRenderComponent(_component_router_link, {
              key: getPrepSlug(prep),
              to: localePath(`/preparations/${getPrepSlug(prep)}`),
              class: "preparation-card-mini"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="preparation-card-mini__image-wrapper" data-v-3ad33098${_scopeId}>`);
                  if (getPrepImage(prep)) {
                    _push2(`<img${ssrRenderAttr("src", getPrepImage(prep))}${ssrRenderAttr("alt", getPrepName(prep))} class="preparation-card-mini__image" data-v-3ad33098${_scopeId}>`);
                  } else {
                    _push2(`<div class="preparation-card-mini__placeholder" data-v-3ad33098${_scopeId}><span data-v-3ad33098${_scopeId}>💊</span></div>`);
                  }
                  _push2(`</div><div class="preparation-card-mini__content" data-v-3ad33098${_scopeId}><h4 class="preparation-card-mini__name" data-v-3ad33098${_scopeId}>${ssrInterpolate(getPrepName(prep))}</h4>`);
                  if (prep.form) {
                    _push2(`<p class="preparation-card-mini__form" data-v-3ad33098${_scopeId}>${ssrInterpolate(prep.form)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="preparation-card-mini__badges" data-v-3ad33098${_scopeId}>`);
                  if (prep.hasTCMProfile) {
                    _push2(`<span class="prep-badge prep-badge--tcm" data-v-3ad33098${_scopeId}>TCM</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (prep.hasWesternProfile) {
                    _push2(`<span class="prep-badge prep-badge--western" data-v-3ad33098${_scopeId}>W</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div><span class="preparation-card-mini__arrow" data-v-3ad33098${_scopeId}>→</span>`);
                } else {
                  return [
                    createVNode("div", { class: "preparation-card-mini__image-wrapper" }, [
                      getPrepImage(prep) ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: getPrepImage(prep),
                        alt: getPrepName(prep),
                        class: "preparation-card-mini__image"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "preparation-card-mini__placeholder"
                      }, [
                        createVNode("span", null, "💊")
                      ]))
                    ]),
                    createVNode("div", { class: "preparation-card-mini__content" }, [
                      createVNode("h4", { class: "preparation-card-mini__name" }, toDisplayString(getPrepName(prep)), 1),
                      prep.form ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "preparation-card-mini__form"
                      }, toDisplayString(prep.form), 1)) : createCommentVNode("", true),
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
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<aside class="plant-part-detail__disclaimer" data-v-3ad33098><p data-v-3ad33098><strong data-v-3ad33098>${ssrInterpolate(unref(t)("disclaimer.title"))}:</strong> ${ssrInterpolate(unref(t)("disclaimer.text"))}</p></aside></article>`);
      } else {
        _push(`<div class="plant-part-detail__not-found" data-v-3ad33098><h1 data-v-3ad33098>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-3ad33098>${ssrInterpolate(unref(t)("plantParts.notFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath("/sources/parts"),
          class: "plant-part-detail__back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("plantParts.backToParts"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("plantParts.backToParts")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/PlantPartDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PlantPartDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3ad33098"]]);
export {
  PlantPartDetailView as default
};
