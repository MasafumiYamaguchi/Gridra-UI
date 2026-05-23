import { GridraButton, GridraCluster } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const buttonDoc: ComponentDoc = {
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
  };
