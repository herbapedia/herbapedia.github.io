import { computed, ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "PlantPartsView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const allParts = computed(() => dataset.getAllPlantParts());
    const searchQuery = ref("");
    const filterMode = ref("all");
    const partTypes = ["root", "rhizome", "leaf", "flower", "fruit", "seed", "bulb", "bark", "stem"];
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    function getPartsByType(type) {
      return allParts.value.filter((part) => {
        const slug = getSlug(part).toLowerCase();
        return slug.includes(type.toLowerCase());
      });
    }
    function getPartTypeLabel(type) {
      const labels = {
        root: t("plantParts.roots"),
        rhizome: t("plantParts.rhizomes"),
        leaf: t("plantParts.leaves"),
        flower: t("plantParts.flowers"),
        fruit: t("plantParts.fruits"),
        seed: t("plantParts.seeds"),
        bulb: t("plantParts.bulbs"),
        bark: t("plantParts.barks"),
        stem: t("plantParts.stems")
      };
      return labels[type] || type;
    }
    function getPartIcon(part) {
      const slug = getSlug(part).toLowerCase();
      if (slug.includes("root")) return "🫚";
      if (slug.includes("rhizome")) return "🌿";
      if (slug.includes("leaf")) return "🍃";
      if (slug.includes("flower")) return "🌸";
      if (slug.includes("fruit")) return "🍒";
      if (slug.includes("seed")) return "🌱";
      if (slug.includes("bulb")) return "🧅";
      if (slug.includes("bark")) return "🪵";
      if (slug.includes("stem")) return "🎋";
      return "🌿";
    }
    const filteredParts = computed(() => {
      let parts = filterMode.value === "all" ? allParts.value : getPartsByType(filterMode.value);
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        parts = parts.filter((part) => {
          var _a, _b, _c;
          const nameMatch = (_a = getPartName(part)) == null ? void 0 : _a.toLowerCase().includes(query);
          const speciesMatch = (_b = getSpeciesName(part)) == null ? void 0 : _b.toLowerCase().includes(query);
          const descMatch = (_c = getPartDescription(part)) == null ? void 0 : _c.toLowerCase().includes(query);
          return nameMatch || speciesMatch || descMatch;
        });
      }
      return parts;
    });
    function getSlug(part) {
      if (!(part == null ? void 0 : part["@id"])) return "";
      const parts = part["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getPartName(part) {
      if (!(part == null ? void 0 : part.name)) return getSlug(part);
      return part.name[locale.value] || part.name["en"] || part.name["zh-Hant"] || getSlug(part);
    }
    function getPartDescription(part) {
      if (!(part == null ? void 0 : part.description)) return null;
      return part.description[locale.value] || part.description["en"] || part.description["zh-Hant"];
    }
    function getSpeciesName(part) {
      if (!(part == null ? void 0 : part.partOf)) return null;
      const speciesSlug = part.partOf["@id"].split("/").pop();
      const species = dataset.getPlantSpecies(speciesSlug);
      if (!species) return null;
      return species.scientificName;
    }
    function truncate(text, maxLength) {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "plant-parts-view" }, _attrs))} data-v-8dfded03><section class="plant-parts-hero" data-v-8dfded03><div class="plant-parts-hero__background" data-v-8dfded03><div class="plant-parts-hero__overlay" data-v-8dfded03></div></div><div class="container plant-parts-hero__content" data-v-8dfded03><h1 class="plant-parts-hero__title" data-v-8dfded03>${ssrInterpolate(unref(t)("plantParts.title"))}</h1><p class="plant-parts-hero__subtitle" data-v-8dfded03>${ssrInterpolate(unref(t)("plantParts.browseCount", { count: allParts.value.length }))}</p><div class="plant-parts-hero__search" data-v-8dfded03><div class="search-input-wrapper" data-v-8dfded03><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-8dfded03><circle cx="11" cy="11" r="8" data-v-8dfded03></circle><path d="m21 21-4.35-4.35" data-v-8dfded03></path></svg><input${ssrRenderAttr("value", searchQuery.value)} type="text" class="search-input"${ssrRenderAttr("placeholder", unref(t)("plantParts.searchPlaceholder"))} data-v-8dfded03>`);
      if (searchQuery.value) {
        _push(`<button class="search-clear" aria-label="Clear search" data-v-8dfded03><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-8dfded03><path d="M18 6L6 18M6 6l12 12" data-v-8dfded03></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section><div class="container" data-v-8dfded03><nav class="breadcrumbs" data-v-8dfded03>`);
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
      _push(`<span data-v-8dfded03>/</span><span data-v-8dfded03>${ssrInterpolate(unref(t)("plantParts.title"))}</span></nav><div class="plant-parts-filter-tabs" data-v-8dfded03><button class="${ssrRenderClass([{ "filter-tab--active": filterMode.value === "all" }, "filter-tab"])}" data-v-8dfded03>${ssrInterpolate(unref(t)("plantParts.allParts"))} (${ssrInterpolate(allParts.value.length)}) </button><!--[-->`);
      ssrRenderList(partTypes, (type) => {
        _push(`<button class="${ssrRenderClass([{ "filter-tab--active": filterMode.value === type }, "filter-tab"])}" data-v-8dfded03>${ssrInterpolate(getPartTypeLabel(type))} (${ssrInterpolate(getPartsByType(type).length)}) </button>`);
      });
      _push(`<!--]--></div><div class="plant-parts-results" data-v-8dfded03>`);
      if (searchQuery.value) {
        _push(`<span data-v-8dfded03>${ssrInterpolate(unref(t)("plantParts.showingResults", { count: filteredParts.value.length, query: searchQuery.value }))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="plant-parts-grid" data-v-8dfded03><!--[-->`);
      ssrRenderList(filteredParts.value, (part) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: getSlug(part),
          to: localePath(`/sources/parts/${getSlug(part)}`),
          class: "plant-part-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="plant-part-card__icon" data-v-8dfded03${_scopeId}>${ssrInterpolate(getPartIcon(part))}</div><div class="plant-part-card__content" data-v-8dfded03${_scopeId}><h3 class="plant-part-card__name" data-v-8dfded03${_scopeId}>${ssrInterpolate(getPartName(part))}</h3>`);
              if (getSpeciesName(part)) {
                _push2(`<p class="plant-part-card__species" data-v-8dfded03${_scopeId}>${ssrInterpolate(getSpeciesName(part))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (getPartDescription(part)) {
                _push2(`<p class="plant-part-card__description" data-v-8dfded03${_scopeId}>${ssrInterpolate(truncate(getPartDescription(part), 80))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><span class="plant-part-card__arrow" data-v-8dfded03${_scopeId}>→</span>`);
            } else {
              return [
                createVNode("div", { class: "plant-part-card__icon" }, toDisplayString(getPartIcon(part)), 1),
                createVNode("div", { class: "plant-part-card__content" }, [
                  createVNode("h3", { class: "plant-part-card__name" }, toDisplayString(getPartName(part)), 1),
                  getSpeciesName(part) ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "plant-part-card__species"
                  }, toDisplayString(getSpeciesName(part)), 1)) : createCommentVNode("", true),
                  getPartDescription(part) ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "plant-part-card__description"
                  }, toDisplayString(truncate(getPartDescription(part), 80)), 1)) : createCommentVNode("", true)
                ]),
                createVNode("span", { class: "plant-part-card__arrow" }, "→")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (filteredParts.value.length === 0) {
        _push(`<div class="plant-parts-empty" data-v-8dfded03><p data-v-8dfded03>${ssrInterpolate(unref(t)("plantParts.noResults"))}</p></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/PlantPartsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PlantPartsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8dfded03"]]);
export {
  PlantPartsView as default
};
