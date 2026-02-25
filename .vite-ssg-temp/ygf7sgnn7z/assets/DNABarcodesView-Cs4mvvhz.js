import { ref, computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "DNABarcodesView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const searchQuery = ref("");
    const allBarcodes = computed(() => dataset.getAllDNABarcodes());
    const filteredBarcodes = computed(() => {
      if (!searchQuery.value.trim()) {
        return allBarcodes.value;
      }
      const query = searchQuery.value.toLowerCase();
      return allBarcodes.value.filter((barcode) => {
        var _a;
        const name = getBarcodeName(barcode).toLowerCase();
        const species = ((_a = getSpeciesName(barcode)) == null ? void 0 : _a.toLowerCase()) || "";
        const regions = getRegions(barcode).join(" ").toLowerCase();
        return name.includes(query) || species.includes(query) || regions.includes(query);
      });
    });
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    function getSlug(barcode) {
      if (!(barcode == null ? void 0 : barcode["@id"])) return "";
      const parts = barcode["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getBarcodeName(barcode) {
      if (!(barcode == null ? void 0 : barcode.name)) return getSlug(barcode);
      return barcode.name[locale.value] || barcode.name["en"] || barcode.name["zh-Hant"] || getSlug(barcode);
    }
    function getSpeciesName(barcode) {
      if (!(barcode == null ? void 0 : barcode.species)) return null;
      const speciesSlug = barcode.species["@id"].split("/").pop();
      const species = dataset.getPlantSpecies(speciesSlug);
      if (!species) return null;
      return species.scientificName;
    }
    function getRegions(barcode) {
      if (!(barcode == null ? void 0 : barcode.sequence)) return [];
      return barcode.sequence.map((s) => s.region).filter(Boolean);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dna-barcodes-view" }, _attrs))} data-v-c4b48123><section class="dna-barcodes-hero" data-v-c4b48123><div class="dna-barcodes-hero__background" data-v-c4b48123><div class="dna-barcodes-hero__overlay" data-v-c4b48123></div></div><div class="container dna-barcodes-hero__content" data-v-c4b48123><h1 class="dna-barcodes-hero__title" data-v-c4b48123>${ssrInterpolate(unref(t)("dnaBarcodes.title"))}</h1><p class="dna-barcodes-hero__subtitle" data-v-c4b48123>${ssrInterpolate(unref(t)("dnaBarcodes.subtitle"))}</p></div></section><div class="container" data-v-c4b48123><nav class="breadcrumbs" data-v-c4b48123>`);
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
      _push(`<span data-v-c4b48123>/</span><span data-v-c4b48123>${ssrInterpolate(unref(t)("dnaBarcodes.title"))}</span></nav><div class="search-section" data-v-c4b48123><div class="search-box" data-v-c4b48123><span class="search-box__icon" data-v-c4b48123>🔍</span><input${ssrRenderAttr("value", searchQuery.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("dnaBarcodes.searchPlaceholder"))} class="search-box__input" data-v-c4b48123>`);
      if (searchQuery.value) {
        _push(`<button class="search-box__clear" data-v-c4b48123> ✕ </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (searchQuery.value && filteredBarcodes.value.length > 0) {
        _push(`<div class="search-results-count" data-v-c4b48123>${ssrInterpolate(unref(t)("dnaBarcodes.showingResults", { count: filteredBarcodes.value.length, query: searchQuery.value }))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="dna-barcodes-grid" data-v-c4b48123><!--[-->`);
      ssrRenderList(filteredBarcodes.value, (barcode) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: getSlug(barcode),
          to: localePath(`/sources/barcodes/${getSlug(barcode)}`),
          class: "dna-barcode-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="dna-barcode-card__icon" data-v-c4b48123${_scopeId}>🧬</div><div class="dna-barcode-card__content" data-v-c4b48123${_scopeId}><h3 class="dna-barcode-card__name" data-v-c4b48123${_scopeId}>${ssrInterpolate(getBarcodeName(barcode))}</h3>`);
              if (getSpeciesName(barcode)) {
                _push2(`<p class="dna-barcode-card__species" data-v-c4b48123${_scopeId}>${ssrInterpolate(getSpeciesName(barcode))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="dna-barcode-card__regions" data-v-c4b48123${_scopeId}><!--[-->`);
              ssrRenderList(getRegions(barcode), (region) => {
                _push2(`<span class="region-badge" data-v-c4b48123${_scopeId}>${ssrInterpolate(region)}</span>`);
              });
              _push2(`<!--]--></div></div><span class="dna-barcode-card__arrow" data-v-c4b48123${_scopeId}>→</span>`);
            } else {
              return [
                createVNode("div", { class: "dna-barcode-card__icon" }, "🧬"),
                createVNode("div", { class: "dna-barcode-card__content" }, [
                  createVNode("h3", { class: "dna-barcode-card__name" }, toDisplayString(getBarcodeName(barcode)), 1),
                  getSpeciesName(barcode) ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "dna-barcode-card__species"
                  }, toDisplayString(getSpeciesName(barcode)), 1)) : createCommentVNode("", true),
                  createVNode("div", { class: "dna-barcode-card__regions" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(getRegions(barcode), (region) => {
                      return openBlock(), createBlock("span", {
                        key: region,
                        class: "region-badge"
                      }, toDisplayString(region), 1);
                    }), 128))
                  ])
                ]),
                createVNode("span", { class: "dna-barcode-card__arrow" }, "→")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (filteredBarcodes.value.length === 0 && searchQuery.value) {
        _push(`<div class="dna-barcodes-empty" data-v-c4b48123><p data-v-c4b48123>${ssrInterpolate(unref(t)("dnaBarcodes.noResults"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (filteredBarcodes.value.length === 0 && !searchQuery.value) {
        _push(`<div class="dna-barcodes-empty" data-v-c4b48123><p data-v-c4b48123>${ssrInterpolate(unref(t)("dnaBarcodes.noResults"))}</p></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/DNABarcodesView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DNABarcodesView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c4b48123"]]);
export {
  DNABarcodesView as default
};
