import { GridraField, GridraInput, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const fieldDoc: ComponentDoc = {
    category: "Controls",
    name: "GridraField",
    summary: "Label, control, hint, and error wrapper.",
    description:
      "GridraField wraps a form control with a label, hint, and error message. It supports vertical and horizontal orientations, required/disabled styling, and exposes hint/error ids for accessibility wiring.",
    importExample: 'import { GridraField } from "@gridra-ui/react";',
    props: [
      { name: "label", type: "ReactNode", required: true, description: "Field label text." },
      { name: "htmlFor", type: "string", description: "ID of the associated form control." },
      { name: "hint", type: "ReactNode", description: "Helper text shown below the control." },
      { name: "hintId", type: "string", description: "ID for the hint element (for aria-describedby)." },
      { name: "error", type: "ReactNode", description: "Error message. Replaces hint when present." },
      { name: "errorId", type: "string", description: "ID for the error element (for aria-describedby)." },
      { name: "required", type: "boolean", default: "false", description: "Adds a required indicator." },
      { name: "disabled", type: "boolean", default: "false", description: "Applies disabled styling." },
      { name: "orientation", type: "\"vertical\" | \"horizontal\"", default: "\"vertical\"", description: "Layout direction." },
      { name: "children", type: "ReactNode", description: "The form control." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "label",
      "htmlFor",
      "hint / hintId",
      "error / errorId",
      "required",
      "disabled",
      "orientation: vertical | horizontal",
      "children",
      "HTML div attributes"
    ],
    features: [
      "Associates label with a control.",
      "Shows error instead of hint when both are present.",
      "Can expose hint and error ids for aria-describedby wiring.",
      "Supports required, disabled, and horizontal layout styling."
    ],
    examples: [
      {
        title: "Vertical field with hint",
        code: `<GridraField hint="1 to 24" htmlFor="columns" label="Columns" required>
  <GridraInput id="columns" defaultValue="12" size="sm" />
</GridraField>`
      },
      {
        title: "Horizontal field with error",
        code: `<GridraField error="Required" htmlFor="name" label="Name">
  <GridraInput id="name" invalid />
</GridraField>`
      }
    ],
    preview: (
      <GridraStack gap="sm">
        <GridraField hint="Normal hint text" htmlFor="docs-field-normal" label="Normal">
          <GridraInput id="docs-field-normal" defaultValue="Value" size="sm" />
        </GridraField>
        <GridraField error="Invalid value" htmlFor="docs-field-invalid" label="Invalid">
          <GridraInput id="docs-field-invalid" invalid size="sm" />
        </GridraField>
        <GridraField htmlFor="docs-field-disabled" label="Disabled">
          <GridraInput id="docs-field-disabled" defaultValue="Read only" disabled size="sm" />
        </GridraField>
        <GridraField htmlFor="docs-field-required" label="Required" required>
          <GridraInput id="docs-field-required" size="sm" />
        </GridraField>
      </GridraStack>
    )
  };
