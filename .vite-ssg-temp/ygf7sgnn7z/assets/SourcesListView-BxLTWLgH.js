import { ref, computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "SourcesListView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const searchQuery = ref("");
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const sourceType = computed(() => {
      const path = route.path;
      if (path.includes("/sources/zoological")) return "zoological";
      if (path.includes("/sources/mineral")) return "mineral";
      if (path.includes("/sources/chemical")) return "chemical";
      return "unknown";
    });
    const sourceTypeInfo = {
      zoological: {
        icon: "🦐",
        label: t("sources.zoological")
      },
      mineral: {
        icon: "💎",
        label: t("sources.mineral")
      },
      chemical: {
        icon: "⚗️",
        label: t("sources.chemical")
      }
    };
    const sourceIcon = computed(() => {
      var _a;
      return ((_a = sourceTypeInfo[sourceType.value]) == null ? void 0 : _a.icon) || "📦";
    });
    const sourceLabel = computed(() => {
      var _a;
      return ((_a = sourceTypeInfo[sourceType.value]) == null ? void 0 : _a.label) || sourceType.value;
    });
    const sources = computed(() => {
      if (sourceType.value === "zoological") {
        return dataset.getAllZoologicalSources();
      } else if (sourceType.value === "mineral") {
        return dataset.getAllMineralSources();
      } else if (sourceType.value === "chemical") {
        return dataset.getAllChemicalSources();
      }
      return [];
    });
    const filteredSources = computed(() => {
      if (!searchQuery.value) return sources.value;
      const query = searchQuery.value.toLowerCase();
      return sources.value.filter((source) => {
        var _a, _b;
        const name = ((_a = getSourceName(source)) == null ? void 0 : _a.toLowerCase()) || "";
        const sci = ((_b = getScientificInfo(source)) == null ? void 0 : _b.toLowerCase()) || "";
        return name.includes(query) || sci.includes(query);
      });
    });
    function getSlug(source) {
      if (!(source == null ? void 0 : source["@id"])) return "";
      const parts = source["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getSourceName(source) {
      if (!(source == null ? void 0 : source.name)) return getSlug(source);
      return source.name[locale.value] || source.name.en || source.name["zh-Hant"] || getSlug(source);
    }
    function getScientificInfo(source) {
      if (source.animalScientificName) return source.animalScientificName;
      return null;
    }
    function formatImagePath(img) {
      if (!img) return null;
      return img.startsWith("/@herbapedia") ? img : `/${img}`;
    }
    function getSourceImage(source) {
      return formatImagePath(source == null ? void 0 : source.image);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sources-list-view" }, _attrs))} data-v-ff619d4e><section class="${ssrRenderClass([`sources-hero--${sourceType.value}`, "sources-hero"])}" data-v-ff619d4e><div class="sources-hero__background" data-v-ff619d4e><div class="sources-hero__overlay" data-v-ff619d4e></div></div><div class="container sources-hero__content" data-v-ff619d4e><span class="sources-hero__icon" data-v-ff619d4e>${ssrInterpolate(sourceIcon.value)}</span><h1 class="sources-hero__title" data-v-ff619d4e>${ssrInterpolate(sourceLabel.value)}</h1><p class="sources-hero__subtitle" data-v-ff619d4e>${ssrInterpolate(unref(t)("sources.browseCount", { count: sources.value.length }))}</p></div></section><div class="container" data-v-ff619d4e><nav class="breadcrumbs" data-v-ff619d4e>`);
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
      _push(`<span data-v-ff619d4e>/</span>`);
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
      _push(`<span data-v-ff619d4e>/</span><span data-v-ff619d4e>${ssrInterpolate(sourceLabel.value)}</span></nav><div class="sources-search" data-v-ff619d4e><div class="search-input-wrapper" data-v-ff619d4e><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-ff619d4e><circle cx="11" cy="11" r="8" data-v-ff619d4e></circle><path d="m21 21-4.35-4.35" data-v-ff619d4e></path></svg><input${ssrRenderAttr("value", searchQuery.value)} type="text" class="search-input"${ssrRenderAttr("placeholder", unref(t)("sources.searchPlaceholder"))} data-v-ff619d4e></div></div>`);
      if (filteredSources.value.length > 0) {
        _push(`<div class="sources-grid" data-v-ff619d4e><!--[-->`);
        ssrRenderList(filteredSources.value, (source) => {
          _push(ssrRenderComponent(_component_router_link, {
            key: getSlug(source),
            to: localePath(`/sources/${sourceType.value}/${getSlug(source)}`),
            class: ["source-card", `source-card--${sourceType.value}`]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="source-card__image-wrapper" data-v-ff619d4e${_scopeId}>`);
                if (getSourceImage(source)) {
                  _push2(`<img${ssrRenderAttr("src", getSourceImage(source))}${ssrRenderAttr("alt", getSourceName(source))} class="source-card__image" loading="lazy" data-v-ff619d4e${_scopeId}>`);
                } else {
                  _push2(`<div class="source-card__placeholder" data-v-ff619d4e${_scopeId}><span data-v-ff619d4e${_scopeId}>${ssrInterpolate(sourceIcon.value)}</span></div>`);
                }
                _push2(`</div><div class="source-card__content" data-v-ff619d4e${_scopeId}><h3 class="source-card__name" data-v-ff619d4e${_scopeId}>${ssrInterpolate(getSourceName(source))}</h3>`);
                if (getScientificInfo(source)) {
                  _push2(`<p class="source-card__scientific" data-v-ff619d4e${_scopeId}>${ssrInterpolate(getScientificInfo(source))}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                if (source.chemicalFormula) {
                  _push2(`<p class="source-card__formula" data-v-ff619d4e${_scopeId}><code data-v-ff619d4e${_scopeId}>${ssrInterpolate(source.chemicalFormula)}</code></p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><span class="source-card__arrow" data-v-ff619d4e${_scopeId}>→</span>`);
              } else {
                return [
                  createVNode("div", { class: "source-card__image-wrapper" }, [
                    getSourceImage(source) ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: getSourceImage(source),
                      alt: getSourceName(source),
                      class: "source-card__image",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "source-card__placeholder"
                    }, [
                      createVNode("span", null, toDisplayString(sourceIcon.value), 1)
                    ]))
                  ]),
                  createVNode("div", { class: "source-card__content" }, [
                    createVNode("h3", { class: "source-card__name" }, toDisplayString(getSourceName(source)), 1),
                    getScientificInfo(source) ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "source-card__scientific"
                    }, toDisplayString(getScientificInfo(source)), 1)) : createCommentVNode("", true),
                    source.chemicalFormula ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "source-card__formula"
                    }, [
                      createVNode("code", null, toDisplayString(source.chemicalFormula), 1)
                    ])) : createCommentVNode("", true)
                  ]),
                  createVNode("span", { class: "source-card__arrow" }, "→")
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="sources-empty" data-v-ff619d4e><p data-v-ff619d4e>${ssrInterpolate(unref(t)("sources.noResults"))}</p></div>`);
      }
      _push(`<section class="sources-about" data-v-ff619d4e><h2 data-v-ff619d4e>${ssrInterpolate(unref(t)(`sources.${sourceType.value}About`))}</h2><p data-v-ff619d4e>${ssrInterpolate(unref(t)(`sources.${sourceType.value}AboutText`))}</p></section></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/SourcesListView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SourcesListView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ff619d4e"]]);
export {
  SourcesListView as default
};
