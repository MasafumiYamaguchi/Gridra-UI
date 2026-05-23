import { GridraDragHandle, GridraNode, GridraResizeHandle } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const nodeDoc: ComponentDoc = {
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
  };
