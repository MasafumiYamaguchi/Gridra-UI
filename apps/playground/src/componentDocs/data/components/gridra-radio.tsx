import { GridraRadio } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const radioDoc: ComponentDoc = {
    category: "Controls",
    name: "GridraRadio",
    summary: "Radio control with optional inline label.",
    description:
      "GridraRadio wraps a native radio input with a custom circular mark, label, and description. It preserves native radio grouping semantics and supports size variants and invalid states.",
    importExample: 'import { GridraRadio } from "@gridra-ui/react";',
    props: [
      { name: "label", type: "string", description: "Label text shown next to the radio." },
      { name: "description", type: "ReactNode", description: "Descriptive helper text shown below the label." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Control and text size." },
      { name: "invalid", type: "boolean", default: "false", description: "Applies invalid styling." },
      { name: "checked", type: "boolean", description: "Controlled checked state." },
      { name: "defaultChecked", type: "boolean", description: "Uncontrolled default checked state." },
      { name: "name", type: "string", description: "Radio group name." },
      { name: "value", type: "string", description: "Radio value." },
      { name: "disabled", type: "boolean", description: "Native disabled attribute." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "label",
      "description",
      "size: sm | md | lg",
      "invalid",
      "checked / defaultChecked",
      "name",
      "value",
      "All radio input attributes except type"
    ],
    features: [
      "Keeps native radio grouping.",
      "Uses a custom circular mark.",
      "Can show descriptive helper text."
    ],
    examples: [
      {
        title: "Radio group",
        code: `<GridraRadio defaultChecked description="Dense controls" label="Compact" name="density" size="sm" />
<GridraRadio description="More breathing room" label="Comfort" name="density" size="lg" />`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraRadio defaultChecked description="Dense controls" label="Compact" name="docs-density" size="sm" />
        <GridraRadio description="More breathing room" label="Comfort" name="docs-density" size="lg" />
      </div>
    )
  };
