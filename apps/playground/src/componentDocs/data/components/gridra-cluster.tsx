import { GridraBadge, GridraCluster } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const clusterDoc: ComponentDoc = {
    category: "Layout",
    name: "GridraCluster",
    summary: "Block flex wrapping layout for tag groups, action clusters, and filter rows.",
    description:
      "GridraCluster is a wrapping layout primitive built on GridraBox with display=flex and flex-wrap=wrap. It is the go-to component for tag clouds, mixed action groups, and filter rows that should naturally flow to multiple lines when space is tight. It supports independent rowGap for controlling vertical spacing between wrapped lines.",
    importExample: 'import { GridraCluster } from "@gridra-ui/react";',
    props: [
      { name: "as", type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "gap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", default: "\"sm\"", description: "Horizontal gap between children." },
      { name: "rowGap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Vertical gap between wrapped lines. Defaults to gap when unset." },
      { name: "align", type: "\"start\" | \"center\" | \"end\" | \"stretch\" | \"baseline\"", default: "\"center\"", description: "Cross-axis alignment (align-items)." },
      { name: "justify", type: "\"start\" | \"center\" | \"end\" | \"between\"", default: "\"start\"", description: "Main-axis distribution (justify-content)." },
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
      "rowGap: none | xs | sm | md | lg",
      "align: start | center | end | stretch | baseline",
      "justify: start | center | end | between",
      "padding / paddingX / paddingY / surface / border / radius / scroll",
      "fullWidth / fullHeight / minWidthZero / minHeightZero",
      "HTML element attributes"
    ],
    features: [
      "Built on GridraBox with display flex and flex-wrap: wrap.",
      "Supports independent rowGap for multi-line spacing.",
      "Inherits Box surface, padding, border, radius, and scroll tokens."
    ],
    examples: [
      {
        title: "Tag cluster",
        code: `<GridraCluster gap="xs">
  <GridraBadge size="sm">Tag A</GridraBadge>
  <GridraBadge size="sm">Tag B</GridraBadge>
  <GridraBadge size="sm">Tag C</GridraBadge>
</GridraCluster>`
      },
      {
        title: "Mixed actions with row gap",
        code: `<GridraCluster gap="sm" rowGap="md" justify="between">
  <GridraBadge size="sm">Filter</GridraBadge>
  <GridraBadge size="sm">Sort</GridraBadge>
  <GridraBadge size="sm">Export</GridraBadge>
</GridraCluster>`
      },
      {
        title: "Surface and padding",
        code: `<GridraCluster gap="sm" padding="md" surface="raised" border="default">
  <GridraBadge size="sm">One</GridraBadge>
  <GridraBadge size="sm">Two</GridraBadge>
</GridraCluster>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraCluster gap="xs">
          <GridraBadge size="sm">Tag A</GridraBadge>
          <GridraBadge size="sm">Tag B</GridraBadge>
          <GridraBadge size="sm">Tag C</GridraBadge>
        </GridraCluster>
        <GridraCluster gap="sm" padding="md" surface="raised" border="default">
          <GridraBadge size="sm">One</GridraBadge>
          <GridraBadge size="sm">Two</GridraBadge>
        </GridraCluster>
      </div>
    )
  };
