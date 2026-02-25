import { computed, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, withModifiers, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { b as usePreparationLocalizer } from "./useHerbData-DQ9hcdFH.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "ReferenceDataView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const { t, locale } = useI18n();
    const system = computed(() => route.params.system);
    const refType = computed(() => route.params.refType);
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
      },
      herbal: {
        icon: "💊",
        nameKey: "herbal.title"
      }
    };
    const systemInfo = computed(() => {
      const config = systemConfigs[system.value];
      if (!config) return null;
      return {
        icon: config.icon,
        name: t(config.nameKey)
      };
    });
    const referenceTypes = {
      // TCM
      natures: {
        name: t("tcm.natures") || "Thermal Natures",
        description: t("reference.naturesDesc") || "Classification of herbs by their thermal effect on the body",
        getItems: () => dataset.getAllNatures(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasNature)) return null;
          const nature = profile.hasNature["@id"] || profile.hasNature;
          return nature;
        }
      },
      flavors: {
        name: t("tcm.flavors") || "Flavors",
        description: t("reference.flavorsDesc") || "The five flavors and their corresponding organ relationships",
        getItems: () => dataset.getAllFlavors(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasFlavor)) return [];
          return profile.hasFlavor.map((f) => f["@id"] || f);
        }
      },
      meridians: {
        name: t("tcm.meridians") || "Meridians",
        description: t("reference.meridiansDesc") || "The energy channels that herbs are believed to influence",
        getItems: () => dataset.getAllMeridians(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.entersMeridian)) return [];
          return profile.entersMeridian.map((m) => m["@id"] || m);
        }
      },
      categories: {
        name: t("tcm.categories") || "Categories",
        description: t("reference.categoriesDesc") || "Functional categories of TCM herbs",
        getItems: () => dataset.getAllCategories(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasCategory)) return null;
          const cat = profile.hasCategory["@id"] || profile.hasCategory;
          return cat;
        }
      },
      "tcm-actions": {
        name: t("tcm.actions") || "TCM Actions",
        description: t("reference.tcmActionsDesc") || "Therapeutic actions in Traditional Chinese Medicine",
        getItems: () => dataset.getAllTCMActions(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.actions)) return [];
          return profile.actions.map((a) => a["@id"] || a);
        }
      },
      // Western
      actions: {
        name: t("western.actions") || "Actions",
        description: t("reference.actionsDesc") || "Pharmacological actions of herbal preparations",
        getItems: () => dataset.getAllActions(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasAction)) return [];
          return profile.hasAction.map((a) => a["@id"] || a);
        }
      },
      organs: {
        name: t("western.organs") || "Organ Affinities",
        description: t("reference.organsDesc") || "Body organs and systems that herbs primarily affect",
        getItems: () => dataset.getAllOrgans(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasOrganAffinity)) return [];
          return profile.hasOrganAffinity.map((o) => o["@id"] || o);
        }
      },
      systems: {
        name: t("western.systems") || "Body Systems",
        description: t("reference.systemsDesc") || "Body systems that herbs affect",
        getItems: () => dataset.getAllWesternSystems(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasSystemAffinity)) return [];
          return profile.hasSystemAffinity.map((s) => s["@id"] || s);
        }
      },
      // Ayurveda
      rasa: {
        name: t("ayurveda.rasas") || "Tastes (Rasa)",
        description: t("reference.rasaDesc") || "Six tastes in Ayurveda",
        getItems: () => dataset.getAllRasas(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasRasa)) return [];
          return profile.hasRasa.map((r) => r["@id"] || r);
        }
      },
      guna: {
        name: t("ayurveda.gunas") || "Qualities (Guna)",
        description: t("reference.gunaDesc") || "Twenty qualities of substances",
        getItems: () => dataset.getAllGunas(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasGuna)) return [];
          return profile.hasGuna.map((g) => g["@id"] || g);
        }
      },
      virya: {
        name: t("ayurveda.viryas") || "Potency (Virya)",
        description: t("reference.viryaDesc") || "Heating or cooling potency",
        getItems: () => dataset.getAllViryas(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasVirya)) return null;
          const virya = profile.hasVirya["@id"] || profile.hasVirya;
          return virya;
        }
      },
      vipaka: {
        name: t("ayurveda.vipakas") || "Post-digestive (Vipaka)",
        description: t("reference.vipakaDesc") || "Post-digestive effect",
        getItems: () => dataset.getAllVipakas(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasVipaka)) return null;
          const vipaka = profile.hasVipaka["@id"] || profile.hasVipaka;
          return vipaka;
        }
      },
      doshas: {
        name: t("ayurveda.doshas") || "Doshas",
        description: t("reference.doshasDesc") || "Three constitutional types in Ayurveda",
        getItems: () => dataset.getAllDoshas(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.affectsDosha)) return [];
          const doshas = [];
          if (profile.affectsDosha.vata) doshas.push("vata");
          if (profile.affectsDosha.pitta) doshas.push("pitta");
          if (profile.affectsDosha.kapha) doshas.push("kapha");
          return doshas;
        }
      },
      karmas: {
        name: t("ayurveda.karmas") || "Karmas (Actions)",
        description: t("reference.karmasDesc") || "Therapeutic actions in Ayurveda",
        getItems: () => dataset.getAllKarmas(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.karma)) return [];
          return profile.karma.map((k) => k["@id"] || k);
        }
      },
      mahabhutas: {
        name: t("ayurveda.mahabhutas") || "Mahabhutas (Elements)",
        description: t("reference.mahabhutasDesc") || "Five great elements in Ayurveda",
        getItems: () => dataset.getAllMahabhutas(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasMahabhuta)) return [];
          return profile.hasMahabhuta.map((m) => m["@id"] || m);
        }
      },
      "ayurveda-categories": {
        name: t("ayurveda.categories") || "Categories",
        description: t("reference.ayurvedaCategoriesDesc") || "Classification categories for Ayurvedic herbs based on therapeutic actions",
        getItems: () => dataset.getAllAyurvedaCategories(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.ayurvedaCategory)) return null;
          const cat = profile.ayurvedaCategory["@id"] || profile.ayurvedaCategory;
          return cat;
        }
      },
      prabhavas: {
        name: t("ayurveda.prabhavas") || "Prabhavas (Special Effects)",
        description: t("reference.prabhavasDesc") || "Unique special effects of herbs that cannot be predicted from other properties",
        getItems: () => dataset.getAllPrabhavas(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasPrabhava)) return [];
          return profile.hasPrabhava.map((p) => p["@id"] || p);
        }
      },
      // Persian
      temperaments: {
        name: t("persian.temperaments") || "Temperaments",
        description: t("reference.temperamentsDesc") || "Four temperaments in Unani medicine",
        getItems: () => dataset.getAllTemperaments(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasTemperament)) return null;
          const temp = profile.hasTemperament["@id"] || profile.hasTemperament;
          return temp;
        }
      },
      "persian-elements": {
        name: t("persian.elements") || "Elements",
        description: t("reference.persianElementsDesc") || "Four elements in Persian medicine",
        getItems: () => dataset.getAllPersianElements(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasElement)) return [];
          return profile.hasElement.map((e) => e["@id"] || e);
        }
      },
      degrees: {
        name: t("persian.degrees") || "Degrees",
        description: t("reference.degreesDesc") || "Intensity degrees in Persian medicine",
        getItems: () => dataset.getAllPersianDegrees(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.temperamentDegree)) return null;
          return profile.temperamentDegree;
        }
      },
      // Mongolian
      elements: {
        name: t("mongolian.elements") || "Elements",
        description: t("reference.elementsDesc") || "Five elements in Mongolian medicine",
        getItems: () => dataset.getAllMongolianElements(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasElement)) return [];
          return profile.hasElement.map((e) => e["@id"] || e);
        }
      },
      tastes: {
        name: t("mongolian.tastes") || "Tastes",
        description: t("reference.tastesDesc") || "Six tastes in Mongolian medicine",
        getItems: () => dataset.getAllMongolianTastes(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasTaste)) return [];
          return profile.hasTaste.map((t2) => t2["@id"] || t2);
        }
      },
      roots: {
        name: t("mongolian.roots") || "Three Roots",
        description: t("reference.rootsDesc") || "Three root energies in Mongolian medicine",
        getItems: () => dataset.getAllMongolianRoots(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.affectsRoots)) return [];
          const roots = [];
          if (profile.affectsRoots.heyi) roots.push("heyi");
          if (profile.affectsRoots.xila) roots.push("xila");
          if (profile.affectsRoots.badagan) roots.push("badagan");
          return roots;
        }
      },
      potencies: {
        name: t("mongolian.potencies") || "Potencies",
        description: t("reference.potenciesDesc") || "Therapeutic potencies in Mongolian medicine",
        getItems: () => dataset.getAllMongolianPotencies(),
        getValue: (profile) => {
          if (!(profile == null ? void 0 : profile.hasPotency)) return [];
          return profile.hasPotency.map((p) => p["@id"] || p);
        }
      },
      // Herbal vocabulary (general)
      forms: {
        name: t("herbal.forms") || "Preparation Forms",
        description: t("reference.formsDesc") || "Physical forms of herbal preparations",
        getItems: () => dataset.getAllHerbalForms(),
        getValue: (prep) => {
          if (!(prep == null ? void 0 : prep.form)) return null;
          return prep.form["@id"] || prep.form;
        }
      },
      methods: {
        name: t("herbal.methods") || "Preparation Methods",
        description: t("reference.methodsDesc") || "Methods of preparing herbal materials",
        getItems: () => dataset.getAllHerbalMethods(),
        getValue: (prep) => {
          if (!(prep == null ? void 0 : prep.preparationMethod)) return null;
          return prep.preparationMethod["@id"] || prep.preparationMethod;
        }
      }
    };
    const referenceInfo = computed(() => referenceTypes[refType.value]);
    const referenceItems = computed(() => {
      if (!referenceInfo.value) return [];
      const items = referenceInfo.value.getItems();
      const allPreps = dataset.getAllPreparations();
      return items.map((item) => {
        var _a, _b;
        const itemId = item["@id"];
        const slug = itemId.split("/").pop();
        const label = ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(itemId);
        const translations = {};
        if (item.prefLabel) {
          Object.entries(item.prefLabel).forEach(([lang, value]) => {
            if (lang !== locale.value && lang !== "en") {
              translations[lang] = value;
            }
          });
        }
        const preparations = [];
        if (system.value === "herbal") {
          allPreps.forEach((prep) => {
            const value = referenceInfo.value.getValue(prep);
            if (!value) return;
            const values = Array.isArray(value) ? value : [value];
            if (values.some((v) => v === itemId || (v == null ? void 0 : v.includes(itemId.split("/").pop())))) {
              preparations.push(prep);
            }
          });
          return { id: itemId, slug, label, translations, preparations };
        }
        let profileCache;
        if (system.value === "tcm") profileCache = dataset.getAllTCMProfiles();
        else if (system.value === "western") profileCache = dataset.getAllWesternProfiles();
        else if (system.value === "ayurveda") profileCache = dataset.getAllAyurvedaProfiles();
        else if (system.value === "persian") profileCache = dataset.getAllPersianProfiles();
        else if (system.value === "mongolian") profileCache = dataset.getAllMongolianProfiles();
        if (!profileCache) return { id: itemId, slug, label, translations, preparations: [] };
        allPreps.forEach((prep) => {
          let profileRef;
          if (system.value === "tcm") profileRef = prep.hasTCMProfile;
          else if (system.value === "western") profileRef = prep.hasWesternProfile;
          else if (system.value === "ayurveda") profileRef = prep.hasAyurvedaProfile;
          else if (system.value === "persian") profileRef = prep.hasPersianProfile;
          else if (system.value === "mongolian") profileRef = prep.hasMongolianProfile;
          if (!profileRef) return;
          const profileRefs = Array.isArray(profileRef) ? profileRef : [profileRef];
          for (const ref of profileRefs) {
            const profileId = ref["@id"] || ref;
            const profileSlug = profileId.split("/").pop();
            const profile = profileCache.get(profileSlug);
            if (!profile) continue;
            const value = referenceInfo.value.getValue(profile);
            if (!value) continue;
            const values = Array.isArray(value) ? value : [value];
            if (values.some((v) => v === itemId || (v == null ? void 0 : v.includes(itemId.split("/").pop())))) {
              preparations.push(prep);
              break;
            }
          }
        });
        return { id: itemId, slug, label, translations, preparations };
      });
    });
    function extractLabel(iri) {
      if (!iri) return "";
      const parts = iri.split("/");
      return parts[parts.length - 1] || iri;
    }
    function getSlug(prep) {
      if (!(prep == null ? void 0 : prep["@id"])) return "";
      const parts = prep["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    const localizer = usePreparationLocalizer();
    function getPrepName(prep) {
      return localizer.getName(prep) || getSlug(prep);
    }
    function goToPrep(prep) {
      router.push(localePath(`/preparations/${getSlug(prep)}`));
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "reference-view" }, _attrs))} data-v-29544477><div class="container" data-v-29544477><nav class="breadcrumbs" data-v-29544477>`);
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
      _push(`<span data-v-29544477>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath(`/systems/${system.value}`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`${ssrInterpolate((_a2 = systemInfo.value) == null ? void 0 : _a2.name)}`);
          } else {
            return [
              createTextVNode(toDisplayString((_b2 = systemInfo.value) == null ? void 0 : _b2.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-29544477>/</span><span data-v-29544477>${ssrInterpolate((_a = referenceInfo.value) == null ? void 0 : _a.name)}</span></nav>`);
      if (referenceInfo.value) {
        _push(`<div data-v-29544477><header class="${ssrRenderClass([`reference-hero--${system.value}`, "reference-hero"])}" data-v-29544477><span class="reference-hero__icon" data-v-29544477>${ssrInterpolate((_b = systemInfo.value) == null ? void 0 : _b.icon)}</span><h1 class="reference-hero__title" data-v-29544477>${ssrInterpolate(referenceInfo.value.name)}</h1><p class="reference-hero__description" data-v-29544477>${ssrInterpolate(referenceInfo.value.description)}</p></header><section class="reference-section" data-v-29544477><div class="reference-items" data-v-29544477><!--[-->`);
        ssrRenderList(referenceItems.value, (item) => {
          _push(ssrRenderComponent(_component_router_link, {
            key: item.id,
            to: localePath(`/systems/${system.value}/${refType.value}/${item.slug}`),
            class: "reference-item"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="reference-item__header" data-v-29544477${_scopeId}><h3 class="reference-item__label" data-v-29544477${_scopeId}>${ssrInterpolate(item.label)}</h3><span class="reference-item__count" data-v-29544477${_scopeId}>${ssrInterpolate(item.preparations.length)} ${ssrInterpolate(unref(t)("reference.preparations"))}</span></div>`);
                if (Object.keys(item.translations).length > 0) {
                  _push2(`<div class="reference-item__translations" data-v-29544477${_scopeId}><!--[-->`);
                  ssrRenderList(item.translations, (value, lang) => {
                    _push2(`<span class="translation-tag" data-v-29544477${_scopeId}>${ssrInterpolate(lang)}: ${ssrInterpolate(value)}</span>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (item.preparations.length > 0) {
                  _push2(`<div class="reference-item__preparations" data-v-29544477${_scopeId}><!--[-->`);
                  ssrRenderList(item.preparations.slice(0, 5), (prep) => {
                    _push2(`<span class="${ssrRenderClass([`prep-chip--${system.value}`, "prep-chip"])}" data-v-29544477${_scopeId}>${ssrInterpolate(getPrepName(prep))}</span>`);
                  });
                  _push2(`<!--]-->`);
                  if (item.preparations.length > 5) {
                    _push2(`<span class="prep-chip prep-chip--more" data-v-29544477${_scopeId}> +${ssrInterpolate(item.preparations.length - 5)} more </span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<div class="reference-item__empty" data-v-29544477${_scopeId}><p data-v-29544477${_scopeId}>${ssrInterpolate(unref(t)("reference.noPreparations"))}</p></div>`);
                }
              } else {
                return [
                  createVNode("div", { class: "reference-item__header" }, [
                    createVNode("h3", { class: "reference-item__label" }, toDisplayString(item.label), 1),
                    createVNode("span", { class: "reference-item__count" }, toDisplayString(item.preparations.length) + " " + toDisplayString(unref(t)("reference.preparations")), 1)
                  ]),
                  Object.keys(item.translations).length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "reference-item__translations"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(item.translations, (value, lang) => {
                      return openBlock(), createBlock("span", {
                        key: lang,
                        class: "translation-tag"
                      }, toDisplayString(lang) + ": " + toDisplayString(value), 1);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  item.preparations.length > 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "reference-item__preparations"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(item.preparations.slice(0, 5), (prep) => {
                      return openBlock(), createBlock("span", {
                        key: getSlug(prep),
                        class: ["prep-chip", `prep-chip--${system.value}`],
                        onClick: withModifiers(($event) => goToPrep(prep), ["stop", "prevent"])
                      }, toDisplayString(getPrepName(prep)), 11, ["onClick"]);
                    }), 128)),
                    item.preparations.length > 5 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "prep-chip prep-chip--more"
                    }, " +" + toDisplayString(item.preparations.length - 5) + " more ", 1)) : createCommentVNode("", true)
                  ])) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "reference-item__empty"
                  }, [
                    createVNode("p", null, toDisplayString(unref(t)("reference.noPreparations")), 1)
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
        if (referenceItems.value.length === 0) {
          _push(`<div class="reference-empty" data-v-29544477><p data-v-29544477>${ssrInterpolate(unref(t)("reference.noItems"))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section></div>`);
      } else {
        _push(`<div class="reference-not-found" data-v-29544477><h1 data-v-29544477>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-29544477>${ssrInterpolate(unref(t)("reference.notFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath("/systems"),
          class: "back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("systems.backToSystems"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("systems.backToSystems")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ReferenceDataView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReferenceDataView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-29544477"]]);
export {
  ReferenceDataView as default
};
