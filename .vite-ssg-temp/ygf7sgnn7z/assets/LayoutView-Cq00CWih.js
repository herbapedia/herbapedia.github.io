import { computed, mergeProps, unref, useSSRContext, ref, onMounted, onUnmounted, resolveComponent, withCtx, createVNode, createTextVNode, toDisplayString, watch } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrRenderStyle, ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, S as SUPPORTED_LOCALES, L as LOCALE_NAMES, D as DEFAULT_LOCALE } from "../main.mjs";
import { u as useAllPreparations, b as usePreparationLocalizer, c as useSourcePlant } from "./useHerbData-DQ9hcdFH.js";
import "@unhead/vue/server";
import "./dataset-CMjUf6f2.js";
const _sfc_main$4 = {
  __name: "LanguageSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    useRouter();
    useRoute();
    const supportedLocales = SUPPORTED_LOCALES;
    const currentLocale = computed(() => locale.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "language-switcher" }, _attrs))} data-v-204e6e14><select${ssrRenderAttr("value", currentLocale.value)} class="language-switcher__select"${ssrRenderAttr("aria-label", unref(t)("language.select"))} data-v-204e6e14><!--[-->`);
      ssrRenderList(unref(supportedLocales), (locale2) => {
        _push(`<option${ssrRenderAttr("value", locale2)} data-v-204e6e14>${ssrInterpolate(unref(LOCALE_NAMES)[locale2])}</option>`);
      });
      _push(`<!--]--></select></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/LanguageSwitcher.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const LanguageSwitcher = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-204e6e14"]]);
