import { computed, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "SystemsView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const stats = dataset.getSystemStats();
    const formsCount = dataset.getAllHerbalForms().length;
    const methodsCount = dataset.getAllHerbalMethods().length;
    const systems = computed(() => [
      {
        id: "modern",
        icon: "💊",
        name: t("systems.modern.name"),
        nativeName: "Modern Medicine",
        description: t("systems.modern.description"),
        profileCount: stats.modern,
        referenceCount: 0
        // Reference data coming soon
      },
      {
        id: "tcm",
        icon: "☯️",
        name: t("systems.tcm.name"),
        nativeName: "中医 / 中醫",
        description: t("systems.tcm.description"),
        profileCount: stats.tcm,
        referenceCount: 44
        // 5 natures + 5 flavors + 12 meridians + 22 categories
      },
      {
        id: "western",
        icon: "🌿",
        name: t("systems.western.name"),
        nativeName: "Western Herbalism",
        description: t("systems.western.description"),
        profileCount: stats.western,
        referenceCount: 40
        // 25 actions + 15 organs
      },
      {
        id: "ayurveda",
        icon: "🪷",
        name: t("systems.ayurveda.name"),
        nativeName: "आयुर्वेद / Ayurveda",
        description: t("systems.ayurveda.description"),
        profileCount: stats.ayurveda,
        referenceCount: 31
        // 6 rasa + 20 guna + 2 virya + 3 vipaka
      },
      {
        id: "persian",
        icon: "🌙",
        name: t("systems.persian.name"),
        nativeName: "طب یونانی / Unani",
        description: t("systems.persian.description"),
        profileCount: stats.persian,
        referenceCount: 8
        // 4 temperaments + 4 elements
      },
      {
        id: "mongolian",
        icon: "🏔️",
        name: t("systems.mongolian.name"),
        nativeName: "Монгол эмнэлэг / Tibetan",
        description: t("systems.mongolian.description"),
        profileCount: stats.mongolian,
        referenceCount: 11
        // 5 elements + 6 tastes
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "systems-view" }, _attrs))} data-v-72bc8b77><div class="container" data-v-72bc8b77><nav class="breadcrumbs" data-v-72bc8b77>`);
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
      _push(`<span data-v-72bc8b77>/</span><span data-v-72bc8b77>${ssrInterpolate(unref(t)("systems.title"))}</span></nav><header class="systems-hero" data-v-72bc8b77><h1 class="systems-hero__title" data-v-72bc8b77>${ssrInterpolate(unref(t)("systems.title"))}</h1><p class="systems-hero__subtitle" data-v-72bc8b77>${ssrInterpolate(unref(t)("systems.subtitle"))}</p></header><div class="systems-grid" data-v-72bc8b77><!--[-->`);
      ssrRenderList(systems.value, (system) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: system.id,
          to: localePath(`/systems/${system.id}`),
          class: ["system-card", `system-card--${system.id}`]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="system-card__header" data-v-72bc8b77${_scopeId}><span class="system-card__icon" data-v-72bc8b77${_scopeId}>${ssrInterpolate(system.icon)}</span><div class="system-card__titles" data-v-72bc8b77${_scopeId}><h2 class="system-card__name" data-v-72bc8b77${_scopeId}>${ssrInterpolate(system.name)}</h2><p class="system-card__native" data-v-72bc8b77${_scopeId}>${ssrInterpolate(system.nativeName)}</p></div></div><p class="system-card__description" data-v-72bc8b77${_scopeId}>${ssrInterpolate(system.description)}</p><div class="system-card__stats" data-v-72bc8b77${_scopeId}><div class="system-card__stat" data-v-72bc8b77${_scopeId}><span class="system-card__stat-value" data-v-72bc8b77${_scopeId}>${ssrInterpolate(system.profileCount)}</span><span class="system-card__stat-label" data-v-72bc8b77${_scopeId}>${ssrInterpolate(unref(t)("systems.profiles"))}</span></div><div class="system-card__stat" data-v-72bc8b77${_scopeId}><span class="system-card__stat-value" data-v-72bc8b77${_scopeId}>${ssrInterpolate(system.referenceCount)}</span><span class="system-card__stat-label" data-v-72bc8b77${_scopeId}>${ssrInterpolate(unref(t)("systems.referenceData"))}</span></div></div><span class="system-card__arrow" data-v-72bc8b77${_scopeId}>→</span>`);
            } else {
              return [
                createVNode("div", { class: "system-card__header" }, [
                  createVNode("span", { class: "system-card__icon" }, toDisplayString(system.icon), 1),
                  createVNode("div", { class: "system-card__titles" }, [
                    createVNode("h2", { class: "system-card__name" }, toDisplayString(system.name), 1),
                    createVNode("p", { class: "system-card__native" }, toDisplayString(system.nativeName), 1)
                  ])
                ]),
                createVNode("p", { class: "system-card__description" }, toDisplayString(system.description), 1),
                createVNode("div", { class: "system-card__stats" }, [
                  createVNode("div", { class: "system-card__stat" }, [
                    createVNode("span", { class: "system-card__stat-value" }, toDisplayString(system.profileCount), 1),
                    createVNode("span", { class: "system-card__stat-label" }, toDisplayString(unref(t)("systems.profiles")), 1)
                  ]),
                  createVNode("div", { class: "system-card__stat" }, [
                    createVNode("span", { class: "system-card__stat-value" }, toDisplayString(system.referenceCount), 1),
                    createVNode("span", { class: "system-card__stat-label" }, toDisplayString(unref(t)("systems.referenceData")), 1)
                  ])
                ]),
                createVNode("span", { class: "system-card__arrow" }, "→")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><section class="vocabulary-section" data-v-72bc8b77><h2 class="vocabulary-section__title" data-v-72bc8b77>${ssrInterpolate(unref(t)("herbal.title"))}</h2><p class="vocabulary-section__subtitle" data-v-72bc8b77>${ssrInterpolate(unref(t)("herbal.subtitle"))}</p><div class="vocabulary-grid" data-v-72bc8b77>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/systems/herbal/forms"),
        class: "vocabulary-card vocabulary-card--forms"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="vocabulary-card__icon" data-v-72bc8b77${_scopeId}>💊</span><h3 class="vocabulary-card__name" data-v-72bc8b77${_scopeId}>${ssrInterpolate(unref(t)("herbal.forms"))}</h3><p class="vocabulary-card__count" data-v-72bc8b77${_scopeId}>${ssrInterpolate(unref(formsCount))} ${ssrInterpolate(unref(t)("systems.items"))}</p><p class="vocabulary-card__desc" data-v-72bc8b77${_scopeId}>${ssrInterpolate(unref(t)("reference.formsDesc"))}</p>`);
          } else {
            return [
              createVNode("span", { class: "vocabulary-card__icon" }, "💊"),
              createVNode("h3", { class: "vocabulary-card__name" }, toDisplayString(unref(t)("herbal.forms")), 1),
              createVNode("p", { class: "vocabulary-card__count" }, toDisplayString(unref(formsCount)) + " " + toDisplayString(unref(t)("systems.items")), 1),
              createVNode("p", { class: "vocabulary-card__desc" }, toDisplayString(unref(t)("reference.formsDesc")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/systems/herbal/methods"),
        class: "vocabulary-card vocabulary-card--methods"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="vocabulary-card__icon" data-v-72bc8b77${_scopeId}>⚗️</span><h3 class="vocabulary-card__name" data-v-72bc8b77${_scopeId}>${ssrInterpolate(unref(t)("herbal.methods"))}</h3><p class="vocabulary-card__count" data-v-72bc8b77${_scopeId}>${ssrInterpolate(unref(methodsCount))} ${ssrInterpolate(unref(t)("systems.items"))}</p><p class="vocabulary-card__desc" data-v-72bc8b77${_scopeId}>${ssrInterpolate(unref(t)("reference.methodsDesc"))}</p>`);
          } else {
            return [
              createVNode("span", { class: "vocabulary-card__icon" }, "⚗️"),
              createVNode("h3", { class: "vocabulary-card__name" }, toDisplayString(unref(t)("herbal.methods")), 1),
              createVNode("p", { class: "vocabulary-card__count" }, toDisplayString(unref(methodsCount)) + " " + toDisplayString(unref(t)("systems.items")), 1),
              createVNode("p", { class: "vocabulary-card__desc" }, toDisplayString(unref(t)("reference.methodsDesc")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="systems-about" data-v-72bc8b77><h2 data-v-72bc8b77>${ssrInterpolate(unref(t)("systems.aboutTitle"))}</h2><p data-v-72bc8b77>${ssrInterpolate(unref(t)("systems.aboutText"))}</p></section></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/SystemsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SystemsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-72bc8b77"]]);
export {
  SystemsView as default
};
