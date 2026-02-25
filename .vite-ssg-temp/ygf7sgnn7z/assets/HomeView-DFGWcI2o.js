import { computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { G as GlassCard } from "./GlassCard-D8pMjku3.js";
import { u as useAllPreparations, a as useDatasetStats } from "./useHerbData-DQ9hcdFH.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { u as useFilterOptions } from "./useFilters-z9iHlgRo.js";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import "@unhead/vue/server";
import "vue-router";
const heroImage = "/@herbapedia/data/media/images/banners/tcm-banner.jpg";
const _sfc_main = {
  __name: "HomeView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const allPreparations = useAllPreparations();
    const stats = useDatasetStats();
    const { tcmNatures, tcmFlavors, westernActions } = useFilterOptions();
    const systemStats = dataset.getSystemStats();
    const systemIcons = {
      modern: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`,
      tcm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 3v18"/>
    <path d="M3 12h18"/>
    <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" opacity="0.2"/>
  </svg>`,
      western: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2c-4 4-6 8-6 12 0 4 2.5 6 6 6s6-2 6-6c0-4-2-8-6-12z"/>
    <path d="M12 8v8"/>
    <path d="M9 12h6"/>
  </svg>`,
      ayurveda: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7l3-7z"/>
  </svg>`,
      persian: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 3a6 6 0 0 0-6 6c0 3.5 6 12 6 12s6-8.5 6-12a6 6 0 0 0-6-6z"/>
    <circle cx="12" cy="9" r="2" fill="currentColor" opacity="0.3"/>
  </svg>`,
      mongolian: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>`
    };
    const nativeNames = {
      modern: "Modern Medicine",
      tcm: "中药 / 中藥",
      western: "Western Herbalism",
      ayurveda: "आयुर्वेद",
      persian: "طب یونانی / Unani",
      mongolian: "Монгол эмнэлэг / Tibetan"
    };
    const browseSystems = computed(() => {
      const systemOrder = ["modern", "tcm", "western", "ayurveda", "persian", "mongolian"];
      return systemOrder.map((id) => {
        var _a, _b;
        const system = dataset.getSystem(id);
        const name = ((_a = system == null ? void 0 : system.name) == null ? void 0 : _a[locale.value]) || ((_b = system == null ? void 0 : system.name) == null ? void 0 : _b["en"]) || id;
        return {
          id,
          name,
          nativeName: nativeNames[id] || "",
          count: systemStats[id] || 0,
          link: `/preparations?system=${id}`,
          icon: systemIcons[id] || ""
        };
      });
    });
    computed(() => allPreparations.value.filter((p) => p.hasTCMProfile).length);
    computed(() => allPreparations.value.filter((p) => p.hasWesternProfile).length);
    computed(() => allPreparations.value.filter((p) => p.hasAyurvedaProfile).length);
    computed(() => allPreparations.value.filter((p) => p.hasPersianProfile).length);
    computed(() => allPreparations.value.filter((p) => p.hasMongolianProfile).length);
    computed(() => {
      const modernProfiles = dataset.getAllModernProfiles();
      return modernProfiles.size;
    });
    const tcmSystemName = computed(() => {
      const system = dataset.getSystem("tcm");
      if (!(system == null ? void 0 : system.name)) return "TCM";
      const name = system.name[locale.value] || system.name["en"];
      return name || "TCM";
    });
    const westernSystemName = computed(() => {
      const system = dataset.getSystem("western");
      if (!(system == null ? void 0 : system.name)) return "Western";
      const name = system.name[locale.value] || system.name["en"];
      return name || "Western";
    });
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-view" }, _attrs))} data-v-bfb69c4e><section class="hero" data-v-bfb69c4e><div class="hero__background" data-v-bfb69c4e><img${ssrRenderAttr("src", heroImage)} alt="" class="hero__bg-image" data-v-bfb69c4e><div class="hero__overlay" data-v-bfb69c4e></div></div><div class="container hero__container" data-v-bfb69c4e><div class="hero__content" data-v-bfb69c4e><h1 class="hero__title" data-v-bfb69c4e>${ssrInterpolate(unref(t)("home.heroTitle"))}</h1><p class="hero__subtitle" data-v-bfb69c4e>${ssrInterpolate(unref(t)("home.heroSubtitle"))}</p><p class="hero__description" data-v-bfb69c4e>${ssrInterpolate(unref(t)("home.heroDescription"))}</p>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/preparations"),
        class: "hero__cta"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("home.exploreHerbs"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("home.exploreHerbs")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="traditions" data-v-bfb69c4e><div class="container" data-v-bfb69c4e><h2 class="traditions__title" data-v-bfb69c4e>${ssrInterpolate(unref(t)("home.browseBySystem"))}</h2><div class="traditions__grid" data-v-bfb69c4e><!--[-->`);
      ssrRenderList(browseSystems.value, (system) => {
        _push(ssrRenderComponent(GlassCard, {
          key: system.id,
          hoverable: "",
          padding: "lg",
          class: "traditions__card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_router_link, {
                to: localePath(system.link),
                class: "tradition-card"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="tradition-card__icon" data-v-bfb69c4e${_scopeId2}>${system.icon ?? ""}</div><h3 class="tradition-card__title" data-v-bfb69c4e${_scopeId2}>${ssrInterpolate(system.name)}</h3><p class="tradition-card__subtitle" data-v-bfb69c4e${_scopeId2}>${ssrInterpolate(system.nativeName)}</p><p class="tradition-card__count" data-v-bfb69c4e${_scopeId2}>${ssrInterpolate(system.count)} ${ssrInterpolate(unref(t)("common.items"))}</p>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: "tradition-card__icon",
                        innerHTML: system.icon
                      }, null, 8, ["innerHTML"]),
                      createVNode("h3", { class: "tradition-card__title" }, toDisplayString(system.name), 1),
                      createVNode("p", { class: "tradition-card__subtitle" }, toDisplayString(system.nativeName), 1),
                      createVNode("p", { class: "tradition-card__count" }, toDisplayString(system.count) + " " + toDisplayString(unref(t)("common.items")), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_router_link, {
                  to: localePath(system.link),
                  class: "tradition-card"
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "tradition-card__icon",
                      innerHTML: system.icon
                    }, null, 8, ["innerHTML"]),
                    createVNode("h3", { class: "tradition-card__title" }, toDisplayString(system.name), 1),
                    createVNode("p", { class: "tradition-card__subtitle" }, toDisplayString(system.nativeName), 1),
                    createVNode("p", { class: "tradition-card__count" }, toDisplayString(system.count) + " " + toDisplayString(unref(t)("common.items")), 1)
                  ]),
                  _: 2
                }, 1032, ["to"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section><section class="properties" data-v-bfb69c4e><div class="container" data-v-bfb69c4e><h2 class="properties__title" data-v-bfb69c4e>${ssrInterpolate(unref(t)("home.browseByProperty"))}</h2><div class="property-group" data-v-bfb69c4e><h3 class="property-group__title" data-v-bfb69c4e>${ssrInterpolate(unref(t)("tcm.nature"))}</h3><div class="property-group__buttons" data-v-bfb69c4e><!--[-->`);
      ssrRenderList(unref(tcmNatures), (nature) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: nature.value,
          to: localePath(`/preparations?nature=${nature.value}`),
          class: ["property-button", `property-button--${nature.value}`]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(nature.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(nature.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><div class="property-group" data-v-bfb69c4e><h3 class="property-group__title" data-v-bfb69c4e>${ssrInterpolate(unref(t)("tcm.flavor"))}</h3><div class="property-group__buttons" data-v-bfb69c4e><!--[-->`);
      ssrRenderList(unref(tcmFlavors), (flavor) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: flavor.value,
          to: localePath(`/preparations?flavor=${flavor.value}`),
          class: "property-button property-button--flavor"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(flavor.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(flavor.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><div class="property-group" data-v-bfb69c4e><h3 class="property-group__title" data-v-bfb69c4e>${ssrInterpolate(unref(t)("western.actions"))}</h3><div class="property-group__buttons" data-v-bfb69c4e><!--[-->`);
      ssrRenderList(unref(westernActions).slice(0, 4), (action) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: action.value,
          to: localePath(`/preparations?action=${action.value}`),
          class: "property-button property-button--action"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(action.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(action.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div></section><section class="statistics" data-v-bfb69c4e><div class="container" data-v-bfb69c4e><div class="statistics__grid" data-v-bfb69c4e><div class="stat-card" data-v-bfb69c4e><span class="stat-card__number" data-v-bfb69c4e>${ssrInterpolate(unref(stats).preparations)}</span><span class="stat-card__label" data-v-bfb69c4e>${ssrInterpolate(unref(t)("nav.preparations"))}</span></div><div class="stat-card" data-v-bfb69c4e><span class="stat-card__number" data-v-bfb69c4e>${ssrInterpolate(unref(stats).tcmProfiles)}</span><span class="stat-card__label" data-v-bfb69c4e>${ssrInterpolate(tcmSystemName.value)} ${ssrInterpolate(unref(t)("preparations.systemProfiles"))}</span></div><div class="stat-card" data-v-bfb69c4e><span class="stat-card__number" data-v-bfb69c4e>${ssrInterpolate(unref(stats).westernProfiles)}</span><span class="stat-card__label" data-v-bfb69c4e>${ssrInterpolate(westernSystemName.value)} ${ssrInterpolate(unref(t)("preparations.systemProfiles"))}</span></div></div></div></section><section class="about" data-v-bfb69c4e><div class="container container-narrow" data-v-bfb69c4e>`);
      _push(ssrRenderComponent(GlassCard, { padding: "xl" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 data-v-bfb69c4e${_scopeId}>${ssrInterpolate(unref(t)("home.aboutTitle"))}</h2><p data-v-bfb69c4e${_scopeId}>${ssrInterpolate(unref(t)("home.aboutP1"))}</p><p data-v-bfb69c4e${_scopeId}>${ssrInterpolate(unref(t)("home.aboutP2"))}</p>`);
            _push2(ssrRenderComponent(_component_router_link, {
              to: localePath("/about"),
              class: "about__link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("home.learnMore"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("home.learnMore")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("h2", null, toDisplayString(unref(t)("home.aboutTitle")), 1),
              createVNode("p", null, toDisplayString(unref(t)("home.aboutP1")), 1),
              createVNode("p", null, toDisplayString(unref(t)("home.aboutP2")), 1),
              createVNode(_component_router_link, {
                to: localePath("/about"),
                class: "about__link"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(t)("home.learnMore")), 1)
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/HomeView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HomeView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bfb69c4e"]]);
export {
  HomeView as default
};
