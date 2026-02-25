import { mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { G as GlassCard } from "./GlassCard-D8pMjku3.js";
import { _ as _export_sfc } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "AboutView",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "about-view" }, _attrs))} data-v-32821700><div class="container container-narrow" data-v-32821700>`);
      _push(ssrRenderComponent(GlassCard, { padding: "xl" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.title"))}</h1><section class="about-section" data-v-32821700${_scopeId}><h2 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.mission.title"))}</h2><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.mission.text"))}</p></section><section class="about-section" data-v-32821700${_scopeId}><h2 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.history.title"))}</h2><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.history.p1"))}</p><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.history.p2"))}</p><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.history.p3"))}</p></section><section class="about-section" data-v-32821700${_scopeId}><h2 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.content.title"))}</h2><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.content.intro"))}</p><ul data-v-32821700${_scopeId}><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("categories.chineseHerbs"))}</strong> - ${ssrInterpolate(unref(t)("about.content.chineseHerbs"))}</li><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("categories.westernHerbs"))}</strong> - ${ssrInterpolate(unref(t)("about.content.westernHerbs"))}</li><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("categories.vitamins"))}</strong> - ${ssrInterpolate(unref(t)("about.content.vitamins"))}</li><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("categories.minerals"))}</strong> - ${ssrInterpolate(unref(t)("about.content.minerals"))}</li><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("categories.nutrients"))}</strong> - ${ssrInterpolate(unref(t)("about.content.nutrients"))}</li></ul></section><section class="about-section" data-v-32821700${_scopeId}><h2 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.approach.title"))}</h2><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.approach.text"))}</p></section><section class="about-section" data-v-32821700${_scopeId}><h2 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.title"))}</h2><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.intro"))}</p><h3 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.coreEntity"))}</h3><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.coreEntityDesc"))}</p><h3 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.sourceMaterials"))}</h3><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.sourceMaterialsDesc"))}</p><ul class="ontology-list" data-v-32821700${_scopeId}><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>botany:PlantSpecies</code> - ${ssrInterpolate(unref(t)("about.ontology.sourcePlant"))}</li><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>herbapedia:ZoologicalSource</code> - ${ssrInterpolate(unref(t)("about.ontology.sourceAnimal"))}</li><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>herbapedia:MineralSource</code> - ${ssrInterpolate(unref(t)("about.ontology.sourceMineral"))}</li><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>herbapedia:ChemicalSource</code> - ${ssrInterpolate(unref(t)("about.ontology.sourceChemical"))}</li></ul><h3 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.profiles"))}</h3><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.profilesDesc"))}</p><ul class="ontology-list" data-v-32821700${_scopeId}><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>tcm:TCMProfile</code> - ${ssrInterpolate(unref(t)("about.ontology.profileTCM"))}</li><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>western:WesternHerbalProfile</code> - ${ssrInterpolate(unref(t)("about.ontology.profileWestern"))}</li><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>ayurveda:AyurvedaProfile</code> - ${ssrInterpolate(unref(t)("about.ontology.profileAyurveda"))}</li><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>persian:PersianProfile</code> - ${ssrInterpolate(unref(t)("about.ontology.profilePersian"))}</li><li data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>mongolian:MongolianProfile</code> - ${ssrInterpolate(unref(t)("about.ontology.profileMongolian"))}</li></ul><h3 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.referenceData"))}</h3><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.referenceDataDesc"))}</p><ul class="ontology-list" data-v-32821700${_scopeId}><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>TCM:</strong> <code data-v-32821700${_scopeId}>tcm:Meridian</code>, <code data-v-32821700${_scopeId}>tcm:Nature</code>, <code data-v-32821700${_scopeId}>tcm:Flavor</code>, <code data-v-32821700${_scopeId}>tcm:Category</code></li><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>Western:</strong> <code data-v-32821700${_scopeId}>western:Action</code>, <code data-v-32821700${_scopeId}>western:Organ</code>, <code data-v-32821700${_scopeId}>western:System</code></li><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>Ayurveda:</strong> <code data-v-32821700${_scopeId}>ayurveda:Rasa</code>, <code data-v-32821700${_scopeId}>ayurveda:Guna</code>, <code data-v-32821700${_scopeId}>ayurveda:Virya</code>, <code data-v-32821700${_scopeId}>ayurveda:Vipaka</code></li><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>Persian:</strong> <code data-v-32821700${_scopeId}>persian:Temperament</code>, <code data-v-32821700${_scopeId}>persian:Element</code></li><li data-v-32821700${_scopeId}><strong data-v-32821700${_scopeId}>Mongolian:</strong> <code data-v-32821700${_scopeId}>mongolian:Element</code>, <code data-v-32821700${_scopeId}>mongolian:Root</code>, <code data-v-32821700${_scopeId}>mongolian:Taste</code></li></ul><h3 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.relationships"))}</h3><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.relationshipsDesc"))}</p><div class="code-block" data-v-32821700${_scopeId}><pre data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>HerbalPreparation
├── derivedFrom → SourceMaterial (PlantSpecies | ZoologicalSource | ...)
├── hasTCMProfile → TCMProfile
│   ├── hasNature → tcm:Nature
│   ├── hasFlavor → tcm:Flavor[]
│   ├── entersMeridian → tcm:Meridian[]
│   └── hasCategory → tcm:Category
├── hasWesternProfile → WesternHerbalProfile
│   ├── hasAction → western:Action[]
│   └── hasOrganAffinity → western:Organ[]
├── hasAyurvedaProfile → AyurvedaProfile
│   ├── hasRasa → ayurveda:Rasa[]
│   ├── hasGuna → ayurveda:Guna[]
│   ├── hasVirya → ayurveda:Virya
│   └── hasVipaka → ayurveda:Vipaka
├── hasPersianProfile → PersianProfile
│   └── hasTemperament → persian:Temperament
└── hasMongolianProfile → MongolianProfile
    ├── hasElement → mongolian:Element[]
    └── hasTaste → mongolian:Taste[]</code></pre></div><h3 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.i18n"))}</h3><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.i18nDesc"))}</p><div class="code-block" data-v-32821700${_scopeId}><pre data-v-32821700${_scopeId}><code data-v-32821700${_scopeId}>{
  &quot;@id&quot;: &quot;meridian/lung&quot;,
  &quot;prefLabel&quot;: {
    &quot;en&quot;: &quot;Lung Meridian&quot;,
    &quot;zh-Hant&quot;: &quot;肺經&quot;,
    &quot;zh-Hans&quot;: &quot;肺经&quot;
  }
}</code></pre></div><h3 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.serialization"))}</h3><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.ontology.serializationDesc"))}</p></section><section class="about-section" data-v-32821700${_scopeId}><h2 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("disclaimer.title"))}</h2><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("disclaimer.text"))}</p></section><section class="about-section" data-v-32821700${_scopeId}><h2 data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.sipm.title"))}</h2><p data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.sipm.text"))}</p><p data-v-32821700${_scopeId}><a href="https://sipm.org" target="_blank" rel="noopener" data-v-32821700${_scopeId}>${ssrInterpolate(unref(t)("about.sipm.link"))} → </a></p></section>`);
          } else {
            return [
              createVNode("h1", null, toDisplayString(unref(t)("about.title")), 1),
              createVNode("section", { class: "about-section" }, [
                createVNode("h2", null, toDisplayString(unref(t)("about.mission.title")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.mission.text")), 1)
              ]),
              createVNode("section", { class: "about-section" }, [
                createVNode("h2", null, toDisplayString(unref(t)("about.history.title")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.history.p1")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.history.p2")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.history.p3")), 1)
              ]),
              createVNode("section", { class: "about-section" }, [
                createVNode("h2", null, toDisplayString(unref(t)("about.content.title")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.content.intro")), 1),
                createVNode("ul", null, [
                  createVNode("li", null, [
                    createVNode("strong", null, toDisplayString(unref(t)("categories.chineseHerbs")), 1),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.content.chineseHerbs")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("strong", null, toDisplayString(unref(t)("categories.westernHerbs")), 1),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.content.westernHerbs")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("strong", null, toDisplayString(unref(t)("categories.vitamins")), 1),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.content.vitamins")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("strong", null, toDisplayString(unref(t)("categories.minerals")), 1),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.content.minerals")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("strong", null, toDisplayString(unref(t)("categories.nutrients")), 1),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.content.nutrients")), 1)
                  ])
                ])
              ]),
              createVNode("section", { class: "about-section" }, [
                createVNode("h2", null, toDisplayString(unref(t)("about.approach.title")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.approach.text")), 1)
              ]),
              createVNode("section", { class: "about-section" }, [
                createVNode("h2", null, toDisplayString(unref(t)("about.ontology.title")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.ontology.intro")), 1),
                createVNode("h3", null, toDisplayString(unref(t)("about.ontology.coreEntity")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.ontology.coreEntityDesc")), 1),
                createVNode("h3", null, toDisplayString(unref(t)("about.ontology.sourceMaterials")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.ontology.sourceMaterialsDesc")), 1),
                createVNode("ul", { class: "ontology-list" }, [
                  createVNode("li", null, [
                    createVNode("code", null, "botany:PlantSpecies"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.sourcePlant")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("code", null, "herbapedia:ZoologicalSource"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.sourceAnimal")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("code", null, "herbapedia:MineralSource"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.sourceMineral")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("code", null, "herbapedia:ChemicalSource"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.sourceChemical")), 1)
                  ])
                ]),
                createVNode("h3", null, toDisplayString(unref(t)("about.ontology.profiles")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.ontology.profilesDesc")), 1),
                createVNode("ul", { class: "ontology-list" }, [
                  createVNode("li", null, [
                    createVNode("code", null, "tcm:TCMProfile"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.profileTCM")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("code", null, "western:WesternHerbalProfile"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.profileWestern")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("code", null, "ayurveda:AyurvedaProfile"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.profileAyurveda")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("code", null, "persian:PersianProfile"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.profilePersian")), 1)
                  ]),
                  createVNode("li", null, [
                    createVNode("code", null, "mongolian:MongolianProfile"),
                    createTextVNode(" - " + toDisplayString(unref(t)("about.ontology.profileMongolian")), 1)
                  ])
                ]),
                createVNode("h3", null, toDisplayString(unref(t)("about.ontology.referenceData")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.ontology.referenceDataDesc")), 1),
                createVNode("ul", { class: "ontology-list" }, [
                  createVNode("li", null, [
                    createVNode("strong", null, "TCM:"),
                    createTextVNode(),
                    createVNode("code", null, "tcm:Meridian"),
                    createTextVNode(", "),
                    createVNode("code", null, "tcm:Nature"),
                    createTextVNode(", "),
                    createVNode("code", null, "tcm:Flavor"),
                    createTextVNode(", "),
                    createVNode("code", null, "tcm:Category")
                  ]),
                  createVNode("li", null, [
                    createVNode("strong", null, "Western:"),
                    createTextVNode(),
                    createVNode("code", null, "western:Action"),
                    createTextVNode(", "),
                    createVNode("code", null, "western:Organ"),
                    createTextVNode(", "),
                    createVNode("code", null, "western:System")
                  ]),
                  createVNode("li", null, [
                    createVNode("strong", null, "Ayurveda:"),
                    createTextVNode(),
                    createVNode("code", null, "ayurveda:Rasa"),
                    createTextVNode(", "),
                    createVNode("code", null, "ayurveda:Guna"),
                    createTextVNode(", "),
                    createVNode("code", null, "ayurveda:Virya"),
                    createTextVNode(", "),
                    createVNode("code", null, "ayurveda:Vipaka")
                  ]),
                  createVNode("li", null, [
                    createVNode("strong", null, "Persian:"),
                    createTextVNode(),
                    createVNode("code", null, "persian:Temperament"),
                    createTextVNode(", "),
                    createVNode("code", null, "persian:Element")
                  ]),
                  createVNode("li", null, [
                    createVNode("strong", null, "Mongolian:"),
                    createTextVNode(),
                    createVNode("code", null, "mongolian:Element"),
                    createTextVNode(", "),
                    createVNode("code", null, "mongolian:Root"),
                    createTextVNode(", "),
                    createVNode("code", null, "mongolian:Taste")
                  ])
                ]),
                createVNode("h3", null, toDisplayString(unref(t)("about.ontology.relationships")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.ontology.relationshipsDesc")), 1),
                createVNode("div", { class: "code-block" }, [
                  createVNode("pre", null, [
                    createVNode("code", null, "HerbalPreparation\n├── derivedFrom → SourceMaterial (PlantSpecies | ZoologicalSource | ...)\n├── hasTCMProfile → TCMProfile\n│   ├── hasNature → tcm:Nature\n│   ├── hasFlavor → tcm:Flavor[]\n│   ├── entersMeridian → tcm:Meridian[]\n│   └── hasCategory → tcm:Category\n├── hasWesternProfile → WesternHerbalProfile\n│   ├── hasAction → western:Action[]\n│   └── hasOrganAffinity → western:Organ[]\n├── hasAyurvedaProfile → AyurvedaProfile\n│   ├── hasRasa → ayurveda:Rasa[]\n│   ├── hasGuna → ayurveda:Guna[]\n│   ├── hasVirya → ayurveda:Virya\n│   └── hasVipaka → ayurveda:Vipaka\n├── hasPersianProfile → PersianProfile\n│   └── hasTemperament → persian:Temperament\n└── hasMongolianProfile → MongolianProfile\n    ├── hasElement → mongolian:Element[]\n    └── hasTaste → mongolian:Taste[]")
                  ])
                ]),
                createVNode("h3", null, toDisplayString(unref(t)("about.ontology.i18n")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.ontology.i18nDesc")), 1),
                createVNode("div", { class: "code-block" }, [
                  createVNode("pre", null, [
                    createVNode("code", null, '{\n  "@id": "meridian/lung",\n  "prefLabel": {\n    "en": "Lung Meridian",\n    "zh-Hant": "肺經",\n    "zh-Hans": "肺经"\n  }\n}')
                  ])
                ]),
                createVNode("h3", null, toDisplayString(unref(t)("about.ontology.serialization")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.ontology.serializationDesc")), 1)
              ]),
              createVNode("section", { class: "about-section" }, [
                createVNode("h2", null, toDisplayString(unref(t)("disclaimer.title")), 1),
                createVNode("p", null, toDisplayString(unref(t)("disclaimer.text")), 1)
              ]),
              createVNode("section", { class: "about-section" }, [
                createVNode("h2", null, toDisplayString(unref(t)("about.sipm.title")), 1),
                createVNode("p", null, toDisplayString(unref(t)("about.sipm.text")), 1),
                createVNode("p", null, [
                  createVNode("a", {
                    href: "https://sipm.org",
                    target: "_blank",
                    rel: "noopener"
                  }, toDisplayString(unref(t)("about.sipm.link")) + " → ", 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/AboutView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AboutView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-32821700"]]);
export {
  AboutView as default
};
