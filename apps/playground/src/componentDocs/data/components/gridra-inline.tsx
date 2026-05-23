import { GridraBadge, GridraInline, GridraInlineItem } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const inlineDoc: ComponentDoc = {
    category: "Layout",
    name: "GridraInline",
    summary: "Inline-flex row layout for dense horizontal UI lines with separators and grow items.",
    description:
      "GridraInline is a horizontal-only layout primitive built on GridraBox with display=inline-flex. It is optimized for dense UI rows such as button groups, metadata lines, and label-action pairs. It supports gap, alignment, justification, and child separators. Use GridraInlineItem with grow to push content to the opposite side.",
    importExample: 'import { GridraInline, GridraInlineItem } from "@gridra-ui/react";',
    props: [
      { name: "as", type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "gap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", default: "\"sm\"", description: "Gap between children." },
      { name: "align", type: "\"start\" | \"center\" | \"end\" | \"stretch\" | \"baseline\"", default: "\"center\"", description: "Cross-axis alignment (align-items)." },
      { name: "justify", type: "\"start\" | \"center\" | \"end\" | \"between\"", default: "\"start\"", description: "Main-axis distribution (justify-content)." },
      { name: "separator", type: "ReactNode", description: "Element rendered between valid children only." },
      { name: "padding", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "paddingX", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "paddingY", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "surface", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Inherited from GridraBox." },
      { name: "border", type: "\"none\" | \"default\" | \"strong\"", description: "Inherited from GridraBox." },
      { name: "radius", type: "\"none\" | \"sm\" | \"md\"", description: "Inherited from GridraBox." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "fullHeight", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "scroll", type: "\"none\" | \"auto\" | \"x\" | \"y\"", description: "Inherited from GridraBox." },
      { name: "minWidthZero", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "minHeightZero", type: "boolean", default: "false", description: "Inherited from GridraBox." }
    ],
    options: [
      "as",
      "gap: none | xs | sm | md | lg",
      "align: start | center | end | stretch | baseline",
      "justify: start | center | end | between",
      "separator",
      "padding / paddingX / paddingY / surface / border / radius / scroll",
      "fullWidth / fullHeight / minWidthZero / minHeightZero",
      "HTML element attributes"
    ],
    features: [
      "Built on GridraBox with display inline-flex.",
      "Renders separators only between valid children.",
      "GridraInlineItem grow pushes items with flex: 1 1 auto.",
      "Inherits Box surface, padding, border, radius, and scroll tokens."
    ],
    examples: [
      {
        title: "Basic inline row",
        code: `<GridraInline gap="sm">
  <GridraBadge size="sm">A</GridraBadge>
  <GridraBadge size="sm">B</GridraBadge>
</GridraInline>`
      },
      {
        title: "With separator",
        code: `<GridraInline gap="md" separator={<span>|</span>}>
  <span>First</span>
  <span>Second</span>
  <span>Third</span>
</GridraInline>`
      },
      {
        title: "Push actions to the right",
        description: "Use GridraInlineItem grow to fill remaining space and push trailing items.",
        code: `<GridraInline gap="sm" fullWidth>
  <GridraBadge size="sm">Label</GridraBadge>
  <GridraInlineItem grow />
  <GridraBadge size="sm" tone="accent">Action</GridraBadge>
</GridraInline>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraInline gap="sm">
          <GridraBadge size="sm">A</GridraBadge>
          <GridraBadge size="sm">B</GridraBadge>
        </GridraInline>
        <GridraInline gap="md" separator={<span>|</span>}>
          <span>First</span>
          <span>Second</span>
          <span>Third</span>
        </GridraInline>
        <GridraInline gap="sm" fullWidth>
          <GridraBadge size="sm">Label</GridraBadge>
          <GridraInlineItem grow />
          <GridraBadge size="sm" tone="accent">Action</GridraBadge>
        </GridraInline>
      </div>
    )
  };
