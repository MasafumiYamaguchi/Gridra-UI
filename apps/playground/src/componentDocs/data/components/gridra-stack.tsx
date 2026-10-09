import { GridraBadge, GridraStack, GridraStackItem } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const stackDoc: ComponentDoc = {
    category: "Layout",
    name: "GridraStack",
    summary: "Flex-based layout primitive for vertical and horizontal stacking with alignment.",
    description:
      "GridraStack builds on GridraBox with display=flex and adds direction, alignment, justification, and wrapping. Use it for columns, rows, wrapping groups, and inline rows. It replaces GridraInline and GridraCluster; the old components and their types have been removed. All Box props like padding, surface, and border are inherited.",
    importExample: 'import { GridraStack } from "@gridra-ui/react";',
    props: [
      { name: "inline", type: "boolean", default: "false", description: "Use inline-flex instead of flex. Set direction separately." },
      { name: "rowGap", type: "GridraStackGap", description: "Independent CSS row-gap, useful for wrapped horizontal rows." },
      { name: "separator", type: "ReactNode", description: "Render between non-empty direct children; fragments are not expanded." },
      { name: "as", type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "direction", type: "\"vertical\" | \"horizontal\"", default: "\"vertical\"", description: "Main axis direction." },
      { name: "gap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Gap between children." },
      { name: "align", type: "\"start\" | \"center\" | \"end\" | \"stretch\" | \"baseline\"", default: "\"stretch\"", description: "Cross-axis alignment (align-items)." },
      { name: "justify", type: "\"start\" | \"center\" | \"end\" | \"between\"", default: "\"start\"", description: "Main-axis distribution (justify-content)." },
      { name: "wrap", type: "boolean", default: "false", description: "Allow children to wrap to multiple lines." },
      { name: "reverse", type: "boolean", default: "false", description: "Reverse the order of children along the main axis." },
      { name: "padding", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "surface", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Inherited from GridraBox." },
      { name: "border", type: "\"none\" | \"default\" | \"strong\"", description: "Inherited from GridraBox." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "fullHeight", type: "boolean", default: "false", description: "Inherited from GridraBox." }
    ],
    options: [
      "inline / rowGap / separator",
      "as",
      "direction: vertical | horizontal",
      "gap: none | xs | sm | md | lg",
      "align: start | center | end | stretch | baseline",
      "justify: start | center | end | between",
      "wrap",
      "reverse",
      "padding / paddingX / paddingY / surface / border / radius / scroll",
      "fullWidth / fullHeight / minWidthZero / minHeightZero",
      "HTML element attributes"
    ],
    features: [
      "Built on GridraBox with display flex.",
      "Supports direction, alignment, justification, and wrapping.",
      "Inherits Box surface, padding, border, radius, and scroll tokens."
    ],
    examples: [
      {
        title: "Wrapping group (formerly Cluster)",
        code: `<GridraStack direction="horizontal" wrap align="center" gap="sm" rowGap="md">
  <GridraBadge>One</GridraBadge>
  <GridraBadge>Two</GridraBadge>
</GridraStack>`
      },
      {
        title: "Inline separators (formerly Inline)",
        code: `<GridraStack direction="horizontal" inline align="center" gap="sm" separator="/">
  <span>First</span>
  <span>Second</span>
</GridraStack>`
      },
      {
        title: "Trailing action",
        description: "grow and justify=between need available width. Set fullWidth or constrain the parent.",
        code: `<GridraStack direction="horizontal" inline align="center" gap="sm" fullWidth>
  <span>Label</span>
  <GridraStackItem grow />
  <GridraBadge>Action</GridraBadge>
</GridraStack>`
      },
      {
        title: "Vertical stack",
        code: `<GridraStack gap="sm" padding="sm" surface="raised" border="default">
  <GridraBadge size="sm">One</GridraBadge>
  <GridraBadge size="sm">Two</GridraBadge>
</GridraStack>`
      },
      {
        title: "Horizontal with justify between",
        code: `<GridraStack direction="horizontal" gap="md" justify="between" padding="sm" surface="input">
  <GridraBadge size="sm">Left</GridraBadge>
  <GridraBadge size="sm">Right</GridraBadge>
</GridraStack>`
      },
      {
        title: "Centered alignment",
        code: `<GridraStack align="center" justify="center" fullHeight>
  <GridraBadge>Centered</GridraBadge>
</GridraStack>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraStack direction="horizontal" wrap align="center" gap="sm" rowGap="md">
          <GridraBadge>Wrapping</GridraBadge><GridraBadge>Group</GridraBadge>
        </GridraStack>
        <GridraStack direction="horizontal" inline align="center" gap="sm" separator="/">
          <span>First</span><span>Second</span>
        </GridraStack>
        <GridraStack direction="horizontal" inline align="center" gap="sm" fullWidth>
          <span>Label</span><GridraStackItem grow /><GridraBadge>Action</GridraBadge>
        </GridraStack>
        <GridraStack border="default" gap="sm" padding="sm" surface="raised">
          <GridraBadge size="sm">One</GridraBadge>
          <GridraBadge size="sm">Two</GridraBadge>
        </GridraStack>
        <GridraStack direction="horizontal" gap="md" justify="between" padding="sm" surface="input" wrap>
          <GridraBadge size="sm">A</GridraBadge>
          <GridraBadge size="sm">B</GridraBadge>
        </GridraStack>
      </div>
    )
  };
