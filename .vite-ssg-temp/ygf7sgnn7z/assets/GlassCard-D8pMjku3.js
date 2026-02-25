import { computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
import { _ as _export_sfc } from "../main.mjs";
const _sfc_main = {
  __name: "GlassCard",
  __ssrInlineRender: true,
  props: {
    hoverable: {
      type: Boolean,
      default: false
    },
    padding: {
      type: String,
      default: "xl",
      validator: (value) => ["none", "sm", "md", "lg", "xl"].includes(value)
    },
    variant: {
      type: String,
      default: "default",
      validator: (value) => ["default", "elevated", "outlined"].includes(value)
    }
  },
  setup(__props) {
    const props = __props;
    const cardClasses = computed(() => [
      `glass-card--padding-${props.padding}`,
      `glass-card--${props.variant}`,
      { "glass-card--hoverable": props.hoverable }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["glass-card", cardClasses.value]
      }, _attrs))} data-v-577031ca>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/GlassCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const GlassCard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-577031ca"]]);
export {
  GlassCard as G
};
