import { GridraSlider, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const sliderDoc: ComponentDoc = {
  notes:
    "Behavior is provided by useGridraSlider from @gridra-ui/headless. Use the same state and semantic bindings with your own DOM and CSS. Gridra visual variants and theme integration remain in @gridra-ui/react.",
  category: "Controls",
  name: "GridraSlider",
  summary: "Range input for numeric values.",
  description:
    "GridraSlider wraps the native range input with Gridra styling. It supports size variants, optional value display, and a custom value formatter. Use defaultValue for an uncontrolled input, or value with onChange for controlled state. Read event.currentTarget.valueAsNumber in onChange; this component uses the native input event, not an onValueChange callback. Supply a label or aria-label.",
  importExample: 'import { GridraSlider } from "@gridra-ui/react";',
  props: [
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Track and thumb size.",
    },
    {
      name: "showValue",
      type: "boolean",
      default: "false",
      description: "Render a value readout next to the slider.",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => ReactNode",
      description: "Format function for the displayed value.",
    },
    {
      name: "onChange",
      type: "ChangeEventHandler<HTMLInputElement>",
      description:
        "Native input change event; use event.currentTarget.valueAsNumber for numeric state.",
    },
    {
      name: "min",
      type: "number | string",
      description: "Native range minimum.",
    },
    {
      name: "max",
      type: "number | string",
      description: "Native range maximum.",
    },
    {
      name: "step",
      type: "number | string",
      description: "Native range step.",
    },
    {
      name: "value",
      type: "string | number",
      description: "Controlled value.",
    },
    {
      name: "defaultValue",
      type: "string | number",
      description: "Uncontrolled default value.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes.",
    },
  ],
  options: [
    "min",
    "max",
    "step",
    "size: sm | md | lg",
    "showValue",
    "valueFormatter",
    "value / defaultValue",
    "All range input attributes except type",
  ],
  features: [
    "Uses native range behavior.",
    "Theme renders a square track and thumb.",
    "Can show a formatted current value.",
  ],
  examples: [
    {
      title: "Custom markup with headless hook",
      code: 'import { useGridraSlider } from "@gridra-ui/headless";\n\nexport default function Example() {\n  const slider=useGridraSlider({defaultValue:25,"aria-label":"Custom slider"});\n  return <section><input {...slider.inputProps}/><output>{slider.displayNumericValue}</output></section>;\n}',
    },
    ...([
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
/>`,
      },
    ] satisfies ComponentDoc["examples"]),
  ],
  preview: (
    <GridraStack gap="sm">
      <GridraSlider aria-label="Default" defaultValue="50" max={100} min={0} />
      <GridraSlider
        aria-label="Small"
        defaultValue="40"
        max={100}
        min={0}
        size="sm"
      />
      <GridraSlider
        aria-label="Large"
        defaultValue="60"
        max={100}
        min={0}
        size="lg"
      />
      <GridraSlider
        aria-label="With value"
        defaultValue="75"
        max={100}
        min={0}
        showValue
        valueFormatter={(value) => `${value}%`}
      />
    </GridraStack>
  ),
};
