import { GridraSelect } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const selectDoc: ComponentDoc = {
    category: "Controls",
    name: "GridraSelect",
    summary: "Native select styled for dense panels.",
    description:
      "GridraSelect wraps the native select element with Gridra styling. It preserves native keyboard behavior and form integration while adding size variants and invalid states.",
    importExample: 'import { GridraSelect } from "@gridra-ui/react";',
    props: [
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Select height and font size." },
      { name: "invalid", type: "boolean", default: "false", description: "Applies invalid border styling and sets aria-invalid." },
      { name: "value", type: "string", description: "Controlled value." },
      { name: "defaultValue", type: "string", description: "Uncontrolled default value." },
      { name: "children", type: "ReactNode", description: "option elements." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["value / defaultValue", "children option elements", "size: sm | md | lg", "invalid", "aria-invalid", "All select attributes"],
    features: ["Keeps native keyboard and form behavior.", "Uses Gridra input border and focus styles."],
    examples: [
      {
        title: "Basic select",
        code: `<GridraSelect aria-label="Mode" defaultValue="select" size="sm">
  <option value="select">Select</option>
  <option value="pan">Pan</option>
</GridraSelect>`
      }
    ],
    preview: (
      <div className="docs-form-preview">
        <GridraSelect aria-label="Mode" defaultValue="select" size="sm">
          <option value="select">Select</option>
          <option value="pan">Pan</option>
        </GridraSelect>
        <GridraSelect aria-label="Invalid mode" defaultValue="inspect" invalid size="lg">
          <option value="inspect">Inspect</option>
          <option value="pan">Pan</option>
        </GridraSelect>
      </div>
    )
  };
