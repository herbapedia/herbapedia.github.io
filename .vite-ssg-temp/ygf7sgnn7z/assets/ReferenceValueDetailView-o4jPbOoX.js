import { computed, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { b as usePreparationLocalizer } from "./useHerbData-DQ9hcdFH.js";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "ReferenceValueDetailView",
  __ssrInlineRender: true,
  props: {
    system: { type: String, required: true },
    refType: { type: String, required: true },
    slug: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const { t, locale } = useI18n();
    const isValidSystem = computed(() => !!systemConfigs[props.system]);
    const isValidRefType = computed(() => !!referenceTypeConfigs[props.refType]);
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const systemConfigs = {
      tcm: {
        icon: "☯️",
        nameKey: "systems.tcm.name"
      },
      western: {
        icon: "🌿",
        nameKey: "systems.western.name"
      },
      ayurveda: {
        icon: "🪷",
        nameKey: "systems.ayurveda.name"
      },
      persian: {
        icon: "🌙",
        nameKey: "systems.persian.name"
      },
      mongolian: {
        icon: "🏔️",
        nameKey: "systems.mongolian.name"
      }
    };
    const systemInfo = computed(() => {
      const config = systemConfigs[props.system];
      if (!config) return null;
      return {
        icon: config.icon,
        name: t(config.nameKey)
      };
    });
    const referenceTypeConfigs = {
      // TCM
      natures: {
        getItem: (slug) => findReferenceItem(dataset.getAllNatures(), slug)
      },
      flavors: {
        getItem: (slug) => findReferenceItem(dataset.getAllFlavors(), slug)
      },
      meridians: {
        getItem: (slug) => findReferenceItem(dataset.getAllMeridians(), slug)
      },
      categories: {
        getItem: (slug) => findReferenceItem(dataset.getAllCategories(), slug)
      },
      // Western
      actions: {
        getItem: (slug) => findReferenceItem(dataset.getAllActions(), slug)
      },
      organs: {
        getItem: (slug) => findReferenceItem(dataset.getAllOrgans(), slug)
      },
      // Ayurveda
      rasa: {
        getItem: (slug) => findReferenceItem(dataset.getAllRasas(), slug)
      },
      guna: {
        getItem: (slug) => findReferenceItem(dataset.getAllGunas(), slug)
      },
      virya: {
        getItem: (slug) => findReferenceItem(dataset.getAllViryas(), slug)
      },
      vipaka: {
        getItem: (slug) => findReferenceItem(dataset.getAllVipakas(), slug)
      },
      // Persian
      temperaments: {
        getItem: (slug) => findReferenceItem(dataset.getAllTemperaments(), slug)
      },
      // Mongolian
      elements: {
        getItem: (slug) => findReferenceItem(dataset.getAllMongolianElements(), slug)
      },
      tastes: {
        getItem: (slug) => findReferenceItem(dataset.getAllMongolianTastes(), slug)
      }
    };
    function findReferenceItem(items, slug) {
      return items.find((item) => {
        const id = item["@id"] || "";
        return id.endsWith(`/${slug}`) || id === slug;
      }) || null;
    }
    const referenceInfo = computed(() => {
      const config = referenceTypeConfigs[props.refType];
      if (!config) return null;
      const names = {
        natures: t("tcm.natures"),
        flavors: t("tcm.flavors"),
        meridians: t("tcm.meridians"),
        categories: t("tcm.categories"),
        actions: t("western.actions"),
        organs: t("western.organs"),
        rasa: t("ayurveda.rasas"),
        guna: t("ayurveda.gunas"),
        virya: t("ayurveda.viryas"),
        vipaka: t("ayurveda.vipakas"),
        temperaments: t("persian.temperaments"),
        elements: t("mongolian.elements"),
        tastes: t("mongolian.tastes")
      };
      return { name: names[props.refType] || props.refType };
    });
    const referenceItem = computed(() => {
      const config = referenceTypeConfigs[props.refType];
      if (!config) return null;
      return config.getItem(props.slug);
    });
    const itemLabel = computed(() => {
      if (!referenceItem.value) return "";
      const prefLabel = referenceItem.value.prefLabel;
      if (!prefLabel) return extractLabel(referenceItem.value["@id"]);
      return prefLabel[locale.value] || prefLabel.en || extractLabel(referenceItem.value["@id"]);
    });
    const itemDescription = computed(() => {
      if (!referenceItem.value) return "";
      const desc = referenceItem.value.description;
      if (!desc) return "";
      return desc[locale.value] || desc.en || "";
    });
    const otherTranslations = computed(() => {
      var _a;
      if (!((_a = referenceItem.value) == null ? void 0 : _a.prefLabel)) return [];
      return Object.entries(referenceItem.value.prefLabel).filter(([lang]) => lang !== locale.value && lang !== "en").map(([lang, value]) => ({ lang, value }));
    });
    function extractLabel(iri) {
      if (!iri) return "";
      const parts = iri.split("/");
      return parts[parts.length - 1] || iri;
    }
    const preparations = computed(() => {
      if (!referenceItem.value) return [];
      const itemId = referenceItem.value["@id"];
      const itemSlug = props.slug;
      let profileCache;
      if (props.system === "tcm") profileCache = dataset.tcmCache;
      else if (props.system === "western") profileCache = dataset.westernCache;
      else if (props.system === "ayurveda") profileCache = dataset.ayurvedaCache;
      else if (props.system === "persian") profileCache = dataset.persianCache;
      else if (props.system === "mongolian") profileCache = dataset.mongolianCache;
      if (!profileCache) return [];
      const refTypeGetters = {
        natures: (p) => p.hasNature ? [p.hasNature["@id"] || p.hasNature] : [],
        flavors: (p) => {
          var _a;
          return ((_a = p.hasFlavor) == null ? void 0 : _a.map((f) => f["@id"] || f)) || [];
        },
        meridians: (p) => {
          var _a;
          return ((_a = p.entersMeridian) == null ? void 0 : _a.map((m) => m["@id"] || m)) || [];
        },
        categories: (p) => p.hasCategory ? [p.hasCategory["@id"] || p.hasCategory] : [],
        actions: (p) => {
          var _a;
          return ((_a = p.hasAction) == null ? void 0 : _a.map((a) => a["@id"] || a)) || [];
        },
        organs: (p) => {
          var _a;
          return ((_a = p.hasOrganAffinity) == null ? void 0 : _a.map((o) => o["@id"] || o)) || [];
        },
        rasa: (p) => {
          var _a;
          return ((_a = p.hasRasa) == null ? void 0 : _a.map((r) => r["@id"] || r)) || [];
        },
        guna: (p) => {
          var _a;
          return ((_a = p.hasGuna) == null ? void 0 : _a.map((g) => g["@id"] || g)) || [];
        },
        virya: (p) => p.hasVirya ? [p.hasVirya["@id"] || p.hasVirya] : [],
        vipaka: (p) => p.hasVipaka ? [p.hasVipaka["@id"] || p.hasVipaka] : [],
        temperaments: (p) => p.hasTemperament ? [p.hasTemperament["@id"] || p.hasTemperament] : [],
        elements: (p) => {
          var _a;
          return ((_a = p.hasElement) == null ? void 0 : _a.map((e) => e["@id"] || e)) || [];
        },
        tastes: (p) => {
          var _a;
          return ((_a = p.hasTaste) == null ? void 0 : _a.map((t2) => t2["@id"] || t2)) || [];
        }
      };
      const getter = refTypeGetters[props.refType];
      if (!getter) return [];
      const result = [];
      const allPreps = dataset.getAllPreparations();
      allPreps.forEach((prep) => {
        let profileRef;
        if (props.system === "tcm") profileRef = prep.hasTCMProfile;
        else if (props.system === "western") profileRef = prep.hasWesternProfile;
        else if (props.system === "ayurveda") profileRef = prep.hasAyurvedaProfile;
        else if (props.system === "persian") profileRef = prep.hasPersianProfile;
        else if (props.system === "mongolian") profileRef = prep.hasMongolianProfile;
        if (!profileRef) return;
        const profileRefs = Array.isArray(profileRef) ? profileRef : [profileRef];
        for (const ref of profileRefs) {
          const profileId = ref["@id"] || ref;
          const profileSlug = profileId.split("/").pop();
          const profile = profileCache.get(profileSlug);
          if (!profile) continue;
          const values = getter(profile);
          if (!values || values.length === 0) continue;
          const matches = values.some(
            (v) => v === itemId || (v == null ? void 0 : v.includes(itemSlug)) || extractLabel(v) === itemSlug
          );
          if (matches) {
            result.push(prep);
            break;
          }
        }
      });
      return result;
    });
    const localizer = usePreparationLocalizer();
    function getPrepName(prep) {
      return localizer.getName(prep) || extractLabel(prep == null ? void 0 : prep["@id"]);
    }
    function getPrepDescription(prep) {
      if (!(prep == null ? void 0 : prep.description)) return "";
      return prep.description[locale.value] || prep.description.en || "";
    }
    function truncate(text, maxLength) {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + "...";
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "reference-detail-view" }, _attrs))} data-v-9c5ac900><div class="container" data-v-9c5ac900><nav class="breadcrumbs" data-v-9c5ac900>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/systems")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("systems.title"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("systems.title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-9c5ac900>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath(`/systems/${__props.system}`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b;
          if (_push2) {
            _push2(`${ssrInterpolate((_a2 = systemInfo.value) == null ? void 0 : _a2.name)}`);
          } else {
            return [
              createTextVNode(toDisplayString((_b = systemInfo.value) == null ? void 0 : _b.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-9c5ac900>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath(`/systems/${__props.system}/${__props.refType}`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b;
          if (_push2) {
            _push2(`${ssrInterpolate((_a2 = referenceInfo.value) == null ? void 0 : _a2.name)}`);
          } else {
            return [
              createTextVNode(toDisplayString((_b = referenceInfo.value) == null ? void 0 : _b.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-9c5ac900>/</span><span data-v-9c5ac900>${ssrInterpolate(itemLabel.value)}</span></nav>`);
      if (isValidSystem.value && isValidRefType.value && referenceItem.value) {
        _push(`<div data-v-9c5ac900><header class="${ssrRenderClass([`reference-hero--${__props.system}`, "reference-hero"])}" data-v-9c5ac900><span class="reference-hero__icon" data-v-9c5ac900>${ssrInterpolate((_a = systemInfo.value) == null ? void 0 : _a.icon)}</span><h1 class="reference-hero__title" data-v-9c5ac900>${ssrInterpolate(itemLabel.value)}</h1>`);
        if (otherTranslations.value.length > 0) {
          _push(`<div class="reference-hero__translations" data-v-9c5ac900><!--[-->`);
          ssrRenderList(otherTranslations.value, (trans) => {
            _push(`<span class="translation-tag" data-v-9c5ac900>${ssrInterpolate(trans.lang)}: ${ssrInterpolate(trans.value)}</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (itemDescription.value) {
          _push(`<p class="reference-hero__description" data-v-9c5ac900>${ssrInterpolate(itemDescription.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</header><section class="preparations-section" data-v-9c5ac900><h2 class="section-title" data-v-9c5ac900>${ssrInterpolate(unref(t)("reference.usingPreparations"))}</h2>`);
        if (preparations.value.length > 0) {
          _push(`<div class="preparations-grid" data-v-9c5ac900><!--[-->`);
          ssrRenderList(preparations.value, (prep) => {
            _push(ssrRenderComponent(_component_router_link, {
              key: extractLabel(prep["@id"]),
              to: localePath(`/preparations/${extractLabel(prep["@id"])}`),
              class: ["preparation-card", `preparation-card--${__props.system}`]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="preparation-card__content" data-v-9c5ac900${_scopeId}><h3 class="preparation-card__name" data-v-9c5ac900${_scopeId}>${ssrInterpolate(getPrepName(prep))}</h3>`);
                  if (getPrepDescription(prep)) {
                    _push2(`<p class="preparation-card__desc" data-v-9c5ac900${_scopeId}>${ssrInterpolate(truncate(getPrepDescription(prep), 100))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "preparation-card__content" }, [
                      createVNode("h3", { class: "preparation-card__name" }, toDisplayString(getPrepName(prep)), 1),
                      getPrepDescription(prep) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "preparation-card__desc"
                      }, toDisplayString(truncate(getPrepDescription(prep), 100)), 1)) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="empty-state" data-v-9c5ac900><p data-v-9c5ac900>${ssrInterpolate(unref(t)("reference.noPreparations"))}</p></div>`);
        }
        _push(`</section></div>`);
      } else {
        _push(`<div class="reference-not-found" data-v-9c5ac900><h1 data-v-9c5ac900>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-9c5ac900>${ssrInterpolate(unref(t)("reference.notFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath(`/systems/${__props.system}/${__props.refType}`),
          class: "back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("reference.backToList"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("reference.backToList")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ReferenceValueDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReferenceValueDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9c5ac900"]]);
export {
  ReferenceValueDetailView as default
};
