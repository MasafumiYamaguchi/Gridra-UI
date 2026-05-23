import { GridraMinimap } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const minimapDoc: ComponentDoc = {
    category: "Core",
    name: "GridraMinimap",
    summary: "Compact minimap overlay for node placement overview and selection context.",
    description:
      "GridraMinimap renders a scaled overview of grid-based node placements. It highlights selected nodes and can display an optional viewport rectangle. In v1 it is visual-only and does not control canvas pan or zoom.",
    importExample: 'import { GridraMinimap } from "@gridra-ui/react";',
    props: [
      { name: "gridColumns", type: "number", default: "12", description: "Grid column count used to normalize node placement." },
      { name: "gridRows", type: "number", default: "6", description: "Grid row count used to normalize node placement." },
      { name: "nodes", type: "GridraMinimapNode[]", default: "[]", description: "Node placement data for minimap rectangles." },
      { name: "selectedIds", type: "GridraId[]", default: "[]", description: "Selected node ids for highlight styling." },
      { name: "viewport", type: "GridraMinimapViewport", description: "Optional viewport rectangle in grid coordinates." },
      { name: "showViewport", type: "boolean", default: "true", description: "Whether to render the viewport rectangle." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "gridColumns / gridRows",
      "nodes",
      "selectedIds",
      "viewport",
      "showViewport",
      "HTML div attributes"
    ],
    features: [
      "Renders node placements as scaled percentage rectangles.",
      "Highlights selected nodes.",
      "Supports optional viewport overlay."
    ],
    examples: [
      {
        title: "Minimap overview",
        code: `<GridraMinimap
  gridColumns={12}
  gridRows={6}
  nodes={[
    { id: "a", placement: { column: 2, row: 2, columnSpan: 4, rowSpan: 2 } },
    { id: "b", placement: { column: 8, row: 1, columnSpan: 3, rowSpan: 2 } }
  ]}
  selectedIds={["a"]}
  viewport={{ x: 1, y: 1, width: 6, height: 3 }}
/>`
      }
    ],
    preview: (
      <GridraMinimap
        gridColumns={12}
        gridRows={6}
        nodes={[
          { id: "a", placement: { column: 2, row: 2, columnSpan: 4, rowSpan: 2 } },
          { id: "b", placement: { column: 8, row: 1, columnSpan: 3, rowSpan: 2 } }
        ]}
        selectedIds={["a"]}
        viewport={{ x: 1, y: 1, width: 6, height: 3 }}
      />
    )
  };
