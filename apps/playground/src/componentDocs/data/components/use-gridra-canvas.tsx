import { useState } from "react";
import { GridraNode, GridraDragHandle, GridraResizeHandle, GridraConnectionHandle,
  GridraCanvasOverlay, useGridraCanvas, type GridraCanvasState } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export function CanvasPreview() {
  const [state, setState] = useState<GridraCanvasState>({
    nodes: [
      { id: "source", label: "Source", placement: { column: 1, row: 1, columnSpan: 2 } },
      { id: "target", label: "Target", placement: { column: 4, row: 2, columnSpan: 2 } },
    ], connections: [], selectedIds: ["source"], selectedConnections: [],
  });
  const canvas = useGridraCanvas({ state, onStateChange: setState, grid: { columns: 6, rows: 3 },
    interactions: { dragging: true, resizing: true, connecting: true } });
  return <section {...canvas.getContainerProps({ style: { height: 240, width: "100%", padding: 10, gap: 10 } })}>
    {canvas.nodes.map((node) => <GridraNode key={node.id} {...canvas.getNodeProps(node.id)}
      dragHandle={<GridraDragHandle {...canvas.getDragHandleProps(node.id)} position="top-right" />}
      resizeHandle={<GridraResizeHandle {...canvas.getResizeHandleProps(node.id)} />}
      connectionHandles={<>
        <GridraConnectionHandle position="left" kind="input" {...canvas.getConnectionHandleProps(node.id, "input")} />
        <GridraConnectionHandle kind="output" {...canvas.getConnectionHandleProps(node.id, "output")} />
      </>}>{node.label}</GridraNode>)}
    <GridraCanvasOverlay {...canvas.overlayProps} />
  </section>;
}

export const canvasHookDoc: ComponentDoc = {
  category: "Core", name: "useGridraCanvas",
  summary: "Controlled grid interactions attached to your own DOM.",
  description: "Own the container, node rendering, and persistent state. The hook supplies DOM props for selection, dragging, resizing and connecting, plus pixel geometry for an optional visual overlay. No Root or canvas component is required.",
  importExample: 'import { useGridraCanvas, GridraCanvasOverlay } from "@gridra-ui/react";',
  props: [
    { name: "state", type: "GridraCanvasState<TNode>", required: true, description: "Nodes with placement, connections, selectedIds, selectedConnections." },
    { name: "onStateChange", type: "(next, previous) => void", required: true, description: "Accept changes in your own state store; input state is never mutated." },
    { name: "grid", type: "{ columns?: number; rows?: number }", default: "12 × 6", description: "Equal-width columns and equal-height rows." },
    { name: "interactions", type: "{ dragging?, resizing?, connecting?, rangeSelection?, selectionMode?, selectionModifierKeys? }", description: "Range selection defaults to true; other operations must be enabled." },
  ],
  options: ["getContainerProps", "getNodeProps", "getDragHandleProps", "getResizeHandleProps", "getConnectionHandleProps", "overlayProps"],
  features: ["Application-owned state and DOM.", "Custom nodes keep their additional data.", "Shared pixel geometry accounts for padding, gaps and scrolling."],
  examples: [{ title: "Your own container and buttons", code: `const canvas = useGridraCanvas({ state, onStateChange: setState });

<section {...canvas.getContainerProps({ style: { height: 300, gap: 10 } })}>
  {canvas.nodes.map(node => (
    <button key={node.id} {...canvas.getNodeProps(node.id)}>{node.label}</button>
  ))}
  <GridraCanvasOverlay {...canvas.overlayProps} />
</section>` }],
  usage: "Give the container a definite size. Nodes must be direct grid children. Pass your handlers, refs and styles into the getters so they are composed. A prevented event skips the hook handler. Connection stroke width is styled with --gridra-connection-line-width.",
  preview: <CanvasPreview />,
};
