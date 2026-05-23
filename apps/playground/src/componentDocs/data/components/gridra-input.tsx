import { GridraInput } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const inputDoc: ComponentDoc = {
    category: "Controls",
    name: "GridraInput",
    summary: "Text-like input styled with Gridra tokens.",
    description:
      "GridraInput is a thin wrapper around the native input element. It adds size variants, invalid styling, and maps the invalid prop to aria-invalid. All standard input attributes are forwarded.",
    importExample: 'import { GridraInput } from "@gridra-ui/react";',
    props: [
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Input height and font size." },
      { name: "invalid", type: "boolean", default: "false", description: "Applies invalid border styling and sets aria-invalid." },
      { name: "type", type: "string", default: "\"text\"", description: "Native input type." },
      { name: "value", type: "string", description: "Controlled value." },
      { name: "defaultValue", type: "string", description: "Uncontrolled default value." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["type", "size: sm | md | lg", "invalid", "aria-invalid", "value / defaultValue", "All input attributes"],
    features: ["Defaults type to text.", "Invalid prop maps to aria-invalid unless explicitly overridden."],
    examples: [
      {
        title: "Sizes",
        code: `<GridraInput aria-label="Small" defaultValue="Small" size="sm" />
<GridraInput aria-label="Default" defaultValue="Default" />
<GridraInput aria-label="Large" defaultValue="Large" size="lg" />`
      },
      {
        title: "Invalid state",
        code: `<GridraInput aria-label="Invalid" defaultValue="Invalid" invalid size="lg" />`
      }
    ],
    preview: (
      <div className="docs-form-preview">
        <GridraInput aria-label="Small name" defaultValue="Small" size="sm" />
        <GridraInput aria-label="Invalid name" defaultValue="Invalid" invalid size="lg" />
      </div>
    )
  };
