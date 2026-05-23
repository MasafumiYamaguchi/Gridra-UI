import { GridraSwitch } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const switchDoc: ComponentDoc = {
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
  };
