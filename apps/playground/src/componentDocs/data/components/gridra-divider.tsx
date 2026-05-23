import { GridraDivider } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const dividerDoc: ComponentDoc = {
    category: "Display",
    name: "GridraDivider",
    summary: "Horizontal or vertical separator.",
    description:
      "GridraDivider renders a styled hr element for separating content. It supports horizontal and vertical orientations, spacing tokens, inset mode, and visual strength tones.",
    importExample: 'import { GridraDivider } from "@gridra-ui/react";',
    props: [
      { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Layout direction." },
      { name: "tone", type: "\"default\" | \"strong\" | \"muted\"", default: "\"default\"", description: "Visual strength." },
      { name: "spacing", type: "\"none\" | \"sm\" | \"md\" | \"lg\"", default: "\"sm\"", description: "Margin around the divider." },
      { name: "inset", type: "boolean", default: "false", description: "Inset margin for a shorter divider." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "orientation: horizontal | vertical",
      "tone: default | strong | muted",
      "spacing: none | sm | md | lg",
      "inset",
      "HTML hr attributes"
    ],
    features: [
      "Sets role separator.",
      "Maps orientation to aria-orientation.",
      "Supports spacing, inset, and visual strength options."
    ],
    examples: [
      {
        title: "Horizontal dividers",
        code: `<GridraDivider spacing="none" tone="muted" />
<GridraDivider inset spacing="md" tone="strong" />`
      },
      {
        title: "Vertical divider",
        code: `<GridraDivider orientation="vertical" spacing="lg" />`
      }
    ],
    preview: (
      <div className="docs-divider-preview">
        <GridraDivider spacing="none" tone="muted" />
        <GridraDivider inset spacing="md" tone="strong" />
        <GridraDivider orientation="vertical" spacing="lg" />
      </div>
    )
  };
