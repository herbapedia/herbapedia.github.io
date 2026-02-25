import { resolveComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext, ref, onMounted, computed, unref } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { u as useAllPreparations, b as usePreparationLocalizer, c as useSourcePlant } from "./useHerbData-DQ9hcdFH.js";
import { a as useFilters, u as useFilterOptions } from "./useFilters-z9iHlgRo.js";
import "@unhead/vue/server";
import "./dataset-CMjUf6f2.js";
const _sfc_main$1 = {
  __name: "PreparationCard",
  __ssrInlineRender: true,
  props: {
    to: { type: String, required: true },
    title: { type: String, required: true },
    commonName: { type: String, default: "" },
    scientificName: { type: String, default: "" },
    image: { type: String, default: "" },
    hasTCM: { type: Boolean, default: false },
    hasWestern: { type: Boolean, default: false },
    hasAyurveda: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(ssrRenderComponent(_component_router_link, mergeProps({
        to: __props.to,
        class: "preparation-card"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="preparation-card__image-wrapper" data-v-38f0c91c${_scopeId}>`);
            if (__props.image) {
              _push2(`<img${ssrRenderAttr("src", __props.image)}${ssrRenderAttr("alt", __props.title)} class="preparation-card__image" loading="lazy" data-v-38f0c91c${_scopeId}>`);
            } else {
              _push2(`<div class="preparation-card__placeholder" data-v-38f0c91c${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-38f0c91c${_scopeId}><path d="M12 2L2 7l10 5 10-5-10-5z" data-v-38f0c91c${_scopeId}></path><path d="M2 17l10 5 10-5" data-v-38f0c91c${_scopeId}></path><path d="M2 12l10 5 10-5" data-v-38f0c91c${_scopeId}></path></svg></div>`);
            }
            _push2(`<div class="preparation-card__badges" data-v-38f0c91c${_scopeId}>`);
            if (__props.hasTCM) {
              _push2(`<span class="preparation-card__badge preparation-card__badge--tcm" data-v-38f0c91c${_scopeId}>TCM</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.hasWestern) {
              _push2(`<span class="preparation-card__badge preparation-card__badge--western" data-v-38f0c91c${_scopeId}>W</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.hasAyurveda) {
              _push2(`<span class="preparation-card__badge preparation-card__badge--ayurveda" data-v-38f0c91c${_scopeId}>Ayu</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="preparation-card__content" data-v-38f0c91c${_scopeId}><h3 class="preparation-card__title" data-v-38f0c91c${_scopeId}>${ssrInterpolate(__props.title)}</h3>`);
            if (__props.commonName) {
              _push2(`<p class="preparation-card__common-name" data-v-38f0c91c${_scopeId}>${ssrInterpolate(__props.commonName)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.scientificName) {
              _push2(`<p class="preparation-card__scientific" data-v-38f0c91c${_scopeId}>${ssrInterpolate(__props.scientificName)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "preparation-card__image-wrapper" }, [
                __props.image ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: __props.image,
                  alt: __props.title,
                  class: "preparation-card__image",
                  loading: "lazy"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "preparation-card__placeholder"
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
                createVNode("div", { class: "preparation-card__badges" }, [
                  __props.hasTCM ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "preparation-card__badge preparation-card__badge--tcm"
                  }, "TCM")) : createCommentVNode("", true),
                  __props.hasWestern ? (openBlock(), createBlock("span", {
                    key: 1,
                    class: "preparation-card__badge preparation-card__badge--western"
                  }, "W")) : createCommentVNode("", true),
                  __props.hasAyurveda ? (openBlock(), createBlock("span", {
                    key: 2,
                    class: "preparation-card__badge preparation-card__badge--ayurveda"
                  }, "Ayu")) : createCommentVNode("", true)
                ])
              ]),
              createVNode("div", { class: "preparation-card__content" }, [
                createVNode("h3", { class: "preparation-card__title" }, toDisplayString(__props.title), 1),
                __props.commonName ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "preparation-card__common-name"
                }, toDisplayString(__props.commonName), 1)) : createCommentVNode("", true),
                __props.scientificName ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "preparation-card__scientific"
                }, toDisplayString(__props.scientificName), 1)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/PreparationCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const PreparationCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-38f0c91c"]]);
const heroImage = "/@herbapedia/data/media/images/banners/tcm-banner.jpg";
const _sfc_main = {
  __name: "PreparationsView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    useRoute();
    const allPreparations = useAllPreparations();
    const localizer = usePreparationLocalizer();
    const { filters, initFromUrl, hasActiveFilters, applyFilters } = useFilters();
    const { tcmNatures, tcmFlavors, tcmMeridians, westernActions, westernOrgans } = useFilterOptions();
    const mobileFiltersOpen = ref(false);
    onMounted(() => {
      initFromUrl();
    });
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const tcmCount = computed(() => allPreparations.value.filter((p) => p.hasTCMProfile).length);
    const westernCount = computed(() => allPreparations.value.filter((p) => p.hasWesternProfile).length);
    const ayurvedaCount = computed(() => allPreparations.value.filter((p) => p.hasAyurvedaProfile).length);
    const persianCount = computed(() => allPreparations.value.filter((p) => p.hasPersianProfile).length);
    const mongolianCount = computed(() => allPreparations.value.filter((p) => p.hasMongolianProfile).length);
    const modernCount = computed(() => dataset.getSystemStats().modern);
    const selectedSystems = computed(() => {
      const systems = [];
      if (filters.system.tcm) systems.push("tcm");
      if (filters.system.western) systems.push("western");
      if (filters.system.ayurveda) systems.push("ayurveda");
      if (filters.system.persian) systems.push("persian");
      if (filters.system.mongolian) systems.push("mongolian");
      if (filters.system.modern) systems.push("modern");
      return systems;
    });
    const showTCMFilters = computed(() => {
      return filters.system.tcm || selectedSystems.value.length === 0;
    });
    const showWesternFilters = computed(() => {
      return filters.system.western || selectedSystems.value.length === 0;
    });
    const activeFilterCount = computed(() => {
      let count = 0;
      if (filters.system.tcm) count++;
      if (filters.system.western) count++;
      if (filters.system.ayurveda) count++;
      if (filters.tcm.nature) count++;
      if (filters.tcm.flavor) count++;
      if (filters.tcm.meridian) count++;
      if (filters.tcm.category) count++;
      if (filters.western.action) count++;
      if (filters.western.organ) count++;
      return count;
    });
    const filteredPreparations = computed(() => {
      return applyFilters(allPreparations.value);
    });
    function getSlug(prep) {
      if (!(prep == null ? void 0 : prep["@id"])) return "";
      const parts = prep["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getPrepName(prep) {
      return localizer.getName(prep) || getSlug(prep);
    }
    function getCommonName(prep) {
      var _a, _b, _c, _d;
      const slug = getSlug(prep);
      const plant = useSourcePlant(slug);
      return ((_b = (_a = plant.value) == null ? void 0 : _a.commonName) == null ? void 0 : _b[locale.value]) || ((_d = (_c = plant.value) == null ? void 0 : _c.commonName) == null ? void 0 : _d.en) || null;
    }
    function formatImagePath(img) {
      if (!img) return null;
      return img.startsWith("/@herbapedia") ? img : `/${img}`;
    }
    function getScientificName(prep) {
      var _a;
      const slug = getSlug(prep);
      const plant = useSourcePlant(slug);
      return ((_a = plant.value) == null ? void 0 : _a.scientificName) || null;
    }
    function getImage(prep) {
      var _a;
      const slug = getSlug(prep);
      const plant = useSourcePlant(slug);
      return formatImagePath((_a = plant.value) == null ? void 0 : _a.image);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "preparations-view" }, _attrs))} data-v-de9a397b><section class="preparations-hero" data-v-de9a397b><div class="preparations-hero__background" data-v-de9a397b><img${ssrRenderAttr("src", heroImage)} alt="" class="preparations-hero__bg-image" data-v-de9a397b><div class="preparations-hero__overlay" data-v-de9a397b></div></div><div class="container preparations-hero__content" data-v-de9a397b><h1 class="preparations-hero__title" data-v-de9a397b>${ssrInterpolate(unref(t)("nav.preparations") || "Preparations")}</h1><p class="preparations-hero__subtitle" data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.browseCount", { count: unref(allPreparations).length }))}</p><div class="preparations-hero__search" data-v-de9a397b><div class="search-input-wrapper" data-v-de9a397b><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-de9a397b><circle cx="11" cy="11" r="8" data-v-de9a397b></circle><path d="m21 21-4.35-4.35" data-v-de9a397b></path></svg><input${ssrRenderAttr("value", unref(filters).search)} type="text" class="search-input"${ssrRenderAttr("placeholder", unref(t)("preparations.searchPlaceholder"))} data-v-de9a397b>`);
      if (unref(filters).search) {
        _push(`<button class="search-clear" aria-label="Clear search" data-v-de9a397b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-de9a397b><path d="M18 6L6 18M6 6l12 12" data-v-de9a397b></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section><div class="container" data-v-de9a397b><div class="preparations-layout" data-v-de9a397b><aside class="${ssrRenderClass([{ "filter-sidebar--open": mobileFiltersOpen.value }, "filter-sidebar"])}" data-v-de9a397b><div class="filter-sidebar__header" data-v-de9a397b><h3 class="filter-sidebar__title" data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.filters"))}</h3>`);
      if (unref(hasActiveFilters)) {
        _push(`<button class="filter-sidebar__clear" data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.clearAll"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="filter-group" data-v-de9a397b><h4 class="filter-group__title" data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.systemProfiles"))}</h4><label class="filter-checkbox" data-v-de9a397b><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).system.tcm) ? ssrLooseContain(unref(filters).system.tcm, null) : unref(filters).system.tcm) ? " checked" : ""} data-v-de9a397b><span class="filter-checkbox__label" data-v-de9a397b>TCM (${ssrInterpolate(tcmCount.value)})</span></label><label class="filter-checkbox" data-v-de9a397b><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).system.western) ? ssrLooseContain(unref(filters).system.western, null) : unref(filters).system.western) ? " checked" : ""} data-v-de9a397b><span class="filter-checkbox__label" data-v-de9a397b>Western (${ssrInterpolate(westernCount.value)})</span></label><label class="filter-checkbox" data-v-de9a397b><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).system.ayurveda) ? ssrLooseContain(unref(filters).system.ayurveda, null) : unref(filters).system.ayurveda) ? " checked" : ""} data-v-de9a397b><span class="filter-checkbox__label" data-v-de9a397b>Ayurveda (${ssrInterpolate(ayurvedaCount.value)})</span></label><label class="filter-checkbox" data-v-de9a397b><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).system.persian) ? ssrLooseContain(unref(filters).system.persian, null) : unref(filters).system.persian) ? " checked" : ""} data-v-de9a397b><span class="filter-checkbox__label" data-v-de9a397b>Persian (${ssrInterpolate(persianCount.value)})</span></label><label class="filter-checkbox" data-v-de9a397b><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).system.mongolian) ? ssrLooseContain(unref(filters).system.mongolian, null) : unref(filters).system.mongolian) ? " checked" : ""} data-v-de9a397b><span class="filter-checkbox__label" data-v-de9a397b>Mongolian (${ssrInterpolate(mongolianCount.value)})</span></label><label class="filter-checkbox" data-v-de9a397b><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).system.modern) ? ssrLooseContain(unref(filters).system.modern, null) : unref(filters).system.modern) ? " checked" : ""} data-v-de9a397b><span class="filter-checkbox__label" data-v-de9a397b>Modern (${ssrInterpolate(modernCount.value)})</span></label></div>`);
      if (showTCMFilters.value) {
        _push(`<div class="filter-group" data-v-de9a397b><h4 class="filter-group__title" data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.tcmProperties"))}</h4><div class="filter-select" data-v-de9a397b><label data-v-de9a397b>${ssrInterpolate(unref(t)("tcm.nature"))}</label><select data-v-de9a397b><option${ssrRenderAttr("value", null)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).tcm.nature) ? ssrLooseContain(unref(filters).tcm.nature, null) : ssrLooseEqual(unref(filters).tcm.nature, null)) ? " selected" : ""}>${ssrInterpolate(unref(t)("preparations.all"))}</option><!--[-->`);
        ssrRenderList(unref(tcmNatures), (nature) => {
          _push(`<option${ssrRenderAttr("value", nature.value)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).tcm.nature) ? ssrLooseContain(unref(filters).tcm.nature, nature.value) : ssrLooseEqual(unref(filters).tcm.nature, nature.value)) ? " selected" : ""}>${ssrInterpolate(nature.label)}</option>`);
        });
        _push(`<!--]--></select></div><div class="filter-select" data-v-de9a397b><label data-v-de9a397b>${ssrInterpolate(unref(t)("tcm.flavor"))}</label><select data-v-de9a397b><option${ssrRenderAttr("value", null)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).tcm.flavor) ? ssrLooseContain(unref(filters).tcm.flavor, null) : ssrLooseEqual(unref(filters).tcm.flavor, null)) ? " selected" : ""}>${ssrInterpolate(unref(t)("preparations.all"))}</option><!--[-->`);
        ssrRenderList(unref(tcmFlavors), (flavor) => {
          _push(`<option${ssrRenderAttr("value", flavor.value)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).tcm.flavor) ? ssrLooseContain(unref(filters).tcm.flavor, flavor.value) : ssrLooseEqual(unref(filters).tcm.flavor, flavor.value)) ? " selected" : ""}>${ssrInterpolate(flavor.label)}</option>`);
        });
        _push(`<!--]--></select></div><div class="filter-select" data-v-de9a397b><label data-v-de9a397b>${ssrInterpolate(unref(t)("tcm.meridian"))}</label><select data-v-de9a397b><option${ssrRenderAttr("value", null)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).tcm.meridian) ? ssrLooseContain(unref(filters).tcm.meridian, null) : ssrLooseEqual(unref(filters).tcm.meridian, null)) ? " selected" : ""}>${ssrInterpolate(unref(t)("preparations.all"))}</option><!--[-->`);
        ssrRenderList(unref(tcmMeridians), (meridian) => {
          _push(`<option${ssrRenderAttr("value", meridian.value)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).tcm.meridian) ? ssrLooseContain(unref(filters).tcm.meridian, meridian.value) : ssrLooseEqual(unref(filters).tcm.meridian, meridian.value)) ? " selected" : ""}>${ssrInterpolate(meridian.label)}</option>`);
        });
        _push(`<!--]--></select></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showWesternFilters.value) {
        _push(`<div class="filter-group" data-v-de9a397b><h4 class="filter-group__title" data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.westernProperties"))}</h4><div class="filter-select" data-v-de9a397b><label data-v-de9a397b>${ssrInterpolate(unref(t)("western.actions"))}</label><select data-v-de9a397b><option${ssrRenderAttr("value", null)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).western.action) ? ssrLooseContain(unref(filters).western.action, null) : ssrLooseEqual(unref(filters).western.action, null)) ? " selected" : ""}>${ssrInterpolate(unref(t)("preparations.all"))}</option><!--[-->`);
        ssrRenderList(unref(westernActions), (action) => {
          _push(`<option${ssrRenderAttr("value", action.value)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).western.action) ? ssrLooseContain(unref(filters).western.action, action.value) : ssrLooseEqual(unref(filters).western.action, action.value)) ? " selected" : ""}>${ssrInterpolate(action.label)}</option>`);
        });
        _push(`<!--]--></select></div><div class="filter-select" data-v-de9a397b><label data-v-de9a397b>${ssrInterpolate(unref(t)("western.organAffinities"))}</label><select data-v-de9a397b><option${ssrRenderAttr("value", null)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).western.organ) ? ssrLooseContain(unref(filters).western.organ, null) : ssrLooseEqual(unref(filters).western.organ, null)) ? " selected" : ""}>${ssrInterpolate(unref(t)("preparations.all"))}</option><!--[-->`);
        ssrRenderList(unref(westernOrgans), (organ) => {
          _push(`<option${ssrRenderAttr("value", organ.value)} data-v-de9a397b${ssrIncludeBooleanAttr(Array.isArray(unref(filters).western.organ) ? ssrLooseContain(unref(filters).western.organ, organ.value) : ssrLooseEqual(unref(filters).western.organ, organ.value)) ? " selected" : ""}>${ssrInterpolate(organ.label)}</option>`);
        });
        _push(`<!--]--></select></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="filter-sidebar__close" data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.applyFilters"))}</button></aside><button class="mobile-filter-toggle" data-v-de9a397b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-de9a397b><path d="M4 21v-7m0-4V3m0 0l4 4M4 3L0 7m20 18v-7m0-4V3m0 0l4 4m-4-4l-4 4" data-v-de9a397b></path></svg> ${ssrInterpolate(unref(t)("preparations.filters"))} `);
      if (activeFilterCount.value) {
        _push(`<span class="mobile-filter-toggle__count" data-v-de9a397b>${ssrInterpolate(activeFilterCount.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><main class="preparations-main" data-v-de9a397b><div class="preparations-results" data-v-de9a397b>`);
      if (filteredPreparations.value.length !== unref(allPreparations).length) {
        _push(`<span data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.showingResults", { count: filteredPreparations.value.length, total: unref(allPreparations).length }))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="preparations-grid" data-v-de9a397b><!--[-->`);
      ssrRenderList(filteredPreparations.value, (prep) => {
        _push(ssrRenderComponent(PreparationCard, {
          key: getSlug(prep),
          to: localePath(`/preparations/${getSlug(prep)}`),
          title: getPrepName(prep),
          "common-name": getCommonName(prep),
          "scientific-name": getScientificName(prep),
          image: getImage(prep),
          "has-t-c-m": !!prep.hasTCMProfile,
          "has-western": !!prep.hasWesternProfile,
          "has-ayurveda": !!prep.hasAyurvedaProfile
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (filteredPreparations.value.length === 0) {
        _push(`<div class="preparations-empty" data-v-de9a397b><p data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.noResults"))}</p>`);
        if (unref(hasActiveFilters)) {
          _push(`<button class="preparations-empty__clear" data-v-de9a397b>${ssrInterpolate(unref(t)("preparations.clearAll"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/PreparationsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PreparationsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-de9a397b"]]);
export {
  PreparationsView as default
};
