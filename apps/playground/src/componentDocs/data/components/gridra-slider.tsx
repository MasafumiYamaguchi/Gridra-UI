import { GridraSlider, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const sliderDoc: ComponentDoc = {
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
  };
