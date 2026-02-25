import { computed, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { b as usePreparationLocalizer, c as useSourcePlant } from "./useHerbData-DQ9hcdFH.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "SystemDetailView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const system = computed(() => route.params.system);
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const systemConfigs = {
      tcm: {
        icon: "☯️",
        name: "Traditional Chinese Medicine",
        nativeName: "中医 / 中醫",
        description: "Ancient medical system based on balance of Qi, Yin-Yang, and Five Elements theory",
        aboutText: "Traditional Chinese Medicine (TCM) is a comprehensive medical system that has been practiced for over 2,500 years. It emphasizes the balance of vital energy (Qi) and the harmony between Yin and Yang forces. TCM classifies medicinal preparations by their thermal nature, flavors, and the meridians they affect."
      },
      western: {
        icon: "🌿",
        name: "Western Herbalism",
        nativeName: "Western Herbal Medicine",
        description: "European and North American herbal traditions based on pharmacological actions",
        aboutText: "Western Herbalism encompasses the medicinal traditions of Europe and North America. It focuses on the pharmacological actions of herbs and their effects on specific body systems and organs. This system emphasizes scientific understanding of plant constituents and their therapeutic applications."
      },
      ayurveda: {
        icon: "🪷",
        name: "Ayurveda",
        nativeName: "आयुर्वेद / Ayurveda",
        description: "Ancient Indian medical system based on three doshas: Vata, Pitta, Kapha",
        aboutText: "Ayurveda is a 5,000-year-old system of natural healing from India. It is based on the concept of three doshas (Vata, Pitta, Kapha) that govern physiological activity. Ayurvedic medicine classifies herbs by their taste (rasa), qualities (guna), potency (virya), and post-digestive effect (vipaka)."
      },
      persian: {
        icon: "🌙",
        name: "Persian Medicine",
        nativeName: "طب یونانی / Unani Medicine",
        description: "Greco-Arabic medical tradition based on four humors and temperaments",
        aboutText: "Persian Medicine (also known as Unani Medicine) originated from ancient Greek medicine and was developed by Arab and Persian physicians. It is based on the theory of four humors and four temperaments (Hot, Cold, Wet, Dry). Treatments aim to restore balance through diet, lifestyle, and herbal remedies."
      },
      mongolian: {
        icon: "🏔️",
        name: "Mongolian Traditional Medicine",
        nativeName: "Монгол эмнэлэг / Traditional Tibetan Medicine",
        description: "Central Asian medical system integrating Tibetan and Mongolian traditions",
        aboutText: "Mongolian Traditional Medicine is a syncretic system combining Tibetan Buddhist medicine with indigenous Mongolian practices. It is based on the theory of three roots (Heyi, Xila, Badagan) similar to the Ayurvedic doshas. The system uses five elements and six tastes to classify medicinal substances."
      },
      modern: {
        icon: "💊",
        name: "Modern Medicine",
        nativeName: "Evidence-Based Nutrition & Pharmacology",
        description: "Contemporary nutritional and pharmaceutical substances supported by scientific research",
        aboutText: "Modern Medicine encompasses vitamins, minerals, amino acids, nutraceuticals, and other bioactive compounds backed by clinical research. This system provides evidence-based profiles including regulatory status, pharmacokinetics, and clinical applications for substances used in contemporary healthcare and supplementation."
      }
    };
    const systemInfo = computed(() => systemConfigs[system.value]);
    const stats = dataset.getSystemStats();
    const profileCount = computed(() => stats[system.value] || 0);
    const referenceCategories = computed(() => {
      const categories = [];
      if (system.value === "tcm") {
        categories.push({
          id: "natures",
          name: t("tcm.natures") || "Thermal Natures",
          items: dataset.getAllNatures().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        categories.push({
          id: "flavors",
          name: t("tcm.flavors") || "Flavors",
          items: dataset.getAllFlavors().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        categories.push({
          id: "meridians",
          name: t("tcm.meridians") || "Meridians",
          items: dataset.getAllMeridians().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        categories.push({
          id: "categories",
          name: t("tcm.categories") || "Categories",
          items: dataset.getAllCategories().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        const tcmActions = dataset.getAllTCMActions();
        if (tcmActions.length > 0) {
          categories.push({
            id: "tcm-actions",
            name: t("tcm.actions") || "TCM Actions",
            items: tcmActions.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
      } else if (system.value === "western") {
        categories.push({
          id: "actions",
          name: t("western.actions") || "Actions",
          items: dataset.getAllActions().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        categories.push({
          id: "organs",
          name: t("western.organs") || "Organ Affinities",
          items: dataset.getAllOrgans().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        const westernSystems = dataset.getAllWesternSystems();
        if (westernSystems.length > 0) {
          categories.push({
            id: "systems",
            name: t("western.systems") || "Body Systems",
            items: westernSystems.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
      } else if (system.value === "ayurveda") {
        categories.push({
          id: "rasa",
          name: t("ayurveda.rasas") || "Tastes (Rasa)",
          items: dataset.getAllRasas().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        categories.push({
          id: "guna",
          name: t("ayurveda.gunas") || "Qualities (Guna)",
          items: dataset.getAllGunas().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        categories.push({
          id: "virya",
          name: t("ayurveda.viryas") || "Potency (Virya)",
          items: dataset.getAllViryas().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        categories.push({
          id: "vipaka",
          name: t("ayurveda.vipakas") || "Post-digestive (Vipaka)",
          items: dataset.getAllVipakas().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        const doshas = dataset.getAllDoshas();
        if (doshas.length > 0) {
          categories.push({
            id: "doshas",
            name: t("ayurveda.doshas") || "Doshas",
            items: doshas.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
        const karmas = dataset.getAllKarmas();
        if (karmas.length > 0) {
          categories.push({
            id: "karmas",
            name: t("ayurveda.karmas") || "Karmas (Actions)",
            items: karmas.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
        const mahabhutas = dataset.getAllMahabhutas();
        if (mahabhutas.length > 0) {
          categories.push({
            id: "mahabhutas",
            name: t("ayurveda.mahabhutas") || "Mahabhutas (Elements)",
            items: mahabhutas.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
        const ayurvedaCategories = dataset.getAllAyurvedaCategories();
        if (ayurvedaCategories.length > 0) {
          categories.push({
            id: "ayurveda-categories",
            name: t("ayurveda.categories") || "Categories",
            items: ayurvedaCategories.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
        const prabhavas = dataset.getAllPrabhavas();
        if (prabhavas.length > 0) {
          categories.push({
            id: "prabhavas",
            name: t("ayurveda.prabhavas") || "Prabhavas (Special Effects)",
            items: prabhavas.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
      } else if (system.value === "persian") {
        categories.push({
          id: "temperaments",
          name: t("persian.temperaments") || "Temperaments",
          items: dataset.getAllTemperaments().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        const persianElements = dataset.getAllPersianElements();
        if (persianElements.length > 0) {
          categories.push({
            id: "persian-elements",
            name: t("persian.elements") || "Elements",
            items: persianElements.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
        const persianDegrees = dataset.getAllPersianDegrees();
        if (persianDegrees.length > 0) {
          categories.push({
            id: "degrees",
            name: t("persian.degrees") || "Degrees",
            items: persianDegrees.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
      } else if (system.value === "mongolian") {
        categories.push({
          id: "elements",
          name: t("mongolian.elements") || "Elements",
          items: dataset.getAllMongolianElements().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        categories.push({
          id: "tastes",
          name: t("mongolian.tastes") || "Tastes",
          items: dataset.getAllMongolianTastes().map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
        const mongolianRoots = dataset.getAllMongolianRoots();
        if (mongolianRoots.length > 0) {
          categories.push({
            id: "roots",
            name: t("mongolian.roots") || "Three Roots",
            items: mongolianRoots.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
        const mongolianPotencies = dataset.getAllMongolianPotencies();
        if (mongolianPotencies.length > 0) {
          categories.push({
            id: "potencies",
            name: t("mongolian.potencies") || "Potencies",
            items: mongolianPotencies.map((item) => {
              var _a, _b;
              return {
                id: item["@id"],
                label: ((_a = item.prefLabel) == null ? void 0 : _a[locale.value]) || ((_b = item.prefLabel) == null ? void 0 : _b.en) || extractLabel(item["@id"])
              };
            })
          });
        }
      } else if (system.value === "modern") {
        categories.push({
          id: "substances",
          name: t("modern.substances") || "Substances",
          items: Array.from(dataset.getAllModernProfiles().values()).map((item) => {
            var _a, _b;
            return {
              id: item["@id"],
              label: ((_a = item.name) == null ? void 0 : _a[locale.value]) || ((_b = item.name) == null ? void 0 : _b.en) || extractLabel(item["@id"])
            };
          })
        });
      }
      return categories;
    });
    const referenceDataCount = computed(() => {
      return referenceCategories.value.reduce((sum, cat) => sum + cat.items.length, 0);
    });
    const preparations = computed(() => {
      const allPreps = dataset.getAllPreparations();
      if (system.value === "tcm") {
        return allPreps.filter((p) => p.hasTCMProfile);
      } else if (system.value === "western") {
        return allPreps.filter((p) => p.hasWesternProfile);
      } else if (system.value === "ayurveda") {
        return allPreps.filter((p) => p.hasAyurvedaProfile);
      } else if (system.value === "persian") {
        return allPreps.filter((p) => p.hasPersianProfile);
      } else if (system.value === "mongolian") {
        return allPreps.filter((p) => p.hasMongolianProfile);
      }
      return [];
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
    function getScientificName(prep) {
      var _a;
      const s = getSlug(prep);
      const plant = useSourcePlant(s);
      return ((_a = plant.value) == null ? void 0 : _a.scientificName) || null;
    }
    function getImage(prep) {
      var _a;
      const s = getSlug(prep);
      const plant = useSourcePlant(s);
      return ((_a = plant.value) == null ? void 0 : _a.image) || null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "system-detail-view" }, _attrs))} data-v-b353a7d8><div class="container" data-v-b353a7d8><nav class="breadcrumbs" data-v-b353a7d8>`);
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
      _push(`<span data-v-b353a7d8>/</span><span data-v-b353a7d8>${ssrInterpolate((_a = systemInfo.value) == null ? void 0 : _a.name)}</span></nav>`);
      if (systemInfo.value) {
        _push(`<div data-v-b353a7d8><header class="${ssrRenderClass([`system-hero--${system.value}`, "system-hero"])}" data-v-b353a7d8><span class="system-hero__icon" data-v-b353a7d8>${ssrInterpolate(systemInfo.value.icon)}</span><h1 class="system-hero__title" data-v-b353a7d8>${ssrInterpolate(systemInfo.value.name)}</h1><p class="system-hero__native" data-v-b353a7d8>${ssrInterpolate(systemInfo.value.nativeName)}</p><p class="system-hero__description" data-v-b353a7d8>${ssrInterpolate(systemInfo.value.description)}</p></header><section class="system-stats" data-v-b353a7d8><div class="system-stat" data-v-b353a7d8><span class="system-stat__value" data-v-b353a7d8>${ssrInterpolate(profileCount.value)}</span><span class="system-stat__label" data-v-b353a7d8>${ssrInterpolate(unref(t)("systems.preparations"))}</span></div><div class="system-stat" data-v-b353a7d8><span class="system-stat__value" data-v-b353a7d8>${ssrInterpolate(referenceDataCount.value)}</span><span class="system-stat__label" data-v-b353a7d8>${ssrInterpolate(unref(t)("systems.referenceData"))}</span></div></section><section class="system-section" data-v-b353a7d8><h2 class="section-title" data-v-b353a7d8>${ssrInterpolate(unref(t)("systems.referenceData"))} `);
        if (referenceCategories.value.length > 0) {
          _push(ssrRenderComponent(_component_router_link, {
            to: localePath(`/systems/${system.value}/natures`),
            class: "section-title__link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("systems.viewAll"))} → `);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("systems.viewAll")) + " → ", 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</h2><div class="reference-categories" data-v-b353a7d8><!--[-->`);
        ssrRenderList(referenceCategories.value, (category) => {
          _push(ssrRenderComponent(_component_router_link, {
            key: category.id,
            to: localePath(`/systems/${system.value}/${category.id}`),
            class: "reference-category"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<h3 class="reference-category__name" data-v-b353a7d8${_scopeId}>${ssrInterpolate(category.name)}</h3><p class="reference-category__count" data-v-b353a7d8${_scopeId}>${ssrInterpolate(category.items.length)} ${ssrInterpolate(unref(t)("systems.items"))}</p><div class="reference-category__items" data-v-b353a7d8${_scopeId}><!--[-->`);
                ssrRenderList(category.items.slice(0, 6), (item) => {
                  _push2(`<span class="${ssrRenderClass([`reference-tag--${system.value}`, "reference-tag"])}" data-v-b353a7d8${_scopeId}>${ssrInterpolate(item.label)}</span>`);
                });
                _push2(`<!--]-->`);
                if (category.items.length > 6) {
                  _push2(`<span class="reference-tag reference-tag--more" data-v-b353a7d8${_scopeId}> +${ssrInterpolate(category.items.length - 6)} more </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  createVNode("h3", { class: "reference-category__name" }, toDisplayString(category.name), 1),
                  createVNode("p", { class: "reference-category__count" }, toDisplayString(category.items.length) + " " + toDisplayString(unref(t)("systems.items")), 1),
                  createVNode("div", { class: "reference-category__items" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(category.items.slice(0, 6), (item) => {
                      return openBlock(), createBlock("span", {
                        key: item.id,
                        class: ["reference-tag", `reference-tag--${system.value}`]
                      }, toDisplayString(item.label), 3);
                    }), 128)),
                    category.items.length > 6 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "reference-tag reference-tag--more"
                    }, " +" + toDisplayString(category.items.length - 6) + " more ", 1)) : createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section><section class="system-section" data-v-b353a7d8><h2 class="section-title" data-v-b353a7d8>${ssrInterpolate(unref(t)("systems.preparationsWithProfile"))}</h2>`);
        if (preparations.value.length > 0) {
          _push(`<div class="preparations-grid" data-v-b353a7d8><!--[-->`);
          ssrRenderList(preparations.value.slice(0, 12), (prep) => {
            _push(ssrRenderComponent(_component_router_link, {
              key: getSlug(prep),
              to: localePath(`/preparations/${getSlug(prep)}`),
              class: "preparation-card"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="preparation-card__image-wrapper" data-v-b353a7d8${_scopeId}>`);
                  if (getImage(prep)) {
                    _push2(`<img${ssrRenderAttr("src", getImage(prep))}${ssrRenderAttr("alt", getPrepName(prep))} class="preparation-card__image" data-v-b353a7d8${_scopeId}>`);
                  } else {
                    _push2(`<div class="preparation-card__placeholder" data-v-b353a7d8${_scopeId}><span data-v-b353a7d8${_scopeId}>🌿</span></div>`);
                  }
                  _push2(`</div><div class="preparation-card__content" data-v-b353a7d8${_scopeId}><h4 class="preparation-card__name" data-v-b353a7d8${_scopeId}>${ssrInterpolate(getPrepName(prep))}</h4>`);
                  if (getScientificName(prep)) {
                    _push2(`<p class="preparation-card__scientific" data-v-b353a7d8${_scopeId}>${ssrInterpolate(getScientificName(prep))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "preparation-card__image-wrapper" }, [
                      getImage(prep) ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: getImage(prep),
                        alt: getPrepName(prep),
                        class: "preparation-card__image"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "preparation-card__placeholder"
                      }, [
                        createVNode("span", null, "🌿")
                      ]))
                    ]),
                    createVNode("div", { class: "preparation-card__content" }, [
                      createVNode("h4", { class: "preparation-card__name" }, toDisplayString(getPrepName(prep)), 1),
                      getScientificName(prep) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "preparation-card__scientific"
                      }, toDisplayString(getScientificName(prep)), 1)) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="preparations-empty" data-v-b353a7d8><p data-v-b353a7d8>${ssrInterpolate(unref(t)("systems.noPreparations"))}</p></div>`);
        }
        if (preparations.value.length > 12) {
          _push(`<div class="preparations-more" data-v-b353a7d8><p data-v-b353a7d8>${ssrInterpolate(unref(t)("systems.andMore", { count: preparations.value.length - 12 }))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section><section class="system-section system-section--about" data-v-b353a7d8><h2 class="section-title" data-v-b353a7d8>${ssrInterpolate(unref(t)("systems.aboutSystem"))}</h2><p data-v-b353a7d8>${ssrInterpolate(systemInfo.value.aboutText)}</p></section></div>`);
      } else {
        _push(`<div class="system-not-found" data-v-b353a7d8><h1 data-v-b353a7d8>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-b353a7d8>${ssrInterpolate(unref(t)("systems.systemNotFound"))}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/SystemDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SystemDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b353a7d8"]]);
export {
  SystemDetailView as default
};
