import { resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { G as GlassCard } from "./GlassCard-D8pMjku3.js";
import { _ as _export_sfc } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
import "vue-i18n";
const _sfc_main = {
  __name: "NotFoundView",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "not-found-view" }, _attrs))} data-v-ebc051a8><div class="container container-narrow" data-v-ebc051a8>`);
      _push(ssrRenderComponent(GlassCard, { padding: "xl" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="not-found__content" data-v-ebc051a8${_scopeId}><h1 data-v-ebc051a8${_scopeId}>404</h1><h2 data-v-ebc051a8${_scopeId}>Page Not Found</h2><p data-v-ebc051a8${_scopeId}>The page you&#39;re looking for doesn&#39;t exist or has been moved.</p>`);
            _push2(ssrRenderComponent(_component_router_link, {
              to: "/",
              class: "not-found__link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` ← Return to Home `);
                } else {
                  return [
                    createTextVNode(" ← Return to Home ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "not-found__content" }, [
                createVNode("h1", null, "404"),
                createVNode("h2", null, "Page Not Found"),
                createVNode("p", null, "The page you're looking for doesn't exist or has been moved."),
                createVNode(_component_router_link, {
                  to: "/",
                  class: "not-found__link"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" ← Return to Home ")
                  ]),
                  _: 1
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/NotFoundView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const NotFoundView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ebc051a8"]]);
export {
  NotFoundView as default
};
