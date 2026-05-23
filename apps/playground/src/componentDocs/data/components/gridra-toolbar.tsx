import { GridraToolbar } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const toolbarDoc: ComponentDoc = {
    category: "Controls",
    name: "GridraToolbar",
    summary: "Toolbar with action metadata and optional custom action rendering.",
    description:
      "GridraToolbar renders a role=toolbar container with a set of actions. Each action is rendered as a GridraButton by default, but a custom renderAction callback can be provided.",
    importExample: 'import { GridraToolbar } from "@gridra-ui/react";',
    props: [
      { name: "actions", type: "GridraToolbarAction[]", default: "[]", description: "Array of actions with id, label, pressed, and disabled." },
      { name: "onAction", type: "(id) => void", description: "Called when an action button is clicked." },
      { name: "renderAction", type: "(action) => ReactNode", description: "Custom action renderer." },
      { name: "children", type: "ReactNode", description: "Additional toolbar content." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["actions", "onAction", "renderAction", "children", "HTML div attributes"],
    features: ["Sets role toolbar.", "Uses GridraButton for default actions."],
    examples: [
      {
        title: "Action toolbar",
        code: `<GridraToolbar
  actions={[
    { id: "select", label: "Select", pressed: true },
    { id: "pan", label: "Pan" }
  ]}
/>`
      }
    ],
    preview: <GridraToolbar actions={[{ id: "select", label: "Select", pressed: true }, { id: "pan", label: "Pan" }]} />
  };
