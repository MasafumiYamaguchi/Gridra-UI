import { GridraIconButton } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const iconButtonDoc: ComponentDoc = {
  notes:
    "Behavior is provided by getGridraIconButtonProps from @gridra-ui/headless. Use the same state and semantic bindings with your own DOM and CSS. Gridra visual variants and theme integration remain in @gridra-ui/react.",
  category: "Controls",
  name: "GridraIconButton",
  summary: "Square button for compact icon-only commands.",
  description:
    "GridraIconButton is a compact square button for icon-only actions. It requires an accessible label and supports the same variants and states as GridraButton. When loading, it shows a spinner instead of the icon.",
  importExample: 'import { GridraIconButton } from "@gridra-ui/react";',
  props: [
    {
      name: "label",
      type: "string",
      required: true,
      description: "Accessible label. Used as aria-label and title fallback.",
    },
    {
      name: "variant",
      type: '"default" | "primary" | "ghost"',
      default: '"default"',
      description: "Visual style variant.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Button size density.",
    },
    {
      name: "pressed",
      type: "boolean",
      description: "Toggle pressed visual state.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      description: "Shows a spinner and disables the button.",
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Icon content. Falls back to the first character of label.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes.",
    },
  ],
  options: [
    "label",
    "variant: default | primary | ghost",
    "size: sm | md | lg",
    "pressed",
    "loading",
    "title",
    "All button attributes",
  ],
  features: [
    "Requires an accessible label.",
    "Uses label as fallback title and fallback glyph.",
    "Loading state swaps the icon for a spinner and disables the button.",
  ],
  examples: [
    {
      title: "Custom markup with headless hook",
      code: 'import { getGridraIconButtonProps } from "@gridra-ui/headless";\n\nexport default function Example() {\n  return <button {...getGridraIconButtonProps({label:"Custom save"})}><span aria-hidden="true">✓</span></button>;\n}',
    },
    ...([
      {
        title: "Icon buttons",
        code: `<GridraIconButton label="Preview" pressed size="sm">P</GridraIconButton>
<GridraIconButton label="Add" variant="ghost">+</GridraIconButton>
<GridraIconButton label="Refresh" loading size="lg" />`,
      },
    ] satisfies ComponentDoc["examples"]),
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
  ),
};
