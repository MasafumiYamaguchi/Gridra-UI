import { GridraSpinner } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const spinnerDoc: ComponentDoc = {
    category: "Display",
    name: "GridraSpinner",
    summary: "Small loading indicator.",
    description:
      "GridraSpinner renders an animated spinning indicator. It supports preset and custom sizes, tone variants, and animation speeds. The label prop sets the accessible name via aria-label.",
    importExample: 'import { GridraSpinner } from "@gridra-ui/react";',
    props: [
      { name: "label", type: "string", default: '"Loading"', description: "Accessible status name (aria-label)." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\" | number | string", default: "\"md\"", description: "Preset size or custom CSS size value." },
      { name: "tone", type: "\"default\" | \"muted\" | \"accent\"", default: "\"default\"", description: "Color tone of the spinner track." },
      { name: "speed", type: "\"slow\" | \"normal\" | \"fast\"", default: "\"normal\"", description: "Animation duration." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "label",
      "size: sm | md | lg | number | string",
      "tone: default | muted | accent",
      "speed: slow | normal | fast",
      "HTML span attributes"
    ],
    features: [
      "Sets role status.",
      "Uses label as the accessible status name.",
      "Supports preset and custom CSS sizes.",
      "Supports muted/accent tone and animation speed changes."
    ],
    examples: [
      {
        title: "Sizes and tones",
        code: `<GridraSpinner label="Loading small" size="sm" tone="muted" />
<GridraSpinner label="Loading" />
<GridraSpinner label="Loading large" size="lg" speed="slow" tone="accent" />`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraSpinner label="Loading small" size="sm" tone="muted" />
        <GridraSpinner label="Loading" />
        <GridraSpinner label="Loading large" size="lg" speed="slow" tone="accent" />
        <GridraSpinner label="Loading custom" size={32} speed="fast" />
      </div>
    )
  };
