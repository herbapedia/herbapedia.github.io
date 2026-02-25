import { computed, ref, watch, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { b as usePreparationLocalizer, c as useSourcePlant } from "./useHerbData-DQ9hcdFH.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "SourceDetailView",
  __ssrInlineRender: true,
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const props = __props;
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const sourceType = computed(() => {
      const path = route.path;
      if (path.includes("/sources/zoological/")) return "zoological";
      if (path.includes("/sources/mineral/")) return "mineral";
      if (path.includes("/sources/chemical/")) return "chemical";
      return "unknown";
    });
    const sourceTypeInfo = {
      zoological: {
        icon: "🦐",
        label: t("sources.zoological"),
        badge: "ZoologicalSource"
      },
      mineral: {
        icon: "💎",
        label: t("sources.mineral"),
        badge: "MineralSource"
      },
      chemical: {
        icon: "⚗️",
        label: t("sources.chemical"),
        badge: "ChemicalSource"
      }
    };
    const sourceIcon = computed(() => {
      var _a;
      return ((_a = sourceTypeInfo[sourceType.value]) == null ? void 0 : _a.icon) || "📦";
    });
    const sourceTypeLabel = computed(() => {
      var _a;
      return ((_a = sourceTypeInfo[sourceType.value]) == null ? void 0 : _a.label) || sourceType.value;
    });
    const sourceTypeBadge = computed(() => {
      var _a;
      return ((_a = sourceTypeInfo[sourceType.value]) == null ? void 0 : _a.badge) || sourceType.value;
    });
    const source = ref(null);
    watch([() => props.slug, sourceType], ([slug, type]) => {
      if (slug && type) {
        if (type === "zoological") {
          source.value = dataset.getZoologicalSource(slug);
        } else if (type === "mineral") {
          source.value = dataset.getMineralSource(slug);
        } else if (type === "chemical") {
          source.value = dataset.getChemicalSource(slug);
        }
      }
    }, { immediate: true });
    const sourceName = computed(() => {
      var _a;
      if (!((_a = source.value) == null ? void 0 : _a.name)) return props.slug;
      return source.value.name[locale.value] || source.value.name.en || source.value.name["zh-Hant"] || props.slug;
    });
    const sourceScientificName = computed(() => {
      var _a;
      if (sourceType.value === "zoological") {
        return ((_a = source.value) == null ? void 0 : _a.animalScientificName) || null;
      }
      return null;
    });
    const description = computed(() => {
      var _a;
      if (!((_a = source.value) == null ? void 0 : _a.description)) return null;
      return source.value.description[locale.value] || source.value.description.en || source.value.description["zh-Hant"] || null;
    });
    function getAnimalName() {
      var _a;
      if (!((_a = source.value) == null ? void 0 : _a.animalName)) return null;
      return source.value.animalName[locale.value] || source.value.animalName.en || source.value.animalName["zh-Hant"] || null;
    }
    const preparations = computed(() => {
      if (!source.value) return [];
      const allPreps = dataset.getAllPreparations();
      const sourceId = source.value["@id"];
      return allPreps.filter((prep) => {
        if (!prep.derivedFrom) return false;
        return prep.derivedFrom.some((ref2) => {
          const refId = ref2["@id"] || ref2;
          return refId === sourceId || refId.includes(props.slug);
        });
      });
    });
    const externalLinks = computed(() => {
      var _a, _b;
      const links = [];
      if ((_a = source.value) == null ? void 0 : _a.gbifID) {
        links.push({
          url: `https://www.gbif.org/species/${source.value.gbifID}`,
          label: t("links.gbif"),
          icon: "🌍"
        });
      }
      if ((_b = source.value) == null ? void 0 : _b.wikidataID) {
        links.push({
          url: `https://www.wikidata.org/entity/${source.value.wikidataID}`,
          label: t("links.wikidata"),
          icon: "📊"
        });
      }
      return links;
    });
    const hasExternalLinks = computed(() => externalLinks.value.length > 0);
    function getSlug(prep) {
      if (!(prep == null ? void 0 : prep["@id"])) return "";
      const parts = prep["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    const localizer = usePreparationLocalizer();
    function getPrepName(prep) {
      return localizer.getName(prep) || getSlug(prep);
    }
    function getImage(prep) {
      var _a;
      const slug = getSlug(prep);
      const plant = useSourcePlant(slug);
      const img = (_a = plant.value) == null ? void 0 : _a.image;
      if (!img) return null;
      return img.startsWith("/@herbapedia") ? img : `/${img}`;
    }
    function getFormLabel(prep) {
      if (!(prep == null ? void 0 : prep.form)) return null;
      const formId = prep.form["@id"] || prep.form;
      if (!formId) return null;
      const slug = formId.split("/").pop();
      const form = dataset.getHerbalForm(slug);
      if (form == null ? void 0 : form.name) {
        return form.name[locale.value] || form.name.en || slug;
      }
      return slug == null ? void 0 : slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "source-detail-view" }, _attrs))} data-v-5b02795b><div class="container container-narrow" data-v-5b02795b><nav class="breadcrumbs" data-v-5b02795b>`);
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
      _push(`<span data-v-5b02795b>/</span>`);
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
      _push(`<span data-v-5b02795b>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath(`/sources/${sourceType.value}`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(sourceTypeLabel.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(sourceTypeLabel.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-5b02795b>/</span><span data-v-5b02795b>${ssrInterpolate(sourceName.value)}</span></nav>`);
      if (source.value) {
        _push(`<article class="source-detail" data-v-5b02795b><header class="${ssrRenderClass([`source-detail__header--${sourceType.value}`, "source-detail__header"])}" data-v-5b02795b><div class="source-detail__image-wrapper" data-v-5b02795b>`);
        if (source.value.image) {
          _push(`<img${ssrRenderAttr("src", source.value.image)}${ssrRenderAttr("alt", sourceName.value)} class="source-detail__image" data-v-5b02795b>`);
        } else {
          _push(`<div class="source-detail__placeholder" data-v-5b02795b><span data-v-5b02795b>${ssrInterpolate(sourceIcon.value)}</span></div>`);
        }
        _push(`</div><div class="source-detail__meta" data-v-5b02795b><span class="${ssrRenderClass([`type-badge--${sourceType.value}`, "source-detail__type-badge"])}" data-v-5b02795b>${ssrInterpolate(sourceTypeBadge.value)}</span><h1 class="source-detail__name" data-v-5b02795b>${ssrInterpolate(sourceName.value)}</h1>`);
        if (sourceScientificName.value) {
          _push(`<p class="source-detail__scientific" data-v-5b02795b>${ssrInterpolate(sourceScientificName.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (source.value.animalPart) {
          _push(`<p class="source-detail__part" data-v-5b02795b>${ssrInterpolate(unref(t)("sources.animalPart"))}: ${ssrInterpolate(source.value.animalPart)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (source.value.chemicalFormula) {
          _push(`<p class="source-detail__formula" data-v-5b02795b>${ssrInterpolate(source.value.chemicalFormula)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header><section class="source-detail__section source-detail__preparations" data-v-5b02795b><h2 class="section-title" data-v-5b02795b><span class="section-title__icon" data-v-5b02795b>→</span> ${ssrInterpolate(unref(t)("sources.preparationsFromSource"))} <span class="section-title__count" data-v-5b02795b>(${ssrInterpolate(preparations.value.length)})</span></h2>`);
        if (preparations.value.length > 0) {
          _push(`<div class="preparations-grid" data-v-5b02795b><!--[-->`);
          ssrRenderList(preparations.value, (prep) => {
            _push(ssrRenderComponent(_component_router_link, {
              key: getSlug(prep),
              to: localePath(`/preparations/${getSlug(prep)}`),
              class: "preparation-card-mini"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="preparation-card-mini__image-wrapper" data-v-5b02795b${_scopeId}>`);
                  if (getImage(prep)) {
                    _push2(`<img${ssrRenderAttr("src", getImage(prep))}${ssrRenderAttr("alt", getPrepName(prep))} class="preparation-card-mini__image" data-v-5b02795b${_scopeId}>`);
                  } else {
                    _push2(`<div class="preparation-card-mini__placeholder" data-v-5b02795b${_scopeId}><span data-v-5b02795b${_scopeId}>🌿</span></div>`);
                  }
                  _push2(`</div><div class="preparation-card-mini__content" data-v-5b02795b${_scopeId}><h4 class="preparation-card-mini__name" data-v-5b02795b${_scopeId}>${ssrInterpolate(getPrepName(prep))}</h4>`);
                  if (getFormLabel(prep)) {
                    _push2(`<p class="preparation-card-mini__form" data-v-5b02795b${_scopeId}>${ssrInterpolate(getFormLabel(prep))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="preparation-card-mini__badges" data-v-5b02795b${_scopeId}>`);
                  if (prep.hasTCMProfile) {
                    _push2(`<span class="prep-badge prep-badge--tcm" data-v-5b02795b${_scopeId}>TCM</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (prep.hasWesternProfile) {
                    _push2(`<span class="prep-badge prep-badge--western" data-v-5b02795b${_scopeId}>W</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (prep.hasAyurvedaProfile) {
                    _push2(`<span class="prep-badge prep-badge--ayurveda" data-v-5b02795b${_scopeId}>Ayu</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div><span class="preparation-card-mini__arrow" data-v-5b02795b${_scopeId}>→</span>`);
                } else {
                  return [
                    createVNode("div", { class: "preparation-card-mini__image-wrapper" }, [
                      getImage(prep) ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: getImage(prep),
                        alt: getPrepName(prep),
                        class: "preparation-card-mini__image"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "preparation-card-mini__placeholder"
                      }, [
                        createVNode("span", null, "🌿")
                      ]))
                    ]),
                    createVNode("div", { class: "preparation-card-mini__content" }, [
                      createVNode("h4", { class: "preparation-card-mini__name" }, toDisplayString(getPrepName(prep)), 1),
                      getFormLabel(prep) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "preparation-card-mini__form"
                      }, toDisplayString(getFormLabel(prep)), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "preparation-card-mini__badges" }, [
                        prep.hasTCMProfile ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "prep-badge prep-badge--tcm"
                        }, "TCM")) : createCommentVNode("", true),
                        prep.hasWesternProfile ? (openBlock(), createBlock("span", {
                          key: 1,
                          class: "prep-badge prep-badge--western"
                        }, "W")) : createCommentVNode("", true),
                        prep.hasAyurvedaProfile ? (openBlock(), createBlock("span", {
                          key: 2,
                          class: "prep-badge prep-badge--ayurveda"
                        }, "Ayu")) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("span", { class: "preparation-card-mini__arrow" }, "→")
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="preparations-empty" data-v-5b02795b><p data-v-5b02795b>${ssrInterpolate(unref(t)("sources.noPreparations"))}</p></div>`);
        }
        _push(`</section>`);
        if (description.value) {
          _push(`<section class="source-detail__section" data-v-5b02795b><h2 class="section-title" data-v-5b02795b>${ssrInterpolate(unref(t)("sources.description"))}</h2><div class="prose" data-v-5b02795b><p data-v-5b02795b>${ssrInterpolate(description.value)}</p></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (sourceType.value === "zoological" && source.value.animalName) {
          _push(`<section class="source-detail__section" data-v-5b02795b><h2 class="section-title" data-v-5b02795b>${ssrInterpolate(unref(t)("sources.animalOrigin"))}</h2><dl class="properties-list" data-v-5b02795b><dt data-v-5b02795b>${ssrInterpolate(unref(t)("sources.animalName"))}</dt><dd data-v-5b02795b>${ssrInterpolate(getAnimalName())}</dd>`);
          if (source.value.animalScientificName) {
            _push(`<dt data-v-5b02795b>${ssrInterpolate(unref(t)("sources.animalScientificName"))}</dt>`);
          } else {
            _push(`<!---->`);
          }
          if (source.value.animalScientificName) {
            _push(`<dd data-v-5b02795b>${ssrInterpolate(source.value.animalScientificName)}</dd>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</dl></section>`);
        } else {
          _push(`<!---->`);
        }
        if (sourceType.value === "chemical" && (source.value.chemicalFormula || source.value.isSynthesized)) {
          _push(`<section class="source-detail__section" data-v-5b02795b><h2 class="section-title" data-v-5b02795b>${ssrInterpolate(unref(t)("sources.chemicalProperties"))}</h2><dl class="properties-list" data-v-5b02795b>`);
          if (source.value.chemicalFormula) {
            _push(`<dt data-v-5b02795b>${ssrInterpolate(unref(t)("sources.chemicalFormula"))}</dt>`);
          } else {
            _push(`<!---->`);
          }
          if (source.value.chemicalFormula) {
            _push(`<dd data-v-5b02795b><code data-v-5b02795b>${ssrInterpolate(source.value.chemicalFormula)}</code></dd>`);
          } else {
            _push(`<!---->`);
          }
          if (source.value.isSynthesized !== void 0) {
            _push(`<dt data-v-5b02795b>${ssrInterpolate(unref(t)("sources.synthesis"))}</dt>`);
          } else {
            _push(`<!---->`);
          }
          if (source.value.isSynthesized !== void 0) {
            _push(`<dd data-v-5b02795b>${ssrInterpolate(source.value.isSynthesized ? unref(t)("sources.synthesized") : unref(t)("sources.natural"))}</dd>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</dl></section>`);
        } else {
          _push(`<!---->`);
        }
        if (hasExternalLinks.value) {
          _push(`<section class="source-detail__section source-detail__links" data-v-5b02795b><h2 class="section-title" data-v-5b02795b>${ssrInterpolate(unref(t)("links.title"))}</h2><div class="external-links" data-v-5b02795b><!--[-->`);
          ssrRenderList(externalLinks.value, (link) => {
            _push(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener noreferrer" class="external-link" data-v-5b02795b><span class="external-link__icon" data-v-5b02795b>${ssrInterpolate(link.icon)}</span> ${ssrInterpolate(link.label)} <span class="external-link__arrow" data-v-5b02795b>↗</span></a>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<aside class="source-detail__disclaimer" data-v-5b02795b><p data-v-5b02795b><strong data-v-5b02795b>${ssrInterpolate(unref(t)("disclaimer.title"))}:</strong> ${ssrInterpolate(unref(t)("disclaimer.text"))}</p></aside></article>`);
      } else {
        _push(`<div class="source-not-found" data-v-5b02795b><h1 data-v-5b02795b>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-5b02795b>${ssrInterpolate(unref(t)("sources.sourceNotFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath("/sources"),
          class: "back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("sources.backToSources"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("sources.backToSources")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/SourceDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SourceDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5b02795b"]]);
export {
  SourceDetailView as default
};
