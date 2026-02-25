import { computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "FormulasView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const allFormulas = computed(() => dataset.getAllFormulas());
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    function getSlug(formula) {
      if (!(formula == null ? void 0 : formula["@id"])) return "";
      const parts = formula["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getFormulaName(formula) {
      if (!(formula == null ? void 0 : formula.name)) return getSlug(formula);
      return formula.name[locale.value] || formula.name["en"] || formula.name["zh-Hant"] || getSlug(formula);
    }
    function getFormulaDescription(formula) {
      if (!(formula == null ? void 0 : formula.description)) return null;
      return formula.description[locale.value] || formula.description["en"] || formula.description["zh-Hant"];
    }
    function truncate(text, maxLength) {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "formulas-view" }, _attrs))} data-v-d49e6632><section class="formulas-hero" data-v-d49e6632><div class="formulas-hero__background" data-v-d49e6632><div class="formulas-hero__overlay" data-v-d49e6632></div></div><div class="container formulas-hero__content" data-v-d49e6632><h1 class="formulas-hero__title" data-v-d49e6632>${ssrInterpolate(unref(t)("formulas.title"))}</h1><p class="formulas-hero__subtitle" data-v-d49e6632>${ssrInterpolate(unref(t)("formulas.subtitle"))}</p></div></section><div class="container" data-v-d49e6632><nav class="breadcrumbs" data-v-d49e6632>`);
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
      _push(`<span data-v-d49e6632>/</span><span data-v-d49e6632>${ssrInterpolate(unref(t)("formulas.title"))}</span></nav><div class="formulas-grid" data-v-d49e6632><!--[-->`);
      ssrRenderList(allFormulas.value, (formula) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: getSlug(formula),
          to: localePath(`/formulas/${getSlug(formula)}`),
          class: "formula-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="formula-card__icon" data-v-d49e6632${_scopeId}>🔬</div><div class="formula-card__content" data-v-d49e6632${_scopeId}><h3 class="formula-card__name" data-v-d49e6632${_scopeId}>${ssrInterpolate(getFormulaName(formula))}</h3>`);
              if (formula.scientificName) {
                _push2(`<p class="formula-card__scientific" data-v-d49e6632${_scopeId}>${ssrInterpolate(formula.scientificName)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (getFormulaDescription(formula)) {
                _push2(`<p class="formula-card__description" data-v-d49e6632${_scopeId}>${ssrInterpolate(truncate(getFormulaDescription(formula), 100))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (formula.sourceSubType) {
                _push2(`<span class="formula-card__badge" data-v-d49e6632${_scopeId}>${ssrInterpolate(formula.sourceSubType)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><span class="formula-card__arrow" data-v-d49e6632${_scopeId}>→</span>`);
            } else {
              return [
                createVNode("div", { class: "formula-card__icon" }, "🔬"),
                createVNode("div", { class: "formula-card__content" }, [
                  createVNode("h3", { class: "formula-card__name" }, toDisplayString(getFormulaName(formula)), 1),
                  formula.scientificName ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "formula-card__scientific"
                  }, toDisplayString(formula.scientificName), 1)) : createCommentVNode("", true),
                  getFormulaDescription(formula) ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "formula-card__description"
                  }, toDisplayString(truncate(getFormulaDescription(formula), 100)), 1)) : createCommentVNode("", true),
                  formula.sourceSubType ? (openBlock(), createBlock("span", {
                    key: 2,
                    class: "formula-card__badge"
                  }, toDisplayString(formula.sourceSubType), 1)) : createCommentVNode("", true)
                ]),
                createVNode("span", { class: "formula-card__arrow" }, "→")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (allFormulas.value.length === 0) {
        _push(`<div class="formulas-empty" data-v-d49e6632><p data-v-d49e6632>${ssrInterpolate(unref(t)("formulas.noResults"))}</p></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/FormulasView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FormulasView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d49e6632"]]);
export {
  FormulasView as default
};
