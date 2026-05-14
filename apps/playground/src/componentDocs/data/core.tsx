import {
  GridraBadge,
  GridraConnectionHandle,
  GridraDragHandle,
  GridraLabel,
  GridraNode,
  GridraPanel,
  GridraResizeHandle,
  GridraSelectableGrid,
  GridraSelectionBox,
  GridraSnapGuides
} from "@gridra-ui/react";
import type { ComponentDoc } from "../types";
export const coreDocs: ComponentDoc[] = [
  {
    category: "Core",
    name: "GridraRoot",
    summary: "Application shell that owns the Gridra visual scope and optional side panel layout.",
    description:
      "GridraRoot is the top-level application wrapper. It applies the root CSS custom properties (theme tokens), sets the dark background, and creates a two-column shell when a panel is provided. Place it once at the root of your app.",
    importExample: 'import { GridraRoot } from "@gridra-ui/react";',
    props: [
      { name: "panel", type: "ReactNode", description: "Optional side panel content rendered inside GridraPanel." },
      { name: "panelPosition", type: "\"left\" | \"right\"", default: "\"left\"", description: "Side of the panel relative to main content." },
      { name: "children", type: "ReactNode", description: "Main application content rendered in the center." },
      { name: "className", type: "string", description: "Additional CSS classes." },
      { name: "style", type: "CSSProperties", description: "Inline styles." }
    ],
    options: ["panel", "panelPosition: left | right", "HTML div attributes"],
    features: ["Applies the root theme class.", "Creates a main surface with optional left or right panel."],
    examples: [
      {
        title: "With left panel",
        code: `<GridraRoot panel={<GridraPanel heading="Tools" />}>
  <GridraCanvasArea nodes={nodes} />
</GridraRoot>`
      }
    ],
    preview: (
      <div className="docs-mini-shell">
        <GridraBadge tone="muted">panel</GridraBadge>
        <GridraBadge tone="accent">main</GridraBadge>
      </div>
    )
  },
  {
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
        <GridraNode id="docs-canvas-node" placement={{ column: 1, row: 1, columnSpan: 2, rowSpan: 1 }} selected>
          Node
        </GridraNode>
      </div>
    )
  },
  {
    category: "Core",
    name: "GridraSelectableGrid",
    summary: "Compact selectable item grid for dense lists and panel navigation.",
    description:
      "GridraSelectableGrid renders a dense grid of selectable items. Each item is rendered as a button with aria-selected support. It supports controlled and uncontrolled selection, custom item rendering, and an empty state. GridraGrid is a compatibility alias for this component.",
    importExample: 'import { GridraSelectableGrid } from "@gridra-ui/react";',
    props: [
      { name: "items", type: "TItem[]", required: true, description: "Array of grid items with id and optional label." },
      { name: "columns", type: "number | string", default: "auto-fill", description: "Number of columns or CSS grid-template-columns value." },
      { name: "selectedId", type: "GridraId | null", description: "Controlled selected item id." },
      { name: "defaultSelectedId", type: "GridraId | null", default: "null", description: "Uncontrolled selected item id." },
      { name: "onSelectionChange", type: "(selectedId, prev) => void", description: "Selection change callback." },
      { name: "renderItem", type: "(item, state) => ReactNode", description: "Custom item renderer. Receives selected state." },
      { name: "emptyState", type: "ReactNode", default: "\"No items\"", description: "Content shown when items is empty." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["items", "columns", "selectedId", "onSelectionChange", "emptyLabel", "HTML div attributes"],
    features: ["Renders items as selectable buttons.", "Marks the selected item with aria-selected.", "GridraGrid is a compatibility alias."],
    examples: [
      {
        title: "Selectable grid",
        code: `<GridraSelectableGrid
  columns={2}
  items={[
    { id: "a", label: "Input" },
    { id: "b", label: "Output" }
  ]}
  selectedId="a"
/>`
      }
    ],
    preview: (
      <GridraSelectableGrid
        columns={2}
        items={[
          { id: "a", label: "Input" },
          { id: "b", label: "Output" }
        ]}
        selectedId="a"
      />
    )
  },
  {
    category: "Core",
    name: "GridraPanel",
    summary: "Dense side panel container with optional heading and header action.",
    description:
      "GridraPanel is a dense sidebar container with a header (title + actions) and a scrollable body. It uses the panel width token from the theme and is designed to be placed inside GridraRoot.",
    importExample: 'import { GridraPanel } from "@gridra-ui/react";',
    props: [
      { name: "heading", type: "ReactNode", description: "Panel title rendered as an h2." },
      { name: "header", type: "ReactNode", description: "Additional header content rendered next to the heading." },
      { name: "position", type: "\"left\" | \"right\"", default: "\"left\"", description: "Panel position class modifier." },
      { name: "children", type: "ReactNode", description: "Body content." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["heading", "header", "position: left | right", "HTML aside attributes"],
    features: ["Provides header and scrollable body regions.", "Uses panel width tokens from the theme."],
    examples: [
      {
        title: "Panel with header",
        code: `<GridraPanel heading="Tools" header={<GridraBadge>PRO</GridraBadge>}>
  <GridraLabel>Body content</GridraLabel>
</GridraPanel>`
      }
    ],
    preview: (
      <div className="docs-panel-preview">
        <GridraPanel heading="Panel" header={<GridraBadge>Tools</GridraBadge>}>
          <GridraLabel>Body</GridraLabel>
        </GridraPanel>
      </div>
    )
  },
  {
    category: "Core",
    name: "GridraNode",
    summary: "Grid-positioned node surface for canvas workflows.",
    description:
      "GridraNode renders a grid-positioned surface inside GridraCanvasArea. It maps placement coordinates to CSS grid-column and grid-row, supports selection, and exposes slots for drag, resize, and connection handles.",
    importExample: 'import { GridraNode } from "@gridra-ui/react";',
    props: [
      { name: "id", type: "GridraId", required: true, description: "Unique node identifier." },
      { name: "placement", type: "GridraNodePlacement", required: true, description: "Grid coordinates and span." },
      { name: "selected", type: "boolean", default: "false", description: "Visual selected state." },
      { name: "onSelect", type: "(id) => void", description: "Click callback when the node is selected." },
      { name: "dragHandle", type: "ReactNode", description: "Slot for a drag handle component." },
      { name: "resizeHandle", type: "ReactNode", description: "Slot for a resize handle component." },
      { name: "connectionHandles", type: "ReactNode", description: "Slot for connection handle components." },
      { name: "children", type: "ReactNode", description: "Node label content." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["id", "placement", "selected", "onSelect", "dragHandle", "resizeHandle", "connectionHandles", "HTML button attributes"],
    features: ["Maps grid placement to CSS grid coordinates.", "Can host drag, resize, and connection slots."],
    examples: [
      {
        title: "Basic node",
        code: `<GridraNode
  id="input"
  placement={{ column: 1, row: 1, columnSpan: 2, rowSpan: 1 }}
>
  Input Node
</GridraNode>`
      },
      {
        title: "Node with handles",
        code: `<GridraNode
  id="process"
  placement={{ column: 3, row: 1, columnSpan: 2, rowSpan: 2 }}
  selected
  dragHandle={<GridraDragHandle position="inline" />}
  resizeHandle={<GridraResizeHandle position="inline" />}
>
  Process
</GridraNode>`
      }
    ],
    preview: (
      <div className="docs-node-preview">
        <GridraNode id="docs-node" placement={{ column: 1, row: 1, columnSpan: 1, rowSpan: 1 }} selected>
          Input
        </GridraNode>
      </div>
    )
  },
  {
    category: "Core",
    name: "GridraSelectionBox",
    summary: "Visual selection rectangle for drag selection or explicit placement.",
    description:
      "GridraSelectionBox renders a visual selection frame. It can be positioned using pixel coordinates (rect) or grid placement coordinates. It is used internally by GridraCanvasArea during range selection, but can also be used directly for custom overlays.",
    importExample: 'import { GridraSelectionBox } from "@gridra-ui/react";',
    props: [
      { name: "rect", type: "GridraRect", description: "Pixel-based position { x, y, width, height }." },
      { name: "placement", type: "GridraSelectionBoxPlacement", description: "Grid-based position { column, row, columnSpan, rowSpan }." },
      { name: "visible", type: "boolean", default: "true", description: "Toggle visibility." },
      { name: "className", type: "string", description: "Additional CSS classes." },
      { name: "style", type: "CSSProperties", description: "Inline styles." }
    ],
    options: ["rect", "placement", "visible", "HTML div attributes"],
    features: ["Supports pixel rect placement.", "Supports grid placement for canvas overlays."],
    examples: [
      {
        title: "Pixel rect",
        code: `<GridraSelectionBox rect={{ x: 8, y: 8, width: 120, height: 48 }} />`
      },
      {
        title: "Grid placement",
        code: `<GridraSelectionBox placement={{ column: 1, row: 1, columnSpan: 2, rowSpan: 1 }} />`
      }
    ],
    preview: <GridraSelectionBox rect={{ x: 8, y: 8, width: 120, height: 48 }} />
  },
  {
    category: "Core",
    name: "GridraDragHandle",
    summary: "Decorative and interactive grip for node movement.",
    description:
      "GridraDragHandle is a small grip icon used to indicate draggable areas. It forwards pointer events and HTML span attributes so consumers can attach custom drag behavior. It can be rendered absolutely positioned inside a node or inline.",
    importExample: 'import { GridraDragHandle } from "@gridra-ui/react";',
    props: [
      { name: "position", type: "\"top-left\" | \"top-right\" | \"bottom-left\" | \"bottom-right\" | \"inline\"", default: "\"top-left\"", description: "Position modifier class." },
      { name: "children", type: "ReactNode", description: "Custom handle content. Defaults to a grip dot pattern." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["position: top-left | top-right | bottom-left | bottom-right | inline", "HTML span attributes"],
    features: ["Forwards pointer handlers.", "Can be used inline or absolutely positioned inside a node."],
    examples: [
      {
        title: "Default grip",
        code: `<GridraDragHandle position="inline" />`
      }
    ],
    preview: <GridraDragHandle position="inline" />
  },
  {
    category: "Core",
    name: "GridraResizeHandle",
    summary: "Handle used to resize grid nodes.",
    description:
      "GridraResizeHandle is a small corner/edge handle used to indicate resizable areas. It forwards pointer events and can be placed inline or absolutely inside a node.",
    importExample: 'import { GridraResizeHandle } from "@gridra-ui/react";',
    props: [
      { name: "position", type: "\"right\" | \"bottom\" | \"bottom-right\" | \"inline\"", default: "\"bottom-right\"", description: "Position modifier class." },
      { name: "children", type: "ReactNode", description: "Custom handle content. Defaults to an L-shaped corner." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["position: right | bottom | bottom-right | inline", "HTML span attributes"],
    features: ["Forwards pointer handlers.", "Supports right, bottom, corner, and inline rendering."],
    examples: [
      {
        title: "Corner handle",
        code: `<GridraResizeHandle position="inline" />`
      }
    ],
    preview: <GridraResizeHandle position="inline" />
  },
  {
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
  },
  {
    category: "Core",
    name: "GridraSnapGuide",
    summary: "Alignment guide for drag and resize interactions.",
    description:
      "GridraSnapGuide renders thin alignment lines during drag and resize interactions. It supports both absolute pixel positioning and grid placement coordinates. GridraSnapGuides is a helper that renders multiple guides.",
    importExample: 'import { GridraSnapGuide, GridraSnapGuides } from "@gridra-ui/react";',
    props: [
      { name: "orientation", type: "\"vertical\" | \"horizontal\"", default: "\"vertical\"", description: "Line direction." },
      { name: "position", type: "number", description: "Pixel coordinate for absolute positioning." },
      { name: "start", type: "number", default: "0", description: "Start offset in pixels." },
      { name: "end", type: "number", description: "End offset in pixels." },
      { name: "placement", type: "GridraSnapGuidePlacement", description: "Grid-based placement { column, row, columnSpan, rowSpan }." },
      { name: "active", type: "boolean", default: "true", description: "Whether the guide is active. Inactive guides are not rendered." },
      { name: "visible", type: "boolean", default: "true", description: "Whether the guide is visible." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "orientation: vertical | horizontal",
      "position",
      "placement",
      "active",
      "visible",
      "GridraSnapGuides guides[] helper",
      "HTML div attributes"
    ],
    features: [
      "Can render from pixel coordinates.",
      "Can render from grid placement.",
      "GridraSnapGuides renders multiple guides without changing the single-guide primitive."
    ],
    examples: [
      {
        title: "Multiple guides",
        code: `<GridraSnapGuides
  guides={[
    { end: 72, orientation: "vertical", position: 48 },
    { end: 120, orientation: "horizontal", position: 36 }
  ]}
/>`
      }
    ],
    preview: (
      <div className="docs-guide-preview">
        <GridraSnapGuides
          guides={[
            { end: 72, orientation: "vertical", position: 48 },
            { end: 120, orientation: "horizontal", position: 36 }
          ]}
        />
      </div>
    )
  },
];
