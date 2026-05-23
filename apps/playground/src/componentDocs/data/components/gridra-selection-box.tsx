import { GridraSelectionBox } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const selectionBoxDoc: ComponentDoc = {
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
  };
