import { GridraTextarea } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const textareaDoc: ComponentDoc = {
    category: "Controls",
    name: "GridraTextarea",
    summary: "Multi-line text input for notes and longer properties.",
    description:
      "GridraTextarea is a styled native textarea with size variants and invalid states. It supports vertical resizing and shares the same border and focus styling as GridraInput.",
    importExample: 'import { GridraTextarea } from "@gridra-ui/react";',
    props: [
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Textarea min-height and font size." },
      { name: "invalid", type: "boolean", default: "false", description: "Applies invalid border styling." },
      { name: "value", type: "string", description: "Controlled value." },
      { name: "defaultValue", type: "string", description: "Uncontrolled default value." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["value / defaultValue", "size: sm | md | lg", "invalid", "aria-invalid", "All textarea attributes"],
    features: ["Supports vertical resizing.", "Uses the same invalid styling as input and select."],
    examples: [
      {
        title: "Textarea sizes",
        code: `<GridraTextarea aria-label="Notes" defaultValue="Small note" size="sm" />
<GridraTextarea aria-label="Notes" defaultValue="Default note" />
<GridraTextarea aria-label="Notes" defaultValue="Large note" size="lg" />`
      }
    ],
    preview: <GridraTextarea aria-label="Notes" defaultValue="Dense controls for node editing." invalid size="lg" />
  };
