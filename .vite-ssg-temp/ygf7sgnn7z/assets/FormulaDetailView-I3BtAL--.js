import { computed, ref, watch, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "FormulaDetailView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const slug = computed(() => route.params.slug);
    const formula = ref(null);
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const formulaName = computed(() => {
      var _a;
      if (!((_a = formula.value) == null ? void 0 : _a.name)) return slug.value;
      return formula.value.name[locale.value] || formula.value.name["en"] || formula.value.name["zh-Hant"] || slug.value;
    });
    const description = computed(() => {
      var _a;
      if (!((_a = formula.value) == null ? void 0 : _a.description)) return null;
      return formula.value.description[locale.value] || formula.value.description["en"] || formula.value.description["zh-Hant"];
    });
    const ingredientPreparations = computed(() => {
      var _a;
      if (!((_a = formula.value) == null ? void 0 : _a.ingredients)) return [];
      return formula.value.ingredients.map((ingredient) => {
        var _a2;
        const slug2 = ((_a2 = ingredient["@id"]) == null ? void 0 : _a2.split("/").pop()) || "";
        const preparation = dataset.getPreparation(slug2);
        return { slug: slug2, preparation };
      }).filter((item) => item.preparation);
    });
    function getIngredientName(preparation) {
      if (!(preparation == null ? void 0 : preparation.name)) return "Unknown";
      return preparation.name[locale.value] || preparation.name["en"] || preparation.name["zh-Hant"] || "Unknown";
    }
    watch(slug, (newSlug) => {
      if (newSlug) {
        formula.value = dataset.getFormula(newSlug);
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "formula-detail-view" }, _attrs))} data-v-b0a195ad><div class="container container-narrow" data-v-b0a195ad><nav class="breadcrumbs" data-v-b0a195ad>`);
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
      _push(`<span data-v-b0a195ad>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/formulas")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("formulas.title"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("formulas.title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-b0a195ad>/</span><span data-v-b0a195ad>${ssrInterpolate(formulaName.value)}</span></nav>`);
      if (formula.value) {
        _push(`<article class="formula-detail" data-v-b0a195ad><header class="formula-detail__header" data-v-b0a195ad><div class="formula-detail__icon" data-v-b0a195ad>🔬</div><div class="formula-detail__meta" data-v-b0a195ad><span class="formula-detail__type-badge" data-v-b0a195ad>${ssrInterpolate(unref(t)("formulas.formula"))}</span><h1 class="formula-detail__name" data-v-b0a195ad>${ssrInterpolate(formulaName.value)}</h1>`);
        if (formula.value.scientificName) {
          _push(`<p class="formula-detail__scientific" data-v-b0a195ad>${ssrInterpolate(formula.value.scientificName)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (formula.value.sourceSubType) {
          _push(`<span class="formula-detail__subtype" data-v-b0a195ad>${ssrInterpolate(formula.value.sourceSubType)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (description.value) {
          _push(`<section class="formula-detail__section" data-v-b0a195ad><h2 class="section-title" data-v-b0a195ad>${ssrInterpolate(unref(t)("sections.description"))}</h2><div class="prose" data-v-b0a195ad><p data-v-b0a195ad>${ssrInterpolate(description.value)}</p></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (formula.value.ingredients && formula.value.ingredients.length > 0) {
          _push(`<section class="formula-detail__section formula-detail__ingredients" data-v-b0a195ad><h2 class="section-title" data-v-b0a195ad><span class="section-title__icon" data-v-b0a195ad>🌿</span> ${ssrInterpolate(unref(t)("formulas.ingredients"))}</h2><p class="ingredients-note" data-v-b0a195ad>${ssrInterpolate(unref(t)("formulas.ingredientsNote"))}</p><div class="ingredients-list" data-v-b0a195ad><!--[-->`);
          ssrRenderList(ingredientPreparations.value, (ingredient, index) => {
            var _a;
            _push(`<div class="ingredient-card" data-v-b0a195ad><div class="ingredient-card__icon" data-v-b0a195ad>🍃</div><div class="ingredient-card__content" data-v-b0a195ad><h3 class="ingredient-card__name" data-v-b0a195ad>${ssrInterpolate(getIngredientName(ingredient.preparation))}</h3>`);
            if ((_a = ingredient.preparation) == null ? void 0 : _a.scientificName) {
              _push(`<p class="ingredient-card__scientific" data-v-b0a195ad>${ssrInterpolate(ingredient.preparation.scientificName)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(ssrRenderComponent(_component_router_link, {
              to: localePath(`/preparations/${ingredient.slug}`),
              class: "ingredient-card__link"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(t)("preparations.viewPlantProfile"))} → `);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("preparations.viewPlantProfile")) + " → ", 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<aside class="formula-detail__disclaimer" data-v-b0a195ad><p data-v-b0a195ad><strong data-v-b0a195ad>${ssrInterpolate(unref(t)("disclaimer.title"))}:</strong> ${ssrInterpolate(unref(t)("disclaimer.text"))}</p></aside></article>`);
      } else {
        _push(`<div class="formula-detail__not-found" data-v-b0a195ad><h1 data-v-b0a195ad>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-b0a195ad>${ssrInterpolate(unref(t)("formulas.notFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath("/formulas"),
          class: "formula-detail__back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("formulas.backToFormulas"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("formulas.backToFormulas")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/FormulaDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FormulaDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b0a195ad"]]);
export {
  FormulaDetailView as default
};
