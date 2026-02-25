import { computed, ref, watch, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "ChemicalCompoundDetailView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const slug = computed(() => route.params.slug);
    const compound = ref(null);
    const plants = ref([]);
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const compoundName = computed(() => {
      var _a;
      if (!((_a = compound.value) == null ? void 0 : _a.name)) return slug.value;
      return compound.value.name[locale.value] || compound.value.name["en"] || compound.value.name["zh-Hant"] || slug.value;
    });
    const description = computed(() => {
      var _a;
      if (!((_a = compound.value) == null ? void 0 : _a.description)) return null;
      return compound.value.description[locale.value] || compound.value.description["en"] || compound.value.description["zh-Hant"];
    });
    const compoundClassList = computed(() => {
      var _a;
      if (!((_a = compound.value) == null ? void 0 : _a.compoundClass)) return [];
      return compound.value.compoundClass.split(";").map((s) => s.trim());
    });
    const bioavailability = computed(() => {
      var _a;
      if (!((_a = compound.value) == null ? void 0 : _a.bioavailability)) return null;
      return compound.value.bioavailability[locale.value] || compound.value.bioavailability["en"] || compound.value.bioavailability["zh-Hant"];
    });
    const hasSafetyData = computed(() => {
      var _a;
      const sd = (_a = compound.value) == null ? void 0 : _a.safetyData;
      return sd && (sd.ld50 || sd.toxicity || sd.warnings && sd.warnings.length > 0);
    });
    function getSlug(entity) {
      if (!(entity == null ? void 0 : entity["@id"])) return "";
      const parts = entity["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function getCommonName(plant) {
      if (!(plant == null ? void 0 : plant.commonName)) return null;
      return plant.commonName[locale.value] || plant.commonName["en"] || plant.commonName["zh-Hant"];
    }
    watch(slug, (newSlug) => {
      if (newSlug) {
        const compoundData = dataset.getChemical(newSlug);
        compound.value = compoundData;
        if (compoundData) {
          plants.value = dataset.getPlantsContainingCompound(newSlug);
        }
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "compound-detail-view" }, _attrs))} data-v-918132c4><div class="container container-narrow" data-v-918132c4><nav class="breadcrumbs" data-v-918132c4>`);
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
      _push(`<span data-v-918132c4>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/compounds")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("compounds.title"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("compounds.title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-918132c4>/</span><span data-v-918132c4>${ssrInterpolate(compoundName.value)}</span></nav>`);
      if (compound.value) {
        _push(`<article class="compound-detail" data-v-918132c4><header class="compound-detail__header" data-v-918132c4><div class="compound-detail__icon" data-v-918132c4>⚗️</div><div class="compound-detail__meta" data-v-918132c4><span class="compound-detail__type-badge" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.compound"))}</span><h1 class="compound-detail__name" data-v-918132c4>${ssrInterpolate(compoundName.value)}</h1>`);
        if (compound.value.molecularFormula) {
          _push(`<p class="compound-detail__formula" data-v-918132c4>${ssrInterpolate(compound.value.molecularFormula)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (description.value) {
          _push(`<section class="compound-detail__section" data-v-918132c4><h2 class="section-title" data-v-918132c4>${ssrInterpolate(unref(t)("sections.description"))}</h2><div class="prose" data-v-918132c4><p data-v-918132c4>${ssrInterpolate(description.value)}</p></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="compound-detail__section compound-detail__identifiers" data-v-918132c4><h2 class="section-title" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.identifiers"))}</h2><div class="identifiers-grid" data-v-918132c4>`);
        if (compound.value.iupacName) {
          _push(`<div class="identifier-item identifier-item--full" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.iupacName"))}</span><span class="identifier-item__value identifier-item__value--small" data-v-918132c4>${ssrInterpolate(compound.value.iupacName)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (compound.value.molecularFormula) {
          _push(`<div class="identifier-item" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.molecularFormula"))}</span><span class="identifier-item__value identifier-item__value--mono" data-v-918132c4>${ssrInterpolate(compound.value.molecularFormula)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (compound.value.molecularWeight) {
          _push(`<div class="identifier-item" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.molecularWeight"))}</span><span class="identifier-item__value" data-v-918132c4>${ssrInterpolate(compound.value.molecularWeight)} g/mol</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (compound.value.casNumber) {
          _push(`<div class="identifier-item" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.casNumber"))}</span><span class="identifier-item__value identifier-item__value--mono" data-v-918132c4>${ssrInterpolate(compound.value.casNumber)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (compound.value.chebiID) {
          _push(`<div class="identifier-item" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.chebiID"))}</span><a${ssrRenderAttr("href", `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${compound.value.chebiID}`)} target="_blank" rel="noopener" class="identifier-item__link" data-v-918132c4>${ssrInterpolate(compound.value.chebiID)} ↗ </a></div>`);
        } else {
          _push(`<!---->`);
        }
        if (compound.value.pubchemCID) {
          _push(`<div class="identifier-item" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.pubchemCID"))}</span><a${ssrRenderAttr("href", `https://pubchem.ncbi.nlm.nih.gov/compound/${compound.value.pubchemCID}`)} target="_blank" rel="noopener" class="identifier-item__link" data-v-918132c4> CID: ${ssrInterpolate(compound.value.pubchemCID)} ↗ </a></div>`);
        } else {
          _push(`<!---->`);
        }
        if (compound.value.inchiKey) {
          _push(`<div class="identifier-item" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.inchiKey"))}</span><span class="identifier-item__value identifier-item__value--mono identifier-item__value--small" data-v-918132c4>${ssrInterpolate(compound.value.inchiKey)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (compound.value.inchi) {
          _push(`<div class="identifier-item identifier-item--full" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.inchi"))}</span><div class="identifier-item__long-value" data-v-918132c4><code class="identifier-item__code" data-v-918132c4>${ssrInterpolate(compound.value.inchi)}</code></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (compound.value.smiles) {
          _push(`<div class="identifier-item identifier-item--full" data-v-918132c4><span class="identifier-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.smiles"))}</span><div class="identifier-item__long-value" data-v-918132c4><code class="identifier-item__code" data-v-918132c4>${ssrInterpolate(compound.value.smiles)}</code></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
        if (compound.value.compoundClass || compound.value.commonName) {
          _push(`<section class="compound-detail__section" data-v-918132c4>`);
          if (compound.value.compoundClass) {
            _push(`<h2 class="section-title" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.compoundClass"))}</h2>`);
          } else {
            _push(`<!---->`);
          }
          if (compound.value.compoundClass) {
            _push(`<div class="class-tags" data-v-918132c4><!--[-->`);
            ssrRenderList(compoundClassList.value, (cls, idx) => {
              _push(`<span class="class-tag" data-v-918132c4>${ssrInterpolate(cls)}</span>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_a = compound.value.commonName) == null ? void 0 : _a.length) {
            _push(`<h2 class="section-title section-title--secondary" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.synonyms"))}</h2>`);
          } else {
            _push(`<!---->`);
          }
          if ((_b = compound.value.commonName) == null ? void 0 : _b.length) {
            _push(`<div class="synonym-tags" data-v-918132c4><!--[-->`);
            ssrRenderList(compound.value.commonName, (syn, idx) => {
              _push(`<span class="synonym-tag" data-v-918132c4>${ssrInterpolate(syn)}</span>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_c = compound.value.pharmacology) == null ? void 0 : _c.length) {
          _push(`<section class="compound-detail__section" data-v-918132c4><h2 class="section-title" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.pharmacology"))}</h2><ul class="pharmacology-list" data-v-918132c4><!--[-->`);
          ssrRenderList(compound.value.pharmacology, (item, idx) => {
            _push(`<li data-v-918132c4>${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if (bioavailability.value) {
          _push(`<section class="compound-detail__section compound-detail__bioavailability" data-v-918132c4><h2 class="section-title" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.bioavailability"))}</h2><p class="bioavailability-text" data-v-918132c4>${ssrInterpolate(bioavailability.value)}</p></section>`);
        } else {
          _push(`<!---->`);
        }
        if (hasSafetyData.value) {
          _push(`<section class="compound-detail__section compound-detail__safety" data-v-918132c4><h2 class="section-title" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.safetyData"))}</h2><div class="safety-grid" data-v-918132c4>`);
          if ((_d = compound.value.safetyData) == null ? void 0 : _d.ld50) {
            _push(`<div class="safety-item" data-v-918132c4><span class="safety-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.ld50"))}</span><span class="safety-item__value" data-v-918132c4>${ssrInterpolate(compound.value.safetyData.ld50)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_e = compound.value.safetyData) == null ? void 0 : _e.toxicity) {
            _push(`<div class="safety-item" data-v-918132c4><span class="safety-item__label" data-v-918132c4>${ssrInterpolate(unref(t)("compounds.toxicity"))}</span><span class="safety-item__value" data-v-918132c4>${ssrInterpolate(compound.value.safetyData.toxicity)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if ((_g = (_f = compound.value.safetyData) == null ? void 0 : _f.warnings) == null ? void 0 : _g.length) {
            _push(`<ul class="warnings-list" data-v-918132c4><!--[-->`);
            ssrRenderList(compound.value.safetyData.warnings, (warning, idx) => {
              _push(`<li data-v-918132c4><span class="warning-icon" data-v-918132c4>⚠️</span> ${ssrInterpolate(warning)}</li>`);
            });
            _push(`<!--]--></ul>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="compound-detail__section compound-detail__plants" data-v-918132c4><h2 class="section-title" data-v-918132c4><span class="section-title__icon" data-v-918132c4>🌿</span> ${ssrInterpolate(unref(t)("compounds.foundIn"))} <span class="section-title__count" data-v-918132c4>(${ssrInterpolate(plants.value.length)})</span></h2>`);
        if (plants.value.length > 0) {
          _push(`<div class="plants-grid" data-v-918132c4><!--[-->`);
          ssrRenderList(plants.value, (plant) => {
            _push(ssrRenderComponent(_component_router_link, {
              key: getSlug(plant),
              to: localePath(`/sources/botanical/${getSlug(plant)}`),
              class: "plant-card-mini"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="plant-card-mini__image-wrapper" data-v-918132c4${_scopeId}>`);
                  if (plant.image) {
                    _push2(`<img${ssrRenderAttr("src", plant.image)}${ssrRenderAttr("alt", plant.scientificName)} class="plant-card-mini__image" data-v-918132c4${_scopeId}>`);
                  } else {
                    _push2(`<div class="plant-card-mini__placeholder" data-v-918132c4${_scopeId}><span data-v-918132c4${_scopeId}>🌿</span></div>`);
                  }
                  _push2(`</div><div class="plant-card-mini__content" data-v-918132c4${_scopeId}><h4 class="plant-card-mini__name" data-v-918132c4${_scopeId}>${ssrInterpolate(plant.scientificName)}</h4>`);
                  if (getCommonName(plant)) {
                    _push2(`<p class="plant-card-mini__common" data-v-918132c4${_scopeId}>${ssrInterpolate(getCommonName(plant))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><span class="plant-card-mini__arrow" data-v-918132c4${_scopeId}>→</span>`);
                } else {
                  return [
                    createVNode("div", { class: "plant-card-mini__image-wrapper" }, [
                      plant.image ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: plant.image,
                        alt: plant.scientificName,
                        class: "plant-card-mini__image"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "plant-card-mini__placeholder"
                      }, [
                        createVNode("span", null, "🌿")
                      ]))
                    ]),
                    createVNode("div", { class: "plant-card-mini__content" }, [
                      createVNode("h4", { class: "plant-card-mini__name" }, toDisplayString(plant.scientificName), 1),
                      getCommonName(plant) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "plant-card-mini__common"
                      }, toDisplayString(getCommonName(plant)), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("span", { class: "plant-card-mini__arrow" }, "→")
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="plants-empty" data-v-918132c4><p data-v-918132c4>${ssrInterpolate(unref(t)("compounds.noPlants"))}</p></div>`);
        }
        _push(`</section><aside class="compound-detail__disclaimer" data-v-918132c4><p data-v-918132c4><strong data-v-918132c4>${ssrInterpolate(unref(t)("disclaimer.title"))}:</strong> ${ssrInterpolate(unref(t)("disclaimer.text"))}</p></aside></article>`);
      } else {
        _push(`<div class="compound-detail__not-found" data-v-918132c4><h1 data-v-918132c4>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-918132c4>${ssrInterpolate(unref(t)("compounds.notFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath("/compounds"),
          class: "compound-detail__back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("compounds.backToCompounds"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("compounds.backToCompounds")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ChemicalCompoundDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ChemicalCompoundDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-918132c4"]]);
export {
  ChemicalCompoundDetailView as default
};
