import { GridraConnectionHandle } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const connectionHandleDoc: ComponentDoc = {
    category: "Core",
    name: "GridraConnectionHandle",
    summary: "Input or output connection point for node graphs.",
    description:
      "GridraConnectionHandle marks input/output ports on nodes for graph connections. Input handles render as circles, output handles as squares. The active state highlights the handle.",
    importExample: 'import { GridraConnectionHandle } from "@gridra-ui/react";',
    props: [
      { name: "kind", type: "\"input\" | \"output\"", default: "\"output\"", description: "Visual shape variant. input is circular, output is square." },
      { name: "position", type: "\"top\" | \"right\" | \"bottom\" | \"left\" | \"inline\"", default: "\"right\"", description: "Position modifier class." },
      { name: "active", type: "boolean", default: "false", description: "Highlight state." },
      { name: "children", type: "ReactNode", description: "Custom handle content. Defaults to a small dot." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["type: input | output", "position: top | right | bottom | left | inline", "active", "HTML span attributes"],
    features: ["Differentiates input and output shape.", "Supports active visual state."],
    examples: [
      {
        title: "Input and output",
        code: `<div className="docs-inline-preview">
  <GridraConnectionHandle kind="input" position="inline" />
  <GridraConnectionHandle kind="output" position="inline" active />
</div>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraConnectionHandle kind="input" position="inline" />
        <GridraConnectionHandle active kind="output" position="inline" />
      </div>
    )
  };
