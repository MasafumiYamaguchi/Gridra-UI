import { GridraIconButton } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const iconButtonDoc: ComponentDoc = {
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
  };
