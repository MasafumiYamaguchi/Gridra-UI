import { GridraCheckbox } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const checkboxDoc: ComponentDoc = {
    category: "Controls",
    name: "GridraCheckbox",
    summary: "Checkbox with optional inline label.",
    description:
      "GridraCheckbox wraps a native checkbox input with a custom square mark, label, and description. It preserves native form semantics and supports size variants and invalid states.",
    importExample: 'import { GridraCheckbox } from "@gridra-ui/react";',
    props: [
      { name: "label", type: "string", description: "Label text shown next to the checkbox." },
      { name: "description", type: "ReactNode", description: "Descriptive helper text shown below the label." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Control and text size." },
      { name: "invalid", type: "boolean", default: "false", description: "Applies invalid styling." },
      { name: "checked", type: "boolean", description: "Controlled checked state." },
      { name: "defaultChecked", type: "boolean", description: "Uncontrolled default checked state." },
      { name: "disabled", type: "boolean", description: "Native disabled attribute." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "label",
      "description",
      "size: sm | md | lg",
      "invalid",
      "checked / defaultChecked",
      "disabled",
      "All checkbox input attributes except type"
    ],
    features: [
      "Keeps native checkbox semantics.",
      "Uses a custom square mark.",
      "Can show descriptive helper text."
    ],
    examples: [
      {
        title: "With label and description",
        code: `<GridraCheckbox
  defaultChecked
  description="Aligns nodes to the grid"
  label="Snap"
  size="lg"
/>`
      }
    ],
    preview: <GridraCheckbox defaultChecked description="Aligns nodes to the grid" label="Snap" size="lg" />
  };
