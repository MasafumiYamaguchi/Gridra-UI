import { GridraCanvasArea, GridraNode } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const canvasAreaDoc: ComponentDoc = {
    category: "Core",
    name: "GridraCanvasArea",
    summary: "Spatial editing area for grid-based nodes, selection, dragging, resizing, and connections.",
    description:
      "GridraCanvasArea is the centerpiece of the Gridra spatial editing experience. It renders a CSS grid, places nodes, handles range selection, dragging, resizing, and connection drawing. It supports both controlled and uncontrolled state for selections, placements, and connections.",
    importExample: 'import { GridraCanvasArea } from "@gridra-ui/react";',
    props: [
      { name: "gridColumns", type: "number", description: "Number of CSS grid columns." },
      { name: "gridRows", type: "number", description: "Number of CSS grid rows." },
      { name: "nodes", type: "GridraCanvasNode[]", description: "Node definitions to render." },
      { name: "renderNode", type: "(node, state) => ReactNode", description: "Custom node renderer. Receives interaction state." },
      { name: "selectedId", type: "GridraId | null", description: "Controlled single selection." },
      { name: "defaultSelectedId", type: "GridraId | null", default: "null", description: "Uncontrolled single selection." },
      { name: "selectedIds", type: "GridraId[]", description: "Controlled multi-selection." },
      { name: "defaultSelectedIds", type: "GridraId[]", default: "[]", description: "Uncontrolled multi-selection." },
      { name: "selectionMode", type: "\"replace\" | \"additive\" | \"toggle\"", default: "\"replace\"", description: "How range selection modifies selectedIds." },
      { name: "nodePlacements", type: "GridraNodePlacements", description: "Controlled node position state." },
      { name: "defaultNodePlacements", type: "GridraNodePlacements", default: "{}", description: "Uncontrolled node position state." },
      { name: "nodeConnections", type: "GridraNodeConnection[]", description: "Controlled connections." },
      { name: "defaultNodeConnections", type: "GridraNodeConnection[]", default: "[]", description: "Uncontrolled connections." },
      { name: "enableRangeSelection", type: "boolean", default: "true", description: "Enable drag-to-select on the canvas background." },
      { name: "enableNodeDragging", type: "boolean", default: "false", description: "Allow nodes to be dragged." },
      { name: "enableNodeResizing", type: "boolean", default: "false", description: "Allow nodes to be resized." },
      { name: "enableNodeConnecting", type: "boolean", default: "false", description: "Show connection handles and allow drawing lines." },
      { name: "connectionLineWidth", type: "number | string", description: "Stroke width for connection SVG paths." },
      { name: "onSelectionChange", type: "(selectedId, prev) => void", description: "Single selection change callback." },
      { name: "onSelectionIdsChange", type: "(selectedIds, prev) => void", description: "Multi-selection change callback." },
      { name: "onNodeMove", type: "(id, placement, prev) => void", description: "Called after a node drag ends." },
      { name: "onNodeResize", type: "(id, placement, prev) => void", description: "Called after a node resize ends." },
      { name: "onNodeConnect", type: "(connection) => void", description: "Called when a new connection is created." },
      { name: "onNodeConnectionsChange", type: "(connections, prev) => void", description: "Connections state change callback." },
      { name: "onNodePlacementsChange", type: "(placements, prev) => void", description: "Placements state change callback." }
    ],
    options: [
      "nodes",
      "renderNode",
      "gridColumns / gridRows",
      "selectedId / selectedIds",
      "selectionMode: replace | additive | toggle",
      "selectionModifierKeys",
      "nodePlacements / nodeConnections",
      "enableRangeSelection / enableNodeDragging / enableNodeResizing / enableNodeConnecting",
      "onSelectionChange / onSelectionIdsChange / onNodePlacementsChange / onNodeConnectionsChange"
    ],
    features: [
      "Renders nodes inside a CSS grid.",
      "Supports controlled and uncontrolled node placement state.",
      "Can draw connection lines and range-selection overlays.",
      "Range selection can replace, add to, or toggle selected node ids."
    ],
    examples: [
      {
        title: "Basic canvas with nodes",
        code: `<GridraCanvasArea
  gridColumns={12}
  gridRows={6}
  nodes={[
    { id: "a", placement: { column: 1, row: 1, columnSpan: 2, rowSpan: 1 } }
  ]}
/>`
      },
      {
        title: "Interactive canvas",
        code: `<GridraCanvasArea
  enableNodeDragging
  enableNodeResizing
  enableNodeConnecting
  nodes={nodes}
  onNodePlacementsChange={setPlacements}
/>`
      }
    ],
    preview: (
      <div className="docs-canvas-preview">
        <GridraNode id="docs-canvas-node-a" placement={{ column: 1, row: 1, columnSpan: 2, rowSpan: 1 }} selected>
          Node A
        </GridraNode>
        <GridraNode id="docs-canvas-node-b" placement={{ column: 4, row: 2, columnSpan: 2, rowSpan: 1 }}>
          Node B
        </GridraNode>
      </div>
    )
  };
