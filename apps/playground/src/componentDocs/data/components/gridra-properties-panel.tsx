import { GridraPropertiesPanel, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const propertiesPanelDoc: ComponentDoc = {
    category: "Core",
    name: "GridraPropertiesPanel",
    summary: "Schema-driven properties panel for node-type-specific custom attributes.",
    description:
      "GridraPropertiesPanel is a controlled, canvas-agnostic panel for editing node-type-specific custom properties. The consumer provides a schema that declares fields per node type, the current value object, and receives partial patches via onChange. In v1 it supports text, number, select, and toggle fields. Unknown field kinds are skipped for forward compatibility.",
    importExample: 'import { GridraPropertiesPanel } from "@gridra-ui/react";',
    props: [
      { name: "selectedNodeId", type: "string | null", default: "null", description: "Id of the currently selected node." },
      { name: "selectedNodeType", type: "string | null", default: "null", description: "Type key used to look up the schema." },
      { name: "value", type: "GridraNodePropertiesValue", description: "Current property values for the selected node." },
      { name: "schema", type: "GridraNodePropertiesSchema", description: "Schema map of node type -> field definitions." },
      { name: "onChange", type: "(patch: GridraPropertiesPatch) => void", description: "Called with a partial update when any property changes." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables all controls and suppresses onChange." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "selectedNodeId",
      "selectedNodeType",
      "value",
      "schema",
      "onChange",
      "disabled",
      "HTML aside attributes"
    ],
    features: [
      "Schema-driven field rendering per node type.",
      "Emits partial patches so the parent normalizes and persists.",
      "Shows a built-in empty state when selection or schema is missing."
    ],
    examples: [
      {
        title: "Empty state",
        code: `<GridraPropertiesPanel />`
      },
      {
        title: "Editing properties for a transform node",
        code: `const schema = {
  transform: [
    { id: "mode", label: "Mode", kind: "select", options: [
      { value: "merge", label: "Merge" },
      { value: "replace", label: "Replace" }
    ]},
    { id: "intensity", label: "Intensity", kind: "number", min: 0, max: 100 }
  ]
};

<GridraPropertiesPanel
  selectedNodeId="node-1"
  selectedNodeType="transform"
  value={{ mode: "merge", intensity: 50 }}
  schema={schema}
  onChange={(patch) => setProperties((prev) => ({ ...prev, ...patch }))}
/>`
      }
    ],
    preview: (
      <GridraStack gap="sm">
        <GridraPropertiesPanel />
        <GridraPropertiesPanel
          schema={{
            transform: [
              { id: "mode", label: "Mode", kind: "select", options: [
                { value: "merge", label: "Merge" },
                { value: "replace", label: "Replace" }
              ]},
              { id: "intensity", label: "Intensity", kind: "number", min: 0, max: 100, step: 1 }
            ]
          }}
          selectedNodeId="preview-node"
          selectedNodeType="transform"
          value={{ mode: "merge", intensity: 50 }}
        />
      </GridraStack>
    )
  };
