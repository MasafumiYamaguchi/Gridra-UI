import { GridraToolbar } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const toolbarDoc: ComponentDoc = {
  notes:
    "Behavior is provided by getGridraToolbar from @gridra-ui/headless. Use the same state and semantic bindings with your own DOM and CSS. Gridra visual variants and theme integration remain in @gridra-ui/react.",
  category: "Controls",
  name: "GridraToolbar",
  summary: "Toolbar with action metadata and optional custom action rendering.",
  description:
    "GridraToolbar renders a role=toolbar container with a set of actions. Each action is rendered as a GridraButton by default, but a custom renderAction callback can be provided.",
  importExample: 'import { GridraToolbar } from "@gridra-ui/react";',
  props: [
    {
      name: "actions",
      type: "GridraToolbarAction[]",
      default: "[]",
      description: "Array of actions with id, label, pressed, and disabled.",
    },
    {
      name: "onAction",
      type: "(id) => void",
      description: "Called when an action button is clicked.",
    },
    {
      name: "renderAction",
      type: "(action) => ReactNode",
      description: "Custom action renderer.",
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Additional toolbar content.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes.",
    },
  ],
  options: [
    "actions",
    "onAction",
    "renderAction",
    "children",
    "HTML div attributes",
  ],
  features: ["Sets role toolbar.", "Uses GridraButton for default actions."],
  examples: [
    {
      title: "Custom markup with headless hook",
      code: 'import { getGridraToolbar } from "@gridra-ui/headless";\nimport { useState } from "react";\n\nexport default function Example() {\n  const [last,setLast]=useState("None");\n  const toolbar=getGridraToolbar({actions:[{id:"save",label:"Save"}],onAction:setLast});\n  return <section><div {...toolbar.rootProps}><button {...toolbar.getActionProps("save")}>Custom save</button></div><output>{last}</output></section>;\n}',
    },
    ...([
      {
        title: "Action toolbar",
        code: `<GridraToolbar
  actions={[
    { id: "select", label: "Select", pressed: true },
    { id: "pan", label: "Pan" }
  ]}
/>`,
      },
    ] satisfies ComponentDoc["examples"]),
  ],
  preview: (
    <GridraToolbar
      actions={[
        { id: "select", label: "Select", pressed: true },
        { id: "pan", label: "Pan" },
      ]}
    />
  ),
};
