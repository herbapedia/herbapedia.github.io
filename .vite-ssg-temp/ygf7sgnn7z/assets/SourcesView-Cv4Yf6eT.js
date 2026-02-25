import { resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "SourcesView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const counts = dataset.getCounts();
    const sourceTypes = [
      {
        id: "botanical",
        icon: "🌿",
        name: t("sources.botanical"),
        typeLabel: "PlantSpecies",
        description: t("sources.botanicalDesc"),
        path: "/sources/botanical",
        count: counts.plants
      },
      {
        id: "fungi",
        icon: "🍄",
        name: t("sources.fungi"),
        typeLabel: "FungalSpecies",
        description: t("sources.fungiDesc"),
        path: "/sources/fungi",
        count: counts.fungi
      },
      {
        id: "algae",
        icon: "🟢",
        name: t("sources.algae"),
        typeLabel: "AlgalSpecies",
        description: t("sources.algaeDesc"),
        path: "/sources/algae",
        count: counts.algae
      },
      {
        id: "zoological",
        icon: "🦐",
        name: t("sources.zoological"),
        typeLabel: "ZoologicalSource",
        description: t("sources.zoologicalDesc"),
        path: "/sources/zoological",
        count: counts.zoologicalSources
      },
      {
        id: "mineral",
        icon: "💎",
        name: t("sources.mineral"),
        typeLabel: "MineralSource",
        description: t("sources.mineralDesc"),
        path: "/sources/mineral",
        count: counts.mineralSources
      },
      {
        id: "chemical",
        icon: "⚗️",
        name: t("sources.chemical"),
        typeLabel: "ChemicalSource",
        description: t("sources.chemicalDesc"),
        path: "/sources/chemical",
        count: counts.chemicalSources
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sources-view" }, _attrs))} data-v-9605b098><div class="container" data-v-9605b098><nav class="breadcrumbs" data-v-9605b098>`);
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
      _push(`<span data-v-9605b098>/</span><span data-v-9605b098>${ssrInterpolate(unref(t)("sources.title"))}</span></nav><header class="sources-hero" data-v-9605b098><h1 class="sources-hero__title" data-v-9605b098>${ssrInterpolate(unref(t)("sources.title"))}</h1><p class="sources-hero__subtitle" data-v-9605b098>${ssrInterpolate(unref(t)("sources.subtitle"))}</p></header><div class="sources-grid" data-v-9605b098><!--[-->`);
      ssrRenderList(sourceTypes, (source) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: source.id,
          to: localePath(source.path),
          class: ["source-card", `source-card--${source.id}`]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="source-card__header" data-v-9605b098${_scopeId}><span class="source-card__icon" data-v-9605b098${_scopeId}>${ssrInterpolate(source.icon)}</span><div class="source-card__titles" data-v-9605b098${_scopeId}><h2 class="source-card__name" data-v-9605b098${_scopeId}>${ssrInterpolate(source.name)}</h2><p class="source-card__type" data-v-9605b098${_scopeId}>${ssrInterpolate(source.typeLabel)}</p></div></div><p class="source-card__description" data-v-9605b098${_scopeId}>${ssrInterpolate(source.description)}</p><div class="source-card__stats" data-v-9605b098${_scopeId}><div class="source-card__stat" data-v-9605b098${_scopeId}><span class="source-card__stat-value" data-v-9605b098${_scopeId}>${ssrInterpolate(source.count)}</span><span class="source-card__stat-label" data-v-9605b098${_scopeId}>${ssrInterpolate(unref(t)("sources.entities"))}</span></div></div><span class="source-card__arrow" data-v-9605b098${_scopeId}>→</span>`);
            } else {
              return [
                createVNode("div", { class: "source-card__header" }, [
                  createVNode("span", { class: "source-card__icon" }, toDisplayString(source.icon), 1),
                  createVNode("div", { class: "source-card__titles" }, [
                    createVNode("h2", { class: "source-card__name" }, toDisplayString(source.name), 1),
                    createVNode("p", { class: "source-card__type" }, toDisplayString(source.typeLabel), 1)
                  ])
                ]),
                createVNode("p", { class: "source-card__description" }, toDisplayString(source.description), 1),
                createVNode("div", { class: "source-card__stats" }, [
                  createVNode("div", { class: "source-card__stat" }, [
                    createVNode("span", { class: "source-card__stat-value" }, toDisplayString(source.count), 1),
                    createVNode("span", { class: "source-card__stat-label" }, toDisplayString(unref(t)("sources.entities")), 1)
                  ])
                ]),
                createVNode("span", { class: "source-card__arrow" }, "→")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><section class="sources-about" data-v-9605b098><h2 data-v-9605b098>${ssrInterpolate(unref(t)("sources.aboutTitle"))}</h2><p data-v-9605b098>${ssrInterpolate(unref(t)("sources.aboutText"))}</p></section></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/SourcesView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SourcesView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9605b098"]]);
export {
  SourcesView as default
};
