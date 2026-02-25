import { computed, ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "ChemicalCompoundsView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const allCompounds = computed(() => dataset.getAllChemicals());
    const searchQuery = ref("");
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const filteredCompounds = computed(() => {
      if (!searchQuery.value) {
        return allCompounds.value;
      }
      const query = searchQuery.value.toLowerCase();
      return allCompounds.value.filter((compound) => {
        var _a, _b, _c;
        const nameMatch = (_a = getCompoundName(compound)) == null ? void 0 : _a.toLowerCase().includes(query);
        const formulaMatch = (_b = compound.molecularFormula) == null ? void 0 : _b.toLowerCase().includes(query);
        const descMatch = (_c = getCompoundDescription(compound)) == null ? void 0 : _c.toLowerCase().includes(query);
        return nameMatch || formulaMatch || descMatch;
      });
    });
    function getSlug(compound) {
      if (!(compound == null ? void 0 : compound["@id"])) return "";
      const parts = compound["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getCompoundName(compound) {
      if (!(compound == null ? void 0 : compound.name)) return getSlug(compound);
      return compound.name[locale.value] || compound.name["en"] || compound.name["zh-Hant"] || getSlug(compound);
    }
    function getCompoundDescription(compound) {
      if (!(compound == null ? void 0 : compound.description)) return null;
      return compound.description[locale.value] || compound.description["en"] || compound.description["zh-Hant"];
    }
    function truncate(text, maxLength) {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "compounds-view" }, _attrs))} data-v-e1ce84b6><section class="compounds-hero" data-v-e1ce84b6><div class="compounds-hero__background" data-v-e1ce84b6><div class="compounds-hero__overlay" data-v-e1ce84b6></div></div><div class="container compounds-hero__content" data-v-e1ce84b6><h1 class="compounds-hero__title" data-v-e1ce84b6>${ssrInterpolate(unref(t)("compounds.title"))}</h1><p class="compounds-hero__subtitle" data-v-e1ce84b6>${ssrInterpolate(unref(t)("compounds.browseCount", { count: allCompounds.value.length }))}</p><div class="compounds-hero__search" data-v-e1ce84b6><div class="search-input-wrapper" data-v-e1ce84b6><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e1ce84b6><circle cx="11" cy="11" r="8" data-v-e1ce84b6></circle><path d="m21 21-4.35-4.35" data-v-e1ce84b6></path></svg><input${ssrRenderAttr("value", searchQuery.value)} type="text" class="search-input"${ssrRenderAttr("placeholder", unref(t)("compounds.searchPlaceholder"))} data-v-e1ce84b6>`);
      if (searchQuery.value) {
        _push(`<button class="search-clear" aria-label="Clear search" data-v-e1ce84b6><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e1ce84b6><path d="M18 6L6 18M6 6l12 12" data-v-e1ce84b6></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section><div class="container" data-v-e1ce84b6><nav class="breadcrumbs" data-v-e1ce84b6>`);
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
      _push(`<span data-v-e1ce84b6>/</span><span data-v-e1ce84b6>${ssrInterpolate(unref(t)("compounds.title"))}</span></nav><div class="compounds-results" data-v-e1ce84b6>`);
      if (searchQuery.value) {
        _push(`<span data-v-e1ce84b6>${ssrInterpolate(unref(t)("compounds.showingResults", { count: filteredCompounds.value.length, query: searchQuery.value }))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="compounds-grid" data-v-e1ce84b6><!--[-->`);
      ssrRenderList(filteredCompounds.value, (compound) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: getSlug(compound),
          to: localePath(`/compounds/${getSlug(compound)}`),
          class: "compound-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="compound-card__icon" data-v-e1ce84b6${_scopeId}>⚗️</div><div class="compound-card__content" data-v-e1ce84b6${_scopeId}><h3 class="compound-card__name" data-v-e1ce84b6${_scopeId}>${ssrInterpolate(getCompoundName(compound))}</h3>`);
              if (compound.molecularFormula) {
                _push2(`<p class="compound-card__formula" data-v-e1ce84b6${_scopeId}>${ssrInterpolate(compound.molecularFormula)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (getCompoundDescription(compound)) {
                _push2(`<p class="compound-card__description" data-v-e1ce84b6${_scopeId}>${ssrInterpolate(truncate(getCompoundDescription(compound), 100))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><span class="compound-card__arrow" data-v-e1ce84b6${_scopeId}>→</span>`);
            } else {
              return [
                createVNode("div", { class: "compound-card__icon" }, "⚗️"),
                createVNode("div", { class: "compound-card__content" }, [
                  createVNode("h3", { class: "compound-card__name" }, toDisplayString(getCompoundName(compound)), 1),
                  compound.molecularFormula ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "compound-card__formula"
                  }, toDisplayString(compound.molecularFormula), 1)) : createCommentVNode("", true),
                  getCompoundDescription(compound) ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "compound-card__description"
                  }, toDisplayString(truncate(getCompoundDescription(compound), 100)), 1)) : createCommentVNode("", true)
                ]),
                createVNode("span", { class: "compound-card__arrow" }, "→")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (filteredCompounds.value.length === 0) {
        _push(`<div class="compounds-empty" data-v-e1ce84b6><p data-v-e1ce84b6>${ssrInterpolate(unref(t)("compounds.noResults"))}</p></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ChemicalCompoundsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ChemicalCompoundsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e1ce84b6"]]);
export {
  ChemicalCompoundsView as default
};
