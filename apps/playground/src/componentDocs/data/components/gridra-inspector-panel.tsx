import { GridraInspectorPanel, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const inspectorPanelDoc: ComponentDoc = {
  notes:
    "Behavior is provided by useGridraInspectorPanel from @gridra-ui/headless. Use the same state and semantic bindings with your own DOM and CSS. Gridra visual variants and theme integration remain in @gridra-ui/react.",
  category: "Core",
  name: "GridraInspectorPanel",
  summary:
    "Controlled inspector for editing selected node label and placement.",
  description:
    "GridraInspectorPanel is a generic, canvas-agnostic side panel for editing a selected node's basic properties. In v1 it supports label and placement (x, y, w, h). It is fully controlled: the consumer provides the selectedNode value and receives partial patches via onChange. Empty state is built in when nothing is selected.",
  importExample: 'import { GridraInspectorPanel } from "@gridra-ui/react";',
  props: [
    {
      name: "selectedNode",
      type: "GridraInspectorValue | null",
      default: "null",
      description: "The currently selected node value to inspect and edit.",
    },
    {
      name: "onChange",
      type: "(patch: GridraInspectorPatch) => void",
      description: "Called with a partial update when any field changes.",
    },
    {
      name: "onCommit",
      type: "() => void",
      description:
        "Optional callback fired when the user presses Enter in the label field.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables all inputs and suppresses onChange.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes.",
    },
  ],
  options: [
    "selectedNode",
    "onChange",
    "onCommit",
    "disabled",
    "HTML aside attributes",
  ],
  features: [
    "Fully controlled and canvas-agnostic.",
    "Emits partial patches so the parent normalizes and persists.",
    "Shows a built-in empty state when selectedNode is null.",
  ],
  examples: [
    {
      title: "Custom markup with headless hook",
      code: 'import { useGridraInspectorPanel } from "@gridra-ui/headless";\nimport { useState } from "react";\n\nexport default function Example() {\n  const [node,setNode]=useState({id:"one",label:"Node",placement:{x:1,y:1,w:2,h:2}});\n  const inspector=useGridraInspectorPanel({selectedNode:node,onChange:patch=>setNode(previous=>({...previous,...patch,label:String(patch.label??previous.label),placement:{...previous.placement,...patch.placement}}))});\n  return <label>Custom node label<input value={node.label} onChange={event=>inspector.handleLabelChange(event.target.value)}/></label>;\n}',
    },
    ...([
      {
        title: "Empty state",
        code: `<GridraInspectorPanel />`,
      },
      {
        title: "Editing a selected node",
        code: `<GridraInspectorPanel
  selectedNode={{
    id: "a",
    label: "Node A",
    placement: { x: 1, y: 2, w: 3, h: 4 }
  }}
  onChange={(patch) => setNode((prev) => ({ ...prev, ...patch }))}
/>`,
      },
    ] satisfies ComponentDoc["examples"]),
  ],
  preview: (
    <GridraStack gap="sm">
      <GridraInspectorPanel />
      <GridraInspectorPanel
        selectedNode={{
          id: "preview-node",
          label: "Preview Node",
          placement: { x: 2, y: 3, w: 4, h: 5 },
        }}
      />
    </GridraStack>
  ),
};
