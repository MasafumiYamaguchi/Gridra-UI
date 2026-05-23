import { GridraSelectableGrid, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const selectableGridDoc: ComponentDoc = {
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
      <GridraStack gap="sm">
        <GridraSelectableGrid
          columns={2}
          items={[
            { id: "a", label: "Input" },
            { id: "b", label: "Output" }
          ]}
        />
        <GridraSelectableGrid
          columns={2}
          items={[
            { id: "a", label: "Input" },
            { id: "b", label: "Output" }
          ]}
          selectedId="a"
        />
        <GridraSelectableGrid
          columns={3}
          items={[
            { id: "x", label: "A" },
            { id: "y", label: "B" },
            { id: "z", label: "C" }
          ]}
          selectedId="y"
        />
      </GridraStack>
    )
  };
