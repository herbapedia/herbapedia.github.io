import { computed, ref, reactive, watch, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, D as DEFAULT_LOCALE } from "../main.mjs";
import { d as dataset } from "./dataset-CMjUf6f2.js";
import "@unhead/vue/server";
const _sfc_main = {
  __name: "DNABarcodeDetailView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    const slug = computed(() => route.params.slug);
    const barcode = ref(null);
    const species = ref(null);
    const expandedSequences = reactive({});
    const copiedSequence = ref(false);
    const localePath = (path) => {
      if (locale.value === DEFAULT_LOCALE) {
        return path;
      }
      return `/${locale.value}${path}`;
    };
    const barcodeName = computed(() => {
      var _a;
      if (!((_a = barcode.value) == null ? void 0 : _a.name)) return slug.value;
      return barcode.value.name[locale.value] || barcode.value.name["en"] || barcode.value.name["zh-Hant"] || slug.value;
    });
    const speciesName = computed(() => {
      if (!species.value) return null;
      return species.value.scientificName;
    });
    function getSlug(entity) {
      if (!(entity == null ? void 0 : entity["@id"])) return "";
      const parts = entity["@id"].split("/");
      return parts[parts.length - 1] || "";
    }
    function highlightedSequence(sequence, expanded) {
      if (!sequence) return "";
      const displaySeq = expanded ? sequence : sequence.substring(0, 200);
      const suffix = !expanded && sequence.length > 200 ? "..." : "";
      return displaySeq.replace(/A/gi, '<span class="nucleotide-a">A</span>').replace(/T/gi, '<span class="nucleotide-t">T</span>').replace(/G/gi, '<span class="nucleotide-g">G</span>').replace(/C/gi, '<span class="nucleotide-c">C</span>') + suffix;
    }
    watch(slug, (newSlug) => {
      var _a;
      if (newSlug) {
        barcode.value = dataset.getDNABarcode(newSlug);
        if ((_a = barcode.value) == null ? void 0 : _a.species) {
          const speciesSlug = barcode.value.species["@id"].split("/").pop();
          species.value = dataset.getPlantSpecies(speciesSlug);
        }
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dna-barcode-detail-view" }, _attrs))} data-v-b52ec29b><div class="container container-narrow" data-v-b52ec29b><nav class="breadcrumbs" data-v-b52ec29b>`);
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
      _push(`<span data-v-b52ec29b>/</span>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: localePath("/sources/barcodes")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("dnaBarcodes.title"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("dnaBarcodes.title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-b52ec29b>/</span><span data-v-b52ec29b>${ssrInterpolate(barcodeName.value)}</span></nav>`);
      if (barcode.value) {
        _push(`<article class="dna-barcode-detail" data-v-b52ec29b><header class="dna-barcode-detail__header" data-v-b52ec29b><div class="dna-barcode-detail__icon" data-v-b52ec29b>🧬</div><div class="dna-barcode-detail__meta" data-v-b52ec29b><span class="dna-barcode-detail__type-badge" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.barcode"))}</span><h1 class="dna-barcode-detail__name" data-v-b52ec29b>${ssrInterpolate(barcodeName.value)}</h1>`);
        if (speciesName.value) {
          _push(`<p class="dna-barcode-detail__species" data-v-b52ec29b>${ssrInterpolate(speciesName.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (barcode.value.identificationConfidence) {
          _push(`<section class="dna-barcode-detail__section dna-barcode-detail__confidence" data-v-b52ec29b><h2 class="section-title" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.identification"))}</h2><div class="confidence-info" data-v-b52ec29b><div class="confidence-item" data-v-b52ec29b><span class="confidence-item__label" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.level"))}:</span><span class="confidence-item__value" data-v-b52ec29b>${ssrInterpolate(barcode.value.identificationConfidence.level)}</span></div>`);
          if (barcode.value.identificationConfidence.confidence) {
            _push(`<div class="confidence-item" data-v-b52ec29b><span class="confidence-item__label" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.confidence"))}:</span><span class="confidence-item__value" data-v-b52ec29b>${ssrInterpolate(barcode.value.identificationConfidence.confidence)}%</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (barcode.value.identificationConfidence.method) {
            _push(`<div class="confidence-item" data-v-b52ec29b><span class="confidence-item__label" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.method"))}:</span><span class="confidence-item__value" data-v-b52ec29b>${ssrInterpolate(barcode.value.identificationConfidence.method)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (barcode.value.sequence && barcode.value.sequence.length > 0) {
          _push(`<section class="dna-barcode-detail__section dna-barcode-detail__sequences" data-v-b52ec29b><h2 class="section-title" data-v-b52ec29b><span class="section-title__icon" data-v-b52ec29b>🧬</span> ${ssrInterpolate(unref(t)("dnaBarcodes.sequences"))}</h2><div class="sequences-list" data-v-b52ec29b><!--[-->`);
          ssrRenderList(barcode.value.sequence, (seq, index) => {
            _push(`<div class="sequence-card" data-v-b52ec29b><div class="sequence-card__header" data-v-b52ec29b><h3 class="sequence-card__region" data-v-b52ec29b>${ssrInterpolate(seq.region)}</h3><div class="sequence-card__meta" data-v-b52ec29b>`);
            if (seq.length) {
              _push(`<span class="sequence-meta" data-v-b52ec29b>${ssrInterpolate(seq.length)} bp</span>`);
            } else {
              _push(`<!---->`);
            }
            if (seq.gcContent) {
              _push(`<span class="sequence-meta" data-v-b52ec29b>GC: ${ssrInterpolate(seq.gcContent)}%</span>`);
            } else {
              _push(`<!---->`);
            }
            if (seq.sequenceQuality) {
              _push(`<span class="sequence-quality" data-v-b52ec29b>${ssrInterpolate(seq.sequenceQuality)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
            if (seq.genbankAccession) {
              _push(`<div class="sequence-card__accession" data-v-b52ec29b><span class="accession-label" data-v-b52ec29b>GenBank:</span><a${ssrRenderAttr("href", `https://www.ncbi.nlm.nih.gov/nuccore/${seq.genbankAccession}`)} target="_blank" rel="noopener" class="accession-link" data-v-b52ec29b>${ssrInterpolate(seq.genbankAccession)} <span class="external-arrow" data-v-b52ec29b>↗</span></a></div>`);
            } else {
              _push(`<!---->`);
            }
            if (seq.sequence) {
              _push(`<div class="sequence-card__sequence" data-v-b52ec29b><div class="sequence-viewer" data-v-b52ec29b><div class="sequence-legend" data-v-b52ec29b><span class="legend-item" data-v-b52ec29b><span class="nucleotide-a" data-v-b52ec29b>A</span> Adenine</span><span class="legend-item" data-v-b52ec29b><span class="nucleotide-t" data-v-b52ec29b>T</span> Thymine</span><span class="legend-item" data-v-b52ec29b><span class="nucleotide-g" data-v-b52ec29b>G</span> Guanine</span><span class="legend-item" data-v-b52ec29b><span class="nucleotide-c" data-v-b52ec29b>C</span> Cytosine</span></div><code class="sequence-code sequence-code--highlighted" data-v-b52ec29b><span data-v-b52ec29b>${highlightedSequence(seq.sequence, expandedSequences[index]) ?? ""}</span></code><div class="sequence-controls" data-v-b52ec29b><button class="sequence-control-btn" data-v-b52ec29b>${ssrInterpolate(expandedSequences[index] ? unref(t)("dnaBarcodes.hideFullSequence") : unref(t)("dnaBarcodes.viewFullSequence"))}</button><button class="sequence-control-btn sequence-control-btn--secondary" data-v-b52ec29b>${ssrInterpolate(copiedSequence.value ? unref(t)("dnaBarcodes.sequenceCopied") : unref(t)("dnaBarcodes.copySequence"))}</button></div></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_b = (_a = barcode.value.adulterantDetection) == null ? void 0 : _a.canDetect) == null ? void 0 : _b.length) {
          _push(`<section class="dna-barcode-detail__section" data-v-b52ec29b><h2 class="section-title" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.adulterantDetection"))}</h2><p class="adulterant-note" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.canDetect"))}:</p><ul class="adulterant-list" data-v-b52ec29b><!--[-->`);
          ssrRenderList(barcode.value.adulterantDetection.canDetect, (item, index) => {
            _push(`<li data-v-b52ec29b>${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if (barcode.value.voucheredSpecimen) {
          _push(`<section class="dna-barcode-detail__section" data-v-b52ec29b><h2 class="section-title" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.voucheredSpecimen"))}</h2><div class="specimen-info" data-v-b52ec29b>`);
          if (barcode.value.voucheredSpecimen.herbarium) {
            _push(`<div class="specimen-item" data-v-b52ec29b><span class="specimen-label" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.herbarium"))}:</span><span class="specimen-value" data-v-b52ec29b>${ssrInterpolate(barcode.value.voucheredSpecimen.herbarium)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (barcode.value.voucheredSpecimen.collector) {
            _push(`<div class="specimen-item" data-v-b52ec29b><span class="specimen-label" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.collector"))}:</span><span class="specimen-value" data-v-b52ec29b>${ssrInterpolate(barcode.value.voucheredSpecimen.collector)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (barcode.value.voucheredSpecimen.collectionLocation) {
            _push(`<div class="specimen-item" data-v-b52ec29b><span class="specimen-label" data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.location"))}:</span><span class="specimen-value" data-v-b52ec29b>${ssrInterpolate(barcode.value.voucheredSpecimen.collectionLocation)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (species.value) {
          _push(`<section class="dna-barcode-detail__section" data-v-b52ec29b>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: localePath(`/sources/botanical/${getSlug(species.value)}`),
            class: "species-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="species-link__content" data-v-b52ec29b${_scopeId}><span class="species-link__label" data-v-b52ec29b${_scopeId}>${ssrInterpolate(unref(t)("dnaBarcodes.viewSpecies"))}</span><h3 class="species-link__name" data-v-b52ec29b${_scopeId}>${ssrInterpolate(species.value.scientificName)}</h3></div><span class="species-link__arrow" data-v-b52ec29b${_scopeId}>→</span>`);
              } else {
                return [
                  createVNode("div", { class: "species-link__content" }, [
                    createVNode("span", { class: "species-link__label" }, toDisplayString(unref(t)("dnaBarcodes.viewSpecies")), 1),
                    createVNode("h3", { class: "species-link__name" }, toDisplayString(species.value.scientificName), 1)
                  ]),
                  createVNode("span", { class: "species-link__arrow" }, "→")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<aside class="dna-barcode-detail__disclaimer" data-v-b52ec29b><p data-v-b52ec29b><strong data-v-b52ec29b>${ssrInterpolate(unref(t)("disclaimer.title"))}:</strong> ${ssrInterpolate(unref(t)("dnaBarcodes.disclaimer"))}</p></aside></article>`);
      } else {
        _push(`<div class="dna-barcode-detail__not-found" data-v-b52ec29b><h1 data-v-b52ec29b>${ssrInterpolate(unref(t)("common.notFound"))}</h1><p data-v-b52ec29b>${ssrInterpolate(unref(t)("dnaBarcodes.notFound"))}</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: localePath("/sources/barcodes"),
          class: "dna-barcode-detail__back-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← ${ssrInterpolate(unref(t)("dnaBarcodes.backToBarcodes"))}`);
            } else {
              return [
                createTextVNode(" ← " + toDisplayString(unref(t)("dnaBarcodes.backToBarcodes")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/DNABarcodeDetailView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DNABarcodeDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b52ec29b"]]);
export {
  DNABarcodeDetailView as default
};
