import { GridraInput } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const inputDoc: ComponentDoc = {
  notes: "Behavior is provided by useControlDescriptionIds from @gridra-ui/headless. Use the same state and semantic bindings with your own DOM and CSS. Gridra visual variants and theme integration remain in @gridra-ui/react.",
    category: "Controls",
    name: "GridraInput",
    summary: "Text-like input styled with Gridra tokens.",
    description:
      "GridraInput is a wrapper around the native input element. It adds size variants, invalid styling, and maps the invalid prop to aria-invalid. Use the optional label for a simple labeled input; use GridraField when you also need hint/error content or horizontal field layout. All standard input attributes are forwarded.",
    importExample: 'import { GridraInput } from "@gridra-ui/react";',
    props: [
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Input height and font size." },
      { name: "invalid", type: "boolean", default: "false", description: "Applies invalid border styling and sets aria-invalid." },
      { name: "label", type: "ReactNode", description: "Optional visible label. The input is rendered inside GridraField when provided." },
      { name: "type", type: "string", default: "\"text\"", description: "Native input type." },
      { name: "value", type: "string", description: "Controlled value." },
      { name: "defaultValue", type: "string", description: "Uncontrolled default value." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["type", "size: sm | md | lg", "label", "invalid", "aria-invalid", "value / defaultValue", "All input attributes"],
    features: ["Defaults type to text.", "Invalid prop maps to aria-invalid unless explicitly overridden.", "Optional label is associated with the input automatically."],
    examples: [{ title: "Custom markup with headless hook", code: "import { useControlDescriptionIds } from \"@gridra-ui/headless\";\n\nexport default function Example() {\n  const {controlId}=useControlDescriptionIds(undefined,false);\n  return <section><label htmlFor={controlId}>Custom input</label><input id={controlId}/></section>;\n}" }, ...([
      {
        title: "Sizes",
        code: `<GridraInput aria-label="Small" defaultValue="Small" size="sm" />
<GridraInput aria-label="Default" defaultValue="Default" />
<GridraInput aria-label="Large" defaultValue="Large" size="lg" />`
      },
      {
        title: "Invalid state",
        code: `<GridraInput aria-label="Invalid" defaultValue="Invalid" invalid size="lg" />`
      },
      {
        title: "Labeled input",
        code: `<GridraInput label="Project name" placeholder="Untitled" />`
      }
    ] satisfies ComponentDoc["examples"])],
    preview: (
      <div className="docs-form-preview">
        <GridraInput aria-label="Small name" defaultValue="Small" size="sm" />
        <GridraInput aria-label="Invalid name" defaultValue="Invalid" invalid size="lg" />
      </div>
    )
  };
