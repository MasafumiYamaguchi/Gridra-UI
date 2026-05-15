import {
  GridraButton,
  GridraCheckbox,
  GridraCluster,
  GridraField,
  GridraIconButton,
  GridraInline,
  GridraInput,
  GridraLabel,
  GridraRadio,
  GridraSelect,
  GridraSlider,
  GridraStack,
  GridraSwitch,
  GridraTextarea,
  GridraToolbar
} from "@gridra-ui/react";
import type { ComponentDoc } from "../types";
export const controlsDocs: ComponentDoc[] = [
  {
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
  },
  {
    category: "Controls",
    name: "GridraButton",
    summary: "Standard text button for dense UI commands.",
    description:
      "GridraButton is the primary action component. It supports multiple sizes, visual variants, loading state, and pressed state. The loading state automatically disables the button and renders a spinner.",
    importExample: 'import { GridraButton } from "@gridra-ui/react";',
    props: [
      { name: "variant", type: "\"default\" | \"primary\" | \"ghost\"", default: "\"default\"", description: "Visual style variant." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Button size density." },
      { name: "pressed", type: "boolean", description: "Toggle pressed visual state and aria-pressed." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and disables the button." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Makes the button fill its container width." },
      { name: "children", type: "ReactNode", description: "Button label." },
      { name: "className", type: "string", description: "Additional CSS classes." },
      { name: "disabled", type: "boolean", description: "Native disabled attribute." }
    ],
    options: [
      "variant: default | primary | ghost",
      "size: sm | md | lg",
      "pressed",
      "loading",
      "fullWidth",
      "All button attributes"
    ],
    features: [
      "Defaults type to button.",
      "Maps pressed state to aria-pressed.",
      "Loading state sets aria-busy and disables the button.",
      "Supports compact, default, and large command densities."
    ],
    examples: [
      {
        title: "Sizes",
        code: `<GridraButton size="sm">Small</GridraButton>
<GridraButton>Default</GridraButton>
<GridraButton size="lg">Large</GridraButton>`
      },
      {
        title: "Variants and states",
        code: `<GridraButton variant="primary">Primary</GridraButton>
<GridraButton variant="ghost">Ghost</GridraButton>
<GridraButton loading>Loading</GridraButton>
<GridraButton pressed>Pressed</GridraButton>`
      }
    ],
    preview: (
      <GridraCluster align="center" gap="sm" rowGap="sm">
        <GridraButton variant="primary">Primary</GridraButton>
        <GridraButton variant="default">Default</GridraButton>
        <GridraButton variant="ghost">Ghost</GridraButton>
        <GridraButton disabled>Disabled</GridraButton>
        <GridraButton size="sm">Small</GridraButton>
        <GridraButton size="lg">Large</GridraButton>
        <GridraButton loading>Loading</GridraButton>
      </GridraCluster>
    )
  },
  {
    category: "Controls",
    name: "GridraIconButton",
    summary: "Square button for compact icon-only commands.",
    description:
      "GridraIconButton is a compact square button for icon-only actions. It requires an accessible label and supports the same variants and states as GridraButton. When loading, it shows a spinner instead of the icon.",
    importExample: 'import { GridraIconButton } from "@gridra-ui/react";',
    props: [
      { name: "label", type: "string", required: true, description: "Accessible label. Used as aria-label and title fallback." },
      { name: "variant", type: "\"default\" | \"primary\" | \"ghost\"", default: "\"default\"", description: "Visual style variant." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Button size density." },
      { name: "pressed", type: "boolean", description: "Toggle pressed visual state." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and disables the button." },
      { name: "children", type: "ReactNode", description: "Icon content. Falls back to the first character of label." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "label",
      "variant: default | primary | ghost",
      "size: sm | md | lg",
      "pressed",
      "loading",
      "title",
      "All button attributes"
    ],
    features: [
      "Requires an accessible label.",
      "Uses label as fallback title and fallback glyph.",
      "Loading state swaps the icon for a spinner and disables the button."
    ],
    examples: [
      {
        title: "Icon buttons",
        code: `<GridraIconButton label="Preview" pressed size="sm">P</GridraIconButton>
<GridraIconButton label="Add" variant="ghost">+</GridraIconButton>
<GridraIconButton label="Refresh" loading size="lg" />`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraIconButton label="Preview" pressed size="sm">
          P
        </GridraIconButton>
        <GridraIconButton label="Add" variant="ghost">
          +
        </GridraIconButton>
        <GridraIconButton label="Refresh" loading size="lg" />
      </div>
    )
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    category: "Controls",
    name: "GridraSwitch",
    summary: "Button-based switch for binary settings.",
    description:
      "GridraSwitch is a button with role=switch for binary on/off settings. It supports controlled and uncontrolled modes via checked and onCheckedChange, and renders a track/thumb visual.",
    importExample: 'import { GridraSwitch } from "@gridra-ui/react";',
    props: [
      { name: "checked", type: "boolean", default: "false", description: "Controlled checked state." },
      { name: "onCheckedChange", type: "(checked) => void", description: "Called when the switch is toggled." },
      { name: "label", type: "string", description: "Label text shown next to the switch." },
      { name: "description", type: "ReactNode", description: "Descriptive helper text." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Control and text size." },
      { name: "invalid", type: "boolean", default: "false", description: "Applies invalid styling." },
      { name: "disabled", type: "boolean", description: "Native disabled attribute." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "checked",
      "label",
      "description",
      "size: sm | md | lg",
      "invalid",
      "onCheckedChange",
      "disabled",
      "All button attributes except role"
    ],
    features: [
      "Sets role switch.",
      "Maps checked to aria-checked.",
      "Reports the next checked value through onCheckedChange."
    ],
    examples: [
      {
        title: "Switch with label",
        code: `<GridraSwitch
  checked
  description="Shows live editor state"
  label="Preview"
  size="lg"
/>`
      }
    ],
    preview: <GridraSwitch checked description="Shows live editor state" label="Preview" size="lg" />
  },
  {
    category: "Controls",
    name: "GridraSlider",
    summary: "Range input for numeric values.",
    description:
      "GridraSlider wraps the native range input with Gridra styling. It supports size variants, optional value display, and a custom value formatter.",
    importExample: 'import { GridraSlider } from "@gridra-ui/react";',
    props: [
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Track and thumb size." },
      { name: "showValue", type: "boolean", default: "false", description: "Render a value readout next to the slider." },
      { name: "valueFormatter", type: "(value: number) => ReactNode", description: "Format function for the displayed value." },
      { name: "min", type: "number", description: "Native range minimum." },
      { name: "max", type: "number", description: "Native range maximum." },
      { name: "step", type: "number", description: "Native range step." },
      { name: "value", type: "string | number", description: "Controlled value." },
      { name: "defaultValue", type: "string | number", description: "Uncontrolled default value." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "min",
      "max",
      "step",
      "size: sm | md | lg",
      "showValue",
      "valueFormatter",
      "value / defaultValue",
      "All range input attributes except type"
    ],
    features: [
      "Uses native range behavior.",
      "Theme renders a square track and thumb.",
      "Can show a formatted current value."
    ],
    examples: [
      {
        title: "Slider with value",
        code: `<GridraSlider
  aria-label="Opacity"
  defaultValue="72"
  max={100}
  min={0}
  showValue
  size="lg"
  valueFormatter={(value) => \`\${value}%\`}
/>`
      }
    ],
    preview: (
      <GridraStack gap="sm">
        <GridraSlider aria-label="Default" defaultValue="50" max={100} min={0} />
        <GridraSlider aria-label="Small" defaultValue="40" max={100} min={0} size="sm" />
        <GridraSlider aria-label="Large" defaultValue="60" max={100} min={0} size="lg" />
        <GridraSlider aria-label="With value" defaultValue="75" max={100} min={0} showValue valueFormatter={(value) => `${value}%`} />
      </GridraStack>
    )
  },
];
