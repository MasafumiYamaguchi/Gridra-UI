import { GridraDragHandle, GridraNode, GridraResizeHandle } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const nodeDoc: ComponentDoc = {
  category: "Core", name: "GridraNode",
  summary: "Standalone visual button surface with optional handle slots.",
  description: "GridraNode needs no parent component or positioning props. It accepts ordinary button attributes, including style, onClick, ref and aria-pressed. Attach useGridraCanvas getters when grid interactions are needed.",
  importExample: 'import { GridraNode } from "@gridra-ui/react";',
  props: [
    { name: "aria-pressed", type: "boolean", description: "Visual selection state." },
    { name: "dragHandle", type: "ReactNode", description: "Drag handle slot." },
    { name: "resizeHandle", type: "ReactNode", description: "Resize handle slot." },
    { name: "connectionHandles", type: "ReactNode", description: "Connection handle slots." },
    { name: "children", type: "ReactNode", description: "Node content." },
  ],
  options: ["HTML button attributes", "ref", "dragHandle", "resizeHandle", "connectionHandles"],
  features: ["Works outside a canvas.", "Separates visuals from grid interactions."],
  examples: [
    { title: "Standalone", code: '<GridraNode aria-pressed={selected} onClick={toggle}>Input</GridraNode>' },
    { title: "Hook bindings", code: `<GridraNode {...canvas.getNodeProps(node.id)}
  dragHandle={<GridraDragHandle {...canvas.getDragHandleProps(node.id)} />}
  resizeHandle={<GridraResizeHandle {...canvas.getResizeHandleProps(node.id)} />}>
  {node.label}
</GridraNode>` },
  ],
  preview: <GridraNode aria-pressed style={{ minHeight: 80, minWidth: 180 }}
    dragHandle={<GridraDragHandle position="inline" />}
    resizeHandle={<GridraResizeHandle position="inline" />}>Input</GridraNode>,
};