const _sfc_main$3 = {
  __name: "SearchBox",
  __ssrInlineRender: true,
  props: {
    placeholder: {
      type: String,
      default: "Search preparations..."
    }
  },
  emits: ["search", "select"],
  setup(__props, { emit: __emit }) {
    const { locale } = useI18n();
    useRouter();
    const searchQuery = ref("");
    const showDropdown = ref(false);
    const activeIndex = ref(-1);
    const searchContainer = ref(null);
    ref(null);
    ref(null);
    const dropdownStyle = ref({});
    const allPreparations = useAllPreparations();
    const localizer = usePreparationLocalizer();
    const searchIndex = computed(() => {
      return allPreparations.value.map((prep) => {
        var _a, _b, _c;
        const slug = extractSlug(prep);
        const plant = useSourcePlant(slug);
        return {
          slug,
          title: localizer.getName(prep) || slug,
          scientificName: ((_a = plant.value) == null ? void 0 : _a.scientificName) || "",
          image: prep.image || ((_b = plant.value) == null ? void 0 : _b.image) || null,
          hasTCM: !!prep.hasTCMProfile,
          hasWestern: !!prep.hasWesternProfile,
          hasAyurveda: !!prep.hasAyurvedaProfile,
          searchText: `${localizer.getName(prep) || ""} ${((_c = plant.value) == null ? void 0 : _c.scientificName) || ""} ${slug.replace(/-/g, " ")}`.toLowerCase()
        };
      });
    });
    const filteredResults = computed(() => {
      if (!searchQuery.value.trim()) return [];
      const query = searchQuery.value.toLowerCase().trim();
      const terms = query.split(/\s+/);
      return searchIndex.value.filter((item) => {
        const text = item.searchText;
        return terms.every((term) => text.includes(term));
      }).slice(0, 10);
    });
    function extractSlug(prep) {
      if (!(prep == null ? void 0 : prep["@id"])) return "";
      const parts = prep["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function highlightMatch(text) {
      if (!searchQuery.value.trim()) return text;
      const query = searchQuery.value.trim();
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      return text.replace(regex, "<mark>$1</mark>");
    }
    function updateDropdownPosition() {
      if (!searchContainer.value) return;
      const rect = searchContainer.value.getBoundingClientRect();
      dropdownStyle.value = {
        position: "fixed",
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 1e3
      };
    }
    function closeDropdown() {
      showDropdown.value = false;
      activeIndex.value = -1;
    }
    function handleClickOutside(event) {
      if (searchContainer.value && !searchContainer.value.contains(event.target)) {
        closeDropdown();
      }
    }
    function handleScroll() {
      if (showDropdown.value) {
        updateDropdownPosition();
      }
    }
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updateDropdownPosition);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateDropdownPosition);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "search-container",
        ref_key: "searchContainer",
        ref: searchContainer
      }, _attrs))} data-v-57273a80><div class="search-input-wrapper" data-v-57273a80><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-57273a80><circle cx="11" cy="11" r="8" data-v-57273a80></circle><path d="m21 21-4.35-4.35" data-v-57273a80></path></svg><input${ssrRenderAttr("value", searchQuery.value)} type="text" class="search-input"${ssrRenderAttr("placeholder", __props.placeholder)} aria-label="Search preparations" autocomplete="off" data-v-57273a80>`);
      if (searchQuery.value) {
        _push(`<button class="search-clear" aria-label="Clear search" data-v-57273a80><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-57273a80><path d="M18 6L6 18M6 6l12 12" data-v-57273a80></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showDropdown.value && filteredResults.value.length > 0) {
          _push2(`<div class="search-dropdown" style="${ssrRenderStyle(dropdownStyle.value)}" data-v-57273a80><ul class="search-results" role="listbox" data-v-57273a80><!--[-->`);
          ssrRenderList(filteredResults.value, (result, index) => {
            _push2(`<li class="${ssrRenderClass([{ "search-result-item--active": index === activeIndex.value }, "search-result-item"])}" role="option"${ssrRenderAttr("aria-selected", index === activeIndex.value)} data-v-57273a80>`);
            if (result.image) {
              _push2(`<img${ssrRenderAttr("src", result.image)}${ssrRenderAttr("alt", result.title)} class="search-result-image" data-v-57273a80>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="search-result-content" data-v-57273a80><span class="search-result-title" data-v-57273a80>${highlightMatch(result.title) ?? ""}</span>`);
            if (result.scientificName) {
              _push2(`<span class="search-result-scientific" data-v-57273a80>${ssrInterpolate(result.scientificName)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="search-result-badges" data-v-57273a80>`);
            if (result.hasTCM) {
              _push2(`<span class="search-result-badge search-result-badge--tcm" data-v-57273a80>TCM</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (result.hasWestern) {
              _push2(`<span class="search-result-badge search-result-badge--western" data-v-57273a80>W</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></li>`);
          });
          _push2(`<!--]--></ul></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/SearchBox.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SearchBox = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-57273a80"]]);
const _sfc_main$2 = {
  __name: "TheHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    useRoute();
    const mobileMenuOpen = ref(false);
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
    };
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-fc3d884b><div class="container header__container" data-v-fc3d884b>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/"),
        class: "header__logo"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="header__logo-text" data-v-fc3d884b${_scopeId}>Herbapedia</span><span class="header__logo-tagline" data-v-fc3d884b${_scopeId}>SIPM</span>`);
          } else {
            return [
              createVNode("span", { class: "header__logo-text" }, "Herbapedia"),
              createVNode("span", { class: "header__logo-tagline" }, "SIPM")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="header__search" data-v-fc3d884b>`);
      _push(ssrRenderComponent(SearchBox, null, null, _parent));
      _push(`</div><nav class="${ssrRenderClass([{ "header__nav--open": mobileMenuOpen.value }, "header__nav"])}" data-v-fc3d884b>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/"),
        class: "header__link",
        onClick: closeMobileMenu
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
      _push(`<span class="header__divider" data-v-fc3d884b></span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/preparations"),
        class: "header__link",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.preparations"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.preparations")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/sources"),
        class: "header__link",
        onClick: closeMobileMenu
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
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/systems"),
        class: "header__link",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.systems"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.systems")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="header__divider" data-v-fc3d884b></span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/about"),
        class: "header__link",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.about"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.about")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="https://www.sipm.org/" class="header__link header__link--external" data-v-fc3d884b>SIPM</a></nav><div class="header__actions" data-v-fc3d884b>`);
      _push(ssrRenderComponent(LanguageSwitcher, null, null, _parent));
      _push(`<button class="header__menu-toggle" aria-label="Toggle menu" data-v-fc3d884b><span data-v-fc3d884b></span><span data-v-fc3d884b></span><span data-v-fc3d884b></span></button></div></div></header>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/layout/TheHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TheHeader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-fc3d884b"]]);
const _sfc_main$1 = {
  __name: "TheFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-38622593><div class="container footer__container" data-v-38622593><div class="footer__info" data-v-38622593><p class="footer__copyright" data-v-38622593> © ${ssrInterpolate(unref(currentYear))} International Society of Phytomedicine (SIPM) </p><p class="footer__disclaimer" data-v-38622593>${ssrInterpolate(unref(t)("disclaimer.text"))}</p></div><nav class="footer__nav" data-v-38622593>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/about"),
        class: "footer__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.about"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.about")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="https://www.sipm.org/standards/" class="footer__link" data-v-38622593>${ssrInterpolate(unref(t)("nav.standards"))}</a><a href="https://www.sipm.org/" class="footer__link" data-v-38622593>${ssrInterpolate(unref(t)("nav.sipmHome"))}</a></nav></div></footer>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/layout/TheFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TheFooter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-38622593"]]);
const _sfc_main = {
  __name: "LayoutView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { locale } = useI18n();
    watch(
      () => {
        var _a;
        return (_a = route.meta) == null ? void 0 : _a.locale;
      },
      (newLocale) => {
        if (newLocale && locale.value !== newLocale) {
          locale.value = newLocale;
        }
      },
      { immediate: true }
    );
    onMounted(() => {
      var _a;
      if ((_a = route.meta) == null ? void 0 : _a.locale) {
        locale.value = route.meta.locale;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout" }, _attrs))} data-v-35451b40>`);
      _push(ssrRenderComponent(TheHeader, null, null, _parent));
      _push(`<main class="layout__main" data-v-35451b40>`);
      _push(ssrRenderComponent(_component_router_view, {
        key: _ctx.$route.fullPath
      }, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(TheFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/LayoutView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LayoutView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-35451b40"]]);
export {
  LayoutView as default
};
